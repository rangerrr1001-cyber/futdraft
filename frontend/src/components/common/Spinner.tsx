import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  center?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', center = false }) => {
  return (
    <div className={`spinner-container ${center ? 'spinner-center' : ''}`}>
      <div className={`spinner spinner-${size}`}></div>
    </div>
  );
};
