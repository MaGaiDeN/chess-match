import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.webp';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="ChessMatch" className="logo" />
        <div className="brand-title">
          <span className="brand-chess">CHESS</span>
          <span className="brand-match">MATCH</span>
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="btn-signup"
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
        <button 
          className="btn-login"
          onClick={() => navigate('/login')}
        >
          Log In
        </button>
      </div>
    </header>
  );
};

export default Header; 