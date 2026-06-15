'use client'
import { useState } from 'react'

export default function NewsletterWidget() {
  const [email, setEmail]     = useState('')
  const [prenom, setPrenom]   = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

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
      <div className="nl-inner">
        <div className="nl-deco-line" />
        <span className="nl-badge">Newsletter</span>
        <h2 className="nl-title">Restez dans le&nbsp;rythme</h2>
        <p className="nl-sub">
          Programmes, top charts, coulisses et exclusivités —<br />
          chaque vendredi dans votre boîte mail.
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
            {/* Honeypot anti-spam */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="nl-fields">
              <input
                className="nl-input"
                type="text"
                placeholder="Votre prénom"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                autoComplete="given-name"
              />
              <input
                className="nl-input nl-input-email"
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button className="nl-btn" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Inscription…' : "S'abonner"}
              </button>
            </div>
            {status === 'err' && (
              <p className="nl-error">Une erreur est survenue. Réessayez dans un instant.</p>
            )}
          </form>
        )}

        <p className="nl-mention">Désinscription en 1 clic · Aucun spam · Données protégées</p>
      </div>
    </section>
  )
}
