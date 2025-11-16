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
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

export interface ProductVariant {
  attributes: Record<string, string>
  price: number
  stock: number
}

interface VariantFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (variant: ProductVariant) => void
  variant?: ProductVariant | null
  isLoading?: boolean
}

export function VariantFormModal({
  open,
  onOpenChange,
  onSubmit,
  variant,
  isLoading = false,
}: VariantFormModalProps) {
  const [attributes, setAttributes] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' },
  ])
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [errors, setErrors] = useState<{
    attributes?: string
    price?: string
    stock?: string
  }>({})

  useEffect(() => {
    if (variant) {
      // Convert attributes object to array
      const attrsArray = Object.entries(variant.attributes).map(([key, value]) => ({
        key,
        value,
      }))
      setAttributes(attrsArray.length > 0 ? attrsArray : [{ key: '', value: '' }])
      setPrice(variant.price.toString())
      setStock(variant.stock.toString())
    } else {
      setAttributes([{ key: '', value: '' }])
      setPrice('')
      setStock('')
    }
    setErrors({})
  }, [variant, open])

  const validate = (): boolean => {
    const newErrors: { attributes?: string; price?: string; stock?: string } = {}

    // Validate attributes
    const validAttributes = attributes.filter((attr) => attr.key.trim() && attr.value.trim())
    if (validAttributes.length === 0) {
      newErrors.attributes = 'Adicione pelo menos um atributo (ex: cor, tamanho)'
    }

    // Validate price
    const priceNum = parseFloat(price)
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Preço deve ser um número positivo'
    }

    // Validate stock
    const stockNum = parseInt(stock)
    if (stock === '' || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'Estoque deve ser um número inteiro não negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const validAttributes = attributes
      .filter((attr) => attr.key.trim() && attr.value.trim())
      .reduce((acc, attr) => {
        acc[attr.key.trim()] = attr.value.trim()
        return acc
      }, {} as Record<string, string>)

    onSubmit({
      attributes: validAttributes,
      price: parseFloat(price),
      stock: parseInt(stock),
    })

    onOpenChange(false)
  }

  const addAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  }

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...attributes]
    updated[index] = { ...updated[index], [field]: value }
    setAttributes(updated)
    if (errors.attributes) {
      setErrors({ ...errors, attributes: undefined })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full mx-4">
        <DialogHeader>
          <DialogTitle>
            {variant ? 'Editar Variante' : 'Nova Variante'}
          </DialogTitle>
          <DialogDescription>
            {variant
              ? 'Atualize as informações da variante'
              : 'Adicione uma nova variante ao produto'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Attributes */}
            <div className="grid gap-2">
              <Label>
                Atributos <span className="text-destructive">*</span>
              </Label>
              <div className="space-y-2">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Ex: Cor"
                      value={attr.key}
                      onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Ex: Vermelho"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    {attributes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAttribute(index)}
                        disabled={isLoading}
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
                        >
                          <path d="M18 6 6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttribute}
                  disabled={isLoading}
                >
                  Adicionar Atributo
                </Button>
              </div>
              {errors.attributes && (
                <p className="text-sm text-destructive">{errors.attributes}</p>
              )}
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="variant-price">
                Preço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="variant-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value)
                  if (errors.price) {
                    setErrors({ ...errors, price: undefined })
                  }
                }}
                disabled={isLoading}
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div className="grid gap-2">
              <Label htmlFor="variant-stock">
                Estoque <span className="text-destructive">*</span>
              </Label>
              <Input
                id="variant-stock"
                type="number"
                min="0"
                placeholder="0"
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value)
                  if (errors.stock) {
                    setErrors({ ...errors, stock: undefined })
                  }
                }}
                disabled={isLoading}
                className={errors.stock ? 'border-destructive' : ''}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock}</p>
              )}
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
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

