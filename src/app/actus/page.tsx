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

const EVENTS: Article[] = [
  {
    cat: 'Événement',
    img: '/img/ac-01.jpg',
    title: 'Nostalgie Night — Soirée anniversaire 32 ans au Sofitel',
    excerpt: 'Une soirée inoubliable réunissant auditeurs, partenaires et artistes pour célébrer 32 ans de Nostalgie CI.',
    date: '10 mai 2026',
    body: `La Nostalgie Night, grande soirée anniversaire organisée pour célébrer les 32 ans de la radio, s'est tenue au Sofitel Abidjan Hôtel Ivoire dans une atmosphère de fête et d'émotion. Des centaines d'invités — auditeurs fidèles, partenaires commerciaux et artistes — se sont réunis pour partager ce moment exceptionnel.

La soirée a été ponctuée de performances live, de remises de distinctions aux partenaires historiques de la radio et de moments de convivialité autour d'un dîner de gala. L'équipe animatrice de Nostalgie CI était au complet pour animer cette nuit mémorable.

Un diaporama retraçant 32 ans d'histoire de la radio a ému l'assistance, rappelant les grandes heures de la station, ses émissions cultes et les artistes qui ont fait sa renommée. La fête s'est prolongée jusqu'au petit matin, avec des sets DJ exclusifs reprenant les plus grands tubes diffusés sur Nostalgie au fil des années.`,
  },
  {
    cat: 'Partenariat',
    img: '/img/ac-02.jpg',
    title: 'Partenariat Nostalgie CI × MTN Côte d\'Ivoire',
    excerpt: 'Nostalgie CI et MTN CI officialisent un partenariat stratégique pour toucher encore plus d\'auditeurs.',
    date: '3 mai 2026',
    body: `Nostalgie CI et MTN Côte d'Ivoire ont officialisé un partenariat stratégique lors d'une cérémonie de signature tenue au siège de la radio à Abidjan. Cet accord marque une étape importante dans le développement de la présence digitale de Nostalgie CI.

Ce partenariat permettra aux abonnés MTN de bénéficier d'un accès privilégié aux contenus digitaux de Nostalgie CI, incluant les podcasts, les replays d'émissions et les événements exclusifs. Une offre de streaming radio sans consommation de data est également prévue dans le cadre de cet accord.

"Ce partenariat illustre notre volonté commune de rapprocher les Ivoiriens de leur radio préférée, où qu'ils se trouvent", a déclaré le Directeur Général de Nostalgie CI lors de la cérémonie. Les deux entités prévoient des activations communes tout au long de l'année.`,
  },
  {
    cat: 'Partenariat',
    img: '/img/ac-03.jpg',
    title: 'Nostalgie CI partenaire officiel du FEMUA 2026',
    excerpt: 'La radio accompagne le Festival des Musiques Urbaines d\'Anoumabo pour sa 17e édition.',
    date: '20 avril 2026',
    body: `Nostalgie CI a été désignée partenaire radio officiel du FEMUA (Festival des Musiques Urbaines d'Anoumabo) pour sa 17e édition. Ce partenariat confirme l'engagement de la radio aux côtés des grands événements culturels ivoiriens.

Dans ce cadre, Nostalgie CI assurera une couverture exclusive du festival avec des reportages quotidiens, des interviews des artistes en coulisses et une retransmission en direct des temps forts sur ses ondes. Une émission spéciale FEMUA sera diffusée chaque soir pendant la durée du festival.

Ce partenariat renforce les liens entre Nostalgie CI et l'écosystème musical ivoirien, positionnant la radio comme un acteur incontournable de la promotion de la culture urbaine africaine. Les auditeurs pourront suivre toute l'actualité du FEMUA en temps réel.`,
  },
  {
    cat: 'Événement',
    img: '/img/ac-04.jpg',
    title: 'Tournée Nostalgie dans les villes de l\'intérieur',
    excerpt: 'L\'équipe Nostalgie CI à la rencontre des auditeurs de Bouaké, Yamoussoukro et San-Pédro.',
    date: '8 avril 2026',
    body: `Nostalgie CI a lancé sa grande tournée nationale pour aller à la rencontre des auditeurs dans les principales villes de l'intérieur du pays. Cette tournée, baptisée "Nostalgie en route", a débuté par Bouaké avant de faire étape à Yamoussoukro puis San-Pédro.

Dans chaque ville, l'équipe animatrice a organisé des après-midis festives avec des jeux, des distributions de goodies et des concerts surprise. Ces événements ont rassemblé des milliers d'auditeurs ravis de rencontrer leurs animateurs préférés en chair et en os.

"C'est important pour nous d'aller vers nos auditeurs, de les rencontrer là où ils vivent. Nostalgie CI est leur radio et nous voulons qu'ils le ressentent", a expliqué le Directeur des Programmes. La tournée se poursuivra dans les mois à venir avec de nouvelles étapes dans d'autres villes du pays.`,
  },
  {
    cat: 'Partenariat',
    img: '/img/ac-05.jpg',
    title: 'Nostalgie CI × CANAL+ : accord de diffusion croisée',
    excerpt: 'Un accord inédit entre la radio et le bouquet TV pour des contenus exclusifs partagés.',
    date: '15 mars 2026',
    body: `Nostalgie CI et CANAL+ Côte d'Ivoire ont conclu un accord de diffusion croisée qui permettra à chaque entité de valoriser les contenus de l'autre sur ses propres plateformes. Cet accord inédit dans le paysage médiatique ivoirien ouvre de nouvelles perspectives pour les deux médias.

Concrètement, des émissions phares de Nostalgie CI seront diffusées sur certaines chaînes du bouquet CANAL+, tandis que des extraits d'émissions CANAL+ seront commentés et partagés sur les ondes de Nostalgie. Des co-productions originales sont également prévues sur des thématiques musicales et culturelles.

Cet accord témoigne de la complémentarité entre la radio et la télévision dans un paysage médiatique en pleine transformation. Les deux parties voient dans ce partenariat une opportunité de toucher un public plus large et de créer des synergies éditoriales inédites.`,
  },
  {
    cat: 'Événement',
    img: '/img/ac-06.jpg',
    title: 'Lancement de la webradio Nostalgie Zouglou',
    excerpt: 'Nostalgie CI enrichit son offre digitale avec une webradio 100% dédiée au zouglou ivoirien.',
    date: '1 mars 2026',
    body: `Nostalgie CI a officiellement lancé sa nouvelle webradio "Nostalgie Zouglou", une chaîne 100% dédiée au genre musical emblématique de la Côte d'Ivoire. Ce lancement s'inscrit dans la stratégie de diversification digitale de la radio.

La webradio Nostalgie Zouglou diffuse 24h/24 les meilleurs titres de ce genre musical, des classiques fondateurs aux nouvelles productions, en passant par des émissions thématiques dédiées à l'histoire et à l'évolution du zouglou. Une programmation spéciale avec des interviews d'artistes pionniers est également au programme.

"Le zouglou est l'âme musicale de la Côte d'Ivoire et il méritait sa propre radio. Avec Nostalgie Zouglou, nous rendons hommage à ce genre tout en le faisant connaître aux nouvelles générations", a déclaré le Directeur des Programmes lors du lancement.`,
  },
]

