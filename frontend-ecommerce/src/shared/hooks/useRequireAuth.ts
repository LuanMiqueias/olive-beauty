import { useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/stores'

// Simple global lock to prevent concurrent auth checks
let authCheckPromise: Promise<void> | null = null
let lastAuthCheckTime = 0
let hasRedirected = false
const AUTH_CHECK_COOLDOWN = 2000 // 2 seconds cooldown

export function useRequireAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, user, token } = useAuthStore()

  useEffect(() => {
    // Reset redirect flag when authenticated state changes to true
    if (isAuthenticated && user) {
      hasRedirected = false
      return
    }

    // Don't check auth if we're already on login page
    if (location.pathname === '/login' || location.pathname.startsWith('/login')) {
      hasRedirected = false // Reset when on login page
      return
    }

    // Prevent multiple redirects globally
    if (hasRedirected) {
      return
    }

    const checkAuth = async () => {
      const currentToken = localStorage.getItem('token')
      const currentPath = window.location.pathname

      // Don't redirect if already on login page
      if (currentPath === '/login' || currentPath.startsWith('/login')) {
        return
      }

      // No token = redirect immediately
      if (!currentToken) {
        hasRedirected = true
        navigate({ to: '/login', replace: true })
        return
      }

      // If user is already loaded and authenticated, skip
      if (user && isAuthenticated && token === currentToken) {
        return
      }

      // If there's a pending auth check, wait for it
      if (authCheckPromise) {
        try {
          await authCheckPromise
          // After waiting, verify state again
          const store = useAuthStore.getState()
          if (store.user && store.isAuthenticated && store.token === currentToken) {
            return
          }
        } catch {
          // If promise failed, we'll try again below
        }
      }

      // Cooldown check - prevent rapid successive calls
      const now = Date.now()
      if (now - lastAuthCheckTime < AUTH_CHECK_COOLDOWN && authCheckPromise) {
        try {
          await authCheckPromise
          return
        } catch {
          // Continue to fetch if promise failed
        }
      }

      // Only fetch if we don't have user data and not currently loading
      if (!user && !isLoading) {
        lastAuthCheckTime = now

        // Create the promise and store reference
        let promiseRef: Promise<void> | null = null
        promiseRef = (async () => {
          try {
            await useAuthStore.getState().getCurrentUser()
          } catch (error) {
            // On error, clear promise and redirect
            const currentPath = window.location.pathname
            if (currentPath !== '/login' && !currentPath.startsWith('/login') && !hasRedirected) {
              localStorage.removeItem('token')
              useAuthStore.getState().logout()
              hasRedirected = true
              navigate({ to: '/login', replace: true })
            }
            throw error
          } finally {
            // Clear promise after completion (success or failure)
            // Only clear if this is still the current promise
            if (authCheckPromise === promiseRef) {
              authCheckPromise = null
            }
          }
        })()

        authCheckPromise = promiseRef

        try {
          await promiseRef
        } catch {
          // Error already handled in promise
        }
      } else if (!isAuthenticated && !isLoading) {
        // If we're not loading and not authenticated, redirect
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && !currentPath.startsWith('/login') && !hasRedirected) {
          hasRedirected = true
          navigate({ to: '/login', replace: true })
        }
      }
    }

    if (!isLoading) {
      checkAuth()
    }
  }, [isAuthenticated, isLoading, navigate, user, token, location.pathname])

  return { isAuthenticated, isLoading }
}

