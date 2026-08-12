'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'
import type { NewsletterData, NewsletterTop5Item } from '@/lib/newsletter-template'
import { buildNewsletterHtml } from '@/lib/newsletter-template'

interface Emission { title: string; tag: string; schedule: string; animateurs: string; img: string }
interface PodcastItem { titre: string; date: string; duree?: string | null }
interface Top5ApiItem { rang: number; artiste: string; titre: string; passages: number }

function pad(n: number) { return String(n).padStart(2, '0') }
function defaultScheduleValue() {
  const d = new Date()
  const day = d.getDay()
  const diff = (5 - day + 7) % 7
  d.setDate(d.getDate() + diff)
  d.setHours(8, 0, 0, 0)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T08:00`
}

const EMPTY_PROGRAMME = { emissionIndex: -1, accroche: '' }
const EMPTY_EVENEMENT = { mois: '', jour: '', nom: '', lieu: '', description: '' }

export default function AdminNewsletter() {
  const [loadingData, setLoadingData] = useState(true)
  const [emissions, setEmissions] = useState<Emission[]>([])
  const [top5Api, setTop5Api] = useState<Top5ApiItem[]>([])
  const [prevTop5, setPrevTop5] = useState<Top5ApiItem[]>([])
  const [podcastAudioApi, setPodcastAudioApi] = useState<PodcastItem | null>(null)
  const [podcastVideoApi, setPodcastVideoApi] = useState<PodcastItem | null>(null)

  const [semaine, setSemaine] = useState('')
  const [subject, setSubject] = useState('Nostalgie CI — Vos programmes de la semaine')
  const [previewText, setPreviewText] = useState('Top charts, émissions phares, coulisses et plus encore..')

  const [uneImage, setUneImage] = useState('')
  const [uneRubrique, setUneRubrique] = useState('')
  const [uneTitre, setUneTitre] = useState('')
  const [uneTexte, setUneTexte] = useState('')
  const [uneLien, setUneLien] = useState('')

  const [programmes, setProgrammes] = useState([{ ...EMPTY_PROGRAMME }, { ...EMPTY_PROGRAMME }, { ...EMPTY_PROGRAMME }])
  const [genres, setGenres] = useState<string[]>(['', '', '', '', ''])

  const [coulissesNom, setCoulissesNom] = useState('')
  const [coulissesTexte, setCoulissesTexte] = useState('')
  const [coulissesPhoto, setCoulissesPhoto] = useState('')

  const [includePartenaire, setIncludePartenaire] = useState(false)
  const [partNom, setPartNom] = useState('')
  const [partLogo, setPartLogo] = useState('')
  const [partLien, setPartLien] = useState('')

  const [includeJeu, setIncludeJeu] = useState(false)
  const [jeuQuestion, setJeuQuestion] = useState('')
  const [jeuLot, setJeuLot] = useState('')
  const [jeuPartenaire, setJeuPartenaire] = useState('')
  const [jeuLien, setJeuLien] = useState('')

  const [agenda, setAgenda] = useState([{ ...EMPTY_EVENEMENT }, { ...EMPTY_EVENEMENT }])

  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('schedule')
  const [scheduledAt, setScheduledAt] = useState(defaultScheduleValue())

  const [showPreview, setShowPreview] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/emissions', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ emissions: [] })),
      fetch('/api/top5', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ items: [] })),
      fetch('/api/podcasts', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ podcasts: [], audio: [], video: [] })),
    ]).then(([em, t5, pc]) => {
      setEmissions(em.emissions || [])
      setTop5Api(t5.items || [])
      setPodcastAudioApi(pc.audio?.[0] || pc.podcasts?.[0] || null)
      setPodcastVideoApi(pc.video?.[0] || null)
      setProgrammes([
        { emissionIndex: 0, accroche: '' },
        { emissionIndex: Math.min(1, (em.emissions?.length || 1) - 1), accroche: '' },
        { emissionIndex: Math.min(2, (em.emissions?.length || 1) - 1), accroche: '' },
      ])
    }).finally(() => setLoadingData(false))

    const end = new Date()
    end.setDate(end.getDate() - 1)
    const start = new Date()
    start.setDate(start.getDate() - 14)
    const iso = (d: Date) => d.toISOString().slice(0, 10)
    fetch(`/api/admin/top5-archive?start=${iso(start)}&end=${iso(end)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setPrevTop5(d.items || []))
      .catch(() => setPrevTop5([]))
  }, [])

  const top5WithTrend: NewsletterTop5Item[] = useMemo(() => {
    return top5Api.map((item, i) => {
      const key = (item.artiste + item.titre).toLowerCase().replace(/\s+/g, '')
      const prevIdx = prevTop5.findIndex(p => (p.artiste + p.titre).toLowerCase().replace(/\s+/g, '') === key)
      let trend: NewsletterTop5Item['trend'] = 'new'
      let delta: number | undefined
      if (prevIdx !== -1) {
        const prevRang = prevTop5[prevIdx].rang
        if (prevRang === item.rang) trend = 'same'
        else if (prevRang > item.rang) { trend = 'up'; delta = prevRang - item.rang }
        else { trend = 'down'; delta = item.rang - prevRang }
      }
      return { rang: item.rang, artiste: item.artiste, titre: item.titre, genre: genres[i] || '', trend, delta }
    })
  }, [top5Api, prevTop5, genres])

  function buildData(): NewsletterData {
    return {
      semaine,
      uneImage, uneRubrique, uneTitre, uneTexte, uneLien,
      programmes: programmes.map(p => {
        const em = emissions[p.emissionIndex]
        return { titre: em?.title || '', horaire: em?.schedule || '', animateurs: em?.animateurs || '', accroche: p.accroche }
      }),
      podcastAudio: podcastAudioApi ? { titre: podcastAudioApi.titre, duree: podcastAudioApi.duree || '' } : null,
      podcastVideo: podcastVideoApi ? { titre: podcastVideoApi.titre, duree: podcastVideoApi.duree || '' } : null,
      top5: top5WithTrend,
      coulissesNom, coulissesTexte, coulissesPhoto,
      partenaire: includePartenaire ? { nom: partNom, logo: partLogo, lien: partLien } : null,
      jeu: includeJeu ? { question: jeuQuestion, lot: jeuLot, partenaire: jeuPartenaire, lien: jeuLien } : null,
      agenda: agenda.filter(e => e.nom.trim()),
    }
  }

  const previewHtml = useMemo(() => (showPreview ? buildNewsletterHtml(buildData()) : ''), [showPreview]) // eslint-disable-line react-hooks/exhaustive-deps

  async function submit() {
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: buildData(),
          subject,
          previewText,
          sendMode,
          scheduledAt: sendMode === 'schedule' ? new Date(scheduledAt).toISOString() : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setStatus('ok')
      setMsg(sendMode === 'now' ? 'Newsletter envoyée !' : `Newsletter programmée pour le ${new Date(scheduledAt).toLocaleString('fr-FR')}.`)
    } catch (err) {
      setStatus('error')
      setMsg(err instanceof Error ? err.message : 'Erreur lors de l’envoi')
    }
  }

  function updateProgramme(i: number, patch: Partial<typeof EMPTY_PROGRAMME>) {
    setProgrammes(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p))
  }
  function updateAgenda(i: number, patch: Partial<typeof EMPTY_EVENEMENT>) {
    setAgenda(prev => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e))
  }
  function updateGenre(i: number, v: string) {
    setGenres(prev => prev.map((g, idx) => idx === i ? v : g))
  }

  return (
    <section className="page-section">
      <div className="admin-bar">
        <div>
          <Link href="/admin" className="admin-back">← Administration</Link>
          <h1 className="section-title" style={{ marginTop: 6 }}>Newsletter</h1>
        </div>
      </div>
      <p className="sub" style={{ marginBottom: 20 }}>
        Remplis les rubriques ci-dessous, puis envoie ou programme directement l&apos;envoi via Brevo — aucune étape manuelle supplémentaire.
      </p>

      {loadingData ? <p className="admin-empty">Chargement des données du site…</p> : (
        <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div className="admin-panel" style={{ position: 'static' }}>
            <h3>Informations générales</h3>
            <div className="form-group"><label>Semaine</label><input type="text" placeholder="13 – 19 juillet 2026" value={semaine} onChange={e => setSemaine(e.target.value)} required /></div>
            <div className="form-group"><label>Objet de l&apos;email</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} required /></div>
            <div className="form-group"><label>Texte d&apos;aperçu (preheader)</label><input type="text" value={previewText} onChange={e => setPreviewText(e.target.value)} /></div>
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <h3>À la une</h3>
            <ImageUploader value={uneImage} onChange={setUneImage} label="Photo (paysage, ~544×200)" />
            <div className="form-group"><label>Rubrique</label><input type="text" placeholder="WC2026, Musique, Actu CI…" value={uneRubrique} onChange={e => setUneRubrique(e.target.value)} /></div>
            <div className="form-group"><label>Titre accrocheur</label><input type="text" value={uneTitre} onChange={e => setUneTitre(e.target.value)} /></div>
            <div className="form-group"><label>Texte (2-3 lignes)</label><textarea rows={3} value={uneTexte} onChange={e => setUneTexte(e.target.value)} /></div>
            <div className="form-group"><label>Lien "Lire la suite" (optionnel)</label><input type="text" placeholder="https://www.nostalgie.ci/actus" value={uneLien} onChange={e => setUneLien(e.target.value)} /></div>
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <h3>Programmes à la une (3 émissions)</h3>
            <p className="sub">Émission, horaire et animateurs sont repris automatiquement depuis la grille — écris juste une accroche pour chacune.</p>
            {programmes.map((p, i) => (
              <div key={i} className="form-row" style={{ marginBottom: 10 }}>
                <div className="form-group">
                  <label>Émission {i + 1}</label>
                  <select value={p.emissionIndex} onChange={e => updateProgramme(i, { emissionIndex: Number(e.target.value) })}>
                    {emissions.map((em, idx) => <option key={em.title} value={idx}>{em.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Accroche de la semaine</label>
                  <input type="text" placeholder="Invité spécial ? Défi ? Thème particulier ?" value={p.accroche} onChange={e => updateProgramme(i, { accroche: e.target.value })} />
                </div>
              </div>
            ))}
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <h3>Top 5 de la semaine</h3>
            <p className="sub">Classement et titres repris automatiquement — précise juste le genre de chaque titre.</p>
            {top5WithTrend.length === 0 ? <p className="admin-empty">Aucun Top 5 disponible.</p> : top5WithTrend.map((t, i) => (
              <div key={t.rang} className="form-group" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: 'var(--or)', fontWeight: 700, width: 24 }}>#{t.rang}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{t.artiste} — {t.titre} <em style={{ opacity: 0.5 }}>({t.trend}{t.delta ? ` ${t.delta}` : ''})</em></span>
                <input type="text" placeholder="Genre (Afrobeats…)" style={{ maxWidth: 160 }} value={genres[i] || ''} onChange={e => updateGenre(i, e.target.value)} />
              </div>
            ))}
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <h3>Coulisses — portrait animateur</h3>
            <ImageUploader value={coulissesPhoto} onChange={setCoulissesPhoto} label="Photo (portrait/carré)" />
            <div className="form-group"><label>Prénom Nom</label><input type="text" value={coulissesNom} onChange={e => setCoulissesNom(e.target.value)} /></div>
            <div className="form-group"><label>Anecdote / coulisse (2-3 lignes)</label><textarea rows={3} value={coulissesTexte} onChange={e => setCoulissesTexte(e.target.value)} /></div>
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: includePartenaire ? 14 : 0 }}>
              <input type="checkbox" checked={includePartenaire} onChange={e => setIncludePartenaire(e.target.checked)} />
              <span style={{ fontWeight: 700 }}>Inclure un partenaire de la semaine</span>
            </label>
            {includePartenaire && <>
              <div className="form-group"><label>Nom du partenaire</label><input type="text" value={partNom} onChange={e => setPartNom(e.target.value)} /></div>
              <ImageUploader value={partLogo} onChange={setPartLogo} label="Logo / visuel (paysage)" />
              <div className="form-group"><label>Lien de l&apos;offre</label><input type="text" value={partLien} onChange={e => setPartLien(e.target.value)} /></div>
            </>}
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: includeJeu ? 14 : 0 }}>
              <input type="checkbox" checked={includeJeu} onChange={e => setIncludeJeu(e.target.checked)} />
              <span style={{ fontWeight: 700 }}>Inclure un jeu / concours</span>
            </label>
            {includeJeu && <>
              <div className="form-group"><label>Question / défi</label><input type="text" value={jeuQuestion} onChange={e => setJeuQuestion(e.target.value)} /></div>
              <div className="form-group"><label>Lot à gagner</label><input type="text" value={jeuLot} onChange={e => setJeuLot(e.target.value)} /></div>
              <div className="form-group"><label>Partenaire (optionnel)</label><input type="text" value={jeuPartenaire} onChange={e => setJeuPartenaire(e.target.value)} /></div>
              <div className="form-group"><label>Lien de participation</label><input type="text" value={jeuLien} onChange={e => setJeuLien(e.target.value)} /></div>
            </>}
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <h3>Agenda (jusqu&apos;à 2 événements)</h3>
            {agenda.map((e, i) => (
              <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i === 0 ? '1px solid var(--g3, #2A2A2A)' : 'none' }}>
                <div className="form-row">
                  <div className="form-group"><label>Mois</label><input type="text" placeholder="JUIL" value={e.mois} onChange={ev => updateAgenda(i, { mois: ev.target.value })} /></div>
                  <div className="form-group"><label>Jour</label><input type="text" placeholder="25" value={e.jour} onChange={ev => updateAgenda(i, { jour: ev.target.value })} /></div>
                </div>
                <div className="form-group"><label>Nom de l&apos;événement</label><input type="text" value={e.nom} onChange={ev => updateAgenda(i, { nom: ev.target.value })} /></div>
                <div className="form-row">
                  <div className="form-group"><label>Lieu</label><input type="text" value={e.lieu} onChange={ev => updateAgenda(i, { lieu: ev.target.value })} /></div>
                  <div className="form-group"><label>Description (1 ligne)</label><input type="text" value={e.description} onChange={ev => updateAgenda(i, { description: ev.target.value })} /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-panel" style={{ position: 'static' }}>
            <h3>Envoi</h3>
            <div className="form-group">
              <label>Mode</label>
              <select value={sendMode} onChange={e => setSendMode(e.target.value as 'now' | 'schedule')}>
                <option value="schedule">Programmer l&apos;envoi</option>
                <option value="now">Envoyer immédiatement</option>
              </select>
            </div>
            {sendMode === 'schedule' && (
              <div className="form-group">
                <label>Date et heure d&apos;envoi</label>
                <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
              </div>
            )}

            <button type="button" className="btn btn-outline" style={{ width: '100%', marginBottom: 10 }} onClick={() => setShowPreview(s => !s)}>
              {showPreview ? 'Masquer l’aperçu' : 'Voir l’aperçu'}
            </button>

            {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

            <button type="button" className="btn btn-or" disabled={status === 'saving' || !semaine} style={{ width: '100%' }} onClick={submit}>
              {status === 'saving' ? 'Envoi…' : sendMode === 'now' ? 'Envoyer maintenant' : 'Programmer l’envoi'}
            </button>
          </div>

          {showPreview && (
            <div className="admin-panel" style={{ position: 'static', padding: 0, overflow: 'hidden' }}>
              <iframe title="Aperçu newsletter" srcDoc={previewHtml} style={{ width: '100%', height: 900, border: 'none', background: '#0A0A0A' }} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
