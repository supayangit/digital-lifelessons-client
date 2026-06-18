import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function EmptyState({
  icon: Icon = BookOpen,
  title = 'Nothing here yet',
  description = 'There are no items to display at this time.',
  action,
  actionHref,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="rounded-full bg-muted p-5">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
      {(action || actionHref) && (
        actionHref ? (
          <Button asChild size="sm" className="mt-2">
            <Link href={actionHref}>{actionLabel || 'Take action'}</Link>
          </Button>
        ) : (
          <Button size="sm" className="mt-2" onClick={action}>
            {actionLabel || 'Take action'}
          </Button>
        )
      )}
    </div>
  )
}
