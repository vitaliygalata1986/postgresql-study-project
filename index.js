// Express понадобится для HTTP-маршрутов создания и чтения постов.
const express = require('express');

const { Pool } = require('pg');

const app = express();

// Разбираем JSON до маршрутов, чтобы будущий обработчик создания поста получил данные в req.body.
app.use(express.json());

// Пул переиспользует подключения. pg читает настройки из PGHOST, PGPORT, PGDATABASE, PGUSER и PGPASSWORD.
const pool = new Pool();

// Проверяем, что PostgreSQL принимает запросы. pool.query сам возвращает клиент в пул.
pool
  .query('SELECT 1')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL', err));

// HTTP-сервер запускается независимо от результата проверки PostgreSQL.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
