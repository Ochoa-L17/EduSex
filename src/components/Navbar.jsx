import { useState } from 'react';
import { playSound } from '../utils/sound';

export default function Navbar({
  activeTab,
  setActiveTab,
  score,
  streak,
  soundEnabled,
  setSoundEnabled,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    playSound('click', soundEnabled);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('click', true);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="brand" onClick={() => handleTabClick('inicio')}>
          <div className="brand-badge">
            <span className="brand-emoji">⚡</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">Edu<span className="brand-highlight">Sex</span></span>
            <span className="brand-sub">Rompe el Tabú</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button
            className={`nav-btn ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => handleTabClick('inicio')}
          >
            🏠 Inicio
          </button>
          <button
            className={`nav-btn game-nav-btn ${activeTab === 'juego' ? 'active' : ''}`}
            onClick={() => handleTabClick('juego')}
          >
            🎮 Juego Infinito <span className="nav-tag">HOT</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'its' ? 'active' : ''}`}
            onClick={() => handleTabClick('its')}
          >
            🦠 Info ITS
          </button>
          <button
            className={`nav-btn ${activeTab === 'mitos' ? 'active' : ''}`}
            onClick={() => handleTabClick('mitos')}
          >
            ⚡ Mitos vs Realidad
          </button>
          <button
            className={`nav-btn ${activeTab === 'guia' ? 'active' : ''}`}
            onClick={() => handleTabClick('guia')}
          >
            🛡️ Guía Práctica
          </button>
          <button
            className={`nav-btn ${activeTab === 'ayuda' ? 'active' : ''}`}
            onClick={() => handleTabClick('ayuda')}
          >
            🆘 Ayuda SOS
          </button>
        </nav>

        {/* Gamification Bar & Controls */}
        <div className="navbar-actions">
          {/* Streak Badge */}
          <div className="stat-pill streak-pill" title="Racha de aciertos seguidos en el juego">
            <span className="streak-flame">🔥</span>
            <span className="stat-number">{streak}</span>
          </div>

          {/* XP Pill */}
          <div className="stat-pill xp-pill" title="Tus puntos de experiencia">
            <span className="xp-icon">⚡</span>
            <span className="stat-number">{score} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            className={`icon-btn ${soundEnabled ? 'sound-on' : 'sound-off'}`}
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de sonido'}
            aria-label="Alternar sonido"
          >
            {soundEnabled ? '🔊' : '🔇'}
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
