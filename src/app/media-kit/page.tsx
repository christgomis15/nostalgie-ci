import Link from 'next/link'

export const metadata = {
  title: 'Kit Média — Nostalgie CI 101.1 FM',
  description: 'Espaces publicitaires et offres de sponsoring — Nostalgie CI',
  robots: 'noindex',
}

const FORMATS = [
  {
    id: 'A',
    color: '#E74C3C',
    nom: 'Bannière Leaderboard',
    dimensions: '728 × 90 px',
    position: 'Sous le menu de navigation — toutes les pages',
    visibilite: 'Toutes les pages du site',
    format: 'Image JPG/PNG ou GIF animé',
  },
  {
    id: 'B',
    color: '#E67E22',
    nom: 'Bannière Hero',
    dimensions: 'Pleine largeur × 80 px',
    position: 'Bandeau sur la page d\'accueil, au-dessus du titre',
    visibilite: 'Page d\'accueil uniquement',
    format: 'Image ou texte + logo',
  },
  {
    id: 'C',
    color: '#2ECC71',
    nom: 'Sponsoring Player Audio',
    dimensions: 'Logo 120 × 40 px',
    position: 'Dans la barre player audio (bas de page) — toutes les pages',
    visibilite: 'Toutes les pages — visible en permanence',
    format: 'Logo PNG fond transparent',
  },
  {
    id: 'D',
    color: '#3498DB',
    nom: 'Sponsoring Ticker',
    dimensions: 'Texte + logo 100 × 30 px',
    position: 'Dans le bandeau ticker en haut de page',
    visibilite: 'Toutes les pages — visible en permanence',
    format: 'Texte court + logo',
  },
  {
    id: 'E',
    color: '#9B59B6',
    nom: 'Carré Medium Rectangle',
    dimensions: '300 × 250 px',
    position: 'Encart dans les pages Actus, Podcasts, Contact',
    visibilite: 'Pages de contenu',
    format: 'Image JPG/PNG ou GIF animé',
  },
  {
    id: 'F',
    color: '#1ABC9C',
    nom: 'Sponsoring Émission',
    dimensions: 'Logo 200 × 60 px',
    position: 'Sur la carte d\'une émission spécifique',
    visibilite: 'Page Émissions',
    format: 'Logo PNG + texte "Présenté par"',
  },
  {
    id: 'G',
    color: '#F39C12',
    nom: 'Sponsoring Live',
    dimensions: 'Logo 200 × 60 px + bannière 728×90',
    position: 'Page Live pendant les retransmissions',
    visibilite: 'Page /live pendant les lives',
    format: 'Logo + bannière',
  },
  {
    id: 'H',
    color: '#E91E63',
    nom: 'Habillage de page (Skin)',
    dimensions: 'Fond pleine page',
    position: 'Arrière-plan du site entier — premium',
    visibilite: 'Toutes les pages',
    format: 'Visuel large format 1920 × 1080 px',
  },
  {
    id: 'I',
    color: '#FF5722',
    nom: 'Interstitiel / Intro',
    dimensions: 'Plein écran',
    position: 'Page d\'intro (actuellement Coupe du Monde)',
    visibilite: '1ère visite — avant l\'accueil',
    format: 'Image ou vidéo courte plein écran',
  },
]

