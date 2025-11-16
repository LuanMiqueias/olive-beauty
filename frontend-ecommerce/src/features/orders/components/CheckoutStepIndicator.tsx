import { cn } from '@/shared/lib/utils'

export type StepStatus = 'pending' | 'processing' | 'completed' | 'error'

interface Step {
  id: number
  label: string
  status: StepStatus
}

interface CheckoutStepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function CheckoutStepIndicator({ steps, currentStep }: CheckoutStepIndicatorProps) {
  // Find the step that is currently processing
  const processingStep = steps.find((step) => step.status === 'processing')
  
  // If no step is processing, show the current step (which might be completed)
  const displayStep = processingStep || steps[currentStep] || steps[0]
  
  const isActive = displayStep.status === 'processing'
  const isCompleted = displayStep.status === 'completed'
  const isError = displayStep.status === 'error'
  
  // Count completed steps for progress indicator (excluding success step)
  const completedCount = steps.filter((s) => s.status === 'completed' && s.id !== 4).length
  const totalSteps = steps.length - 1 // Exclude success step from count

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
      {/* Progress Indicator */}
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {completedCount > 0 ? `${completedCount} de ${totalSteps} etapas concluídas` : 'Iniciando...'}
        </p>
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step - Centered */}
      <div 
        key={displayStep.id} 
        className="flex flex-col items-center gap-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
      >
        {/* Step Circle - Larger */}
        <div
          className={cn(
            'relative flex h-24 w-24 items-center justify-center rounded-full border-4 transition-all duration-500',
            {
              'border-primary bg-primary/10': isActive,
              'border-green-500 bg-green-500': isCompleted,
              'border-destructive bg-destructive/10': isError,
            }
          )}
        >
          {/* Processing: Spinner */}
          {isActive && (
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          )}

          {/* Completed: Checkmark */}
          {isCompleted && (
            <div className="flex items-center justify-center animate-scale-in">
              <svg
                className="h-14 w-14 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="animate-draw-check"
                />
              </svg>
            </div>
          )}

          {/* Error: X icon */}
          {isError && (
            <div className="flex items-center justify-center">
              <svg
                className="h-12 w-12 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Step Label */}
        <div className="text-center">
          <p
            className={cn('text-xl font-semibold transition-colors duration-300', {
              'text-primary': isActive,
              'text-green-600 dark:text-green-400': isCompleted,
              'text-destructive': isError,
            })}
          >
            {displayStep.label}
          </p>
        </div>
      </div>
    </div>
  )
}

