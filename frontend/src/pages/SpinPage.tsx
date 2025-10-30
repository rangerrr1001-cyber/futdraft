import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import './SpinPage.css';

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
}

interface SpinOptions {
  positions: string[];
  events: string[];
  ovr_ranges: string[];
}

const SpinPage: React.FC = () => {
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinOptions, setSpinOptions] = useState<SpinOptions | null>(null);
  const [currentValues, setCurrentValues] = useState({ position: '???', event: '???', ovr_range: '???' });
  const [finalValues, setFinalValues] = useState<any>(null);
  const [acquiredPlayer, setAcquiredPlayer] = useState<Player | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSpinData();
  }, []);

  const fetchSpinData = async () => {
    try {
      const [checkRes, optionsRes] = await Promise.all([
        api.get('/spin/check'),
        api.get('/spin/options')
      ]);
      setSpinsRemaining(checkRes.data.spins_remaining);
      setSpinOptions(optionsRes.data);
    } catch (err: any) {
      setError('Failed to load spin data');
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleSpin = async () => {
    if (spinsRemaining === 0 || isSpinning) return;

    setIsSpinning(true);
    setError('');

    try {
      const response = await api.post('/spin/execute');
      const { position, event, ovr_range, player } = response.data;

      // Start slot machine animation
      animateReels(position, event, ovr_range, player);
      setSpinsRemaining(prev => prev - 1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Spin failed');
      setIsSpinning(false);
    }
  };

  const animateReels = (position: string, event: string, ovrRange: string, player: Player) => {
    if (!spinOptions) return;

    let positionInterval: any;
    let eventInterval: any;
    let ovrInterval: any;

    // Animate position reel (stops at 1.5s)
    positionInterval = setInterval(() => {
      const randomPos = spinOptions.positions[Math.floor(Math.random() * spinOptions.positions.length)];
      setCurrentValues(prev => ({ ...prev, position: randomPos }));
    }, 120);

    setTimeout(() => {
      clearInterval(positionInterval);
      setCurrentValues(prev => ({ ...prev, position }));
    }, 1500);

    // Animate event reel (stops at 2.5s)
    eventInterval = setInterval(() => {
      const randomEvent = spinOptions.events[Math.floor(Math.random() * spinOptions.events.length)];
      setCurrentValues(prev => ({ ...prev, event: randomEvent }));
    }, 120);

    setTimeout(() => {
      clearInterval(eventInterval);
      setCurrentValues(prev => ({ ...prev, event }));
    }, 2500);

    // Animate OVR range reel (stops at 3.5s)
    ovrInterval = setInterval(() => {
      const randomOvr = spinOptions.ovr_ranges[Math.floor(Math.random() * spinOptions.ovr_ranges.length)];
      setCurrentValues(prev => ({ ...prev, ovr_range: randomOvr }));
    }, 120);

    setTimeout(() => {
      clearInterval(ovrInterval);
      setCurrentValues(prev => ({ ...prev, ovr_range: ovrRange }));

      // Show player card after animation completes
      setTimeout(() => {
        setAcquiredPlayer(player);
        setShowPlayerModal(true);
        setIsSpinning(false);
      }, 500);
    }, 3500);
  };

  if (isLoadingOptions) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="spin-page">
      <h1>FUT Draft Spin</h1>

      <div className="spin-info">
        <p>Spins remaining today: <strong>{spinsRemaining}/3</strong></p>
      </div>

      {error && <div className="spin-error">{error}</div>}

      <div className="slot-machine">
        <div className="slot-reel">
          <div className="reel-label">POSITION</div>
          <div className="reel-value">{currentValues.position}</div>
        </div>

        <div className="slot-reel">
          <div className="reel-label">EVENT</div>
          <div className="reel-value">{currentValues.event}</div>
        </div>

        <div className="slot-reel">
          <div className="reel-label">OVR RANGE</div>
          <div className="reel-value">{currentValues.ovr_range}</div>
        </div>
      </div>

      <Button
        onClick={handleSpin}
        disabled={spinsRemaining === 0 || isSpinning}
        style={{ minWidth: '200px', fontSize: '1.25rem', padding: '1rem 2rem' }}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN'}
      </Button>

      {spinsRemaining === 0 && !isSpinning && (
        <p style={{ marginTop: '1rem', color: '#ef4444' }}>
          No spins remaining today. Come back tomorrow!
        </p>
      )}

      {showPlayerModal && acquiredPlayer && (
        <Modal onClose={() => setShowPlayerModal(false)}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Player Acquired!</h2>
            <PlayerCard player={acquiredPlayer} size="large" />
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button onClick={() => navigate('/inventory')}>View Inventory</Button>
              <Button onClick={() => setShowPlayerModal(false)} variant="secondary">Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SpinPage;
