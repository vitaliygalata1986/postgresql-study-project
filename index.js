// Express понадобится для HTTP-маршрутов создания и чтения постов.
const express = require('express');

const { Pool } = require('pg');

const app = express();

// Разбираем JSON до маршрутов, чтобы будущий обработчик создания поста получил данные в req.body.
app.use(express.json());

// Пул позволяет обработчикам переиспользовать подключения. Пароль pg читает из PGPASSWORD.
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'node_api',
  port: 5432,
});

// При запуске проверяем доступность базы. pool.connect() выдаёт клиент,
// который нужно возвращать в пул через client.release().
pool
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL', err));

// HTTP-сервер запускается независимо от результата проверки PostgreSQL.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
