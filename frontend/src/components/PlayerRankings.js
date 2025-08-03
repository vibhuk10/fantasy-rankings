import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerRankings.css';
import RankingsTable from './RankingsTable';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const PlayerRankings = ({ position }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/${position}`);
        setPlayers(response.data.data);
      } catch (err) {
        setError('Failed to fetch player rankings. Please try again.');
        console.error('Error fetching players:', err);
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