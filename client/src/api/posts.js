async function request(path, options) {
  const response = await fetch(`/api${path}`, options);

  if (!response.ok) {
    const isPlainText = response.headers.get('content-type')?.startsWith('text/plain');
    const message = isPlainText ? await response.text() : '';
    throw new Error(message || `Ошибка API (HTTP ${response.status}).`);
  }

  return response;
}

/** Загружает список постов с сервера. */
export async function getPosts() {
  const response = await request('/');
  const posts = await response.json();
  if (!Array.isArray(posts)) {
    throw new Error('API вернул некорректный список постов.');
  }

  return posts;
}

/** Сохраняет новый пост и проверяет статус ответа API. */
export async function createPost(post) {
  await request('/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
}

/** Отправляет изменённые поля поста. */
export async function updatePost(id, changes) {
  await request(`/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
}

/** Удаляет пост с указанным id. */
export async function deletePost(id) {
  await request(`/posts/${id}`, { method: 'DELETE' });
}
