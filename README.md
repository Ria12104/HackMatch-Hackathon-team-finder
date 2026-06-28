# HackMatch

A hackathon team finder platform designed to help participants match, form teams, and collaborate.

Original Design: [Figma Link](https://www.figma.com/design/IbiUZ5Xoo76NAbDbGbOw2f/HackMatch)

## Project Structure

- `apps/web/`: Next.js frontend application.
  - `src/components/screens/`: Frontend interactive screens (Auth, Teammate Discovery, Hackathon Dashboard, Chat, etc.).
  - `src/services/`: Mock data service stubs (Auth, Chat, Hackathons, Matches, Users).
  - `BACKEND.md`: Supabase integration guide for connecting a real backend database and authentication.

## Running the Project

1. Install dependencies from the root directory:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.