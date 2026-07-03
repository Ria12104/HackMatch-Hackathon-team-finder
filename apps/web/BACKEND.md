# Backend Integration Guide

The backend lives in a separate repository. Once merged, replace the mock stubs in `src/services/` with real API calls.

## Setup

1. Install Supabase client: `npm install @supabase/supabase-js`
2. Create `apps/web/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Create `src/lib/supabase/client.ts`:
   ```ts
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```

## Services to replace

| File | Replace with |
|------|-------------|
| `authService.ts` | `supabase.auth.signUp / signInWithPassword / signOut` |
| `userService.ts` | `supabase.from('profiles').select / update` |
| `hackathonService.ts` | `supabase.from('hackathons').select / insert` |
| `matchService.ts` | `supabase.from('swipes').insert` + `supabase.from('matches').select` |
| `chatService.ts` | `supabase.from('messages').select / insert` + Realtime channel |

## Auth state in the app

`HackMatchApp.tsx` manages `isAuthenticated`. Replace the mock flag with:
```ts
useEffect(() => {
  supabase.auth.onAuthStateChange((_event, session) => {
    setIsAuthenticated(!!session);
  });
}, []);
```

## Real-time chat

Replace `getMockAutoReply()` with a Supabase Realtime channel:
```ts
supabase.channel(`match:${matchId}`)
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
    setMessages(prev => [...prev, payload.new as Message]);
  })
  .subscribe();
```
