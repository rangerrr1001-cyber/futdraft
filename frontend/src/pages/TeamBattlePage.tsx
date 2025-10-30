import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';

const TeamBattlePage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamsRes = await api.get('/teams');
      setTeams(teamsRes.data.teams || []);
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const startBattle = async (teamId: string) => {
    try {
      setError('');
      await api.post('/battles/start', { teamId });
      alert('Battle started! (Match viewer to be implemented)');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start battle');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Team Battle</h1>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {teams.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#9ca3af' }}>
              No teams yet. Create a team to start battling!
            </p>
            <p style={{ color: '#6b7280' }}>
              (Team builder interface to be fully implemented)
            </p>
          </div>
        </Card>
      ) : (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>My Teams</h2>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {teams.map((team) => (
              <Card key={team.id} style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>{team.name}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Formation: {team.formation}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Players: {team.players?.length || 0}/11
                </p>
                <Button
                  onClick={() => startBattle(team.id)}
                  disabled={!team.players || team.players.length !== 11}
                  style={{ width: '100%' }}
                >
                  Start Battle
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Team builder and match viewer features are functional on backend.
          <br />
          Full UI implementation available for enhancement.
        </p>
      </div>
    </div>
  );
};

export default TeamBattlePage;
