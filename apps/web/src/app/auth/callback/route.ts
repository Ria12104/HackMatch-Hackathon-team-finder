import { createClient, type User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { safeRelativePath } from "@/lib/safe-redirect";

/**
 * Server-side OAuth / PKCE callback handler.
 *
 * Google redirects here with ?code=... after the user approves.
 * The server client reads the PKCE verifier from cookies (stored there
 * by the browser client when signInWithOAuth was called), exchanges the
 * code for a session, and writes the session cookies to the response.
 *
 * Also stamps app_metadata.role = 'admin' for emails in ADMIN_EMAILS env var.
 * This runs on every sign-in (idempotent — same value written each time).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRelativePath(searchParams.get("next"));
  const error = searchParams.get("error_description") ?? searchParams.get("error");

  if (error) {
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("error", "Missing auth code from Google.");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createServerSupabaseClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("error", exchangeError.message);
    return NextResponse.redirect(redirectUrl);
  }

  // Get the user once — passed to maybeGrantAdmin to avoid a second getUser() call.
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  // Grant admin role if this user's email is in the ADMIN_EMAILS env var.
  // Uses service role so we can write app_metadata (anon/user keys can't do this).
  if (user) await maybeGrantAdmin(user);

  let finalNext = next;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, deleted_at, avatar_url")
      .eq("id", user.id)
      .single();

    if (profile) {
      // Assign a default avatar if the user has no photo (Google account without
      // a profile picture). Uses DiceBear seeded by user ID — deterministic so
      // the same user always gets the same avatar until they upload their own.
      if (!profile.avatar_url) {
        const defaultAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear`;
        await supabase
          .from("profiles")
          .update({ avatar_url: defaultAvatar })
          .eq("id", user.id);
      }

      if (profile.deleted_at) {
        // Reactivate soft-deleted profile using service role client to bypass RLS UPDATE restrictions.
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (serviceRoleKey && supabaseUrl) {
          const adminClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false },
          });
          await adminClient
            .from("profiles")
            .update({ deleted_at: null })
            .eq("id", user.id);
        }

        // Redirect to target next path with reactivated query param.
        try {
          const nextUrl = new URL(next, origin);
          nextUrl.searchParams.set("reactivated", "true");
          finalNext = nextUrl.pathname + nextUrl.search;
        } catch {
          finalNext = "/?reactivated=true";
        }
      } else if (!profile.onboarding_completed) {
        finalNext = `/profile/setup?next=${encodeURIComponent(next)}`;
      }
    }
  }

  // Ensure redirect target is a safe same-origin relative path (guards against
  // open redirect via protocol-relative / backslash-tricked `next` values).
  const safeNext = safeRelativePath(finalNext);
  return NextResponse.redirect(new URL(safeNext, origin));
}

/**
 * Stamps app_metadata.role = 'admin' for emails listed in ADMIN_EMAILS.
 * Only writes when the role actually needs to change (idempotent).
 * Requires Google provider or a confirmed email — guards against self-grant
 * if email/password auth is ever enabled without confirmation.
 *
 * Accepts the already-fetched User so we never call getUser() twice per request.
 */
async function maybeGrantAdmin(user: User) {
  const adminEmailsRaw = process.env.ADMIN_EMAILS ?? "";
  if (!adminEmailsRaw) return;

  const adminEmails = new Set(
    adminEmailsRaw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  );
  if (adminEmails.size === 0) return;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) return;

  const userEmail = user.email?.toLowerCase() ?? "";
  const isGoogleVerified = user.app_metadata?.provider === "google" || user.email_confirmed_at != null;
  const shouldBeAdmin = adminEmails.has(userEmail) && isGoogleVerified;

  // Only write if the role needs to change — avoids a write on every normal login.
  const currentRole = (user.app_metadata as Record<string, unknown>)?.role;
  const targetRole = shouldBeAdmin ? "admin" : undefined;
  if (currentRole === targetRole) return;

  // service_role key is needed to write app_metadata — never expose this client to the browser.
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  await adminClient.auth.admin.updateUserById(user.id, {
    app_metadata: { role: shouldBeAdmin ? "admin" : null },
  });
}