const SHARE_URL = 'https://nostalgie-ci.vercel.app/actus'

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const text = encodeURIComponent(title)
  const url = encodeURIComponent(SHARE_URL)

  const copyLink = () => {
    navigator.clipboard.writeText(SHARE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="share-bar">
      <span className="share-label">Partager</span>
      <a
        className="share-btn share-facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur Facebook"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        Facebook
      </a>
      <a
        className="share-btn share-x"
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur X"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <a
        className="share-btn share-whatsapp"
        href={`https://wa.me/?text=${text}%20${url}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur WhatsApp"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        WhatsApp
      </a>
      <button
        className="share-btn share-copy"
        onClick={copyLink}
        aria-label="Copier le lien"
      >
        {copied ? (
          '✓ Copié !'
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copier le lien
          </>
        )}
      </button>
    </div>
  )
}

export default function Actus() {
  const [tab, setTab] = useState<'locale' | 'internationale' | 'events'>('locale')
  const [selected, setSelected] = useState<Article | null>(null)
  const articles = tab === 'locale' ? LOCALE : tab === 'internationale' ? INTERNATIONALE : EVENTS

  return (
    <>
      <section className="page-section">
        <p className="section-label">L&apos;info qui groove</p>
        <h1 className="section-title">Actualités</h1>
        <div className="atabs">
          <button className={`atab ${tab === 'locale' ? 'active' : ''}`} onClick={() => setTab('locale')}>
            Actu Locale
          </button>
          <button className={`atab ${tab === 'internationale' ? 'active' : ''}`} onClick={() => setTab('internationale')}>
            Actu Internationale
          </button>
          <button className={`atab ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>
            Events Nostalgie
          </button>
        </div>
        <div className="ac-grid">
          {articles.map((a) => (
            <div key={a.title} className="ac-card" onClick={() => setSelected(a)} style={{ cursor: 'pointer' }}>
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
            <button className="actu-close" onClick={() => setSelected(null)} aria-label="Fermer">✕</button>
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
              <ShareButtons title={selected.title} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
