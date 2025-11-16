import { useAuthStore } from '@/shared/stores'
import { useShallow } from 'zustand/react/shallow'

export function useRequireAdmin() {
  // Use shallow comparison to prevent unnecessary re-renders
  // Only re-render when these specific values change
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isAdmin: state.isAdmin,
      isLoading: state.isLoading,
    }))
  )

  // Just return the auth state - no side effects
  // The beforeLoad handles authentication check
  return { isAuthenticated, isAdmin, isLoading }
}

