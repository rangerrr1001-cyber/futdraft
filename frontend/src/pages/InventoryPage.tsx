import React, { useEffect, useState } from 'react';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import Spinner from '../components/common/Spinner';
import { api } from '../services/api';

interface Player {
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

const InventoryPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get('/players/me');
      setPlayers(response.data.players || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load players');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Players</h1>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {players.length === 0 && !error && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#9ca3af'
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            No players yet!
          </p>
          <p>Visit the Spin page to acquire players.</p>
        </div>
      )}

      {players.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              size="small"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
