import { useState } from 'react';
import { createPost } from '../api/posts';
import PostFields from './PostFields';

/** Создаёт пост и сообщает родителю о сохранении. */
export default function PostForm({ onSaved, disabled }) {
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isDisabled = disabled || isSaving;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const { title, anons, full_text } = Object.fromEntries(new FormData(form));
    setError('');
    setIsSaving(true);

    try {
      await createPost({ title, anons: anons || null, full_text: full_text || null });
      form.reset();
      onSaved();
    } catch (error) {
      setError(`Не удалось добавить пост. ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="add-post" onSubmit={handleSubmit} aria-busy={isSaving}>
      <h2>Новый пост</h2>
      <PostFields disabled={isDisabled} />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={isDisabled}>
        {isSaving ? 'Добавление…' : 'Добавить'}
      </button>
    </form>
  );
}
