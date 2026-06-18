import { cn } from '@/lib/utils'

export function LoadingSpinner({ size = 'md', className, fullPage = false }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
    xl: 'h-16 w-16 border-4',
  }

  const spinner = (
    <span
      className={cn(
        'inline-block rounded-full border-primary/30 border-t-primary animate-spin',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}
