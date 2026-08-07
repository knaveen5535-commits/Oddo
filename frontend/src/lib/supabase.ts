import { createClient } from '@supabase/supabase-js';
import type { AuthChangeEvent, Session, SupabaseClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isMock = !supabaseUrl || !supabaseAnonKey;

// ---- DEV MOCK AUTH ----
// Activated only when Supabase credentials are missing from frontend/.env.
// Simulates sign up / login / Google OAuth in the browser using localStorage.
// Swap in real keys and restart to use real Supabase.

interface StoredUser {
  id: string;
  email: string;
  password: string;
  metadata: Record<string, string>;
  createdAt: string;
}

const USERS_KEY = 'traveloop_mock_users';
const SESSION_KEY = 'traveloop_mock_session';

const canStore = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function readUsers(): StoredUser[] {
  if (!canStore()) return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  if (canStore()) localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): Session | null {
  if (!canStore()) return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  if (!canStore()) return;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

function base64Url(input: string) {
  return btoa(unescape(encodeURIComponent(input))).replace(/=+$/, '');
}

function makeToken(user: User): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: 'authenticated',
      aud: 'authenticated',
      iat: now,
      exp: now + 60 * 60,
    })
  );
  return `${header}.${payload}.dev-mock-signature`;
}

function toSupabaseUser(stored: StoredUser): User {
  return {
    id: stored.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: stored.email,
    email_confirmed_at: stored.createdAt,
    created_at: stored.createdAt,
    updated_at: stored.createdAt,
    user_metadata: stored.metadata,
    app_metadata: { provider: 'email', providers: ['email'] },
  };
}

function makeSession(user: User): Session {
  return {
    access_token: makeToken(user),
    refresh_token: 'dev-mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user,
  };
}

function makeError(message: string): Error & { status: number } {
  const error = new Error(message) as Error & { status: number };
  error.name = 'AuthApiError';
  error.status = 400;
  return error;
}

const listeners = new Set<(event: AuthChangeEvent, session: Session | null) => void>();

function emit(event: AuthChangeEvent, session: Session | null) {
  listeners.forEach((listener) => listener(event, session));
}

const mockAuth = {
  getSession: async (): Promise<{ data: { session: Session | null }; error: null }> => ({
    data: { session: readSession() },
    error: null,
  }),

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    listeners.add(callback);
    const session = readSession();
    if (session) {
      setTimeout(() => callback('INITIAL_SESSION', session), 0);
    }
    return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
  },

  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    const stored = readUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!stored) {
      return { data: { user: null, session: null }, error: makeError('Invalid login credentials') };
    }
    const user = toSupabaseUser(stored);
    const session = makeSession(user);
    writeSession(session);
    emit('SIGNED_IN', session);
    return { data: { user, session }, error: null };
  },

  signUp: async ({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options?: { data?: Record<string, string> };
  }) => {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { data: { user: null, session: null }, error: makeError('User already registered') };
    }
    const stored: StoredUser = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `mock-user-${users.length + 1}`,
      email,
      password,
      metadata: options?.data ?? {},
      createdAt: new Date().toISOString(),
    };
    users.push(stored);
    writeUsers(users);
    const user = toSupabaseUser(stored);
    const session = makeSession(user);
    writeSession(session);
    emit('SIGNED_IN', session);
    return { data: { user, session }, error: null };
  },

  signInWithOAuth: async () => {
    if (typeof window === 'undefined') {
      return { data: { provider: 'google', url: null }, error: null };
    }
    const users = readUsers();
    let stored = users.find((u) => u.email === 'demo.traveler@gmail.com');
    if (!stored) {
      stored = {
        id: 'mock-google-user',
        email: 'demo.traveler@gmail.com',
        password: 'dev-mock',
        metadata: { full_name: 'Demo Traveler', avatar_url: '' },
        createdAt: new Date().toISOString(),
      };
      users.push(stored);
      writeUsers(users);
    }
    const user = toSupabaseUser(stored);
    const session = makeSession(user);
    writeSession(session);
    emit('SIGNED_IN', session);
    window.location.href = '/profile';
    return { data: { provider: 'google', url: null }, error: null };
  },

  signOut: async () => {
    writeSession(null);
    emit('SIGNED_OUT', null);
    return { error: null };
  },
};

const mockSupabase = { auth: mockAuth };

export const supabase: SupabaseClient = isMock
  ? (mockSupabase as unknown as SupabaseClient)
  : createClient(supabaseUrl!, supabaseAnonKey!);

if (isMock) {
  console.warn(
    '[AUTH] Supabase credentials not configured - running with DEV MOCK auth. Login/signup are simulated in your browser (localStorage).'
  );
}
