import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ────────────────────────────────────────────────────────────
// NEW ➜ declare the languages we support
const LOCALES = ['en', 'zh'] as const;
// Helpers
const stripLeadingSlash = (p: string) => (p.startsWith('/') ? p.slice(1) : p);

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ────────────────────────────────────────────────────────────
  // 0.  Detect locale segment & redirect to default ('zh') when missing
  // ────────────────────────────────────────────────────────────
  const { pathname: rawPathname } = request.nextUrl;
  const pathParts = stripLeadingSlash(rawPathname).split('/');
  const firstSegment = pathParts[0] || '';
  const localeInPath = LOCALES.includes(firstSegment as any) ? firstSegment : null;

  // Do NOT locale‑redirect API, _next, auth, etc.
  const redirectExemptPrefixes = [
    'api',
    '_next',
    'favicon.ico',
    'images',
    'auth',
  ];
  const needsLocaleRedirect =
    !localeInPath && !redirectExemptPrefixes.includes(firstSegment);

  if (needsLocaleRedirect) {
    const url = request.nextUrl.clone();
    url.pathname = `/zh${rawPathname}`;
    return NextResponse.redirect(url);
  }

  // Keep a version of the path **without** locale for the old auth logic
  const pathname =
    localeInPath ? `/${pathParts.slice(1).join('/')}` : rawPathname;

  // ────────────────────────────────────────────────────────────
  // 1. Supabase client (unchanged)
  // ────────────────────────────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ────────────────────────────────────────────────────────────
  // 2.  Auth‑related routing (same logic, but uses `pathname` w/o locale)
  // ────────────────────────────────────────────────────────────
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
  ];

  const authPages = ['/', '/auth/login', '/auth/signup'];

  const isProtectedRoute = !publicPaths.some(
    (path) => pathname === path || (path !== '/' && pathname.startsWith(path)),
  );

  // Handle root path with language prefix
  if (pathname === '/' && localeInPath) {
    const url = request.nextUrl.clone();
    if (user) {
      url.pathname = `/${localeInPath}/home`;
    } else {
      url.pathname = `/${localeInPath}/auth/login`;
    }
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localeInPath ?? 'zh'}/auth/login`;
    if (pathname !== '/') url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }

  if (user && authPages.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localeInPath ?? 'zh'}/home`; // keep locale in redirect
    return NextResponse.redirect(url);
  }

  return response;
}

// ────────────────────────────────────────────────────────────
// Matcher stays exactly the same
// ────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|auth/forgot-password).*)',
  ],
};
