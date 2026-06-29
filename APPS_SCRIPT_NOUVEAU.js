// ═══════════════════════════════════════════════════════════════════
//  NOSTALGIE CI — Google Apps Script v2
//  Gère : dédicaces ET réservations publicitaires
//  À coller intégralement dans script.google.com
// ═══════════════════════════════════════════════════════════════════

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
  return ContentService
    .createTextOutput('Nostalgie CI — OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getInteractions(videoId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
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
    var ss = SpreadsheetApp.getActiveSpreadsheet();
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
//  doPost — réception des formulaires (dédicaces, réservations, etc.)
// ────────────────────────────────────────────────────────────────────
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.type === 'newsletter') {
    return handleNewsletter(data);
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();

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
//  DÉDICACES → feuille principale + notification Telegram animateur
// ────────────────────────────────────────────────────────────────────

// ⚙️ TOKEN du bot @NostalgieCI_Dedicaces_bot (créé via @BotFather)
var TELEGRAM_BOT_TOKEN = '8511505107:AAGg62q4VBgSjMXEGkCCcexQ5suAHA92HQM';

// ⚙️ CONFIG ANIMATEURS — remplacer 0 par le vrai chat_id de chaque animateur
// Pour obtenir le chat_id : l'animateur envoie /start au bot,
// puis exécuter getTelegramChatIds() dans l'éditeur Apps Script.
var TELEGRAM_ANIMATEURS = {
  'Le Crazy Morning': { chatId: 5945808873 },
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
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();

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
    data.telephone,
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();

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
    data.telephone,
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();

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
    data.telephone,
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
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
