// ═══════════════════════════════════════════════════════════════════
//  NOSTALGIE CI — Google Apps Script v2
//  Gère : dédicaces ET réservations publicitaires
//  À coller intégralement dans script.google.com
// ═══════════════════════════════════════════════════════════════════

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.type === 'reservation') {
    return handleReservation(data);
  }
  return handleDedicace(data);
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
