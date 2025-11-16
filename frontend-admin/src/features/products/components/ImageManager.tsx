import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

interface ImageManagerProps {
  images: Array<{ url: string; isCover: boolean }>
  onAddImage: (url: string) => void
  onRemoveImage: (index: number) => void
  onSetCover: (index: number) => void
}

export function ImageManager({
  images,
  onAddImage,
  onRemoveImage,
  onSetCover,
}: ImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [removeIndex, setRemoveIndex] = useState<number | null>(null)

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onAddImage(newImageUrl.trim())
      setNewImageUrl('')
      setShowAddDialog(false)
    }
  }

  const handleRemoveClick = (index: number) => {
    setRemoveIndex(index)
  }

  const confirmRemove = () => {
    if (removeIndex !== null) {
      onRemoveImage(removeIndex)
      setRemoveIndex(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Imagens do Produto</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Adicionar Imagem
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
          Nenhuma imagem adicionada
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group border rounded-md overflow-hidden aspect-square"
            >
              <img
                src={image.url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImagem inválida%3C/text%3E%3C/svg%3E'
                }}
              />
              {image.isCover && (
                <div className="absolute top-2 left-2">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Capa
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onSetCover(index)}
                  disabled={image.isCover}
                >
                  {image.isCover ? 'Capa' : 'Marcar como Capa'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveClick(index)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px] w-full mx-4">
          <DialogHeader>
            <DialogTitle>Adicionar Imagem</DialogTitle>
            <DialogDescription>
              Insira a URL da imagem que deseja adicionar
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddImage()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddImage}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog open={removeIndex !== null} onOpenChange={(open) => !open && setRemoveIndex(null)}>
        <DialogContent className="sm:max-w-[500px] w-full mx-4">
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <DialogDescription>
              Deseja realmente remover esta imagem?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRemoveIndex(null)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmRemove}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

