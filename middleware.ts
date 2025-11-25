import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 1. Create the response object
  const res = NextResponse.next()
  
  // 2. Initialize Supabase Client
  const supabase = createMiddlewareClient({ req, res })

  // 3. REFRESH SESSION ONLY
  // We call this to keep the user logged in (refresh cookies),
  // BUT we removed the "Redirect" logic. 
  // This stops the infinite loop immediately.
  await supabase.auth.getSession()

  return res
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
}