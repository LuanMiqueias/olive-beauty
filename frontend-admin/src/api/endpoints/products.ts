import { apiClient } from '../client'
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ApiResponse,
} from '@/shared/types'

export interface ListProductsQuery {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'createdAt'
}

export const productsApi = {
  list: async (query?: ListProductsQuery): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params: query,
    })
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
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

  create: async (data: CreateProductDTO): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao criar produto')
  },

  update: async (id: string, data: UpdateProductDTO): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao atualizar produto')
  },

  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/products/${id}`)
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Erro ao deletar produto')
    }
  },
}

