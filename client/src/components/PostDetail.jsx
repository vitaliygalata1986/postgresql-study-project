import { useState } from 'react';
import { deletePost, updatePost } from '../api/posts';
import PostFields from './PostFields';

/** Показывает пост и даёт редактировать или удалить его. */
export default function PostDetail({ post, onSaved, disabled }) {
  const [changes, setChanges] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function handleEdit() {
    setError('');
    setChanges({});
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setChanges((current) => ({ ...current, [name]: value }));
  }

  function handleCancel() {
    setError('');
    setChanges(null);
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (Object.keys(changes).length === 0) {
      handleCancel();
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      await updatePost(post.id, changes);
      setChanges(null);
      onSaved();
    } catch (error) {
      setError(`Не удалось сохранить изменения. ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setError('');
    setIsSaving(true);

    try {
      await deletePost(post.id);
      onSaved();
    } catch (error) {
      setError(`Не удалось удалить пост. ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="post">
      {error && <p className="error" role="alert">{error}</p>}
      {changes ? (
        <form className="edit-post" onChange={handleChange} onSubmit={handleUpdate} aria-busy={isSaving}>
          <PostFields post={post} disabled={disabled || isSaving} />
          <div className="edit-post-actions">
            <button type="submit" disabled={disabled || isSaving}>
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
              disabled={disabled || isSaving}
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
              disabled={disabled || isSaving}
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
