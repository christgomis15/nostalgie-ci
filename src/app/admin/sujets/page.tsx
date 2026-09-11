'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'
import { useEmissions } from '@/hooks/useEmissions'

interface Sujet {
  titre: string
  emission: string
  question: string
  img: string
  date: string
}

const EMPTY = { titre: '', emission: '', question: '', img: '', date: '' }

function todayFr() {
  return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AdminSujets() {
  const emissions = useEmissions()
  const [sujets, setSujets] = useState<Sujet[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...EMPTY, date: todayFr() })
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function load() {
    setLoading(true)
    fetch('/api/sujets', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setSujets(data.sujets || []))
      .catch(() => setSujets([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/sujets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) throw new Error(data?.error || 'Erreur')
      setStatus('ok')
      setMsg('Sujet publié. Il apparaît sur /sujets sous quelques minutes.')
      setForm({ ...EMPTY, date: todayFr() })
      load()
    } catch (err) {
      setStatus('error')
      setMsg(err instanceof Error ? err.message : "Erreur lors de l'ajout")
    }
  }

  async function remove(titre: string) {
    if (!confirm(`Retirer le sujet « ${titre} » ?`)) return
    try {
      const res = await fetch('/api/admin/sujets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre }),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) throw new Error(data?.error || 'Erreur')
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
          <h1 className="section-title" style={{ marginTop: 6 }}>Sujets du jour</h1>
        </div>
      </div>
      <p className="sub" style={{ marginBottom: 20 }}>
        Postez un sujet pour que les auditeurs réagissent directement sur www.nostalgie.ci/sujets
        (J&apos;aime + commentaires, sans passer par Facebook).
      </p>

      <div className="admin-layout">
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>
            Sujets en ligne ({sujets.length})
          </h3>
          {loading ? (
            <p className="admin-empty">Chargement…</p>
          ) : sujets.length === 0 ? (
            <p className="admin-empty">Aucun sujet.</p>
          ) : (
            <div className="admin-list">
              {sujets.map(s => (
                <div key={s.titre} className="admin-row">
                  {s.img && (
                    <img src={s.img} alt="" onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
                  )}
                  <div className="admin-row-info">
                    <p className="admin-row-tag">{s.emission || 'Général'}</p>
                    <p className="admin-row-title">{s.titre}</p>
                    <p className="admin-row-sub">{s.date}</p>
                  </div>
                  <button className="admin-row-del" onClick={() => remove(s.titre)}>Retirer</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h3>Publier un sujet</h3>
          <p className="sub">Un titre par sujet — inutile de republier deux fois le même titre.</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Titre</label>
              <input
                type="text"
                placeholder="Ex : Faut-il interdire les klaxons intempestifs ?"
                value={form.titre}
                onChange={e => setForm({ ...form, titre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Émission concernée (optionnel)</label>
              <select value={form.emission} onChange={e => setForm({ ...form, emission: e.target.value })}>
                <option value="">Général — toutes émissions</option>
                {emissions.map(em => (
                  <option key={em.title} value={em.title.trim()}>{em.title.trim()}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Le sujet, en détail</label>
              <textarea
                rows={4}
                placeholder="Décrivez le sujet du jour pour donner envie de réagir…"
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
                required
              />
            </div>
            <ImageUploader value={form.img} onChange={url => setForm({ ...form, img: url })} label="Photo (optionnel)" />
            <div className="form-group">
              <label>Date</label>
              <input type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>

            {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

            <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 6 }}>
              {status === 'saving' ? 'Publication…' : 'Publier le sujet'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
