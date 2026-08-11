'use client'

import { useRef, useState } from 'react'

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
}: {
  value: string
  onChange: (url: string) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error(
          res.status === 413
            ? 'Image trop volumineuse pour être envoyée (4 Mo max) — réduisez la taille ou compressez la photo'
            : `Échec de l'upload (erreur serveur ${res.status})`
        )
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Échec de l'upload")
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload")
    } finally {
      setUploading(false)
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) upload(file)
  }

  return (
    <div className="form-group">
      <label>{label}</label>
      <div
        className={`admin-dropzone ${drag ? 'drag' : ''} ${uploading ? 'uploading' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
      >
        {value ? (
          <img src={value} alt="Aperçu" />
        ) : (
          <p>{uploading ? 'Envoi en cours…' : 'Cliquez ou glissez une image ici'}</p>
        )}
        {value && !uploading && <p style={{ marginTop: 8 }}>Cliquez pour remplacer</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />
      {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  )
}
