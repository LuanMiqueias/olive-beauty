import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ToastProvider } from '@/shared/components/ToastProvider'

export const Route = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  ),
})

