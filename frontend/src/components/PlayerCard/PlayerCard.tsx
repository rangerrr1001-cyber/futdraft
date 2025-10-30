import React from 'react';
import './PlayerCard.css';

export interface PlayerCardProps {
  player: {
    name: string;
    position: string;
    event: string;
    ovr: number;
    pace?: number;
    shooting?: number;
    passing?: number;
    dribbling?: number;
    defending?: number;
    physical?: number;
    card_image_url?: string | null;
  };
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, size = 'large', onClick }) => {
  const isClickable = !!onClick;

  return (
    <div
      className={`player-card player-card-${size} ${isClickable ? 'player-card-clickable' : ''}`}
      onClick={onClick}
    >
      {/* Event Badge */}
      <div className="player-card-event">{player.event}</div>

      {/* OVR Display */}
      <div className="player-card-ovr">{player.ovr}</div>

      {/* Player Image */}
      <div className="player-card-image">
        {player.card_image_url ? (
          <img src={player.card_image_url} alt={player.name} />
        ) : (
          <div className="player-card-placeholder">[Player Art]</div>
        )}
      </div>

      {/* Player Info */}
      <div className="player-card-info">
        <div className="player-card-name">{player.name}</div>
        <div className="player-card-position">{player.position}</div>
      </div>

      {/* Stats Grid */}
      {(player.pace !== undefined || player.shooting !== undefined) && (
        <div className="player-card-stats">
          {player.pace !== undefined && (
            <div className="stat-box">
              <span className="stat-label">PAC</span>
              <span className="stat-value">{player.pace}</span>
            </div>
          )}
          {player.shooting !== undefined && (
            <div className="stat-box">
              <span className="stat-label">SHO</span>
              <span className="stat-value">{player.shooting}</span>
            </div>
          )}
          {player.passing !== undefined && (
            <div className="stat-box">
              <span className="stat-label">PAS</span>
              <span className="stat-value">{player.passing}</span>
            </div>
          )}
          {player.dribbling !== undefined && (
            <div className="stat-box">
              <span className="stat-label">DRI</span>
              <span className="stat-value">{player.dribbling}</span>
            </div>
          )}
          {player.defending !== undefined && (
            <div className="stat-box">
              <span className="stat-label">DEF</span>
              <span className="stat-value">{player.defending}</span>
            </div>
          )}
          {player.physical !== undefined && (
            <div className="stat-box">
              <span className="stat-label">PHY</span>
              <span className="stat-value">{player.physical}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
