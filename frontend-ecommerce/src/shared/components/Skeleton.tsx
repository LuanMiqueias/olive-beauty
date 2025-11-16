import { cn } from '@/shared/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <Skeleton className="aspect-square w-full mb-4" />
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-8 w-24 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-48 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

