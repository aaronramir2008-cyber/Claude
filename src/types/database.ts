/**
 * Hand-authored slice of the Supabase schema used by the app.
 *
 * Once your project is live you can replace this with the generated file:
 *   supabase gen types typescript --project-id <ref> > src/types/database.ts
 *
 * The Views / Enums / CompositeTypes keys and the per-table Relationships array
 * are required for @supabase/supabase-js to infer row/insert/update types — if
 * they're missing the client silently falls back to `never`.
 */

export type SessionStatus = 'lobby' | 'voting' | 'revealed' | 'closed';
export type SessionMode = 'pass_the_phone' | 'remote';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
        };
        Update: {
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      meal_sessions: {
        Row: {
          id: string;
          code: string;
          host_id: string;
          title: string;
          cuisine_direction: string;
          group_id: string | null;
          mode: SessionMode;
          status: SessionStatus;
          winner_cuisine: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          host_id: string;
          title: string;
          cuisine_direction?: string;
          group_id?: string | null;
          mode?: SessionMode;
          status?: SessionStatus;
        };
        Update: {
          title?: string;
          cuisine_direction?: string;
          status?: SessionStatus;
          winner_cuisine?: string | null;
        };
        Relationships: [];
      };
      session_votes: {
        Row: {
          id: string;
          session_id: string;
          voter_name: string;
          cuisine_id: string;
          cuisine_label: string;
          created_at: string;
        };
        Insert: {
          session_id: string;
          voter_name: string;
          cuisine_id: string;
          cuisine_label: string;
        };
        Update: {
          voter_name?: string;
          cuisine_id?: string;
          cuisine_label?: string;
        };
        Relationships: [];
      };
      feed_posts: {
        Row: {
          id: string;
          author_id: string;
          image_url: string | null;
          caption: string;
          cuisine: string | null;
          calories: number | null;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          is_sponsored: boolean;
          sponsor_name: string | null;
          created_at: string;
        };
        Insert: {
          author_id: string;
          caption: string;
          image_url?: string | null;
          cuisine?: string | null;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
        };
        Update: {
          caption?: string;
          image_url?: string | null;
          cuisine?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      tally_session: {
        Args: { p_session_id: string };
        Returns: { cuisine_id: string; cuisine_label: string; votes: number }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
