-- =====================================================================
-- Трекер чтения: нормализованная схема БД до 3NF (SQLite)
-- Лабораторная работа №4.
-- Скрипт идемпотентен: сначала удаляет старые таблицы, затем создаёт схему.
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- Очистка (в порядке, обратном зависимостям внешних ключей)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS user_books;
DROP TABLE IF EXISTS book_authors;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS reading_statuses;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- Пользователи
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT NOT NULL UNIQUE CHECK (length(trim(username)) > 0),
    email      TEXT NOT NULL UNIQUE CHECK (instr(email, '@') > 1),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------
-- Авторы (вынесены отдельно, чтобы не дублировать имя в каждой книге)
-- ---------------------------------------------------------------------
CREATE TABLE authors (
    author_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------
-- Справочник статусов чтения
-- ---------------------------------------------------------------------
CREATE TABLE reading_statuses (
    status_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code      TEXT NOT NULL UNIQUE CHECK (code IN ('planned', 'reading', 'finished', 'dropped')),
    name      TEXT NOT NULL UNIQUE
);

-- ---------------------------------------------------------------------
-- Книги (каталог: общие сведения о книге)
-- ---------------------------------------------------------------------
CREATE TABLE books (
    book_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL CHECK (length(trim(title)) > 0),
    total_pages INTEGER NOT NULL CHECK (total_pages > 0),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------
-- Связь M:N между книгами и авторами
-- ---------------------------------------------------------------------
CREATE TABLE book_authors (
    book_id   INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id)   REFERENCES books (book_id)     ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors (author_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Запись списка чтения: прогресс конкретного пользователя по книге
-- ---------------------------------------------------------------------
CREATE TABLE user_books (
    user_id      INTEGER NOT NULL,
    book_id      INTEGER NOT NULL,
    status_id    INTEGER NOT NULL,
    current_page INTEGER NOT NULL DEFAULT 0 CHECK (current_page >= 0),
    added_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id)   REFERENCES users (user_id)               ON DELETE CASCADE,
    FOREIGN KEY (book_id)   REFERENCES books (book_id)               ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES reading_statuses (status_id)  ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Рецензии: одна рецензия пользователя на книгу
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
    user_id     INTEGER NOT NULL,
    book_id     INTEGER NOT NULL,
    rating      INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL CHECK (length(trim(review_text)) > 0),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id, book_id) REFERENCES user_books (user_id, book_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Триггеры целостности прогресса
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_user_books_current_page_insert
BEFORE INSERT ON user_books
FOR EACH ROW
WHEN NEW.current_page > (SELECT total_pages FROM books WHERE book_id = NEW.book_id)
BEGIN
    SELECT RAISE(ABORT, 'current_page cannot exceed total_pages');
END;

CREATE TRIGGER trg_user_books_current_page_update
BEFORE UPDATE OF current_page, book_id ON user_books
FOR EACH ROW
WHEN NEW.current_page > (SELECT total_pages FROM books WHERE book_id = NEW.book_id)
BEGIN
    SELECT RAISE(ABORT, 'current_page cannot exceed total_pages');
END;

CREATE TRIGGER trg_books_total_pages_update
BEFORE UPDATE OF total_pages ON books
FOR EACH ROW
WHEN NEW.total_pages < COALESCE((SELECT MAX(current_page) FROM user_books WHERE book_id = NEW.book_id), 0)
BEGIN
    SELECT RAISE(ABORT, 'total_pages cannot be less than existing reading progress');
END;

-- ---------------------------------------------------------------------
-- Индексы для оптимизации запросов
-- ---------------------------------------------------------------------
CREATE INDEX idx_user_books_user_id   ON user_books (user_id);
CREATE INDEX idx_user_books_book_id   ON user_books (book_id);
CREATE INDEX idx_user_books_status_id ON user_books (status_id);
CREATE INDEX idx_books_title          ON books (title);
CREATE INDEX idx_authors_name         ON authors (name);
CREATE INDEX idx_book_authors_author  ON book_authors (author_id);
CREATE INDEX idx_reviews_book_id      ON reviews (book_id);
