import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { OrdersByStatus, OrderStatus } from '@/shared/types'

interface OrdersByStatusChartProps {
  data: OrdersByStatus[]
  isLoading?: boolean
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#f59e0b', // amber
  PROCESSING: '#3b82f6', // blue
  SENT: '#8b5cf6', // purple
  DELIVERED: '#10b981', // green
  CANCELLED: '#ef4444', // red
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Em Processamento',
  SENT: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export function OrdersByStatusChart({ data, isLoading }: OrdersByStatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos por Status</CardTitle>
          <CardDescription>Distribuição de pedidos por status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos por Status</CardTitle>
          <CardDescription>Distribuição de pedidos por status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Nenhum dado disponível</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status],
    value: item.count,
    color: STATUS_COLORS[item.status],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos por Status</CardTitle>
        <CardDescription>Distribuição de pedidos por status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

