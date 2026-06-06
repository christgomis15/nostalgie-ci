import { create } from 'zustand'

const STREAM_URL = '/api/stream'

export interface Webradio {
  badge: string
  name: string
  desc: string
  stream: string | null
}

export const WEBRADIOS: Webradio[] = [
  { badge: 'N',  name: 'Nostalgie Live',    desc: '101.1 FM · Direct',      stream: STREAM_URL },
  { badge: 'NV', name: 'Nouveautés',        desc: 'Hits du moment',          stream: null },
  { badge: 'RT', name: 'Rétro',             desc: '80s · 90s · 2000s',       stream: null },
  { badge: 'ZG', name: 'Zouglou',           desc: '100% Ivoirien',           stream: null },
  { badge: 'CD', name: 'Coupé Décalé',      desc: 'Les grands noms',         stream: null },
  { badge: 'AF', name: 'Afrobeats',         desc: 'Nigeria · Ghana · CI',    stream: null },
  { badge: 'RB', name: 'R&B Soul',          desc: 'US & Afro R&B',           stream: null },
  { badge: 'RI', name: 'Rap Ivoire',        desc: '100% CI Hip-Hop',         stream: null },
  { badge: 'MM', name: 'Musiques du Monde', desc: 'World & Global Beats',    stream: null },
]

interface PlayerState {
  isPlaying: boolean
  isLoading: boolean
  streamError: string | null
  currentRadio: Webradio
  audio: HTMLAudioElement | null
  toggle: () => void
  switchRadio: (radio: Webradio) => void
}

function createAudio(url: string, onEnd: () => void, onError: (msg: string) => void): HTMLAudioElement {
  const a = new Audio()
  a.src = url
  a.load()
  a.addEventListener('ended', onEnd)
  a.addEventListener('error', () => onError('Flux non disponible. Réessayez dans un instant.'))
  return a
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  isLoading: false,
  streamError: null,
  currentRadio: WEBRADIOS[0],
  audio: null,

  toggle: () => {
    const { isPlaying, audio, currentRadio } = get()

    if (!currentRadio.stream) return

    // First play — create audio element
    if (!audio) {
      set({ isLoading: true, streamError: null })
      const newAudio = createAudio(
        currentRadio.stream,
        () => set({ isPlaying: false }),
        (msg) => set({ isPlaying: false, isLoading: false, streamError: msg }),
      )
      newAudio.play()
        .then(() => set({ audio: newAudio, isPlaying: true, isLoading: false }))
        .catch(() => set({ audio: null, isPlaying: false, isLoading: false, streamError: 'Impossible de démarrer le flux.' }))
      return
    }

    if (isPlaying) {
      audio.pause()
      set({ isPlaying: false })
    } else {
      set({ isLoading: true, streamError: null })
      audio.play()
        .then(() => set({ isPlaying: true, isLoading: false }))
        .catch(() => set({ isPlaying: false, isLoading: false, streamError: 'Impossible de démarrer le flux.' }))
    }
  },

  switchRadio: (radio: Webradio) => {
    const { audio } = get()

    if (audio) {
      audio.pause()
      audio.src = ''
    }

    if (!radio.stream) {
      set({ currentRadio: radio, isPlaying: false, audio: null, streamError: null })
      return
    }

    set({ isLoading: true, streamError: null, currentRadio: radio, audio: null })
    const newAudio = createAudio(
      radio.stream,
      () => set({ isPlaying: false }),
      (msg) => set({ isPlaying: false, isLoading: false, streamError: msg }),
    )
    newAudio.play()
      .then(() => set({ audio: newAudio, isPlaying: true, isLoading: false }))
      .catch(() => set({ audio: null, isPlaying: false, isLoading: false, streamError: 'Stream non disponible.' }))
  },
}))
