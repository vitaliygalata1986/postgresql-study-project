// Загружаем параметры подключения из локального .env перед созданием пула.
require('dotenv/config');

const express = require('express');

const { Pool } = require('pg');

const app = express();

// Разбираем JSON и данные HTML-форм до маршрутов, чтобы POST и PATCH получили req.body.
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

// При запуске проверяем доступность PostgreSQL. pool.connect() занимает клиент до client.release().
pool
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL', err));

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error in data:', err);
  }
});

app.post('/posts/add', async (req, res) => {
  const { title, anons, full_text } = req.body;
  try {
    await pool.query(
      'INSERT INTO posts (title, anons, full_text) VALUES ($1, $2, $3)',
      [title, anons, full_text],
    );
    const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
    res.send('Post added successfully');
  } catch (err) {
    res.status(500).send('Error in data:', err);
  }
});

app.patch('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, anons, full_text } = req.body ?? {};

  try {
    // pg передаёт пропущенные поля как NULL. При NULL в параметре COALESCE берёт значение из базы.
    await pool.query(
      `UPDATE posts
       SET title = COALESCE($1, title),
           anons = COALESCE($2, anons),
           full_text = COALESCE($3, full_text)
       WHERE id = $4`,
      [title, anons, full_text, id],
    );
    res.send('Post updated successfully');
  } catch {
    res.status(500).send('Error updating post');
  }
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.send('Post deleted successfully');
  } catch (err) {
    res.status(500).send('Error in data:', err);
  }
});

// HTTP-сервер запускается независимо от результата проверки PostgreSQL.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
