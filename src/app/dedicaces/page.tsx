'use client'

import { useState, useEffect } from 'react'

// ── Créneaux dédicaces (heure d'Abidjan = UTC+0) ──────────────────
interface Creneau {
  emission: string      // valeur envoyée à Apps Script
  label: string         // affiché à l'utilisateur
  startH: number; startM: number
  endH: number;   endM: number
}

const CRENEAUX: Creneau[] = [
  { emission: 'Le Crazy Morning', label: 'Le Crazy Morning',  startH: 7,  startM: 0,  endH: 10, endM: 0  },
  { emission: 'Hits & Co',        label: 'Hits & Co',         startH: 14, startM: 0,  endH: 14, endM: 45 },
]

function minutesUTC(): number {
  const now = new Date()
  return now.getUTCHours() * 60 + now.getUTCMinutes()
}

function getActiveCreneau(): Creneau | null {
  const t = minutesUTC()
  return CRENEAUX.find(c => t >= c.startH * 60 + c.startM && t < c.endH * 60 + c.endM) ?? null
}

function getNextCreneau(): Creneau | null {
  const t = minutesUTC()
  return CRENEAUX.find(c => c.startH * 60 + c.startM > t) ?? null
}

function fmtHeure(h: number, m: number) {
  return `${h}h${m > 0 ? m.toString().padStart(2, '0') : '00'}`
}

// ── Formulaire ────────────────────────────────────────────────────
type FormState = {
  prenom: string; ville: string; pour: string
  chanson: string; message: string; emission: string
}

export default function Dedicaces() {
  const [status, setStatus]     = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [hp, setHp]             = useState('')
  const [active, setActive]     = useState<Creneau | null>(null)
  const [form, setForm]         = useState<FormState>({
    prenom: '', ville: '', pour: '', chanson: '', message: '', emission: '',
  })

  // Vérifie le créneau toutes les 30 secondes
  useEffect(() => {
    const check = () => {
      const c = getActiveCreneau()
      setActive(c)
      if (c) setForm(f => ({ ...f, emission: c.emission }))
    }
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!active) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/dedicaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: hp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur inconnue')
      setStatus('sent')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur lors de l\'envoi.')
      setStatus('error')
    }
  }

  // ── Confirmation ──────────────────────────────────────────────
  if (status === 'sent') {
    return (
      <section className="page-section">
        <p className="section-label">Faites plaisir</p>
        <div className="ded-confirm">
          <p className="ded-confirm-icon">🎶</p>
          <h2>Dédicace envoyée !</h2>
          <p>Restez à l&apos;écoute sur 101.1 FM pour entendre votre dédicace.</p>
          <button
            className="btn btn-or"
            onClick={() => {
              setStatus('idle')
              setForm({ prenom: '', ville: '', pour: '', chanson: '', message: '', emission: active?.emission ?? '' })
            }}
            style={{ marginTop: '24px' }}
          >
            Envoyer une autre dédicace
          </button>
        </div>
      </section>
    )
  }

  // ── Hors créneau ──────────────────────────────────────────────
  if (!active) {
    const next = getNextCreneau()
    return (
      <section className="page-section">
        <p className="section-label">Faites plaisir</p>
        <h1 className="section-title">Envoyer une Dédicace</h1>

        <div className="ded-closed">
          <div className="ded-closed-icon">🎙️</div>
          <h2 className="ded-closed-title">Dédicaces fermées pour le moment</h2>
          <p className="ded-closed-sub">
            Les dédicaces sont disponibles uniquement pendant les émissions en direct.
          </p>

          <div className="ded-windows">
            {CRENEAUX.map(c => (
              <div key={c.emission} className="ded-window">
                <span className="ded-window-name">{c.label}</span>
                <span className="ded-window-time">
                  {fmtHeure(c.startH, c.startM)} – {fmtHeure(c.endH, c.endM)}
                </span>
              </div>
            ))}
          </div>

          {next && (
            <p className="ded-next">
              Prochain créneau : <strong>{next.label}</strong> à partir de{' '}
              <strong>{fmtHeure(next.startH, next.startM)}</strong>
            </p>
          )}
        </div>
      </section>
    )
  }

  // ── Formulaire actif ──────────────────────────────────────────
  return (
    <section className="page-section">
      <p className="section-label">Faites plaisir</p>
      <h1 className="section-title">Envoyer une Dédicace</h1>

      {/* Émission active */}
      <div className="ded-live-badge">
        <span className="ded-live-dot" />
        <span>En direct maintenant</span>
        <strong>{active.label}</strong>
        <span className="ded-live-time">
          jusqu&apos;à {fmtHeure(active.endH, active.endM)}
        </span>
      </div>

      <form className="ded-form" onSubmit={handleSubmit}>
        {/* Honeypot */}
        <input type="text" name="website" className="hp-field" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} aria-hidden="true" />

        <div className="form-row">
          <div className="form-group">
            <label>Votre prénom</label>
            <input type="text" placeholder="Ex: Kouamé" value={form.prenom} onChange={set('prenom')} required disabled={status === 'loading'} />
          </div>
          <div className="form-group">
            <label>Votre ville</label>
            <input type="text" placeholder="Ex: Cocody, Abidjan" value={form.ville} onChange={set('ville')} required disabled={status === 'loading'} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pour qui ?</label>
            <input type="text" placeholder="Ex: Pour ma sœur Aya..." value={form.pour} onChange={set('pour')} required disabled={status === 'loading'} />
          </div>
          <div className="form-group">
            <label>Chanson souhaitée <span style={{ fontWeight: 400, opacity: .6 }}>(optionnel)</span></label>
            <input type="text" placeholder="Ex: Yemi Alade - Sweety" value={form.chanson} onChange={set('chanson')} disabled={status === 'loading'} />
          </div>
        </div>

        <div className="form-group">
          <label>Votre message</label>
          <textarea placeholder="Écrivez votre message de dédicace..." rows={4} value={form.message} onChange={set('message')} required disabled={status === 'loading'} />
        </div>

        {status === 'error' && <p className="ded-error">{errorMsg}</p>}

        <button type="submit" className="btn btn-or" disabled={status === 'loading'}>
          {status === 'loading' ? 'Envoi en cours...' : '🎵 Envoyer la Dédicace'}
        </button>
      </form>
    </section>
  )
}
