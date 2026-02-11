import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
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
          background: '#2563eb',
          color: 'white',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          style={{ width: 108, height: 108 }}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L15 8H9L12 2Z"
            fill="currentColor"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 22H20M4 22V18H20V22M6 18V14H18V18M7 14V10H17V14M8 10V6H16V10M12 2L16 6H8L12 2Z"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
