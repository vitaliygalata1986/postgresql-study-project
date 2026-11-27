import { useContext, useState } from 'react';
import { createPost } from '../api/posts';
import { PostContext } from '../context/PostContext';
import PostFields from './PostFields';

const emptyPost = { title: '', anons: '', full_text: '' };

/** Создаёт пост и сохраняет введённые значения при ошибке отправки. */
export default function PostForm() {
  const { canChangePosts, changePosts } = useContext(PostContext);
  const [draft, setDraft] = useState(emptyPost);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await changePosts(() => createPost({
        title: draft.title,
        anons: draft.anons || null,
        full_text: draft.full_text || null,
      }));
      setDraft(emptyPost);
    } catch (error) {
      setError(`Не удалось добавить пост. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="add-post" onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <h2>Новый пост</h2>
      <PostFields draft={draft} setDraft={setDraft} disabled={!canChangePosts} />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={!canChangePosts}>
        {isSubmitting ? 'Добавление…' : 'Добавить'}
      </button>
    </form>
  );
}
