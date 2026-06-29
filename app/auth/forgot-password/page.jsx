'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address'),
})

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      // TODO: wire this form to a password-reset API when available.
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('If this email exists, reset instructions have been sent.')
      setSubmitted(true)
    } catch (error) {
      toast.error('Unable to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-serif font-bold text-primary text-2xl">
            <BookOpen className="h-7 w-7" />
            LifeLessons
          </Link>
          <h1 className="mt-4 text-2xl font-bold font-serif text-foreground">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your email and we will send reset instructions.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {submitted ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-foreground">
                Check your inbox for a password reset link. If you don&apos;t receive it within a few minutes, try again or contact support.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">Return to login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset email'}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
