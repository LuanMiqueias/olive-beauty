import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Favorite } from '@/shared/types'

interface RemoveFavoriteModalProps {
  favorite: Favorite
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function RemoveFavoriteModal({
  favorite,
  open,
  onOpenChange,
  onConfirm,
}: RemoveFavoriteModalProps) {
  const product = favorite.product

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover dos Favoritos</DialogTitle>
          <DialogDescription>
            Deseja remover este produto dos favoritos?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="font-medium">{product?.name}</p>
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

