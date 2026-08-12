import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/PlayfairDisplay-Black.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(180deg,#120E00 0%,#0A0A0A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Playfair Display',
            fontWeight: 900,
            fontSize: 140,
            letterSpacing: 12,
            color: '#F5F0E8',
            lineHeight: 1,
          }}
        >
          NOSTALGIE
        </span>
        <span
          style={{
            fontFamily: 'Playfair Display',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 6,
            color: '#D4A843',
            marginTop: 18,
          }}
        >
          Côte d&apos;Ivoire · Sérieusement Décalée
        </span>
        <span
          style={{
            fontFamily: 'Playfair Display',
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 3,
            color: '#888',
            marginTop: 28,
          }}
        >
          101.1 FM Abidjan
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Playfair Display', data: fontData, weight: 900, style: 'normal' }],
    }
  )
}
