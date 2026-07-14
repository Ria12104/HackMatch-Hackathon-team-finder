import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routes that require a full redirect to /login when unauthenticated.
 * - Public browsing (home, hackathon pages) is open to everyone.
 * - /profile and /matches need a real session.
 * - /discover (swipe/teammates) is accessible but shows a login *modal* client-side,
 *   so it's not hard-guarded here.
 */
const PROTECTED_PATHS = ["/profile", "/matches"];

function isProtected(pathname: string) {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

/**
 * Next.js 16+ Proxy — two jobs:
 * 1. Refresh the Supabase Auth session on every request and write the
 *    updated cookies back so browser and server stay in sync.
 * 2. Auth guard — redirect unauthenticated users away from protected routes.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Always create a fresh client per request — do NOT use a global variable.
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can write user data to
  // public space or cause security issues.
  // This refreshes the session token and keeps cookies in sync.
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // Auth guard — redirect unauthenticated users hitting protected routes to /login.
  if (!isAuthenticated && isProtected(request.nextUrl.pathname)) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users hitting /login are sent home.
  if (isAuthenticated && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT Next.js internals and static files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
