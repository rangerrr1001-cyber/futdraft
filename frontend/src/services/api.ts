import axios from 'axios';
import type {
  AuthResponse,
  SpinAvailability,
  SpinResponse,
  SpinOptions,
  Player,
  Team,
  CreateTeamRequest,
  DraftFormationsResponse,
  Draft,
  Match
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 errors (logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// Spin API
export const spinAPI = {
  checkAvailability: async (): Promise<SpinAvailability> => {
    const response = await api.get('/spin/check');
    return response.data;
  },

  executeSpin: async (): Promise<SpinResponse> => {
    const response = await api.post('/spin/execute');
    return response.data;
  },

  getOptions: async (): Promise<SpinOptions> => {
    const response = await api.get('/spin/options');
    return response.data;
  },
};

// Players API
export const playersAPI = {
  getMyPlayers: async (): Promise<{ players: Player[] }> => {
    const response = await api.get('/players/me');
    return response.data;
  },
};

// Teams API
export const teamsAPI = {
  getAll: async (): Promise<{ teams: Team[] }> => {
    const response = await api.get('/teams');
    return response.data;
  },

  create: async (teamData: CreateTeamRequest): Promise<{ team: Team }> => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  update: async (id: string, teamData: CreateTeamRequest): Promise<{ team: Team }> => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },
};

// Draft API
export const draftAPI = {
  start: async (): Promise<DraftFormationsResponse> => {
    const response = await api.post('/draft/start');
    return response.data;
  },

  selectFormation: async (draftId: string, formation: string): Promise<{ formation: string; position_slots: string[] }> => {
    const response = await api.post(`/draft/${draftId}/select-formation`, { formation });
    return response.data;
  },

  getPlayersForPosition: async (draftId: string, positionSlot: string): Promise<{ position_slot: string; players: Player[] }> => {
    const response = await api.get(`/draft/${draftId}/players/${positionSlot}`);
    return response.data;
  },

  selectPlayer: async (draftId: string, positionSlot: string, playerId: string): Promise<{ success: boolean; draft_complete: boolean; remaining_positions: string[] }> => {
    const response = await api.post(`/draft/${draftId}/select-player`, {
      position_slot: positionSlot,
      player_id: playerId,
    });
    return response.data;
  },

  getStatus: async (draftId: string): Promise<Draft> => {
    const response = await api.get(`/draft/${draftId}`);
    return response.data;
  },

  cancel: async (draftId: string): Promise<void> => {
    await api.delete(`/draft/${draftId}`);
  },
};

// Battle API
export const battleAPI = {
  startTeamBattle: async (teamId: string): Promise<{ match: Match }> => {
    const response = await api.post('/battles/start', { team_id: teamId });
    return response.data;
  },

  startDraftBattle: async (draftId: string): Promise<{ match: Match }> => {
    const response = await api.post(`/battles/draft/${draftId}/battle`);
    return response.data;
  },
};

export default api;