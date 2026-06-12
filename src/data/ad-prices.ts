export type DureeKey = 'semaine' | 'mois' | 'trimestre' | 'semestre'

export const DUREES: { key: DureeKey; label: string }[] = [
  { key: 'semaine',   label: '1 semaine' },
  { key: 'mois',      label: '1 mois'    },
  { key: 'trimestre', label: '3 mois'    },
  { key: 'semestre',  label: '6 mois'    },
]

export interface EspacePub {
  id: number
  nom: string
  desc: string
  icone: string
  color: string
  prix: Record<DureeKey, number>
}

export const ESPACES_PUB: EspacePub[] = [
  {
    id: 1,
    nom: 'Bandeau sous le menu',
    desc: 'Affiché sur toutes les pages du site',
    icone: '👁️',
    color: '#E74C3C',
    prix: { semaine: 50000, mois: 150000, trimestre: 400000, semestre: 700000 },
  },
  {
    id: 2,
    nom: "Bandeau page d'accueil",
    desc: "Grande image de bienvenue — premier regard du visiteur",
    icone: '🏠',
    color: '#E67E22',
    prix: { semaine: 75000, mois: 200000, trimestre: 550000, semestre: 950000 },
  },
  {
    id: 3,
    nom: 'Logo dans le lecteur radio',
    desc: 'Visible en permanence, même quand on change de page',
    icone: '🎵',
    color: '#2ECC71',
    prix: { semaine: 100000, mois: 280000, trimestre: 750000, semestre: 1300000 },
  },
  {
    id: 4,
    nom: "Message dans le fil d'info",
    desc: 'Bandeau animé en haut du site — toujours visible',
    icone: '📢',
    color: '#3498DB',
    prix: { semaine: 60000, mois: 170000, trimestre: 460000, semestre: 800000 },
  },
  {
    id: 5,
    nom: 'Encart dans les articles',
    desc: 'Inséré dans les pages Actus et Podcasts',
    icone: '📰',
    color: '#9B59B6',
    prix: { semaine: 40000, mois: 120000, trimestre: 320000, semestre: 550000 },
  },
  {
    id: 6,
    nom: "Parrainage d'émission",
    desc: '"Le Crazy Morning présenté par [Votre Marque]"',
    icone: '🎙️',
    color: '#1ABC9C',
    prix: { semaine: 150000, mois: 400000, trimestre: 1050000, semestre: 1800000 },
  },
  {
    id: 7,
    nom: 'Sponsor des retransmissions Live',
    desc: 'Votre logo pendant les matchs et événements en direct',
    icone: '📺',
    color: '#F39C12',
    prix: { semaine: 80000, mois: 220000, trimestre: 590000, semestre: 1000000 },
  },
  {
    id: 8,
    nom: 'Habillage complet du site',
    desc: 'Tout le site prend les couleurs de votre marque',
    icone: '🎨',
    color: '#E91E63',
    prix: { semaine: 200000, mois: 550000, trimestre: 1450000, semestre: 2500000 },
  },
  {
    id: 9,
    nom: "Écran d'entrée plein écran",
    desc: 'Votre pub en plein écran avant l\'accès au site',
    icone: '⚡',
    color: '#FF5722',
    prix: { semaine: 120000, mois: 320000, trimestre: 850000, semestre: 1450000 },
  },
]

export function formatPrix(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA'
}
