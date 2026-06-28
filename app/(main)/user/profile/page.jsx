import { Suspense } from 'react'
import ProfileClient from './ProfileClient'

export const metadata = {
  title: 'Contributor Profile | Digital Life Lessons',
  description: 'Discover contributor profiles and public lessons shared by the community.',
}

export default function PublicProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <p className="text-lg font-semibold">Loading contributor profile…</p>
        </div>
      }
    >
      <ProfileClient />
    </Suspense>
  )
}
