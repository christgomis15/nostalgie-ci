'use client'
import { useMemo } from 'react'

interface Flake {
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
}

function makeFlakes(count: number): Flake[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: 4 + Math.random() * 8,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * -18,
    drift: 20 + Math.random() * 40,
    opacity: 0.35 + Math.random() * 0.5,
  }))
}

export default function ChristmasSnow() {
  const flakes = useMemo(() => makeFlakes(45), [])

  return (
    <div className="xmas-snow" aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="xmas-flake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--xmas-drift' as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
