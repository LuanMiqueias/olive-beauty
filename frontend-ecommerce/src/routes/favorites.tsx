import { createFileRoute } from '@tanstack/react-router'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'
import { FavoritesPage } from '@/features/favorites/pages/FavoritesPage'

export const Route = createFileRoute('/favorites')({
  component: FavoritesPageWrapper,
})

function FavoritesPageWrapper() {
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

  return <FavoritesPage />
}

