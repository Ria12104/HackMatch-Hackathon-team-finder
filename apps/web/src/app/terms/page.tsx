import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px" }}>
      <main className="page-stack">
        <section className="surface-panel" style={{ padding: "48px 32px", display: "grid", gap: 20 }}>
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
            <ShieldAlert size={28} color="var(--primary)" />
          </div>

          <div style={{ textAlign: "center" }}>
            <p className="eyebrow">PairUp Policies</p>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>Terms of Service</h1>
          </div>

          <div style={{ fontSize: 14, color: "var(--on-surface)", lineHeight: 1.6, display: "grid", gap: 16 }}>
            <p>
              Welcome to PairUp. By using our platform, you agree to these terms:
            </p>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>1. Acceptable Use</h2>
            <p>
              You must act in good faith and respect other builders on the platform. Harassment, spam, or fake profile creation will result in immediate suspension.
            </p>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>2. Profile Content</h2>
            <p>
              You are responsible for any information, links (GitHub, LinkedIn), and projects you showcase. Maintain professional and accurate representations.
            </p>
            <p style={{ color: "var(--on-surface-variant)", fontSize: 13 }}>
              Last updated: July 2026. Custom terms apply for verified hackathons.
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Link href="/login" className="ghost-button" style={{ display: "inline-block" }}>
              Back to Login
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
