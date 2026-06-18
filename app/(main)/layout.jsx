import { Navbar } from '@/src/components/shared/Navbar'
import { Footer } from '@/src/components/shared/Footer'

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