export default function MediaKit() {
  return (
    <div className="mk-page">
      {/* ── En-tête ── */}
      <div className="mk-header">
        <div className="mk-header-inner">
          <div>
            <p className="mk-eyebrow">Kit Média · Confidentiel</p>
            <h1 className="mk-title">Nostalgie CI — 101.1 FM</h1>
            <p className="mk-subtitle">Espaces publicitaires & Offres de Sponsoring</p>
          </div>
          <div className="mk-stats">
            <div className="mk-stat">
              <span className="mk-stat-n">6</span>
              <span className="mk-stat-l">Villes couvertes</span>
            </div>
            <div className="mk-stat">
              <span className="mk-stat-n">101.1</span>
              <span className="mk-stat-l">FM Abidjan</span>
            </div>
            <div className="mk-stat">
              <span className="mk-stat-n">N°1</span>
              <span className="mk-stat-l">Radio privée CI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mk-body">

        {/* ── Maquette visuelle ── */}
        <section className="mk-section">
          <h2 className="mk-section-title">Cartographie des espaces</h2>
          <p className="mk-section-sub">Représentation schématique du site — chaque couleur correspond à un espace disponible</p>

          <div className="mk-mockup">
            {/* Ticker */}
            <div className="mk-mock-ticker" style={{ background: '#3498DB22', border: '2px dashed #3498DB' }}>
              <span style={{ color: '#3498DB', fontWeight: 700, fontSize: 11 }}>D — TICKER SPONSOR</span>
            </div>
            {/* Header */}
            <div className="mk-mock-header">
              <span>NOSTALGIE 101.1 FM</span>
              <span style={{ fontSize: 11, opacity: 0.4 }}>Accueil · Émissions · Actus · Podcasts · Live</span>
              <span className="mk-mock-pill">DIRECT</span>
            </div>
            {/* Leaderboard */}
            <div className="mk-mock-ad" style={{ background: '#E74C3C22', border: '2px dashed #E74C3C', height: 44 }}>
              <span style={{ color: '#E74C3C', fontWeight: 700, fontSize: 11 }}>A — BANNIÈRE LEADERBOARD (728×90)</span>
            </div>
            {/* Hero */}
            <div className="mk-mock-hero">
              <div className="mk-mock-ad" style={{ background: '#E67E2222', border: '2px dashed #E67E22', height: 36, marginBottom: 8 }}>
                <span style={{ color: '#E67E22', fontWeight: 700, fontSize: 11 }}>B — BANNIÈRE HERO</span>
              </div>
              <div style={{ opacity: 0.3 }}>
                <div style={{ height: 14, background: '#D4A843', width: 200, marginBottom: 8, borderRadius: 2 }} />
                <div style={{ height: 28, background: '#F5F0E8', width: 340, marginBottom: 12, borderRadius: 2 }} />
                <div style={{ height: 12, background: '#F5F0E8', width: 260, marginBottom: 20, borderRadius: 2 }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ height: 36, width: 140, background: '#D4A843', borderRadius: 4 }} />
                  <div style={{ height: 36, width: 120, background: 'transparent', border: '1px solid #D4A843', borderRadius: 4 }} />
                </div>
              </div>
            </div>
            {/* Content row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 8 }}>
              <div style={{ background: '#1E1E1E', padding: 16, borderRadius: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ background: '#2A2A2A', height: 80, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                      {i === 2 && (
                        <div style={{ position: 'absolute', inset: 0, background: '#1ABC9C22', border: '2px dashed #1ABC9C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#1ABC9C', fontWeight: 700, fontSize: 10 }}>F — SPONSORING ÉMISSION</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mk-mock-ad" style={{ background: '#9B59B622', border: '2px dashed #9B59B6', height: 'auto', minHeight: 170 }}>
                <span style={{ color: '#9B59B6', fontWeight: 700, fontSize: 11 }}>E — CARRÉ 300×250</span>
              </div>
            </div>
            {/* Habillage overlay indicator */}
            <div className="mk-mock-ad" style={{ background: '#E91E6322', border: '2px dashed #E91E63', height: 36, marginTop: 8 }}>
              <span style={{ color: '#E91E63', fontWeight: 700, fontSize: 11 }}>H — HABILLAGE PAGE (fond plein écran)</span>
            </div>
            {/* Player bar */}
            <div className="mk-mock-player">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div style={{ width: 36, height: 36, background: '#2A2A2A', borderRadius: '50%' }} />
                <div>
                  <div style={{ height: 10, width: 100, background: '#3A3A3A', borderRadius: 2, marginBottom: 5 }} />
                  <div style={{ height: 8, width: 70, background: '#2A2A2A', borderRadius: 2 }} />
                </div>
              </div>
              <div className="mk-mock-ad" style={{ background: '#2ECC7122', border: '2px dashed #2ECC71', height: 36, width: 180, margin: 0, flexShrink: 0 }}>
                <span style={{ color: '#2ECC71', fontWeight: 700, fontSize: 10 }}>C — LOGO SPONSOR PLAYER</span>
              </div>
            </div>
          </div>

          {/* Légende */}
          <div className="mk-legend">
            {FORMATS.map(f => (
              <div key={f.id} className="mk-legend-item">
                <span className="mk-legend-dot" style={{ background: f.color }} />
                <span className="mk-legend-id">{f.id}</span>
                <span className="mk-legend-name">{f.nom}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tableau des formats ── */}
        <section className="mk-section">
          <h2 className="mk-section-title">Détail des formats</h2>
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Espace</th>
                  <th>Dimensions</th>
                  <th>Emplacement</th>
                  <th>Visibilité</th>
                  <th>Format accepté</th>
                </tr>
              </thead>
              <tbody>
                {FORMATS.map(f => (
                  <tr key={f.id}>
                    <td>
                      <span className="mk-ref" style={{ background: f.color }}>{f.id}</span>
                    </td>
                    <td><strong>{f.nom}</strong></td>
                    <td className="mk-td-mono">{f.dimensions}</td>
                    <td>{f.position}</td>
                    <td>{f.visibilite}</td>
                    <td>{f.format}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Grille tarifaire ── */}
        <section className="mk-section">
          <h2 className="mk-section-title">Grille tarifaire</h2>
          <p className="mk-section-sub">À compléter par le service commercial — montants en FCFA HT/mois</p>
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Espace</th>
                  <th>Durée</th>
                  <th>Tarif indicatif</th>
                  <th>Tarif négocié</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {FORMATS.map(f => (
                  <tr key={f.id}>
                    <td><span className="mk-ref" style={{ background: f.color }}>{f.id}</span></td>
                    <td><strong>{f.nom}</strong></td>
                    <td>
                      <select className="mk-select">
                        <option>1 semaine</option>
                        <option>1 mois</option>
                        <option>3 mois</option>
                        <option>6 mois</option>
                        <option>1 an</option>
                      </select>
                    </td>
                    <td className="mk-price-cell">
                      <input type="text" placeholder="Ex: 150 000" className="mk-input" />
                      <span className="mk-currency">FCFA</span>
                    </td>
                    <td className="mk-price-cell">
                      <input type="text" placeholder="—" className="mk-input" />
                      <span className="mk-currency">FCFA</span>
                    </td>
                    <td>
                      <input type="text" placeholder="Remarques..." className="mk-input mk-input-wide" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mk-disclaimer">
            ⚠️ Cette page est à usage interne. Les tarifs saisis ici ne sont pas enregistrés automatiquement —
            faites une capture d&apos;écran ou imprimez la page (Ctrl+P) pour conserver vos notes.
          </p>
        </section>

        {/* ── Offres packagées ── */}
        <section className="mk-section">
          <h2 className="mk-section-title">Suggestions de packages</h2>
          <div className="mk-packages">
            <div className="mk-pack">
              <div className="mk-pack-badge">STARTER</div>
              <h3>Visibilité Web</h3>
              <ul>
                <li>✓ Bannière Leaderboard (A)</li>
                <li>✓ Carré 300×250 (E)</li>
              </ul>
              <div className="mk-pack-price">À définir</div>
            </div>
            <div className="mk-pack mk-pack-featured">
              <div className="mk-pack-badge" style={{ background: '#D4A843', color: '#000' }}>PREMIUM</div>
              <h3>Présence Totale</h3>
              <ul>
                <li>✓ Bannière Leaderboard (A)</li>
                <li>✓ Sponsoring Player (C)</li>
                <li>✓ Sponsoring Ticker (D)</li>
                <li>✓ Carré 300×250 (E)</li>
              </ul>
              <div className="mk-pack-price">À définir</div>
            </div>
            <div className="mk-pack">
              <div className="mk-pack-badge" style={{ background: '#1ABC9C' }}>LIVE</div>
              <h3>Sponsoring Live</h3>
              <ul>
                <li>✓ Logo pendant les lives (G)</li>
                <li>✓ Mention "Présenté par"</li>
                <li>✓ Bannière Hero (B)</li>
              </ul>
              <div className="mk-pack-price">À définir</div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="mk-section mk-contact">
          <h2 className="mk-section-title">Contact Commercial</h2>
          <div className="mk-contact-grid">
            <div>
              <p className="mk-contact-label">Radio</p>
              <p className="mk-contact-value">Nostalgie CI — 101.1 FM</p>
              <p className="mk-contact-value">Abidjan, Côte d&apos;Ivoire</p>
            </div>
            <div>
              <p className="mk-contact-label">Site internet</p>
              <p className="mk-contact-value">nostalgie-ci.vercel.app</p>
            </div>
            <div>
              <p className="mk-contact-label">Email</p>
              <p className="mk-contact-value">nostalgiecotedivoire@gmail.com</p>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/" className="btn btn-outline" style={{ marginRight: 12 }}>← Retour au site</Link>
          </div>
        </section>

      </div>
    </div>
  )
}
