import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { SalesByCategory } from '@/shared/types'
import { formatCurrency } from '@/shared/lib/utils'

interface SalesByCategoryChartProps {
  data: SalesByCategory[]
  isLoading?: boolean
}

export function SalesByCategoryChart({ data, isLoading }: SalesByCategoryChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Categoria</CardTitle>
          <CardDescription>Receita e quantidade por categoria</CardDescription>
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
          <CardTitle>Vendas por Categoria</CardTitle>
          <CardDescription>Receita e quantidade por categoria</CardDescription>
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
    name: item.category.name,
    receita: item.revenue,
    quantidade: item.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por Categoria</CardTitle>
        <CardDescription>Receita e quantidade por categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'receita') {
                  return [formatCurrency(value), 'Receita']
                }
                return [value, 'Quantidade']
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="receita"
              fill="hsl(var(--primary))"
              name="Receita"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="quantidade"
              fill="hsl(var(--accent))"
              name="Quantidade"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

