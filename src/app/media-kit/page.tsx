import Link from 'next/link'

export const metadata = {
  title: 'Kit Média — Nostalgie CI 101.1 FM',
  description: 'Espaces publicitaires disponibles sur nostalgie-ci.vercel.app',
  robots: 'noindex',
}

const ESPACES = [
  {
    num: 1,
    color: '#E74C3C',
    titre: 'Bandeau sous le menu',
    desc: 'Votre publicité s\'affiche juste sous le menu de navigation. Chaque visiteur la voit en arrivant sur n\'importe quelle page du site.',
    presence: 'Toutes les pages',
    icone: '👁️',
  },
  {
    num: 2,
    color: '#E67E22',
    titre: 'Bandeau page d\'accueil',
    desc: 'Un grand espace visuel sur la page d\'accueil, la première chose que voit un visiteur. Idéal pour un lancement de produit.',
    presence: 'Page d\'accueil',
    icone: '🏠',
  },
  {
    num: 3,
    color: '#2ECC71',
    titre: 'Logo dans le lecteur radio',
    desc: 'Votre logo apparaît dans la barre du lecteur audio, fixée en bas de l\'écran. Visible en permanence, même quand le visiteur navigue d\'une page à l\'autre.',
    presence: 'Tout le site en permanence',
    icone: '🎵',
  },
  {
    num: 4,
    color: '#3498DB',
    titre: 'Message dans le fil d\'info',
    desc: 'Votre message défile dans le bandeau animé tout en haut du site, à côté des noms des webradios. Un format discret mais toujours visible.',
    presence: 'Tout le site en permanence',
    icone: '📢',
  },
  {
    num: 5,
    color: '#9B59B6',
    titre: 'Encart dans les articles',
    desc: 'Un espace carré inséré dans les pages Actus et Podcasts, au milieu du contenu. Le visiteur le voit naturellement en lisant.',
    presence: 'Pages Actus & Podcasts',
    icone: '📰',
  },
  {
    num: 6,
    color: '#1ABC9C',
    titre: 'Parrainage d\'émission',
    desc: 'Votre marque est associée à une émission spécifique (ex : "Le Crazy Morning présenté par [Votre Marque]"). Fort impact de notoriété.',
    presence: 'Page Émissions',
    icone: '🎙️',
  },
  {
    num: 7,
    color: '#F39C12',
    titre: 'Sponsor des retransmissions Live',
    desc: 'Pendant les lives (matchs, événements), votre logo s\'affiche à côté de la vidéo. Audience maximale lors des grands événements.',
    presence: 'Page Live uniquement',
    icone: '📺',
  },
  {
    num: 8,
    color: '#E91E63',
    titre: 'Habillage complet du site',
    desc: 'Le fond de tout le site prend les couleurs de votre marque. L\'expérience la plus immersive — votre univers enveloppe l\'intégralité du site.',
    presence: 'Tout le site',
    icone: '🎨',
  },
  {
    num: 9,
    color: '#FF5722',
    titre: 'Écran d\'entrée plein écran',
    desc: 'Avant d\'accéder au site, le visiteur voit votre publicité en plein écran pendant quelques secondes. Le format le plus impactant.',
    presence: 'Première visite',
    icone: '⚡',
  },
]

