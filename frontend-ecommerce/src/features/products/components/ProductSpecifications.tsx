import { Product } from '@/shared/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface ProductSpecificationsProps {
  product: Product
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  // Dados mockados de especificações (podem ser expandidos)
  const specifications = {
    'Marca': product.brand || 'Olive Beauty',
    'Categoria': product.category?.name || 'Não especificado',
    'Tipo': product.category?.name || 'Produto de Beleza',
    'Volume': product.variants?.[0]?.attributes 
      ? JSON.parse(product.variants[0].attributes)?.volume || 'Não especificado'
      : 'Não especificado',
    'Cor': product.variants?.[0]?.attributes
      ? JSON.parse(product.variants[0].attributes)?.cor || 'Não especificado'
      : 'Não especificado',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Características do produto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(specifications).map(([key, value]) => (
            <div
              key={key}
              className="flex border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="w-1/3 font-medium text-muted-foreground">{key}</div>
              <div className="flex-1 text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

