'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share'
import { Heart, Bookmark, Share2, Flag, Facebook, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuth } from '@/src/hooks/useAuth'
import { toggleLike, submitReport, REPORT_REASONS } from '@/src/services/reportsApi'
import { addFavorite, removeFavorite } from '@/src/services/favoritesApi'
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure'

/**
 * InteractionBar — Like, Favorite, Share (Facebook/LinkedIn/X), Report
 *
 * @param {{
 *   lessonId: string,
 *   lessonUrl: string,
 *   initialLikes?: number,
 *   initialSaves?: number,
 *   isLiked?: boolean,
 *   isFavorited?: boolean,
 * }} props
 */
export function InteractionBar({
  lessonId,
  lessonUrl,
  initialLikes = 0,
  initialSaves = 0,
  isLiked = false,
  isFavorited = false,
}) {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [favorited, setFavorited] = useState(isFavorited)
  const [savesCount, setSavesCount] = useState(initialSaves)

  const shareUrl = lessonUrl || (typeof window !== 'undefined' ? window.location.href : '')

  /* ── Like (optimistic) ── */
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(lessonId, axiosSecure),
    onMutate: () => {
      setLiked((prev) => !prev)
      setLikesCount((prev) => liked ? prev - 1 : prev + 1)
    },
    onError: () => {
      setLiked((prev) => !prev)
      setLikesCount((prev) => liked ? prev + 1 : prev - 1)
      toast.error('Failed to update like')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] })
    },
  })

  /* ── Favorite (optimistic) ── */
  const favMutation = useMutation({
    mutationFn: () =>
      favorited
        ? removeFavorite(lessonId, axiosSecure)
        : addFavorite(lessonId, axiosSecure),
    onMutate: () => {
      setFavorited((prev) => !prev)
      setSavesCount((prev) => favorited ? prev - 1 : prev + 1)
    },
    onError: () => {
      setFavorited((prev) => !prev)
      setSavesCount((prev) => favorited ? prev + 1 : prev - 1)
      toast.error('Failed to update favorite')
    },
    onSuccess: () => {
      toast.success(favorited ? 'Removed from favorites' : 'Saved to favorites')
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] })
    },
  })

  /* ── Report ── */
  const reportMutation = useMutation({
    mutationFn: (reason) => submitReport(lessonId, reason, axiosSecure),
    onSuccess: () => toast.success('Report submitted. Thank you for keeping our community safe.'),
    onError: () => toast.error('Failed to submit report'),
  })

  const handleLike = () => {
    if (!isAuthenticated) { toast.error('Please log in to like lessons'); return }
    likeMutation.mutate()
  }

  const handleFavorite = () => {
    if (!isAuthenticated) { toast.error('Please log in to save lessons'); return }
    favMutation.mutate()
  }

  const handleReport = async () => {
    if (!isAuthenticated) { toast.error('Please log in to report lessons'); return }

    const { value: reason } = await Swal.fire({
      title: 'Report this lesson',
      input: 'select',
      inputOptions: Object.fromEntries(REPORT_REASONS.map((r) => [r, r])),
      inputPlaceholder: 'Select a reason',
      showCancelButton: true,
      confirmButtonText: 'Submit Report',
      cancelButtonText: 'Cancel',
      inputValidator: (val) => { if (!val) return 'Please select a reason' },
      background: 'var(--card)',
      color: 'var(--card-foreground)',
      confirmButtonColor: 'oklch(0.52 0.13 195)',
    })

    if (reason) reportMutation.mutate(reason)
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Like */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={likeMutation.isPending}
        className={cn(
          'h-8 gap-1.5 text-sm px-3',
          liked ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
        <span>{likesCount}</span>
      </Button>

      {/* Favorite */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavorite}
        disabled={favMutation.isPending}
        className={cn(
          'h-8 gap-1.5 text-sm px-3',
          favorited ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
      >
        <Bookmark className={cn('h-4 w-4', favorited && 'fill-current')} />
        <span>{savesCount}</span>
      </Button>

      {/* Social Share */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm px-3 text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem asChild>
            <FacebookShareButton url={shareUrl} className="w-full">
              <span className="flex items-center gap-2 text-sm cursor-pointer w-full py-0.5">
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </span>
            </FacebookShareButton>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LinkedinShareButton url={shareUrl} className="w-full">
              <span className="flex items-center gap-2 text-sm cursor-pointer w-full py-0.5">
                <Linkedin className="h-4 w-4 text-sky-700" />
                LinkedIn
              </span>
            </LinkedinShareButton>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TwitterShareButton url={shareUrl} className="w-full">
              <span className="flex items-center gap-2 text-sm cursor-pointer w-full py-0.5">
                <Twitter className="h-4 w-4 text-sky-500" />
                X (Twitter)
              </span>
            </TwitterShareButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReport}
        disabled={reportMutation.isPending}
        className="h-8 gap-1.5 text-sm px-3 text-muted-foreground hover:text-destructive"
        aria-label="Report lesson"
      >
        <Flag className="h-4 w-4" />
        Report
      </Button>
    </div>
  )
}
