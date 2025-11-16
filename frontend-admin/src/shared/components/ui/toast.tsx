import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, title, description, variant = 'default', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  const variantStyles = {
    default: 'bg-background border-border',
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
        variantStyles[variant],
        'animate-in slide-in-from-top-5 fade-in-0'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1 space-y-1">
            {title && <p className="text-sm font-semibold">{title}</p>}
            {description && <p className="text-sm opacity-90">{description}</p>}
          </div>
          <button
            onClick={() => onClose(id)}
            className="ml-4 inline-flex rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed top-0 z-[100] flex w-full flex-col items-center space-y-4 p-4 sm:right-0 sm:top-auto sm:bottom-0 sm:flex-col sm:space-y-4 sm:p-6">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

