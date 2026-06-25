import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import { formatDateRange } from "@/lib/format";
import { getHackathon } from "@/lib/mock-data";

const tagColorMap: Record<string, string> = {
  online: "AI & ML",
  in_person: "GreenTech",
  hybrid: "IoT",
};

export default async function HackathonDetailPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const hackathon = getHackathon(slug);
  if (!hackathon) notFound();

  const tags =
    hackathon.rolesWanted.slice(0, 3).map((r) => r.role);

  const rules = [
    `Teams of ${hackathon.teamSizeMin}–${hackathon.teamSizeMax}`,
    "All code written during event",
    "Open to all students",
    "No pre-existing projects",
  ];

  const prizeText = hackathon.teamSizeMax * 10000;

  return (
    <>
      {/* Back */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "16px 20px 4px" }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--on-surface-variant)", textDecoration: "none" }}
        >
          <ArrowLeft size={18} />
          {hackathon.organizer}
        </Link>
      </div>

      {/* Hero */}
      <div className="detail-hero">
        {/* Tags */}
        <div className="detail-tag-row">
          {tags.map((t) => (
            <span key={t} className="detail-tag">{t}</span>
          ))}
        </div>

        <h1 className="detail-title">{hackathon.name}</h1>

        {/* Meta pills */}
        <div className="detail-meta-grid">
          <div className="detail-meta-pill">
            <Calendar size={16} />
            {formatDateRange(hackathon.startDate, hackathon.endDate)}
          </div>
          <div className="detail-meta-pill">
            <MapPin size={16} />
            {hackathon.locationType === "online"
              ? "Online"
              : hackathon.locationType === "hybrid"
              ? "Hybrid"
              : "Offline"}
          </div>
          <div className="detail-meta-pill">
            <Users size={16} />
            {hackathon.teamSizeMin}–{hackathon.teamSizeMax} members
          </div>
          <div className="detail-meta-pill">
            <DollarSign size={16} />
            ₹{(prizeText).toLocaleString("en-IN")}
          </div>
        </div>

        {/* Registration deadline */}
        <div className="reg-deadline-banner">
          <Clock size={18} />
          <div>
            <div className="reg-label">Registration Deadline</div>
            <div className="reg-date">
              {new Date(hackathon.registrationDeadline).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="detail-section">
        <div className="detail-section-label">About</div>
        <p>{hackathon.description}</p>
      </div>

      {/* Rules */}
      <div className="detail-section" style={{ marginTop: 20 }}>
        <div className="detail-section-label">Rules</div>
        <div className="rules-list">
          {rules.map((rule) => (
            <div key={rule} className="rule-item">
              <CheckCircle2 size={18} className="rule-check" color="var(--success)" />
              {rule}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="detail-actions" style={{ marginTop: 24 }}>
        <Link href="/login" className="looking-btn">
          Looking For Team →
        </Link>
        <a
          href={hackathon.sourceUrl}
          className="official-reg-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          Official Registration
        </a>
      </div>
    </>
  );
}
