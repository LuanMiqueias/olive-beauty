import { createFileRoute, Outlet, useMatchRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products/pages/ProductsPage'

export const Route = createFileRoute('/products')({
  component: ProductsLayout,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      categoryId: (search.categoryId as string) || undefined,
      search: (search.search as string) || undefined,
      brand: (search.brand as string) || undefined,
      minPrice: search.minPrice ? Number(search.minPrice) : undefined,
      maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
      sortBy: (search.sortBy as 'price_asc' | 'price_desc' | 'name' | 'createdAt') || undefined,
    }
  },
})

function ProductsLayout() {
  const matchRoute = useMatchRoute()
  const isProductDetail = matchRoute({ to: '/products/$productId' })
  
  return (
    <>
      {!isProductDetail && <ProductsPage />}
      <Outlet />
    </>
  )
}

