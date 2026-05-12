import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const mark = readFileSync(join(process.cwd(), 'public', 'favicon-mark-cropped.png'))
  const src = `data:image/png;base64,${mark.toString('base64')}`

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
        <img src={src} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
      </div>
    ),
    { ...size }
  )
}
