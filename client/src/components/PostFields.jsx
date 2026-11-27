/** Показывает поля создания и редактирования с именами из контракта API. */
export default function PostFields({ draft, setDraft, disabled }) {
  function handleChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  return (
    <fieldset className="post-fields" disabled={disabled}>
      <label>
        Заголовок
        <input name="title" value={draft.title} onChange={handleChange} required />
      </label>
      <label>
        Анонс
        <textarea name="anons" rows={2} value={draft.anons ?? ''} onChange={handleChange} />
      </label>
      <label>
        Полный текст
        <textarea name="full_text" rows={4} value={draft.full_text ?? ''} onChange={handleChange} />
      </label>
    </fieldset>
  );
}
