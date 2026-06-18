import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          position: 'relative',
        }}
      >
        {/* Halo */}
        <div style={{
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,67,0.20) 0%, rgba(212,168,67,0) 70%)',
        }} />

        {/* Anneau */}
        <div style={{
          position: 'absolute',
          width: 112,
          height: 112,
          borderRadius: '50%',
          border: '2px solid rgba(212,168,67,0.35)',
        }} />

        {/* N + FM */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div style={{
            color: '#D4A843',
            fontSize: 96,
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            lineHeight: 1,
          }}>
            N
          </div>
          <div style={{
            color: 'rgba(212,168,67,0.55)',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: '4px',
            marginTop: -6,
          }}>
            101.1 FM
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
