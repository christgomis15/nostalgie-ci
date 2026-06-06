'use client'

import { useState } from 'react'

interface Article {
  cat: string
  img: string
  title: string
  excerpt: string
  date: string
  body: string
}

const LOCALE: Article[] = [
  {
    cat: 'Musique',
    img: '/img/ac-01.jpg',
    title: 'Kerozen annonce un nouvel album pour juillet 2026',
    excerpt: 'Le roi du coupé décalé confirme la sortie de son prochain projet avec plusieurs featurings surprises.',
    date: '2 juin 2026',
    body: `Kerozen, véritable monument du coupé décalé ivoirien, a officialisé la sortie de son nouvel album studio prévu pour le mois de juillet 2026. L'annonce a été faite lors d'une conférence de presse tenue à Abidjan en présence de nombreux artistes et journalistes musicaux.

L'album, dont le titre n'a pas encore été dévoilé, compterait une quinzaine de titres avec des collaborations inédites aux côtés de plusieurs grandes figures de la musique africaine. Parmi les noms qui circulent, on évoque des featurings avec des artistes de la sous-région.

"C'est un album qui parle de mon peuple, de ma terre et de mon vécu. Je veux que chaque Ivoirien se reconnaisse dans ces morceaux", a déclaré l'artiste. Une tournée nationale est prévue dans la foulée pour présenter le projet au public.`,
  },
  {
    cat: 'Culture',
    img: '/img/ac-02.jpg',
    title: 'Concert hommage à Arafat DJ au Palais de la Culture',
    excerpt: 'La communauté des Chinois rend hommage au grand Daishikan avec un concert émouvant à Abidjan.',
    date: '31 mai 2026',
    body: `Le Palais de la Culture d'Abidjan a vibré au rythme d'un concert hommage exceptionnel dédié à Arafat DJ, le Daishikan, disparu en août 2019. La soirée, organisée par sa communauté de fans surnommée "les Chinois", a réuni des milliers de supporters venus célébrer la mémoire de leur idole.

De nombreux artistes ivoiriens ont participé à l'événement pour interpréter les titres emblématiques du regretté chanteur. L'ambiance était à la fois festive et chargée d'émotion, avec des moments de recueillement ponctués par les chants du public.

La famille d'Arafat DJ était présente et a exprimé sa profonde gratitude envers les fans pour ce geste fort. "Arafat vivra toujours à travers sa musique et l'amour que vous lui portez", a déclaré l'un de ses proches. Cet hommage annuel est désormais ancré dans le calendrier culturel ivoirien.`,
  },
  {
    cat: 'Awards',
    img: '/img/ac-03.jpg',
    title: 'Les artistes ivoiriens honorés aux MAMA 2026',
    excerpt: 'Les Music Of Black Origin Awards célèbrent la scène musicale africaine. La CI rafle plusieurs trophées.',
    date: '28 mai 2026',
    body: `La cérémonie des MAMA 2026 (Music Of Black Origin Awards) a été marquée par le triomphe de la scène musicale ivoirienne. Plusieurs artistes du pays ont été récompensés dans différentes catégories, confirmant le rayonnement international de la musique de Côte d'Ivoire.

Le coupé décalé, le zouglou et l'afro-pop ivoirienne ont été particulièrement mis à l'honneur lors de cette édition. La cérémonie, retransmise dans plusieurs pays africains et européens, a offert une visibilité inédite aux talents ivoiriens.

Ces distinctions viennent récompenser plusieurs années de travail acharné et confirment que la Côte d'Ivoire reste une référence incontournable sur la carte musicale du continent. Les artistes primés ont rendu hommage à leurs fans et à leur pays lors de leurs discours de remerciements.`,
  },
  {
    cat: 'Exclusivité',
    img: '/img/ac-04.jpg',
    title: 'Josey dévoile son nouveau single en exclusivité sur Nostalgie',
    excerpt: "La chanteuse ivoirienne revient avec un titre afro-pop taillé pour l'été 2026.",
    date: '25 mai 2026',
    body: `C'est en exclusivité sur les ondes de Nostalgie CI que Josey a choisi de dévoiler son tout nouveau single. La chanteuse ivoirienne, connue pour ses tubes entraînants mêlant afropop et sonorités locales, marque son grand retour sur la scène musicale avec un titre prometteur.

Le morceau, aux accents ensoleillés et festifs, est déjà annoncé comme l'un des hits de l'été 2026. Josey s'est confiée en exclusivité à l'équipe de Nostalgie sur l'inspiration derrière ce nouveau projet et ses ambitions pour les mois à venir.

"Je voulais faire quelque chose de joyeux, de positif. Un titre qui donne envie de danser et de profiter de la vie", a-t-elle confié lors de son passage en studio. Le single est disponible sur toutes les plateformes de streaming dès aujourd'hui.`,
  },
  {
    cat: 'Héritage',
    img: '/img/ac-05.jpg',
    title: 'Les Garagistes de retour avec un album collector',
    excerpt: 'Le groupe légendaire célèbre ses 30 ans avec une réédition et de nouveaux morceaux inédits.',
    date: '22 mai 2026',
    body: `Trente ans après leur formation, les Garagistes font leur grand retour avec un album collector qui célèbre trois décennies de musique ivoirienne. Ce projet anniversaire comprend une réédition remasterisée de leurs plus grands succès ainsi que plusieurs morceaux inédits enregistrés spécialement pour l'occasion.

Le groupe, qui a marqué plusieurs générations avec son style unique mêlant zouglou et afropop, retrouve ses fans avec la même énergie et la même authenticité qui ont fait leur succès. Les nouveaux titres témoignent d'une évolution musicale tout en restant fidèles à leur identité sonore.

Une tournée nationale est prévue pour présenter cet album collector au public ivoirien. Les billets pour les premières dates sont déjà en vente et connaissent un vif succès, preuve que l'attachement des fans pour ce groupe légendaire reste intact.`,
  },
  {
    cat: 'Radio',
    img: '/img/ac-06.jpg',
    title: 'Nostalgie CI fête ses 32 ans : retour sur une histoire',
    excerpt: "Depuis 1994, la station n°1 de Côte d'Ivoire a accompagné des générations entières.",
    date: '18 mai 2026',
    body: `En 1994, Nostalgie CI prenait les ondes pour la première fois à Abidjan, devenant ainsi l'une des toutes premières radios commerciales privées de Côte d'Ivoire. Trente-deux ans plus tard, la station est devenue un véritable pilier du paysage médiatique ivoirien.

Au fil des années, Nostalgie CI a su s'adapter aux évolutions du secteur tout en restant fidèle à ses valeurs : une programmation musicale de qualité, des émissions de proximité et un engagement fort auprès de ses auditeurs. De génération en génération, la station a accompagné les joies, les peines et les moments forts de la vie ivoirienne.

Pour célébrer cet anniversaire exceptionnel, la radio prépare une semaine spéciale avec des émissions dédiées, des invités de marque et de nombreuses surprises pour les fidèles auditeurs. "32 ans de bonheur partagé, et l'aventure ne fait que commencer", clame fièrement l'équipe de Nostalgie CI.`,
  },
]

