const express = require('express');

/** Проверяет, что заголовок является строкой с непробельным символом. */
function isValidPostTitle(title) {
  return typeof title === 'string' && title.trim() !== '';
}

/**
 * Создаёт и возвращает Express-роутер для работы с постами.
 * @param {import('pg').Pool} pool Общий пул PostgreSQL, созданный в server/index.js.
 * @returns {import('express').Router} Роутер, который index.js подключает через app.use().
 */
function createPostsRouter(pool) {
  const router = express.Router();

  // При создании роутера регистрируем обработчики. Запросы к базе выполняются позже,
  // когда Express получает запрос с подходящим HTTP-методом и путём.
  // GET / возвращает все посты в порядке убывания id.
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
      // rows содержит строки из PostgreSQL. Если таблица пуста, клиент получает [].
      res.json(result.rows);
    } catch (err) {
      // Express 5 отправляет первый аргумент send() как тело ответа. err в тело не попадает.
      res.status(500).send('Error in data:', err);
    }
  });

  // POST /posts/add берёт поля новой записи из тела запроса, разобранного в server/index.js.
  router.post('/posts/add', async (req, res) => {
    const { title, anons, full_text } = req.body ?? {};

    // Возвращаем 400 до запроса к базе, если в заголовке нет текста.
    if (!isValidPostTitle(title)) {
      return res.status(400).type('text/plain').send('Укажите заголовок поста');
    }

    try {
      // $1, $2 и $3 соответствуют позициям в массиве. pg передаёт значения отдельно от SQL,
      // поэтому кавычки и другие символы из текста поста остаются частью данных.
      await pool.query(
        'INSERT INTO posts (title, anons, full_text) VALUES ($1, $2, $3)',
        [title, anons, full_text],
      );
      // После вставки код ещё раз читает список постов. result дальше не используется,
      // клиент получает текстовое подтверждение после завершения обоих запросов.
      const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
      res.send('Post added successfully');
    } catch (err) {
      res.status(500).send('Error in data:', err);
    }
  });

  // PATCH /posts/:id обновляет только переданные поля выбранного поста.
  router.patch('/posts/:id', async (req, res) => {
    // Для /posts/12 Express кладёт строку '12' в req.params.id.
    const { id } = req.params;
    // Если тело запроса отсутствует, читаем поля из пустого объекта.
    const { title, anons, full_text } = req.body ?? {};

    // Пропуск title и явный null оставляют прежний заголовок. Проверяем только новое значение.
    if (title !== undefined && title !== null && !isValidPostTitle(title)) {
      return res.status(400).type('text/plain').send('Укажите заголовок поста');
    }

    try {
      // pg передаёт отсутствующие значения (undefined) и явные null как SQL NULL.
      // COALESCE берёт первое значение, отличное от NULL. Если передать только title,
      // обновится заголовок, а anons и full_text сохранятся. Для anons и full_text пустая строка допустима.
      // Условие WHERE id = $4 ограничивает обновление постом из адреса запроса.
      await pool.query(
        `UPDATE posts
         SET title = COALESCE($1, title),
             anons = COALESCE($2, anons),
             full_text = COALESCE($3, full_text)
         WHERE id = $4`,
        [title, anons, full_text, id],
      );
      // Количество обновлённых строк здесь не проверяется. Ответ одинаков и для неизвестного id.
      res.send('Post updated successfully');
    } catch {
      res.status(500).send('Error updating post');
    }
  });

  // DELETE /posts/:id берёт id из адреса и передаёт его в запрос как параметр $1.
  router.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
      // Проверяем число удалённых строк из самого DELETE. Это учитывает и одновременные запросы.
      if (rowCount === 0) {
        return res.status(404).type('text/plain').send('Пост с таким ID не существует');
      }

      res.send('Post deleted successfully');
    } catch (err) {
      res.status(500).send('Error in data:', err);
    }
  });

  return router;
}

// Экспортируем функцию, чтобы index.js создал роутер со своим пулом PostgreSQL.
module.exports = createPostsRouter;
