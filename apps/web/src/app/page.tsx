// =============================================================================
// Root Page — / route
// =============================================================================
// Renders the entire HackMatch app. The app uses its own internal state-machine
// navigation (navigate() + screen string), so no URL-based routing is needed.
// This single page hosts all screens.
//
// force-dynamic prevents Next.js from trying to statically pre-render this page
// at build time. The app is a pure client-side SPA — there is nothing to render
// on the server.
// =============================================================================

// Tell Next.js: do not pre-render this route at build time.
export const dynamic = 'force-dynamic';

import HackMatchApp from '@/components/HackMatchApp';

export default function Page() {
  return <HackMatchApp />;
}
