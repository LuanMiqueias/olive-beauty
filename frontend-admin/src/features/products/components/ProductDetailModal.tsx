import { useEffect, useState } from 'react'
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
import { Product } from '@/shared/types'
import { formatCurrency } from '@/shared/lib/utils'
import { productsApi } from '@/api/endpoints/products'

interface ProductDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onEdit: () => void
}

export function ProductDetailModal({
  open,
  onOpenChange,
  product,
  onEdit,
}: ProductDetailModalProps) {
  const [fullProduct, setFullProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && product?.id) {
      setIsLoading(true)
      productsApi
        .getById(product.id)
        .then((data) => {
          setFullProduct(data)
        })
        .catch((error) => {
          console.error('Erro ao carregar detalhes do produto:', error)
          // Fallback para o produto da lista se houver erro
          setFullProduct(product)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (!open) {
      setFullProduct(null)
    }
  }, [open, product])

  const displayProduct = fullProduct || product
  if (!displayProduct) return null

  const totalStock = displayProduct.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const variantsCount = displayProduct.variants?.length || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{displayProduct.name}</DialogTitle>
          <DialogDescription>Detalhes completos do produto</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando detalhes do produto...
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Informações Básicas</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>{' '}
                    <span className="font-medium">{displayProduct.name}</span>
                  </div>
                  {displayProduct.description && (
                    <div>
                      <span className="text-muted-foreground">Descrição:</span>{' '}
                      <span>{displayProduct.description}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Preço Base:</span>{' '}
                    <span className="font-medium">{formatCurrency(displayProduct.basePrice)}</span>
                  </div>
                  {displayProduct.brand && (
                    <div>
                      <span className="text-muted-foreground">Marca:</span>{' '}
                      <span>{displayProduct.brand}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Categoria:</span>{' '}
                    <span>{displayProduct.category?.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estoque Total:</span>{' '}
                    <span className="font-medium">{totalStock} unidades</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Variantes:</span>{' '}
                    <span className="font-medium">{variantsCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Criado em:</span>{' '}
                    <span>
                      {new Date(displayProduct.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Images */}
              {displayProduct.images && Array.isArray(displayProduct.images) && displayProduct.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Imagens</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {displayProduct.images.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square border rounded-md overflow-hidden"
                      >
                        <img
                          src={image.url}
                          alt={displayProduct.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3C/svg%3E'
                          }}
                        />
                        {image.isCover && (
                          <div className="absolute top-1 left-1">
                            <span className="bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                              Capa
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Variants */}
            {displayProduct.variants && Array.isArray(displayProduct.variants) && displayProduct.variants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Variantes</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Atributos</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayProduct.variants.map((variant) => {
                        let attributes = {}
                        try {
                          attributes =
                            typeof variant.attributes === 'string'
                              ? JSON.parse(variant.attributes)
                              : variant.attributes || {}
                        } catch (error) {
                          console.error('Erro ao parsear atributos da variante:', error)
                          attributes = {}
                        }
                        return (
                          <TableRow key={variant.id}>
                            <TableCell>
                              {Object.keys(attributes).length > 0 ? (
                                Object.entries(attributes).map(([key, value]) => (
                                  <span key={key} className="mr-2">
                                    <strong>{key}:</strong> {typeof value === 'string' ? value : String(value)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted-foreground">Sem atributos</span>
                              )}
                            </TableCell>
                            <TableCell>{formatCurrency(variant.price)}</TableCell>
                            <TableCell>{variant.stock}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>Editar Produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

