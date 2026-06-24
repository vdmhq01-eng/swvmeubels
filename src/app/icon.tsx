import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          background: '#FFFFFF',
        }}
      >
        <div style={{ width: '50%', height: '50%', background: '#0FA9A4' }} />
        <div style={{ width: '50%', height: '50%', background: '#2D8FC6' }} />
        <div style={{ width: '50%', height: '50%', background: '#86BC2F' }} />
        <div style={{ width: '50%', height: '50%', background: '#EC6806' }} />
      </div>
    ),
    { ...size },
  );
}
