import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  try {
    const { width, height } = params;
    
    // Parse width and height, with defaults
    const w = parseInt(width) || 400;
    const h = parseInt(height) || 400;
    
    // Validate dimensions
    if (w < 1 || w > 2000 || h < 1 || h > 2000) {
      return new NextResponse('Invalid dimensions', { status: 400 });
    }
    
    // Create a simple SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#F3F4F6"/>
        <rect x="${w * 0.1}" y="${h * 0.3}" width="${w * 0.8}" height="${h * 0.4}" fill="#D1D5DB"/>
        <rect x="${w * 0.4}" y="${h * 0.4}" width="${w * 0.2}" height="${h * 0.1}" fill="#9CA3AF"/>
        <text x="${w / 2}" y="${h / 2 + 5}" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="${Math.min(w, h) * 0.1}">${w} × ${h}</text>
      </svg>
    `.trim();
    
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
