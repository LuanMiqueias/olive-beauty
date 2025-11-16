import { apiClient } from '../client'
import { Order, CreateOrderDTO, ApiResponse } from '@/shared/types'

export const ordersApi = {
  create: async (data: CreateOrderDTO): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data)
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao criar pedido')
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/my-orders')
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
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
}

