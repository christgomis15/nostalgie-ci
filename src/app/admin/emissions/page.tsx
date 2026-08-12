'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'

interface Emission {
  title: string
  tag: string
  schedule: string
  animateurs: string
  img: string
}

const EMPTY: Emission = { title: '', tag: '', schedule: '', animateurs: '', img: '' }

export default function AdminEmissions() {
  const [emissions, setEmissions] = useState<Emission[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function load() {
    setLoading(true)
    fetch('/api/emissions', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setEmissions(data.emissions || []))
      .catch(() => setEmissions([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/emissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) throw new Error(data?.error || 'Erreur')
      setStatus('ok')
      setMsg('Émission ajoutée. Elle apparaîtra sur le site sous quelques minutes.')
      setForm(EMPTY)
      load()
    } catch (err) {
      setStatus('error')
      setMsg(err instanceof Error ? err.message : "Erreur lors de l'ajout")
    }
  }

  async function remove(title: string) {
    if (!confirm(`Retirer l'émission « ${title} » ?`)) return
    try {
      const res = await fetch('/api/admin/emissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
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
          <h1 className="section-title" style={{ marginTop: 6 }}>Émissions</h1>
        </div>
      </div>

      <div className="admin-layout">
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>
            Émissions en ligne ({emissions.length})
          </h3>
          {loading ? (
            <p className="admin-empty">Chargement…</p>
          ) : emissions.length === 0 ? (
            <p className="admin-empty">Aucune émission.</p>
          ) : (
            <div className="admin-list">
              {emissions.map(em => (
                <div key={em.title} className="admin-row">
                  <img src={em.img} alt="" onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
                  <div className="admin-row-info">
                    <p className="admin-row-tag">{em.tag} · {em.schedule}</p>
                    <p className="admin-row-title">{em.title}</p>
                    <p className="admin-row-sub">{em.animateurs}</p>
                  </div>
                  <button className="admin-row-del" onClick={() => remove(em.title)}>Retirer</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h3>Ajouter une émission</h3>
          <p className="sub">Apparaît sur le site sous 5 minutes environ.</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Titre</label>
              <input type="text" placeholder="Le Crazy Morning" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Tag</label>
              <input type="text" placeholder="Matin" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Horaire</label>
              <input type="text" placeholder="Lun–Ven · 06h–10h" value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Animateurs (optionnel)</label>
              <input type="text" placeholder="Arielle, Teeyah" value={form.animateurs} onChange={e => setForm({ ...form, animateurs: e.target.value })} />
            </div>
            <ImageUploader value={form.img} onChange={url => setForm({ ...form, img: url })} label="Photo" />

            {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

            <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 6 }}>
              {status === 'saving' ? 'Envoi…' : "Publier l'émission"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
