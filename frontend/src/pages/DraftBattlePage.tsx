import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';

interface Manager {
  id: number;
  name: string;
  playstyle: string;
}

const DraftBattlePage: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [formations, setFormations] = useState<string[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await api.get('/managers');
      setManagers(response.data || []);
    } catch (err) {
      setError('Failed to load managers');
    } finally {
      setIsLoading(false);
    }
  };

  const startDraft = async () => {
    if (!selectedManager) {
      setError('Please select a manager');
      return;
    }

    try {
      setError('');
      const response = await api.post('/draft/start', { manager_id: selectedManager });
      setDraftId(response.data.draft_id);
      setFormations(response.data.formations || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start draft');
    }
  };

  const selectFormation = async (formation: string) => {
    if (!draftId) return;

    try {
      const response = await api.post(`/draft/${draftId}/select-formation`, { formation });
      setSelectedFormation(formation);
      // Start player selection (simplified)
      alert('Formation selected! Player selection flow to be implemented.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to select formation');
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
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Draft Battle</h1>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {!draftId ? (
        <Card style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Select Your Manager</h2>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {managers.map((manager) => (
              <div
                key={manager.id}
                onClick={() => setSelectedManager(manager.id)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${selectedManager === manager.id ? '#3b82f6' : '#374151'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  backgroundColor: selectedManager === manager.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{manager.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Playstyle: {manager.playstyle}</div>
              </div>
            ))}
          </div>

          <Button onClick={startDraft} disabled={!selectedManager} style={{ width: '100%' }}>
            Start Draft
          </Button>
        </Card>
      ) : !selectedFormation ? (
        <Card style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Select Your Formation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {formations.map((formation) => (
              <Button
                key={formation}
                onClick={() => selectFormation(formation)}
                style={{ padding: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                {formation}
              </Button>
            ))}
          </div>
        </Card>
      ) : (
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Draft In Progress</h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
            Formation: {selectedFormation}
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Player selection and match viewer to be fully implemented.
            <br />
            Backend APIs are complete and functional.
          </p>
        </Card>
      )}
    </div>
  );
};

export default DraftBattlePage;
