import { createFileRoute } from '@tanstack/react-router'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'
import { CheckoutPage } from '@/features/orders/pages/CheckoutPage'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPageWrapper,
})

function CheckoutPageWrapper() {
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

  return <CheckoutPage />
}

