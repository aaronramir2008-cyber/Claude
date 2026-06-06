import type { FeedPost } from '@/types';

/**
 * Seed content for the feed. Real posts come from Supabase (feed_posts); this
 * keeps the feed warm and full while the network is empty or unconfigured.
 *
 * Images are Unsplash photo IDs; PostCard shows a warm gradient behind them so
 * the layout still reads beautifully if an image is slow or unavailable.
 */
const img = (id: string) => `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;

export const MOCK_POSTS: FeedPost[] = [
  {
    id: 'p1',
    authorId: 'u_maya',
    authorName: 'Maya Brooks',
    authorAvatar: null,
    imageUrl: img('photo-1546069901-ba9599a7e63c'),
    caption: 'Post-shift rebuild. Charred chicken, greens, a mountain of rice. 🔥',
    cuisine: 'Mediterranean',
    calories: 720,
    protein: 58,
    carbs: 64,
    fat: 22,
    isSponsored: false,
    sponsorName: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'p2',
    authorId: 'u_diego',
    authorName: 'Diego Salas',
    authorAvatar: null,
    imageUrl: img('photo-1565299624946-b28f40a0ae38'),
    caption: 'Station 12 taco night. We do not miss on Tuesdays.',
    cuisine: 'Mexican',
    calories: 880,
    protein: 41,
    carbs: 78,
    fat: 38,
    isSponsored: false,
    sponsorName: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'p3',
    authorId: 'u_kenji',
    authorName: 'Kenji Ito',
    authorAvatar: null,
    imageUrl: img('photo-1579584425555-c3ce17fd4351'),
    caption: 'Homemade ramen, six hours of broth. Worth every minute.',
    cuisine: 'Japanese',
    calories: 640,
    protein: 34,
    carbs: 72,
    fat: 18,
    isSponsored: false,
    sponsorName: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'p4',
    authorId: 'u_sam',
    authorName: 'Sam Whitlock',
    authorAvatar: null,
    imageUrl: img('photo-1467003909585-2f8a72700288'),
    caption: 'Cut week poke bowl. Clean, bright, 48g protein.',
    cuisine: 'Poke',
    calories: 520,
    protein: 48,
    carbs: 46,
    fat: 14,
    isSponsored: false,
    sponsorName: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
  },
  {
    id: 'p5',
    authorId: 'u_rosa',
    authorName: 'Rosa Mendez',
    authorAvatar: null,
    imageUrl: img('photo-1504674900247-0877df9cc836'),
    caption: 'Sunday family roast. Grandma supervised. ❤️',
    cuisine: 'Comfort',
    calories: 910,
    protein: 52,
    carbs: 60,
    fat: 44,
    isSponsored: false,
    sponsorName: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
];

/** Native sponsored cards — food-related local businesses only. */
export const MOCK_SPONSORED: FeedPost[] = [
  {
    id: 's1',
    authorId: 'sponsor_coastline',
    authorName: 'Coastline Poke Co.',
    authorAvatar: null,
    imageUrl: img('photo-1512621776951-a57141f2eefd'),
    caption: 'Firehouse Friday: 20% off any bowl when you show your badge. 🥢',
    cuisine: 'Poke',
    calories: 540,
    protein: 44,
    carbs: 52,
    fat: 16,
    isSponsored: true,
    sponsorName: 'Coastline Poke Co.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 's2',
    authorId: 'sponsor_emberoak',
    authorName: 'Ember & Oak Smokehouse',
    authorAvatar: null,
    imageUrl: img('photo-1529193591184-b1d58069ecdd'),
    caption: 'Brisket is on. Crews of 4+ eat family-style for $18 a head this week.',
    cuisine: 'Smokehouse',
    calories: 980,
    protein: 62,
    carbs: 40,
    fat: 56,
    isSponsored: true,
    sponsorName: 'Ember & Oak Smokehouse',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
  },
];

/**
 * Weave sponsored cards into the feed every `interval` posts — native,
 * food-related, never more than one in a row.
 */
export function withSponsored(
  posts: FeedPost[],
  sponsored: FeedPost[] = MOCK_SPONSORED,
  interval = 5,
): FeedPost[] {
  if (sponsored.length === 0) return posts;
  const out: FeedPost[] = [];
  let s = 0;
  posts.forEach((post, i) => {
    out.push(post);
    if ((i + 1) % interval === 0 && s < sponsored.length) {
      out.push(sponsored[s % sponsored.length]);
      s += 1;
    }
  });
  return out;
}
