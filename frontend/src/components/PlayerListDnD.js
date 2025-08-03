import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './PlayerListDnD.css';

const PlayerItem = ({ player, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: player.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [notes, setNotes] = useState(player.notes || '');

    const handleNotesChange = (e) => {
        const newNotes = e.target.value;
        setNotes(newNotes);
        // Update the player's notes in localStorage
        const savedRankings = localStorage.getItem('customRankings');
        if (savedRankings) {
            try {
                const rankings = JSON.parse(savedRankings);
                const position = player.position.toLowerCase();
                const playerIndex = rankings[position].findIndex(p => p.id === player.id);
                if (playerIndex !== -1) {
                    rankings[position][playerIndex].notes = newNotes;
                    localStorage.setItem('customRankings', JSON.stringify(rankings));
                }
            } catch (error) {
                console.error('Error updating notes:', error);
            }
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`player-item ${isDragging ? 'dragging' : ''}`}
        >
            <div className="player-rank">{index + 1}</div>
            <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-team">{player.team}</div>
            </div>
            <div className="player-adp">ADP: {player.adp}</div>
            <div className="player-bye">Bye: {player.byeWeek}</div>
            <div className="player-notes">
                <input
                    type="text"
                    placeholder="Add notes..."
                    value={notes}
                    onChange={handleNotesChange}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            <div className="drag-handle">⋮⋮</div>
        </div>
    );
};

const PlayerListDnD = ({ players, position }) => {
    if (!players || players.length === 0) {
        return (
            <div className="no-players">
                <p>No players found for {position.toUpperCase()}</p>
            </div>
        );
    }

    return (
        <div className="player-list">
            {players.map((player, index) => (
                <PlayerItem
                    key={player.id}
                    player={player}
                    index={index}
                />
            ))}
        </div>
    );
};

export default PlayerListDnD; 