import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginDTO, AuthResponse } from '@/shared/types'
import { apiClient } from '@/api/client'
import { ApiResponse } from '@/shared/types'

// AbortController for getCurrentUser requests
let getCurrentUserController: AbortController | null = null

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginDTO) => Promise<void>
  logout: () => void
  getCurrentUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginDTO) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/login',
            credentials
          )

          if (response.data.status === 'success' && response.data.data) {
            const { user, token } = response.data.data
            
            // Verify user is ADMIN
            if (user.role !== 'ADMIN') {
              throw new Error('Acesso negado. Apenas administradores podem acessar este painel.')
            }

            set({
              user,
              token,
              isAuthenticated: true,
              isAdmin: true,
              isLoading: false,
              error: null,
            })
            // Store token in localStorage (persist middleware will also handle this)
            localStorage.setItem('token', token)
          } else {
            throw new Error(response.data.message || 'Erro ao fazer login')
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Erro ao fazer login. Tente novamente.'
          set({ error: errorMessage, isLoading: false, isAuthenticated: false, isAdmin: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          error: null,
        })
      },

      getCurrentUser: async () => {
        // Cancel any pending request
        if (getCurrentUserController) {
          getCurrentUserController.abort()
        }

        // Prevent multiple simultaneous calls
        const currentState = get()
        if (currentState.isLoading && getCurrentUserController) {
          // Wait for the current request to finish
          return new Promise<void>((resolve) => {
            const checkInterval = setInterval(() => {
              const state = get()
              if (!state.isLoading) {
                clearInterval(checkInterval)
                resolve()
              }
            }, 50)
            // Timeout after 3 seconds
            setTimeout(() => {
              clearInterval(checkInterval)
              resolve()
            }, 3000)
          })
        }

        // Create new AbortController for this request
        getCurrentUserController = new AbortController()
        const signal = getCurrentUserController.signal

        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.get<ApiResponse<User>>('/auth/me', {
            signal,
            timeout: 10000,
          })

          if (response.data.status === 'success' && response.data.data) {
            const user = response.data.data
            
            // Verify user is ADMIN
            if (user.role !== 'ADMIN') {
              get().logout()
              throw new Error('Acesso negado. Apenas administradores podem acessar este painel.')
            }

            set({
              user,
              token: localStorage.getItem('token'), // Ensure token is set
              isAuthenticated: true,
              isAdmin: true,
              isLoading: false,
              error: null,
            })
            getCurrentUserController = null
          } else {
            getCurrentUserController = null
            throw new Error(response.data.message || 'Erro ao buscar usuário')
          }
        } catch (error: unknown) {
          getCurrentUserController = null
          
          // Ignore abort errors (request was cancelled)
          if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('canceled') || error.message.includes('aborted'))) {
            set({ isLoading: false })
            return
          }
          
          // Also check axios cancel token errors
          if ((error as any).code === 'ERR_CANCELED' || (error as any).message === 'canceled') {
            set({ isLoading: false })
            return
          }
          
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Erro ao buscar usuário'
          
          // If 401 or 403, clear auth state immediately
          const isAuthError = error instanceof Error && (
            error.message.includes('401') || 
            error.message.includes('403') || 
            error.message.includes('negado') ||
            (error as any).response?.status === 401 ||
            (error as any).response?.status === 403
          )
          
          if (isAuthError) {
            get().logout()
            set({ error: null, isLoading: false })
          } else {
            set({ error: errorMessage, isLoading: false })
          }
          
          throw error
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      // Skip rehydration validation to prevent loops
      // The beforeLoad will handle validation
    }
  )
)

