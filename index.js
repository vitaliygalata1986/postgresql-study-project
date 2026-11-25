// Express — фреймворк для HTTP-сервера и маршрутов, например для создания и чтения постов.
const express = require('express');

// pg (node-postgres) — клиент для подключения к PostgreSQL и выполнения SQL-запросов.
const { Poll } = require('pg');

const app = express();
app.use(express.json()); // мы будем получать JSON от пользователей и поэтому нам нужно подключить middleware для парсинга JSON

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
