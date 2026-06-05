'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant de Radio Nostalgie CI. Émissions, horaires, dédicaces... posez-moi vos questions !" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg: Message = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? 'Désolé, une erreur est survenue.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connexion impossible. Réessayez dans un instant.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot">
      <div className="cbh">
        <div className="cb-av">N</div>
        <div>
          <div className="cb-nm">Service Nostalgie</div>
          <div className="cb-st">Assistant IA · En ligne</div>
        </div>
        <div className="cb-on" />
      </div>
      <div className="cb-msgs">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'assistant' ? 'msg-bot' : 'msg-user'}`}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="tdots">
            <span /><span /><span />
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="cb-inp">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Posez votre question..."
        />
        <button className="cb-send" onClick={send} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  )
}
