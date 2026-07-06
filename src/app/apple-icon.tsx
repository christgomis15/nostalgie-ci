import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
            fontSize: 112,
            color: '#D4A843',
            lineHeight: 1,
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
