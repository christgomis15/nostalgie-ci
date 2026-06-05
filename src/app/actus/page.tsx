'use client'

import { useState } from 'react'

const LOCALE = [
  { cat: 'Musique',     img: '/img/ac-01.jpg', title: 'Kerozen annonce un nouvel album pour juillet 2026', excerpt: 'Le roi du coupé décalé confirme la sortie de son prochain projet avec plusieurs featurings surprises.', date: '2 juin 2026' },
  { cat: 'Culture',     img: '/img/ac-02.jpg', title: 'Concert hommage à Arafat DJ au Palais de la Culture', excerpt: 'La communauté des Chinois rend hommage au grand Daishikan avec un concert émouvant à Abidjan.', date: '31 mai 2026' },
  { cat: 'Awards',      img: '/img/ac-03.jpg', title: 'Les artistes ivoiriens honorés aux MAMA 2026', excerpt: 'Les Music Of Black Origin Awards célèbrent la scène musicale africaine. La CI rafle plusieurs trophées.', date: '28 mai 2026' },
  { cat: 'Exclusivité', img: '/img/ac-04.jpg', title: 'Josey dévoile son nouveau single en exclusivité sur Nostalgie', excerpt: "La chanteuse ivoirienne revient avec un titre afro-pop taillé pour l'été 2026.", date: '25 mai 2026' },
  { cat: 'Héritage',    img: '/img/ac-05.jpg', title: 'Les Garagistes de retour avec un album collector', excerpt: 'Le groupe légendaire célèbre ses 30 ans avec une réédition et de nouveaux morceaux inédits.', date: '22 mai 2026' },
  { cat: 'Radio',       img: '/img/ac-06.jpg', title: 'Nostalgie CI fête ses 32 ans : retour sur une histoire', excerpt: "Depuis 1994, la station n°1 de Côte d'Ivoire a accompagné des générations entières.", date: '18 mai 2026' },
]

const INTERNATIONALE = [
  { cat: 'Grammy',   img: '/img/ac-07.jpg', title: 'Burna Boy décroche le Grammy du meilleur album Afrobeats 2026', excerpt: "L'Afrobeats nigérian continue de conquérir le monde. Burna Boy couronne une année exceptionnelle.", date: '2 juin 2026' },
  { cat: 'Tournée',  img: '/img/ac-08.png', title: 'Beyoncé annonce sa tournée africaine avec un passage à Lagos', excerpt: 'La reine du R&B pose ses valises en Afrique. Lagos, Nairobi, Johannesburg... et peut-être Abidjan.', date: '30 mai 2026' },
  { cat: 'Charts',   img: '/img/ac-09.jpg', title: 'Wizkid domine le Top Afrobeats mondial 5 mois consécutifs', excerpt: "Starboy n'en finit pas de régner sur les charts mondiaux avec son dernier projet.", date: '28 mai 2026' },
  { cat: 'Comeback', img: '/img/ac-10.jpg', title: 'Rihanna de retour : premier album depuis 10 ans confirmé', excerpt: "La Barbadienne met fin à une décennie de silence musical. L'album serait prévu pour fin 2026.", date: '25 mai 2026' },
  { cat: 'Tendance', img: '/img/ac-11.jpg', title: "L'Amapiano conquiert l'Europe : tournée internationale confirmée", excerpt: "Le son sud-africain s'exporte. Les plus grands DJs d'Amapiano annoncent des dates en France et en Belgique.", date: '20 mai 2026' },
  { cat: 'Zouk',     img: '/img/ac-12.jpg', title: 'Le zouk africain en pleine renaissance en 2026', excerpt: "Après des années d'éclipse, le zouk africain revient en force avec une nouvelle génération d'artistes.", date: '15 mai 2026' },
]

export default function Actus() {
  const [tab, setTab] = useState<'locale' | 'internationale'>('locale')
  const articles = tab === 'locale' ? LOCALE : INTERNATIONALE

  return (
    <section className="page-section">
      <p className="section-label">L&apos;info qui groove</p>
      <h1 className="section-title">Actualités</h1>
      <div className="atabs">
        <button
          className={`atab ${tab === 'locale' ? 'active' : ''}`}
          onClick={() => setTab('locale')}
        >
          Actu Locale
        </button>
        <button
          className={`atab ${tab === 'internationale' ? 'active' : ''}`}
          onClick={() => setTab('internationale')}
        >
          Actu Internationale
        </button>
      </div>
      <div className="ac-grid">
        {articles.map((a) => (
          <div key={a.title} className="ac-card">
            <div className="ac-img">
              <img src={a.img} alt={a.title} />
              <span className="ac-cat-badge">{a.cat}</span>
            </div>
            <div className="ac-body">
              <h3 className="ac-title-card">{a.title}</h3>
              <p className="ac-excerpt">{a.excerpt}</p>
              <p className="ac-date">{a.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
