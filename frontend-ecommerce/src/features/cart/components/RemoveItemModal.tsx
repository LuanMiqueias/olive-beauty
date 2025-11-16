import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { CartItem } from '@/shared/types'

interface RemoveItemModalProps {
  item: CartItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function RemoveItemModal({
  item,
  open,
  onOpenChange,
  onConfirm,
}: RemoveItemModalProps) {
  const product = item.product
  const variant = item.productVariant

  const parseAttributes = (attributes: string) => {
    try {
      return JSON.parse(attributes)
    } catch {
      return {}
    }
  }

  const variantAttrs = variant ? parseAttributes(variant.attributes) : {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover Item do Carrinho</DialogTitle>
          <DialogDescription>
            Deseja remover este item do carrinho?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <p className="font-medium">{product?.name}</p>
            {variant && (
              <p className="text-sm text-muted-foreground">
                {Object.entries(variantAttrs)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Quantidade: {item.quantity}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

