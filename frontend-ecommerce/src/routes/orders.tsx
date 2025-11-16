import { createFileRoute } from '@tanstack/react-router'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'
import { OrdersPage } from '@/features/orders/pages/OrdersPage'

export const Route = createFileRoute('/orders')({
  component: OrdersPageWrapper,
})

function OrdersPageWrapper() {
  const { isAuthenticated, isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useRequireAuth
  }

  return <OrdersPage />
}

