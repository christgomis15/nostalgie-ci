'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface ArchiveItem {
  rang: number
  artiste: string
  titre: string
  passages: number
  spotifyId: string
  spotifyType: 'track' | 'album'
  coverImg: string
}

type PeriodType = 'mois' | 'trimestre' | 'semestre' | 'annee'

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function pad(n: number) { return String(n).padStart(2, '0') }
function toISO(y: number, m: number, d: number) { return `${y}-${pad(m)}-${pad(d)}` }
function lastDayOfMonth(y: number, m: number) { return new Date(y, m, 0).getDate() }

function computeRange(type: PeriodType, year: number, value: number): { start: string; end: string; label: string } {
  if (type === 'mois') {
    return { start: toISO(year, value, 1), end: toISO(year, value, lastDayOfMonth(year, value)), label: `${MOIS[value - 1]} ${year}` }
  }
  if (type === 'trimestre') {
    const startMonth = (value - 1) * 3 + 1
    const endMonth = startMonth + 2
    return { start: toISO(year, startMonth, 1), end: toISO(year, endMonth, lastDayOfMonth(year, endMonth)), label: `T${value} ${year}` }
  }
  if (type === 'semestre') {
    const startMonth = (value - 1) * 6 + 1
    const endMonth = startMonth + 5
    return { start: toISO(year, startMonth, 1), end: toISO(year, endMonth, lastDayOfMonth(year, endMonth)), label: `S${value} ${year}` }
  }
  return { start: toISO(year, 1, 1), end: toISO(year, 12, 31), label: `Année ${year}` }
}

export default function AdminTop5Archives() {
  const now = new Date()
  const [type, setType] = useState<PeriodType>('mois')
  const [year, setYear] = useState(now.getFullYear())
  const [value, setValue] = useState(now.getMonth() + 1)
  const [items, setItems] = useState<ArchiveItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const range = useMemo(() => computeRange(type, year, value), [type, year, value])

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`/api/admin/top5-archive?start=${range.start}&end=${range.end}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setItems(data.items || [])
      })
      .catch(err => { setError(err instanceof Error ? err.message : 'Erreur de chargement'); setItems([]) })
      .finally(() => setLoading(false))
  }, [range.start, range.end])

  function switchType(t: PeriodType) {
    setType(t)
    if (t === 'mois') setValue(now.getMonth() + 1)
    else if (t === 'trimestre') setValue(Math.floor(now.getMonth() / 3) + 1)
    else if (t === 'semestre') setValue(now.getMonth() < 6 ? 1 : 2)
    else setValue(1)
  }

  const valueOptions =
    type === 'mois' ? MOIS.map((m, i) => ({ value: i + 1, label: m })) :
    type === 'trimestre' ? [1, 2, 3, 4].map(q => ({ value: q, label: `Trimestre ${q}` })) :
    type === 'semestre' ? [1, 2].map(s => ({ value: s, label: `Semestre ${s}` })) :
    []

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 4 + i)

  return (
    <section className="page-section">
      <div className="admin-bar">
        <div>
          <Link href="/admin" className="admin-back">← Administration</Link>
          <h1 className="section-title" style={{ marginTop: 6 }}>Archives Top 5</h1>
        </div>
      </div>
      <p className="sub" style={{ marginBottom: 20 }}>
        Classement reconstitué en additionnant les passages de chaque titre sur toutes les semaines de la période choisie.
        L&apos;historique se construit à chaque mise à jour du Top 5 hebdomadaire — les périodes antérieures au démarrage de cette fonctionnalité ne seront pas disponibles.
      </p>

      <div className="admin-panel" style={{ position: 'static', maxWidth: 480, marginBottom: 24 }}>
        <div className="form-group">
          <label>Type de période</label>
          <select value={type} onChange={e => switchType(e.target.value as PeriodType)}>
            <option value="mois">Mois</option>
            <option value="trimestre">Trimestre</option>
            <option value="semestre">Semestre</option>
            <option value="annee">Année</option>
          </select>
        </div>
        <div className="form-row">
          {type !== 'annee' && (
            <div className="form-group">
              <label>Période</label>
              <select value={value} onChange={e => setValue(Number(e.target.value))}>
                {valueOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Année</label>
            <select value={year} onChange={e => setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>
        Top 5 — {range.label}
      </h3>

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : error ? (
        <p className="admin-msg err">{error}</p>
      ) : !items || items.length === 0 ? (
        <p className="admin-empty">Aucune donnée archivée pour cette période.</p>
      ) : (
        <div className="admin-list">
          {items.map(it => (
            <div key={it.rang} className="admin-row">
              <img src={it.coverImg} alt="" onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
              <div className="admin-row-info">
                <p className="admin-row-tag">#{it.rang} · {it.passages} passages au total</p>
                <p className="admin-row-title">{it.titre}</p>
                <p className="admin-row-sub">{it.artiste}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
