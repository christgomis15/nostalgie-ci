export default function Accueil() {
  return (
    <section className="hero">
      <div className="page-section">
        <p className="section-label">101.1 FM · Abidjan</p>
        <h1 className="hero-title">NOSTALGIE</h1>
        <p className="hero-slogan">Sérieusement Décalée.</p>
        <p className="hero-villes">Abidjan · San-Pédro · Bouaké · Man · Daloa</p>
        <div className="hero-actions">
          <button className="btn btn-or" id="hero-play-btn">
            ▶ Écouter en Direct
          </button>
          <a href="/podcasts" className="btn btn-outline">
            Nos Podcasts
          </a>
        </div>
      </div>
    </section>
  )
}