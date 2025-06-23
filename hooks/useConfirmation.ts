import { useCallback } from 'react';

/**
 * Hook để quản lý confirmation dialog
 * @returns Object chứa các functions để xử lý confirmation
 */
export const useConfirmation = () => {
  /**
   * Hiển thị confirmation dialog
   * @param message - Message hiển thị trong dialog
   * @returns Promise resolve với kết quả của confirmation (true/false)
   */
  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const result = window.confirm(message);
      resolve(result);
    });
  }, []);

  /**
   * Hiển thị confirmation dialog và thực thi function nếu user xác nhận
   * @param message - Message hiển thị trong dialog
   * @param onConfirm - Function sẽ được gọi nếu user xác nhận
   * @returns Promise resolve với kết quả của confirmation (true/false)
   */
  const confirmAsync = useCallback(async (
    message: string,
    onConfirm: () => Promise<void> | void
  ) => {
    const confirmed = await confirm(message);
    if (confirmed) {
      await onConfirm();
    }
    return confirmed;
  }, [confirm]);

  return {
    confirm,
    confirmAsync
  };
};

export type ConfirmationState = ReturnType<typeof useConfirmation>;

export default useConfirmation;