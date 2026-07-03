// Auth Service — mock stubs. Replace with real API calls when backend is ready.
// See BACKEND.md for integration guide.

export interface SignupPayload { name: string; email: string; password: string; }
export interface LoginPayload  { email: string; password: string; }
export interface AuthResult    { success: boolean; userId?: string; token?: string; error?: string; }

/** TODO: replace with real sign-up call */
export async function signup(_p: SignupPayload): Promise<AuthResult> {
  await new Promise(r => setTimeout(r, 400));
  return { success: true, userId: 'mock-user-id', token: 'mock-token' };
}

/** TODO: replace with real login call */
export async function login(_p: LoginPayload): Promise<AuthResult> {
  await new Promise(r => setTimeout(r, 400));
  return { success: true, userId: 'mock-user-id', token: 'mock-token' };
}

/** TODO: replace with real logout call */
export async function logout(): Promise<void> {}
