import { ProductVariant } from '@/shared/types'
import { formatCurrency, formatVariantAttributes } from '@/shared/lib/utils'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onSelectVariant: (variant: ProductVariant) => void
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  if (variants.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Variantes</h2>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id
          const isOutOfStock = variant.stock === 0
          const attrs = formatVariantAttributes(variant.attributes)

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelectVariant(variant)}
              disabled={isOutOfStock}
              className={`
                px-4 py-3 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }
                ${
                  isOutOfStock
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-md'
                }
              `}
            >
              <div className="font-medium text-sm mb-1">{attrs}</div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(variant.price)}
                {variant.stock > 0 && ` • ${variant.stock} em estoque`}
                {isOutOfStock && ' • Esgotado'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

