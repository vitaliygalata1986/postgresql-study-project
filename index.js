// Express понадобится для HTTP-маршрутов создания и чтения постов.
const express = require('express');

// Пул из pg позволит переиспользовать подключения к PostgreSQL между запросами к API.
const { Pool } = require('pg');

const app = express();

// Разбираем JSON до маршрутов, чтобы будущий обработчик создания поста получил данные в req.body.
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
