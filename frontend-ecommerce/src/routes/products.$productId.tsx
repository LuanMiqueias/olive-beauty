import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
})

