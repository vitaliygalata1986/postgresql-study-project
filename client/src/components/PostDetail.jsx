import { useContext, useRef, useState } from 'react';
import { deletePost, updatePost } from '../api/posts';
import { PostContext } from '../context/PostContext';
import PostFields from './PostFields';

/** Отображает пост и позволяет изменить его поля или удалить запись. */
export default function PostDetail({ post }) {
  const { canChangePosts, changePosts } = useContext(PostContext);
  const initialDraft = useRef(null);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function handleEdit() {
    setError('');
    const fields = { title: post.title, anons: post.anons, full_text: post.full_text };
    initialDraft.current = fields;
    setDraft(fields);
  }

  function handleCancel() {
    setError('');
    setDraft(null);
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setError('');

    // Сверяем с началом редактирования, чтобы не отправить поля, которые изменились на сервере.
    const changes = Object.fromEntries(
      Object.entries(draft).filter(([field, value]) => value !== initialDraft.current[field]),
    );
    if (Object.keys(changes).length === 0) {
      setDraft(null);
      return;
    }

    setIsSaving(true);

    try {
      await changePosts(() => updatePost(post.id, changes));
      setDraft(null);
    } catch (error) {
      setError(`Не удалось сохранить изменения. ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setError('');

    try {
      await changePosts(() => deletePost(post.id));
    } catch (error) {
      setError(`Не удалось удалить пост. ${error.message}`);
    }
  }

  return (
    <article className="post">
      {error && <p className="error" role="alert">{error}</p>}
      {draft ? (
        <form className="edit-post" onSubmit={handleUpdate} aria-busy={isSaving}>
          <PostFields draft={draft} setDraft={setDraft} disabled={!canChangePosts} />
          <div className="edit-post-actions">
            <button type="submit" disabled={!canChangePosts}>
              {isSaving ? 'Сохранение…' : 'Сохранить'}
            </button>
            <button type="button" onClick={handleCancel} disabled={isSaving}>
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="post-actions">
            <button
              type="button"
              onClick={handleEdit}
              className="post-edit"
              aria-label="Редактировать пост"
              title="Редактировать пост"
              disabled={!canChangePosts}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m16 3 5 5-13 13H3v-5L16 3Z" />
                <path d="m13 6 5 5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="post-delete"
              aria-label="Удалить пост"
              title="Удалить пост"
              disabled={!canChangePosts}
            >
              X
            </button>
          </div>
          <h3>{post.title}</h3>
          {post.anons && <p>{post.anons}</p>}
          {post.full_text && <p>{post.full_text}</p>}
        </>
      )}
    </article>
  );
}
