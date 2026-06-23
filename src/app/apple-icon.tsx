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
          background: 'linear-gradient(180deg, #956E3F 0%, #5A3F22 100%)',
          color: '#FBF8F3',
          fontFamily: 'Georgia, serif',
          fontSize: 120,
          fontWeight: 600,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
