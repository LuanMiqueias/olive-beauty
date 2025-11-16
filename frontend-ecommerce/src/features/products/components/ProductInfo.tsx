import { Link } from '@tanstack/react-router'
import { Product } from '@/shared/types'
import { Badge } from '@/shared/components/ui/badge'
import { formatCurrency, calculateInstallment, getStockStatus, hasFreeShipping, getMockRating } from '@/shared/lib/utils'

interface ProductInfoProps {
  product: Product
  currentPrice: number
  currentStock: number
}

function RatingStars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  const gradientId = `rating-${rating}-${reviewCount}`

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={gradientId}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gradientId})`}
              d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-5 h-5 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        ({reviewCount} avaliações)
      </span>
    </div>
  )
}

export function ProductInfo({ product, currentPrice, currentStock }: ProductInfoProps) {
  const stockStatus = getStockStatus(currentStock)
  const installment = calculateInstallment(currentPrice)
  const freeShipping = hasFreeShipping(currentPrice)
  const { rating, reviewCount } = getMockRating(product.id)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              to="/products"
              search={{ categoryId: product.category.id, search: undefined, brand: undefined, minPrice: undefined, maxPrice: undefined, sortBy: undefined }}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      {/* Condição e Marca */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          Novo
        </Badge>
        {product.brand && (
          <Badge variant="outline" className="text-sm">
            {product.brand}
          </Badge>
        )}
      </div>

      {/* Título */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
        {product.category && (
          <Link
            to="/products"
            search={{ categoryId: product.category.id, search: undefined, brand: undefined, minPrice: undefined, maxPrice: undefined, sortBy: undefined }}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            {product.category.name}
          </Link>
        )}
      </div>

      {/* Avaliações */}
      <RatingStars rating={rating} reviewCount={reviewCount} />

      {/* Preço */}
      <div className="space-y-2">
        <p className="text-4xl md:text-5xl font-bold text-primary">
          {formatCurrency(currentPrice)}
        </p>
        {installment && (
          <p className="text-lg text-muted-foreground">{installment}</p>
        )}
        {freeShipping && (
          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Frete grátis
          </p>
        )}
      </div>

      {/* Estoque */}
      <div>
        {currentStock === 0 ? (
          <Badge variant="destructive" className="text-base px-3 py-1">
            Sem estoque
          </Badge>
        ) : (
          <Badge
            variant={stockStatus.variant}
            className={`text-base px-3 py-1 ${
              stockStatus.variant === 'secondary' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''
            }`}
          >
            {stockStatus.label}
            {currentStock > 0 && currentStock <= 5 && ` (${currentStock} unidades)`}
          </Badge>
        )}
      </div>
    </div>
  )
}

