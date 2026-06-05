import { create } from 'zustand'

const STREAM_URL = 'https://stream.zeno.fm/01PLpj-2qtzuv'

export interface Webradio {
  badge: string
  name: string
  desc: string
  stream: string | null
}

export const WEBRADIOS: Webradio[] = [
  { badge: 'N',  name: 'Nostalgie Live', desc: '101.1 FM · Direct',      stream: STREAM_URL },
  { badge: 'NV', name: 'Nouveautés',     desc: 'Hits du moment',          stream: null },
  { badge: 'RT', name: 'Rétro',          desc: '80s · 90s · 2000s',       stream: null },
  { badge: 'ZG', name: 'Zouglou',        desc: '100% Ivoirien',           stream: null },
  { badge: 'CD', name: 'Coupé Décalé',   desc: 'Les grands noms',         stream: null },
  { badge: 'AF', name: 'Afrobeats',      desc: 'Nigeria · Ghana · CI',    stream: null },
  { badge: 'RB', name: 'R&B Soul',       desc: 'US & Afro R&B',           stream: null },
  { badge: 'RI', name: 'Rap Ivoire',     desc: '100% CI Hip-Hop',         stream: null },
  { badge: 'MM', name: 'Musiques du Monde', desc: 'World & Global Beats', stream: null },
]

interface PlayerState {
  isPlaying: boolean
  currentRadio: Webradio
  audio: HTMLAudioElement | null
  toggle: () => void
  switchRadio: (radio: Webradio) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentRadio: WEBRADIOS[0],
  audio: null,

  toggle: () => {
    const { isPlaying, audio, currentRadio } = get()

    if (!currentRadio.stream) {
      // Radio non disponible — toast géré par le composant
      return
    }

    if (!audio) {
      const newAudio = new Audio(currentRadio.stream)
      newAudio.play()
      set({ audio: newAudio, isPlaying: true })
      return
    }

    if (isPlaying) {
      audio.pause()
      set({ isPlaying: false })
    } else {
      audio.play()
      set({ isPlaying: true })
    }
  },

  switchRadio: (radio: Webradio) => {
    const { audio } = get()

    if (audio) {
      audio.pause()
      audio.src = ''
    }

    if (!radio.stream) {
      set({ currentRadio: radio, isPlaying: false, audio: null })
      return
    }

    const newAudio = new Audio(radio.stream)
    newAudio.play()
    set({ currentRadio: radio, isPlaying: true, audio: newAudio })
  },
}))