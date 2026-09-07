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

  async function getVerifiedUser() {
    const attempts = 2;
    for (let i = 0; i < attempts; i++) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error) return user;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
    // Fail closed — treat as unauthenticated
    return null;
  }

  async function getProfileRole(userId: string) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (!error && data) return data.role;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 200));
    }
    return null;
  }

  const user = await getVerifiedUser();
  const path = request.nextUrl.pathname;

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
    const role = await getProfileRole(user.id);
    if (role !== 'admin') {
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
      const role = await getProfileRole(user.id);
      if (role !== 'seller' && role !== 'admin') {
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
