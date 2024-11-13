import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import WelcomeMessage from './components/WelcomeMessage/WelcomeMessage';
import QuickStartOptions from './components/QuickStartOptions/QuickStartOptions';
import ChessPuzzlesSection from './components/ChessPuzzlesSection/ChessPuzzlesSection';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <WelcomeMessage />
                <QuickStartOptions />
                <ChessPuzzlesSection />
              </>
            } />
            {/* Otras rutas aquí */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
