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
                <span class="status-badge">${book.status}</span>
                <button class="delete-btn" onclick="deleteBook(${book.id})">Удалить</button>
            </div>
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
