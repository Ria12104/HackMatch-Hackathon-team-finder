'use client';

// =============================================================================
// Teammate Discovery — Swipe Screen
// =============================================================================
// Tinder-style swipe UI for discovering potential teammates.
//
// BACKEND INTEGRATION:
//   1. Replace the local `profiles` state initialization with a call to
//      matchService.getDiscoverProfiles(selectedHackathon?.id)
//   2. In handleLike(), the swipeOnProfile() call already exists — just
//      replace the stub body in matchService.ts with a real fetch()
//   3. The match result (matched: boolean) from swipeOnProfile() drives
//      whether to show the MatchSuccess screen — no UI changes needed.
//
// See src/services/matchService.ts for endpoint details.
// =============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { MapPin, Code2, Link2, Globe, Star, ChevronsLeft, ChevronsRight, Compass } from 'lucide-react';

import { useAppState } from '@/context/AppContext';
import { MatchSuccess } from '@/components/screens/MatchSuccess';
import type { UserProfile, Match, Hackathon } from '@/types';
import { discoverProfiles } from '@/constants/mockData';
import { swipeOnProfile } from '@/services/matchService';
import { ROSE, DEEP, PEACH, CASHMERE, BG, TEXT, SUBT, BORDER } from '@/constants/palette';

// ---------------------------------------------------------------------------
// Profile Avatar — initials circle
// ---------------------------------------------------------------------------
function ProfileAvatar({ name, size = 72 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{ width: size, height: size, background: CASHMERE, border: `3px solid ${ROSE}` }}
    >
      <span className="font-serif font-bold" style={{ color: DEEP, fontSize: size * 0.28 }}>
        {initials}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Swipe Card
// ---------------------------------------------------------------------------
interface SwipeCardProps {
  profile: UserProfile;
  onLike: () => void;
  onSkip: () => void;
  isTop: boolean;
  stackIndex: number;
}

function SwipeCard({ profile: p, onLike, onSkip, isTop, stackIndex }: SwipeCardProps) {
  const x       = useMotionValue(0);
  const rotate  = useTransform(x, [-130, 130], [-8, 8]);
  const likeOp  = useTransform(x, [20, 80], [0, 1]);
  const nopeOp  = useTransform(x, [-80, -20], [1, 0]);

  const onDragEnd = async (_event: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x > 80 || info.velocity.x > 400) {
      await animate(x, 560, { duration: 0.22, ease: 'easeOut' });
      onLike();
    } else if (info.offset.x < -80 || info.velocity.x < -400) {
      await animate(x, -560, { duration: 0.22, ease: 'easeOut' });
      onSkip();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 450, damping: 32 });
    }
  };

  // Background stack cards (not interactive)
  if (!isTop) {
    return (
      <motion.div style={{
        position: 'absolute', inset: 0, borderRadius: 24, backgroundColor: 'white',
        border: `1px solid ${BORDER}`,
        scale: 1 - stackIndex * 0.03,
        y: stackIndex * 10,
        zIndex: 10 - stackIndex,
        originY: 1,
        boxShadow: '0 4px 24px rgba(195,140,145,0.10)',
      }} />
    );
  }

  // Top (interactive) card
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.55}
      onDragEnd={onDragEnd}
      style={{ position: 'absolute', inset: 0, x, rotate, zIndex: 20, cursor: 'grab', touchAction: 'none', borderRadius: 24 }}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div
        className="w-full h-full rounded-3xl overflow-y-auto bg-white"
        style={{ boxShadow: '0 4px 32px rgba(195,140,145,0.14)', border: `1px solid ${BORDER}` }}
      >
        {/* Avatar + star button */}
        <div className="flex items-start justify-between p-5 pb-3">
          <ProfileAvatar name={p.name} size={72} />
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: ROSE }}>
            <Star size={18} fill="white" color="white" />
          </button>
        </div>

        {/* Name, experience level, links */}
        <div className="px-5 pb-3">
          <h2 className="font-serif font-bold text-2xl leading-tight" style={{ color: TEXT }}>{p.name}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={13} style={{ color: SUBT }} />
            <span className="text-sm" style={{ color: SUBT }}>{p.experience} · Remote OK</span>
          </div>
          <div className="flex gap-4 mt-3">
            {[Code2, Link2, Globe].map((Icon, i) => (
              <Icon key={i} size={18} style={{ color: ROSE }} />
            ))}
          </div>
        </div>

        <div className="h-px mx-5" style={{ background: BORDER }} />

        {/* Role + bio */}
        <div className="px-5 py-3">
          <p className="font-serif font-bold text-base mb-2" style={{ color: TEXT }}>{p.role}</p>
          <p className="text-sm leading-relaxed" style={{ color: SUBT }}>{p.bio}</p>
        </div>

        <div className="h-px mx-5" style={{ background: BORDER }} />

        {/* Hackathon history */}
        <div className="px-5 py-3">
          <p className="font-serif font-bold text-sm mb-2" style={{ color: TEXT }}>Hackathon History</p>
          {p.projects.map(proj => (
            <p key={proj} className="text-sm mb-1" style={{ color: SUBT }}>· {proj}</p>
          ))}
        </div>

        <div className="h-px mx-5" style={{ background: BORDER }} />

        {/* Skills */}
        <div className="px-5 py-3">
          <div className="flex flex-wrap gap-2">
            {p.skills.map((s, i) => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-medium"
                style={i === 0
                  ? { background: PEACH, color: DEEP, border: 'none' }
                  : { background: 'white', color: TEXT, border: `1px solid ${BORDER}` }
                }
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Swipe overlays */}
      <motion.div style={{ position: 'absolute', top: 20, left: 20, opacity: likeOp, pointerEvents: 'none' }}>
        <div className="px-3 py-1 rounded-xl" style={{ border: `2.5px solid ${DEEP}` }}>
          <span className="font-bold tracking-wider text-sm" style={{ color: DEEP }}>LIKE</span>
        </div>
      </motion.div>
      <motion.div style={{ position: 'absolute', top: 20, right: 20, opacity: nopeOp, pointerEvents: 'none' }}>
        <div className="px-3 py-1 rounded-xl" style={{ border: `2.5px solid ${SUBT}` }}>
          <span className="font-bold tracking-wider text-sm" style={{ color: SUBT }}>PASS</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// TeammateDiscovery Screen
// ---------------------------------------------------------------------------
export function TeammateDiscovery({ hackathon: selectedHackathon }: { hackathon: Hackathon }) {
  const router = useRouter();
  const { matches, setMatches } = useAppState();
  const [profiles, setProfiles]     = useState<UserProfile[]>([...discoverProfiles]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  const total     = discoverProfiles.length;
  const remaining = profiles.length;
  // Clamp so we never display e.g. "7/6" on the last card
  const currentIndex = Math.min(total - remaining + 1, total);

  const handleLike = async () => {
    const current = profiles[0];
    if (!current) return;

    setProfiles(prev => prev.slice(1));

    // swipeOnProfile is a stub — replace body in matchService.ts
    const result = await swipeOnProfile(current.id, 'like', selectedHackathon?.id);

    if (result.matched) {
      const newMatch: Match = {
        id: result.matchId ?? `m-${Date.now()}`,
        profile: current,
        hackathon: selectedHackathon?.name ?? 'EcoHack 2024',
        matchDate: 'Just now',
      };
      const updated = [newMatch, ...matches];
      setMatches(updated);
      setTimeout(() => setCurrentMatch(newMatch), 300); // show overlay after card animates off
    }
  };

  const handleSkip = async () => {
    if (!profiles[0]) return;
    await swipeOnProfile(profiles[0].id, 'pass', selectedHackathon?.id);
    setProfiles(prev => prev.slice(1));
  };

  return (
    <div className="h-full flex flex-col relative" style={{ background: BG }}>

      {/* ── Match Success Overlay ── */}
      {currentMatch && (
        <MatchSuccess
          matchProfile={currentMatch.profile}
          match={currentMatch}
          onKeepSwiping={() => setCurrentMatch(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <Compass size={20} style={{ color: ROSE }} />
          <h1 className="font-serif font-bold text-xl" style={{ color: TEXT }}>Discover</h1>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border"
          style={{ borderColor: BORDER }}
        >
          <span className="text-sm font-medium" style={{ color: ROSE }}>🔥</span>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>
            {currentIndex} / {total}
          </span>
        </div>
      </div>

      {/* ── Card stack ── */}
      <div className="flex-1 relative mx-4 mb-3 overflow-hidden">
        {profiles.length === 0 ? (
          <div
            className="h-full flex flex-col items-center justify-center gap-4 bg-white rounded-3xl"
            style={{ border: `1px solid ${BORDER}`, boxShadow: '0 4px 24px rgba(195,140,145,0.1)' }}
          >
            <span className="text-4xl">🎉</span>
            <p className="font-serif font-bold text-lg" style={{ color: TEXT }}>All caught up!</p>
            <p className="text-sm text-center px-8" style={{ color: SUBT }}>No more profiles to show right now.</p>
            <button
              onClick={() => setProfiles([...discoverProfiles])}
              className="px-6 py-2.5 rounded-full text-white text-sm font-semibold"
              style={{ background: DEEP }}
            >
              Start Over
            </button>
          </div>
        ) : (
          <>
            {/* Background stack cards (not interactive) — keyed by profile id */}
            {profiles.slice(1, 3).map((profile, i) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onLike={() => {}}
                onSkip={() => {}}
                isTop={false}
                stackIndex={i + 1}
              />
            ))}
            {/* Top card */}
            <SwipeCard
              key={profiles[0].id}
              profile={profiles[0]}
              onLike={handleLike}
              onSkip={handleSkip}
              isTop
              stackIndex={0}
            />
          </>
        )}
      </div>

      {/* ── Pass / Like buttons ── */}
      {profiles.length > 0 && (
        <div className="flex items-center justify-center gap-12 pb-[84px] pt-2 shrink-0">
          <button onClick={handleSkip} className="flex flex-col items-center gap-1 group">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 group-hover:bg-[#F9EDEA] transition-colors"
              style={{ borderColor: BORDER }}
            >
              <ChevronsLeft size={26} style={{ color: SUBT }} />
            </div>
            <span className="text-xs font-medium" style={{ color: SUBT }}>Pass</span>
          </button>

          <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full border-2 group-hover:opacity-90 transition-opacity"
              style={{ background: DEEP, borderColor: DEEP }}
            >
              <ChevronsRight size={26} color="white" />
            </div>
            <span className="text-xs font-semibold" style={{ color: DEEP }}>Like</span>
          </button>
        </div>
      )}

    </div>
  );
}

