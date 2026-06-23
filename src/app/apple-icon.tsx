import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#EC6806',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          fontSize: 60,
          fontWeight: 700,
          letterSpacing: '-1px',
        }}
      >
        SWV
      </div>
    ),
    { ...size },
  );
}
