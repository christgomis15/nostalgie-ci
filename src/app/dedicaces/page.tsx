'use client'

import { useState } from 'react'

const EMISSIONS_LIST = [
  'Le Crazy Morning (Lun–Ven · 06h–10h)',
  'Hits & Co (Lun–Ven · 12h–15h)',
  'Brand New (Lun–Ven · 15h–16h)',
  "L'Afterwork (Lun–Jeu · 17h–19h)",
  'La Peufra (Samedis · 14h–16h)',
  'Kaboré Fait Son Show (Sam–Dim · 18h–19h)',
]

type FormState = {
  prenom: string
  ville: string
  pour: string
  chanson: string
  message: string
  emission: string
}

export default function Dedicaces() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState<FormState>({
    prenom: '', ville: '', pour: '', chanson: '', message: '', emission: '',
  })

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/dedicaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Erreur inconnue')
      }

      setStatus('sent')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur lors de l\'envoi.')
      setStatus('error')
    }
  }

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
              setForm({ prenom: '', ville: '', pour: '', chanson: '', message: '', emission: '' })
            }}
            style={{ marginTop: '24px' }}
          >
            Envoyer une autre dédicace
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section">
      <p className="section-label">Faites plaisir</p>
      <h1 className="section-title">Envoyer une Dédicace</h1>

      <form className="ded-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Votre prénom</label>
            <input
              type="text"
              placeholder="Ex: Kouamé"
              value={form.prenom}
              onChange={set('prenom')}
              required
              disabled={status === 'loading'}
            />
          </div>
          <div className="form-group">
            <label>Votre ville</label>
            <input
              type="text"
              placeholder="Ex: Cocody, Abidjan"
              value={form.ville}
              onChange={set('ville')}
              required
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pour qui ?</label>
            <input
              type="text"
              placeholder="Ex: Pour ma sœur Aya..."
              value={form.pour}
              onChange={set('pour')}
              required
              disabled={status === 'loading'}
            />
          </div>
          <div className="form-group">
            <label>Chanson souhaitée</label>
            <input
              type="text"
              placeholder="Ex: Yemi Alade - Sweety"
              value={form.chanson}
              onChange={set('chanson')}
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Émission</label>
          <select
            value={form.emission}
            onChange={set('emission')}
            required
            disabled={status === 'loading'}
          >
            <option value="">Choisissez une émission</option>
            {EMISSIONS_LIST.map(em => (
              <option key={em} value={em}>{em}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Votre message</label>
          <textarea
            placeholder="Écrivez votre message de dédicace..."
            rows={4}
            value={form.message}
            onChange={set('message')}
            required
            disabled={status === 'loading'}
          />
        </div>

        {status === 'error' && (
          <p className="ded-error">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="btn btn-or"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Envoi en cours...' : '🎵 Envoyer la Dédicace'}
        </button>
      </form>
    </section>
  )
}
