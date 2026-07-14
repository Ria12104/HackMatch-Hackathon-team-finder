"use client";

import { useMemo } from "react";

/**
 * Home greeting, rendered client-side so it uses the visitor's local time
 * (the page itself is a Server Component and would otherwise use server TZ).
 *
 * - First-time users see a "Welcome" greeting — never "Welcome back".
 * - Returning users get a rotating, time-of-day greeting (Claude-style).
 *
 * `isFirstTime` is derived on the server from how recently the profile row was
 * created (see home page). A dedicated `onboarding_completed` flag will
 * supersede that heuristic once its migration is applied.
 */
export function HomeGreeting({
  name,
  isFirstTime,
}: Readonly<{ name: string; isFirstTime: boolean }>) {
  const { title, subtitle } = useMemo(() => {
    if (isFirstTime) {
      return {
        title: `Welcome to PairUp, ${name}`,
        subtitle: "Set up your profile and find your first teammate.",
      };
    }

    const hour = new Date().getHours();
    let timeGreeting: string;
    if (hour < 5) timeGreeting = `Still up, ${name}?`;
    else if (hour < 12) timeGreeting = `Good morning, ${name}`;
    else if (hour < 17) timeGreeting = `Good afternoon, ${name}`;
    else if (hour < 22) timeGreeting = `Good evening, ${name}`;
    else timeGreeting = `Burning the midnight oil, ${name}?`;

    // Rotating subtitles — vary by day so it isn't identical every visit.
    const subtitles = [
      "Ready to build something amazing today?",
      "Who are you teaming up with next?",
      "Let's find your dream team.",
      "New builders joined since you were last here.",
      "Where should we begin?",
    ];
    const idx = new Date().getDay() % subtitles.length;

    return { title: timeGreeting, subtitle: subtitles[idx] };
  }, [name, isFirstTime]);

  return (
    <>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </>
  );
}
