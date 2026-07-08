'use client'

import { useState } from 'react'

interface Article {
  cat: string
  img: string
  title: string
  excerpt: string
  date: string
  body: string
  video?: string      // URL YouTube (https://youtu.be/... ou https://www.youtube.com/watch?v=...)
  images?: string[]   // photos supplémentaires pour la galerie
  imgPosition?: string // object-position CSS pour recadrer (ex: "center 15%") — sinon défaut top center
}

function toYouTubeEmbed(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0`
  return url
}

const LOCALE: Article[] = [
  {
    cat: 'Rap Ivoire',
    img: '/img/himra.jpeg',
    title: 'Himra, premier rappeur ivoirien certifié or en France',
    excerpt: '"Number One" feat Minz dépasse les 22 millions de streams sur Spotify. Une première historique pour le rap ivoirien.',
    date: '1 juillet 2026',
    body: `Himra est entré dans l'histoire en devenant le premier rappeur ivoirien à décrocher une certification single d'or SNEP en France avec son titre "Number One" feat Minz, dépassant les 22 millions de streams sur Spotify. Une performance qui confirme l'influence croissante du rap ivoirien bien au-delà des frontières du continent.

Sur sa lancée, l'artiste s'attaque désormais au marché américain avec une tournée qui a débuté au Gramercy Theatre de New York en juin 2026. Une étape symbolique pour un artiste qui ne cesse de repousser les limites.

Himra incarne une nouvelle génération de rappeurs ivoiriens qui s'imposent sur la scène internationale sans renier leurs racines. Ce succès ouvre la voie à d'autres talents du pays et renforce le rayonnement du rap ivoire à l'échelle mondiale.`,
  },
  {
    cat: 'Rap Ivoire',
    img: '/img/didi-b.jpeg',
    title: 'Didi B franchit le million d\'auditeurs sur Spotify et l\'or au Nigeria',
    excerpt: 'Porté par son concert au Zénith de Paris, Didi B devient le premier artiste africain francophone certifié or au Nigeria.',
    date: '28 juin 2026',
    body: `Didi B a franchi un cap historique en dépassant le million d'auditeurs mensuels sur Spotify, porté par le succès de son concert au Zénith de Paris — une salle mythique que peu d'artistes africains ont eu l'honneur de remplir.

L'artiste ivoirien est également devenu le premier artiste africain francophone à obtenir un single d'or au Nigeria avec "Good Vibes" feat Zinoleesky. Un exploit qui témoigne de sa capacité à séduire les publics anglophones et à traverser les frontières linguistiques du continent africain.

Ces records confirment que Didi B est l'un des artistes ivoiriens les plus influents de sa génération, capable de fédérer des audiences aussi bien en Côte d'Ivoire, en Europe qu'en Afrique de l'Ouest anglophone.`,
  },
  {
    cat: 'WC2026',
    img: '/img/christ-inao.jpg',
    title: 'Christ Inao Oulaï, si jeune et déjà indispensable',
    excerpt: "Le milieu de terrain de Trabzonspor s'impose comme la révélation ivoirienne de la Coupe du monde 2026.",
    date: '1 juillet 2026',
    body: `Christ Inao Oulaï s'impose comme l'une des révélations ivoiriennes de la Coupe du monde 2026. Le milieu de terrain de Trabzonspor a brillé lors du match contre l'Allemagne, affichant une maturité et une personnalité rares pour son âge, malgré la défaite des Éléphants.

À seulement 20 ans, Christ Inao Oulaï a su hausser son niveau dans les grandes occasions, enchaînant les interventions décisives et portant le ballon avec autorité dans l'entrejeu. Sa capacité à récupérer les ballons et à relancer proprement a souvent permis à la Côte d'Ivoire de respirer dans les moments difficiles.

Les observateurs s'accordent à dire que ce garçon a un avenir exceptionnel devant lui. Plusieurs grands clubs européens auraient d'ores et déjà manifesté leur intérêt. La CAN 2027 et les prochaines qualifications mondiales s'annoncent prometteuses avec lui dans le onze ivoirien.`,
  },
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
    cat: 'People',
    img: '/img/taylor-travis.jpg',
    title: 'Taylor Swift et Travis Kelce : les noces du siècle à Madison Square Garden',
    excerpt: 'La cérémonie est attendue ce week-end du 4 juillet, répartie sur deux jours dans la salle mythique de New York.',
    date: '2 juillet 2026',
    body: `Le mariage de Taylor Swift et Travis Kelce s'annonce comme l'événement de l'année. Les célébrations sont attendues à Madison Square Garden ce week-end du 4 juillet, réparties sur deux jours selon des proches du dossier. La salle mythique de New York est déjà en travaux de décoration pour accueillir ce qui s'annonce comme la cérémonie la plus médiatisée de la décennie.

Taylor Swift ferait filmer l'intégralité de la cérémonie par une équipe professionnelle, tout en gardant le dernier mot sur le montage final. Un contrôle artistique total, à l'image de la popstar qui n'a jamais laissé personne dicter sa narrative.

Le couple, qui fait vibrer les États-Unis depuis leur relation rendue publique en 2023, unit donc officiellement leurs destins dans un cadre à la hauteur de leur légende. Fans et médias du monde entier retiennent leur souffle pour ce week-end historique.`,
  },
  {
    cat: 'Musique',
    img: '/img/coumba-gawlo.jpg',
    title: 'Coumba Gawlo Seck à Abidjan : la diva sénégalaise célèbre la fraternité africaine',
    excerpt: 'La grande dame de la musique sénégalaise a séjourné à Abidjan fin juin 2026, rencontrant les figures de la scène ivoirienne.',
    date: '30 juin 2026',
    body: `La diva de la musique sénégalaise Coumba Gawlo Seck s'est récemment rendue à Abidjan. Lors de ce séjour fin juin 2026, elle a notamment été reçue au siège de la Fondation Magic System et a partagé des moments avec des figures de la musique ivoirienne comme Josey et Aïcha Koné.

Durant sa visite, elle en a profité pour exprimer son attachement et son admiration pour la culture ivoirienne. Elle a également évoqué publiquement son récent rétablissement médical, rassurant ses fans après une intervention sur ses cordes vocales.

Ce déplacement témoigne de la solidarité et des liens profonds qui unissent les artistes d'Afrique de l'Ouest, au-delà des frontières. Coumba Gawlo Seck reste l'une des voix les plus emblématiques du continent, et son passage à Abidjan a été salué comme un beau moment de fraternité musicale africaine.`,
  },
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

