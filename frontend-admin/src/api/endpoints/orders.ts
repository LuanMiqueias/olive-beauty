import { apiClient } from '../client'
import { Order, UpdateOrderStatusDTO, ApiResponse } from '@/shared/types'

export interface ListOrdersQuery {
  status?: string
  startDate?: string
  endDate?: string
  search?: string
  sortBy?: 'createdAt' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export const ordersApi = {
  listAll: async (query?: ListOrdersQuery): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', {
      params: query,
    })
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
    }
    throw new Error(response.data.message || 'Erro ao buscar pedidos')
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao buscar pedido')
  },

  updateStatus: async (id: string, data: UpdateOrderStatusDTO): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}/status`, data)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao atualizar status do pedido')
  },
}

