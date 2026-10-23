import { create } from 'zustand'

const STREAM_URL = 'https://nostalgie.orange.ci/nostalgie2.mp3'
const PREROLL_URL = '/PREEROLL%20STREAMING.mp3'

// Le flux se coupe parfois (réseau mobile/local de l'auditeur en Côte
// d'Ivoire le plus souvent, pas le serveur — testé en direct le 23 oct. :
// la connexion tient plusieurs minutes sans coupure depuis ici). Sans
// reconnexion automatique, l'auditeur se retrouvait avec un lecteur arrêté
// qu'il devait relancer lui-même ("il faut recliquer"). On retente
// automatiquement, avec un délai qui augmente progressivement (2s → 15s max),
// pendant plusieurs minutes avant d'abandonner — une coupure réseau locale
// peut mettre plus de quelques secondes à se rétablir (1ère version du 13 oct.
// abandonnait après seulement 12s, insuffisant : des auditeurs perdaient le
// son au bout de quelques minutes quand même).
const MAX_RECONNECT_ATTEMPTS = 40
const RECONNECT_BASE_DELAY_MS = 2000
const RECONNECT_MAX_DELAY_MS = 15000

function reconnectDelay(attempt: number): number {
  return Math.min(RECONNECT_BASE_DELAY_MS + attempt * 1000, RECONNECT_MAX_DELAY_MS)
}

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
  isPreroll: boolean
  streamError: string | null
  currentRadio: Webradio
  audio: HTMLAudioElement | null
  toggle: () => void
  switchRadio: (radio: Webradio) => void
}

// Incrémenté à chaque pause volontaire, changement de webradio ou nouveau
// démarrage : une reconnexion programmée (setTimeout) pour une session plus
// ancienne se sait périmée et ne fait plus rien — évite deux flux qui se
// chevauchent si l'auditeur coupe pendant une tentative de reconnexion.
let session = 0

export const usePlayerStore = create<PlayerState>((set, get) => {
  // Crée un <audio> pour `url` et le joue. En cas de coupure inattendue
  // ("ended"/"error" — pas une pause volontaire, qui appelle .pause()
  // directement sans déclencher ces événements), retente automatiquement
  // avec un nouvel élément plutôt que de laisser le lecteur arrêté.
  function connect(url: string, mySession: number, attempt = 0) {
    if (session !== mySession) return

    const a = new Audio()
    a.src = url
    a.load()

    const reconnect = () => {
      if (session !== mySession) return
      if (attempt >= MAX_RECONNECT_ATTEMPTS) {
        set({ isPlaying: false, isLoading: false, audio: null, streamError: 'Le flux a été interrompu. Cliquez pour réessayer.' })
        return
      }
      set({ isLoading: true })
      setTimeout(() => connect(url, mySession, attempt + 1), reconnectDelay(attempt))
    }
    a.addEventListener('ended', reconnect)
    a.addEventListener('error', reconnect)

    a.play()
      .then(() => {
        if (session !== mySession) { a.pause(); return }
        set({ audio: a, isPlaying: true, isLoading: false, streamError: null })
      })
      .catch(reconnect)
  }

  return {
    isPlaying: false,
    isLoading: false,
    isPreroll: false,
    streamError: null,
    currentRadio: WEBRADIOS[0],
    audio: null,

    toggle: () => {
      const { isPlaying, audio, currentRadio, isPreroll } = get()

      if (!currentRadio.stream) return
      if (isPreroll) return // preroll en cours, on ne coupe pas

      // Pause / reprise si le flux est déjà chargé (élément audio toujours
      // valide — une coupure inattendue serait déjà passée par connect()
      // et aurait remplacé/vidé "audio", donc ici c'est une pause volontaire).
      if (audio) {
        if (isPlaying) {
          session++ // annule une reconnexion automatique en attente
          audio.pause()
          set({ isPlaying: false })
        } else {
          set({ isLoading: true, streamError: null })
          audio.play()
            .then(() => set({ isPlaying: true, isLoading: false }))
            .catch(() => set({ isPlaying: false, isLoading: false, streamError: 'Le flux est temporairement indisponible. Réessayez dans quelques minutes.' }))
        }
        return
      }

      // Premier démarrage
      const stream = currentRadio.stream
      const prerollDone = typeof window !== 'undefined' && sessionStorage.getItem('preroll-done') === '1'

      if (prerollDone) {
        set({ isLoading: true, streamError: null })
        connect(stream, ++session)
        return
      }

      // Lecture du preroll, puis bascule sur le flux
      set({ isLoading: true, streamError: null, isPreroll: true })
      const mySession = ++session
      const preroll = new Audio(PREROLL_URL)
      const launchStream = () => {
        if (session !== mySession) return
        set({ isPreroll: false })
        connect(stream, mySession)
      }
      preroll.addEventListener('ended', () => { sessionStorage.setItem('preroll-done', '1'); launchStream() })
      preroll.addEventListener('error', launchStream)
      preroll.play()
        .then(() => { if (session === mySession) set({ isPlaying: true, isLoading: false }) })
        .catch(() => { if (session === mySession) { set({ isPreroll: false, isLoading: false }); launchStream() } })
    },

    switchRadio: (radio: Webradio) => {
      const { audio } = get()
      session++ // coupe toute reconnexion en cours sur l'ancienne webradio

      if (audio) {
        audio.pause()
        audio.src = ''
      }

      if (!radio.stream) {
        set({ currentRadio: radio, isPlaying: false, audio: null, streamError: null })
        return
      }

      set({ isLoading: true, streamError: null, currentRadio: radio, audio: null })
      connect(radio.stream, session)
    },
  }
})
