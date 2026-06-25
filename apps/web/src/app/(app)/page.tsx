import Link from "next/link";
import type { Hackathon } from "@pairup/shared";
import { Search, Bookmark, Filter } from "lucide-react";
import { hackathons } from "@/lib/mock-data";

const categories = ["All", "AI & ML", "Web3", "HealthTech", "Fintech", "Open"];

const hackathonIcons: Record<string, { emoji: string; bg: string }> = {
  "code-carnival":    { emoji: "🎪", bg: "#f5e6d3" },
  "build-for-bharat": { emoji: "🇮🇳", bg: "#d3e8f5" },
  "ai-night":         { emoji: "🤖", bg: "#e8d3f5" },
};

export default function HomePage() {
  const featured = hackathons[0];
  const upcoming = hackathons.slice(1);

  return (
    <>
      {/* Top bar */}
      <header className="top-bar">
        <span className="brand-name">HackMatch</span>
        <div className="top-bar-actions">
          <button className="icon-button" type="button" aria-label="Search">
            <Search size={18} />
          </button>
          <Link href="/login" className="sign-in-button">Sign in</Link>
        </div>
      </header>

      <main className="page-stack">
        {/* Welcome */}
        <div className="welcome-header">
          <h2>Welcome back, Alex 👋</h2>
          <p>Ready to build something amazing today?</p>
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
              const icon = hackathonIcons[h.slug] ?? { emoji: "🏆", bg: "#f0ebe8" };
              const locationLabel = h.locationType === "online" ? "Online" : `${h.locationType === "hybrid" ? "Hybrid" : "Offline"}`;
              return (
                <Link key={h.id} href={`/hackathons/${h.slug}`} className="hackathon-list-card">
                  <div
                    className="hackathon-list-icon"
                    style={{ background: icon.bg }}
                    aria-hidden="true"
                  >
                    {icon.emoji}
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
