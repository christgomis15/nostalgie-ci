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

export default function Dedicaces() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    prenom: '', ville: '', pour: '', chanson: '', message: '', emission: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (sent) {
    return (
      <section className="page-section">
        <p className="section-label">Faites plaisir</p>
        <div className="ded-confirm">
          <p className="ded-confirm-icon">🎶</p>
          <h2>Dédicace envoyée !</h2>
          <p>Restez à l&apos;écoute sur 101.1 FM pour entendre votre dédicace.</p>
          <button className="btn btn-or" onClick={() => setSent(false)} style={{ marginTop: '24px' }}>
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
      <form className="ded-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>
        <div className="form-row">
          <div className="form-group">
            <label>Votre prénom</label>
            <input type="text" placeholder="Ex: Kouamé" value={form.prenom} onChange={set('prenom')} required />
          </div>
          <div className="form-group">
            <label>Votre ville</label>
            <input type="text" placeholder="Ex: Cocody, Abidjan" value={form.ville} onChange={set('ville')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Pour qui ?</label>
            <input type="text" placeholder="Ex: Pour ma sœur Aya..." value={form.pour} onChange={set('pour')} required />
          </div>
          <div className="form-group">
            <label>Chanson souhaitée</label>
            <input type="text" placeholder="Ex: Yemi Alade - Sweety" value={form.chanson} onChange={set('chanson')} />
          </div>
        </div>
        <div className="form-group">
          <label>Émission</label>
          <select value={form.emission} onChange={set('emission')} required>
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
          />
        </div>
        <button type="submit" className="btn btn-or">🎵 Envoyer la Dédicace</button>
      </form>
    </section>
  )
}
