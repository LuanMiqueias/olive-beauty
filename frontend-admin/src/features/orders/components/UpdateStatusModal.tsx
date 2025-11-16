import { useState, useEffect } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { OrderStatus } from '@/shared/types'
import { OrderStatusBadge } from './OrderStatusBadge'

interface UpdateStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (status: OrderStatus) => Promise<void>
  currentStatus: OrderStatus
  isLoading?: boolean
}

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'PROCESSING', label: 'Em Processamento' },
  { value: 'SENT', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregue' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export function UpdateStatusModal({
  open,
  onOpenChange,
  onConfirm,
  currentStatus,
  isLoading = false,
}: UpdateStatusModalProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus>(currentStatus)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    setNewStatus(currentStatus)
    setShowConfirmation(false)
  }, [currentStatus, open])

  const handleConfirm = async () => {
    try {
      await onConfirm(newStatus)
      setShowConfirmation(false)
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  const handleStatusChange = (value: string) => {
    setNewStatus(value as OrderStatus)
    if (value !== currentStatus) {
      setShowConfirmation(true)
    } else {
      setShowConfirmation(false)
    }
  }

  return (
    <>
      <Dialog open={open && !showConfirmation} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] w-full mx-4">
          <DialogHeader>
            <DialogTitle>Atualizar Status do Pedido</DialogTitle>
            <DialogDescription>
              Selecione o novo status para este pedido
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status Atual</label>
              <OrderStatusBadge status={currentStatus} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Novo Status</label>
              <Select value={newStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => setShowConfirmation(true)}
              disabled={isLoading || newStatus === currentStatus}
              className="w-full sm:w-auto"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[500px] w-full mx-4">
          <DialogHeader>
            <DialogTitle>Confirmar Atualização</DialogTitle>
            <DialogDescription>
              Deseja realmente atualizar o status do pedido?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-md">
              <div>
                <p className="text-sm text-muted-foreground">Status Atual</p>
                <OrderStatusBadge status={currentStatus} />
              </div>
              <div className="text-muted-foreground">→</div>
              <div>
                <p className="text-sm text-muted-foreground">Novo Status</p>
                <OrderStatusBadge status={newStatus} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Atualizando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

