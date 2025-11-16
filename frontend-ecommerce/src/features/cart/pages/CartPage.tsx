import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useCartStore } from '@/shared/stores'
import { CartItem } from '@/shared/types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { RemoveItemModal } from '../components/RemoveItemModal'
import { ClearCartModal } from '../components/ClearCartModal'
import { EmptyState, EmptyCartIcon } from '@/shared/components/EmptyState'

export function CartPage() {
  const navigate = useNavigate()
  const { cart, getCart, updateItem, removeItem, clearCart, isLoading } = useCartStore()
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null)
  const [showClearModal, setShowClearModal] = useState(false)

  useEffect(() => {
    getCart()
  }, [getCart])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    // Find item to check stock
    const item = cart?.items.find(i => i.id === itemId)
    if (item?.productVariant && newQuantity > item.productVariant.stock) {
      // Stock validation will be handled by backend, but we can show a warning
      return
    }
    
    try {
      await updateItem(itemId, { quantity: newQuantity })
      // Cart is automatically updated by the store
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error)
    }
  }

  const handleRemoveItem = async () => {
    if (!itemToRemove) return
    try {
      await removeItem(itemToRemove.id)
      setItemToRemove(null)
      // Cart is automatically updated by the store
    } catch (error) {
      console.error('Erro ao remover item:', error)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      setShowClearModal(false)
      // Cart is automatically updated by the store
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
    }
  }

  const calculateSubtotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => {
      const price = item.productVariant?.price || item.product?.basePrice || 0
      return total + price * item.quantity
    }, 0)
  }

  const calculateShipping = () => {
    // Simulated shipping: R$ 10.00 fixed
    return 10.0
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const parseAttributes = (attributes: string) => {
    try {
      return JSON.parse(attributes)
    } catch {
      return {}
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>
        <EmptyState
          title="Seu carrinho está vazio"
          description="Adicione produtos ao carrinho para continuar comprando."
          icon={<EmptyCartIcon />}
          actionLabel="Continuar Comprando"
          onAction={() => navigate({ to: '/products' })}
        />
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const shipping = calculateShipping()
  const total = calculateTotal()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.product
            const variant = item.productVariant
            const price = variant?.price || product?.basePrice || 0
            const itemTotal = price * item.quantity
            const coverImage = product?.images?.find((img) => img.isCover) || product?.images?.[0]
            const variantAttrs = variant ? parseAttributes(variant.attributes) : {}

            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <Link
                      to="/products/$productId"
                      params={{ productId: product?.id || '' }}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted">
                        {coverImage ? (
                          <img
                            src={coverImage.url}
                            alt={product?.name || 'Produto'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Sem imagem
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <Link
                          to="/products/$productId"
                          params={{ productId: product?.id || '' }}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {product?.name}
                        </Link>
                        {variant && (
                          <p className="text-sm text-muted-foreground">
                            {Object.entries(variantAttrs)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(', ')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            R$ {price.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total: R$ {itemTotal.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={
                              variant
                                ? variant.stock <= item.quantity
                                : false
                            }
                          >
                            +
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setItemToRemove(item)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remover
                        </Button>
                      </div>

                      {variant && variant.stock < item.quantity && (
                        <p className="text-sm text-destructive">
                          Estoque insuficiente. Disponível: {variant.stock}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Clear Cart Button */}
          <Button
            variant="outline"
            onClick={() => setShowClearModal(true)}
            className="w-full md:w-auto"
          >
            Limpar Carrinho
          </Button>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span>R$ {shipping.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate({ to: '/checkout' })}
                >
                  Finalizar Compra
                </Button>
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Remove Item Modal */}
      {itemToRemove && (
        <RemoveItemModal
          item={itemToRemove}
          open={!!itemToRemove}
          onOpenChange={(open) => !open && setItemToRemove(null)}
          onConfirm={handleRemoveItem}
        />
      )}

      {/* Clear Cart Modal */}
      <ClearCartModal
        open={showClearModal}
        onOpenChange={setShowClearModal}
        onConfirm={handleClearCart}
      />
    </div>
  )
}

