import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { Product, ProductVariant } from '@/shared/types'
import { productsApi } from '@/api/endpoints/products'
import { useCartStore } from '@/shared/stores'
import { useFavoritesStore } from '@/shared/stores'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { ProductImageGallery } from '../components/ProductImageGallery'
import { ProductInfo } from '../components/ProductInfo'
import { VariantSelector } from '../components/VariantSelector'
import { QuantitySelector } from '../components/QuantitySelector'
import { ProductActions } from '../components/ProductActions'
import { ProductSpecifications } from '../components/ProductSpecifications'
import { RelatedProducts } from '../components/RelatedProducts'
import { hasFreeShipping } from '@/shared/lib/utils'

export function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })
  const navigate = useNavigate()
  const { addItem, isLoading: cartLoading } = useCartStore()
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const productData = await productsApi.getById(productId)
        setProduct(productData)
        
        // Set first variant as default if available
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }

        // Fetch related products (same category)
        if (productData.categoryId) {
          try {
            const related = await productsApi.getAll({
              categoryId: productData.categoryId,
              sortBy: 'createdAt',
            })
            setRelatedProducts(related.filter((p) => p.id !== productId).slice(0, 4))
          } catch (err) {
            // Silently fail related products
            console.warn('Erro ao buscar produtos relacionados:', err)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error)
        setError('Produto não encontrado')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite(productId)) {
        await removeFavorite(productId)
      } else {
        await addFavorite(productId)
      }
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    try {
      await addItem({
        productId: product.id,
        productVariantId: selectedVariant?.id,
        quantity,
      })
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    // Navegar para o carrinho após adicionar
    setTimeout(() => {
      navigate({ to: '/cart' })
    }, 500)
  }

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setQuantity(1) // Reset quantity when variant changes
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-6">
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-16 bg-muted rounded" />
              <div className="h-12 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O produto que você está procurando não existe ou foi removido.
        </p>
        <Link to="/products" search={{ categoryId: undefined, search: undefined, brand: undefined, minPrice: undefined, maxPrice: undefined, sortBy: undefined }}>
          <Button size="lg">Voltar para Produtos</Button>
        </Link>
      </div>
    )
  }

  const images = product.images || []
  const currentPrice = selectedVariant?.price || product.basePrice
  const currentStock = selectedVariant?.stock ?? (product.variants?.[0]?.stock ?? 0)
  const hasStock = currentStock > 0
  const maxQuantity = hasStock ? currentStock : 0
  const freeShipping = hasFreeShipping(currentPrice)

  return (
    <div className="container py-6 md:py-8 space-y-8">
      {/* Layout Principal - Estilo Mercado Livre */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
        {/* Coluna Esquerda - Galeria de Imagens */}
        <div>
          <ProductImageGallery
            images={images}
            productName={product.name}
            hasFreeShipping={freeShipping}
          />
        </div>

        {/* Coluna Direita - Informações do Produto */}
        <div className="space-y-6">
          <ProductInfo
            product={product}
            currentPrice={currentPrice}
            currentStock={currentStock}
          />

          {/* Variantes */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={handleSelectVariant}
            />
          )}

          {/* Quantidade e Ações */}
          {hasStock && (
            <QuantitySelector
              quantity={quantity}
              maxQuantity={maxQuantity}
              onIncrease={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isAddingToCart || cartLoading}
            />
          )}

          <ProductActions
            hasStock={hasStock}
            isAddingToCart={isAddingToCart}
            isFavorite={isFavorite(productId)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleFavorite={handleToggleFavorite}
            cartLoading={cartLoading}
          />
        </div>
      </div>

      {/* Descrição do Produto */}
      {product.description && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Descrição</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Especificações */}
      <ProductSpecifications product={product} />

      {/* Informações Adicionais */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Informações de Compra</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Frete</h3>
              <p className="text-sm text-muted-foreground">
                {freeShipping
                  ? 'Frete grátis para todo o Brasil'
                  : 'Calcule o frete no checkout'}
              </p>
              {freeShipping && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Produto elegível para frete grátis
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Devolução</h3>
              <p className="text-sm text-muted-foreground">
                Devolução grátis em até 7 dias após o recebimento
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Garantia</h3>
              <p className="text-sm text-muted-foreground">
                Garantia de 90 dias contra defeitos de fabricação
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Formas de Pagamento</h3>
              <p className="text-sm text-muted-foreground">
                Cartão de Crédito, PIX, Boleto Bancário
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  )
}
