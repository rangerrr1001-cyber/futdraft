import { Request } from 'express';

// Extend Express Request to include userId from JWT middleware
export interface AuthRequest extends Request {
  userId?: string;
}

// User types
export interface User {
  id: string;
  username: string;
  password_hash: string;
  created_at: Date;
  last_spin_date: Date | null;
  spin_count_today: number;
}

// Player types
export interface Player {
  id: string;
  name: string;
  position: string;
  event: string;
  ovr: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  card_image_url: string | null;
  created_at: Date;
}

// User player (inventory)
export interface UserPlayer {
  id: string;
  user_id: string;
  player_id: string;
  acquired_at: Date;
}

// Team types
export interface Team {
  id: string;
  user_id: string;
  name: string;
  formation: string;
  playstyle: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamPlayer {
  id: string;
  team_id: string;
  user_player_id: string;
  position_slot: string;
  created_at: Date;
}

// Draft types
export interface Draft {
  id: string;
  user_id: string;
  formation: string | null;
  created_at: Date;
  expires_at: Date;
}

export interface DraftPlayer {
  id: string;
  draft_id: string;
  player_id: string;
  position_slot: string;
  created_at: Date;
}

// Match types
export interface Match {
  id: string;
  match_type: 'TEAM_BATTLE' | 'DRAFT_BATTLE';
  home_user_id: string | null;
  away_user_id: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  home_score: number;
  away_score: number;
  winner_user_id: string | null;
  match_events: MatchEvent[] | null;
  created_at: Date;
  completed_at: Date | null;
}

export interface MatchEvent {
  type: 'KICKOFF' | 'PASS' | 'INTERCEPTION' | 'TACKLE' | 'DRIBBLE' | 'SHOT' | 'SAVE' | 'GOAL' | 'MISS' | 'FOUL' | 'CORNER' | 'THROW_IN' | 'HALF_TIME' | 'FULL_TIME';
  minute: number;
  team: 'home' | 'away' | null;
  player: {
    name: string;
    position: string;
    ovr: number;
  } | null;
  description: string;
}

// Spin types
export interface SpinResult {
  position: string;
  event: string;
  ovrRange: string;
}

// Team with players (for match engine)
export interface TeamWithPlayers {
  id?: string;
  user_id?: string;
  name?: string;
  formation: string;
  playstyle: string;
  players: {
    position_slot: string;
    player: Player;
  }[];
}

// Match simulation result
export interface MatchSimulationResult {
  events: MatchEvent[];
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away' | 'draw';
}

// Formation types
export type Formation = '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2' | '4-2-2-2' | '3-4-3';
export type Playstyle = 'Tiki-Taka' | 'Counter' | 'Long Ball' | 'Total Football';

// Socket.IO types
export interface SocketWithUser extends Socket {
  userId?: string;
}

import { Socket } from 'socket.io';
