'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'

interface ContentItem {
  id: number
  youtubeId: string
  titre: string
  emission: string
  date: string
  duree?: string | null
  description?: string | null
}
interface PodcastsData { podcasts: ContentItem[]; audio: ContentItem[]; video: ContentItem[] }

const TYPES = [
  { value: 'podcast', label: 'Podcast exclusif' },
  { value: 'audio', label: 'Replay Audio' },
  { value: 'video', label: 'Replay Vidéo' },
]

const EMPTY = { type: 'podcast', youtube: '', titre: '', emission: '', date: '', duree: '', description: '' }

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/default.jpg`
}

export default function AdminPodcasts() {
  const [data, setData] = useState<PodcastsData>({ podcasts: [], audio: [], video: [] })
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function load() {
    setLoading(true)
    fetch('/api/podcasts', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setData({ podcasts: d.podcasts || [], audio: d.audio || [], video: d.video || [] }))
      .catch(() => setData({ podcasts: [], audio: [], video: [] }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const all = [
    ...data.podcasts.map(i => ({ ...i, type: 'podcast' })),
    ...data.audio.map(i => ({ ...i, type: 'audio' })),
    ...data.video.map(i => ({ ...i, type: 'video' })),
  ]

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Erreur')
      setStatus('ok')
      setMsg('Épisode ajouté. Il apparaîtra sur le site sous quelques minutes.')
      setForm(EMPTY)
      load()
    } catch (err) {
      setStatus('error')
      setMsg(err instanceof Error ? err.message : "Erreur lors de l'ajout")
    }
  }

  async function remove(type: string, titre: string) {
    if (!confirm(`Retirer « ${titre} » ?`)) return
    try {
      await fetch('/api/admin/podcasts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, titre }),
      })
      load()
    } catch {
      alert('Échec de la suppression.')
    }
  }

  return (
    <section className="page-section">
      <div className="admin-bar">
        <div>
          <Link href="/admin" className="admin-back">← Administration</Link>
          <h1 className="section-title" style={{ marginTop: 6 }}>Podcasts &amp; Replays</h1>
        </div>
      </div>

      <div className="admin-layout">
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>
            Épisodes en ligne ({all.length})
          </h3>
          {loading ? (
            <p className="admin-empty">Chargement…</p>
          ) : all.length === 0 ? (
            <p className="admin-empty">Aucun épisode.</p>
          ) : (
            <div className="admin-list">
              {all.map(i => (
                <div key={i.type + i.titre} className="admin-row">
                  <img src={ytThumb(i.youtubeId)} alt="" />
                  <div className="admin-row-info">
                    <p className="admin-row-tag">{TYPES.find(t => t.value === i.type)?.label} · {i.emission}</p>
                    <p className="admin-row-title">{i.titre}</p>
                    <p className="admin-row-sub">{i.date}</p>
                  </div>
                  <button className="admin-row-del" onClick={() => remove(i.type, i.titre)}>Retirer</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h3>Ajouter un épisode</h3>
          <p className="sub">La vignette est générée automatiquement depuis le lien YouTube.</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Lien YouTube</label>
              <input type="text" placeholder="https://youtube.com/watch?v=…" value={form.youtube} onChange={e => setForm({ ...form, youtube: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Titre</label>
              <input type="text" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Émission</label>
              <input type="text" placeholder="Le Crazy Morning" value={form.emission} onChange={e => setForm({ ...form, emission: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="text" placeholder="9 juillet 2026" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Durée (optionnel)</label>
              <input type="text" placeholder="12 min" value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description (optionnel)</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

            <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 6 }}>
              {status === 'saving' ? 'Envoi…' : "Publier l'épisode"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
