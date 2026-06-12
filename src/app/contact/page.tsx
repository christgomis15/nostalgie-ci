'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [tab, setTab] = useState<'commercial' | 'partenariat' | 'publicite'>('commercial')

  return (
    <section className="page-section">
      <p className="section-label">Travaillons ensemble</p>
      <h1 className="section-title">Nous Contacter</h1>
      <div className="ctabs">
        <button className={`ctab ${tab === 'commercial' ? 'active' : ''}`} onClick={() => setTab('commercial')}>
          Informations Commerciales
        </button>
        <button className={`ctab ${tab === 'partenariat' ? 'active' : ''}`} onClick={() => setTab('partenariat')}>
          Demande de Partenariat
        </button>
        <button className={`ctab ${tab === 'publicite' ? 'active' : ''}`} onClick={() => setTab('publicite')}>
          Publicité sur le site
        </button>
      </div>

      {tab === 'commercial' && (
        <div className="ct-layout">
          <div className="ct-info">
            <h3>Service Commercial</h3>
            <p>Notre équipe commerciale est à votre disposition pour toute demande de publicité ou sponsoring.</p>
            <div className="ci-line"><span className="ci-ic">📞</span><span>+225 20 21 10 53</span></div>
            <div className="ci-line"><span className="ci-ic">✉️</span><span>commercial@nostalgie.ci</span></div>
            <div className="ci-line"><span className="ci-ic">📍</span><span>Abidjan Plateau · Avenue Chardy</span></div>
            <div className="ci-line"><span className="ci-ic">🕐</span><span>Lun–Ven · 08h–17h</span></div>
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(245,240,232,0.35)' }}>
              Réponse sous 24 heures ouvrées
            </p>
          </div>
          <CommercialForm />
        </div>
      )}

      {tab === 'publicite' && (
        <div className="ct-pub-panel">
          <div className="ct-pub-left">
            <h3>Espaces publicitaires web</h3>
            <p>Faites connaître votre marque auprès de nos auditeurs directement sur le site de Nostalgie CI.</p>
            <div className="ci-line"><span className="ci-ic">📍</span><span>9 emplacements disponibles</span></div>
            <div className="ci-line"><span className="ci-ic">📅</span><span>Durées : 1 semaine, 1 mois, 3 mois, 6 mois</span></div>
            <div className="ci-line"><span className="ci-ic">✉️</span><span>assistant.comercial@nostalgie.ci</span></div>
            <div className="ci-line"><span className="ci-ic">🕐</span><span>Réponse sous 24h ouvrées</span></div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(245,240,232,0.4)' }}>
              Paiement hors ligne après confirmation. Aucun engagement sans devis signé.
            </p>
          </div>
          <div className="ct-pub-right">
            <h3>Réservez votre espace</h3>
            <p>Choisissez vos emplacements, sélectionnez votre durée et obtenez le coût total instantanément.</p>
            <Link href="/reserver" className="btn btn-or" style={{ display: 'inline-block', marginTop: '16px' }}>
              Accéder au formulaire de réservation →
            </Link>
            <p style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(245,240,232,0.4)' }}>
              Vous pouvez aussi consulter le{' '}
              <Link href="/media-kit" style={{ color: 'var(--or)' }}>Kit Média</Link>{' '}
              pour visualiser tous les emplacements disponibles.
            </p>
          </div>
        </div>
      )}

      {tab === 'partenariat' && (
        <div className="ct-layout">
          <div className="ct-info">
            <h3>Service Marketing</h3>
            <p>Nous accompagnons vos événements avec une couverture médiatique complète.</p>
            <div className="ci-line"><span className="ci-ic">📞</span><span>+225 20 21 85 50</span></div>
            <div className="ci-line"><span className="ci-ic">✉️</span><span>marketing@nostalgie.ci</span></div>
            <div className="ci-line"><span className="ci-ic">📍</span><span>Abidjan Plateau · Avenue Chardy</span></div>
            <div className="ci-line"><span className="ci-ic">🕐</span><span>Lun–Ven · 08h–17h</span></div>
            <p className="ct-services-title">Nos services</p>
            {['Annonces antenne', 'Live réseaux sociaux', 'Présence terrain', 'Couverture digitale'].map(s => (
              <p key={s} className="ct-service-item">· {s}</p>
            ))}
          </div>
          <PartenaireForm />
        </div>
      )}
    </section>
  )
}

