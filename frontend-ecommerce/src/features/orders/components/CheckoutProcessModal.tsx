import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { Cart, Order } from '@/shared/types'
import { ordersApi } from '@/api/endpoints/orders'
import { useCartStore } from '@/shared/stores'
import { CheckoutStepIndicator, StepStatus } from './CheckoutStepIndicator'
import { CheckoutSuccessView } from './CheckoutSuccessView'

interface CheckoutProcessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: Cart | null
  shippingName: string
  shippingAddress: string
  shippingPhone?: string
  onSuccess?: (order: Order) => void
}

type StepId = 0 | 1 | 2 | 3 | 4

interface Step {
  id: StepId
  label: string
  status: StepStatus
}

const STEPS: Omit<Step, 'status'>[] = [
  { id: 0, label: 'Validando informações' },
  { id: 1, label: 'Processando pagamento' },
  { id: 2, label: 'Confirmando pedido' },
  { id: 3, label: 'Preparando envio' },
  { id: 4, label: 'Sucesso' },
]

export function CheckoutProcessModal({
  open,
  onOpenChange,
  cart,
  shippingName,
  shippingAddress,
  shippingPhone,
  onSuccess,
}: CheckoutProcessModalProps) {
  const navigate = useNavigate()
  const { getCart } = useCartStore()
  const [steps, setSteps] = useState<Step[]>(() =>
    STEPS.map((step) => ({ ...step, status: 'pending' as StepStatus }))
  )
  const [currentStep, setCurrentStep] = useState<StepId>(0)
  const [error, setError] = useState<string | null>(null)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Reset state when modal opens (but preserve success state if already showing success)
  useEffect(() => {
    if (open && createdOrder === null) {
      // Only reset if we're not showing success
      // Reset all steps to pending
      setSteps(STEPS.map((step) => ({ ...step, status: 'pending' as StepStatus })))
      setCurrentStep(0)
      setError(null)
      setIsProcessing(false)
    }
  }, [open, createdOrder])

  const updateStepStatus = useCallback((stepId: StepId, status: StepStatus) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    )
  }, [])

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Step 0: Validate information
  const validateInformation = async (): Promise<boolean> => {
    if (!cart || cart.items.length === 0) {
      throw new Error('Carrinho vazio')
    }
    if (!shippingName.trim()) {
      throw new Error('Nome completo é obrigatório')
    }
    if (!shippingAddress.trim()) {
      throw new Error('Endereço completo é obrigatório')
    }
    return true
  }

  // Step 1: Process payment (simulated)
  const processPayment = async (): Promise<boolean> => {
    // Simulate payment processing
    await delay(1200)
    return true
  }

  // Step 2: Create order
  const createOrder = async (): Promise<Order> => {
    const order = await ordersApi.create({
      shippingName: shippingName.trim(),
      shippingAddress: shippingAddress.trim(),
      shippingPhone: shippingPhone?.trim() || undefined,
    })
    return order
  }

  // Step 3: Prepare shipping (clear cart)
  const prepareShipping = async (): Promise<boolean> => {
    try {
      await getCart() // Refresh cart (should be empty now)
      return true
    } catch (err) {
      // Don't fail the whole process if cart refresh fails
      // Order was already created successfully
      console.warn('Failed to refresh cart:', err)
      return true
    }
  }

  const processSteps = useCallback(async () => {
    setIsProcessing(true)
    setError(null)

    let stepInProgress: StepId = 0

    try {
      // Step 0: Validate information
      stepInProgress = 0
      updateStepStatus(0, 'processing')
      setCurrentStep(0)
      await delay(300) // Small delay before starting
      await validateInformation()
      await delay(800) // Minimum duration for visual feedback
      updateStepStatus(0, 'completed')
      await delay(1000) // Show completed checkmark before next step

      // Step 1: Process payment
      stepInProgress = 1
      updateStepStatus(1, 'processing')
      setCurrentStep(1)
      await processPayment()
      updateStepStatus(1, 'completed')
      await delay(1000) // Show completed checkmark before next step

      // Step 2: Create order
      stepInProgress = 2
      updateStepStatus(2, 'processing')
      setCurrentStep(2)
      const order = await createOrder()
      setCreatedOrder(order)
      updateStepStatus(2, 'completed')
      await delay(1000) // Show completed checkmark before next step

      // Step 3: Prepare shipping
      stepInProgress = 3
      updateStepStatus(3, 'processing')
      setCurrentStep(3)
      await prepareShipping()
      await delay(800) // Minimum duration
      updateStepStatus(3, 'completed')
      await delay(1000) // Show completed checkmark before next step

      // Step 4: Success
      stepInProgress = 4
      updateStepStatus(4, 'completed')
      setCurrentStep(4)
      setIsProcessing(false)

      // Call success callback if provided
      if (order && onSuccess) {
        onSuccess(order)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao processar pedido. Tente novamente.'
      setError(errorMessage)
      updateStepStatus(stepInProgress, 'error')
      setCurrentStep(stepInProgress)
      setIsProcessing(false)
    }
  }, [
    cart,
    shippingName,
    shippingAddress,
    shippingPhone,
    updateStepStatus,
    getCart,
    onSuccess,
  ])

  // Start processing when modal opens
  useEffect(() => {
    if (open && !isProcessing && !createdOrder && !error) {
      // Small delay before starting to allow modal animation to complete
      const timer = setTimeout(() => {
        processSteps()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open, isProcessing, createdOrder, error, processSteps])

  const handleRetry = () => {
    setError(null)
    // Reset failed step and restart from there
    const failedStep = steps.findIndex((s) => s.status === 'error')
    if (failedStep >= 0) {
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx >= failedStep ? { ...step, status: 'pending' as StepStatus } : step
        )
      )
      setCurrentStep(failedStep as StepId)
      processSteps()
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    // If order was created, navigate to orders page
    if (createdOrder) {
      navigate({ to: '/orders' })
    }
  }

  // Don't allow closing during processing or when showing success
  const canClose = !isProcessing && createdOrder === null

  // Prevent any closing when showing success
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if not showing success and not processing
    if (newOpen === false && (createdOrder !== null || isProcessing)) {
      return // Prevent closing
    }
    if (canClose) {
      onOpenChange(newOpen)
    }
  }

  // Force modal to stay open when showing success, even if parent tries to close it
  const modalOpen = createdOrder !== null ? true : open

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          "max-w-2xl max-h-[90vh] overflow-y-auto",
          createdOrder && "[&>button.absolute]:hidden" // Hide close button when showing success
        )}
        onInteractOutside={(e) => {
          // Prevent closing on outside click when showing success
          if (createdOrder) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing on ESC when showing success
          if (createdOrder) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {createdOrder ? 'Pedido Criado!' : 'Processando seu pedido...'}
          </DialogTitle>
        </DialogHeader>

        {createdOrder ? (
          // Success View
          <CheckoutSuccessView order={createdOrder} onClose={() => onOpenChange(false)} />
        ) : (
          // Processing View
          <div className="flex flex-col min-h-[400px]">
            <CheckoutStepIndicator steps={steps} currentStep={currentStep} />

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">Erro no processamento</p>
                    <p className="text-sm text-destructive/80 mt-1">{error}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleRetry} size="sm" className="flex-1">
                    Tentar Novamente
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {!error && isProcessing && (
              <div className="text-center py-4 mt-auto">
                <p className="text-sm text-muted-foreground">
                  Por favor, aguarde enquanto processamos seu pedido...
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

