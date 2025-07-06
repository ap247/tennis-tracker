export interface Match {
  id: string;
  date: string;
  opponent: string;
  score: string;
  location: string;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
  result: 'Win' | 'Loss';
  notes?: string;
  setsPlayed: number;
  tournament?: string;
  userId?: string;
  createdAt?: string;
}

export interface Opponent {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  notes?: string;
  playstyle?: string;
}

export interface Stats {
  totalMatches: number;
  wins: number;
  losses: number;
  winPercentage: number;
  setsPlayed: number;
  commonScorelines: { [key: string]: number };
}