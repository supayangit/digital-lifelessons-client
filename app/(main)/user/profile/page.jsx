import { Suspense } from 'react'
import ProfileClient from './ProfileClient'

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
