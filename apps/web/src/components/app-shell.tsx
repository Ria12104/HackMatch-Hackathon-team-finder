"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Users, User, X, Sparkles } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/matches", label: "Matches", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  // Initialize state based on URL parameter to avoid setting it inside useEffect
  const [showReactivatedToast, setShowReactivatedToast] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("reactivated") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (showReactivatedToast && typeof window !== "undefined") {
      // Clean up the URL search param without page reload
      const newSearch = window.location.search.replace(/[?&]reactivated=true/, "").replace(/^&/, "?");
      const newUrl = window.location.pathname + (newSearch === "?" ? "" : newSearch);
      window.history.replaceState({}, "", newUrl);

      const timer = setTimeout(() => {
        setShowReactivatedToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showReactivatedToast, pathname]);

  useEffect(() => {
    // Only show banner on app pages, not login/auth setup
    const isAppPage = !(pathname.startsWith("/login") || pathname.startsWith("/auth") || pathname.startsWith("/profile/setup"));
    if (!isAppPage) {
      const timer = setTimeout(() => setShowBanner(false), 0);
      return () => clearTimeout(timer);
    }

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("dismiss_completion_banner") === "true";
    if (isDismissed) {
      const timer = setTimeout(() => setShowBanner(false), 0);
      return () => clearTimeout(timer);
    }

    async function checkProfileCompleteness() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data: authData } = await supabase.auth.getUser();

        if (authData?.user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", authData.user.id)
            .single();

          if (error) {
            if (error.code === "PGRST116") {
              // Profile is missing or deleted from database.
              // Sign out to clear the orphaned session cookies from the browser.
              await supabase.auth.signOut();
              window.location.reload();
            }
            return;
          }

          if (profile && !profile.onboarding_completed) {
            setShowBanner(true);
          } else {
            setShowBanner(false);
          }
        } else {
          setShowBanner(false);
        }
      } catch (err) {
        console.error("Failed to check profile completeness:", err);
      }
    }

    checkProfileCompleteness();
  }, [pathname]);

  function handleDismiss() {
    sessionStorage.setItem("dismiss_completion_banner", "true");
    setShowBanner(false);
  }

  return (
    <div className="app-shell">
      {showReactivatedToast && (
        <div className="reactivated-toast">
          <Sparkles size={16} />
          Welcome back! Your profile has been reactivated.
        </div>
      )}
      {showBanner && (
        <div className="completion-banner">
          <span>Complete your profile for better teammate matches!</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/profile/setup">Complete Setup</Link>
            <button onClick={handleDismiss} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {children}
      <nav className="bottom-nav" aria-label="Primary">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link key={href} href={href} className={isActive ? "active" : undefined}>
              <Icon size={22} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
