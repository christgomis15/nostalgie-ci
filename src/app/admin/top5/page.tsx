'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'

interface Item {
  rang: number
  artiste: string
  titre: string
  passages: number
  spotifyId: string
  spotifyType: 'track' | 'album'
  coverImg: string
}

const EMPTY_ITEM = (rang: number): Item => ({ rang, artiste: '', titre: '', passages: 0, spotifyId: '', spotifyType: 'track', coverImg: '' })

export default function AdminTop5() {
  const [semaine, setSemaine] = useState('')
  const [items, setItems] = useState<Item[]>([1, 2, 3, 4, 5].map(EMPTY_ITEM))
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/top5', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data?.items?.length) {
          setSemaine(data.semaine || '')
          setItems(data.items)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function update(i: number, patch: Partial<Item>) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMsg('')
    try {
      const res = await fetch('/api/admin/top5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semaine, items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setStatus('ok')
      setMsg('Top 5 mis à jour. Il apparaîtra sur le site sous environ 1 heure.')
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
          <h1 className="section-title" style={{ marginTop: 6 }}>Top 5</h1>
        </div>
      </div>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : (
        <form onSubmit={submit} style={{ maxWidth: 640 }}>
          <div className="form-group">
            <label>Semaine</label>
            <input type="text" placeholder="6 – 12 juillet 2026" value={semaine} onChange={e => setSemaine(e.target.value)} required />
          </div>

          <div className="admin-panel" style={{ position: 'static', marginTop: 20 }}>
            {items.map((it, i) => (
              <div key={i} className="admin-top5-row">
                <div className="admin-top5-rank">{i + 1}</div>
                <div>
                  <div className="form-row">
                    <div className="form-group"><label>Artiste</label><input type="text" value={it.artiste} onChange={e => update(i, { artiste: e.target.value })} required /></div>
                    <div className="form-group"><label>Titre</label><input type="text" value={it.titre} onChange={e => update(i, { titre: e.target.value })} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Passages</label><input type="number" min={0} value={it.passages} onChange={e => update(i, { passages: Number(e.target.value) })} required /></div>
                    <div className="form-group">
                      <label>Type Spotify</label>
                      <select value={it.spotifyType} onChange={e => update(i, { spotifyType: e.target.value as 'track' | 'album' })}>
                        <option value="track">Titre (track)</option>
                        <option value="album">Album</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Identifiant Spotify</label>
                    <input type="text" placeholder="partie après /track/ ou /album/ dans l'URL" value={it.spotifyId} onChange={e => update(i, { spotifyId: e.target.value })} />
                  </div>
                  <ImageUploader value={it.coverImg} onChange={url => update(i, { coverImg: url })} label="Pochette" />
                </div>
              </div>
            ))}
          </div>

          {msg && <p className={`admin-msg ${status === 'error' ? 'err' : 'ok'}`}>{msg}</p>}

          <button type="submit" className="btn btn-or" disabled={status === 'saving'} style={{ width: '100%', marginTop: 20 }}>
            {status === 'saving' ? 'Envoi…' : 'Enregistrer le Top 5'}
          </button>
        </form>
      )}
    </section>
  )
}
