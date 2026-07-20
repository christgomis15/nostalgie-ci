// Génère le HTML de la newsletter hebdomadaire à partir des données saisies
// dans /admin/newsletter. Reprend fidèlement la mise en page de
// newsletter-template.html (mise en forme email compatible Outlook/Gmail,
// tout en tableaux). Les liens sociaux, fréquences FM et lien de
// désinscription sont fixes (ne changent pas d'une semaine à l'autre).

export interface NewsletterProgramme {
  titre: string
  horaire: string
  animateurs: string
  accroche: string
}

export interface NewsletterPodcast {
  titre: string
  duree: string
}

export interface NewsletterTop5Item {
  rang: number
  artiste: string
  titre: string
  genre: string
  trend: 'up' | 'down' | 'same' | 'new'
  delta?: number
}

export interface NewsletterPartenaire {
  nom: string
  logo: string
  lien: string
}

export interface NewsletterJeu {
  question: string
  lot: string
  partenaire: string
  lien: string
}

export interface NewsletterEvenement {
  mois: string
  jour: string
  nom: string
  lieu: string
  description: string
}

export interface NewsletterData {
  semaine: string
  uneImage: string
  uneRubrique: string
  uneTitre: string
  uneTexte: string
  uneLien: string
  programmes: NewsletterProgramme[]
  podcastAudio: NewsletterPodcast | null
  podcastVideo: NewsletterPodcast | null
  top5: NewsletterTop5Item[]
  coulissesNom: string
  coulissesTexte: string
  coulissesPhoto: string
  partenaire: NewsletterPartenaire | null
  jeu: NewsletterJeu | null
  agenda: NewsletterEvenement[]
}

const SOCIAL = {
  facebook: 'https://www.facebook.com/nostalgiecotedivoire',
  instagram: 'https://www.instagram.com/nostalgiecotedivoire',
  youtube: 'https://www.youtube.com/@nostalgiecotedivoire8471',
  tiktok: 'https://www.tiktok.com/@nostalgiecotedivoire',
}

const TREND_LABEL: Record<NewsletterTop5Item['trend'], string> = {
  up: '<span style="font-family:Arial,sans-serif;font-size:11px;color:#4CAF50;">&#8679; {delta}</span>',
  down: '<span style="font-family:Arial,sans-serif;font-size:11px;color:#E05A5A;">&#8681; {delta}</span>',
  same: '<span style="font-family:Arial,sans-serif;font-size:11px;color:#888;">&#8644; =</span>',
  new: '<span style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#D4A843;background:rgba(212,168,67,0.12);padding:4px 9px;border-radius:3px;border:1px solid rgba(212,168,67,0.25);">NOUVEAU</span>',
}

function esc(s: string) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function programmeCard(p: NewsletterProgramme, barColor: string) {
  return `
    <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:10px;border-radius:6px;overflow:hidden;border:1px solid #2A2A2A;">
      <tr>
        <td width="4" style="background:${barColor};font-size:0;">&nbsp;</td>
        <td style="background:#1E1E1E;padding:14px 16px;">
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#F5F0E8;">${esc(p.titre)}</div>
                <div style="font-family:Arial,sans-serif;font-size:11px;color:#666;margin-top:3px;">${esc(p.animateurs)}</div>
              </td>
              <td align="right" valign="top">
                <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;white-space:nowrap;">${esc(p.horaire)}</div>
              </td>
            </tr>
            <tr><td colspan="2" style="padding-top:10px;"><div style="font-family:Arial,sans-serif;font-size:12px;color:#BBAA99;line-height:1.6;">${esc(p.accroche)}</div></td></tr>
          </table>
        </td>
      </tr>
    </table>`
}

