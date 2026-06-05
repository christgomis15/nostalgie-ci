import ChatBot from '@/components/ChatBot'

export const metadata = { title: 'Podcasts — Nostalgie CI' }

const PODCASTS = [
  { show: 'Le Crazy Morning',    img: '/img/pod-01.jpg', title: "L'intégrale du mardi 27 mai",                    duration: '4h00', age: 'Il y a 2 jours' },
  { show: "L'Afterwork",         img: '/img/pod-02.jpg', title: 'Les confidences du lundi',                       duration: '2h00', age: 'Il y a 3 jours' },
  { show: 'Nostafoot',           img: '/img/pod-03.jpg', title: 'Analyse ASEC Mimosas · CAN 2025',                duration: '2h00', age: 'Il y a 4 jours' },
  { show: 'La Peufra',           img: '/img/pod-04.jpg', title: 'Session du samedi 24 mai',                       duration: '2h00', age: 'Il y a 5 jours' },
  { show: 'Tchika Tchika Boom',  img: '/img/pod-05.jpg', title: 'Séquence spéciale · Gagnant de la semaine',      duration: '1h00', age: 'Il y a 1 semaine' },
]

export default function Podcasts() {
  return (
    <section className="page-section">
      <p className="section-label">À la demande</p>
      <h1 className="section-title">Podcasts</h1>
      <div className="pod-layout">
        <div className="pod-list">
          {PODCASTS.map((p) => (
            <div key={p.title} className="pod-item">
              <div className="pod-thumb">
                <img src={p.img} alt={p.show} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
              <div className="pod-info">
                <p className="pod-show">{p.show}</p>
                <p className="pod-title">{p.title}</p>
                <p className="pod-meta">{p.duration} · {p.age}</p>
              </div>
              <button className="pod-btn" aria-label="Écouter">▶</button>
            </div>
          ))}
        </div>
        <ChatBot />
      </div>
    </section>
  )
}
