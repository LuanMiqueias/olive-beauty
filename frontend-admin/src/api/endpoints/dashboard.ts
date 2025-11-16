import { apiClient } from '../client'
import {
  DashboardStats,
  TopProduct,
  TimeSeriesData,
  OrdersByStatus,
  SalesByCategory,
  ApiResponse,
} from '@/shared/types'

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats')
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Erro ao buscar estatísticas')
  },

  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    const response = await apiClient.get<ApiResponse<TopProduct[]>>('/dashboard/top-products', {
      params: { limit },
    })
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
    }
    throw new Error(response.data.message || 'Erro ao buscar produtos mais vendidos')
  },

  getRevenueOverTime: async (days: number = 7): Promise<TimeSeriesData[]> => {
    const response = await apiClient.get<ApiResponse<TimeSeriesData[]>>(
      '/dashboard/revenue-over-time',
      {
        params: { days },
      }
    )
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
    }
    throw new Error(response.data.message || 'Erro ao buscar receita ao longo do tempo')
  },

  getOrdersOverTime: async (days: number = 7): Promise<TimeSeriesData[]> => {
    const response = await apiClient.get<ApiResponse<TimeSeriesData[]>>(
      '/dashboard/orders-over-time',
      {
        params: { days },
      }
    )
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
    }
    throw new Error(response.data.message || 'Erro ao buscar pedidos ao longo do tempo')
  },

  getOrdersByStatus: async (days: number = 7): Promise<OrdersByStatus[]> => {
    const response = await apiClient.get<ApiResponse<OrdersByStatus[]>>(
      '/dashboard/orders-by-status',
      {
        params: { days },
      }
    )
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
    }
    throw new Error(response.data.message || 'Erro ao buscar pedidos por status')
  },

  getSalesByCategory: async (days: number = 7): Promise<SalesByCategory[]> => {
    const response = await apiClient.get<ApiResponse<SalesByCategory[]>>(
      '/dashboard/sales-by-category',
      {
        params: { days },
      }
    )
    if (response.data.status === 'success' && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : []
    }
    throw new Error(response.data.message || 'Erro ao buscar vendas por categoria')
  },
}
