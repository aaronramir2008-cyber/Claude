import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile } from '@/types';

type AuthState = {
  initializing: boolean;
  session: Session | null;
  profile: Profile | null;
  /** True when running without Supabase keys — UI works, data is local. */
  demoMode: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (args: {
    email: string;
    password: string;
    displayName: string;
    username: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Stand-in profile used in demo mode so the rest of the app can render. */
const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  username: 'demo_cook',
  displayName: 'Demo Cook',
  avatarUrl: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile({
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        avatarUrl: data.avatar_url,
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInitializing(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void loadProfile(data.session.user.id);
      setInitializing(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next) void loadProfile(next.user.id);
      else setProfile(null);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      setProfile(DEMO_PROFILE);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(
    async ({
      email,
      password,
      displayName,
      username,
    }: {
      email: string;
      password: string;
      displayName: string;
      username: string;
    }) => {
      if (!isSupabaseConfigured) {
        setProfile({ ...DEMO_PROFILE, displayName, username });
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName, username } },
      });
      if (error) throw error;
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      initializing,
      session,
      profile,
      demoMode: !isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [initializing, session, profile, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

/** Whether the user is considered signed in (real session or demo). */
export function useIsAuthenticated() {
  const { session, profile, demoMode } = useAuth();
  return demoMode ? Boolean(profile) : Boolean(session);
}
