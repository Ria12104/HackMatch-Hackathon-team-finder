'use client';

// =============================================================================
// Auth Screen — Login & Sign Up
// =============================================================================
//
// BACKEND INTEGRATION:
//   The handleSubmit function currently calls authService.login() / .signup()
//   which are mock stubs. When the backend is ready:
//     1. Open src/services/authService.ts
//     2. Replace the function bodies with real fetch() calls
//     3. Store the returned token in localStorage or a cookie
//     4. The UI here does NOT need to change.
// =============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

import { useAppState } from '@/context/AppContext';
import { mockHackathons } from '@/constants/mockData';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';
import { login, signup } from '@/services/authService';

const featuredId = mockHackathons.find(h => h.isFeatured)?.id ?? mockHackathons[0]?.id ?? '1';

export function AuthScreen() {
  const router = useRouter();
  const { setIsAuthenticated } = useAppState();
  const [tab,      setTab]      = useState<'signup' | 'login'>('signup');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Controlled input state
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const inputBase = 'w-full px-3 py-2.5 pl-9 rounded-xl text-sm outline-none transition-all';
  const inputStyle = { background: 'white', border: `1px solid ${BORDER}`, color: TEXT };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // Service calls are stubs — replace their bodies in authService.ts
      const result = tab === 'signup'
        ? await signup({ name, email, password })
        : await login({ email, password });

      if (result.success) {
        setIsAuthenticated(true);
        router.push('/profile/setup'); // collect name, role, skills before entering discover
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ background: BG }}>
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1.5 px-4 pt-4 pb-2 text-sm font-medium"
        style={{ color: SUBT }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="px-6 pb-8">
        {/* Context banner removed — login flow no longer needs hackathon ctx in URL */}

        <h2 className="font-serif font-bold text-2xl mb-1" style={{ color: TEXT }}>
          {tab === 'signup' ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="text-xs mb-5" style={{ color: SUBT }}>
          {tab === 'signup' ? 'Join to find your perfect hackathon team' : 'Sign in to continue'}
        </p>

        {/* Sign Up / Log In tabs */}
        <div className="flex border-b mb-5" style={{ borderColor: BORDER }}>
          {(['signup', 'login'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className="flex-1 pb-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px"
              style={tab === t ? { color: DEEP, borderColor: DEEP } : { color: SUBT, borderColor: 'transparent' }}
            >
              {t === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          ))}
        </div>

        {/* Google OAuth button (UI only — wire to backend OAuth flow) */}
        <button
          className="w-full py-2.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 mb-4"
          style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: BORDER }} />
          <span className="text-[11px]" style={{ color: SUBT }}>or</span>
          <div className="flex-1 h-px" style={{ background: BORDER }} />
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-3 mb-5">
          {tab === 'signup' && (
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBT }} />
              <input
                className={inputBase}
                style={inputStyle}
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBT }} />
            <input
              className={inputBase}
              style={inputStyle}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBT }} />
            <input
              className={inputBase}
              style={inputStyle}
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: SUBT }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {tab === 'login' && (
          <p className="text-[11px] text-right -mt-2 mb-4 cursor-pointer font-medium" style={{ color: ROSE }}>
            Forgot password?
          </p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-[11px] text-center mb-3 px-2 py-1.5 rounded-lg" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 rounded-full text-white text-sm font-semibold transition-opacity"
          style={{ background: DEEP, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
        >
          {loading ? 'Please wait…' : tab === 'signup' ? 'Create Account' : 'Log In'}
        </button>

        <p className="text-[10px] text-center mt-4 leading-relaxed" style={{ color: SUBT }}>
          By continuing you agree to our{' '}
          <span className="cursor-pointer font-medium" style={{ color: ROSE }}>Terms</span> and{' '}
          <span className="cursor-pointer font-medium" style={{ color: ROSE }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
