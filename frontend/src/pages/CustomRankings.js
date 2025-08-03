import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import PlayerListDnD from '../components/PlayerListDnD';
import { exportToPDF } from '../utils/exportPDF';
import './CustomRankings.css';

const CustomRankings = () => {
    const [activeTab, setActiveTab] = useState('qb');
    const [players, setPlayers] = useState({
        qb: [],
        rb: [],
        wr: [],
        te: []
    });
    const [loading, setLoading] = useState({
        qb: true,
        rb: true,
        wr: true,
        te: true
    });
    const [error, setError] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Load saved rankings from localStorage on component mount
    useEffect(() => {
        const savedRankings = localStorage.getItem('customRankings');
        if (savedRankings) {
            try {
                const parsed = JSON.parse(savedRankings);
                setPlayers(parsed);
            } catch (error) {
                console.error('Error loading saved rankings:', error);
            }
        }
    }, []);

    // Fetch ADP data for each position
    useEffect(() => {
        const fetchADPData = async (position) => {
            try {
                setLoading(prev => ({ ...prev, [position]: true }));
                const response = await axios.get(`http://localhost:5000/api/adp/${position}`);

                if (response.data.success) {
                    // Check if we have saved rankings for this position
                    const savedRankings = localStorage.getItem('customRankings');
                    let savedPlayers = [];

                    if (savedRankings) {
                        try {
                            const parsed = JSON.parse(savedRankings);
                            savedPlayers = parsed[position] || [];
                        } catch (error) {
                            console.error('Error parsing saved rankings:', error);
                        }
                    }

                    // Use saved rankings if available, otherwise use ADP data
                    const playersToUse = savedPlayers.length > 0 ? savedPlayers : response.data.data;

                    setPlayers(prev => ({
                        ...prev,
                        [position]: playersToUse
                    }));
                }
            } catch (error) {
                console.error(`Error fetching ${position} ADP:`, error);
                setError(`Failed to fetch ${position.toUpperCase()} rankings`);
            } finally {
                setLoading(prev => ({ ...prev, [position]: false }));
            }
        };

        fetchADPData('qb');
        fetchADPData('rb');
        fetchADPData('wr');
        fetchADPData('te');
    }, []);

    // Save rankings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('customRankings', JSON.stringify(players));
    }, [players]);

    const handleDragEnd = (event, position) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPlayers(prev => ({
                ...prev,
                [position]: arrayMove(
                    prev[position],
                    prev[position].findIndex(player => player.id === active.id),
                    prev[position].findIndex(player => player.id === over.id)
                )
            }));
        }
    };

    const resetToADP = async (position) => {
        try {
            setLoading(prev => ({ ...prev, [position]: true }));
            const response = await axios.get(`http://localhost:5000/api/adp/${position}`);

            if (response.data.success) {
                setPlayers(prev => ({
                    ...prev,
                    [position]: response.data.data
                }));
            }
        } catch (error) {
            console.error(`Error resetting ${position} to ADP:`, error);
            setError(`Failed to reset ${position.toUpperCase()} to ADP`);
        } finally {
            setLoading(prev => ({ ...prev, [position]: false }));
        }
    };

    const handleExportPDF = () => {
        console.log('Exporting PDF with players data:', players);
        exportToPDF(players);
    };



    const positions = [
        { key: 'qb', label: 'Quarterbacks (QB)' },
        { key: 'rb', label: 'Running Backs (RB)' },
        { key: 'wr', label: 'Wide Receivers (WR)' },
        { key: 'te', label: 'Tight Ends (TE)' }
    ];

    return (
        <div className="custom-rankings">
            <div className="custom-rankings-header">
                <h1>Custom Player Rankings</h1>
                <p>Drag and drop players to reorder your rankings. Click "Export to PDF" to save your custom rankings.</p>
                <button
                    className="export-button"
                    onClick={handleExportPDF}
                    disabled={Object.values(loading).some(Boolean)}
                >
                    Export to PDF
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="tabs">
                {positions.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`tab ${activeTab === key ? 'active' : ''}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {positions.map(({ key, label }) => (
                    <div
                        key={key}
                        className={`tab-panel ${activeTab === key ? 'active' : ''}`}
                    >
                        <div className="tab-header">
                            <h2>{label}</h2>
                            <button
                                className="reset-button"
                                onClick={() => resetToADP(key)}
                                disabled={loading[key]}
                            >
                                Reset to ADP
                            </button>
                        </div>

                        {loading[key] ? (
                            <div className="loading">Loading {label}...</div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleDragEnd(event, key)}
                                modifiers={[restrictToVerticalAxis]}
                            >
                                <SortableContext
                                    items={players[key].map(player => player.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <PlayerListDnD
                                        players={players[key]}
                                        position={key}
                                    />
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomRankings; 