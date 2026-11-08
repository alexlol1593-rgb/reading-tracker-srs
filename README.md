# Трекер чтения

## Описание проекта

«Трекер чтения» — приложение для ведения персонального списка книг.

Приложение позволяет пользователю добавлять книги в список, отслеживать статус чтения, фиксировать прогресс по текущей книге, оставлять рецензии, искать и фильтровать книги.

## Основные возможности

- добавление книг;
- редактирование информации о книгах;
- удаление книг;
- изменение статуса чтения;
- отслеживание прогресса чтения (страницы/процент);
- добавление и редактирование рецензий;
- поиск книг по названию или автору;
- фильтрация по статусу чтения;
- сортировка книг;
- автоматическое сохранение данных.

## Статусы чтения

Приложение поддерживает следующие статусы:

- Запланировано
- Читаю
- Прочитано
- Брошено

## Документация

Полное техническое задание проекта находится в разделе Wiki:

[Техническое задание](https://github.com/alexlol1593-rgb/reading-tracker-srs/wiki/Техническое-задание)

## Управление требованиями

Детализация требований и критерии приёмки представлены в разделе Issues.

## Вариант

№7 — Трекер чтения: список книг к прочтению, отслеживание прогресса по текущей книге, рецензии.

<!-- LAB2-PLAN-LINKS:START -->
## План проекта (лабораторная работа №2)

- [План проекта в Wiki](https://github.com/alexlol1593-rgb/reading-tracker-srs/wiki/%D0%9F%D0%BB%D0%B0%D0%BD-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0)
- [Диаграмма Ганта (GitHub Project)](https://github.com/users/alexlol1593-rgb/projects/1/views/2)
<!-- LAB2-PLAN-LINKS:END -->

<!-- LAB3-APP-LINKS:START -->
## Приложение (лабораторная работа №3)

Прототип реализован на HTML/CSS/JS. Запуск: откройте `index.html` в браузере.

- Исходный код: `index.html`, `style.css`, `script.js`
- [Релиз v1.0.0](https://github.com/alexlol1593-rgb/reading-tracker-srs/releases/tag/v1.0.0)
- [Процесс разработки (Wiki)](https://github.com/alexlol1593-rgb/reading-tracker-srs/wiki/Процесс-разработки)
- [Pull Requests](https://github.com/alexlol1593-rgb/reading-tracker-srs/pulls?q=is%3Apr+is%3Aclosed)
<!-- LAB3-APP-LINKS:END -->

<!-- LAB4-DB:START -->
## База данных (лабораторная работа №4)

Спроектирована нормализованная схема БД до 3NF для SQLite.

- [ER-диаграмма (PNG)](docs/database/er_diagram.png) / [SVG](docs/database/er_diagram.svg)
- [DDL-схема](database/schema.sql)
- [Тестовые данные](database/seed_data.sql)
- [Процесс нормализации](database/normalization.md)
- [Wiki: normalization](https://github.com/alexlol1593-rgb/reading-tracker-srs/wiki/normalization)
<!-- LAB4-DB:END -->
