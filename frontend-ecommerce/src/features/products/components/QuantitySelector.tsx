import { Button } from '@/shared/components/ui/button'

interface QuantitySelectorProps {
  quantity: number
  maxQuantity: number
  onIncrease: () => void
  onDecrease: () => void
  disabled?: boolean
}

export function QuantitySelector({
  quantity,
  maxQuantity,
  onIncrease,
  onDecrease,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium">Quantidade:</label>
      <div className="flex items-center gap-2 border rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDecrease}
          disabled={quantity <= 1 || disabled}
          className="h-10 w-10 rounded-r-none"
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
            <path d="M5 12h14" />
          </svg>
        </Button>
        <span className="w-12 text-center font-medium text-base">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onIncrease}
          disabled={quantity >= maxQuantity || disabled}
          className="h-10 w-10 rounded-l-none"
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

