'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Heart,
  Bookmark,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure'
import { getMyLessons, deleteLesson, toggleVisibility, toggleAccessLevel } from '@/src/services/lessonApi'

/* ── Mock data so the table renders without a backend ── */
const MOCK_LESSONS = [
  {
    _id: '1', title: 'Embrace Failure Early', category: 'Career', tone: 'Reflective',
    visibility: 'public', accessLevel: 'free', likesCount: 12, savesCount: 5, commentsCount: 3,
    createdAt: '2025-06-10',
  },
  {
    _id: '2', title: 'The Power of Saying No', category: 'Mindset', tone: 'Motivational',
    visibility: 'public', accessLevel: 'premium', likesCount: 28, savesCount: 14, commentsCount: 7,
    createdAt: '2025-06-08',
  },
  {
    _id: '3', title: 'Money Habits That Stick', category: 'Finance', tone: 'Cautionary',
    visibility: 'private', accessLevel: 'free', likesCount: 6, savesCount: 2, commentsCount: 1,
    createdAt: '2025-06-05',
  },
]

function LessonRowSkeleton() {
  return (
    <TableRow>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <TableCell key={i}><Skeleton className="h-5 w-full" /></TableCell>
      ))}
    </TableRow>
  )
}

export default function MyLessonsPage() {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-lessons'],
    queryFn: () => getMyLessons(axiosSecure),
    placeholderData: MOCK_LESSONS,
    retry: false,
  })

  const lessons = data || MOCK_LESSONS

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteLesson(id, axiosSecure),
    onSuccess: () => {
      toast.success('Lesson deleted')
      queryClient.invalidateQueries({ queryKey: ['my-lessons'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] })
    },
    onError: () => toast.error('Failed to delete lesson'),
  })

  const visibilityMutation = useMutation({
    mutationFn: (id) => toggleVisibility(id, axiosSecure),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['my-lessons'] })
      const prev = queryClient.getQueryData(['my-lessons'])
      queryClient.setQueryData(['my-lessons'], (old) =>
        (old || MOCK_LESSONS).map((l) =>
          l._id === id ? { ...l, visibility: l.visibility === 'public' ? 'private' : 'public' } : l
        )
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['my-lessons'], ctx.prev)
      toast.error('Failed to update visibility')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['my-lessons'] }),
  })

  const accessMutation = useMutation({
    mutationFn: (id) => toggleAccessLevel(id, axiosSecure),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['my-lessons'] })
      const prev = queryClient.getQueryData(['my-lessons'])
      queryClient.setQueryData(['my-lessons'], (old) =>
        (old || MOCK_LESSONS).map((l) =>
          l._id === id ? { ...l, accessLevel: l.accessLevel === 'free' ? 'premium' : 'free' } : l
        )
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['my-lessons'], ctx.prev)
      toast.error('Failed to update access level')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['my-lessons'] }),
  })

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete lesson?',
      text: `"${title}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: 'oklch(0.577 0.245 27.325)',
      background: 'var(--card)',
      color: 'var(--card-foreground)',
    })
    if (result.isConfirmed) deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">My Lessons</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} published</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/add-lesson">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Lesson
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="min-w-[180px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map((i) => <LessonRowSkeleton key={i} />)
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No lessons yet.{' '}
                  <Link href="/dashboard/add-lesson" className="text-primary hover:underline">
                    Add your first lesson
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson) => (
                <TableRow key={lesson._id} className="group">
                  {/* Title */}
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-1.5 max-w-[220px]">
                      <span className="line-clamp-2 text-sm">{lesson.title}</span>
                      <Link href={`/lesson/${lesson._id}`} className="opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5 transition-opacity">
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5 block">
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">{lesson.category}</Badge>
                  </TableCell>

                  {/* Visibility toggle */}
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 gap-1.5 text-xs px-2 ${lesson.visibility === 'public' ? 'text-primary' : 'text-muted-foreground'}`}
                          onClick={() => visibilityMutation.mutate(lesson._id)}
                          disabled={visibilityMutation.isPending}
                        >
                          {lesson.visibility === 'public'
                            ? <><Eye className="h-3.5 w-3.5" /> Public</>
                            : <><EyeOff className="h-3.5 w-3.5" /> Private</>
                          }
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle visibility</TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* Access Level toggle */}
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 gap-1.5 text-xs px-2 ${lesson.accessLevel === 'premium' ? 'text-accent-foreground' : 'text-muted-foreground'}`}
                          onClick={() => accessMutation.mutate(lesson._id)}
                          disabled={accessMutation.isPending}
                        >
                          {lesson.accessLevel === 'premium'
                            ? <><Lock className="h-3.5 w-3.5" /> Premium</>
                            : <><Unlock className="h-3.5 w-3.5" /> Free</>
                          }
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle access level</TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* Stats */}
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" /> {lesson.likesCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="h-3.5 w-3.5" /> {lesson.savesCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" /> {lesson.commentsCount ?? 0}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link href={`/dashboard/my-lessons/${lesson._id}`}>
                              <Edit2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit lesson</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(lesson._id, lesson.title)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete lesson</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