const POTINS: Article[] = [
  {
    cat: 'Potins',
    img: '/img/potin-achirou-01.jpg',
    title: 'Qui est vraiment Mohamed-Adnane Achirou, le discret mari de Marie Paule Adjé ?',
    excerpt: "Depuis son mariage avec l'actrice ivoirienne, l'entrepreneur discret suscite autant de curiosité que de réactions sur les réseaux.",
    date: '8 juillet 2026',
    images: ['/img/potin-achirou-02.jpeg'],
    imgPosition: 'center 20%',
    body: `Depuis son mariage avec Marie Paule Adjé, Mohamed-Adnane Achirou est devenu l'un des noms les plus commentés sur les réseaux sociaux. Entrepreneur discret jusqu'alors, il suscite aujourd'hui autant de curiosité que de réactions.

Présenté comme le dirigeant d'Agrosources, il s'est longtemps tenu loin des projecteurs. Mais depuis que son union avec l'actrice ivoirienne a été rendue publique, internautes et médias s'intéressent de près à son parcours.

Entre admiration, interrogations et nombreuses rumeurs relayées en ligne, difficile de faire le tri. À ce jour, les seuls faits établis sont son mariage avec Marie Paule Adjé et son activité dans le secteur agro-industriel. Le reste alimente surtout les discussions sur les réseaux sociaux, sans avoir été confirmé par des sources officielles.

Une chose est sûre : Mohamed-Adnane Achirou est passé, en quelques jours, du statut d'entrepreneur discret à celui de personnalité qui fait le plus parler dans les « gbairais » ivoiriens.`,
  },
]

const EVENTS: Article[] = [
  {
    cat: 'Exclusivité',
    img: 'https://img.youtube.com/vi/S36YkP4ynLo/maxresdefault.jpg',
    title: '« Doni Doni » : Asalfo dévoile les coulisses de sa collaboration avec Didi B.',
    excerpt: 'Invité de l\'Afterwork, le leader de Magic System revient sur les raisons artistiques qui l\'ont conduit à collaborer avec le rappeur ivoirien Didi B.',
    date: 'Février 2026',
    body: `Invité de l'Afterwork à l'occasion de la sortie du nouvel album de Magic System, « Doni Doni », Asalfo, leader du groupe, est revenu sur les raisons qui l'ont conduit à collaborer avec le rappeur ivoirien Didi B. Au cours de l'émission, il a partagé les motivations derrière ce choix artistique et les ambitions de cette collaboration.`,
    video: 'https://www.youtube.com/watch?v=S36YkP4ynLo',
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
  const [tab, setTab] = useState<'locale' | 'internationale' | 'events' | 'potins'>('locale')
  const [selected, setSelected] = useState<Article | null>(null)
  const articles = tab === 'locale' ? LOCALE : tab === 'internationale' ? INTERNATIONALE : tab === 'events' ? EVENTS : POTINS

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
          <button className={`atab ${tab === 'potins' ? 'active' : ''}`} onClick={() => setTab('potins')}>
            Potins & Gbairais
          </button>
        </div>
        <div className="ac-grid">
          {articles.map((a) => (
            <div key={a.title} className="ac-card" onClick={() => setSelected(a)} style={{ cursor: 'pointer' }}>
              <div className="ac-img">
                <img src={a.img} alt={a.title} style={a.imgPosition ? { objectPosition: a.imgPosition } : undefined} />
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
            {/* Vidéo YouTube */}
            {selected.video ? (
              <div className="actu-modal-video">
                <iframe
                  src={toYouTubeEmbed(selected.video)}
                  title={selected.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="actu-modal-img" style={selected.imgPosition ? { marginTop: 0 } : undefined}>
                <img src={selected.img} alt={selected.title} />
                <span className="ac-cat-badge">{selected.cat}</span>
              </div>
            )}

            <div className="actu-modal-body">
              <p className="actu-modal-date">{selected.date}</p>
              <h2 className="actu-modal-title">{selected.title}</h2>
              <div className="actu-modal-text">
                {selected.body.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Galerie photos supplémentaires */}
              {selected.images && selected.images.length > 0 && (
                <div className="actu-modal-gallery">
                  {selected.images.map((src, i) => (
                    <img key={i} src={src} alt={`${selected.title} — photo ${i + 1}`} />
                  ))}
                </div>
              )}

              <ShareButtons title={selected.title} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
