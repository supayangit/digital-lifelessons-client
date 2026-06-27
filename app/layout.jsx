import './globals.css'
import { Providers } from '@/providers'

export const metadata = {
  title: 'Digital Life Lessons',
  description: 'Learn from real life experiences shared by people around the world.',
  generator: 'Digital Life Lessons',
  keywords: ['life lessons', 'wisdom', 'learning', 'personal growth', 'experiences'],
}

export const viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fafa' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f2e' },
  ],
  userScalable: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
