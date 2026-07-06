export const metadata = { title: 'Émissions — Nostalgie CI' }

const VAC_LUN_VEN = [
  { ph: '07', heure: '07h–09h', tag: 'Matin', title: 'Good Morning Holidays', animateurs: 'Alvhin & Loupita & Stagiaire' },
  { ph: '10', heure: '10h–12h', tag: 'Milieu de journée', title: 'Le Tchika Tchika Boom', animateurs: 'Brice Guigré (juil.) · Willy (août)' },
  { ph: '15', heure: '15h–16h', tag: 'Après-midi', title: 'Le Brand New', animateurs: 'Flux musical' },
  { ph: '16', heure: '16h–18h', tag: 'Après-midi', title: 'My Nostalgie', animateurs: 'Nanda (juil.) · Désie (août)' },
  { ph: '18', heure: '18h–20h', tag: 'Soirée', title: 'Radio Tubes', animateurs: 'Frédéric' },
  { ph: '20', heure: '20h–23h', tag: 'Prime time', title: 'Nostalgie Holiday Mix', animateurs: 'Philo DJ · DJ Papa Roger · DJ Eebay' },
]

const VAC_SAM = [
  { ph: '10', heure: '10h–12h', tag: 'Matin', title: 'Nostazouk', animateurs: 'Direct' },
  { ph: '12', heure: '12h–14h', tag: 'Midi', title: 'Urban Revelation', animateurs: 'Arielle' },
  { ph: '14', heure: '14h–16h', tag: 'Après-midi', title: "Dans la Tête d'un Ado", animateurs: 'Malick & Chroniqueurs + Nanda' },
  { ph: '16', heure: '16h–18h', tag: 'Après-midi', title: 'La Peufra Playlist', animateurs: 'Rap Ivoire & International' },
  { ph: '18', heure: '18h–20h', tag: 'Soirée', title: 'Radio Tubes', animateurs: 'Flux musical' },
  { ph: '20', heure: '20h–21h', tag: 'Soirée', title: 'Nostalgie Fun Outdoor', animateurs: 'Teeyah' },
  { ph: '21', heure: '21h–23h', tag: 'Prime time', title: 'Nostalgie Holiday Mix', animateurs: 'Mix Non stop de DJs' },
]

const VAC_DIM = [
  { ph: '10', heure: '10h–12h', tag: 'Matin', title: 'Radio Tubes', animateurs: 'Flux musical' },
  { ph: '12', heure: '12h–14h', tag: 'Midi', title: 'Urban Revelation', animateurs: 'Arielle' },
  { ph: '17', heure: '17h–18h', tag: 'Après-midi', title: "Dans la Tête d'un Ado", animateurs: 'Malick & Chroniqueurs + Nanda' },
  { ph: '18', heure: '18h–20h', tag: 'Soirée', title: 'Nostalgie Fun Outdoor', animateurs: 'Teeyah' },
  { ph: '21', heure: '21h–23h', tag: 'Prime time', title: 'NCI 360', animateurs: 'Retransmission NCI' },
]

function VacCard({ ph, heure, tag, title, animateurs }: { ph: string; heure: string; tag: string; title: string; animateurs: string }) {
  return (
    <div className="em-card">
      <div className="em-ph">{ph}</div>
      <div className="em-overlay">
        <p className="em-tag">{tag} · {heure}</p>
        <h3 className="em-title-card">{title}</h3>
        {animateurs && <p className="em-animateurs">{animateurs}</p>}
      </div>
    </div>
  )
}

export default function Emissions() {
  return (
    <div className="em-section">
      <div className="page-section">
        <p className="section-label">Sur vos ondes · Juillet &amp; Août 2026</p>
        <h1 className="section-title">Nos émissions</h1>
      </div>

      <div style={{ paddingBottom: '12px' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px', fontWeight: 700, color: 'var(--or)', padding: '0 24px 12px' }}>
          Lundi – Vendredi
        </p>
        <div className="em-grid">
          {VAC_LUN_VEN.map((s) => <VacCard key={s.title + s.heure} {...s} />)}
        </div>
      </div>

      <div style={{ paddingBottom: '12px', paddingTop: '3px' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px', fontWeight: 700, color: 'var(--or)', padding: '12px 24px 12px' }}>
          Samedi
        </p>
        <div className="em-grid">
          {VAC_SAM.map((s) => <VacCard key={s.title + s.heure} {...s} />)}
        </div>
      </div>

      <div style={{ paddingBottom: '40px', paddingTop: '3px' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px', fontWeight: 700, color: 'var(--or)', padding: '12px 24px 12px' }}>
          Dimanche
        </p>
        <div className="em-grid">
          {VAC_DIM.map((s) => <VacCard key={s.title + s.heure} {...s} />)}
        </div>
      </div>
    </div>
  )
}
