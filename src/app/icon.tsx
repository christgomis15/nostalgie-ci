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
          position: 'relative',
        }}
      >
        {/* Halo doré derrière */}
        <div style={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,67,0.18) 0%, rgba(212,168,67,0) 70%)',
        }} />

        {/* Anneau doré */}
        <div style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          border: '2px solid rgba(212,168,67,0.35)',
        }} />

        {/* Contenu centré */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          position: 'relative',
        }}>
          <div style={{
            color: '#D4A843',
            fontSize: 272,
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            lineHeight: 1,
          }}>
            N
          </div>
          <div style={{
            color: 'rgba(212,168,67,0.55)',
            fontSize: 34,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: '10px',
            marginTop: -16,
          }}>
            101.1 FM
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
