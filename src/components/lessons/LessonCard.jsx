import Link from 'next/link'
import Image from 'next/image'
import { Heart, Bookmark, Lock, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TONE_COLORS = {
  reflective: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  hopeful: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cautionary: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  motivational: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  melancholic: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  humorous: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
}

export function LessonCard({ lesson, isPremiumUser = false }) {
  if (!lesson) return null

  const {
    _id,
    title,
    description,
    category,
    tone,
    image,
    author,
    isPremium,
    likesCount = 0,
    savesCount = 0,
    commentsCount = 0,
  } = lesson

  const isLocked = isPremium && !isPremiumUser

  const authorInitials = author?.name
    ? author.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <article className="group relative rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              'object-cover transition-transform duration-300 group-hover:scale-105',
              isLocked && 'blur-sm scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}

        {/* Premium lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[2px]">
            <div className="rounded-full bg-background/90 p-3 shadow-sm">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs font-medium bg-background/90 text-foreground border-0 shadow-sm">
              {category}
            </Badge>
          </div>
        )}

        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-3 right-3">
            <Badge className="text-xs font-medium bg-accent text-accent-foreground border-0">
              Premium
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tone */}
        {tone && (
          <span className={cn('inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2', TONE_COLORS[tone.toLowerCase()] || 'bg-muted text-muted-foreground')}>
            {tone}
          </span>
        )}

        <Link href={`/lesson/${_id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors text-sm sm:text-base leading-snug">
            {title}
          </h3>
        </Link>

        {!isLocked && description && (
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {isLocked && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-2">Upgrade to Premium to read this lesson.</p>
            <Button size="sm" asChild className="w-full text-xs h-8">
              <Link href="/pricing">
                <Lock className="h-3 w-3 mr-1" />
                Unlock Premium
              </Link>
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-border">
          {/* Author */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={author?.image} alt={author?.name || 'Author'} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{authorInitials}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">{author?.name || 'Anonymous'}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
              {savesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
