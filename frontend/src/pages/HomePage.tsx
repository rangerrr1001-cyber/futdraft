import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Spin for Players',
      description: 'Get 3 daily spins to acquire random players',
      path: '/spin',
      icon: '🎰',
    },
    {
      title: 'Team Battle',
      description: 'Build teams from your collection and battle',
      path: '/team-battle',
      icon: '⚔️',
    },
    {
      title: 'Draft Battle',
      description: 'Draft a temporary team and compete',
      path: '/draft-battle',
      icon: '🏆',
    },
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to FUT Draft
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#9ca3af',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Build your ultimate team, spin for legendary players, and battle for glory
        </p>

        {!user && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/register')} variant="secondary">Register</Button>
          </div>
        )}
      </div>

      {/* Features Grid */}
      {user && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {features.map((feature) => (
            <Card
              key={feature.path}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textAlign: 'center',
                padding: '2rem'
              }}
              onClick={() => navigate(feature.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>{feature.title}</h3>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>{feature.description}</p>
              <Button onClick={() => navigate(feature.path)}>
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      )}

      {user && (
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Button onClick={() => navigate('/inventory')} variant="secondary">
            View My Players
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
