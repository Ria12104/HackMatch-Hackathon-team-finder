import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HackathonCard } from "@/components/hackathon-card";
import { hackathons } from "@/lib/mock-data";

export default function HackathonsPage() {
  return (
    <main className="page-stack">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--on-surface-variant)",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} />
          Home
        </Link>
      </div>

      <section className="welcome-header">
        <h2>All Hackathons</h2>
        <p>Browse upcoming events and find teammates for the ones you want to join.</p>
      </section>

      <section className="hackathon-grid" aria-label="Hackathons">
        {hackathons.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} />
        ))}
      </section>
    </main>
  );
}
