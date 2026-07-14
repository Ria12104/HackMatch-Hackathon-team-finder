import Link from "next/link";
import type { Hackathon } from "@pairup/shared";
import { Search, Bookmark, Filter, Award, Globe, Cpu, Trophy, type LucideIcon } from "lucide-react";
import { hackathons } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HomeGreeting } from "@/components/home-greeting";

const categories = ["All", "AI & ML", "Web3", "HealthTech", "Fintech", "Open"];

const hackathonIcons: Record<string, { icon: LucideIcon; bg: string }> = {
  "code-carnival":    { icon: Award, bg: "#f5e6d3" },
  "build-for-bharat": { icon: Globe, bg: "#d3e8f5" },
  "ai-night":         { icon: Cpu, bg: "#e8d3f5" },
};

export default async function HomePage() {
  const featured = hackathons[0];
  const upcoming = hackathons.slice(1);

  // Check user session & profile server-side
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, onboarding_completed")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const welcomeName = profile?.display_name ?? user?.email?.split("@")[0] ?? "there";
  const userInitials = welcomeName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const isFirstTime = profile ? !profile.onboarding_completed : true;

  return (
    <>
      {/* Top bar */}
      <header className="top-bar">
        <span className="brand-name">PairUp</span>
        <div className="top-bar-actions">
          <button className="icon-button" type="button" aria-label="Search">
            <Search size={18} />
          </button>
          {user ? (
            <Link
              href="/profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
                border: "1.5px solid var(--outline-variant)"
              }}
              title="View Profile"
            >
              {userInitials || "U"}
            </Link>
          ) : (
            <Link href="/login" className="sign-in-button">Sign in</Link>
          )}
        </div>
      </header>

      <main className="page-stack">
        {/* Welcome */}
        <div className="welcome-header">
          {user ? (
            <HomeGreeting name={welcomeName} isFirstTime={isFirstTime} />
          ) : (
            <>
              <h2>Find Your Dream Team</h2>
              <p>Sign in to start matching with top hackathon builders.</p>
            </>
          )}
        </div>

        {/* Featured card */}
        <Link href={`/hackathons/${featured.slug}`} style={{ textDecoration: "none" }}>
          <div className="featured-card">
            <div className="featured-card-bg" />
            <div className="featured-card-shapes">
              <span /><span /><span />
            </div>
            <div className="featured-card-content">
              <div className="featured-badges">
                <span className="badge-featured">Featured</span>
                <span className="badge-time">
                  <Filter size={11} />
                  In 3 days
                </span>
              </div>
              <div>
                <div className="featured-card-title">{featured.name}</div>
                <div className="featured-card-desc" style={{ marginTop: 6 }}>
                  {featured.description.slice(0, 80)}...
                </div>
              </div>
              <div className="featured-card-footer">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="avatar-stack">
                    <div className="avatar-sm">R</div>
                    <div className="avatar-sm">A</div>
                    <div className="avatar-sm">M</div>
                  </div>
                  <span className="avatar-count">{featured.lookingCount}</span>
                </div>
                <button className="join-team-btn" type="button">Join Team</button>
              </div>
            </div>
          </div>
        </Link>

        {/* Category chips */}
        <div className="category-row" role="tablist" aria-label="Filter by category">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`cat-chip${i === 0 ? " active" : ""}`}
              type="button"
              role="tab"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Upcoming section */}
        <div>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <h3>Upcoming Matches</h3>
            <Link href="/hackathons" className="view-all">View all</Link>
          </div>
          <div className="hackathon-list">
            {upcoming.map((h) => {
              const iconConfig = hackathonIcons[h.slug] ?? { icon: Trophy, bg: "#f0ebe8" };
              const IconComponent = iconConfig.icon;
              const locationLabel = h.locationType === "online" ? "Online" : `${h.locationType === "hybrid" ? "Hybrid" : "Offline"}`;
              return (
                <Link key={h.id} href={`/hackathons/${h.slug}`} className="hackathon-list-card">
                  <div
                    className="hackathon-list-icon"
                    style={{ background: iconConfig.bg }}
                    aria-hidden="true"
                  >
                    <IconComponent size={20} color="var(--primary)" />
                  </div>
                  <div className="hackathon-list-info">
                    <h4>{h.name}</h4>
                    <p>{locationLabel} · {h.lookingCount} participants</p>
                    <div className="hackathon-tag-row">
                      {h.rolesWanted.slice(0, 2).map((r) => (
                        <span key={r.role} className="htag">{r.role}</span>
                      ))}
                    </div>
                  </div>
                  <span className="bookmark-btn" aria-label="Bookmark">
                    <Bookmark size={18} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