function top5Row(item: NewsletterTop5Item, isFirst: boolean) {
  const trendHtml = TREND_LABEL[item.trend].replace('{delta}', String(item.delta ?? ''))
  return `
    <table width="100%" cellspacing="0" cellpadding="0" style="border-bottom:1px solid #222;">
      <tr>
        <td style="padding:11px 0;">
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="44" valign="middle">
                <div class="chart-num" style="font-family:Georgia,serif;font-size:${isFirst ? 28 : 22}px;font-weight:900;color:${isFirst ? '#D4A843' : '#444'};line-height:1;">${String(item.rang).padStart(2, '0')}</div>
              </td>
              <td valign="middle" style="padding-left:12px;">
                <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#F5F0E8;">${esc(item.artiste)} — ${esc(item.titre)}</div>
                <div style="font-family:Arial,sans-serif;font-size:11px;color:#555;margin-top:2px;">${esc(item.genre)}</div>
              </td>
              <td align="right" valign="middle">${trendHtml}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
}

function podcastCard(label: string, badgeColor: string, badgeBg: string, icon: string, p: NewsletterPodcast | null) {
  if (!p) return ''
  return `
    <table width="100%" cellspacing="0" cellpadding="0" style="background:#1E1E1E;border:1px solid #2A2A2A;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:16px;">
          <div style="font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${badgeColor};background:${badgeBg};display:inline-block;padding:3px 8px;border-radius:3px;margin-bottom:8px;">${icon} ${label}</div>
          <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#F5F0E8;margin-bottom:5px;line-height:1.4;">${esc(p.titre)}</div>
          <div style="font-family:Arial,sans-serif;font-size:11px;color:#666;margin-bottom:14px;">${esc(p.duree)}</div>
          <a href="https://nostalgie-ci.vercel.app/podcasts" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;text-decoration:none;">&#9654; Écouter le replay &#8594;</a>
        </td>
      </tr>
    </table>`
}

function agendaRow(e: NewsletterEvenement, highlight: boolean) {
  return `
    <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:14px;">
      <tr>
        <td width="64" valign="top">
          <div style="background:${highlight ? '#D4A843' : '#1E1E1E'};border:${highlight ? 'none' : '1px solid #3A2E00'};border-radius:5px;padding:8px 6px;text-align:center;width:56px;">
            <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;color:${highlight ? '#000' : '#D4A843'};text-transform:uppercase;letter-spacing:1px;">${esc(e.mois)}</div>
            <div style="font-family:Georgia,serif;font-size:24px;font-weight:900;color:${highlight ? '#000' : '#D4A843'};line-height:1.1;">${esc(e.jour)}</div>
          </div>
        </td>
        <td style="padding-left:16px;vertical-align:middle;">
          <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#F5F0E8;">${esc(e.nom)}</div>
          <div style="font-family:Arial,sans-serif;font-size:12px;color:#666;margin-top:4px;">${esc(e.lieu)} · ${esc(e.description)}</div>
        </td>
      </tr>
    </table>`
}

export function buildNewsletterHtml(data: NewsletterData): string {
  const barColors = ['#D4A843', '#A07830', '#3A3A3A']

  const partenaireBlock = data.partenaire ? `
          <tr><td style="height:2px;background:#2A2A2A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>
          <tr>
            <td style="background:#0A0A0A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:28px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="background:#130F00;border:1px solid #3A2E00;border-radius:8px;">
                <tr>
                  <td style="padding:28px;text-align:center;">
                    <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:8px;">&#11088; PARTENAIRE DE LA SEMAINE</div>
                    <div style="font-family:Arial,sans-serif;font-size:12px;font-style:italic;color:#888;margin-bottom:16px;">Cette newsletter vous est présentée par</div>
                    <div style="font-family:Georgia,serif;font-size:22px;font-weight:900;color:#D4A843;margin-bottom:18px;">${esc(data.partenaire.nom)}</div>
                    ${data.partenaire.logo ? `<img src="${data.partenaire.logo}" alt="${esc(data.partenaire.nom)}" width="504" style="width:100%;max-width:504px;border-radius:5px;margin-bottom:22px;" />` : ''}
                    <table cellspacing="0" cellpadding="0" style="margin:0 auto;">
                      <tr><td bgcolor="#D4A843" style="border-radius:5px;"><a href="${data.partenaire.lien || '#'}" style="display:inline-block;padding:13px 36px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#000;text-decoration:none;letter-spacing:2.5px;text-transform:uppercase;">Découvrir l'offre &#8594;</a></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''

  const jeuBlock = data.jeu ? `
          <tr><td style="height:2px;background:#2A2A2A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>
          <tr>
            <td class="section-pad" style="background:#141414;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:30px 28px;text-align:center;">
              <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:14px;">JEU DE LA SEMAINE</div>
              <div style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#F5F0E8;line-height:1.25;margin-bottom:14px;">${esc(data.jeu.question)}</div>
              <p style="font-family:Arial,sans-serif;font-size:13px;color:#BBAA99;margin-bottom:8px;line-height:1.6;">À gagner : <strong style="color:#D4A843;">${esc(data.jeu.lot)}</strong></p>
              ${data.jeu.partenaire ? `<p style="font-family:Arial,sans-serif;font-size:11px;color:#555;margin-bottom:24px;">En partenariat avec <em>${esc(data.jeu.partenaire)}</em></p>` : ''}
              <table cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr><td bgcolor="#D4A843" style="border-radius:5px;"><a href="${data.jeu.lien || '#'}" style="display:inline-block;padding:13px 36px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#000;text-decoration:none;letter-spacing:2.5px;text-transform:uppercase;">Je participe &#8594;</a></td></tr>
              </table>
            </td>
          </tr>` : ''

  const agendaBlock = data.agenda.length ? `
          <tr><td style="height:2px;background:#2A2A2A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>
          <tr>
            <td class="section-pad" style="background:#111;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:30px 28px;">
              <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:6px;">AGENDA</div>
              <h2 style="font-family:Georgia,serif;font-size:22px;color:#F5F0E8;margin-bottom:22px;">Événements à venir</h2>
              ${data.agenda.map((e, i) => agendaRow(e, i === 0)).join('')}
            </td>
          </tr>` : ''

  const podcastsSection = (data.podcastAudio || data.podcastVideo) ? `
          <tr><td style="height:2px;background:#2A2A2A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>
          <tr>
            <td class="section-pad" style="background:#0A0A0A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:30px 28px;">
              <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:6px;">PODCASTS &amp; REPLAYS</div>
              <h2 style="font-family:Georgia,serif;font-size:22px;color:#F5F0E8;margin-bottom:22px;">À ne pas manquer</h2>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="col-half" width="48%" valign="top">${podcastCard('AUDIO', '#D4A843', 'rgba(212,168,67,0.1)', '&#127911;', data.podcastAudio)}</td>
                  <td width="4%">&nbsp;</td>
                  <td class="col-half col-half-right" width="48%" valign="top">${podcastCard('VIDÉO', '#A07830', 'rgba(160,120,48,0.1)', '&#127916;', data.podcastVideo)}</td>
                </tr>
              </table>
            </td>
          </tr>` : ''

  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Newsletter Nostalgie CI — Semaine du ${esc(data.semaine)}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; display: block; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-wrapper  { width: 100% !important; }
      .section-pad    { padding: 24px 18px !important; }
      .col-half       { width: 100% !important; display: block !important; padding: 0 0 12px 0 !important; }
      .col-half-right { padding-left: 0 !important; }
      .chart-num      { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0A0A0A">
    <tr>
      <td align="center" style="padding:24px 12px 32px;">
        <table class="email-wrapper" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:#0A0A0A;border:1px solid #2A2A2A;border-bottom:none;border-radius:10px 10px 0 0;overflow:hidden;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background:#D4A843;padding:7px 24px;">
                    <table width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#000;letter-spacing:2.5px;text-transform:uppercase;">Sérieusement Décalée · 101.1 FM</td>
                        <td align="right" style="font-family:Arial,sans-serif;font-size:10px;color:#000;opacity:0.7;">Semaine du ${esc(data.semaine)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding:44px 28px 36px;background:linear-gradient(180deg,#120E00 0%,#0A0A0A 100%);">
                    <div style="font-family:Georgia,'Times New Roman',Times,serif;font-size:58px;font-weight:900;color:#F5F0E8;letter-spacing:8px;line-height:1;">NOSTALGIE</div>
                    <div style="font-family:Georgia,'Times New Roman',Times,serif;font-size:13px;font-style:italic;color:#D4A843;letter-spacing:4px;margin-top:8px;">Côte d'Ivoire</div>
                    <table cellspacing="0" cellpadding="0" style="margin:24px auto 0;">
                      <tr><td width="40" style="height:1px;background:#2A2A2A;"></td><td width="8"></td><td style="width:6px;height:6px;background:#D4A843;border-radius:50%;"></td><td width="8"></td><td width="40" style="height:1px;background:#2A2A2A;"></td></tr>
                    </table>
                    <table cellspacing="0" cellpadding="0" style="margin:22px auto 0;">
                      <tr>
                        <td style="padding:0 5px;"><a href="${SOCIAL.facebook}" style="display:inline-block;background:#1E1E1E;border:1px solid #333;border-radius:4px;padding:7px 15px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;text-decoration:none;letter-spacing:1px;">Facebook</a></td>
                        <td style="padding:0 5px;"><a href="${SOCIAL.instagram}" style="display:inline-block;background:#1E1E1E;border:1px solid #333;border-radius:4px;padding:7px 15px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;text-decoration:none;letter-spacing:1px;">Instagram</a></td>
                        <td style="padding:0 5px;"><a href="${SOCIAL.youtube}" style="display:inline-block;background:#1E1E1E;border:1px solid #333;border-radius:4px;padding:7px 15px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;text-decoration:none;letter-spacing:1px;">YouTube</a></td>
                        <td style="padding:0 5px;"><a href="${SOCIAL.tiktok}" style="display:inline-block;background:#1E1E1E;border:1px solid #333;border-radius:4px;padding:7px 15px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;text-decoration:none;letter-spacing:1px;">TikTok</a></td>
                      </tr>
                    </table>
                    <table cellspacing="0" cellpadding="0" style="margin:22px auto 0;">
                      <tr><td align="center" bgcolor="#D4A843" style="border-radius:5px;"><a href="https://nostalgie-ci.vercel.app/live" style="display:inline-block;padding:13px 36px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#000;text-decoration:none;letter-spacing:2.5px;text-transform:uppercase;">&#9654; Écouter le Direct</a></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:3px;background:#D4A843;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>

          <tr>
            <td class="section-pad" style="background:#1A1A1A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:30px 28px;">
              <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:18px;">&#11088; À LA UNE</div>
              ${data.uneImage ? `<img src="${data.uneImage}" alt="${esc(data.uneTitre)}" width="544" style="width:100%;max-width:544px;border-radius:6px;margin-bottom:22px;" />` : ''}
              <div style="display:inline-block;background:rgba(212,168,67,0.12);border:1px solid rgba(212,168,67,0.3);border-radius:3px;padding:3px 10px;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#D4A843;margin-bottom:14px;">${esc(data.uneRubrique)}</div>
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:900;color:#F5F0E8;line-height:1.25;margin-bottom:14px;">${esc(data.uneTitre)}</h2>
              <p style="font-family:Arial,sans-serif;font-size:14px;color:#BBAA99;line-height:1.75;margin-bottom:22px;">${esc(data.uneTexte)}</p>
              ${data.uneLien ? `<a href="${data.uneLien}" style="display:inline-block;background:transparent;border:1px solid #D4A843;border-radius:4px;padding:10px 22px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">Lire la suite &#8594;</a>` : ''}
            </td>
          </tr>

          <tr><td style="height:2px;background:#2A2A2A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>

          <tr>
            <td class="section-pad" style="background:#111;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:30px 28px;">
              <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:6px;">PROGRAMMES</div>
              <h2 style="font-family:Georgia,serif;font-size:22px;color:#F5F0E8;margin-bottom:22px;">À ne pas rater cette semaine</h2>
              ${data.programmes.map((p, i) => programmeCard(p, barColors[i] ?? '#3A3A3A')).join('')}
              <a href="https://nostalgie-ci.vercel.app/emissions" style="font-family:Arial,sans-serif;font-size:12px;color:#D4A843;text-decoration:none;letter-spacing:1px;">&#8594; Voir la grille complète des programmes</a>
            </td>
          </tr>
${podcastsSection}
          <tr><td style="height:2px;background:#2A2A2A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>

          <tr>
            <td class="section-pad" style="background:#141414;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:30px 28px;">
              <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:6px;">TOP CHARTS</div>
              <h2 style="font-family:Georgia,serif;font-size:22px;color:#F5F0E8;margin-bottom:4px;">Top 5 de la semaine</h2>
              <p style="font-family:Arial,sans-serif;font-size:12px;color:#555;margin-bottom:22px;">Zouglou · Coupé-Décalé · Afrobeats</p>
              ${data.top5.map((t, i) => top5Row(t, i === 0)).join('')}
              <a href="https://nostalgie-ci.vercel.app" style="font-family:Arial,sans-serif;font-size:12px;color:#D4A843;text-decoration:none;letter-spacing:1px;">&#8594; Écouter la webradio en continu</a>
            </td>
          </tr>

          <tr><td style="height:2px;background:#2A2A2A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>

          <tr>
            <td class="section-pad" style="background:#1A1A1A;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;padding:30px 28px;">
              <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4A843;margin-bottom:20px;">COULISSES DE LA STATION</div>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="96" valign="top" style="padding-right:20px;">
                    ${data.coulissesPhoto
                      ? `<img src="${data.coulissesPhoto}" alt="${esc(data.coulissesNom)}" width="90" height="90" style="width:90px;height:90px;border-radius:50%;border:2px solid #D4A843;object-fit:cover;" />`
                      : `<div style="width:90px;height:90px;border-radius:50%;background:#2A2A2A;border:2px solid #D4A843;"></div>`}
                  </td>
                  <td valign="top">
                    <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#D4A843;margin-bottom:5px;">Portrait · Animateur</div>
                    <h3 style="font-family:Georgia,serif;font-size:19px;font-weight:900;color:#F5F0E8;margin-bottom:10px;">${esc(data.coulissesNom)}</h3>
                    <p style="font-family:Arial,sans-serif;font-size:13px;color:#BBAA99;line-height:1.7;margin-bottom:14px;">${esc(data.coulissesTexte)}</p>
                    <a href="https://nostalgie-ci.vercel.app/emissions" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#D4A843;text-decoration:none;letter-spacing:1px;">&#8594; Découvrir ses émissions</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
${partenaireBlock}
${jeuBlock}
${agendaBlock}

          <tr><td style="height:3px;background:linear-gradient(90deg,#A07830,#D4A843,#A07830);border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;"></td></tr>

          <tr>
            <td style="background:#111;border-left:1px solid #2A2A2A;border-right:1px solid #2A2A2A;border-bottom:1px solid #2A2A2A;border-radius:0 0 10px 10px;padding:36px 28px 28px;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;border-bottom:1px solid #222;">
                    <div style="font-family:Georgia,serif;font-size:30px;font-weight:900;color:#D4A843;letter-spacing:5px;">NOSTALGIE CI</div>
                    <div style="font-family:Arial,sans-serif;font-size:11px;font-style:italic;color:#BBAA99;margin-top:5px;letter-spacing:1px;">Sérieusement Décalée</div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:18px 0;border-bottom:1px solid #222;">
                    <a href="${SOCIAL.facebook}" style="font-family:Arial,sans-serif;font-size:11px;color:#D4A843;text-decoration:none;margin:0 10px;">Facebook</a>
                    <span style="color:#888;">&bull;</span>
                    <a href="${SOCIAL.instagram}" style="font-family:Arial,sans-serif;font-size:11px;color:#D4A843;text-decoration:none;margin:0 10px;">Instagram</a>
                    <span style="color:#888;">&bull;</span>
                    <a href="${SOCIAL.youtube}" style="font-family:Arial,sans-serif;font-size:11px;color:#D4A843;text-decoration:none;margin:0 10px;">YouTube</a>
                    <span style="color:#888;">&bull;</span>
                    <a href="https://nostalgie-ci.vercel.app" style="font-family:Arial,sans-serif;font-size:11px;color:#D4A843;text-decoration:none;margin:0 10px;">nostalgie.ci</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:18px 0;border-bottom:1px solid #222;">
                    <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#F5F0E8;margin-bottom:10px;">Nos fréquences FM</div>
                    <div style="font-family:Arial,sans-serif;font-size:11px;color:#BBAA99;line-height:2;">
                      <strong style="color:#D4A843;">101.1</strong> Abidjan &nbsp;&bull;&nbsp;
                      <strong style="color:#D4A843;">106.5</strong> Bouaké &nbsp;&bull;&nbsp;
                      <strong style="color:#D4A843;">92.8</strong> Yamoussoukro &nbsp;&bull;&nbsp;
                      <strong style="color:#D4A843;">97.3</strong> San-Pédro<br>
                      <strong style="color:#D4A843;">98.3</strong> Daloa &nbsp;&bull;&nbsp;
                      <strong style="color:#D4A843;">91.7</strong> Korhogo &nbsp;&bull;&nbsp;
                      <strong style="color:#D4A843;">87.9</strong> Abengourou
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:18px;">
                    <p style="font-family:Arial,sans-serif;font-size:11px;color:#BBAA99;line-height:1.8;margin:0;">
                      Vous recevez cet email car vous êtes inscrit(e) sur nostalgie.ci<br>
                      Radio Nostalgie CI · Abidjan, Côte d'Ivoire<br>
                      <a href="{unsubscribe}" style="color:#BBAA99;text-decoration:underline;">Se désinscrire</a>
                      &nbsp;&bull;&nbsp;
                      <a href="https://nostalgie-ci.vercel.app" style="color:#BBAA99;text-decoration:underline;">Voir la version en ligne</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
