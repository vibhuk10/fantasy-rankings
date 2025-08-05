import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import PlayerListDnD from '../components/PlayerListDnD';
import { exportToPDF } from '../utils/exportPDF';
import { exportCustomRankings } from '../utils/csvExport';
import { importCSVFile, validateCSVFile } from '../utils/csvImport';
import { downloadTemplate } from '../utils/csvTemplate';
import { loadPositionADPData } from '../utils/csvLoader';
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
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

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

    // Load ADP data for each position from CSV
    useEffect(() => {
        const loadADPData = async (position) => {
            try {
                setLoading(prev => ({ ...prev, [position]: true }));
                const adpData = await loadPositionADPData(position);

                if (adpData.length > 0) {
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
                    const playersToUse = savedPlayers.length > 0 ? savedPlayers : adpData;

                    setPlayers(prev => ({
                        ...prev,
                        [position]: playersToUse
                    }));
                }
            } catch (error) {
                console.error(`Error loading ${position} ADP:`, error);
                setError(`Failed to load ${position.toUpperCase()} rankings`);
            } finally {
                setLoading(prev => ({ ...prev, [position]: false }));
            }
        };

        loadADPData('qb');
        loadADPData('rb');
        loadADPData('wr');
        loadADPData('te');
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
            const adpData = await loadPositionADPData(position);
            if (adpData.length > 0) {
                setPlayers(prev => ({
                    ...prev,
                    [position]: adpData
                }));
            }
        } catch (error) {
            console.error(`Error resetting ${position} to ADP:`, error);
        }
    };

    const handleExportPDF = () => {
        exportToPDF(players);
    };

    const handleExportCSV = () => {
        const result = exportCustomRankings(players);
        if (result.success) {
            setMessage(result.message);
            setTimeout(() => setMessage(null), 3000);
        } else {
            setError(result.message);
        }
    };

    const handleImportCSV = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        const validation = validateCSVFile(file);
        if (!validation.valid) {
            setError(validation.message);
            return;
        }

        // Import CSV
        importCSVFile(file)
            .then(result => {
                if (result.success) {
                    setPlayers(result.rankings);
                    setMessage('Rankings imported successfully!');
                    setTimeout(() => setMessage(null), 3000);
                } else {
                    setError(result.message);
                }
            })
            .catch(error => {
                setError(error.message || 'Failed to import CSV file');
            });

        // Reset file input
        event.target.value = '';
    };

    const handleDownloadTemplate = () => {
        downloadTemplate();
        setMessage('Template downloaded! Use this format for your custom rankings.');
        setTimeout(() => setMessage(null), 3000);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const positions = [
        { value: 'qb', label: 'Quarterbacks' },
        { value: 'rb', label: 'Running Backs' },
        { value: 'wr', label: 'Wide Receivers' },
        { value: 'te', label: 'Tight Ends' }
    ];

    return (
        <div className="custom-rankings">
            <div className="custom-rankings-header">
                <h1>Custom Rankings</h1>
                <p>Drag and drop players to reorder your rankings</p>
                <div className="export-buttons">
                    <button onClick={handleExportPDF} className="export-btn">
                        Export to PDF
                    </button>
                    <button onClick={handleExportCSV} className="export-btn">
                        Export to CSV
                    </button>
                    <button onClick={triggerFileUpload} className="import-btn">
                        Import CSV
                    </button>
                    <button onClick={handleDownloadTemplate} className="template-btn">
                        Download Template
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleImportCSV}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)} className="close-btn">×</button>
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                    <button onClick={() => setMessage(null)} className="close-btn">×</button>
                </div>
            )}

            <div className="tabs">
                {positions.map(pos => (
                    <button
                        key={pos.value}
                        className={`tab ${activeTab === pos.value ? 'active' : ''}`}
                        onClick={() => setActiveTab(pos.value)}
                    >
                        {pos.label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {positions.map(pos => (
                    <div
                        key={pos.value}
                        className={`tab-panel ${activeTab === pos.value ? 'active' : ''}`}
                    >
                        <div className="panel-header">
                            <h2>{pos.label}</h2>
                            <button
                                onClick={() => resetToADP(pos.value)}
                                className="reset-btn"
                            >
                                Reset to ADP
                            </button>
                        </div>

                        {loading[pos.value] ? (
                            <div className="loading">Loading {pos.label}...</div>
                        ) : error ? (
                            <div className="error">{error}</div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleDragEnd(event, pos.value)}
                                modifiers={[restrictToVerticalAxis]}
                            >
                                <SortableContext
                                    items={players[pos.value].map(player => player.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <PlayerListDnD
                                        players={players[pos.value]}
                                        position={pos.value}
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