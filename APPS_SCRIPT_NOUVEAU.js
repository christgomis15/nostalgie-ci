// ═══════════════════════════════════════════════════════════════════
//  NOSTALGIE CI — Google Apps Script v2
//  Gère : dédicaces ET réservations publicitaires
//  À coller intégralement dans script.google.com
//
//  Projet AUTONOME (non lié/bound à la feuille) : on ouvre la feuille
//  explicitement par son identifiant plutôt que via getActiveSpreadsheet(),
//  pour ne plus dépendre du mécanisme "Extensions > Apps Script" de Sheets
//  (qui s'est retrouvé cassé côté Google le 2026-07-16).
// ═══════════════════════════════════════════════════════════════════
var SHEET_ID = '1xMTW8qU3TflbDUfsf__qXUak667LE-dtKh2XNLrXruo';
function getSS_() { return SpreadsheetApp.openById(SHEET_ID); }

// ────────────────────────────────────────────────────────────────────
//  doGet — lecture publique des données (Top 5, etc.)
//  Appel : URL?action=top5
// ────────────────────────────────────────────────────────────────────
function doGet(e) {
  var action = (e && e.parameter) ? e.parameter.action : '';
  if (action === 'top5') {
    return getTop5Data();
  }
  if (action === 'interactions') {
    return getInteractions((e.parameter && e.parameter.videoId) ? e.parameter.videoId : '');
  }
  if (action === 'actus') {
    return getActusData();
  }
  if (action === 'podcasts') {
    return getPodcastsData();
  }
  if (action === 'emissions') {
    return getEmissionsData();
  }
  if (action === 'top5archive') {
    return getTop5ArchiveData((e.parameter && e.parameter.start) || '', (e.parameter && e.parameter.end) || '');
  }
  if (action === 'live') {
    return getLiveData();
  }
  if (action === 'ttb') {
    return getTTBData();
  }
  return ContentService
    .createTextOutput('Nostalgie CI — OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getInteractions(videoId) {
  try {
    var ss = getSS_();
    var likeCount = 0;
    var comments = [];

    var likesSheet = ss.getSheetByName('Likes');
    if (likesSheet && likesSheet.getLastRow() > 1) {
      var likeRows = likesSheet.getRange(2, 1, likesSheet.getLastRow() - 1, 2).getValues();
      likeCount = likeRows.filter(function(r) { return String(r[1]) === videoId; }).length;
    }

    var commSheet = ss.getSheetByName('Commentaires');
    if (commSheet && commSheet.getLastRow() > 1) {
      var commRows = commSheet.getRange(2, 1, commSheet.getLastRow() - 1, 4).getValues();
      comments = commRows
        .filter(function(r) { return String(r[1]) === videoId && r[3]; })
        .map(function(r) {
          var d = r[0] instanceof Date ? r[0] : new Date(r[0]);
          return {
            date: Utilities.formatDate(d, 'Africa/Abidjan', 'dd MMM yyyy'),
            prenom: String(r[2]) || 'Anonyme',
            commentaire: String(r[3])
          };
        })
        .reverse();
    }

    return ContentService
      .createTextOutput(JSON.stringify({ likes: likeCount, comments: comments }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ likes: 0, comments: [], error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getTop5Data() {
  try {
    var ss = getSS_();
    var sheet = ss.getSheetByName('Top5');
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Onglet Top5 introuvable' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // B1 = date de la semaine (ex: "23 – 27 juin 2026")
    var semaine = sheet.getRange('B1').getValue();

    // Ligne 3 = en-têtes, données en lignes 4 à 8 (5 titres)
    // Colonnes : rang | artiste | titre | passages | spotifyId | spotifyType | coverUrl
    var rows = sheet.getRange(4, 1, 5, 7).getValues();

    var items = rows
      .map(function(row) {
        return {
          rang:        Number(row[0]),
          artiste:     String(row[1]),
          titre:       String(row[2]),
          passages:    Number(row[3]),
          spotifyId:   String(row[4]),
          spotifyType: String(row[5]),
          coverImg:    String(row[6]),
        };
      })
      .filter(function(item) { return item.rang > 0 && item.artiste; });

    return ContentService
      .createTextOutput(JSON.stringify({ semaine: String(semaine), items: items }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────
//  LIVE → onglet "Live"
//  B1 = IsLive (TRUE/FALSE) | B2 = VideoId | B3 = Titre | B4 = Description
// ────────────────────────────────────────────────────────────────────
function getLiveData() {
  try {
    var ss = getSS_();
    var sheet = ss.getSheetByName('Live');
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ isLive: false, videoId: '', title: 'Nostalgie Live', description: '' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var vals = sheet.getRange('B1:B4').getValues();
    var isLive = vals[0][0] === true || String(vals[0][0]).trim().toLowerCase() === 'true';
    return ContentService
      .createTextOutput(JSON.stringify({
        isLive: isLive,
        videoId: String(vals[1][0] || ''),
        title: String(vals[2][0] || 'Nostalgie Live'),
        description: String(vals[3][0] || ''),
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────
//  INDICE DU JOUR TTB (Tchika Tchika Boom) → onglet "TTB"
//  B1 = Indice du jour, B2 = Date (JJ/MM/AAAA, doit correspondre au jour
//  courant côté site pour que le pop-up s'affiche — évite qu'un indice
//  oublié la veille reste affiché indéfiniment)
// ────────────────────────────────────────────────────────────────────
function getTTBData() {
  try {
    var ss = getSS_();
    var sheet = ss.getSheetByName('TTB');
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ indice: '', date: '' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var vals = sheet.getRange('B1:B2').getValues();
    return ContentService
      .createTextOutput(JSON.stringify({
        indice: String(vals[0][0] || ''),
        date: String(vals[1][0] || ''),
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────
//  ACTUS → onglet "Actus"
//  Colonnes : Onglet | Categorie | Image | Titre | Resume | Date | Texte | Video | Images galerie (separees par |) | Position image
//  Onglet = locale / internationale / events / potins
// ────────────────────────────────────────────────────────────────────
function formatDateCell_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return v.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Abidjan' });
  }
  return String(v);
}

// ────────────────────────────────────────────────────────────────────
//  TRI PAR DATE — le champ "Date" est un texte libre en français
//  (ex: "9 juillet 2026", parfois juste "Février 2026"). On le convertit
//  en timestamp pour afficher le plus récent en premier partout où c'est
//  pertinent (Actus, Podcasts). Les dates non reconnues sont poussées
//  en fin de liste plutôt que de faire planter le tri.
// ────────────────────────────────────────────────────────────────────
var MOIS_FR_ = {
  janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11,
};

function parseFrenchDate_(str) {
  if (!str) return null;
  var s = String(str).trim().toLowerCase();
  var m = s.match(/^(\d{1,2})\s+([a-zéûôîè]+)\s+(\d{4})$/);
  if (m && MOIS_FR_[m[2]] !== undefined) {
    return new Date(parseInt(m[3], 10), MOIS_FR_[m[2]], parseInt(m[1], 10)).getTime();
  }
  m = s.match(/^([a-zéûôîè]+)\s+(\d{4})$/);
  if (m && MOIS_FR_[m[1]] !== undefined) {
    return new Date(parseInt(m[2], 10), MOIS_FR_[m[1]], 1).getTime();
  }
  return null;
}

function sortByDateDesc_(items) {
  return items.sort(function(a, b) {
    var da = parseFrenchDate_(a.date);
    var db = parseFrenchDate_(b.date);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return db - da;
  });
}

function getActusData() {
  try {
    var ss = getSS_();
    var sheet = ss.getSheetByName('Actus');
    if (!sheet || sheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ articles: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 10).getValues();
    var articles = rows
      .filter(function(r) { return r[3] && String(r[3]).trim().toLowerCase() !== 'titre'; }) // Titre non vide, exclut une ligne d'en-tête dupliquée
      .map(function(r) {
        return {
          tab: String(r[0]).trim().toLowerCase(),
          cat: String(r[1]),
          img: String(r[2]),
          title: String(r[3]),
          excerpt: String(r[4]),
          date: formatDateCell_(r[5]),
          body: String(r[6]),
          video: r[7] ? String(r[7]) : null,
          images: r[8] ? String(r[8]).split('|').map(function(s) { return s.trim(); }).filter(function(s) { return s; }) : null,
          imgPosition: r[9] ? String(r[9]) : null,
        };
      });

    return ContentService
      .createTextOutput(JSON.stringify({ articles: sortByDateDesc_(articles) }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────
//  MIGRATION UNIQUE — recopie les 19 articles historiques (qui vivaient
//  dans le code) dans l'onglet "Actus", pour que le Sheet devienne la
//  seule source de vérité. À exécuter UNE SEULE FOIS depuis l'éditeur
//  Apps Script (sélectionner migrateActusFallback dans le menu déroulant
//  en haut, puis cliquer "Exécuter"). Sans danger de doublons : n'ajoute
//  que les titres pas déjà présents dans la feuille.
// ────────────────────────────────────────────────────────────────────
function migrateActusFallback() {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Actus');
  if (!sheet) {
    sheet = ss.insertSheet('Actus');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Onglet', 'Categorie', 'Image', 'Titre', 'Resume', 'Date', 'Texte', 'Video', 'Images galerie', 'Position image']);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }

  var existants = {};
  if (sheet.getLastRow() > 1) {
    var titresExistants = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues();
    titresExistants.forEach(function(r) { existants[String(r[0]).trim()] = true; });
  }

  var articles = [
    ['locale', 'Rap Ivoire', '/img/himra.jpeg', 'Himra, premier rappeur ivoirien certifié or en France', '"Number One" feat Minz dépasse les 22 millions de streams sur Spotify. Une première historique pour le rap ivoirien.', '1 juillet 2026',
      "Himra est entré dans l'histoire en devenant le premier rappeur ivoirien à décrocher une certification single d'or SNEP en France avec son titre \"Number One\" feat Minz, dépassant les 22 millions de streams sur Spotify. Une performance qui confirme l'influence croissante du rap ivoirien bien au-delà des frontières du continent.\n\nSur sa lancée, l'artiste s'attaque désormais au marché américain avec une tournée qui a débuté au Gramercy Theatre de New York en juin 2026. Une étape symbolique pour un artiste qui ne cesse de repousser les limites.\n\nHimra incarne une nouvelle génération de rappeurs ivoiriens qui s'imposent sur la scène internationale sans renier leurs racines. Ce succès ouvre la voie à d'autres talents du pays et renforce le rayonnement du rap ivoire à l'échelle mondiale.",
      '', '', ''],
    ['locale', 'Rap Ivoire', '/img/didi-b.jpeg', "Didi B franchit le million d'auditeurs sur Spotify et l'or au Nigeria", 'Porté par son concert au Zénith de Paris, Didi B devient le premier artiste africain francophone certifié or au Nigeria.', '28 juin 2026',
      "Didi B a franchi un cap historique en dépassant le million d'auditeurs mensuels sur Spotify, porté par le succès de son concert au Zénith de Paris — une salle mythique que peu d'artistes africains ont eu l'honneur de remplir.\n\nL'artiste ivoirien est également devenu le premier artiste africain francophone à obtenir un single d'or au Nigeria avec \"Good Vibes\" feat Zinoleesky. Un exploit qui témoigne de sa capacité à séduire les publics anglophones et à traverser les frontières linguistiques du continent africain.\n\nCes records confirment que Didi B est l'un des artistes ivoiriens les plus influents de sa génération, capable de fédérer des audiences aussi bien en Côte d'Ivoire, en Europe qu'en Afrique de l'Ouest anglophone.",
      '', '', ''],
    ['locale', 'WC2026', '/img/christ-inao.jpg', 'Christ Inao Oulaï, si jeune et déjà indispensable', "Le milieu de terrain de Trabzonspor s'impose comme la révélation ivoirienne de la Coupe du monde 2026.", '1 juillet 2026',
      "Christ Inao Oulaï s'impose comme l'une des révélations ivoiriennes de la Coupe du monde 2026. Le milieu de terrain de Trabzonspor a brillé lors du match contre l'Allemagne, affichant une maturité et une personnalité rares pour son âge, malgré la défaite des Éléphants.\n\nÀ seulement 20 ans, Christ Inao Oulaï a su hausser son niveau dans les grandes occasions, enchaînant les interventions décisives et portant le ballon avec autorité dans l'entrejeu. Sa capacité à récupérer les ballons et à relancer proprement a souvent permis à la Côte d'Ivoire de respirer dans les moments difficiles.\n\nLes observateurs s'accordent à dire que ce garçon a un avenir exceptionnel devant lui. Plusieurs grands clubs européens auraient d'ores et déjà manifesté leur intérêt. La CAN 2027 et les prochaines qualifications mondiales s'annoncent prometteuses avec lui dans le onze ivoirien.",
      '', '', ''],
    ['locale', 'Musique', '/img/ac-01.jpg', 'Kerozen annonce un nouvel album pour juillet 2026', 'Le roi du coupé décalé confirme la sortie de son prochain projet avec plusieurs featurings surprises.', '2 juin 2026',
      "Kerozen, véritable monument du coupé décalé ivoirien, a officialisé la sortie de son nouvel album studio prévu pour le mois de juillet 2026. L'annonce a été faite lors d'une conférence de presse tenue à Abidjan en présence de nombreux artistes et journalistes musicaux.\n\nL'album, dont le titre n'a pas encore été dévoilé, compterait une quinzaine de titres avec des collaborations inédites aux côtés de plusieurs grandes figures de la musique africaine. Parmi les noms qui circulent, on évoque des featurings avec des artistes de la sous-région.\n\n\"C'est un album qui parle de mon peuple, de ma terre et de mon vécu. Je veux que chaque Ivoirien se reconnaisse dans ces morceaux\", a déclaré l'artiste. Une tournée nationale est prévue dans la foulée pour présenter le projet au public.",
      '', '', ''],
    ['locale', 'Culture', '/img/ac-02.jpg', 'Concert hommage à Arafat DJ au Palais de la Culture', 'La communauté des Chinois rend hommage au grand Daishikan avec un concert émouvant à Abidjan.', '31 mai 2026',
      "Le Palais de la Culture d'Abidjan a vibré au rythme d'un concert hommage exceptionnel dédié à Arafat DJ, le Daishikan, disparu en août 2019. La soirée, organisée par sa communauté de fans surnommée \"les Chinois\", a réuni des milliers de supporters venus célébrer la mémoire de leur idole.\n\nDe nombreux artistes ivoiriens ont participé à l'événement pour interpréter les titres emblématiques du regretté chanteur. L'ambiance était à la fois festive et chargée d'émotion, avec des moments de recueillement ponctués par les chants du public.\n\nLa famille d'Arafat DJ était présente et a exprimé sa profonde gratitude envers les fans pour ce geste fort. \"Arafat vivra toujours à travers sa musique et l'amour que vous lui portez\", a déclaré l'un de ses proches. Cet hommage annuel est désormais ancré dans le calendrier culturel ivoirien.",
      '', '', ''],
    ['locale', 'Awards', '/img/ac-03.jpg', 'Les artistes ivoiriens honorés aux MAMA 2026', 'Les Music Of Black Origin Awards célèbrent la scène musicale africaine. La CI rafle plusieurs trophées.', '28 mai 2026',
      "La cérémonie des MAMA 2026 (Music Of Black Origin Awards) a été marquée par le triomphe de la scène musicale ivoirienne. Plusieurs artistes du pays ont été récompensés dans différentes catégories, confirmant le rayonnement international de la musique de Côte d'Ivoire.\n\nLe coupé décalé, le zouglou et l'afro-pop ivoirienne ont été particulièrement mis à l'honneur lors de cette édition. La cérémonie, retransmise dans plusieurs pays africains et européens, a offert une visibilité inédite aux talents ivoiriens.\n\nCes distinctions viennent récompenser plusieurs années de travail acharné et confirment que la Côte d'Ivoire reste une référence incontournable sur la carte musicale du continent. Les artistes primés ont rendu hommage à leurs fans et à leur pays lors de leurs discours de remerciements.",
      '', '', ''],
    ['locale', 'Exclusivité', '/img/ac-04.jpg', 'Josey dévoile son nouveau single en exclusivité sur Nostalgie', "La chanteuse ivoirienne revient avec un titre afro-pop taillé pour l'été 2026.", '25 mai 2026',
      "C'est en exclusivité sur les ondes de Nostalgie CI que Josey a choisi de dévoiler son tout nouveau single. La chanteuse ivoirienne, connue pour ses tubes entraînants mêlant afropop et sonorités locales, marque son grand retour sur la scène musicale avec un titre prometteur.\n\nLe morceau, aux accents ensoleillés et festifs, est déjà annoncé comme l'un des hits de l'été 2026. Josey s'est confiée en exclusivité à l'équipe de Nostalgie sur l'inspiration derrière ce nouveau projet et ses ambitions pour les mois à venir.\n\n\"Je voulais faire quelque chose de joyeux, de positif. Un titre qui donne envie de danser et de profiter de la vie\", a-t-elle confié lors de son passage en studio. Le single est disponible sur toutes les plateformes de streaming dès aujourd'hui.",
      '', '', ''],
    ['locale', 'Héritage', '/img/ac-05.jpg', 'Les Garagistes de retour avec un album collector', 'Le groupe légendaire célèbre ses 30 ans avec une réédition et de nouveaux morceaux inédits.', '22 mai 2026',
      "Trente ans après leur formation, les Garagistes font leur grand retour avec un album collector qui célèbre trois décennies de musique ivoirienne. Ce projet anniversaire comprend une réédition remasterisée de leurs plus grands succès ainsi que plusieurs morceaux inédits enregistrés spécialement pour l'occasion.\n\nLe groupe, qui a marqué plusieurs générations avec son style unique mêlant zouglou et afropop, retrouve ses fans avec la même énergie et la même authenticité qui ont fait leur succès. Les nouveaux titres témoignent d'une évolution musicale tout en restant fidèles à leur identité sonore.\n\nUne tournée nationale est prévue pour présenter cet album collector au public ivoirien. Les billets pour les premières dates sont déjà en vente et connaissent un vif succès, preuve que l'attachement des fans pour ce groupe légendaire reste intact.",
      '', '', ''],
    ['locale', 'Radio', '/img/ac-06.jpg', 'Nostalgie CI fête ses 32 ans : retour sur une histoire', "Depuis 1994, la station n°1 de Côte d'Ivoire a accompagné des générations entières.", '18 mai 2026',
      "En 1994, Nostalgie CI prenait les ondes pour la première fois à Abidjan, devenant ainsi l'une des toutes premières radios commerciales privées de Côte d'Ivoire. Trente-deux ans plus tard, la station est devenue un véritable pilier du paysage médiatique ivoirien.\n\nAu fil des années, Nostalgie CI a su s'adapter aux évolutions du secteur tout en restant fidèle à ses valeurs : une programmation musicale de qualité, des émissions de proximité et un engagement fort auprès de ses auditeurs. De génération en génération, la station a accompagné les joies, les peines et les moments forts de la vie ivoirienne.\n\nPour célébrer cet anniversaire exceptionnel, la radio prépare une semaine spéciale avec des émissions dédiées, des invités de marque et de nombreuses surprises pour les fidèles auditeurs. \"32 ans de bonheur partagé, et l'aventure ne fait que commencer\", clame fièrement l'équipe de Nostalgie CI.",
      '', '', ''],

    ['internationale', 'People', '/img/taylor-travis.jpg', 'Taylor Swift et Travis Kelce : les noces du siècle à Madison Square Garden', 'La cérémonie est attendue ce week-end du 4 juillet, répartie sur deux jours dans la salle mythique de New York.', '2 juillet 2026',
      "Le mariage de Taylor Swift et Travis Kelce s'annonce comme l'événement de l'année. Les célébrations sont attendues à Madison Square Garden ce week-end du 4 juillet, réparties sur deux jours selon des proches du dossier. La salle mythique de New York est déjà en travaux de décoration pour accueillir ce qui s'annonce comme la cérémonie la plus médiatisée de la décennie.\n\nTaylor Swift ferait filmer l'intégralité de la cérémonie par une équipe professionnelle, tout en gardant le dernier mot sur le montage final. Un contrôle artistique total, à l'image de la popstar qui n'a jamais laissé personne dicter sa narrative.\n\nLe couple, qui fait vibrer les États-Unis depuis leur relation rendue publique en 2023, unit donc officiellement leurs destins dans un cadre à la hauteur de leur légende. Fans et médias du monde entier retiennent leur souffle pour ce week-end historique.",
      '', '', ''],
    ['internationale', 'Musique', '/img/coumba-gawlo.jpg', 'Coumba Gawlo Seck à Abidjan : la diva sénégalaise célèbre la fraternité africaine', 'La grande dame de la musique sénégalaise a séjourné à Abidjan fin juin 2026, rencontrant les figures de la scène ivoirienne.', '30 juin 2026',
      "La diva de la musique sénégalaise Coumba Gawlo Seck s'est récemment rendue à Abidjan. Lors de ce séjour fin juin 2026, elle a notamment été reçue au siège de la Fondation Magic System et a partagé des moments avec des figures de la musique ivoirienne comme Josey et Aïcha Koné.\n\nDurant sa visite, elle en a profité pour exprimer son attachement et son admiration pour la culture ivoirienne. Elle a également évoqué publiquement son récent rétablissement médical, rassurant ses fans après une intervention sur ses cordes vocales.\n\nCe déplacement témoigne de la solidarité et des liens profonds qui unissent les artistes d'Afrique de l'Ouest, au-delà des frontières. Coumba Gawlo Seck reste l'une des voix les plus emblématiques du continent, et son passage à Abidjan a été salué comme un beau moment de fraternité musicale africaine.",
      '', '', ''],
    ['internationale', 'Grammy', '/img/ac-07.jpg', 'Burna Boy décroche le Grammy du meilleur album Afrobeats 2026', "L'Afrobeats nigérian continue de conquérir le monde. Burna Boy couronne une année exceptionnelle.", '2 juin 2026',
      "Burna Boy a remporté le Grammy Award du meilleur album de musique africaine lors de la 68e cérémonie des Grammy Awards, confirmant ainsi sa place de leader incontesté de l'Afrobeats mondial. C'est la deuxième fois que l'artiste nigérian reçoit cette distinction prestigieuse.\n\nL'album primé, salué par la critique internationale pour sa fusion audacieuse de sonorités africaines et occidentales, a dominé les charts mondiaux pendant plusieurs mois. Burna Boy a dédié ce trophée au continent africain et à tous les artistes qui portent la musique africaine à travers le monde.\n\n\"C'est pour l'Afrique. Nous ne faisons que commencer\", a déclaré l'artiste lors de son discours d'acceptation. Cette victoire renforce encore davantage l'influence grandissante de l'Afrobeats sur la scène musicale internationale.",
      '', '', ''],
    ['internationale', 'Tournée', '/img/ac-08.png', 'Beyoncé annonce sa tournée africaine avec un passage à Lagos', 'La reine du R&B pose ses valises en Afrique. Lagos, Nairobi, Johannesburg... et peut-être Abidjan.', '30 mai 2026',
      "Beyoncé a officiellement annoncé une tournée africaine pour la fin de l'année 2026, une première dans sa carrière qui met en lumière l'importance croissante du continent dans l'industrie musicale mondiale. Les villes de Lagos, Nairobi et Johannesburg sont confirmées, et des rumeurs font état d'une possible date à Abidjan.\n\nCette tournée s'inscrit dans la continuité de son album \"Renaissance Act II\", fortement influencé par les sonorités africaines. La star américaine a exprimé depuis longtemps son admiration pour la richesse culturelle et musicale du continent africain.\n\nSi Abidjan venait à être confirmée, ce serait un événement historique pour la Côte d'Ivoire et toute la sous-région. Les fans ouest-africains retiennent leur souffle et espèrent une annonce officielle dans les prochaines semaines. Les billets pour les premières dates déjà confirmées se sont écoulés en quelques minutes.",
      '', '', ''],
    ['internationale', 'Charts', '/img/ac-09.jpg', 'Wizkid domine le Top Afrobeats mondial 5 mois consécutifs', "Starboy n'en finit pas de régner sur les charts mondiaux avec son dernier projet.", '28 mai 2026',
      "Wizkid continue d'écrire l'histoire de l'Afrobeats en dominant les charts mondiaux pendant cinq mois consécutifs avec son dernier projet musical. L'artiste nigérian confirme ainsi son statut d'icône planétaire et prouve que l'Afrobeats n'est plus une tendance passagère mais un genre musical à part entière.\n\nSon album, qui mélange avec brio les influences africaines, caribéennes et américaines, a séduit des millions d'auditeurs sur tous les continents. Les plateformes de streaming enregistrent des chiffres records, avec plusieurs milliards de streams cumulés depuis sa sortie.\n\n\"Wizkid a redéfini les frontières de la musique africaine\", souligne un analyste musical. La presse internationale lui consacre des articles élogieux, et les collaborations avec des artistes occidentaux continuent d'affluer. L'ère Starboy est loin d'être terminée.",
      '', '', ''],
    ['internationale', 'Comeback', '/img/ac-10.jpg', 'Rihanna de retour : premier album depuis 10 ans confirmé', "La Barbadienne met fin à une décennie de silence musical. L'album serait prévu pour fin 2026.", '25 mai 2026',
      "Après une décennie d'absence discographique, Rihanna a officiellement confirmé le retour de son album studio tant attendu, prévu pour la fin de l'année 2026. L'annonce a provoqué un véritable tremblement de terre sur les réseaux sociaux, avec des millions de réactions enthousiastes de fans du monde entier.\n\nLa superstar barbadienne, qui s'est notamment consacrée à ses projets entrepreneuriaux avec Fenty Beauty et Savage X Fenty ces dernières années, assure que ce nouvel album marquera une nouvelle ère dans sa carrière musicale. Plusieurs collaborations avec des artistes africains seraient incluses dans le projet.\n\nLa communauté musicale africaine et ivoirienne espère particulièrement une collaboration avec des artistes du continent, compte tenu de l'influence grandissante de la musique africaine dans la pop mondiale. L'album est déjà l'un des projets musicaux les plus attendus de la décennie.",
      '', '', ''],
    ['internationale', 'Tendance', '/img/ac-11.jpg', "L'Amapiano conquiert l'Europe : tournée internationale confirmée", "Le son sud-africain s'exporte. Les plus grands DJs d'Amapiano annoncent des dates en France et en Belgique.", '20 mai 2026',
      "L'Amapiano, le genre musical né en Afrique du Sud au milieu des années 2010, poursuit sa conquête mondiale avec l'annonce d'une grande tournée européenne réunissant les figures les plus emblématiques du genre. Des dates sont confirmées en France, en Belgique, aux Pays-Bas et au Royaume-Uni.\n\nCe genre musical aux basses profondes et aux mélodies envoûtantes a su traverser les frontières et conquérir un public occidental de plus en plus large. Les clubs et festivals européens se disputent les têtes d'affiche de la scène Amapiano, signe de l'engouement croissant pour cette musique.\n\nEn Afrique de l'Ouest, l'Amapiano a également trouvé un écho favorable, et la Côte d'Ivoire ne fait pas exception. Les artistes ivoiriens commencent à intégrer des éléments de ce genre dans leurs productions, témoignant d'une véritable perméabilité musicale entre les différentes régions du continent.",
      '', '', ''],
    ['internationale', 'Zouk', '/img/ac-12.jpg', 'Le zouk africain en pleine renaissance en 2026', "Après des années d'éclipse, le zouk africain revient en force avec une nouvelle génération d'artistes.", '15 mai 2026',
      "Le zouk africain connaît un renouveau remarquable en 2026, porté par une nouvelle génération d'artistes qui réinterprètent ce genre musical avec des sonorités contemporaines tout en préservant son âme originelle. Après plusieurs années en retrait de la scène internationale, le zouk africain retrouve sa place dans les playlists et les clubs du continent.\n\nDes artistes venus du Cap-Vert, de la Guinée-Bissau, du Sénégal et d'autres pays africains contribuent à cette renaissance en fusionnant le zouk traditionnel avec des influences afropop, R&B et électroniques. Le résultat est un son nouveau, frais et accessible à un large public.\n\nEn Côte d'Ivoire, ce renouveau est accueilli avec enthousiasme, le pays ayant toujours entretenu une relation forte avec le zouk africain. Plusieurs artistes ivoiriens préparent des projets s'inscrivant dans cette nouvelle vague, promettant une belle effervescence musicale pour les mois à venir.",
      '', '', ''],

    ['events', 'Exclusivité', 'https://img.youtube.com/vi/S36YkP4ynLo/maxresdefault.jpg', '« Doni Doni » : Asalfo dévoile les coulisses de sa collaboration avec Didi B.', "Invité de l'Afterwork, le leader de Magic System revient sur les raisons artistiques qui l'ont conduit à collaborer avec le rappeur ivoirien Didi B.", 'Février 2026',
      "Invité de l'Afterwork à l'occasion de la sortie du nouvel album de Magic System, « Doni Doni », Asalfo, leader du groupe, est revenu sur les raisons qui l'ont conduit à collaborer avec le rappeur ivoirien Didi B. Au cours de l'émission, il a partagé les motivations derrière ce choix artistique et les ambitions de cette collaboration.",
      'https://www.youtube.com/watch?v=S36YkP4ynLo', '', ''],

    ['potins', 'Potins', '/img/potin-achirou-01.jpg', 'Qui est vraiment Mohamed-Adnane Achirou, le discret mari de Marie Paule Adjé ?', "Depuis son mariage avec l'actrice ivoirienne, l'entrepreneur discret suscite autant de curiosité que de réactions sur les réseaux.", '8 juillet 2026',
      "Depuis son mariage avec Marie Paule Adjé, Mohamed-Adnane Achirou est devenu l'un des noms les plus commentés sur les réseaux sociaux. Entrepreneur discret jusqu'alors, il suscite aujourd'hui autant de curiosité que de réactions.\n\nPrésenté comme le dirigeant d'Agrosources, il s'est longtemps tenu loin des projecteurs. Mais depuis que son union avec l'actrice ivoirienne a été rendue publique, internautes et médias s'intéressent de près à son parcours.\n\nEntre admiration, interrogations et nombreuses rumeurs relayées en ligne, difficile de faire le tri. À ce jour, les seuls faits établis sont son mariage avec Marie Paule Adjé et son activité dans le secteur agro-industriel. Le reste alimente surtout les discussions sur les réseaux sociaux, sans avoir été confirmé par des sources officielles.\n\nUne chose est sûre : Mohamed-Adnane Achirou est passé, en quelques jours, du statut d'entrepreneur discret à celui de personnalité qui fait le plus parler dans les « gbairais » ivoiriens.",
      '', '/img/potin-achirou-02.jpeg', 'center 20%'],
  ];

  var ajoutes = 0;
  articles.forEach(function(row) {
    if (!existants[String(row[3]).trim()]) {
      sheet.appendRow(row);
      ajoutes++;
    }
  });

  Logger.log(ajoutes + ' article(s) ajouté(s) sur ' + articles.length + '.');
}

// ────────────────────────────────────────────────────────────────────
//  ÉMISSIONS → onglet "Emissions"
//  Colonnes : Titre | Tag | Horaire | Animateurs | Image
// ────────────────────────────────────────────────────────────────────
function getEmissionsData() {
  try {
    var ss = getSS_();
    var sheet = ss.getSheetByName('Emissions');
    if (!sheet || sheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ emissions: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    var emissions = rows
      .filter(function(r) { return r[0] && String(r[0]).trim().toLowerCase() !== 'titre'; })
      .map(function(r) {
        return {
          title: String(r[0]),
          tag: String(r[1]),
          schedule: String(r[2]),
          animateurs: r[3] ? String(r[3]) : '',
          img: r[4] ? String(r[4]) : '',
        };
      });

    return ContentService
      .createTextOutput(JSON.stringify({ emissions: emissions }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────
//  MIGRATION UNIQUE — recopie les 11 émissions historiques (qui vivaient
//  dans le code) dans l'onglet "Emissions", pour que le Sheet devienne la
//  seule source de vérité. À exécuter UNE SEULE FOIS depuis l'éditeur
//  Apps Script (sélectionner migrateEmissionsFallback dans le menu
//  déroulant en haut, puis cliquer "Exécuter"). Sans danger de doublons :
//  n'ajoute que les titres pas déjà présents dans la feuille.
// ────────────────────────────────────────────────────────────────────
function migrateEmissionsFallback() {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Emissions');
  if (!sheet) {
    sheet = ss.insertSheet('Emissions');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Titre', 'Tag', 'Horaire', 'Animateurs', 'Image']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }

  var existants = {};
  if (sheet.getLastRow() > 1) {
    var titresExistants = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    titresExistants.forEach(function(r) { existants[String(r[0]).trim()] = true; });
  }

  var emissions = [
    ['Le Crazy Morning', 'Matin', 'Lun–Ven · 06h–10h', 'Arielle, Teeyah, Prince LB, Willy', '/img/em-01.jpg'],
    ['Tchika Tchika Boom', 'Milieu de journée', 'Lun–Ven · 11h–12h', 'Bruno', '/img/em-02.jpg'],
    ['Hits & Co', 'Après-midi', 'Lun–Ven · 12h–15h', 'Nanda', '/img/em-03.jpg'],
    ['Brand New', 'Nouveautés', 'Lun–Ven · 15h–16h', 'Alvhin', '/img/em-04.jpg'],
    ["L'Afterwork", 'Soirée', 'Lun–Jeu · 17h–19h', '', '/img/em-05.jpg'],
    ['Nostafoot', 'Football', 'Lun–Jeu · 19h–21h', 'Malick Traore, Kalen Damessi, Joelle H. Acina, Roland Danon', '/img/em-06.jpg'],
    ['Flash Info', 'Information', 'Lun–Sam · Toutes les heures', 'Luise Martin, Armel Mendy', '/img/em-07.jpg'],
    ['Matinales du Week-End', 'Week-End', 'Sam–Dim · 07h–10h', 'Desie, Frederick', '/img/em-08.jpg'],
    ['La Peufra', 'Culture', 'Samedis · 14h–16h', 'Ozone Afrikbamba', '/img/em-09.jpg'],
    ['Kaboré Fait Son Show', 'Variétés', 'Sam–Dim · 18h–19h', 'Kabore', '/img/em-10.jpg'],
    ['Retourne Les Hits', 'Club', 'Ven–Sam · 20h–00h', 'DJ Philo', '/img/em-11.jpg'],
  ];

  var ajoutes = 0;
  emissions.forEach(function(row) {
    if (!existants[String(row[0]).trim()]) {
      sheet.appendRow(row);
      ajoutes++;
    }
  });

  Logger.log(ajoutes + ' émission(s) ajoutée(s) sur ' + emissions.length + '.');
}

// ────────────────────────────────────────────────────────────────────
//  PODCASTS & REPLAYS → onglet "Podcasts"
//  Colonnes : Type | YouTube (URL ou ID) | Titre | Emission | Date | Duree | Description
//  Type = podcast / audio / video
// ────────────────────────────────────────────────────────────────────
function extractYouTubeId_(value) {
  if (!value) return '';
  var s = String(value).trim();
  var m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : s;
}

function getPodcastsData() {
  try {
    var ss = getSS_();
    var sheet = ss.getSheetByName('Podcasts');
    var result = { podcasts: [], audio: [], video: [] };
    if (!sheet || sheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
    rows.forEach(function(r, i) {
      if (!r[2] || String(r[2]).trim().toLowerCase() === 'titre') return; // Titre vide ou ligne d'en-tête dupliquée
      var type = String(r[0]).trim().toLowerCase();
      var item = {
        id: i + 1,
        youtubeId: extractYouTubeId_(r[1]),
        titre: String(r[2]),
        emission: String(r[3]),
        date: formatDateCell_(r[4]),
        duree: r[5] ? String(r[5]) : null,
        description: r[6] ? String(r[6]) : null,
      };
      if (type === 'podcast' || type === 'podcasts') result.podcasts.push(item);
      else if (type === 'audio') result.audio.push(item);
      else if (type === 'video') result.video.push(item);
    });

    result.podcasts = sortByDateDesc_(result.podcasts);
    result.audio = sortByDateDesc_(result.audio);
    result.video = sortByDateDesc_(result.video);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────
//  ADMIN — ajout/suppression Actus & Podcasts, mise à jour Top5
//  Appelés uniquement depuis la page /admin du site (protégée par mot de passe)
// ────────────────────────────────────────────────────────────────────
function handleAdminAddActus(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Actus');
  if (!sheet) {
    sheet = ss.insertSheet('Actus');
    sheet.appendRow(['Onglet', 'Categorie', 'Image', 'Titre', 'Resume', 'Date', 'Texte', 'Video', 'Images galerie', 'Position image']);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }
  sheet.appendRow([
    data.tab || '',
    data.cat || '',
    data.img || '',
    data.title || '',
    data.excerpt || '',
    data.date || '',
    data.body || '',
    data.video || '',
    (data.images || []).join('|'),
    data.imgPosition || '',
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminDeleteActus(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Actus');
  if (sheet && sheet.getLastRow() > 1) {
    var titres = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < titres.length; i++) {
      if (String(titres[i][0]).trim() === String(data.title).trim()) {
        sheet.deleteRow(i + 2);
        break;
      }
    }
  }
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminAddPodcast(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Podcasts');
  if (!sheet) {
    sheet = ss.insertSheet('Podcasts');
    sheet.appendRow(['Type', 'YouTube', 'Titre', 'Emission', 'Date', 'Duree', 'Description']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  if (sheet.getLastRow() > 1) {
    var existants = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    for (var i = 0; i < existants.length; i++) {
      var sameType = String(existants[i][0]).trim().toLowerCase() === String(data.podcastType || '').trim().toLowerCase();
      var sameTitre = String(existants[i][2]).trim().toLowerCase() === String(data.titre || '').trim().toLowerCase();
      if (sameType && sameTitre) {
        // Deja present (probable retentative apres timeout) : on ne duplique pas.
        return ContentService
          .createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  sheet.appendRow([
    data.podcastType || '',
    data.youtube || '',
    data.titre || '',
    data.emission || '',
    data.date || '',
    data.duree || '',
    data.description || '',
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminDeletePodcast(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Podcasts');
  if (sheet && sheet.getLastRow() > 1) {
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    for (var i = 0; i < rows.length; i++) {
      var sameType = String(rows[i][0]).trim().toLowerCase() === String(data.podcastType).trim().toLowerCase();
      var sameTitre = String(rows[i][2]).trim() === String(data.titre).trim();
      if (sameType && sameTitre) {
        sheet.deleteRow(i + 2);
        break;
      }
    }
  }
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminAddEmission(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Emissions');
  if (!sheet) {
    sheet = ss.insertSheet('Emissions');
    sheet.appendRow(['Titre', 'Tag', 'Horaire', 'Animateurs', 'Image']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  sheet.appendRow([
    data.title || '',
    data.tag || '',
    data.schedule || '',
    data.animateurs || '',
    data.img || '',
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminDeleteEmission(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Emissions');
  if (sheet && sheet.getLastRow() > 1) {
    var titres = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < titres.length; i++) {
      if (String(titres[i][0]).trim() === String(data.title).trim()) {
        sheet.deleteRow(i + 2);
        break;
      }
    }
  }
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminUpdateTop5(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Top5');
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Onglet Top5 introuvable' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Archive le classement encore en place avant de l'écraser, pour
  // pouvoir reconstituer un Top5 par mois/trimestre/semestre/année.
  archiveCurrentTop5_(ss, sheet);

  sheet.getRange('B1').setValue(data.semaine || '');
  var items = data.items || [];
  for (var i = 0; i < 5; i++) {
    var it = items[i] || {};
    sheet.getRange(4 + i, 1, 1, 7).setValues([[
      i + 1,
      it.artiste || '',
      it.titre || '',
      it.passages || 0,
      it.spotifyId || '',
      it.spotifyType || 'track',
      it.coverImg || '',
    ]]);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminUpdateLive(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Live');
  if (!sheet) {
    sheet = ss.insertSheet('Live');
    sheet.getRange('A1').setValue('IsLive');
    sheet.getRange('A2').setValue('VideoId');
    sheet.getRange('A3').setValue('Titre');
    sheet.getRange('A4').setValue('Description');
    sheet.getRange('A1:A4').setFontWeight('bold');
  }
  sheet.getRange('B1').setValue(data.isLive ? true : false);
  sheet.getRange('B2').setValue(data.videoId || '');
  sheet.getRange('B3').setValue(data.title || 'Nostalgie Live');
  sheet.getRange('B4').setValue(data.description || '');
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAdminUpdateTTB(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('TTB');
  if (!sheet) {
    sheet = ss.insertSheet('TTB');
    sheet.getRange('A1').setValue('Indice');
    sheet.getRange('A2').setValue('Date');
    sheet.getRange('A1:A2').setFontWeight('bold');
  }
  sheet.getRange('B1').setValue(data.indice || '');
  sheet.getRange('B2').setValue(data.date || '');
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  ARCHIVES TOP5 → onglet "Top5_Historique"
//  Colonnes : Date | Semaine | Rang | Artiste | Titre | Passages | SpotifyId | SpotifyType | CoverImg
//  À chaque mise à jour du Top5 courant, l'ancien classement est
//  archivé ici avec la date du jour (approximation de "fin de semaine"
//  puisqu'on ne connaît que le moment où il a été remplacé).
// ────────────────────────────────────────────────────────────────────
function archiveCurrentTop5_(ss, top5Sheet) {
  var current = top5Sheet.getRange(4, 1, 5, 7).getValues();
  var hasData = current.some(function(r) { return r[1] && String(r[1]).trim(); });
  if (!hasData) return; // rien à archiver la toute première fois

  var semaine = String(top5Sheet.getRange('B1').getValue() || '');
  var histSheet = ss.getSheetByName('Top5_Historique');
  if (!histSheet) {
    histSheet = ss.insertSheet('Top5_Historique');
    histSheet.appendRow(['Date', 'Semaine', 'Rang', 'Artiste', 'Titre', 'Passages', 'SpotifyId', 'SpotifyType', 'CoverImg']);
    histSheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }

  var horodatage = new Date();
  current.forEach(function(r) {
    if (!r[1] || !String(r[1]).trim()) return; // artiste vide = ligne ignorée
    histSheet.appendRow([horodatage, semaine, r[0], r[1], r[2], r[3], r[4], r[5], r[6]]);
  });
}

function getTop5ArchiveData(startStr, endStr) {
  try {
    var ss = getSS_();
    var sheet = ss.getSheetByName('Top5_Historique');
    if (!sheet || sheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ items: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var start = startStr ? new Date(startStr) : null;
    var end = endStr ? new Date(endStr) : null;
    if (end) end.setHours(23, 59, 59, 999); // borne incluse jusqu'à la fin du jour

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
    var grouped = {}; // clé = artiste|titre (normalisés) → { artiste, titre, passages, spotifyId, spotifyType, coverImg, dateLaPlusRecente }

    rows.forEach(function(r) {
      var date = r[0];
      if (!(date instanceof Date)) return;
      if (start && date < start) return;
      if (end && date > end) return;

      var artiste = String(r[3] || '').trim();
      var titre = String(r[4] || '').trim();
      if (!artiste || !titre) return;

      var key = artiste.toLowerCase() + '|' + titre.toLowerCase();
      var passages = Number(r[5]) || 0;

      if (!grouped[key] || date > grouped[key]._date) {
        grouped[key] = {
          artiste: artiste,
          titre: titre,
          passages: (grouped[key] ? grouped[key].passages : 0) + passages,
          spotifyId: String(r[6] || ''),
          spotifyType: String(r[7] || 'track'),
          coverImg: String(r[8] || ''),
          _date: date,
        };
      } else {
        grouped[key].passages += passages;
      }
    });

    var items = Object.keys(grouped).map(function(k) { return grouped[k]; });
    items.sort(function(a, b) { return b.passages - a.passages; });
    items = items.slice(0, 5).map(function(it, i) {
      return {
        rang: i + 1,
        artiste: it.artiste,
        titre: it.titre,
        passages: it.passages,
        spotifyId: it.spotifyId,
        spotifyType: it.spotifyType,
        coverImg: it.coverImg,
      };
    });

    return ContentService
      .createTextOutput(JSON.stringify({ items: items }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────
//  doPost — réception des formulaires (dédicaces, réservations, etc.)
// ────────────────────────────────────────────────────────────────────
// Types d'action réservés à l'admin : protégés par un secret partagé (voir ci-dessous),
// car ce webhook est une URL publique — n'importe qui qui la connaîtrait pourrait sinon
// écrire directement dans le Sheet sans passer par le mot de passe du panneau /admin.
var ADMIN_ACTION_TYPES = [
  'admin_add_actus', 'admin_delete_actus',
  'admin_add_podcast', 'admin_delete_podcast',
  'admin_update_top5',
  'admin_update_live',
  'admin_add_emission', 'admin_delete_emission',
  'admin_update_ttb'
];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (ADMIN_ACTION_TYPES.indexOf(data.type) !== -1) {
    var secretAttendu = PropertiesService.getScriptProperties().getProperty('ADMIN_WEBHOOK_SECRET');
    if (!secretAttendu || data.secret !== secretAttendu) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Non autorisé' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (data.type === 'newsletter') {
    return handleNewsletter(data);
  }
  if (data.type === 'admin_add_actus') {
    return handleAdminAddActus(data);
  }
  if (data.type === 'admin_delete_actus') {
    return handleAdminDeleteActus(data);
  }
  if (data.type === 'admin_add_podcast') {
    return handleAdminAddPodcast(data);
  }
  if (data.type === 'admin_delete_podcast') {
    return handleAdminDeletePodcast(data);
  }
  if (data.type === 'admin_update_top5') {
    return handleAdminUpdateTop5(data);
  }
  if (data.type === 'admin_update_live') {
    return handleAdminUpdateLive(data);
  }
  if (data.type === 'admin_update_ttb') {
    return handleAdminUpdateTTB(data);
  }
  if (data.type === 'admin_add_emission') {
    return handleAdminAddEmission(data);
  }
  if (data.type === 'admin_delete_emission') {
    return handleAdminDeleteEmission(data);
  }
  if (data.type === 'reservation') {
    return handleReservation(data);
  }
  if (data.type === 'contact_commercial') {
    return handleContactCommercial(data);
  }
  if (data.type === 'partenariat') {
    return handlePartenariat(data);
  }
  if (data.type === 'inscription_auditeur') {
    return handleInscriptionAuditeur(data);
  }
  if (data.type === 'like') {
    return handleLike(data);
  }
  if (data.type === 'comment') {
    return handleComment(data);
  }
  return handleDedicace(data);
}

// ────────────────────────────────────────────────────────────────────
//  J'AIME → feuille "Likes"
// ────────────────────────────────────────────────────────────────────
function handleLike(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Likes');
  if (!sheet) {
    sheet = ss.insertSheet('Likes');
    sheet.appendRow(['Date', 'videoId']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
  }
  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.videoId
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  COMMENTAIRES → feuille "Commentaires"
// ────────────────────────────────────────────────────────────────────
function handleComment(data) {
  var ss = getSS_();
  var sheet = ss.getSheetByName('Commentaires');
  if (!sheet) {
    sheet = ss.insertSheet('Commentaires');
    sheet.appendRow(['Date', 'videoId', 'Prénom', 'Commentaire']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.videoId,
    data.prenom || 'Anonyme',
    data.commentaire
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  NEWSLETTER → feuille "Abonnés Newsletter"
// ────────────────────────────────────────────────────────────────────
function handleNewsletter(data) {
  var ss = getSS_();

  var sheet = ss.getSheetByName('Abonnés Newsletter');
  if (!sheet) {
    sheet = ss.insertSheet('Abonnés Newsletter');
    sheet.appendRow(['Date inscription', 'Prénom', 'Email', 'Statut']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }

  // Vérifier si l'email est déjà inscrit
  var emails = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  for (var i = 0; i < emails.length; i++) {
    if (emails[i][0] === data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, already: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.prenom || '—',
    data.email,
    'Actif'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  INSCRIPTION AUDITEUR → feuille "Auditeurs" (base marketing/SMS)
// ────────────────────────────────────────────────────────────────────
function handleInscriptionAuditeur(data) {
  var ss = getSS_();

  var sheet = ss.getSheetByName('Auditeurs');
  if (!sheet) {
    sheet = ss.insertSheet('Auditeurs');
    sheet.appendRow(['Date inscription', 'Nom', 'Prénom', 'Date de naissance', 'Téléphone', 'Ville', 'Consentement SMS']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }

  // Éviter les doublons sur le même numéro de téléphone
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var telephones = sheet.getRange(2, 5, lastRow - 1, 1).getValues();
    for (var i = 0; i < telephones.length; i++) {
      if (telephones[i][0] === data.telephone) {
        return ContentService
          .createTextOutput(JSON.stringify({ success: true, already: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.nom,
    data.prenom,
    data.dateNaissance || '—',
    "'" + data.telephone, // apostrophe = force le texte brut (sinon Sheets lit "+225..." comme une formule)
    data.ville || '—',
    data.consentement ? 'Oui' : 'Non'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  DÉDICACES → feuille principale + notification Telegram animateur
// ────────────────────────────────────────────────────────────────────

// ⚙️ TOKEN du bot @NostalgieCI_Dedicaces_bot (créé via @BotFather)
// Stocké en propriété du script (Extensions > Propriétés du script), jamais en clair ici.
var TELEGRAM_BOT_TOKEN = PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN');

// ⚙️ CONFIG ANIMATEURS — remplacer 0 par le vrai chat_id de chaque animateur
// Pour obtenir le chat_id : l'animateur envoie /start au bot,
// puis exécuter getTelegramChatIds() dans l'éditeur Apps Script.
var TELEGRAM_ANIMATEURS = {
  'Le Crazy Morning': { chatId: -5228905648 },
  'Hits & Co':        { chatId: 5945808873 },
};

function sendTelegramMessage(chatId, text) {
  if (!chatId || chatId === 0) return;
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: chatId, text: text }),
    muteHttpExceptions: true
  });
}

// Exécuter cette fonction pour voir les chat_ids des animateurs qui ont /start le bot
function getTelegramChatIds() {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/getUpdates';
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log(response.getContentText());
}

function handleDedicace(data) {
  var sheet = getSS_().getActiveSheet();
  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.prenom,
    data.ville,
    data.pour,
    data.chanson || '—',
    data.message,
    data.emission,
    'Non lu'
  ]);

  // Envoi Telegram à l'animateur de l'émission concernée
  try {
    var animateur = TELEGRAM_ANIMATEURS[data.emission];
    if (animateur && animateur.chatId && animateur.chatId !== 0) {
      var msg = '🎵 DÉDICACE — ' + data.emission + '\n\n'
        + '👤 De : ' + data.prenom + ' (' + data.ville + ')\n'
        + '💌 Pour : ' + data.pour + '\n'
        + (data.chanson ? '🎶 Chanson : ' + data.chanson + '\n' : '')
        + '📝 Message : ' + data.message;
      sendTelegramMessage(animateur.chatId, msg);
    }
  } catch (err) {
    Logger.log('Telegram error: ' + err.toString());
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  RÉSERVATIONS → feuille "Réservations" + email commercial
// ────────────────────────────────────────────────────────────────────
function handleReservation(data) {
  var ss = getSS_();

  // Créer la feuille "Réservations" si elle n'existe pas encore
  var sheet = ss.getSheetByName('Réservations');
  if (!sheet) {
    sheet = ss.insertSheet('Réservations');
    sheet.appendRow([
      'Date', 'Société', 'Contact', 'Email', 'Téléphone',
      'Espaces réservés', 'Durée', 'Date début', 'Total FCFA', 'Statut'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }

  // Enregistrer la ligne
  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.societe,
    data.nom,
    data.email,
    "'" + data.telephone,
    data.espaces.join(' | '),
    data.duree,
    data.dateDebut,
    data.total,
    'En attente'
  ]);

  // Envoyer l'email à l'assistant commercial
  MailApp.sendEmail({
    to: 'assistant.commercial@nostalgie.ci',
    subject: '🔔 Réservation pub — ' + data.societe + ' — ' + data.total,
    htmlBody: buildEmailHtml(data)
  });

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  CONTACT COMMERCIAL → feuille "Demandes commerciales" + email
// ────────────────────────────────────────────────────────────────────
function handleContactCommercial(data) {
  var ss = getSS_();

  var sheet = ss.getSheetByName('Demandes commerciales');
  if (!sheet) {
    sheet = ss.insertSheet('Demandes commerciales');
    sheet.appendRow([
      'Date', 'Nom', 'Entreprise', 'Téléphone', 'Email',
      'Prestation', 'Budget', 'Message', 'Statut'
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.nom,
    data.entreprise,
    "'" + data.telephone,
    data.email,
    data.prestation || '—',
    data.budget || '—',
    data.message || '—',
    'En attente'
  ]);

  MailApp.sendEmail({
    to: 'assistant.commercial@nostalgie.ci',
    subject: '💼 Demande commerciale — ' + data.entreprise,
    htmlBody: '<div style="font-family:Arial,sans-serif;max-width:600px">'
      + '<h2 style="color:#A07830">Nouvelle demande commerciale (site web)</h2>'
      + '<table style="border-collapse:collapse;width:100%">'
      + ligneEmail('Nom', data.nom)
      + ligneEmail('Entreprise', data.entreprise)
      + ligneEmail('Téléphone', data.telephone)
      + ligneEmail('Email', data.email)
      + ligneEmail('Prestation', data.prestation || '—')
      + ligneEmail('Budget estimé', data.budget || '—')
      + ligneEmail('Message', data.message || '—')
      + '</table>'
      + '<p style="color:#999;font-size:12px;margin-top:16px">Envoyé depuis le formulaire Contact de nostalgie-ci.vercel.app</p>'
      + '</div>'
  });

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
//  PARTENARIAT → feuille "Partenariats" + email marketing
// ────────────────────────────────────────────────────────────────────
function handlePartenariat(data) {
  var ss = getSS_();

  var sheet = ss.getSheetByName('Partenariats');
  if (!sheet) {
    sheet = ss.insertSheet('Partenariats');
    sheet.appendRow([
      'Date', 'Contact', 'Organisation', 'Téléphone', 'Email',
      'Événement', 'Type', 'Date événement', 'Lieu', 'Partenariats souhaités', 'Description', 'Statut'
    ]);
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' }),
    data.nom,
    data.organisation,
    "'" + data.telephone,
    data.email,
    data.evenement,
    data.typeEvenement || '—',
    data.dateEvenement || '—',
    data.lieu || '—',
    (data.partenariats || []).join(' | ') || '—',
    data.description || '—',
    'En attente'
  ]);

  MailApp.sendEmail({
    to: 'abdair.ndoye@nostalgie.ci',
    subject: '🤝 Demande de partenariat — ' + data.evenement + ' (' + data.organisation + ')',
    htmlBody: '<div style="font-family:Arial,sans-serif;max-width:600px">'
      + '<h2 style="color:#A07830">Nouvelle demande de partenariat (site web)</h2>'
      + '<table style="border-collapse:collapse;width:100%">'
      + ligneEmail('Contact', data.nom)
      + ligneEmail('Organisation', data.organisation)
      + ligneEmail('Téléphone', data.telephone)
      + ligneEmail('Email', data.email)
      + ligneEmail('Événement', data.evenement)
      + ligneEmail('Type', data.typeEvenement || '—')
      + ligneEmail('Date prévue', data.dateEvenement || '—')
      + ligneEmail('Lieu', data.lieu || '—')
      + ligneEmail('Partenariats souhaités', (data.partenariats || []).join(', ') || '—')
      + ligneEmail('Description', data.description || '—')
      + '</table>'
      + '<p style="color:#999;font-size:12px;margin-top:16px">Envoyé depuis le formulaire Contact de nostalgie-ci.vercel.app</p>'
      + '</div>'
  });

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Ligne de tableau pour les emails simples
function ligneEmail(label, valeur) {
  return '<tr>'
    + '<td style="padding:6px 12px;color:#999;border-bottom:1px solid #eee;width:160px">' + label + '</td>'
    + '<td style="padding:6px 12px;border-bottom:1px solid #eee">' + valeur + '</td>'
    + '</tr>';
}

// ────────────────────────────────────────────────────────────────────
//  Template HTML de l'email de réservation
// ────────────────────────────────────────────────────────────────────
function buildEmailHtml(data) {
  var lignes = data.espacesDetail.map(function(e) {
    return '<tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a">✓ ' + e.nom + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;text-align:right;font-weight:600">'
      + Number(e.prix).toLocaleString('fr-FR') + ' FCFA</td></tr>';
  }).join('');

  return '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#111;color:#f5f0e8">'

    // En-tête
    + '<div style="background:#D4A843;padding:24px;text-align:center">'
    + '<div style="font-size:28px;font-weight:900;color:#000;letter-spacing:2px">NOSTALGIE</div>'
    + '<div style="font-size:12px;color:#000;opacity:0.6;margin-top:4px">101.1 FM · Côte d\'Ivoire</div>'
    + '<div style="font-size:13px;font-weight:600;color:#000;margin-top:8px">Nouvelle demande de réservation publicitaire</div>'
    + '</div>'

    // Infos client
    + '<div style="padding:28px">'
    + '<table style="width:100%;border-collapse:collapse;margin-bottom:24px">'
    + '<tr><td style="padding:8px 12px;color:#999;width:130px">Société</td><td style="padding:8px 12px;font-weight:700;font-size:16px">' + data.societe + '</td></tr>'
    + '<tr><td style="padding:8px 12px;color:#999">Contact</td><td style="padding:8px 12px">' + data.nom + '</td></tr>'
    + '<tr><td style="padding:8px 12px;color:#999">Email</td><td style="padding:8px 12px"><a href="mailto:' + data.email + '" style="color:#D4A843">' + data.email + '</a></td></tr>'
    + '<tr><td style="padding:8px 12px;color:#999">Téléphone</td><td style="padding:8px 12px">' + data.telephone + '</td></tr>'
    + '<tr><td style="padding:8px 12px;color:#999">Date début</td><td style="padding:8px 12px">' + data.dateDebut + '</td></tr>'
    + '<tr><td style="padding:8px 12px;color:#999">Durée</td><td style="padding:8px 12px">' + data.duree + '</td></tr>'
    + '</table>'

    // Espaces réservés
    + '<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D4A843;margin-bottom:10px">Espaces sélectionnés</div>'
    + '<table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:6px;overflow:hidden">'
    + lignes
    + '<tr style="background:#D4A843">'
    + '<td style="padding:12px;font-weight:800;color:#000">TOTAL ESTIMÉ</td>'
    + '<td style="padding:12px;font-weight:800;color:#000;text-align:right;font-size:18px">' + data.total + ' HT</td>'
    + '</tr>'
    + '</table>'
    + '</div>'

    // Pied de page
    + '<div style="padding:16px 28px;background:#0a0a0a;text-align:center;font-size:11px;color:#555">'
    + 'Nostalgie CI · 101.1 FM · assistant.commercial@nostalgie.ci'
    + '</div>'
    + '</div>';
}

// ────────────────────────────────────────────────────────────────────
//  FONCTIONS DE TEST — à exécuter une fois pour autoriser les accès
// ────────────────────────────────────────────────────────────────────

// Exécuter cette fonction pour autoriser Google Sheets
function testAuthorisation() {
  var sheet = getSS_().getActiveSheet();
  sheet.appendRow(['TEST', 'Autorisation Sheets', 'OK', '', '', '', '', '']);
  Logger.log('Autorisation Google Sheets OK');
}

// Exécuter cette fonction pour autoriser l'envoi d'emails
function testEmail() {
  MailApp.sendEmail({
    to: 'nostalgiecotedivoire@gmail.com',
    subject: 'Test email — Nostalgie CI Réservations',
    body: 'Le système d\'envoi d\'emails fonctionne correctement.\nLes réservations publicitaires seront transmises à assistant.commercial@nostalgie.ci'
  });
  Logger.log('Email de test envoyé avec succès');
}

// ────────────────────────────────────────────────────────────────────
//  SAUVEGARDE AUTOMATIQUE — UNE SEULE copie complète du classeur (Actus,
//  Podcasts, Emissions, Top5, Auditeurs, Réservations, etc.), toujours au
//  même nom, dans un dossier Google Drive dédié. Chaque exécution remplace
//  la sauvegarde de la semaine précédente — jamais plus d'1 copie à la fois,
//  donc jamais plus de 2 versions du site en tout (le site actif + cette
//  unique sauvegarde).
//
//  Pour l'activer : dans l'éditeur Apps Script, cliquer sur l'icône
//  "Déclencheurs" (horloge) dans la barre latérale gauche, puis
//  "+ Ajouter un déclencheur" :
//    - Fonction à exécuter : backupSheetToBackups
//    - Source de l'événement : Basé sur le temps
//    - Type : Minuteur hebdomadaire (ou quotidien si préféré)
//  Enregistrer, puis autoriser l'accès à Google Drive quand demandé.
//
//  Pour que la sauvegarde apparaisse automatiquement sur l'ordinateur :
//  installer "Google Drive pour ordinateur" et se connecter avec le même
//  compte Google. Le dossier "Nostalgie CI - Sauvegardes" se synchronise
//  alors tout seul dans l'Explorateur de fichiers Windows.
// ────────────────────────────────────────────────────────────────────
function backupSheetToBackups() {
  var FOLDER_NAME = 'Nostalgie CI - Sauvegardes';
  var BACKUP_NAME = 'Nostalgie CI - Sauvegarde (semaine en cours)';

  var ss = getSS_();
  var file = DriveApp.getFileById(ss.getId());

  var folders = DriveApp.getFoldersByName(FOLDER_NAME);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);

  // Supprime l'ancienne sauvegarde avant d'en créer une nouvelle : il n'y
  // en a donc jamais qu'une seule à la fois dans le dossier.
  var anciennes = folder.getFilesByName(BACKUP_NAME);
  while (anciennes.hasNext()) {
    anciennes.next().setTrashed(true);
  }

  file.makeCopy(BACKUP_NAME, folder);

  Logger.log('Sauvegarde hebdomadaire mise à jour : ' + BACKUP_NAME);
}

// Exécuter cette fonction pour tester les notifications Telegram
function testTelegram() {
  var response = UrlFetchApp.fetch(
    'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage',
    {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: 5945808873, text: 'Test depuis Apps Script ✅' }),
      muteHttpExceptions: true
    }
  );
  Logger.log(response.getContentText());
}