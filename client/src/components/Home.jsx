import { useEffect, useState } from 'react';
import { getPosts } from '../api/posts';
import PostDetail from './PostDetail';
import PostForm from './PostForm';

/** Показывает форму и загружает список постов из API. */
export default function Home() {
  const [list, setList] = useState({ posts: [], isLoading: true, error: '' });
  const [loadVersion, setLoadVersion] = useState(0);
  const { posts, isLoading, error } = list;

  useEffect(() => {
    let isCurrent = true;

    getPosts()
      .then((posts) => {
        if (isCurrent) {
          setList({ posts, isLoading: false, error: '' });
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setList((list) => ({ ...list, isLoading: false, error: error.message }));
        }
      });

    // Ответ предыдущей загрузки может прийти после более свежего списка.
    return () => {
      isCurrent = false;
    };
  }, [loadVersion]);

  function reloadPosts() {
    setList((list) => ({ ...list, isLoading: true, error: '' }));
    setLoadVersion((version) => version + 1);
  }

  const disabled = isLoading || Boolean(error);

  return (
    <main className="main-section">
      <PostForm onSaved={reloadPosts} disabled={disabled} />
      <h2>Все посты</h2>

      <div className="posts" aria-busy={isLoading}>
        {isLoading && <p role="status">Загрузка постов…</p>}
        {error && (
          <div className="post-list-error">
            <p role="alert">Не удалось загрузить посты. {error}</p>
            <button type="button" onClick={reloadPosts}>
              Повторить загрузку
            </button>
          </div>
        )}
        {!isLoading && !error && posts.length === 0 && <p>Постов пока нет.</p>}
        {posts.map((post) => (
          <PostDetail key={post.id} post={post} onSaved={reloadPosts} disabled={disabled} />
        ))}
      </div>
    </main>
  );
}
