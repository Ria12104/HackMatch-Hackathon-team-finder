import Link from "next/link";
import { Compass, ArrowRight, Award, Globe, Cpu, Trophy, type LucideIcon } from "lucide-react";
import { hackathons } from "@/lib/mock-data";

const hackathonIcons: Record<string, { icon: LucideIcon; bg: string }> = {
  "code-carnival":    { icon: Award, bg: "#f5e6d3" },
  "build-for-bharat": { icon: Globe, bg: "#d3e8f5" },
  "ai-night":         { icon: Cpu, bg: "#e8d3f5" },
};

export default function DiscoverSelectorPage() {
  return (
    <main className="page-stack">
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p className="eyebrow">Matchmaking</p>
        <h2 style={{ fontSize: 26, fontWeight: 900 }}>Select a Hackathon</h2>
        <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
          Teammate swiping is organized by event. Select a hackathon below to start discovering builders and forming teams!
        </p>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
        {hackathons.map((h) => {
          const iconConfig = hackathonIcons[h.slug] ?? { icon: Trophy, bg: "#f0ebe8" };
          const IconComponent = iconConfig.icon;
          const locationLabel = h.locationType === "online" ? "Online" : `${h.locationType === "hybrid" ? "Hybrid" : "Offline"}`;

          return (
            <Link
              key={h.id}
              href={`/discover/${h.slug}`}
              className="hackathon-list-card"
              style={{ padding: "18px 16px" }}
            >
              <div
                className="hackathon-list-icon"
                style={{ background: iconConfig.bg }}
                aria-hidden="true"
              >
                <IconComponent size={20} color="var(--primary)" />
              </div>
              <div className="hackathon-list-info">
                <h4 style={{ fontSize: 16, fontWeight: 800 }}>{h.name}</h4>
                <p style={{ fontSize: 13, color: "var(--on-surface-variant)" }}>
                  {locationLabel} · {h.lookingCount} builders looking
                </p>
              </div>
              <span
                style={{
                  color: "var(--primary)",
                  display: "grid",
                  placeItems: "center",
                  background: "var(--primary-container)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%"
                }}
              >
                <ArrowRight size={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
