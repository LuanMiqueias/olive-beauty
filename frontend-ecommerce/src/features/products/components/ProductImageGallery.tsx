import { useState } from 'react'
import { ProductImage } from '@/shared/types'
import { Badge } from '@/shared/components/ui/badge'

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  hasFreeShipping?: boolean
}

export function ProductImageGallery({
  images,
  productName,
  hasFreeShipping = false,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">Sem imagem</span>
        </div>
      </div>
    )
  }

  const currentImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
        {hasFreeShipping && (
          <Badge
            className="absolute top-4 right-4 z-10 bg-green-600 hover:bg-green-700"
            variant="default"
          >
            Frete Grátis
          </Badge>
        )}
        
        <div
          className="relative w-full h-full cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <img
            src={currentImage.url}
            alt={`${productName} - Imagem ${selectedIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
          />
        </div>

        {/* Indicador de quantidade de imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/50'
              }`}
              aria-label={`Ver imagem ${index + 1} de ${images.length}`}
            >
              <img
                src={image.url}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

