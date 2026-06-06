import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { FeedPost } from '@/types';
import { MOCK_POSTS, withSponsored } from './mockPosts';

/**
 * Fetch the feed. Pulls real posts from Supabase when configured and weaves in
 * sponsored cards; otherwise returns the seeded mock feed so the screen always
 * has something beautiful to show.
 */
export async function fetchFeed(): Promise<FeedPost[]> {
  if (!isSupabaseConfigured) return withSponsored(MOCK_POSTS);

  const { data, error } = await supabase
    .from('feed_posts')
    .select(
      'id, author_id, image_url, caption, cuisine, calories, protein, carbs, fat, is_sponsored, sponsor_name, created_at, profiles(display_name, avatar_url)',
    )
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) {
    return withSponsored(MOCK_POSTS);
  }

  const posts: FeedPost[] = data.map((row: any) => ({
    id: row.id,
    authorId: row.author_id,
    authorName: row.profiles?.display_name ?? 'Mesā Cook',
    authorAvatar: row.profiles?.avatar_url ?? null,
    imageUrl: row.image_url,
    caption: row.caption,
    cuisine: row.cuisine,
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    isSponsored: row.is_sponsored,
    sponsorName: row.sponsor_name,
    createdAt: row.created_at,
  }));

  return withSponsored(posts);
}