function CommercialForm() {
  const [sent, setSent] = useState(false)
  if (sent) return <div className="ct-form-success">Message envoyé ! Nous vous répondrons sous 24h ouvrées.</div>
  return (
    <form className="ct-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>
      <h3 className="cf-title">Demande Commerciale</h3>
      <p className="cf-sub">Publicité, sponsoring, jingles... Décrivez votre besoin.</p>
      <div className="form-row">
        <div className="form-group"><label>Nom & Prénom</label><input type="text" placeholder="Jean Konan" required /></div>
        <div className="form-group"><label>Entreprise / Marque</label><input type="text" placeholder="Ma Marque SARL" required /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Téléphone</label><input type="tel" placeholder="+225 07 XX XX XX XX" required /></div>
        <div className="form-group"><label>Email</label><input type="email" placeholder="contact@mamarque.ci" required /></div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Type de prestation</label>
          <select>
            <option value="">Sélectionner...</option>
            <option>Spot publicitaire</option>
            <option>Sponsoring d&apos;émission</option>
            <option>Jingle personnalisé</option>
            <option>Partenariat éditorial</option>
            <option>Opération spéciale</option>
            <option>Pack digital</option>
            <option>Live mention</option>
            <option>Autre</option>
          </select>
        </div>
        <div className="form-group">
          <label>Budget estimé</label>
          <select>
            <option value="">Sélectionner...</option>
            <option>Moins de 500 000 FCFA</option>
            <option>500 000 – 1 000 000 FCFA</option>
            <option>1 – 5 millions FCFA</option>
            <option>5 – 10 millions FCFA</option>
            <option>Plus de 10 millions FCFA</option>
          </select>
        </div>
      </div>
      <div className="form-group"><label>Votre message</label><textarea rows={3} placeholder="Décrivez votre projet..." /></div>
      <button type="submit" className="btn btn-or">Envoyer la demande</button>
    </form>
  )
}

function PartenaireForm() {
  const [sent, setSent] = useState(false)
  const [checks, setChecks] = useState<string[]>([])
  const SERVICES = ['Annonces antenne', 'Animation live', 'Présence terrain', 'Couverture digitale', 'Interview en direct', 'Jeu concours']
  const toggle = (s: string) => setChecks(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  if (sent) return <div className="ct-form-success">Demande envoyée ! Notre équipe marketing vous contactera rapidement.</div>
  return (
    <form className="ct-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>
      <h3 className="cf-title">Demande de Partenariat</h3>
      <p className="cf-sub">Pour vos événements, concerts, festivals et activations de marque.</p>
      <div className="form-row">
        <div className="form-group"><label>Nom du contact</label><input type="text" placeholder="Nom complet" required /></div>
        <div className="form-group"><label>Organisation</label><input type="text" placeholder="Nom de l&apos;organisation" required /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Téléphone</label><input type="tel" placeholder="+225 07 XX XX XX XX" required /></div>
        <div className="form-group"><label>Email</label><input type="email" placeholder="email@organisation.ci" required /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Nom de l&apos;événement</label><input type="text" placeholder="Ex: Abidjan Music Fest" required /></div>
        <div className="form-group">
          <label>Type d&apos;événement</label>
          <select>
            <option value="">Sélectionner...</option>
            <option>Concert / Festival</option>
            <option>Conférence</option>
            <option>Lancement produit</option>
            <option>Événement sportif</option>
            <option>Soirée de gala</option>
            <option>Défilé / Fashion</option>
            <option>Événement culturel</option>
            <option>Autre</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Date prévue</label><input type="date" /></div>
        <div className="form-group"><label>Lieu</label><input type="text" placeholder="Ex: Palais de la Culture, Abidjan" /></div>
      </div>
      <div className="form-group">
        <label>Partenariats souhaités</label>
        <div className="chk-group">
          {SERVICES.map(s => (
            <label key={s} className="chk-item">
              <input type="checkbox" checked={checks.includes(s)} onChange={() => toggle(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-group"><label>Description du projet</label><textarea rows={3} placeholder="Décrivez votre projet et vos attentes..." /></div>
      <button type="submit" className="btn btn-or">Envoyer la demande</button>
    </form>
  )
}
