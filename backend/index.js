const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const WebSocket = require('ws');
const http = require('http');

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:8081', // массив разрешённых подключений
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // разрешённые методы
  credentials: true, // для куки
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Отслеживаем подключения клиентов
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Для отправки сообщений всем подключенным клиентам:
function broadcast(data) {
  console.log('broadcasting', data)
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  })
}

const PORT = process.env.PORT || 3000;

// Получение всех пользователей
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

// Создание чата
app.post('/chats', async (req, res) => {
  const { user1_id, user2_id } = req.body;

  // Создаём чат
  const chat = await pool.query('INSERT INTO chats DEFAULT VALUES RETURNING *');
  const chatId = chat.rows[0].id;

  // Добавляем участников
  await pool.query('INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($1, $3)', [
    chatId,
    user1_id,
    user2_id,
  ]);

  res.json(chat.rows[0]);
});

// Получение данных о конкретном чате или создание нового
app.post('/get-chat', async (req, res) => {
  const { user1_id, user2_id } = req.body;

  // Поиск чата, в котором участвуют оба пользователя
  const result = await pool.query(`
    SELECT c.id FROM chats c
    JOIN chat_participants cp1 ON cp1.chat_id = c.id AND cp1.user_id = $1
    JOIN chat_participants cp2 ON cp2.chat_id = c.id AND cp2.user_id = $2
    LIMIT 1
  `, [user1_id, user2_id]);

  if (result.rows.length > 0) {
    // Чат найден
    return res.json(result.rows[0]);
  }

  // Чат не найден — создаём новый
  const chat = await pool.query('INSERT INTO chats DEFAULT VALUES RETURNING *');
  const chatId = chat.rows[0].id;

  // Вставляем участников
  await pool.query(
    'INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($1, $3)',
    [chatId, user1_id, user2_id]
  );

  res.json({ id: chatId });
});

// Получение всех чатов пользователя с логинами участников и последним сообщением
app.get('/users/:userId/chats', async (req, res) => {
  const userId = req.params.userId;

  // Получаем список чатов и последнее сообщение (без участников)
  const chatsResult = await pool.query(`
    SELECT
      c.id AS chat_id,
      c.created_at AS chat_created_at,
      lm.content AS last_message_content,
      lm.created_at AS last_message_created_at,
      lm.user_id AS last_message_user_id,
      lu.username AS last_message_username
    FROM chats c
    LEFT JOIN LATERAL (
      SELECT * FROM messages m
      WHERE m.chat_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) lm ON true
    LEFT JOIN users lu ON lu.id = lm.user_id
    WHERE c.id IN (
      SELECT chat_id FROM chat_participants WHERE user_id = $1
    )
    ORDER BY lm.created_at DESC NULLS LAST
  `, [userId]);

  const chats = chatsResult.rows;

  // Получаем участников для каждого чата
  for (const chat of chats) {
    const participantsResult = await pool.query(`
      SELECT u.id, u.username, u.email
      FROM users u
      JOIN chat_participants cp ON cp.user_id = u.id
      WHERE cp.chat_id = $1
    `, [chat.chat_id]);

    chat.participants = participantsResult.rows;
  }

  res.json(chats);
});

// Получение участников чата
app.get('/chats/:chatId/participants', async (req, res) => {
  const chatId = req.params.chatId;
  const result = await pool.query(
    `
    SELECT users.* FROM users
    JOIN chat_participants cp ON cp.user_id = users.id
    WHERE cp.chat_id = $1
    `,
    [chatId]
  );
  res.json(result.rows);
});

// Отправка сообщения
app.post('/chats/:chatId/messages', async (req, res) => {
  const { userId, content } = req.body;
  const chatId = req.params.chatId;

  const result = await pool.query(
    `
    INSERT INTO messages (chat_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [chatId, userId, content]
  );
  
  // Отправляем обновление всем клиентам
  broadcast({ 
    type: 'new_message'
  });

  res.json(result.rows[0]);
});

// Получение сообщений чата
app.get('/chats/:chatId/messages', async (req, res) => {
  const chatId = req.params.chatId;
  const result = await pool.query(
    `
    SELECT m.*, u.username FROM messages m
    JOIN users u ON u.id = m.user_id
    WHERE m.chat_id = $1
    ORDER BY m.created_at ASC
    `,
    [chatId]
  );
  res.json(result.rows);
});

// Регистрация
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username)
  console.log(email)
  console.log(password)
  const result = await pool.query(
    'INSERT INTO users (username, email, pass) VALUES ($1, $2, $3) RETURNING id, username, email',
    [username, email, password]
  );
  // Отправляем обновление всем клиентам
  broadcast({ 
    type: 'new_user', 
  });
  res.json(result.rows[0]);
});

// Авторизация без хеширования
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("email: ", email)
  console.log("password: ", password)

  const result = await pool.query(
    'SELECT id, username, email FROM users WHERE email = $1 AND pass = $2',
    [email, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  res.json(result.rows[0]); // Возвращаем данные пользователя
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
