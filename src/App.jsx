import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PetCompanion from './components/PetCompanion';
import WordGame from './components/WordGame';
import FunWheel from './components/FunWheel';
import ItsExplorer from './components/ItsExplorer';
import MythBuster from './components/MythBuster';
import SafetyGuide from './components/SafetyGuide';
import HelpSection from './components/HelpSection';
import FloatingReactions from './components/FloatingReactions';
import { emitReaction } from './utils/reactions';
import Footer from './components/Footer';
import { playSound } from './utils/sound';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [score, setScore] = useState(250); // XP inicial
  const [streak, setStreak] = useState(2);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quickSosModal, setQuickSosModal] = useState(false);

  // Confetti canvas ref for party mode
  const partyCanvasRef = useRef(null);

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

  // Trigger party mode pastel confetti
  const triggerPartyMode = useCallback(() => {
    playSound('fanfare', soundEnabled);
    emitReaction('🎉');

    const canvas = partyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Pastel colors: pink, lilac, mint, butter, peach, baby blue
    const pastelColors = ['#FFB5A7', '#D4C5F9', '#B7E4C7', '#FFF3B0', '#FFD3B6', '#A2D2FF', '#FFC6FF'];
    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 3,
      size: Math.random() * 10 + 6,
      color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
      isHeart: Math.random() > 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.008;
        p.rotation += p.vRot;
        if (p.alpha > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.isHeart) {
            // Draw cute circle / candy
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Draw rectangle confetti
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
          }
          ctx.restore();
        }
      });
      if (alive) {
        requestAnimationFrame(render);
      }
    };
    render();
  }, [soundEnabled]);

  const handleReactionTrigger = useCallback(() => {
    playSound('pop', soundEnabled);
    setScore((s) => s + 5);
  }, [soundEnabled]);

  return (
    <div className="edusex-app-wrapper pastel-theme">
      {/* Fullscreen Party Canvas */}
      <canvas ref={partyCanvasRef} className="party-confetti-canvas"></canvas>

      {/* Floating Reactions Dock & Bubbles */}
      <FloatingReactions onTrigger={handleReactionTrigger} />

      {/* Perfectly Leveled Pastel Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        score={score}
        streak={streak}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onPartyMode={triggerPartyMode}
      />

      <main className="main-content">
        {/* Hero Section */}
        <Hero
          onStartGame={() => setActiveTab('juego')}
          onExploreIts={() => setActiveTab('its')}
          onOpenMyths={() => setActiveTab('mitos')}
          onOpenWheel={() => {
            const el = document.getElementById('ruleta');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          soundEnabled={soundEnabled}
        />

        {/* Fun Mascot Companion Card */}
        <section className="companion-wrapper">
          <PetCompanion
            soundEnabled={soundEnabled}
            onAddReaction={(emoji) => setLatestReaction(emoji)}
          />
        </section>

        {/* Infinite Word Game Section */}
        <WordGame
          score={score}
          setScore={setScore}
          streak={streak}
          setStreak={setStreak}
          soundEnabled={soundEnabled}
        />

        {/* Fun Fortune Wheel Section */}
        <section id="ruleta" className="section-container">
          <FunWheel
            setScore={setScore}
            setStreak={setStreak}
            soundEnabled={soundEnabled}
            onCelebrate={triggerPartyMode}
          />
        </section>

        {/* Detailed ITS Explorer */}
        <ItsExplorer soundEnabled={soundEnabled} />

        {/* Interactive Myths vs Reality */}
        <MythBuster
          setScore={setScore}
          soundEnabled={soundEnabled}
        />

        {/* Condom & PrEP/PEP Practical Guide */}
        <SafetyGuide soundEnabled={soundEnabled} />

        {/* Anonymous Q&A and SOS Help */}
        <HelpSection soundEnabled={soundEnabled} />
      </main>

      {/* Floating SOS Discretion Button (Soft Pastel Alert) */}
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
              <span className="sos-alert-emoji">🌸</span>
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
