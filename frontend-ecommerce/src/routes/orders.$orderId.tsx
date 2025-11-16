import { createFileRoute } from '@tanstack/react-router'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderDetailPageWrapper,
})

function OrderDetailPageWrapper() {
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

  return <OrderDetailPage />
}

