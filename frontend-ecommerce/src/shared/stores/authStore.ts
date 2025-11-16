import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginDTO, RegisterDTO, AuthResponse } from '@/shared/types'
import { apiClient } from '@/api/client'
import { ApiResponse } from '@/shared/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginDTO) => Promise<void>
  register: (data: RegisterDTO) => Promise<void>
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
            set({
              user,
              token,
              isAuthenticated: true,
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
          set({ error: errorMessage, isLoading: false, isAuthenticated: false })
          throw error
        }
      },

      register: async (data: RegisterDTO) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/register',
            data
          )

          if (response.data.status === 'success' && response.data.data) {
            const { user, token } = response.data.data
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            localStorage.setItem('token', token)
          } else {
            throw new Error(response.data.message || 'Erro ao registrar')
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Erro ao registrar. Tente novamente.'
          set({ error: errorMessage, isLoading: false, isAuthenticated: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      getCurrentUser: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.get<ApiResponse<User>>('/auth/me')

          if (response.data.status === 'success' && response.data.data) {
            set({
              user: response.data.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.data.message || 'Erro ao buscar usuário')
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Erro ao buscar usuário'
          set({ error: errorMessage, isLoading: false })
          // If 401, clear auth state
          if (error instanceof Error && error.message.includes('401')) {
            get().logout()
          }
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

