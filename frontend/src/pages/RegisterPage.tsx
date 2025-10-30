import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3 || username.length > 50) {
      setError('Username must be 3-50 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords must match');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, password);
      navigate('/spin');
    } catch (err: any) {
      if (err.message.includes('already exists') || err.message.includes('taken')) {
        setError('Username already exists');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register for FUT Draft</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username (3-50 characters)"
              style={{ width: '100%' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password (min 6 characters)"
              style={{ width: '100%' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              style={{ width: '100%' }}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px',
              marginBottom: '1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6' }}>
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
