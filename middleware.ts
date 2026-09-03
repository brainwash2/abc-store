import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  console.log('MIDDLEWARE path:', path);
  console.log('MIDDLEWARE cookies:', request.cookies.getAll().map(c => c.name));
  console.log('MIDDLEWARE user:', user?.email || 'NO USER', 'error:', error?.message || 'none');

  const copyCookies = (response: NextResponse) => {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie);
    });
    return response;
  };

  if (path.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', path);
      return copyCookies(NextResponse.redirect(loginUrl));
    }
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !isAdmin) {
      return copyCookies(NextResponse.redirect(new URL('/user/dashboard', request.url)));
    }
  }

  if (path.startsWith('/seller')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', path);
      return copyCookies(NextResponse.redirect(loginUrl));
    }

    if (path !== '/seller/apply') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) {
        return copyCookies(NextResponse.redirect(new URL('/user/dashboard', request.url)));
      }
    }
  }

  if (path.startsWith('/user')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', path);
      return copyCookies(NextResponse.redirect(loginUrl));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/seller/:path*'],
};
