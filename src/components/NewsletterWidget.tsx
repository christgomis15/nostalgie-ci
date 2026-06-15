'use client'
import { useState } from 'react'

const FREQUENCES = [
  { freq: '101.1', ville: 'Abidjan' },
  { freq: '106.5', ville: 'Bouaké' },
  { freq: '92.8',  ville: 'Yamoussoukro' },
  { freq: '97.3',  ville: 'San-Pédro' },
  { freq: '98.3',  ville: 'Daloa' },
  { freq: '91.7',  ville: 'Korhogo' },
  { freq: '87.9',  ville: 'Abengourou' },
]

export default function NewsletterWidget() {
  const [email, setEmail]       = useState('')
  const [prenom, setPrenom]     = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus]     = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prenom, website: honeypot }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  return (
    <section className="nl-section">

      {/* ── Formulaire ── */}
      <div className="nl-inner">
        <span className="nl-badge">Newsletter · Chaque vendredi</span>

        <h2 className="nl-title">
          Rejoignez la communauté<br />
          <em>Nostalgie CI</em>
        </h2>

        <p className="nl-sub">
          Programmes, top charts, coulisses et exclusivités dans votre boîte mail.
        </p>

        {status === 'ok' ? (
          <div className="nl-success">
            <div className="nl-success-icon">✓</div>
            <p className="nl-success-text">
              Bienvenue {prenom ? prenom + ' !' : '!'}<br />
              <span>Votre première newsletter arrive vendredi.</span>
            </p>
          </div>
        ) : (
          <form className="nl-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="nl-row">
              <input
                className="nl-input"
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                autoComplete="given-name"
              />
              <input
                className="nl-input nl-input-email"
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button className="nl-btn" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Envoi…' : "S'abonner"}
              </button>
            </div>
            {status === 'err' && (
              <p className="nl-error">Une erreur est survenue. Réessayez.</p>
            )}
          </form>
        )}

        <p className="nl-mention">Désinscription en 1 clic · Aucun spam</p>
      </div>

      {/* ── Séparateur ── */}
      <div className="nl-divider">
        <div className="nl-divider-line" />
        <div className="nl-divider-dot" />
        <div className="nl-divider-line" />
      </div>

      {/* ── Fréquences ── */}
      <div className="nl-freq">
        <p className="nl-freq-label">Nos fréquences en Côte d&apos;Ivoire</p>
        <div className="nl-freq-badges">
          {FREQUENCES.map((f) => (
            <div key={f.freq} className="nl-freq-badge">
              <span className="nl-freq-num">{f.freq}</span>
              <span className="nl-freq-fm">FM</span>
              <span className="nl-freq-ville">{f.ville}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
