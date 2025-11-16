import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Cart } from '@/shared/types'
import { formatCurrency } from '@/shared/lib/utils'

interface ConfirmOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: Cart | null
  shippingName: string
  shippingAddress: string
  shippingPhone?: string
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmOrderModal({
  open,
  onOpenChange,
  cart,
  shippingName,
  shippingAddress,
  shippingPhone,
  onConfirm,
  isLoading = false,
}: ConfirmOrderModalProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Pedido</DialogTitle>
          <DialogDescription>
            Revise as informações antes de confirmar seu pedido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {cart?.items.map((item) => {
                const price = item.productVariant?.price || item.product?.basePrice || 0
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>{formatCurrency(price * item.quantity)}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>{formatCurrency(calculateShipping())}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
            <div className="text-sm space-y-1 border rounded-md p-3">
              <p>
                <strong>Nome:</strong> {shippingName}
              </p>
              <p>
                <strong>Endereço:</strong> {shippingAddress}
              </p>
              {shippingPhone && (
                <p>
                  <strong>Telefone:</strong> {shippingPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Confirmar Pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

