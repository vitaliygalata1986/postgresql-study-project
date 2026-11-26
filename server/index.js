// dotenv загружает значения из .env в process.env до того, как мы прочитаем настройки PostgreSQL.
// По умолчанию dotenv сохраняет значения переменных, уже заданных в окружении.
require('dotenv/config');

const express = require('express');

const { Pool } = require('pg');
// Из routes/posts.js импортируем функцию, которая создаёт роутер с переданным ей пулом.
const createPostsRouter = require('./routes/posts');

// На этом объекте регистрируем обработчики запросов и затем запускаем HTTP-сервер.
const app = express();

// Express выполняет промежуточные обработчики в порядке регистрации.
// Сначала разбираем JSON и данные HTML-форм по Content-Type, чтобы маршруты получили req.body.
app.use(express.json());
// extended: true позволяет разобрать вложенные поля формы, например post[title].
app.use(express.urlencoded({ extended: true }));

// Один пул обслуживает все маршруты постов. pool.query() берёт соединение на время запроса
// к базе и возвращает его в пул, чтобы следующий обработчик мог его использовать.
// Если PGPORT не задан, pg использует порт 5432. Пароль читаем из PGPASSWORD.
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT,
  database: process.env.PGDATABASE || 'node_api',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
});

// При запуске пытаемся получить соединение с PostgreSQL и записываем результат в консоль.
// pool.connect() выдаёт клиент, который нужно вернуть через client.release().
// Здесь клиент остаётся занятым, потому что обработчик .then() только пишет в консоль.
pool
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL', err));

// При запуске вызываем createPostsRouter(pool) и получаем роутер с маршрутами постов.
// app.use подключает этот роутер без префикса. Роутер выбирает обработчик по методу и пути
// запроса, например GET / или POST /posts/add, уже после разбора тела запроса.
app.use(createPostsRouter(pool));

// Начинаем принимать HTTP-запросы на порту 3000, не дожидаясь проверки PostgreSQL.
// Сообщение ниже означает, что порт открыт. Результат подключения к базе выводится отдельно.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
