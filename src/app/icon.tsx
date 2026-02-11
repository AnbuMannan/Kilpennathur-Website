import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
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
          borderRadius: '6px',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          style={{ width: 20, height: 20 }}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 2L15 8H9L12 2Z"
            fill="currentColor"
            style={{ color: 'rgba(255,255,255,0.4)' }}
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
