'use client'

import { usePlayerStore, WEBRADIOS } from '@/lib/player-store'

export default function PlayerBar() {
  const { isPlaying, isLoading, streamError, currentRadio, toggle, switchRadio } = usePlayerStore()

  const handleRadioClick = (radio: typeof WEBRADIOS[0]) => {
    if (!radio.stream) return
    if (radio.badge === currentRadio.badge) {
      toggle()
    } else {
      switchRadio(radio)
    }
  }

  return (
    <div className="player-bar">
      {/* Infos radio en cours */}
      <div className="pb-info">
        <div className="wi-badge">{currentRadio.badge}</div>
        <div>
          <div className="pb-name">{currentRadio.name}</div>
          <div className="pb-desc">
            {streamError
              ? <span style={{ color: '#ff6b6b', fontSize: '10px' }}>{streamError}</span>
              : currentRadio.desc}
          </div>
        </div>
      </div>

      {/* Bouton play/pause central */}
      <button
        className={`pb-play ${isPlaying ? 'playing' : ''}`}
        onClick={toggle}
        aria-label={isLoading ? 'Chargement...' : isPlaying ? 'Pause' : 'Lecture'}
        disabled={isLoading}
      >
        {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
      </button>

      {/* Sélecteur de webradios */}
      <div className="pb-radios">
        {WEBRADIOS.map((radio) => (
          <button
            key={radio.badge}
            className={`pb-radio-btn ${radio.badge === currentRadio.badge && isPlaying ? 'active' : ''} ${!radio.stream ? 'disabled' : ''}`}
            onClick={() => handleRadioClick(radio)}
            title={radio.name}
          >
            {radio.badge}
          </button>
        ))}
      </div>
    </div>
  )
}
