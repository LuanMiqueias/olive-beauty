import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = 'Ops! Algo deu errado',
  message,
  onRetry,
  retryLabel = 'Tentar Novamente',
}: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <div className="mb-4 text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

