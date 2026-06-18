import { cn } from '@/lib/utils'

export function SectionHeading({ title, subtitle, centered = true, className }) {
  return (
    <div className={cn('mb-10', centered && 'text-center', className)}>
      <h2
        className={cn(
          'font-serif text-3xl font-bold tracking-tight text-balance sm:text-4xl',
          'text-foreground'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto text-pretty">
          {subtitle}
        </p>
      )}
      <div className={cn('mt-4 flex gap-1', centered ? 'justify-center' : 'justify-start')}>
        <span className="h-1 w-10 rounded-full bg-primary" />
        <span className="h-1 w-3 rounded-full bg-accent" />
      </div>
    </div>
  )
}
