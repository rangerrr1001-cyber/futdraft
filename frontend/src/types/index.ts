// User and Auth types
export interface User {
  id: string;
  username: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
  acquired_at?: string;
}

// Spin types
export interface SpinResult {
  position: string;
  event: string;
  ovrRange: string;
}

export interface SpinResponse {
  spinResult: SpinResult;
  player: Player;
  remainingSpins: number;
}

export interface SpinAvailability {
  canSpin: boolean;
  remainingSpins: number;
  nextResetTime: string;
}

export interface SpinOptions {
  positions: string[];
  events: string[];
  ovrRanges: {
    label: string;
    min: number;
    max: number;
  }[];
}

// Team types
export type Formation = '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2' | '4-2-2-2' | '3-4-3';
export type Playstyle = 'Tiki-Taka' | 'Counter' | 'Long Ball' | 'Total Football';

export interface TeamPlayer {
  position_slot: string;
  player: Player;
}

export interface Team {
  id: string;
  name: string;
  formation: Formation;
  playstyle: Playstyle;
  created_at: string;
  players: TeamPlayer[];
}

export interface CreateTeamRequest {
  name: string;
  formation: Formation;
  playstyle: Playstyle;
  players: {
    position_slot: string;
    user_player_id: string;
  }[];
}

// Draft types
export interface Draft {
  draft_id: string;
  formation: Formation | null;
  expires_at: string;
  selected_players: TeamPlayer[];
  remaining_positions: string[];
  is_complete: boolean;
}

export interface DraftFormationsResponse {
  draft_id: string;
  formations: Formation[];
  expires_at: string;
}

// Match types
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

export interface TeamWithPlayers {
  id?: string;
  user_id?: string;
  name?: string;
  formation: Formation;
  playstyle: Playstyle;
  players: TeamPlayer[];
}

export interface Match {
  id: string;
  room_id: string;
  home_team: TeamWithPlayers;
  away_team: TeamWithPlayers;
  match_type: 'TEAM_BATTLE' | 'DRAFT_BATTLE';
}

export interface ScoreUpdate {
  home_score: number;
  away_score: number;
}

export interface MatchEnd {
  final_score: {
    home: number;
    away: number;
  };
  winner: 'home' | 'away' | 'draw';
  winner_user_id: string | null;
}
