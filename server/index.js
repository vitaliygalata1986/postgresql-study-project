// Загружаем параметры подключения из локального .env перед созданием пула.
require('dotenv/config');

const express = require('express');
const { Pool } = require('pg');

const app = express();

// POST и PATCH принимают JSON и данные обычной HTML-формы.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Пул позволяет обработчикам переиспользовать подключения.
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT,
  database: process.env.PGDATABASE || 'node_api',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
});

pool.on('error', (err) => console.error('PostgreSQL connection error', err));

// pool.query() возвращает подключение в пул после проверки доступности базы.
pool
  .query('SELECT 1')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL', err));

// Ограничиваем идентификатор диапазоном положительных значений PostgreSQL INTEGER.
app.param('id', (req, res, next, id) => {
  const postId = Number(id);
  if (!/^\d+$/.test(id) || postId < 1 || postId > 2147483647) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }
  next();
});

/** Возвращает сообщение об ошибке тела запроса или null после проверки полей поста. */
function validatePostBody(body, { requireTitle = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Expected a post object';
  }

  if (requireTitle || Object.hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      return 'Title must be a non-empty string';
    }
  }

  for (const field of ['anons', 'full_text']) {
    if (Object.hasOwn(body, field) && body[field] !== null && typeof body[field] !== 'string') {
      return `${field} must be a string or null`;
    }
  }

  return null;
}

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/posts/add', async (req, res) => {
  const error = validatePostBody(req.body, { requireTitle: true });
  if (error) {
    return res.status(400).json({ error });
  }

  const { title, anons = null, full_text = null } = req.body;
  await pool.query(
    'INSERT INTO posts (title, anons, full_text) VALUES ($1, $2, $3)',
    [title, anons, full_text],
  );
  res.status(201).send('Post added successfully');
});

app.patch('/posts/:id', async (req, res) => {
  const error = validatePostBody(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { title, anons, full_text } = req.body;
  if (title === undefined && anons === undefined && full_text === undefined) {
    return res.status(400).json({ error: 'Provide title, anons or full_text to update' });
  }

  // CASE сохраняет пропущенные поля и позволяет очистить их явным null.
  const result = await pool.query(
    `UPDATE posts
     SET title = COALESCE($2, title),
         anons = CASE WHEN $3 THEN $4 ELSE anons END,
         full_text = CASE WHEN $5 THEN $6 ELSE full_text END
     WHERE id = $1
     RETURNING *`,
    [req.params.id, title, anons !== undefined, anons, full_text !== undefined, full_text],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(result.rows[0]);
});

app.delete('/posts/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.send('Post deleted successfully');
});

// Express 5 передаёт сюда ошибки асинхронных маршрутов и разбора тела запроса.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: 'Invalid request' });
  }

  console.error('Request failed', err);
  res.status(500).json({ error: 'Internal server error' });
});

// HTTP-сервер запускается независимо от результата проверки PostgreSQL.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
