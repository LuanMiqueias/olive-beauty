import { apiClient } from '../client'
import { Category, CreateCategoryDTO, UpdateCategoryDTO, ApiResponse } from '@/shared/types'

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories')
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
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

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao criar categoria')
  },

  update: async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao atualizar categoria')
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/categories/${id}`)
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Erro ao deletar categoria')
    }
  },
}

