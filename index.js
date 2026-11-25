// Express — фреймворк для HTTP-сервера и маршрутов, например для создания и чтения постов.
const express = require('express');

// Pool из пакета pg управляет пулом подключений к PostgreSQL для выполнения SQL-запросов.
const { Pool } = require('pg');

const app = express();
app.use(express.json()); // мы будем получать JSON от пользователей и поэтому нам нужно подключить middleware для парсинга JSON

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
