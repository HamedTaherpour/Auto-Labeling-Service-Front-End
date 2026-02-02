import { NextRequest, NextResponse } from 'next/server';

// Mock image serving endpoint
// In a real application, this would serve actual uploaded files
export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const fileId = params.fileId;

  // Create a deterministic but varied SVG placeholder based on fileId
  // This ensures the same fileId always shows the same "image" but different files look different
  const hash = fileId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];

  const bgColor = colors[Math.abs(hash) % colors.length];
  const textColor = '#ffffff';

  const svgPlaceholder = `
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="${bgColor}22" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.1"/>
      <circle cx="600" cy="350" r="150" fill="${bgColor}33" opacity="0.7"/>
      <circle cx="600" cy="350" r="80" fill="${bgColor}66"/>
      <text x="50%" y="45%" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="${textColor}" text-anchor="middle">
        Sample Image
      </text>
      <text x="50%" y="55%" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="${textColor}cc" text-anchor="middle">
        File: ${fileId}
      </text>
      <text x="50%" y="85%" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="${textColor}88" text-anchor="middle">
        This is a placeholder image for the annotation editor
      </text>
    </svg>
  `;

  return new NextResponse(svgPlaceholder, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}