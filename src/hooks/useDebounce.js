'use client'

import { useState, useEffect } from 'react'

/**
 * Returns a debounced version of the provided value.
 * @param {*} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
