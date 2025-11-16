import { Badge } from '@/shared/components/ui/badge'
import { OrderStatus } from '@/shared/types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pendente', variant: 'secondary' },
  PROCESSING: { label: 'Em Processamento', variant: 'default' },
  SENT: { label: 'Enviado', variant: 'default' },
  DELIVERED: { label: 'Entregue', variant: 'default' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'outline' }
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}

