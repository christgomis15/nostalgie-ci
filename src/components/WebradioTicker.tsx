'use client'

import { useRef, useEffect } from 'react'
import { usePlayerStore, WEBRADIOS } from '@/lib/player-store'

export default function WebradioTicker() {
  const { currentRadio, switchRadio, isPlaying } = usePlayerStore()
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const posRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const speed = 0.5
    const animate = () => {
      posRef.current -= speed
      const half = track.scrollWidth / 2
      if (Math.abs(posRef.current) >= half) posRef.current = 0
      track.style.transform = `translateX(${posRef.current}px)`
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const handleClick = (radio: typeof WEBRADIOS[0]) => {
    if (!radio.stream) {
      // TODO: afficher toast "Bientôt disponible"
      return
    }
    switchRadio(radio)
  }

  const items = [...WEBRADIOS, ...WEBRADIOS]

  return (
    <div className="wr-ticker">
      <div className="wr-label">
        <span>🎵</span> WEBRADIOS
      </div>
      <div className="wr-rfade" />
      <div className="wr-track" ref={trackRef}>
        {items.map((radio, i) => (
          <div
            key={`${radio.badge}-${i}`}
            className={`wr-item ${radio.badge === currentRadio.badge && isPlaying ? 'active' : ''}`}
            onClick={() => handleClick(radio)}
          >
            <div className="wi-badge">{radio.badge}</div>
            <div>
              <div className="wi-name">{radio.name}</div>
              <div className="wi-desc">{radio.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}