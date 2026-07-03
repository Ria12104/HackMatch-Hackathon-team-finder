# HackMatch

HackMatch is a mobile-first PWA for MUJ students to find hackathon teammates before deadline panic sets in.

Original Design: [Figma Link](https://www.figma.com/design/IbiUZ5Xoo76NAbDbGbOw2f/HackMatch)

## 🎯 V1 Direction

- **Platform**: Mobile-first web/PWA first, native app later if needed.
- **Auth**: Google OAuth through Supabase (admin allowlist for admin accounts).
- **Data**: Supabase Postgres with seeded hackathons for the first test build.
- **Audience**: MUJ students only for V1.
- **Core Loop**: Public hackathon feed ➔ login to register interest ➔ profile tier 1 ➔ swipe-style teammate discovery ➔ match/chat.
- **Admin**: Supabase Google auth with an email allowlist.

---

## 📁 Project Structure

This project is configured as a monorepo workspace managed by `pnpm`:

- `apps/web/`: Next.js frontend application (App Router).
  - `src/components/screens/`: Frontend interactive screens (Auth, Teammate Discovery, Hackathon Dashboard, Chat, etc.).
  - `src/services/`: Mock data service stubs (Auth, Chat, Hackathons, Matches, Users).
  - `BACKEND.md`: Supabase integration guide for connecting a real backend database and authentication.
- `packages/shared/`: Shared TypeScript types and configuration options.
- `supabase/`: Database schema, migrations, and Edge Functions configuration.

---

## 🚀 Getting Started

1. **Install dependencies** using `pnpm` from the root directory:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   Copy the example environment template into the web app:
   ```bash
   cp .env.example apps/web/.env.local
   ```

3. **Start the local development server**:
   ```bash
   pnpm dev
   ```

4. **Open the application**:
   The frontend will be available at [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port `3000` is already in use).

> [!NOTE]
> The default scaffold runs entirely on mock data. For connecting and configuring your personal local database, please refer to the database setup guide in [docs/CONTRIBUTING.md](file:///c:/Users/Ria/OneDrive/Desktop/MUJ/Projects/HackMatch/HackMatch/docs/CONTRIBUTING.md).

---

## 🗺️ Routing & Pages

Here are the core App Router routes mapped to the UI screen components:

| Page | Path | Description |
|------|------|-------------|
| **Dashboard** | `/` | Shows featured hackathons, category filters, and upcoming events. |
| **Login** | `/login` | Authentication page (simulated via mock stubs). |
| **Setup Profile** | `/profile/setup` | Screen to setup profile name, role, and skills before matching. |
| **User Profile** | `/profile` | Displays details of the current user's profile and matching status. |
| **Add Hackathon** | `/hackathons/add` | Allows authenticated users to add a new hackathon. |
| **Hackathon Detail** | `/hackathons/[id]` | Event overview, prize details, tags, and rules. |
| **Teammate Discovery** | `/hackathons/[id]/discover` | The Tinder-style swiping interface to discover potential teammates. |
| **Matches List** | `/matches` | View all active matches and connections. |
| **Chat Room** | `/matches/[matchId]/chat` | Interactive chat screen with mock auto-replies. |
| **Team Screen** | `/matches/[matchId]/team` | Shared team view to review common interests, skills, and details. |
