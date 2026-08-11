'use client'

import { useEffect, useState } from 'react'

const DONE_KEY = 'audience-signup-done'
const DISMISSED_KEY = 'audience-signup-dismissed'
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000
const SHOW_DELAY_MS = 6000

const VILLES = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Daloa', 'Korhogo', 'Abengourou']

const MOIS = [
  { v: '01', l: 'Janvier' }, { v: '02', l: 'Février' }, { v: '03', l: 'Mars' },
  { v: '04', l: 'Avril' }, { v: '05', l: 'Mai' }, { v: '06', l: 'Juin' },
  { v: '07', l: 'Juillet' }, { v: '08', l: 'Août' }, { v: '09', l: 'Septembre' },
  { v: '10', l: 'Octobre' }, { v: '11', l: 'Novembre' }, { v: '12', l: 'Décembre' },
]
const JOURS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
const ANNEE_COURANTE = new Date().getFullYear()
const ANNEES = Array.from({ length: 100 }, (_, i) => String(ANNEE_COURANTE - i))

export default function AudienceSignupModal() {
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [naissJour, setNaissJour] = useState('')
  const [naissMois, setNaissMois] = useState('')
  const [naissAnnee, setNaissAnnee] = useState('')
  const dateNaissance = naissJour && naissMois && naissAnnee ? `${naissAnnee}-${naissMois}-${naissJour}` : ''
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
            <div className="form-group">
              <label>Date de naissance</label>
              <div className="naiss-row">
                <select value={naissJour} onChange={e => setNaissJour(e.target.value)} disabled={status === 'loading'} required>
                  <option value="" disabled>Jour</option>
                  {JOURS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <select value={naissMois} onChange={e => setNaissMois(e.target.value)} disabled={status === 'loading'} required>
                  <option value="" disabled>Mois</option>
                  {MOIS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                </select>
                <select value={naissAnnee} onChange={e => setNaissAnnee(e.target.value)} disabled={status === 'loading'} required>
                  <option value="" disabled>Année</option>
                  {ANNEES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Téléphone</label><input type="tel" placeholder="+225 07 XX XX XX XX" value={telephone} onChange={e => setTelephone(e.target.value)} disabled={status === 'loading'} required /></div>
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
