import Link from "next/link";
import { CalendarDays, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import type { Hackathon } from "@pairup/shared";
import { formatDateRange } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  verified: "Verified",
  rejected: "Rejected",
  past: "Past",
  cancelled: "Cancelled",
};

function formatLocation(hackathon: Hackathon): string {
  if (hackathon.locationType === "online") return "Online";
  const parts = [hackathon.venue, hackathon.city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "In-Person";
}

export function HackathonCard({ hackathon }: Readonly<{ hackathon: Hackathon }>) {
  return (
    <article className="hackathon-card">
      <div className="card-header">
        <div>
          <h3>{hackathon.name}</h3>
          <p>{hackathon.organizer}</p>
        </div>
        <span className={`status-pill ${hackathon.status}`}>
          <ShieldCheck size={14} />
          {STATUS_LABELS[hackathon.status] ?? hackathon.status}
        </span>
      </div>

      <div className="meta-grid">
        <span className="meta-item">
          <CalendarDays size={16} />
          {formatDateRange(hackathon.startDate, hackathon.endDate)}
        </span>
        <span className="meta-item">
          <MapPin size={16} />
          {formatLocation(hackathon)}
        </span>
        <span className="meta-item">
          <UsersRound size={16} />
          {hackathon.lookingCount} students looking · {hackathon.teamsFormingCount} teams forming
        </span>
      </div>

      <div className="card-actions">
        <Link className="primary-button" href={`/hackathons/${hackathon.slug}`}>
          View details
        </Link>
        <Link className="ghost-button" href={`/discover/${hackathon.slug}`}>
          Find teammates
        </Link>
      </div>
    </article>
  );
}
