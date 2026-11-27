import { useCallback, useEffect, useState } from 'react';
import { getPosts } from '../api/posts';
import { PostContext } from './PostContext';

/** Предоставляет список постов и синхронизирует его с API после записи. */
export function PostProvider({ children }) {
  const [list, setList] = useState({ posts: [], error: '', isLoading: true });
  const [isMutating, setIsMutating] = useState(false);

  const loadPosts = useCallback(async (signal) => {
    try {
      const posts = await getPosts(signal);
      if (!signal?.aborted) {
        setList({ posts, error: '', isLoading: false });
      }
    } catch (error) {
      if (!signal?.aborted) {
        setList((current) => ({ ...current, error: error.message, isLoading: false }));
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadPosts(controller.signal);
    return () => controller.abort();
  }, [loadPosts]);

  function retryPosts() {
    setList((current) => ({ ...current, error: '', isLoading: true }));
    void loadPosts();
  }

  async function changePosts(operation) {
    setIsMutating(true);

    try {
      await operation();
      // Запись уже подтверждена. Если GET упадёт, пользователь повторит только загрузку списка.
      await loadPosts();
    } finally {
      setIsMutating(false);
    }
  }

  const canChangePosts = !list.isLoading && !list.error && !isMutating;

  return (
    <PostContext.Provider value={{ list, canChangePosts, retryPosts, changePosts }}>
      {children}
    </PostContext.Provider>
  );
}
