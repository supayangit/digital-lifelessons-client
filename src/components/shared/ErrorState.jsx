import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  error,
}) {
  const message = description || error?.message || 'An unexpected error occurred. Please try again.'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="rounded-full bg-destructive/10 p-5">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
