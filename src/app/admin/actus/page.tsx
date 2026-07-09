'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'

interface Article {
  tab: string
  cat: string
  img: string
  title: string
  excerpt: string
  date: string
  body: string
  video?: string | null
  images?: string[] | null
  imgPosition?: string | null
}

const TABS = [
  { value: 'locale', label: 'Actu Locale' },
  { value: 'internationale', label: 'Actu Internationale' },
  { value: 'events', label: 'Events Nostalgie' },
  { value: 'potins', label: 'Potins & Gbairais' },
]

const EMPTY = {
  tab: 'locale', cat: '', img: '', title: '', excerpt: '', date: '', body: '', video: '', imgPosition: '',
}

export default function AdminActus() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function load() {
    setLoading(true)
    fetch('/api/actus', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/actus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setStatus('ok')
      setMsg('Article ajouté. Il apparaîtra sur le site sous quelques minutes.')
      setForm(EMPTY)
      load()
    } catch (err) {
      setStatus('error')
      setMsg(err instanceof Error ? err.message : 'Erreur lors de l’ajout')
    }
  }

  async function remove(title: string) {
    if (!confirm(`Retirer l'article « ${title} » ?`)) return
    try {
      await fetch('/api/admin/actus', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
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
          <h1 className="section-title" style={{ marginTop: 6 }}>Actus</h1>
        </div>
      </div>

      <div className="admin-layout">
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>
            Articles en ligne ({articles.length})
          </h3>
          {loading ? (
            <p className="admin-empty">Chargement…</p>
          ) : articles.length === 0 ? (
            <p className="admin-empty">Aucun article.</p>
          ) : (
            <div className="admin-list">
              {articles.map(a => (
                <div key={a.title} className="admin-row">
                  <img src={a.img} alt="" onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
                  <div className="admin-row-info">
                    <p className="admin-row-tag">{TABS.find(t => t.value === a.tab)?.label || a.tab} · {a.cat}</p>
                    <p className="admin-row-title">{a.title}</p>
                    <p className="admin-row-sub">{a.date}</p>
                  </div>
                  <button className="admin-row-del" onClick={() => remove(a.title)}>Retirer</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h3>Ajouter un article</h3>
          <p className="sub">Apparaît sur le site sous 5 minutes environ.</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Onglet</label>
              <select value={form.tab} onChange={e => setForm({ ...form, tab: e.target.value })} required>
                {TABS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <input type="text" placeholder="Rap Ivoire" value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} required />
            </div>
            <ImageUploader value={form.img} onChange={url => setForm({ ...form, img: url })} label="Photo principale" />
            <div className="form-group">
              <label>Titre</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Résumé</label>
              <input type="text" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="text" placeholder="9 juillet 2026" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Texte (laissez une ligne vide entre les paragraphes)</label>
              <textarea rows={7} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Vidéo YouTube (optionnel — remplace la photo)</label>
              <input type="text" placeholder="https://youtube.com/watch?v=…" value={form.video} onChange={e => setForm({ ...form, video: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Cadrage photo (optionnel, si tête coupée)</label>
              <input type="text" placeholder="center 20%" value={form.imgPosition} onChange={e => setForm({ ...form, imgPosition: e.target.value })} />
            </div>

            {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

            <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 6 }}>
              {status === 'saving' ? 'Envoi…' : "Publier l'article"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
