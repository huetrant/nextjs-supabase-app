import React from 'react';
import { Button } from './Button';
import { Plus, Edit, Trash2, Eye, Save, X, Check, ArrowLeft, ArrowRight, Download, Upload, Search, Filter, RefreshCw } from 'lucide-react';

// Action Button Presets - Các button thường dùng với icon và style cố định
export const ActionButtons = {
  // CRUD Actions
  Add: ({ children = 'Thêm', onClick, ...props }: any) => (
    <Button
      variant="primary"
      leftIcon={<Plus className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Edit: ({ children = 'Sửa', onClick, ...props }: any) => (
    <Button
      variant="secondary"
      size="sm"
      leftIcon={<Edit className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Delete: ({ children = 'Xóa', onClick, ...props }: any) => (
    <Button
      variant="danger"
      size="sm"
      leftIcon={<Trash2 className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  View: ({ children = 'Xem', onClick, ...props }: any) => (
    <Button
      variant="outline"
      size="sm"
      leftIcon={<Eye className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Create: ({ children = 'Tạo', onClick, loading, ...props }: any) => (
    <Button
      variant="primary"
      leftIcon={<Plus className="h-4 w-4" />}
      loading={loading}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  // Form Actions
  Save: ({ children = 'Lưu', loading, onClick, ...props }: any) => (
    <Button
      variant="success"
      leftIcon={<Save className="h-4 w-4" />}
      loading={loading}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Cancel: ({ children = 'Hủy', onClick, ...props }: any) => (
    <Button
      variant="outline"
      leftIcon={<X className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Submit: ({ children = 'Gửi', loading, ...props }: any) => (
    <Button
      variant="primary"
      leftIcon={<Check className="h-4 w-4" />}
      loading={loading}
      type="submit"
      {...props}
    >
      {children}
    </Button>
  ),

  // Navigation Actions
  Back: ({ children = 'Quay lại', onClick, ...props }: any) => (
    <Button
      variant="ghost"
      leftIcon={<ArrowLeft className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Next: ({ children = 'Tiếp theo', onClick, ...props }: any) => (
    <Button
      variant="primary"
      rightIcon={<ArrowRight className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  // Utility Actions
  Download: ({ children = 'Tải xuống', onClick, ...props }: any) => (
    <Button
      variant="info"
      leftIcon={<Download className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Upload: ({ children = 'Tải lên', onClick, ...props }: any) => (
    <Button
      variant="accent"
      leftIcon={<Upload className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Search: ({ children = 'Tìm kiếm', onClick, ...props }: any) => (
    <Button
      variant="outline"
      leftIcon={<Search className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Filter: ({ children = 'Lọc', onClick, ...props }: any) => (
    <Button
      variant="ghost"
      leftIcon={<Filter className="h-4 w-4" />}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  ),

  Refresh: ({ children = 'Làm mới', onClick, loading, ...props }: any) => (
    <Button
      variant="outline"
      leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
      onClick={onClick}
      loading={loading}
      {...props}
    >
      {children}
    </Button>
  ),
};

// Icon-only Button Presets - Chỉ có icon, không có text
export const IconButtons = {
  Edit: ({ onClick, title = 'Sửa', ...props }: any) => (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      title={title}
      {...props}
    >
      <Edit className="h-4 w-4" />
    </Button>
  ),

  Delete: ({ onClick, title = 'Xóa', ...props }: any) => (
    <Button
      variant="danger"
      size="sm"
      onClick={onClick}
      title={title}
      {...props}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  ),

  View: ({ onClick, title = 'Xem', ...props }: any) => (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      title={title}
      {...props}
    >
      <Eye className="h-4 w-4" />
    </Button>
  ),

  Add: ({ onClick, title = 'Thêm', ...props }: any) => (
    <Button
      variant="primary"
      size="sm"
      onClick={onClick}
      title={title}
      {...props}
    >
      <Plus className="h-4 w-4" />
    </Button>
  ),
};

// Button Groups - Nhóm các button thường đi cùng nhau
export const ButtonGroups = {
  // Form Actions Group
  FormActions: ({
    onSave,
    onCancel,
    saveText = 'Lưu',
    cancelText = 'Hủy',
    loading = false,
    saveVariant = 'success',
    isSubmit = false,
    ...props
  }: any) => (
    <div className="flex justify-end space-x-2" {...props}>
      <ActionButtons.Cancel onClick={onCancel}>{cancelText}</ActionButtons.Cancel>
      <Button
        variant={saveVariant}
        leftIcon={<Save className="h-4 w-4" />}
        loading={loading}
        onClick={!isSubmit ? onSave : undefined}
        type={isSubmit ? 'submit' : 'button'}
      >
        {saveText}
      </Button>
    </div>
  ),

  // CRUD Actions Group
  CrudActions: ({
    onView,
    onEdit,
    onDelete,
    showView = true,
    showEdit = true,
    showDelete = true,
    ...props
  }: any) => (
    <div className="flex items-center space-x-1" {...props}>
      {showView && <IconButtons.View onClick={onView} />}
      {showEdit && <IconButtons.Edit onClick={onEdit} />}
      {showDelete && <IconButtons.Delete onClick={onDelete} />}
    </div>
  ),

  // Pagination Actions
  PaginationActions: ({
    onPrevious,
    onNext,
    canGoPrevious = true,
    canGoNext = true,
    ...props
  }: any) => (
    <div className="flex items-center space-x-2" {...props}>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        Trước
      </Button>
      <Button
        variant="outline"
        size="sm"
        rightIcon={<ArrowRight className="h-4 w-4" />}
        onClick={onNext}
        disabled={!canGoNext}
      >
        Sau
      </Button>
    </div>
  ),
};

// Specialized Button Components
export const SpecialButtons = {
  // Loading Button với custom loading text
  LoadingButton: ({
    loading,
    loadingText = 'Đang xử lý...',
    children,
    ...props
  }: any) => (
    <Button loading={loading} {...props}>
      {loading ? loadingText : children}
    </Button>
  ),

  // Confirmation Button - yêu cầu xác nhận trước khi thực hiện
  ConfirmButton: ({
    onConfirm,
    confirmMessage = 'Bạn có chắc chắn muốn thực hiện hành động này?',
    children,
    ...props
  }: any) => (
    <Button
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          onConfirm();
        }
      }}
      {...props}
    >
      {children}
    </Button>
  ),

  // Toggle Button - có thể bật/tắt
  ToggleButton: ({
    active,
    onToggle,
    activeText = 'Bật',
    inactiveText = 'Tắt',
    ...props
  }: any) => (
    <Button
      variant={active ? 'success' : 'outline'}
      onClick={onToggle}
      {...props}
    >
      {active ? activeText : inactiveText}
    </Button>
  ),
};

// Export all presets
export {
  ActionButtons as Actions,
  IconButtons as Icons,
  ButtonGroups as Groups,
  SpecialButtons as Special,
};