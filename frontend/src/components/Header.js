import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span role="img" aria-label="football">🏈</span> Fantasy Football Rankings
        </h1>
        <p className="header-subtitle">
          Advanced Analytics & Player Rankings for the 2024 Season
        </p>
      </div>
    </header>
  );
};

export default Header; 