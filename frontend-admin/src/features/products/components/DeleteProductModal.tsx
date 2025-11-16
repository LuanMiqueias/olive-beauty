import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Product } from '@/shared/types'

interface DeleteProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  product: Product | null
  isLoading?: boolean
}

export function DeleteProductModal({
  open,
  onOpenChange,
  onConfirm,
  product,
  isLoading = false,
}: DeleteProductModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full mx-4">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Você está prestes a deletar o produto <strong>{product?.name}</strong>.
          </p>
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <p className="text-sm text-destructive font-medium mb-2">
              ⚠️ Aviso Importante
            </p>
            <p className="text-sm text-muted-foreground">
              Todos os dados relacionados serão deletados automaticamente (cascata):
            </p>
            <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
              <li>Variantes do produto</li>
              <li>Imagens do produto</li>
              <li>Itens do carrinho relacionados</li>
              <li>Itens de pedidos relacionados</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Esta ação é irreversível.
            </p>
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Deletando...' : 'Confirmar Exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

