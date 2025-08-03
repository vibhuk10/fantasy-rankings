import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
    return (
        <div className="error-container">
            <div className="error-message">
                <div className="error-icon">
                    <span role="img" aria-label="warning">⚠️</span>
                </div>
                <h3>Error</h3>
                <p>{message}</p>
                <button
                    className="retry-btn"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default ErrorMessage; 