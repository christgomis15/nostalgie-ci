// ═══════════════════════════════════════════════════════════════════
//  NOSTALGIE CI — Google Apps Script v2
//  Gère : dédicaces ET réservations publicitaires
//  À coller intégralement dans script.google.com
// ═══════════════════════════════════════════════════════════════════

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
  return handleDedicace(data);
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
//  DÉDICACES → feuille principale (première feuille)
// ────────────────────────────────────────────────────────────────────
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