export default function MediaKit() {
  return (
    <div className="mk2-page">

      {/* ══════════════ COUVERTURE ══════════════ */}
      <div className="mk2-cover">
        <div className="mk2-cover-inner">
          <div className="mk2-cover-logo">NOSTALGIE</div>
          <div className="mk2-cover-freq">101.1 FM · Côte d'Ivoire</div>
          <h1 className="mk2-cover-title">Kit Média</h1>
          <p className="mk2-cover-sub">Faites connaître votre marque à nos auditeurs sur le web</p>
          <div className="mk2-cover-stats">
            <div className="mk2-cover-stat">
              <span>6</span> villes couvertes
            </div>
            <div className="mk2-cover-stat-sep">·</div>
            <div className="mk2-cover-stat">
              Radio <span>N°1</span> de Côte d'Ivoire
            </div>
            <div className="mk2-cover-stat-sep">·</div>
            <div className="mk2-cover-stat">
              Site disponible <span>24h/24</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mk2-body">

        {/* ══════════════ GRANDE MAQUETTE ANNOTÉE ══════════════ */}
        <section className="mk2-section">
          <div className="mk2-section-label">OÙ APPARAÎT VOTRE MARQUE ?</div>
          <h2 className="mk2-section-title">Visualisez votre publicité sur le site</h2>
          <p className="mk2-section-desc">
            Chaque numéro ci-dessous correspond à un espace disponible. Retrouvez le détail de chaque espace dans les fiches plus bas.
          </p>

          <div className="mk2-annotated">

            {/* ── Maquette du site ── */}
            <div className="mk2-site">

              {/* Ticker — espace 4 */}
              <div className="mk2-s-ticker">
                <div className="mk2-s-ticker-content">Nostalgie Live · Nouveautés · Zouglou · Coupé Décalé · Afrobeats</div>
                <div className="mk2-callout" style={{ background: '#3498DB' }}>4</div>
              </div>

              {/* Header */}
              <div className="mk2-s-header">
                <div className="mk2-s-logo">NOSTALGIE <span>101.1 FM</span></div>
                <div className="mk2-s-nav">Accueil · Émissions · Actus · Podcasts · Live</div>
                <div className="mk2-s-pill">● DIRECT</div>
              </div>

              {/* Leaderboard — espace 1 */}
              <div className="mk2-s-ad mk2-s-leaderboard" style={{ borderColor: '#E74C3C', background: 'rgba(231,76,60,0.08)' }}>
                <span style={{ color: '#E74C3C' }}>Votre publicité ici</span>
                <div className="mk2-callout" style={{ background: '#E74C3C' }}>1</div>
              </div>

              {/* Hero */}
              <div className="mk2-s-hero">
                {/* Hero banner — espace 2 */}
                <div className="mk2-s-ad mk2-s-hero-banner" style={{ borderColor: '#E67E22', background: 'rgba(230,126,34,0.08)' }}>
                  <span style={{ color: '#E67E22' }}>Votre publicité ici</span>
                  <div className="mk2-callout" style={{ background: '#E67E22' }}>2</div>
                </div>
                <div className="mk2-s-hero-content">
                  <div className="mk2-s-eyebrow">Première Radio Commerciale Privée de Côte d'Ivoire</div>
                  <div className="mk2-s-h1">NOSTALGIE</div>
                  <div className="mk2-s-slogan">Sérieusement Décalée.</div>
                  <div className="mk2-s-btns">
                    <div className="mk2-s-btn-or">▶ Écouter</div>
                    <div className="mk2-s-btn-out">Podcasts</div>
                  </div>
                </div>
              </div>

              {/* Content zone */}
              <div className="mk2-s-content">
                <div className="mk2-s-articles">
                  {/* Émission card avec sponsoring */}
                  {[1,2,3,4].map(i => (
                    <div key={i} className="mk2-s-card" style={{ position: 'relative' }}>
                      {i === 3 && (
                        <div className="mk2-s-ad mk2-s-em-sponsor" style={{ borderColor: '#1ABC9C', background: 'rgba(26,188,156,0.15)' }}>
                          <span style={{ color: '#1ABC9C', fontSize: 9 }}>Présenté par votre marque</span>
                          <div className="mk2-callout mk2-callout-sm" style={{ background: '#1ABC9C' }}>6</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Encart sidebar — espace 5 */}
                <div className="mk2-s-sidebar">
                  <div className="mk2-s-ad mk2-s-rect" style={{ borderColor: '#9B59B6', background: 'rgba(155,89,182,0.08)' }}>
                    <span style={{ color: '#9B59B6' }}>Votre pub ici</span>
                    <div className="mk2-callout" style={{ background: '#9B59B6' }}>5</div>
                  </div>
                </div>
              </div>

              {/* Habillage overlay — espace 8 */}
              <div className="mk2-s-ad mk2-s-habillage" style={{ borderColor: '#E91E63', background: 'rgba(233,30,99,0.06)' }}>
                <span style={{ color: '#E91E63' }}>Fond du site aux couleurs de votre marque</span>
                <div className="mk2-callout" style={{ background: '#E91E63' }}>8</div>
              </div>

              {/* Player bar — espace 3 */}
              <div className="mk2-s-player">
                <div className="mk2-s-player-info">
                  <div className="mk2-s-player-dot" />
                  <div>
                    <div className="mk2-s-player-name">Nostalgie Live</div>
                    <div className="mk2-s-player-freq">101.1 FM · Direct</div>
                  </div>
                </div>
                <div className="mk2-s-ad mk2-s-player-logo" style={{ borderColor: '#2ECC71', background: 'rgba(46,204,113,0.1)' }}>
                  <span style={{ color: '#2ECC71', fontSize: 10 }}>Votre logo ici</span>
                  <div className="mk2-callout mk2-callout-sm" style={{ background: '#2ECC71' }}>3</div>
                </div>
              </div>
            </div>

            {/* ── Espaces hors maquette (Live + Intro) ── */}
            <div className="mk2-extra-spaces">
              <div className="mk2-extra-card" style={{ borderColor: '#F39C12' }}>
                <div className="mk2-callout mk2-callout-lg" style={{ background: '#F39C12' }}>7</div>
                <div className="mk2-extra-title">Pendant les lives</div>
                <div className="mk2-extra-desc">Votre logo s'affiche à côté de la vidéo lors des retransmissions en direct</div>
                <div className="mk2-extra-icon">📺</div>
              </div>
              <div className="mk2-extra-card" style={{ borderColor: '#FF5722' }}>
                <div className="mk2-callout mk2-callout-lg" style={{ background: '#FF5722' }}>9</div>
                <div className="mk2-extra-title">Écran d'entrée</div>
                <div className="mk2-extra-desc">Votre publicité en plein écran avant que le visiteur accède au site</div>
                <div className="mk2-extra-icon">⚡</div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════ FICHES ESPACES ══════════════ */}
        <section className="mk2-section">
          <div className="mk2-section-label">LES 9 ESPACES EN DÉTAIL</div>
          <h2 className="mk2-section-title">Choisissez votre emplacement</h2>

          <div className="mk2-cards">
            {ESPACES.map(e => (
              <div key={e.num} className="mk2-card">
                <div className="mk2-card-top">
                  <div className="mk2-card-num" style={{ background: e.color }}>{e.num}</div>
                  <div className="mk2-card-icon">{e.icone}</div>
                </div>
                <h3 className="mk2-card-title">{e.titre}</h3>
                <p className="mk2-card-desc">{e.desc}</p>
                <div className="mk2-card-presence">
                  <span className="mk2-card-presence-label">Visibilité :</span>
                  <span style={{ color: e.color }}>{e.presence}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ TARIFS ══════════════ */}
        <section className="mk2-section">
          <div className="mk2-section-label">TARIFS</div>
          <h2 className="mk2-section-title">Grille tarifaire — à compléter</h2>
          <p className="mk2-section-desc">Le service commercial renseigne les tarifs ci-dessous. Imprimez la page (Ctrl+P) pour conserver vos notes.</p>

          <div className="mk2-tarifs">
            {ESPACES.map(e => (
              <div key={e.num} className="mk2-tarif-row">
                <div className="mk2-tarif-num" style={{ background: e.color }}>{e.num}</div>
                <div className="mk2-tarif-nom">{e.titre}</div>
                <div className="mk2-tarif-presence">{e.presence}</div>
                <div className="mk2-tarif-inputs">
                  <div className="mk2-tarif-field">
                    <label>1 semaine</label>
                    <div className="mk2-tarif-input-wrap">
                      <input type="text" placeholder="—" className="mk2-input" />
                      <span>FCFA</span>
                    </div>
                  </div>
                  <div className="mk2-tarif-field">
                    <label>1 mois</label>
                    <div className="mk2-tarif-input-wrap">
                      <input type="text" placeholder="—" className="mk2-input" />
                      <span>FCFA</span>
                    </div>
                  </div>
                  <div className="mk2-tarif-field">
                    <label>3 mois</label>
                    <div className="mk2-tarif-input-wrap">
                      <input type="text" placeholder="—" className="mk2-input" />
                      <span>FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mk2-print-note">
            💡 Ces champs sont modifiables dans votre navigateur. Utilisez <strong>Ctrl+P</strong> pour imprimer ou enregistrer en PDF.
          </div>
        </section>

        {/* ══════════════ CTA RÉSERVATION ══════════════ */}
        <section className="mk2-section mk2-cta-section">
          <div className="mk2-cta-box">
            <div className="mk2-cta-left">
              <div className="mk2-section-label">PRÊT À DÉMARRER ?</div>
              <h2 className="mk2-cta-title">Réservez votre espace en ligne</h2>
              <p className="mk2-cta-desc">
                Choisissez vos emplacements, sélectionnez votre durée et obtenez le coût total instantanément.
                Notre équipe vous confirme la disponibilité sous 24h.
              </p>
            </div>
            <div className="mk2-cta-right">
              <Link href="/reserver" className="mk2-cta-btn">
                Réserver maintenant →
              </Link>
              <p className="mk2-cta-note">Paiement hors ligne · Aucun engagement sans devis signé</p>
            </div>
          </div>
        </section>

        {/* ══════════════ CONTACT ══════════════ */}
        <section className="mk2-contact">
          <div className="mk2-contact-inner">
            <div>
              <div className="mk2-contact-logo">NOSTALGIE</div>
              <div className="mk2-contact-freq">101.1 FM · Côte d'Ivoire</div>
            </div>
            <div className="mk2-contact-info">
              <p>Pour toute demande commerciale :</p>
              <p className="mk2-contact-email">nostalgiecotedivoire@gmail.com</p>
              <p className="mk2-contact-url">nostalgie-ci.vercel.app</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
