
import { NextResponse } from 'next/server';

export async function GET() {
  // Stub CSRF endpoint for executive dashboard
  // In a real implementation, this would provide CSRF tokens
  return NextResponse.json({
    csrfToken: 'executive-dashboard-stub-token'
  });
}
