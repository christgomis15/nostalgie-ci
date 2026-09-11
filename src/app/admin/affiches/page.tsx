'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'

interface Affiche {
  titre: string
  date: string
  img: string
}

const EMPTY = { titre: '', date: '', img: '' }

export default function AdminAffiches() {
  const [affiches, setAffiches] = useState<Affiche[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function load() {
    setLoading(true)
    fetch('/api/affiches', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setAffiches(data.affiches || []))
      .catch(() => setAffiches([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/affiches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) throw new Error(data?.error || 'Erreur')
      setStatus('ok')
      setMsg("Affiche publiée. Elle passera en intro dès qu'elle sera la prochaine échéance.")
      setForm(EMPTY)
      load()
    } catch (err) {
      setStatus('error')
      setMsg(err instanceof Error ? err.message : "Erreur lors de l'ajout")
    }
  }

  async function remove(titre: string) {
    if (!confirm(`Retirer l'affiche « ${titre} » ?`)) return
    try {
      const res = await fetch('/api/admin/affiches', {
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
          <h1 className="section-title" style={{ marginTop: 6 }}>Affiches partenaires</h1>
        </div>
      </div>
      <p className="sub" style={{ marginBottom: 20 }}>
        Ajoutez une affiche par événement partenaire, avec sa date. Sur la page d&apos;accueil,
        l&apos;affiche de l&apos;événement le plus proche s&apos;affiche automatiquement en intro
        (10 secondes) jusqu&apos;au jour de l&apos;événement — puis la suivante prend le relais toute seule.
        Aucun ordre à gérer, tout se base sur la date.
      </p>

      <div className="admin-layout">
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>
            Affiches en ligne ({affiches.length})
          </h3>
          {loading ? (
            <p className="admin-empty">Chargement…</p>
          ) : affiches.length === 0 ? (
            <p className="admin-empty">Aucune affiche.</p>
          ) : (
            <div className="admin-list">
              {affiches.map(a => (
                <div key={a.titre} className="admin-row">
                  <img src={a.img} alt="" onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
                  <div className="admin-row-info">
                    <p className="admin-row-tag">{a.date}</p>
                    <p className="admin-row-title">{a.titre}</p>
                  </div>
                  <button className="admin-row-del" onClick={() => remove(a.titre)}>Retirer</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h3>Ajouter une affiche</h3>
          <p className="sub">Format de date attendu : « 3 octobre 2026 » (jour, mois en lettres, année).</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Titre / nom de l&apos;événement</label>
              <input
                type="text"
                placeholder="Ex : Concert Joel & Independence Day"
                value={form.titre}
                onChange={e => setForm({ ...form, titre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Date de l&apos;événement</label>
              <input
                type="text"
                placeholder="3 octobre 2026"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <ImageUploader value={form.img} onChange={url => setForm({ ...form, img: url })} label="Affiche (visuel plein format)" />

            {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

            <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 6 }}>
              {status === 'saving' ? 'Publication…' : "Publier l'affiche"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
