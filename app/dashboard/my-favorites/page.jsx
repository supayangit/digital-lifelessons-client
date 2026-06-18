'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { BookmarkX, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LessonCard } from '@/src/components/lessons/LessonCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure'
import { useRole } from '@/src/hooks/useRole'
import { getMyFavorites, removeFavorite } from '@/src/services/favoritesApi'

const CATEGORIES = ['All', 'Career', 'Relationships', 'Finance', 'Health', 'Mindset', 'Education', 'Parenting', 'Travel', 'Technology', 'Other']
const TONES = ['All', 'Reflective', 'Hopeful', 'Cautionary', 'Motivational', 'Melancholic', 'Humorous']
const PAGE_SIZE = 6

const MOCK_FAVORITES = [
  {
    _id: 'f1', title: 'Embrace Failure Early', description: 'Every failure teaches you something that success never could. I learned this the hard way in my first startup.',
    category: 'Career', tone: 'Reflective', isPremium: false, likesCount: 12, savesCount: 5, commentsCount: 3,
    author: { name: 'Alex M.' },
  },
  {
    _id: 'f2', title: 'The Power of Saying No', description: 'Boundaries are not walls — they are bridges to healthier relationships and better productivity.',
    category: 'Mindset', tone: 'Motivational', isPremium: true, likesCount: 28, savesCount: 14, commentsCount: 7,
    author: { name: 'Sara K.' },
  },
  {
    _id: 'f3', title: 'How Compound Interest Changed My Life', description: 'Small consistent investments over 10 years built more wealth than I expected.',
    category: 'Finance', tone: 'Hopeful', isPremium: false, likesCount: 19, savesCount: 9, commentsCount: 4,
    author: { name: 'James R.' },
  },
  {
    _id: 'f4', title: 'Letting Go of Toxic Friendships', description: 'Some relationships drain your energy silently. Recognising them early is crucial for mental health.',
    category: 'Relationships', tone: 'Cautionary', isPremium: false, likesCount: 34, savesCount: 21, commentsCount: 11,
    author: { name: 'Priya S.' },
  },
  {
    _id: 'f5', title: 'Traveling Solo at 50', description: 'Age is just a number. My solo trip to Japan at 52 was the most liberating experience of my adult life.',
    category: 'Travel', tone: 'Hopeful', isPremium: false, likesCount: 8, savesCount: 3, commentsCount: 2,
    author: { name: 'Michael T.' },
  },
  {
    _id: 'f6', title: 'The Burnout I Did Not See Coming', description: 'I worked 80-hour weeks for years and thought I was thriving. Then everything collapsed.',
    category: 'Health', tone: 'Cautionary', isPremium: true, likesCount: 45, savesCount: 31, commentsCount: 16,
    author: { name: 'Lena B.' },
  },
]

export default function MyFavoritesPage() {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const { isPremiumRole } = useRole()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [tone, setTone] = useState('All')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['my-favorites', { category, tone, page }],
    queryFn: () =>
      getMyFavorites(
        {
          category: category !== 'All' ? category : undefined,
          tone: tone !== 'All' ? tone : undefined,
          page,
          limit: PAGE_SIZE,
        },
        axiosSecure
      ),
    placeholderData: MOCK_FAVORITES,
    retry: false,
  })

  const removeMutation = useMutation({
    mutationFn: (lessonId) => removeFavorite(lessonId, axiosSecure),
    onMutate: async (lessonId) => {
      await queryClient.cancelQueries({ queryKey: ['my-favorites'] })
      const prev = queryClient.getQueryData(['my-favorites', { category, tone, page }])
      queryClient.setQueryData(['my-favorites', { category, tone, page }], (old) =>
        (old || MOCK_FAVORITES).filter((f) => f._id !== lessonId)
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['my-favorites', { category, tone, page }], ctx.prev)
      toast.error('Failed to remove favorite')
    },
    onSuccess: () => {
      toast.success('Removed from favorites')
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
    },
  })

  const allLessons = Array.isArray(data) ? data : (data?.lessons || MOCK_FAVORITES)

  // Client-side search filter
  const filtered = allLessons.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.description?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = data?.totalPages || Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-foreground">My Favorites</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} saved lesson{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search favorites..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={tone} onValueChange={(v) => { setTone(v); setPage(1) }}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <BookmarkX className="h-12 w-12 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No favorites found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or explore lessons to save.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((lesson) => (
            <div key={lesson._id} className="relative group">
              <LessonCard lesson={lesson} isPremiumUser={isPremiumRole} />
              {/* Remove favorite overlay button */}
              <button
                onClick={() => removeMutation.mutate(lesson._id)}
                disabled={removeMutation.isPending}
                className="absolute top-3 right-3 z-10 rounded-full bg-background/90 p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                aria-label="Remove from favorites"
              >
                <BookmarkX className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
