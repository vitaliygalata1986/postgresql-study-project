async function request(path, { method = 'GET', data, signal } = {}) {
  const options = { method, signal };
  if (data !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(data);
  }

  let response;
  try {
    response = await fetch(`/api${path}`, options);
  } catch (error) {
    throw new Error('Не удалось подключиться к API постов.', { cause: error });
  }

  if (!response.ok) {
    const isPlainText = response.headers.get('content-type')?.startsWith('text/plain');
    const message = isPlainText ? (await response.text()).trim() : '';
    throw new Error(message || `Ошибка запроса к API (HTTP ${response.status}).`);
  }

  return response;
}

/** Получает список постов в порядке, заданном сервером. */
export async function getPosts(signal) {
  const response = await request('/', { signal });
  const posts = await response.json().catch(() => null);

  if (!Array.isArray(posts)) {
    throw new Error('API вернул некорректный список постов.');
  }

  return posts;
}

/** Создаёт пост и ожидает подтверждение от сервера. */
export async function createPost(post) {
  await request('/posts/add', { method: 'POST', data: post });
}

/** Обновляет переданные поля поста с указанным id. */
export async function updatePost(id, changes) {
  await request(`/posts/${id}`, { method: 'PATCH', data: changes });
}

/** Удаляет пост с указанным id и ожидает подтверждение от сервера. */
export async function deletePost(id) {
  await request(`/posts/${id}`, { method: 'DELETE' });
}
