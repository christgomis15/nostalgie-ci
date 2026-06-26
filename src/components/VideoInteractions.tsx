'use client'
import { useState, useEffect, useCallback } from 'react'

interface Comment {
  date: string
  prenom: string
  commentaire: string
}

interface InteractionsData {
  likes: number
  comments: Comment[]
}

export default function VideoInteractions({ videoId }: { videoId: string }) {
  const [data, setData] = useState<InteractionsData>({ likes: 0, comments: [] })
  const [hasLiked, setHasLiked] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const likeKey = `liked_${videoId}`

  const fetchData = useCallback(() => {
    fetch(`/api/interactions?videoId=${encodeURIComponent(videoId)}`)
      .then(r => (r.ok ? r.json() : null))
      .then((json: InteractionsData | null) => { if (json) setData(json) })
      .catch(() => {})
  }, [videoId])

  useEffect(() => {
    setData({ likes: 0, comments: [] })
    setSent(false)
    setText('')
    setPrenom('')
    setHasLiked(localStorage.getItem(likeKey) === '1')
    fetchData()
  }, [videoId, fetchData, likeKey])

  function handleLike() {
    if (hasLiked) return
    localStorage.setItem(likeKey, '1')
    setHasLiked(true)
    setData(d => ({ ...d, likes: d.likes + 1 }))
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'like', videoId }),
    }).catch(() => {})
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const nom = prenom.trim() || 'Anonyme'
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'comment', videoId, prenom: nom, commentaire: text.trim() }),
    })
      .then(() => {
        setData(d => ({
          ...d,
          comments: [{ date: "À l'instant", prenom: nom, commentaire: text.trim() }, ...d.comments],
        }))
        setSent(true)
        setSending(false)
        setText('')
        setPrenom('')
      })
      .catch(() => setSending(false))
  }

  return (
    <div className="vi-wrap">

      {/* Bouton J'aime */}
      <button
        className={`vi-like${hasLiked ? ' vi-liked' : ''}`}
        onClick={handleLike}
        aria-label="J'aime"
      >
        <span className="vi-heart">{hasLiked ? '❤️' : '🤍'}</span>
        <span>{data.likes > 0 ? `${data.likes} J'aime` : "J'aime"}</span>
      </button>

      {/* Section commentaires */}
      <div className="vi-comments">
        <p className="vi-comments-title">
          {data.comments.length > 0
            ? `${data.comments.length} commentaire${data.comments.length > 1 ? 's' : ''}`
            : 'Soyez le premier à commenter'}
        </p>

        {data.comments.map((c, i) => (
          <div key={i} className="vi-comment">
            <div className="vi-avatar">{c.prenom[0]?.toUpperCase() ?? '?'}</div>
            <div className="vi-comment-body">
              <p className="vi-comment-name">
                {c.prenom}
                <span className="vi-comment-date">{c.date}</span>
              </p>
              <p className="vi-comment-text">{c.commentaire}</p>
            </div>
          </div>
        ))}

        {sent ? (
          <p className="vi-sent">✓ Commentaire publié !</p>
        ) : (
          <form className="vi-form" onSubmit={handleComment}>
            <input
              className="vi-input"
              type="text"
              placeholder="Votre prénom (optionnel)"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              maxLength={50}
            />
            <textarea
              className="vi-textarea"
              placeholder="Votre commentaire…"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              maxLength={500}
              required
            />
            <button className="vi-submit" type="submit" disabled={sending || !text.trim()}>
              {sending ? 'Envoi…' : 'Publier'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
