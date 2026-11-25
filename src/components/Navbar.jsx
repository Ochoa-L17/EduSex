import { useState } from 'react';
import { playSound } from '../utils/sound';

export default function Navbar({
  activeTab,
  setActiveTab,
  score,
  streak,
  soundEnabled,
  setSoundEnabled,
  onPartyMode,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    playSound('pop', soundEnabled);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('pop', true);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Left: Brand Logo */}
        <div className="brand" onClick={() => handleTabClick('inicio')} role="button" tabIndex={0}>
          <div className="brand-badge">
            <span className="brand-emoji">⚡</span>
          </div>
          <div className="brand-text-aligned">
            <span className="brand-title">
              Edu<span className="brand-highlight">Sex</span>
            </span>
            <span className="brand-pill-sub">Rompe el Tabú</span>
          </div>
        </div>

        {/* Center: Navigation Links perfectly leveled */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button
            className={`nav-btn ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => handleTabClick('inicio')}
          >
            <span className="nav-btn-icon">🏠</span>
            <span>Inicio</span>
          </button>

          <button
            className={`nav-btn game-nav-btn ${activeTab === 'juego' ? 'active' : ''}`}
            onClick={() => handleTabClick('juego')}
          >
            <span className="nav-btn-icon">🎮</span>
            <span>Juego Infinito</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'its' ? 'active' : ''}`}
            onClick={() => handleTabClick('its')}
          >
            <span className="nav-btn-icon">🦠</span>
            <span>Info ITS</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'mitos' ? 'active' : ''}`}
            onClick={() => handleTabClick('mitos')}
          >
            <span className="nav-btn-icon">⚡</span>
            <span>Mitos</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'guia' ? 'active' : ''}`}
            onClick={() => handleTabClick('guia')}
          >
            <span className="nav-btn-icon">🛡️</span>
            <span>Guía Práctica</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'ayuda' ? 'active' : ''}`}
            onClick={() => handleTabClick('ayuda')}
          >
            <span className="nav-btn-icon">🆘</span>
            <span>Ayuda SOS</span>
          </button>
        </nav>

        {/* Right: Gamification Badges & Actions leveled */}
        <div className="navbar-actions">
          {/* Party Confetti Trigger */}
          <button
            type="button"
            className="action-pill party-pill"
            onClick={onPartyMode}
            title="¡Modo Fiesta! Lanza confeti pastel"
          >
            <span className="action-icon">🎉</span>
            <span className="action-text">Fiesta</span>
          </button>

          {/* Streak Badge */}
          <div className="action-pill streak-pill" title="Racha de aciertos en el juego">
            <span className="action-icon streak-flame">🔥</span>
            <span className="action-text">{streak}</span>
          </div>

          {/* XP Pill */}
          <div className="action-pill xp-pill" title="Tus puntos de experiencia">
            <span className="action-icon">✨</span>
            <span className="action-text">{score} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            className="action-pill sound-pill"
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de sonido'}
            aria-label="Alternar sonido"
          >
            <span className="action-icon">{soundEnabled ? '🔊' : '🔇'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
