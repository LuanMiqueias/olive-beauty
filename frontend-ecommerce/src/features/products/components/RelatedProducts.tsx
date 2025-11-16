import { Product } from '@/shared/types'
import { ProductCard } from '@/shared/components/ProductCard'

interface RelatedProductsProps {
  products: Product[]
  title?: string
}

export function RelatedProducts({
  products,
  title = 'Produtos Relacionados',
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

