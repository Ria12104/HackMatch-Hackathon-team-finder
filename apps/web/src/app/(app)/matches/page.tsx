import { Users, Sparkles } from "lucide-react";

/**
 * Matches stub placeholder until the real swipe/match backend ships.
 * Prevents the bottom-nav "Matches" link from 404-ing for logged-in users.
 */
export default function MatchesPage() {
  return (
    <main className="page-stack" style={{ justifyContent: "center", alignItems: "center", minHeight: "70vh", textAlign: "center" }}>
      <section className="surface-panel" style={{ padding: "48px 32px", display: "grid", gap: 20, maxWidth: 360, margin: "0 auto" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--primary-container)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto",
          }}
        >
          <Users size={28} color="var(--primary)" />
        </div>

        <div>
          <p className="eyebrow">Coming Soon</p>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>Matches</h1>
          <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.6, marginTop: 8 }}>
            When you and another builder both swipe right, you&apos;ll appear here.
            Swipe on the Discover tab to start matching!
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
            fontSize: 13,
            color: "var(--on-surface-variant)",
            background: "var(--surface-container)",
            padding: "10px 16px",
            borderRadius: "var(--radius-full)",
          }}
        >
          <Sparkles size={14} color="var(--primary)" />
          Match notifications coming in the next update
        </div>
      </section>
    </main>
  );
}
