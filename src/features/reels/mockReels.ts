export type Reel = {
  id: string;
  creator: string;
  handle: string;
  avatar: string | null;
  caption: string;
  cuisine: string;
  sound: string;
  likes: number;
  comments: number;
  shares: number;
  imageUrl: string;
  /** Whether a recipe is attached (drives the "View recipe" CTA). */
  hasRecipe: boolean;
};

// Portrait-cropped food imagery stands in for video while we wire real
// playback (expo-video + uploads) later. The UI is the TikTok-style shell.
const reel = (id: string) =>
  `https://images.unsplash.com/${id}?w=900&h=1600&fit=crop&q=80&auto=format`;

export const MOCK_REELS: Reel[] = [
  {
    id: 'r1',
    creator: 'Kenji Ito',
    handle: '@kenjicooks',
    avatar: null,
    caption: '6-hour tonkotsu broth. The pull on this ramen is unreal 🍜',
    cuisine: 'Japanese',
    sound: 'original sound · kenjicooks',
    likes: 12400,
    comments: 318,
    shares: 204,
    imageUrl: reel('photo-1569718212165-3a8278d5f624'),
    hasRecipe: true,
  },
  {
    id: 'r2',
    creator: 'Rosa Mendez',
    handle: '@rosaeats',
    avatar: null,
    caption: 'Birria tacos, cheese pull edition. Save this one 🌮🔥',
    cuisine: 'Mexican',
    sound: 'La Cumbia · Street Eats',
    likes: 28800,
    comments: 942,
    shares: 1203,
    imageUrl: reel('photo-1551504734-5ee1c4a1479b'),
    hasRecipe: true,
  },
  {
    id: 'r3',
    creator: 'Coastline Poke Co.',
    handle: '@coastlinepoke',
    avatar: null,
    caption: 'Build-your-bowl bar at the firehouse. 48g protein, clean 🥢',
    cuisine: 'Poke',
    sound: 'original sound · coastlinepoke',
    likes: 5600,
    comments: 121,
    shares: 88,
    imageUrl: reel('photo-1546069901-ba9599a7e63c'),
    hasRecipe: true,
  },
  {
    id: 'r4',
    creator: 'Sam Whitlock',
    handle: '@samlifts',
    avatar: null,
    caption: 'Post-leg-day smash burgers. Earned every gram 💪🍔',
    cuisine: 'Burgers',
    sound: 'Heavy Sets · Gym Audio',
    likes: 19200,
    comments: 540,
    shares: 410,
    imageUrl: reel('photo-1568901346375-23c9450c58cd'),
    hasRecipe: false,
  },
  {
    id: 'r5',
    creator: 'Ember & Oak',
    handle: '@emberoak',
    avatar: null,
    caption: '14-hour brisket. Low and slow never misses 🍖',
    cuisine: 'Smokehouse',
    sound: 'original sound · emberoak',
    likes: 33100,
    comments: 1120,
    shares: 2050,
    imageUrl: reel('photo-1529193591184-b1d58069ecdd'),
    hasRecipe: true,
  },
];

/** Compact count: 1200 -> 1.2K, 28800 -> 28.8K. */
export function compactCount(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
