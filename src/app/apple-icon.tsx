import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#111111',
          borderRadius: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="140"
          height="120"
          viewBox="0 0 22 19"
          fill="none"
          style={{ display: 'flex' }}
        >
          <path
            d="M1.5 1.5 L6 17 L10.5 1.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 1.5 L13 17 L17.5 1.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20.5" cy="17" r="2.5" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
