import { useState, useCallback } from 'react'
import { ToastProps } from '@/shared/components/ui/toast'

interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const toast = useCallback(
    (data: Omit<ToastData, 'id'>) => {
      const id = `toast-${++toastId}`
      setToasts((prev) => [...prev, { ...data, id }])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'success' })
    },
    [toast]
  )

  const error = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'error' })
    },
    [toast]
  )

  const warning = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'warning' })
    },
    [toast]
  )

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    removeToast,
  }
}

