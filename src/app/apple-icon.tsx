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
          flexWrap: 'wrap',
          background: '#FFFFFF',
          padding: 14,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '49%', height: '49%', background: '#0FA9A4', borderRadius: 8, marginRight: '2%', marginBottom: '2%' }} />
        <div style={{ width: '49%', height: '49%', background: '#2D8FC6', borderRadius: 8, marginBottom: '2%' }} />
        <div style={{ width: '49%', height: '49%', background: '#86BC2F', borderRadius: 8, marginRight: '2%' }} />
        <div style={{ width: '49%', height: '49%', background: '#EC6806', borderRadius: 8 }} />
      </div>
    ),
    { ...size },
  );
}