const INTERNATIONALE: Article[] = [
  {
    cat: 'Grammy',
    img: '/img/ac-07.jpg',
    title: 'Burna Boy décroche le Grammy du meilleur album Afrobeats 2026',
    excerpt: "L'Afrobeats nigérian continue de conquérir le monde. Burna Boy couronne une année exceptionnelle.",
    date: '2 juin 2026',
    body: `Burna Boy a remporté le Grammy Award du meilleur album de musique africaine lors de la 68e cérémonie des Grammy Awards, confirmant ainsi sa place de leader incontesté de l'Afrobeats mondial. C'est la deuxième fois que l'artiste nigérian reçoit cette distinction prestigieuse.

L'album primé, salué par la critique internationale pour sa fusion audacieuse de sonorités africaines et occidentales, a dominé les charts mondiaux pendant plusieurs mois. Burna Boy a dédié ce trophée au continent africain et à tous les artistes qui portent la musique africaine à travers le monde.

"C'est pour l'Afrique. Nous ne faisons que commencer", a déclaré l'artiste lors de son discours d'acceptation. Cette victoire renforce encore davantage l'influence grandissante de l'Afrobeats sur la scène musicale internationale.`,
  },
  {
    cat: 'Tournée',
    img: '/img/ac-08.png',
    title: 'Beyoncé annonce sa tournée africaine avec un passage à Lagos',
    excerpt: 'La reine du R&B pose ses valises en Afrique. Lagos, Nairobi, Johannesburg... et peut-être Abidjan.',
    date: '30 mai 2026',
    body: `Beyoncé a officiellement annoncé une tournée africaine pour la fin de l'année 2026, une première dans sa carrière qui met en lumière l'importance croissante du continent dans l'industrie musicale mondiale. Les villes de Lagos, Nairobi et Johannesburg sont confirmées, et des rumeurs font état d'une possible date à Abidjan.

Cette tournée s'inscrit dans la continuité de son album "Renaissance Act II", fortement influencé par les sonorités africaines. La star américaine a exprimé depuis longtemps son admiration pour la richesse culturelle et musicale du continent africain.

Si Abidjan venait à être confirmée, ce serait un événement historique pour la Côte d'Ivoire et toute la sous-région. Les fans ouest-africains retiennent leur souffle et espèrent une annonce officielle dans les prochaines semaines. Les billets pour les premières dates déjà confirmées se sont écoulés en quelques minutes.`,
  },
  {
    cat: 'Charts',
    img: '/img/ac-09.jpg',
    title: 'Wizkid domine le Top Afrobeats mondial 5 mois consécutifs',
    excerpt: "Starboy n'en finit pas de régner sur les charts mondiaux avec son dernier projet.",
    date: '28 mai 2026',
    body: `Wizkid continue d'écrire l'histoire de l'Afrobeats en dominant les charts mondiaux pendant cinq mois consécutifs avec son dernier projet musical. L'artiste nigérian confirme ainsi son statut d'icône planétaire et prouve que l'Afrobeats n'est plus une tendance passagère mais un genre musical à part entière.

Son album, qui mélange avec brio les influences africaines, caribéennes et américaines, a séduit des millions d'auditeurs sur tous les continents. Les plateformes de streaming enregistrent des chiffres records, avec plusieurs milliards de streams cumulés depuis sa sortie.

"Wizkid a redéfini les frontières de la musique africaine", souligne un analyste musical. La presse internationale lui consacre des articles élogieux, et les collaborations avec des artistes occidentaux continuent d'affluer. L'ère Starboy est loin d'être terminée.`,
  },
  {
    cat: 'Comeback',
    img: '/img/ac-10.jpg',
    title: 'Rihanna de retour : premier album depuis 10 ans confirmé',
    excerpt: "La Barbadienne met fin à une décennie de silence musical. L'album serait prévu pour fin 2026.",
    date: '25 mai 2026',
    body: `Après une décennie d'absence discographique, Rihanna a officiellement confirmé le retour de son album studio tant attendu, prévu pour la fin de l'année 2026. L'annonce a provoqué un véritable tremblement de terre sur les réseaux sociaux, avec des millions de réactions enthousiastes de fans du monde entier.

La superstar barbadienne, qui s'est notamment consacrée à ses projets entrepreneuriaux avec Fenty Beauty et Savage X Fenty ces dernières années, assure que ce nouvel album marquera une nouvelle ère dans sa carrière musicale. Plusieurs collaborations avec des artistes africains seraient incluses dans le projet.

La communauté musicale africaine et ivoirienne espère particulièrement une collaboration avec des artistes du continent, compte tenu de l'influence grandissante de la musique africaine dans la pop mondiale. L'album est déjà l'un des projets musicaux les plus attendus de la décennie.`,
  },
  {
    cat: 'Tendance',
    img: '/img/ac-11.jpg',
    title: "L'Amapiano conquiert l'Europe : tournée internationale confirmée",
    excerpt: "Le son sud-africain s'exporte. Les plus grands DJs d'Amapiano annoncent des dates en France et en Belgique.",
    date: '20 mai 2026',
    body: `L'Amapiano, le genre musical né en Afrique du Sud au milieu des années 2010, poursuit sa conquête mondiale avec l'annonce d'une grande tournée européenne réunissant les figures les plus emblématiques du genre. Des dates sont confirmées en France, en Belgique, aux Pays-Bas et au Royaume-Uni.

Ce genre musical aux basses profondes et aux mélodies envoûtantes a su traverser les frontières et conquérir un public occidental de plus en plus large. Les clubs et festivals européens se disputent les têtes d'affiche de la scène Amapiano, signe de l'engouement croissant pour cette musique.

En Afrique de l'Ouest, l'Amapiano a également trouvé un écho favorable, et la Côte d'Ivoire ne fait pas exception. Les artistes ivoiriens commencent à intégrer des éléments de ce genre dans leurs productions, témoignant d'une véritable perméabilité musicale entre les différentes régions du continent.`,
  },
  {
    cat: 'Zouk',
    img: '/img/ac-12.jpg',
    title: 'Le zouk africain en pleine renaissance en 2026',
    excerpt: "Après des années d'éclipse, le zouk africain revient en force avec une nouvelle génération d'artistes.",
    date: '15 mai 2026',
    body: `Le zouk africain connaît un renouveau remarquable en 2026, porté par une nouvelle génération d'artistes qui réinterprètent ce genre musical avec des sonorités contemporaines tout en préservant son âme originelle. Après plusieurs années en retrait de la scène internationale, le zouk africain retrouve sa place dans les playlists et les clubs du continent.

Des artistes venus du Cap-Vert, de la Guinée-Bissau, du Sénégal et d'autres pays africains contribuent à cette renaissance en fusionnant le zouk traditionnel avec des influences afropop, R&B et électroniques. Le résultat est un son nouveau, frais et accessible à un large public.

En Côte d'Ivoire, ce renouveau est accueilli avec enthousiasme, le pays ayant toujours entretenu une relation forte avec le zouk africain. Plusieurs artistes ivoiriens préparent des projets s'inscrivant dans cette nouvelle vague, promettant une belle effervescence musicale pour les mois à venir.`,
  },
]

export default function Actus() {
  const [tab, setTab] = useState<'locale' | 'internationale'>('locale')
  const [selected, setSelected] = useState<Article | null>(null)
  const articles = tab === 'locale' ? LOCALE : INTERNATIONALE

  return (
    <>
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
            <div
              key={a.title}
              className="ac-card"
              onClick={() => setSelected(a)}
              style={{ cursor: 'pointer' }}
            >
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

      {/* ── Modal ── */}
      {selected && (
        <div className="actu-overlay" onClick={() => setSelected(null)}>
          <div className="actu-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="actu-close"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <div className="actu-modal-img">
              <img src={selected.img} alt={selected.title} />
              <span className="ac-cat-badge">{selected.cat}</span>
            </div>
            <div className="actu-modal-body">
              <p className="actu-modal-date">{selected.date}</p>
              <h2 className="actu-modal-title">{selected.title}</h2>
              <div className="actu-modal-text">
                {selected.body.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
