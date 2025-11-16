import { useState, useEffect } from 'react'
import { ordersApi, ListOrdersQuery } from '@/api/endpoints'
import { Order, OrderStatus } from '@/shared/types'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { OrderDetailModal } from '../components/OrderDetailModal'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { formatCurrency } from '@/shared/lib/utils'
import { TableRowSkeleton } from '@/shared/components/Skeleton'
import { ErrorState } from '@/shared/components/ErrorState'
import { useToastContext } from '@/shared/components/ToastProvider'

export function OrdersPage() {
  const { success } = useToastContext()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<ListOrdersQuery['sortBy']>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Load orders
  useEffect(() => {
    loadOrders()
  }, [statusFilter, sortBy, sortOrder, searchQuery])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const query: ListOrdersQuery = {}

      if (statusFilter !== 'all') {
        query.status = statusFilter
      }
      if (searchQuery.trim()) {
        query.search = searchQuery.trim()
      }
      if (sortBy) {
        query.sortBy = sortBy
        query.sortOrder = sortOrder
      }

      const data = await ordersApi.listAll(query)
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!selectedOrder) return

    try {
      setIsUpdatingStatus(true)
      setError(null)
      const updatedOrder = await ordersApi.updateStatus(selectedOrder.id, { status })
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      )
      setSelectedOrder(updatedOrder)
      success('Status do pedido atualizado com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status'
      setError(errorMessage)
      throw err
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const getItemsCount = (order: Order) => {
    if (!order.items || !Array.isArray(order.items)) return 0
    return order.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pedidos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os pedidos da loja
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Itens</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={7} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os pedidos da loja
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && !isLoading && (
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null)
            loadOrders()
          }}
        />
      )}

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Input
            placeholder="Buscar por ID do pedido ou cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="PROCESSING">Em Processamento</SelectItem>
            <SelectItem value="SENT">Enviado</SelectItem>
            <SelectItem value="DELIVERED">Entregue</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Ordenar por:</span>
        <Select
          value={sortBy || 'createdAt'}
          onValueChange={(value) => setSortBy(value as ListOrdersQuery['sortBy'])}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Data</SelectItem>
            <SelectItem value="total">Total</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Decrescente</SelectItem>
            <SelectItem value="asc">Crescente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Pedidos ({orders.length})</CardTitle>
          <CardDescription>Lista de todos os pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pedido encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Itens</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {order.user?.name || order.user?.email || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getItemsCount(order)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailModal(order)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum pedido encontrado
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Pedido #{order.id.slice(0, 8)}
                </CardTitle>
                <CardDescription>
                  <div className="mt-2 space-y-1">
                    <div>Cliente: {order.user?.name || order.user?.email || '-'}</div>
                    <div>
                      Data:{' '}
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </div>
                    <div>
                      Status: <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="font-medium">
                      Total: {formatCurrency(order.total)}
                    </div>
                    <div>Itens: {getItemsCount(order)}</div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDetailModal(order)}
                  className="w-full"
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <OrderDetailModal
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open)
          if (!open) setSelectedOrder(null)
        }}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
        isLoading={isUpdatingStatus}
      />
    </div>
  )
}

