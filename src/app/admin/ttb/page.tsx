'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'

function todayAbidjan(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Abidjan',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())
}

export default function AdminTTB() {
  const [indice, setIndice] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/ttb', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setIndice(data.indice || '')
          setDate(data.date || '')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const today = todayAbidjan()
  const isPublishedToday = date === today

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/ttb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indice, date: today }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setDate(today)
      setStatus('ok')
      setMsg('Indice publié. Il apparaîtra en pop-up sur le site entre 10h45 et 11h15 (heure d\'Abidjan).')
    } catch (err) {
      setStatus('error')
      setMsg(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  return (
    <section className="page-section">
      <div className="admin-bar">
        <div>
          <Link href="/admin" className="admin-back">← Administration</Link>
          <h1 className="section-title" style={{ marginTop: 6 }}>Indice du jour — TTB</h1>
        </div>
      </div>
      <p className="sub" style={{ marginBottom: 20 }}>
        Saisissez l&apos;indice de Tchika Tchika Boom chaque matin. Il s&apos;affiche automatiquement
        en pop-up sur la page d&apos;accueil du site entre 10h45 et 11h15 (heure d&apos;Abidjan),
        uniquement le jour où il a été publié.
      </p>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : (
        <form onSubmit={submit} className="admin-panel" style={{ position: 'static', maxWidth: 560 }}>
          <p style={{ fontSize: 13, marginBottom: 14, color: isPublishedToday ? '#4caf50' : 'rgba(245,240,232,0.5)' }}>
            {isPublishedToday
              ? `✓ Indice déjà publié aujourd'hui (${date})`
              : date
                ? `Dernier indice publié le ${date} — pas encore mis à jour aujourd'hui`
                : "Aucun indice publié pour l'instant"}
          </p>

          <div className="form-group">
            <label>Indice du jour</label>
            <textarea
              rows={3}
              placeholder="Le TTB fonctionne dans un seul espace"
              value={indice}
              onChange={e => setIndice(e.target.value)}
              required
            />
          </div>

          {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

          <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 6 }}>
            {status === 'saving' ? 'Publication…' : "Publier l'indice du jour"}
          </button>
        </form>
      )}
    </section>
  )
}
