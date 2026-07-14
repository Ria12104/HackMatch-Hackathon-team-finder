"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, X, Heart, RefreshCw, Compass, Zap } from "lucide-react";
import type { Hackathon } from "@pairup/shared";

interface Teammate {
  id: string;
  display_name: string;
  year?: string;
  branch?: string;
  primary_role?: string;
  skills?: string[];
  looking_for_roles?: string[];
  availability?: string;
  bio?: string;
}

interface DiscoverClientProps {
  hackathon: Hackathon;
  isAuthenticated: boolean;
  teammates: Teammate[];
  slug: string;
}

export function DiscoverClient({
  hackathon,
  isAuthenticated,
  teammates,
  slug,
}: Readonly<DiscoverClientProps>) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleGoogleLogin() {
    const nextPath = `/discover/${slug}`;
    router.push(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  // Swipe handlers (mock for Person 2 integration)
  function handleSwipe(direction: "left" | "right") {
    if (currentIndex < teammates.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  // ── 1. Unauthenticated State (Ghost cards + Login modal) ──
  if (!isAuthenticated) {
    return (
      <>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 4px" }}>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--on-surface-variant)" }}
          >
            <ArrowLeft size={18} />
            {hackathon.name}
          </Link>
        </div>

        <main className="page-stack" style={{ position: "relative", minHeight: "80vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="eyebrow">Discover Teammates</p>
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>Find Partners</h2>
            </div>
          </div>

          {/* Ghost Swipe Deck */}
          <div className="swipe-stage" style={{ filter: "blur(2px)", pointerEvents: "none", opacity: 0.6 }}>
            <div className="candidate-card" style={{ zIndex: 3 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="avatar">JD</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>John Doe</h3>
                  <p style={{ fontSize: 13, color: "var(--on-surface-variant)" }}>3rd Year · CS</p>
                </div>
              </div>
              <div>
                <p className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>Primary Role</p>
                <strong style={{ fontSize: 15 }}>Full Stack Developer</strong>
              </div>
              <div className="tag-list">
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">Postgres</span>
              </div>
              <div>
                <p className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Bio</p>
                <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.4 }}>
                  Working on a couple of projects, love scaling databases...
                </p>
              </div>
            </div>
            <div className="candidate-card" style={{ zIndex: 2 }} />
            <div className="candidate-card" style={{ zIndex: 1 }} />
          </div>

          {/* Centered Premium Auth Modal */}
          <div className="auth-modal-backdrop">
            <div className="auth-modal">
              <div style={{ background: "rgba(124, 29, 44, 0.08)", width: 50, height: 50, borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto" }}>
                <Sparkles size={24} color="var(--primary)" />
              </div>
              <h3>Find Your Team</h3>
              <p>
                Log in to view potential teammates, filter profiles by tech stack, and swipe to build your hackathon dream team!
              </p>
              <button onClick={handleGoogleLogin} className="google-btn" style={{ background: "var(--primary)", color: "#fff", border: "none" }}>
                Continue with Google
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── 2. Authenticated State ──
  const activeTeammate = teammates[currentIndex];

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 4px" }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--on-surface-variant)" }}
        >
          <ArrowLeft size={18} />
          {hackathon.name}
        </Link>
      </div>

      <main className="page-stack" style={{ minHeight: "80vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="eyebrow">Discover Teammates</p>
            <h2 style={{ fontSize: 24, fontWeight: 900 }}>Find Partners</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface-container)", padding: "6px 12px", borderRadius: "var(--radius-full)", fontSize: 12, fontWeight: 700 }}>
            <Zap size={13} fill="currentColor" style={{ color: "var(--primary)" }} />
            20 credits left
          </div>
        </div>

        {currentIndex < teammates.length ? (
          <div className="swipe-stage">
            {/* Active Card */}
            <div className="candidate-card" style={{ zIndex: 10, background: "var(--surface-lowest)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="avatar">
                  {activeTeammate.display_name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 900 }}>{activeTeammate.display_name}</h3>
                  <p style={{ fontSize: 13, color: "var(--on-surface-variant)" }}>
                    {activeTeammate.year ? `${activeTeammate.year} Year` : ""} {activeTeammate.branch ? `· ${activeTeammate.branch}` : ""}
                  </p>
                </div>
              </div>

              {activeTeammate.primary_role && (
                <div>
                  <p className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Primary Role</p>
                  <strong style={{ fontSize: 16, color: "var(--primary)" }}>{activeTeammate.primary_role}</strong>
                </div>
              )}

              {activeTeammate.skills && activeTeammate.skills.length > 0 && (
                <div>
                  <p className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>Skills</p>
                  <div className="tag-list">
                    {activeTeammate.skills.map((s) => (
                      <span key={s} className="tag">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTeammate.looking_for_roles && activeTeammate.looking_for_roles.length > 0 && (
                <div>
                  <p className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>Looking For</p>
                  <div className="tag-list">
                    {activeTeammate.looking_for_roles.map((r) => (
                      <span key={r} className="tag" style={{ background: "var(--secondary-container)", color: "var(--secondary)" }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTeammate.bio && (
                <div>
                  <p className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Bio</p>
                  <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
                    {activeTeammate.bio}
                  </p>
                </div>
              )}

              {activeTeammate.availability && (
                <div>
                  <p className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>Availability</p>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>⏱️ {activeTeammate.availability}</p>
                </div>
              )}
            </div>

            {/* Behind Cards for Stack Effect */}
            {currentIndex + 1 < teammates.length && (
              <div className="candidate-card" style={{ zIndex: 9, transform: "translateY(12px) scale(0.97)", opacity: 0.9 }} />
            )}
            {currentIndex + 2 < teammates.length && (
              <div className="candidate-card" style={{ zIndex: 8, transform: "translateY(24px) scale(0.94)", opacity: 0.8 }} />
            )}

            {/* Swipe Action Buttons */}
            <div className="swipe-actions">
              <button
                onClick={() => handleSwipe("left")}
                className="icon-button"
                style={{ background: "#fff", border: "1.5px solid var(--outline-variant)", color: "var(--on-surface-variant)" }}
                aria-label="Skip"
              >
                <X size={26} />
              </button>
              <button
                onClick={() => handleSwipe("right")}
                className="icon-button"
                style={{ background: "var(--primary)", border: "none", color: "#fff" }}
                aria-label="Like"
              >
                <Heart size={26} fill="#fff" />
              </button>
            </div>
          </div>
        ) : (
          <div className="surface-panel" style={{ display: "grid", gap: 16, textAlign: "center", padding: "40px 20px" }}>
            <div style={{ background: "rgba(124, 29, 44, 0.08)", width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto" }}>
              <Compass size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900 }}>No More Candidates</h3>
            <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
              You&apos;ve swiped through everyone registered for this event! Check back later as more students sign up.
            </p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="ghost-button"
              style={{ margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}
            >
              <RefreshCw size={16} />
              Start Over
            </button>
          </div>
        )}
      </main>
    </>
  );
}
