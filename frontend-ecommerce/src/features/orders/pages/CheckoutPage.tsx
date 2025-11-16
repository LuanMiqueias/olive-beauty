import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCartStore } from '@/shared/stores'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { CheckoutProcessModal } from '../components/CheckoutProcessModal'
import { formatCurrency } from '@/shared/lib/utils'
import { Order } from '@/shared/types'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, getCart } = useCartStore()
  const [shippingName, setShippingName] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingPhone, setShippingPhone] = useState('')
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCart()
  }, [getCart])

  useEffect(() => {
    // Redirect if cart is empty
    if (cart && cart.items.length === 0) {
      navigate({ to: '/cart' })
    }
  }, [cart, navigate])

  const validateForm = () => {
    if (!shippingName.trim()) {
      setError('Nome completo é obrigatório')
      return false
    }
    if (!shippingAddress.trim()) {
      setError('Endereço completo é obrigatório')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowProcessModal(true)
    }
  }

  const handleOrderSuccess = (order: Order) => {
    // Order was successfully created
    // Modal will remain open showing success view - user must click a button to close
    // Navigation will be handled by CheckoutSuccessView buttons
  }

  const calculateSubtotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => {
      const price = item.productVariant?.price || item.product?.basePrice || 0
      return total + price * item.quantity
    }, 0)
  }

  const calculateShipping = () => {
    return 10.0 // Fixed shipping
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  if (!cart) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-96 bg-muted rounded" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.
            </p>
            <div className="mt-4 text-center">
              <Button onClick={() => navigate({ to: '/products' })}>
                Continuar Comprando
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingName">
                    Nome Completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="shippingName"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">
                    Endereço Completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="shippingAddress"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Rua, número, complemento, bairro, cidade, CEP"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingPhone">Telefone (opcional)</Label>
                  <Input
                    id="shippingPhone"
                    type="tel"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continuar para Confirmação
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                {cart.items.map((item) => {
                  const price = item.productVariant?.price || item.product?.basePrice || 0
                  const parseAttributes = (attributes: string) => {
                    try {
                      return JSON.parse(attributes)
                    } catch {
                      return {}
                    }
                  }
                  const variantAttributes = item.productVariant
                    ? parseAttributes(item.productVariant.attributes || '{}')
                    : {}
                  const variantText =
                    Object.keys(variantAttributes).length > 0
                      ? Object.entries(variantAttributes)
                          .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : String(value)}`)
                          .join(', ')
                      : null
                  return (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                        {item.product?.images?.find((img) => img.isCover)?.url ? (
                          <img
                            src={item.product.images.find((img) => img.isCover)!.url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
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
                          Qtd: {item.quantity} × {formatCurrency(price)}
                        </p>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(price * item.quantity)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span>{formatCurrency(calculateShipping())}</span>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(calculateTotal())}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Process Modal */}
      <CheckoutProcessModal
        open={showProcessModal}
        onOpenChange={setShowProcessModal}
        cart={cart}
        shippingName={shippingName}
        shippingAddress={shippingAddress}
        shippingPhone={shippingPhone}
        onSuccess={handleOrderSuccess}
      />
    </div>
  )
}

