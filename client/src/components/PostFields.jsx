/** Показывает поля создания или редактирования поста. */
export default function PostFields({ post = {}, disabled }) {
  return (
    <fieldset className="post-fields" disabled={disabled}>
      <label>
        Заголовок
        <input name="title" defaultValue={post.title} required />
      </label>
      <label>
        Анонс
        <textarea name="anons" rows={2} defaultValue={post.anons ?? ''} />
      </label>
      <label>
        Полный текст
        <textarea name="full_text" rows={4} defaultValue={post.full_text ?? ''} />
      </label>
    </fieldset>
  );
}
