import { useState, useCallback } from 'react';

/**
 * Hook để quản lý loading state cho button
 * @param initialState - Trạng thái loading ban đầu
 * @returns Object chứa loading state và các functions để điều khiển
 */
export const useButtonLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  /**
   * Thực thi một async function với loading state tự động
   * @param asyncFn - Async function cần thực thi
   */
  const withLoading = useCallback(async (asyncFn: () => Promise<any>) => {
    try {
      startLoading();
      await asyncFn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading
  };
};

export type ButtonLoadingState = ReturnType<typeof useButtonLoading>;

export default useButtonLoading;