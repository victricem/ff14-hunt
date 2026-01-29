import type { Mob } from '../data/huntData';

export interface HuntTimer {
  startTime?: number;
  endTime?: number;
  updatedAt?: number;
  isManual?: boolean;
}

export interface UserProfile {
  uid: string;
  photoURL?: string;
  hunterName?: string;
}

export type ViewMode = 'card' | 'list';
export type Theme = 'sunlight' | 'midnight';

export type { Mob };