'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'

function extractVideoId(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : trimmed
}

export default function AdminLive() {
  const [isLive, setIsLive] = useState(false)
  const [videoIdInput, setVideoIdInput] = useState('')
  const [title, setTitle] = useState('Nostalgie Live')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/live', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setIsLive(!!data.isLive)
          setVideoIdInput(data.videoId || '')
          setTitle(data.title || 'Nostalgie Live')
          setDescription(data.description || '')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const videoId = extractVideoId(videoIdInput)
      const res = await fetch('/api/admin/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLive, videoId, title, description }),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) throw new Error(data?.error || 'Erreur')
      setVideoIdInput(videoId)
      setStatus('ok')
      setMsg(isLive ? 'Live activé. Il apparaîtra sur le site sous une minute.' : 'Live désactivé.')
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
          <h1 className="section-title" style={{ marginTop: 6 }}>Live</h1>
        </div>
      </div>
      <p className="sub" style={{ marginBottom: 20 }}>
        Active le live quand ta diffusion YouTube démarre, désactive-le quand elle se termine.
      </p>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : (
        <form onSubmit={submit} className="admin-panel" style={{ position: 'static', maxWidth: 560 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <input type="checkbox" checked={isLive} onChange={e => setIsLive(e.target.checked)} />
            <span style={{ fontWeight: 700 }}>{isLive ? 'Live actif' : 'Pas de live en ce moment'}</span>
          </label>

          <div className="form-group">
            <label>Lien ou ID de la vidéo YouTube</label>
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=… ou juste l'ID"
              value={videoIdInput}
              onChange={e => setVideoIdInput(e.target.value)}
              required={isLive}
            />
          </div>
          <div className="form-group">
            <label>Titre affiché</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description (optionnel)</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

          <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 6 }}>
            {status === 'saving' ? 'Enregistrement…' : isLive ? 'Activer le live' : 'Enregistrer (live désactivé)'}
          </button>
        </form>
      )}
    </section>
  )
}
