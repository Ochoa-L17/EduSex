import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WordGame from './components/WordGame';
import ItsExplorer from './components/ItsExplorer';
import MythBuster from './components/MythBuster';
import SafetyGuide from './components/SafetyGuide';
import HelpSection from './components/HelpSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [score, setScore] = useState(150); // XP inicial de bienvenida
  const [streak, setStreak] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quickSosModal, setQuickSosModal] = useState(false);

  // Scroll to section when tab changes
  useEffect(() => {
    if (activeTab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(activeTab);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeTab]);

  return (
    <div className="edusex-app-wrapper">
      {/* Interactive Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        score={score}
        streak={streak}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <main className="main-content">
        {/* Hero Section */}
        <Hero
          onStartGame={() => setActiveTab('juego')}
          onExploreIts={() => setActiveTab('its')}
          onOpenMyths={() => setActiveTab('mitos')}
          soundEnabled={soundEnabled}
        />

        {/* Infinite Word Game Section */}
        <WordGame
          score={score}
          setScore={setScore}
          streak={streak}
          setStreak={setStreak}
          soundEnabled={soundEnabled}
        />

        {/* Detailed ITS Explorer */}
        <ItsExplorer soundEnabled={soundEnabled} />

        {/* Interactive Myths vs Reality */}
        <MythBuster
          score={score}
          setScore={setScore}
          soundEnabled={soundEnabled}
        />

        {/* Condom & PrEP/PEP Practical Guide */}
        <SafetyGuide soundEnabled={soundEnabled} />

        {/* Anonymous Q&A and SOS Help */}
        <HelpSection soundEnabled={soundEnabled} />
      </main>

      {/* Floating SOS Discretion Button */}
      <button
        className="floating-sos-btn"
        onClick={() => setQuickSosModal(true)}
        title="Botón de emergencia / Ayuda rápida y discreta"
      >
        <span className="sos-badge">SOS</span>
        <span className="sos-text">Ayuda Rápida</span>
      </button>

      {/* SOS Modal */}
      {quickSosModal && (
        <div className="sos-modal-overlay" onClick={() => setQuickSosModal(false)}>
          <div className="sos-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sos-modal-top">
              <span className="sos-alert-emoji">🚨</span>
              <h3>¿Necesitas ayuda urgente o discreta?</h3>
              <button
                className="close-sos-btn"
                onClick={() => setQuickSosModal(false)}
              >
                ✖
              </button>
            </div>
            <p className="sos-modal-text">
              Si tuviste una relación sin protección o se rompió el preservativo en las últimas <strong>72 horas</strong>,
              tienes derecho a recibir <strong>PEP (Profilaxis Post-Exposición)</strong> para prevenir el VIH de forma gratuita
              en las urgencias del hospital más cercano.
            </p>
            <div className="sos-actions">
              <a
                href="https://www.google.com"
                className="btn-secondary sos-panic-redirect"
                title="Redirige a Google para salir de la página si alguien se acerca"
              >
                Cerrar y abrir Google (Discreción) 🛡️
              </a>
              <button
                className="btn-primary"
                onClick={() => {
                  setQuickSosModal(false);
                  setActiveTab('ayuda');
                }}
              >
                Ir a Recursos y Teléfonos de Ayuda 📞
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />
    </div>
  );
}

export default App;
