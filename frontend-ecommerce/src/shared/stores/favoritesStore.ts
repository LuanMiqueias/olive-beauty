import { create } from 'zustand'
import { Favorite, Product } from '@/shared/types'
import { apiClient } from '@/api/client'
import { ApiResponse } from '@/shared/types'

interface FavoritesState {
  favorites: Favorite[]
  isLoading: boolean
  error: string | null
  getFavorites: () => Promise<void>
  addFavorite: (productId: string) => Promise<void>
  removeFavorite: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  clearError: () => void
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  getFavorites: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<ApiResponse<Favorite[]>>(
        '/favorites'
      )

      if (response.data.status === 'success' && response.data.data) {
        set({
          favorites: response.data.data,
          isLoading: false,
          error: null,
        })
      } else {
        throw new Error(response.data.message || 'Erro ao buscar favoritos')
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao buscar favoritos. Tente novamente.'
      set({ error: errorMessage, isLoading: false })
    }
  },

  addFavorite: async (productId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post<ApiResponse<{ message: string }>>(
        '/favorites',
        { productId }
      )

      if (response.data.status === 'success') {
        // Refresh favorites list
        await get().getFavorites()
      } else {
        throw new Error(response.data.message || 'Erro ao adicionar favorito')
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao adicionar aos favoritos. Tente novamente.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  removeFavorite: async (productId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        `/favorites/${productId}`
      )

      if (response.data.status === 'success') {
        // Refresh favorites list
        await get().getFavorites()
      } else {
        throw new Error(response.data.message || 'Erro ao remover favorito')
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao remover dos favoritos. Tente novamente.'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  isFavorite: (productId: string) => {
    return get().favorites.some((fav) => fav.productId === productId)
  },

  clearError: () => {
    set({ error: null })
  },
}))

