import { apiClient } from '../client'
import { Category } from '@/shared/types'
import { ApiResponse } from '@/shared/types'

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories')
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao buscar categorias')
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao buscar categoria')
  },
}

