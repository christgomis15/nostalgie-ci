'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur de connexion')
      }
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-section" style={{ maxWidth: 420, margin: '0 auto' }}>
      <p className="section-label">Accès réservé</p>
      <h1 className="section-title">Administration</h1>
      <form onSubmit={submit} style={{ marginTop: 24 }}>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        {error && <p style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="btn btn-or" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </section>
  )
}
