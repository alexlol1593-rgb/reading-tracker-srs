'use strict';

const STORAGE_KEY = 'reading-tracker-books';
const STATUSES = ['Запланировано', 'Читаю', 'Прочитано', 'Брошено'];

let books = loadBooks();

function loadBooks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function showMessage(text, type) {
    const box = document.getElementById('message');
    box.textContent = text;
    box.className = 'message ' + type;
    box.hidden = false;
    setTimeout(() => { box.hidden = true; }, 3000);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function addBook(title, author, totalPages) {
    title = title.trim();
    author = author.trim();
    totalPages = Number(totalPages);

    if (!title || !author) {
        showMessage('Укажите название и автора книги.', 'error');
        return false;
    }
    if (!Number.isInteger(totalPages) || totalPages <= 0) {
        showMessage('Количество страниц должно быть целым числом больше 0.', 'error');
        return false;
    }

    books.push({
        id: Date.now(),
        title: title,
        author: author,
        totalPages: totalPages,
        status: 'Запланировано',
        currentPage: 0,
        review: '',
        rating: null
    });
    saveBooks();
    renderBooks();
    showMessage('Книга добавлена.', 'success');
    return true;
}

function statusClass(status) {
    if (status === 'Читаю') return 'reading';
    if (status === 'Прочитано') return 'done';
    if (status === 'Брошено') return 'dropped';
    return 'planned';
}

function changeStatus(id, status) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    book.status = status;
    if (status === 'Прочитано') book.currentPage = book.totalPages;
    saveBooks();
    renderBooks();
}

function progressPercent(book) {
    return Math.round((book.currentPage / book.totalPages) * 100);
}

function updateProgress(id, value) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    const page = Number(value);
    if (!Number.isInteger(page) || page < 0 || page > book.totalPages) {
        showMessage('Страница должна быть целым числом от 0 до ' + book.totalPages + '.', 'error');
        renderBooks();
        return;
    }
    book.currentPage = page;
    saveBooks();
    renderBooks();
}

function saveReview(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    const text = document.getElementById('review-' + id).value.trim();
    const ratingVal = document.getElementById('rating-' + id).value;
    book.review = text;
    book.rating = ratingVal ? Number(ratingVal) : null;
    saveBooks();
    renderBooks();
    showMessage('Рецензия сохранена.', 'success');
}

function deleteReview(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    book.review = '';
    book.rating = null;
    saveBooks();
    renderBooks();
}

function deleteBook(id) {
    if (!confirm('Удалить эту книгу из списка?')) return;
    books = books.filter(b => b.id !== id);
    saveBooks();
    renderBooks();
}

function renderBooks() {
    const list = document.getElementById('bookList');
    if (books.length === 0) {
        list.innerHTML = '<p class="empty">Список пуст. Добавьте первую книгу!</p>';
        return;
    }
    list.innerHTML = books.map(book => `
        <div class="book-card" data-id="${book.id}">
            <h3>${escapeHtml(book.title)}</h3>
            <p class="author">${escapeHtml(book.author)} · ${book.totalPages} стр.</p>
            <div class="book-meta">
                <span class="status-badge ${statusClass(book.status)}">${book.status}</span>
                <select onchange="changeStatus(${book.id}, this.value)">
                    ${STATUSES.map(s => `<option value="${s}" ${s === book.status ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
                <button class="delete-btn" onclick="deleteBook(${book.id})">Удалить</button>
            </div>
            ${book.status === 'Читаю' ? `
            <div class="progress-section">
                <label>Текущая страница:
                    <input type="number" min="0" max="${book.totalPages}" value="${book.currentPage}"
                        onchange="updateProgress(${book.id}, this.value)"> из ${book.totalPages}
                </label>
                <div class="progress-bar"><div class="progress-fill" style="width:${progressPercent(book)}%"></div></div>
                <span class="progress-text">${progressPercent(book)}% · осталось ${book.totalPages - book.currentPage} стр.</span>
            </div>` : ''}
            <details class="book-details">
                <summary>Подробнее / рецензия</summary>
                <div class="review-section">
                    ${book.review ? `
                    <div class="review-display">
                        <strong>Рецензия:</strong>
                        <p>${escapeHtml(book.review)}</p>
                        ${book.rating ? `<span class="rating">Оценка: ${book.rating}/5</span>` : ''}
                        <button class="delete-btn" onclick="deleteReview(${book.id})">Удалить рецензию</button>
                    </div>` : ''}
                    <textarea id="review-${book.id}" placeholder="Ваша рецензия...">${escapeHtml(book.review)}</textarea>
                    <label>Оценка:
                        <select id="rating-${book.id}">
                            <option value="">Без оценки</option>
                            ${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${book.rating === n ? 'selected' : ''}>${n}</option>`).join('')}
                        </select>
                    </label>
                    <button onclick="saveReview(${book.id})">Сохранить рецензию</button>
                </div>
            </details>
        </div>
    `).join('');
}

document.getElementById('bookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = addBook(
        document.getElementById('titleInput').value,
        document.getElementById('authorInput').value,
        document.getElementById('pagesInput').value
    );
    if (ok) this.reset();
});

renderBooks();
