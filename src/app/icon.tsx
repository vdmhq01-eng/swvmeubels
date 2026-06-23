import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 22,
          fontWeight: 600,
          borderRadius: 6,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
