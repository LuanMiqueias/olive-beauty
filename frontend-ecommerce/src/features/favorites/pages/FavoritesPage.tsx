import { useEffect, useState } from 'react'
import { useFavoritesStore } from '@/shared/stores'
import { Favorite } from '@/shared/types'
import { FavoriteProductCard } from '../components/FavoriteProductCard'
import { RemoveFavoriteModal } from '../components/RemoveFavoriteModal'
import { ProductCardSkeleton } from '@/shared/components/Skeleton'
import { EmptyState, EmptyFavoritesIcon } from '@/shared/components/EmptyState'
import { Link } from '@tanstack/react-router'

export function FavoritesPage() {
  const { favorites, getFavorites, removeFavorite, isLoading } = useFavoritesStore()
  const [favoriteToRemove, setFavoriteToRemove] = useState<Favorite | null>(null)

  useEffect(() => {
    getFavorites()
  }, [getFavorites])

  const handleRemoveFavorite = async () => {
    if (!favoriteToRemove) return
    try {
      await removeFavorite(favoriteToRemove.productId)
      setFavoriteToRemove(null)
      // Favorites list is automatically updated by the store
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>
        <EmptyState
          title="Nenhum favorito ainda"
          description="Adicione produtos aos seus favoritos para encontrá-los facilmente depois."
          icon={<EmptyFavoritesIcon />}
          actionLabel="Explorar Produtos"
          onAction={() => window.location.href = '/products'}
        />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>
      <p className="text-muted-foreground mb-6">
        {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => {
          if (!favorite.product) return null
          return (
            <FavoriteProductCard
              key={favorite.id}
              favorite={favorite}
              onRemove={() => setFavoriteToRemove(favorite)}
            />
          )
        })}
      </div>

      {/* Remove Favorite Modal */}
      {favoriteToRemove && (
        <RemoveFavoriteModal
          favorite={favoriteToRemove}
          open={!!favoriteToRemove}
          onOpenChange={(open) => !open && setFavoriteToRemove(null)}
          onConfirm={handleRemoveFavorite}
        />
      )}
    </div>
  )
}

