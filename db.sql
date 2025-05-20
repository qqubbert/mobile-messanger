-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,            -- Уникальный идентификатор
    username VARCHAR(255) NOT NULL,    -- Имя пользователя
    email VARCHAR(255) UNIQUE NOT NULL, -- Электронная почта (уникальная)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Время создания
);

-- Создание таблицы чатов
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,             -- Уникальный идентификатор
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Время создания чата
);

-- Создание таблицы сообщений
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,             -- Уникальный идентификатор
    chat_id INT NOT NULL REFERENCES chats(id) ON DELETE CASCADE, -- Идентификатор чата
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Идентификатор пользователя
    content TEXT NOT NULL,             -- Текст сообщения
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Время отправки сообщения
);

-- Создание таблицы участников чатов
CREATE TABLE chat_participants (
    id SERIAL PRIMARY KEY,             -- Уникальный идентификатор для записи
    chat_id INT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,  -- Идентификатор чата
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Идентификатор пользователя
    UNIQUE (chat_id, user_id)  -- Уникальная пара чат-пользователь
);

-- Индекс для быстрого поиска сообщений по чату
CREATE INDEX idx_messages_chat_id ON messages(chat_id);

-- Индекс для быстрого поиска сообщений по пользователю
CREATE INDEX idx_messages_user_id ON messages(user_id);

INSERT INTO users (username, email)
VALUES ('Alexey', 'alexey@example.com'), 
       ('Maria', 'maria@example.com');

-- Создание чата
INSERT INTO chats DEFAULT VALUES;

-- Получаем ID последнего чата
SELECT id FROM chats ORDER BY created_at DESC LIMIT 1;

-- Добавление участников в чат (два пользователя)
INSERT INTO chat_participants (chat_id, user_id)
VALUES (1, 1), (1, 2);  -- 1 и 2 - это id пользователей

-- Добавление сообщения
INSERT INTO messages (chat_id, user_id, content)
VALUES (1, 1, 'Привет, как дела?'),
       (1, 2, 'Привет! Всё отлично!');
