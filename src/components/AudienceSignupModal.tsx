'use client'

import { useEffect, useState } from 'react'

const DONE_KEY = 'audience-signup-done'
const DISMISSED_KEY = 'audience-signup-dismissed'
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000
const SHOW_DELAY_MS = 6000

const VILLES = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Daloa', 'Korhogo', 'Abengourou']

export default function AudienceSignupModal() {
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [telephone, setTelephone] = useState('')
  const [ville, setVille] = useState('')
  const [consentement, setConsentement] = useState(false)
  const [hp, setHp] = useState('')

  useEffect(() => {
    if (localStorage.getItem(DONE_KEY)) return
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (dismissed && Date.now() - parseInt(dismissed) < SNOOZE_MS) return

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function close() {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString())
    setVisible(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inscription_auditeur',
          nom, prenom, dateNaissance, telephone, ville, consentement,
          website: hp,
        }),
      })
      if (!res.ok) throw new Error()
      localStorage.setItem(DONE_KEY, '1')
      setStatus('sent')
      setTimeout(() => setVisible(false), 2500)
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div className="actu-overlay" onClick={close}>
      <div className="top5-modal aud-modal" onClick={e => e.stopPropagation()}>
        <button className="actu-close" onClick={close} aria-label="Fermer">✕</button>

        {status === 'sent' ? (
          <div className="ct-form-success">Merci {prenom} ! Vous faites maintenant partie de la communauté Nostalgie CI.</div>
        ) : (
          <form className="ct-form" onSubmit={submit}>
            <input type="text" name="website" className="hp-field" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} aria-hidden="true" />
            <h3 className="cf-title">Rejoignez la communauté Nostalgie CI</h3>
            <p className="cf-sub">Inscrivez-vous pour recevoir nos offres, jeux concours et surprises par SMS.</p>

            <div className="form-row">
              <div className="form-group"><label>Nom</label><input type="text" placeholder="Konan" value={nom} onChange={e => setNom(e.target.value)} disabled={status === 'loading'} required /></div>
              <div className="form-group"><label>Prénom</label><input type="text" placeholder="Jean" value={prenom} onChange={e => setPrenom(e.target.value)} disabled={status === 'loading'} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Date de naissance</label><input type="date" max={new Date().toISOString().slice(0, 10)} value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} disabled={status === 'loading'} required /></div>
              <div className="form-group"><label>Téléphone</label><input type="tel" placeholder="+225 07 XX XX XX XX" value={telephone} onChange={e => setTelephone(e.target.value)} disabled={status === 'loading'} required /></div>
            </div>
            <div className="form-group">
              <label>Ville de résidence</label>
              <input type="text" list="aud-villes" placeholder="Abidjan" value={ville} onChange={e => setVille(e.target.value)} disabled={status === 'loading'} required />
              <datalist id="aud-villes">
                {VILLES.map(v => <option key={v} value={v} />)}
              </datalist>
            </div>

            <label className="chk-item" style={{ marginBottom: '14px' }}>
              <input type="checkbox" checked={consentement} onChange={e => setConsentement(e.target.checked)} disabled={status === 'loading'} required />
              <span>J&apos;accepte d&apos;être contacté(e) par SMS/téléphone par Nostalgie CI pour des offres et informations.</span>
            </label>

            {status === 'error' && <p style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '10px' }}>Une erreur est survenue. Réessayez.</p>}

            <button type="submit" className="btn btn-or" disabled={status === 'loading'} style={{ width: '100%' }}>
              {status === 'loading' ? 'Envoi...' : "Je m'inscris"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
