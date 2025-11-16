import { apiClient } from '../client'
import { Product } from '@/shared/types'
import { ApiResponse } from '@/shared/types'

export interface ListProductsParams {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'createdAt'
}

export const productsApi = {
  getAll: async (params?: ListProductsParams): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params,
    })
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao buscar produtos')
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao buscar produto')
  },
}

