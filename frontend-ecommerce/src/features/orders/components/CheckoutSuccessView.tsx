import { useNavigate } from '@tanstack/react-router'
import { Order } from '@/shared/types'
import { formatCurrency, parseVariantAttributes } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'

interface CheckoutSuccessViewProps {
  order: Order
  onClose: () => void
}

export function CheckoutSuccessView({ order, onClose }: CheckoutSuccessViewProps) {
  const navigate = useNavigate()

  const handleViewOrder = () => {
    onClose()
    navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
  }

  const handleContinueShopping = () => {
    onClose()
    navigate({ to: '/products', search: { categoryId: undefined, search: undefined, brand: undefined, minPrice: undefined, maxPrice: undefined, sortBy: 'createdAt' } })
  }

  const handleClose = () => {
    onClose()
    navigate({ to: '/orders' })
  }

  return (
    <div className="space-y-6 py-4">
      {/* Success Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-10 w-10 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold">Pedido criado com sucesso!</h3>
        <p className="text-muted-foreground">
          Pedido #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Order Summary */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4">Resumo do Pedido</h4>
          
          {/* Items List */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {order.items.map((item) => {
              const variantAttributes = item.productVariant
                ? parseVariantAttributes(item.productVariant.attributes || '{}')
                : {}
              const variantText =
                Object.keys(variantAttributes).length > 0
                  ? Object.entries(variantAttributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')
                  : null

              return (
                <div key={item.id} className="flex gap-3 text-sm pb-3 border-b last:border-0">
                  <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                    {item.product?.images?.find((img) => img.isCover)?.url ? (
                      <img
                        src={item.product.images.find((img) => img.isCover)!.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product?.name}</p>
                    {variantText && (
                      <p className="text-muted-foreground text-xs">
                        Variante: {variantText}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      Qtd: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>
                {formatCurrency(
                  order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Frete</span>
              <span>
                {formatCurrency(order.total - order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3">Informações de Entrega</h4>
          <div className="text-sm space-y-2 text-muted-foreground">
            <p>
              <strong className="text-foreground">Nome:</strong> {order.shippingName}
            </p>
            <p>
              <strong className="text-foreground">Endereço:</strong> {order.shippingAddress}
            </p>
            {order.shippingPhone && (
              <p>
                <strong className="text-foreground">Telefone:</strong> {order.shippingPhone}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={handleViewOrder} className="flex-1" size="lg">
          Ver Detalhes do Pedido
        </Button>
        <Button onClick={handleContinueShopping} variant="outline" className="flex-1" size="lg">
          Continuar Comprando
        </Button>
        <Button onClick={handleClose} variant="ghost" className="flex-1" size="lg">
          Fechar
        </Button>
      </div>
    </div>
  )
}

