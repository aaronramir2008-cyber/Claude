import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { MealSession, SessionMode, TallyRow } from '@/types';
import type { Database } from '@/types/database';

type SessionRow = Database['public']['Tables']['meal_sessions']['Row'];

function mapSession(row: SessionRow): MealSession {
  return {
    id: row.id,
    code: row.code,
    hostId: row.host_id,
    title: row.title,
    cuisineDirection: row.cuisine_direction,
    groupId: row.group_id,
    mode: row.mode,
    status: row.status,
    winnerCuisine: row.winner_cuisine,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// In-memory fallback (demo mode, no Supabase keys)
// ---------------------------------------------------------------------------
type DemoVote = { voterName: string; cuisineId: string; cuisineLabel: string };
const demoSessions = new Map<string, MealSession>();
const demoVotes = new Map<string, DemoVote[]>();

function randomCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join('');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createSession(args: {
  hostId: string;
  title: string;
  cuisineDirection: string;
  mode?: SessionMode;
}): Promise<MealSession> {
  if (!isSupabaseConfigured) {
    const id = `demo-${Date.now()}`;
    const session: MealSession = {
      id,
      code: randomCode(),
      hostId: args.hostId,
      title: args.title,
      cuisineDirection: args.cuisineDirection,
      groupId: null,
      mode: args.mode ?? 'pass_the_phone',
      status: 'lobby',
      winnerCuisine: null,
      createdAt: new Date().toISOString(),
    };
    demoSessions.set(id, session);
    demoSessions.set(session.code, session);
    demoVotes.set(id, []);
    return session;
  }

  const { data, error } = await supabase
    .from('meal_sessions')
    .insert({
      host_id: args.hostId,
      title: args.title,
      cuisine_direction: args.cuisineDirection,
      mode: args.mode ?? 'pass_the_phone',
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapSession(data);
}

export async function getSession(id: string): Promise<MealSession | null> {
  if (!isSupabaseConfigured) return demoSessions.get(id) ?? null;

  const { data, error } = await supabase
    .from('meal_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSession(data) : null;
}

export async function getSessionByCode(code: string): Promise<MealSession | null> {
  const normalized = code.trim().toUpperCase();
  if (!isSupabaseConfigured) return demoSessions.get(normalized) ?? null;

  const { data, error } = await supabase
    .from('meal_sessions')
    .select('*')
    .eq('code', normalized)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSession(data) : null;
}

export async function setSessionStatus(
  id: string,
  status: MealSession['status'],
): Promise<void> {
  if (!isSupabaseConfigured) {
    const s = demoSessions.get(id);
    if (s) s.status = status;
    return;
  }
  const { error } = await supabase
    .from('meal_sessions')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function castVote(args: {
  sessionId: string;
  voterName: string;
  cuisineId: string;
  cuisineLabel: string;
}): Promise<void> {
  if (!isSupabaseConfigured) {
    const votes = demoVotes.get(args.sessionId) ?? [];
    votes.push({
      voterName: args.voterName,
      cuisineId: args.cuisineId,
      cuisineLabel: args.cuisineLabel,
    });
    demoVotes.set(args.sessionId, votes);
    return;
  }
  const { error } = await supabase.from('session_votes').insert({
    session_id: args.sessionId,
    voter_name: args.voterName,
    cuisine_id: args.cuisineId,
    cuisine_label: args.cuisineLabel,
  });
  if (error) throw error;
}

export async function tallySession(sessionId: string): Promise<TallyRow[]> {
  if (!isSupabaseConfigured) {
    const votes = demoVotes.get(sessionId) ?? [];
    const counts = new Map<string, TallyRow>();
    for (const v of votes) {
      const existing = counts.get(v.cuisineId);
      if (existing) existing.votes += 1;
      else
        counts.set(v.cuisineId, {
          cuisineId: v.cuisineId,
          cuisineLabel: v.cuisineLabel,
          votes: 1,
        });
    }
    return [...counts.values()].sort(
      (a, b) => b.votes - a.votes || a.cuisineLabel.localeCompare(b.cuisineLabel),
    );
  }

  const { data, error } = await supabase.rpc('tally_session', {
    p_session_id: sessionId,
  });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    cuisineId: r.cuisine_id,
    cuisineLabel: r.cuisine_label,
    votes: Number(r.votes),
  }));
}

export async function revealWinner(
  sessionId: string,
  winnerCuisine: string,
): Promise<void> {
  if (!isSupabaseConfigured) {
    const s = demoSessions.get(sessionId);
    if (s) {
      s.winnerCuisine = winnerCuisine;
      s.status = 'revealed';
    }
    return;
  }
  const { error } = await supabase
    .from('meal_sessions')
    .update({ status: 'revealed', winner_cuisine: winnerCuisine })
    .eq('id', sessionId);
  if (error) throw error;
}

/**
 * Subscribe to live changes on a session row (status / winner). Returns an
 * unsubscribe function. No-op in demo mode.
 */
export function subscribeToSession(
  sessionId: string,
  onChange: (session: MealSession) => void,
): () => void {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel(`session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'meal_sessions',
        filter: `id=eq.${sessionId}`,
      },
      (payload) => onChange(mapSession(payload.new as SessionRow)),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
