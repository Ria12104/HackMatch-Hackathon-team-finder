'use client';

// =============================================================================
// Hackathon Dashboard — Home Screen
// =============================================================================
// Shows a featured hackathon card, filter pills, and the upcoming list.
//
// BACKEND INTEGRATION:
//   Currently uses mockHackathons from constants/mockData.ts.
//   When the backend is ready:
//     1. Open src/services/hackathonService.ts
//     2. Replace getHackathons() with a real fetch() call
//     3. Call it in a useEffect here (or replace with React Query)
//     Example:
//       const [hackathons, setHackathons] = useState<Hackathon[]>([]);
//       useEffect(() => { getHackathons().then(setHackathons); }, []);
// =============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bookmark, Plus } from 'lucide-react';

import { useAppState }  from '@/context/AppContext';
import type { Hackathon } from '@/types';
import { mockHackathons } from '@/constants/mockData';
import { ROSE, DEEP, PEACH, CASHMERE, BG, TEXT, SUBT, BORDER, TAN } from '@/constants/palette';

// ---------------------------------------------------------------------------
// Filter configuration — add new filter tags here
// ---------------------------------------------------------------------------
const FILTERS = ['All', 'AI & ML', 'Web3', 'HealthTech', 'GreenTech'] as const;
type Filter = typeof FILTERS[number];

/** Maps a filter label to the tag strings that match it in hackathon.tags */
const FILTER_TAG_MAP: Record<Filter, string[]> = {
  'All':        [],
  'AI & ML':    ['AI', 'AI/ML', 'OpenAI'],
  'Web3':       ['Web3', 'DeFi', 'Blockchain'],
  'HealthTech': ['HealthTech', 'MedTech'],
  'GreenTech':  ['GreenTech', 'Sustainability', 'IoT'],
};

// ---------------------------------------------------------------------------
// Featured Card
// ---------------------------------------------------------------------------
function FeaturedCard({ h, onClick }: { h: Hackathon; onClick: () => void }) {
  return (
    // div instead of button — FeaturedCard contains a <button> child ("Join Team"),
    // and HTML does not allow button inside button.
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className="w-full text-left rounded-3xl overflow-hidden cursor-pointer"
      style={{ background: TAN }}
    >
      {/* Illustration area */}
      <div className="relative h-40 mx-3 mt-3 rounded-2xl overflow-hidden" style={{ background: CASHMERE }}>
        {/* Decorative shapes */}
        <div className="absolute bottom-0 right-4 w-16 h-28 rounded-full opacity-40" style={{ background: '#8BAF8A' }} />
        <div className="absolute bottom-0 right-12 w-10 h-20 rounded-full opacity-30" style={{ background: '#6B8F6A' }} />
        <div className="absolute bottom-0 left-4 w-12 h-24 rounded-full opacity-35" style={{ background: '#9BBF9A' }} />
        <div className="absolute bottom-3 left-10 w-8 h-12 rounded-t-full opacity-50" style={{ background: '#D4A882' }} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: PEACH, color: DEEP }}>
            FEATURED
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 bg-white/80" style={{ color: TEXT }}>
            📅 In 3 days
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4">
        <h3 className="font-serif font-bold text-white text-xl leading-tight mb-1">{h.name}</h3>
        <p className="text-white/75 text-xs leading-relaxed mb-3 line-clamp-2">{h.description}</p>
        <div className="flex items-center justify-between">
          {/* Participant avatars */}
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {['#D4A882', '#B88C7A', '#C9A272'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#C9A882]" style={{ background: c }} />
              ))}
            </div>
            <span className="text-white/80 text-xs font-medium">{h.participants}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            className="px-5 py-2 rounded-full text-white text-sm font-semibold"
            style={{ background: DEEP }}
          >
            Join Team
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// List Card (non-featured hackathons)
// ---------------------------------------------------------------------------
/** Icon and colour per card index, cycling every 5 */
const CARD_ICON_COLORS = ['#C9A882', '#7A9E8A', '#C38C91', '#FDBE81', '#A88BC9'];
const CARD_ICONS       = ['🌿', '🤖', '🏥', '⛓️', '💊'];

