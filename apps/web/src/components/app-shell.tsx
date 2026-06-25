import Link from "next/link";
import { Home, Compass, Users, User } from "lucide-react";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="app-shell">
      {children}
      <nav className="bottom-nav" aria-label="Primary">
        <Link href="/" className="active">
          <Home size={22} />
          Home
        </Link>
        <Link href="/discover/code-carnival">
          <Compass size={22} />
          Discover
        </Link>
        <Link href="/matches">
          <Users size={22} />
          Matches
        </Link>
        <Link href="/profile">
          <User size={22} />
          Profile
        </Link>
      </nav>
    </div>
  );
}
