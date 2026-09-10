'use client'

import { useEffect, useState } from 'react'

const CHECK_INTERVAL_MS = 60 * 1000
const WINDOW_START_MIN = 10 * 60 + 45 // 10h45
const WINDOW_END_MIN = 11 * 60 + 15   // 11h15

// Sponsors de l'émission Tchika Tchika Boom — crédit affiché sur l'écran
// d'accueil du pop-up, avant de dévoiler l'indice. Modifier ici si les
// partenaires changent.
const TTB_SPONSORS = "Orange et le Port Autonome d'Abidjan"

function todayAbidjan(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Abidjan',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())
}

function minutesNowAbidjan(): number {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Abidjan',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const hour = Number(parts.find(p => p.type === 'hour')?.value || '0')
  const minute = Number(parts.find(p => p.type === 'minute')?.value || '0')
  return hour * 60 + minute
}

export default function TTBPopup() {
  const [visible, setVisible] = useState(false)
  const [indice, setIndice] = useState('')
  const [step, setStep] = useState<'sponsor' | 'indice'>('sponsor')

  useEffect(() => {
    let cancelled = false

    async function check() {
      const today = todayAbidjan()
      const dismissKey = `ttb-dismissed-${today}`
      if (localStorage.getItem(dismissKey)) return

      const nowMin = minutesNowAbidjan()
      if (nowMin < WINDOW_START_MIN || nowMin > WINDOW_END_MIN) return

      try {
        const res = await fetch('/api/ttb', { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        if (data && !data.error && data.date === today && data.indice) {
          setIndice(data.indice)
          setStep('sponsor')
          setVisible(true)
        }
      } catch {
        // silencieux — un indice raté n'est pas critique
      }
    }

    check()
    const timer = setInterval(check, CHECK_INTERVAL_MS)
    return () => { cancelled = true; clearInterval(timer) }
  }, [])

  function close() {
    localStorage.setItem(`ttb-dismissed-${todayAbidjan()}`, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="actu-overlay" onClick={close}>
      <div className="top5-modal aud-modal" onClick={e => e.stopPropagation()}>
        {step === 'sponsor' ? (
          <div className="ttb-sponsor">
            <p className="ttb-kicker">Exclusivité</p>
            <h3 className="cf-title" style={{ marginBottom: 0 }}>Tchika Tchika Boom</h3>
            <p className="ttb-give">L&apos;indice du jour vous est offert par</p>
            <div className="ttb-logos">
              <img
                className="ttb-logo-orange"
                src="/img/sponsor-orange.png"
                alt="Orange"
                width={52}
                height={52}
              />
              <img
                className="ttb-logo-paa"
                src="/img/sponsor-paa.png"
                alt="Port Autonome d'Abidjan"
                width={60}
                height={60}
              />
            </div>
            <button
              className="btn btn-or"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setStep('indice')}
            >
              Découvrir l&apos;indice ▸
            </button>
          </div>
        ) : (
          <div className="ttb-indice">
            <h3 className="cf-title">🎯 Indice du jour — Tchika Tchika Boom</h3>
            <p className="cf-sub" style={{ fontSize: 16, marginTop: 10, marginBottom: 16 }}>{indice}</p>
            <p className="ttb-credit">Indice offert par {TTB_SPONSORS}</p>
            <button
              className="btn btn-or"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={close}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
