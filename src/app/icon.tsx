import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/PlayfairDisplay-Black.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Playfair Display',
            fontWeight: 900,
            fontSize: 320,
            color: '#D4A843',
            lineHeight: 1,
            // Un peu de relief plutôt qu'un aplat. Une ombre portée classique
            // ne se voit quasi pas sur un fond déjà presque noir (#0A0A0A) —
            // on détache donc la lettre avec une légère lueur dorée autour,
            // un filet clair en haut à gauche (reflet) et un filet ambre
            // sombre en bas à droite (creux du biseau) pour simuler le volume.
            textShadow:
              '0 0 46px rgba(212,168,67,0.45), -3px -3px 2px rgba(255,241,199,0.55), 3px 4px 2px rgba(74,50,14,0.9)',
          }}
        >
          N
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Playfair Display', data: fontData, weight: 900, style: 'normal' }],
    }
  )
}