function ListCard({ h, onClick }: { h: Hackathon; onClick: () => void }) {
  const idx = (parseInt(h.id, 10) - 1) % 5;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white text-left"
      style={{ boxShadow: '0 1px 6px rgba(195,140,145,0.10)' }}
    >
      <div
        className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center"
        style={{ background: CARD_ICON_COLORS[idx] }}
      >
        <span className="text-white text-lg">{CARD_ICONS[idx]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-sm font-semibold truncate" style={{ color: TEXT }}>{h.name}</p>
        <p className="text-xs mt-0.5" style={{ color: SUBT }}>
          {h.mode} · {h.participants} participants
        </p>
        <div className="flex gap-1.5 mt-1.5">
          {h.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[9px] uppercase font-semibold tracking-wide px-1.5 py-0.5 rounded"
              style={{ background: '#F9EDEA', color: SUBT }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <Bookmark size={16} style={{ color: BORDER, flexShrink: 0 }} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Screen
// ---------------------------------------------------------------------------
export function HackathonDashboard() {
  const router = useRouter();
  const { isAuthenticated, matches } = useAppState();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const featured  = mockHackathons.find(h => h.isFeatured);

  // Apply filter: if 'All', show everything; otherwise match on tags
  const listHacks = mockHackathons.filter(h => {
    if (h.isFeatured) return false; // featured card is shown separately
    if (activeFilter === 'All') return true;
    const allowedTags = FILTER_TAG_MAP[activeFilter];
    return h.tags.some(t => allowedTags.includes(t));
  });

  return (
    <div className="h-full flex flex-col relative" style={{ background: BG }}>
      <div className="flex-1 overflow-y-auto pb-20">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h1 className="font-serif font-bold text-xl" style={{ color: ROSE }}>HackMatch</h1>
          <div className="flex items-center gap-3">
            <button className="p-2" style={{ color: TEXT }}>
              <Search size={20} />
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => router.push('/profile')}
                className="w-9 h-9 rounded-full overflow-hidden border-2"
                style={{ borderColor: ROSE, background: CASHMERE }}
              >
                <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: DEEP }}>
                  AC
                </div>
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ background: DEEP }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* ── Welcome ── */}
        <div className="px-5 pt-2 pb-4">
          <h2 className="font-serif text-2xl font-bold leading-tight" style={{ color: TEXT }}>
            Welcome back, Alex
          </h2>
          <p className="text-sm mt-0.5" style={{ color: SUBT }}>Ready to build something amazing today?</p>
        </div>

        {/* ── Featured card ── */}
        {featured && (
          <div className="px-4 mb-5">
            <FeaturedCard
              h={featured}
              onClick={() => router.push(`/hackathons/${featured.id}`)}
            />
          </div>
        )}

        {/* ── Filter pills ── */}
        <div className="flex gap-2 px-4 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={activeFilter === f
                ? { background: DEEP, color: 'white' }
                : { background: 'white', color: SUBT, border: `1px solid ${BORDER}` }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Hackathon list ── */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-bold text-lg" style={{ color: TEXT }}>Upcoming Hackathons</h3>
            <button className="text-sm font-medium" style={{ color: ROSE }} onClick={() => router.push('/hackathons')}>
              View all
            </button>
          </div>

          {listHacks.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: SUBT }}>
              No hackathons match this filter.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {listHacks.map(h => (
                <ListCard key={h.id} h={h} onClick={() => router.push(`/hackathons/${h.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FAB: Add hackathon (auth only) ── */}
      {isAuthenticated && (
        <button
          onClick={() => router.push('/hackathons/add')}
          className="absolute right-5 bottom-24 w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg z-40"
          style={{ background: DEEP }}
        >
          <Plus size={20} />
        </button>
      )}

    </div>
  );
}
