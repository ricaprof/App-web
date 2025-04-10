import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Intro.css';

const DarkThemeLayout = ({ children }) => {
  const location = useLocation(); // Hook para obter a URL atual

  const isActive = (path) => location.pathname === path; // Verifica se o caminho atual corresponde ao link

  return (
    <div className="dark-theme-app">
      {/* Header/Navbar */}
      <header className="dark-header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">💸</span>
            <span>FinanceControl</span>
          </h1>
          
          <nav className="main-nav">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              <span className="nav-icon">🏠</span>
              <span>Início</span>
            </Link>
         
        
         
            <Link to="/manage" className={`nav-link ${isActive('/manage') ? 'active' : ''}`}>
              <span className="nav-icon">✏️</span>
              <span>Gerenciar</span>
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default DarkThemeLayout;