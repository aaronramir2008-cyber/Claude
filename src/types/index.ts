import type { SessionMode, SessionStatus } from './database';

export type { SessionMode, SessionStatus } from './database';

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface MealSession {
  id: string;
  code: string;
  hostId: string;
  title: string;
  cuisineDirection: string;
  groupId: string | null;
  mode: SessionMode;
  status: SessionStatus;
  winnerCuisine: string | null;
  createdAt: string;
}

export interface TallyRow {
  cuisineId: string;
  cuisineLabel: string;
  votes: number;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  imageUrl: string | null;
  caption: string;
  cuisine: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  isSponsored: boolean;
  sponsorName: string | null;
  createdAt: string;
}
