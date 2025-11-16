import { createContext, useContext, ReactNode } from 'react'
import { useToast } from '@/shared/hooks/useToast'
import { ToastContainer } from './ui/toast'

interface ToastContextType {
  toast: (data: { title?: string; description?: string; variant?: 'default' | 'success' | 'error' | 'warning' }) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, toast, success, error, warning, removeToast } = useToast()

  // Convert ToastData[] to ToastProps[] by adding onClose handler
  const toastProps = toasts.map((toast) => ({
    ...toast,
    onClose: removeToast,
  }))

  return (
    <ToastContext.Provider value={{ toast, success, error, warning }}>
      {children}
      <ToastContainer toasts={toastProps} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}

