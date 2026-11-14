'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './motion'

type Options = {
  count: number
  /** Milliseconds each item stays active. */
  interval: number
  /** Start running. Defaults to true. Reduced motion always stops it. */
  enabled?: boolean
}

/**
 * Index that advances on a timer and pauses while `setPaused(true)`.
 * `progress` runs 0 → 1 across the current item, for progress bars.
 */
export function useAutoAdvance({ count, interval, enabled = true }: Options) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const elapsed = useRef(0)
  const running = enabled && !reduced && !paused && count > 1

  useEffect(() => {
    if (!running) return
    const step = 100
    const id = setInterval(() => {
      elapsed.current += step
      if (elapsed.current >= interval) {
        elapsed.current = 0
        setProgress(0)
        setIndex((i) => (i + 1) % count)
      } else {
        setProgress(elapsed.current / interval)
      }
    }, step)
    return () => clearInterval(id)
  }, [running, interval, count])

  const go = (next: number) => {
    elapsed.current = 0
    setProgress(0)
    setIndex(((next % count) + count) % count)
  }

  return { index, progress, paused, setPaused, go, running }
}
