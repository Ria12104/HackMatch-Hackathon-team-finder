import Link from "next/link";
import { CalendarDays, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import type { Hackathon } from "@pairup/shared";
import { formatDateRange } from "@/lib/format";

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
          {hackathon.status}
        </span>
      </div>

      <div className="meta-grid">
        <span className="meta-item">
          <CalendarDays size={16} />
          {formatDateRange(hackathon.startDate, hackathon.endDate)}
        </span>
        <span className="meta-item">
          <MapPin size={16} />
          {hackathon.locationType === "online" ? "Online" : `${hackathon.venue}, ${hackathon.city}`}
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
