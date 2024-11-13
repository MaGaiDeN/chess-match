import React from 'react';
import './WelcomeMessage.css';

const WelcomeMessage = () => {
  return (
    <section className="welcome-section">
      <h1 className="main-title">
        Play Chess Online<br />
        <span className="subtitle">on the #1 Site!</span>
      </h1>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-number">13,562,492</span>
          <span className="stat-label">Games Today</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">118,172</span>
          <span className="stat-label">Playing Now</span>
        </div>
      </div>
    </section>
  );
};

export default WelcomeMessage; 