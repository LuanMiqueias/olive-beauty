import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { TopProduct } from '@/shared/types'
import { formatCurrency } from '@/shared/lib/utils'

interface TopProductsTableProps {
  data: TopProduct[]
  isLoading?: boolean
}

export function TopProductsTable({ data, isLoading }: TopProductsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Top produtos por quantidade vendida</CardDescription>
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
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Top produtos por quantidade vendida</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Nenhum produto encontrado</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
        <CardDescription>Top produtos por quantidade vendida</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Produto</th>
                <th className="text-right p-2 font-medium">Quantidade</th>
                <th className="text-right p-2 font-medium">Receita</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.product.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-medium">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        {item.product.category && (
                          <div className="text-sm text-muted-foreground">
                            {item.product.category.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-right p-2 font-medium">{item.totalSold}</td>
                  <td className="text-right p-2 font-medium">
                    {item.revenue ? formatCurrency(item.revenue) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

