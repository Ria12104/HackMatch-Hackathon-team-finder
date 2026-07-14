"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { safeRelativePath } from "@/lib/safe-redirect";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginForm initialError={null} />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const initialError = searchParams.get("error");
  const next = safeRelativePath(searchParams.get("next"));
  return <LoginForm initialError={initialError} next={next} />;
}

function LoginForm({ initialError, next = "/" }: { initialError: string | null; next?: string }) {
  const [authError, setAuthError] = useState<string | null>(initialError);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setAuthError(null);
    setIsGoogleLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const safeNext = safeRelativePath(next);
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo }
      });

      if (error) {
        setAuthError(error.message);
        setIsGoogleLoading(false);
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Google sign-in failed");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <Link href="/" className="auth-back">
        <ArrowLeft size={18} />
        Back
      </Link>

      <div className="auth-header">
        <h1>Welcome to PairUp</h1>
        <p>Find your perfect hackathon team.</p>
      </div>

      <div className="auth-body">
        <div className="auth-divider">Log in with</div>
        <button className="google-btn" type="button" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
          {/* Google G icon */}
          <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isGoogleLoading ? "Opening Google..." : "Google"}
        </button>

        {authError && <p className="auth-error">{authError}</p>}

        <p className="auth-terms">
          By continuing you agree to our{" "}
          <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
