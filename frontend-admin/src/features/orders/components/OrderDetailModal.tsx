import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Order, OrderStatus } from '@/shared/types'
import { OrderStatusBadge } from './OrderStatusBadge'
import { UpdateStatusModal } from './UpdateStatusModal'
import { formatCurrency } from '@/shared/lib/utils'
import { useState } from 'react'

interface OrderDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onStatusUpdate: (status: OrderStatus) => Promise<void>
  isLoading?: boolean
}

export function OrderDetailModal({
  open,
  onOpenChange,
  order,
  onStatusUpdate,
  isLoading = false,
}: OrderDetailModalProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  if (!order) return null

  const handleStatusUpdate = async (status: OrderStatus) => {
    await onStatusUpdate(status)
    setIsStatusModalOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{order.id.slice(0, 8)}</DialogTitle>
            <DialogDescription>Informações completas do pedido</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Criação:</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última Atualização:</span>
                  <span>
                    {new Date(order.updatedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span>{order.user?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{order.user?.email || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID do Usuário:</span>
                  <span className="font-mono text-xs">{order.userId}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Nome Completo:</span>
                  <p className="font-medium">{order.shippingName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Endereço:</span>
                  <p className="font-medium whitespace-pre-line">
                    {typeof order.shippingAddress === 'string'
                      ? order.shippingAddress
                      : JSON.stringify(order.shippingAddress, null, 2)}
                  </p>
                </div>
                {order.shippingPhone && (
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{order.shippingPhone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Itens do Pedido ({order.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Imagem</TableHead>
                          <TableHead>Produto</TableHead>
                          <TableHead>Variante</TableHead>
                          <TableHead className="text-right">Quantidade</TableHead>
                          <TableHead className="text-right">Preço Unit.</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => {
                          const variant = item.productVariant
                          const variantAttributes =
                            variant && typeof variant.attributes === 'string'
                              ? JSON.parse(variant.attributes)
                              : variant?.attributes || {}
                          const product = item.product
                          const productImage = product && Array.isArray(product.images)
                            ? (product.images.find((img: { isCover: boolean }) => img.isCover) || product.images[0])
                            : undefined

                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                {productImage ? (
                                  <img
                                    src={productImage.url}
                                    alt={product?.name || 'Produto'}
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%23ddd"/%3E%3C/svg%3E'
                                    }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-muted-foreground"
                                    >
                                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                      <circle cx="9" cy="9" r="2" />
                                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {product?.name || '-'}
                              </TableCell>
                              <TableCell>
                                {Object.entries(variantAttributes).map(([key, value]) => (
                                  <span key={key} className="mr-2 text-sm">
                                    <strong>{key}:</strong> {value as string}
                                  </span>
                                ))}
                              </TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.price)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum item encontrado
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total do Pedido:</span>
                  <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
            <Button
              onClick={() => setIsStatusModalOpen(true)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Atualizar Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpdateStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        onConfirm={handleStatusUpdate}
        currentStatus={order.status}
        isLoading={isLoading}
      />
    </>
  )
}

