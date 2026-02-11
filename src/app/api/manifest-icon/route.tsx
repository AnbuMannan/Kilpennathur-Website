import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sizeParam = searchParams.get('size');
  const size = sizeParam ? parseInt(sizeParam, 10) : 192;
  
  // Default to 192 if invalid, but allow 512 specifically
  const validSize = size === 512 ? 512 : 192;
  
  // Calculate stroke width relative to size to maintain visual weight
  // Base 1.5 at 24px -> at 192px (8x), we might want thicker? 
  // Actually SVG scales, so strokeWidth 1.5 stays relative to the viewBox 24x24.
  // But since we are rendering an SVG inside a large container, we keep the viewBox 0 0 24 24.
  // So strokeWidth="1.5" is fine as it's relative to the 24px coordinate system.

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2563eb', // blue-600
          // No border radius here because the device OS applies the mask (squircle, circle, etc.)
          // Actually, for "maskable" icons, we want full square. 
          // But for "any" icons, transparent corners are nice?
          // PWA Standard: provide a square opaque image. Android/iOS will mask it.
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          style={{
            width: validSize * 0.6 + 'px',
            height: validSize * 0.6 + 'px',
            color: 'white',
          }}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Temple Tower (Gopuram) Stylized Shape */}
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
      width: validSize,
      height: validSize,
    }
  );
}
