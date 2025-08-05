import React, { useState, useEffect } from 'react';
import './PlayerRankings.css';
import RankingsTable from './RankingsTable';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { loadPositionData } from '../utils/csvLoader';

const PlayerRankings = ({ position }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await loadPositionData(position);
        setPlayers(data);
      } catch (err) {
        setError('Failed to load player rankings. Please try again.');
        console.error('Error loading players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [position]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="player-rankings">
      <div className="rankings-header">
        <h2>{position.toUpperCase()} Rankings</h2>
        <p className="rankings-subtitle">
          Top {players.length} players ranked by composite score
        </p>
      </div>
      <RankingsTable players={players} position={position} />
    </div>
  );
};

export default PlayerRankings; 