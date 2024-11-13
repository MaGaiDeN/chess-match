import React from 'react';
import './QuickStartOptions.css';

const QuickStartOptions = () => {
  return (
    <section className="quick-start">
      <div className="option-card play-online">
        <div className="option-icon">👥</div>
        <div className="option-content">
          <h3>Play Online</h3>
          <p>Play with someone at your level</p>
        </div>
      </div>
      
      <div className="option-card play-computer">
        <div className="option-icon">🤖</div>
        <div className="option-content">
          <h3>Play Computer</h3>
          <p>Play vs customizable training bots</p>
        </div>
      </div>
    </section>
  );
};

export default QuickStartOptions; 