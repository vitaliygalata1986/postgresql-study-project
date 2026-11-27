import { useContext } from 'react';
import { PostContext } from '../context/PostContext';
import PostDetail from './PostDetail';
import PostForm from './PostForm';

/** Показывает форму создания поста и текущее состояние списка. */
export default function Home() {
  const { list, retryPosts } = useContext(PostContext);
  const { posts, isLoading, error } = list;

  return (
    <main className="main-section">
      <PostForm />
      <h2>Все посты</h2>

      <div className="posts" aria-busy={isLoading}>
        {isLoading && <p role="status">Загрузка постов…</p>}
        {error && (
          <div className="post-list-error">
            <p role="alert">Не удалось загрузить посты. {error}</p>
            <button type="button" onClick={retryPosts}>
              Повторить загрузку
            </button>
          </div>
        )}
        {!isLoading && !error && posts.length === 0 && <p>Постов пока нет.</p>}
        {posts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </main>
  );
}
