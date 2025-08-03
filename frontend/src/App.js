import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import PlayerRankings from './components/PlayerRankings';
import CustomRankings from './pages/CustomRankings';
import { positions } from './data/positions';

function MainRankings() {
    const [selectedPosition, setSelectedPosition] = React.useState('qb');

    return (
        <main className="main-content">
            <div className="position-selector">
                <h2>Select Position</h2>
                <div className="position-buttons">
                    {positions.map(position => (
                        <button
                            key={position.value}
                            className={`position-btn ${selectedPosition === position.value ? 'active' : ''}`}
                            onClick={() => setSelectedPosition(position.value)}
                        >
                            {position.label}
                        </button>
                    ))}
                </div>
            </div>
            <PlayerRankings position={selectedPosition} />
        </main>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <nav className="app-navigation">
                    <Link to="/" className="nav-link">Player Rankings</Link>
                    <Link to="/custom-rankings" className="nav-link">Custom Rankings</Link>
                </nav>
                <Switch>
                    <Route exact path="/" component={MainRankings} />
                    <Route path="/custom-rankings" component={CustomRankings} />
                </Switch>
            </div>
        </Router>
    );
}

export default App; 