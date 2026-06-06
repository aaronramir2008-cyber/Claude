/**
 * The cuisine deck people swipe / tap through during Pass the Phone.
 * Each carries its own warm gradient so the voting screen feels alive.
 */

export type Cuisine = {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  gradient: readonly [string, string];
  /** Loose tags used to filter the deck by a session's cuisine direction. */
  tags: string[];
};

export const CUISINES: Cuisine[] = [
  {
    id: 'italian',
    label: 'Italian',
    emoji: '🍝',
    blurb: 'Pasta, wood-fired everything',
    gradient: ['#E8856D', '#C9573D'],
    tags: ['comfort', 'classic', 'date'],
  },
  {
    id: 'japanese',
    label: 'Japanese',
    emoji: '🍣',
    blurb: 'Sushi, ramen, izakaya',
    gradient: ['#2C4257', '#18293A'],
    tags: ['asian', 'fresh', 'date'],
  },
  {
    id: 'mexican',
    label: 'Mexican',
    emoji: '🌮',
    blurb: 'Tacos, al pastor, lime',
    gradient: ['#D6A954', '#A97B27'],
    tags: ['comfort', 'spicy', 'casual'],
  },
  {
    id: 'korean_bbq',
    label: 'Korean BBQ',
    emoji: '🥩',
    blurb: 'Grill at the table',
    gradient: ['#C9573D', '#8E3A28'],
    tags: ['asian', 'group', 'protein'],
  },
  {
    id: 'thai',
    label: 'Thai',
    emoji: '🍜',
    blurb: 'Curry, basil, heat',
    gradient: ['#5E8C61', '#3C6B52'],
    tags: ['asian', 'spicy', 'fresh'],
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    emoji: '🥙',
    blurb: 'Mezze, grilled, bright',
    gradient: ['#D6A954', '#C9963A'],
    tags: ['fresh', 'healthy', 'protein'],
  },
  {
    id: 'burgers',
    label: 'Burgers',
    emoji: '🍔',
    blurb: 'Smash, stacked, crispy',
    gradient: ['#A97B27', '#6E4F18'],
    tags: ['comfort', 'casual', 'protein'],
  },
  {
    id: 'steakhouse',
    label: 'Steakhouse',
    emoji: '🥩',
    blurb: 'Big cuts, bigger appetites',
    gradient: ['#18293A', '#0E1B27'],
    tags: ['protein', 'date', 'group'],
  },
  {
    id: 'indian',
    label: 'Indian',
    emoji: '🍛',
    blurb: 'Tikka, naan, butter chicken',
    gradient: ['#E06B4F', '#A97B27'],
    tags: ['spicy', 'comfort', 'group'],
  },
  {
    id: 'poke',
    label: 'Poke',
    emoji: '🥗',
    blurb: 'Bowls, clean, macro-friendly',
    gradient: ['#5E8C61', '#2C4257'],
    tags: ['healthy', 'fresh', 'fitness'],
  },
  {
    id: 'pizza',
    label: 'Pizza',
    emoji: '🍕',
    blurb: 'Crust, char, cheese pull',
    gradient: ['#E8856D', '#C9573D'],
    tags: ['comfort', 'casual', 'group'],
  },
  {
    id: 'bbq',
    label: 'Smokehouse',
    emoji: '🍖',
    blurb: 'Low and slow, brisket, ribs',
    gradient: ['#8E3A28', '#4A2014'],
    tags: ['protein', 'comfort', 'group'],
  },
];

/** Directions a host can set when creating a session. */
export const CUISINE_DIRECTIONS = [
  { id: 'anything', label: 'Anything goes', emoji: '✨' },
  { id: 'asian', label: 'Asian', emoji: '🥢' },
  { id: 'comfort', label: 'Comfort', emoji: '🛋️' },
  { id: 'healthy', label: 'Healthy', emoji: '🥗' },
  { id: 'protein', label: 'High protein', emoji: '💪' },
  { id: 'spicy', label: 'Bring the heat', emoji: '🌶️' },
  { id: 'date', label: 'Date night', emoji: '🕯️' },
] as const;

export type CuisineDirection = (typeof CUISINE_DIRECTIONS)[number]['id'];

/** Filter the deck to a direction (anything → full deck). */
export function deckForDirection(direction: string): Cuisine[] {
  if (!direction || direction === 'anything') return CUISINES;
  const filtered = CUISINES.filter((c) => c.tags.includes(direction));
  return filtered.length >= 3 ? filtered : CUISINES;
}

export function cuisineById(id: string): Cuisine | undefined {
  return CUISINES.find((c) => c.id === id);
}
