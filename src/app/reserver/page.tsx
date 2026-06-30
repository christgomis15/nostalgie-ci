'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ESPACES_PUB, DUREES, formatPrix, type DureeKey } from '@/data/ad-prices'

export default function Reserver() {
  const [duree, setDuree] = useState<DureeKey>('mois')
  const [selected, setSelected] = useState<number[]>([])
  const [nom, setNom] = useState('')
  const [societe, setSociete] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const total = useMemo(() =>
    selected.reduce((sum, id) => {
      const espace = ESPACES_PUB.find(e => e.id === id)
      return sum + (espace ? espace.prix[duree] : 0)
    }, 0),
    [selected, duree]
  )

  const toggle = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selected.length === 0) return
    setStatus('loading')

    const espacesDetail = selected.map(id => {
      const espace = ESPACES_PUB.find(x => x.id === id)!
      return { nom: espace.nom, prix: espace.prix[duree] }
    })

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reservation',
          nom,
          societe,
          email,
          telephone,
          dateDebut,
          duree: DUREES.find(d => d.key === duree)?.label,
          espaces: espacesDetail.map(e => e.nom),
          espacesDetail,
          total: total.toLocaleString('fr-FR') + ' FCFA',
          website: hp,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section className="page-section">
        <div className="rsv-success">
          <div className="rsv-success-icon">✓</div>
          <h2>Demande envoyée !</h2>
          <p>Notre assistant commercial a reçu votre demande de réservation.</p>
          <p>Il vous contactera sous 24h ouvrées pour confirmer la disponibilité et organiser le paiement.</p>
          <Link href="/" className="btn btn-or" style={{ marginTop: '24px', display: 'inline-block' }}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section">
      <p className="section-label">Visibilité sur le web</p>
      <h1 className="section-title">Réserver un espace publicitaire</h1>
      <p className="rsv-intro">
        Choisissez vos emplacements et sélectionnez votre durée de communication.
        Le paiement se fera hors ligne après confirmation de notre équipe commerciale.
      </p>

      {/* Sélecteur de durée */}
      <div className="rsv-duree-bar">
        <span className="rsv-duree-label">Durée :</span>
        {DUREES.map(d => (
          <button
            key={d.key}
            type="button"
            className={`rsv-duree-btn ${duree === d.key ? 'active' : ''}`}
            onClick={() => setDuree(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit}>
        <input type="text" name="website" className="hp-field" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} aria-hidden="true" />
        <div className="rsv-layout">

          {/* Gauche : grille d'espaces */}
          <div className="rsv-espaces">
            <p className="rsv-hint">Cochez les espaces souhaités — les prix s&apos;ajustent selon la durée :</p>
            <div className="rsv-grid">
              {ESPACES_PUB.map(e => (
                <label
                  key={e.id}
                  className={`rsv-card ${selected.includes(e.id) ? 'checked' : ''}`}
                  style={{ '--accent': e.color } as React.CSSProperties}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={() => toggle(e.id)}
                    className="rsv-checkbox-hidden"
                  />
                  <div className="rsv-card-num" style={{ background: e.color }}>{e.id}</div>
                  <div className="rsv-card-icon">{e.icone}</div>
                  <div className="rsv-card-nom">{e.nom}</div>
                  <div className="rsv-card-desc">{e.desc}</div>
                  <div className="rsv-card-prix" style={{ color: e.color }}>
                    {formatPrix(e.prix[duree])}
                  </div>
                  <div className="rsv-card-check">✓</div>
                </label>
              ))}
            </div>
          </div>

          {/* Droite : panneau récap + formulaire */}
          <div className="rsv-sidebar">

            {/* Récap total */}
            <div className="rsv-summary">
              <h3 className="rsv-sum-title">Récapitulatif</h3>

              {selected.length === 0 ? (
                <p className="rsv-sum-empty">Aucun espace sélectionné</p>
              ) : (
                <div className="rsv-sum-items">
                  {selected.map(id => {
                    const espace = ESPACES_PUB.find(x => x.id === id)!
                    return (
                      <div key={id} className="rsv-sum-item">
                        <span className="rsv-sum-dot" style={{ background: espace.color }} />
                        <span className="rsv-sum-nom">{espace.nom}</span>
                        <span className="rsv-sum-prix">{formatPrix(espace.prix[duree])}</span>
                        <button type="button" className="rsv-sum-rm" onClick={() => toggle(id)}>×</button>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="rsv-sum-total">
                <span>TOTAL ESTIMÉ</span>
                <span className="rsv-sum-total-val">{total > 0 ? formatPrix(total) : '—'}</span>
              </div>
              <p className="rsv-sum-note">
                Hors taxes · Durée : {DUREES.find(d => d.key === duree)?.label}
              </p>
            </div>

            {/* Coordonnées */}
            <div className="rsv-contact-form">
              <h3 className="rsv-cf-title">Vos coordonnées</h3>

              <div className="form-group">
                <label>Société / Marque *</label>
                <input
                  type="text" value={societe}
                  onChange={e => setSociete(e.target.value)}
                  placeholder="Ma Marque SARL" required
                />
              </div>
              <div className="form-group">
                <label>Nom du contact *</label>
                <input
                  type="text" value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Jean Konan" required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contact@mamarque.ci" required
                />
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input
                  type="tel" value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  placeholder="+225 07 XX XX XX XX" required
                />
              </div>
              <div className="form-group">
                <label>Date de début souhaitée *</label>
                <input
                  type="date" value={dateDebut}
                  onChange={e => setDateDebut(e.target.value)} required
                />
              </div>

              {status === 'error' && (
                <p className="ded-error">
                  Erreur lors de l&apos;envoi. Veuillez réessayer ou nous appeler.
                </p>
              )}

              <button
                type="submit"
                className="btn btn-or rsv-submit"
                disabled={selected.length === 0 || status === 'loading'}
              >
                {status === 'loading'
                  ? 'Envoi en cours...'
                  : selected.length === 0
                    ? 'Sélectionnez au moins un espace'
                    : `Envoyer ma demande · ${formatPrix(total)}`}
              </button>

              <p className="rsv-submit-note">
                Paiement hors ligne · Confirmation sous 24h · Aucun engagement sans devis signé
              </p>
            </div>

          </div>
        </div>
      </form>
    </section>
  )
}
