'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  themes: ['light', 'dark', 'system'],
})

const STORAGE_KEY = 'dll-theme'
const THEME_VALUES = ['light', 'dark', 'system']

function getPreferredTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY)
    if (storedTheme && THEME_VALUES.includes(storedTheme)) {
      setTheme(storedTheme)
    }
    setMounted(true)
  }, [])

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof window === 'undefined') return 'light'
      return getPreferredTheme()
    }
    return theme
  }, [theme])

  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    html.classList.toggle('dark', resolvedTheme === 'dark')
    html.style.colorScheme = resolvedTheme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [resolvedTheme, theme, mounted])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => {
      if (theme === 'system') {
        const nextTheme = event.matches ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', nextTheme === 'dark')
        document.documentElement.style.colorScheme = nextTheme
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      themes: THEME_VALUES,
    }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
