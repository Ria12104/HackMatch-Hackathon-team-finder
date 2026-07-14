import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield size={28} color="var(--primary)" />
          </div>

          <div style={{ textAlign: "center" }}>
            <p className="eyebrow">PairUp Policies</p>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>Privacy Policy</h1>
          </div>

          <div style={{ fontSize: 14, color: "var(--on-surface)", lineHeight: 1.6, display: "grid", gap: 16 }}>
            <p>
              Your privacy matters. Here is how we handle your data:
            </p>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>1. Data Sharing Control</h2>
            <p>
              Your contact information (email and phone number) remains private. Other builders can only view your name, role, skills, and links until a match occurs.
            </p>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>2. Third-Party Auth</h2>
            <p>
              We authenticate strictly via Google OAuth. We do not store your passwords or Google credentials.
            </p>
            <p style={{ color: "var(--on-surface-variant)", fontSize: 13 }}>
              Last updated: July 2026. For inquiries, contact support at PairUp.
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
