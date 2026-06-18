import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
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
        <div style={{ color: '#D4A843', fontSize: 340, fontFamily: 'serif', fontWeight: 900, lineHeight: 1 }}>
          N
        </div>
      </div>
    ),
    { ...size }
  )
}
