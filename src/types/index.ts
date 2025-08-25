export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
  team: string;
  jerseyNumber: number;
}

export interface Game {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  videoFile: string;
  duration: number;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  processedAt?: string;
  thumbnail?: string;
}

export interface Event {
  id: string;
  gameId: string;
  timestamp: number;
  type: 'pass' | 'shot' | 'dribble' | 'tackle' | 'foul' | 'goal' | 'card';
  playerId: string;
  playerName: string;
  team: string;
  startPosition: [number, number]; // [x, y] normalized 0-1
  endPosition?: [number, number];
  outcome: 'successful' | 'failed';
  confidence: number;
  clipPath?: string;
  autoFlag: 'good' | 'bad' | null;
  coachNote?: string;
}

export interface Formation {
  id: string;
  gameId: string;
  timestamp: number;
  formation: string; // e.g., "4-3-3", "4-4-2"
  players: Array<{
    playerId: string;
    playerName: string;
    position: [number, number];
    role: string;
  }>;
  confidence: number;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  gameId: string;
  minutesPlayed: number;
  touches: number;
  passes: number;
  passesCompleted: number;
  keyPasses: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  goals: number;
  dribbles: number;
  dribblesSuccessful: number;
  turnovers: number;
  recoveries: number;
  fouls: number;
  cards: number;
  xG: number; // Expected Goals
}

export interface TeamStats {
  gameId: string;
  team: string;
  possession: number;
  passes: number;
  passAccuracy: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  cards: { yellow: number; red: number };
  formation: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  stage: 'uploading' | 'processing' | 'analyzing' | 'complete';
}