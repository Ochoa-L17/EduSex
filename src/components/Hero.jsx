import { playSound } from '../utils/sound';

export default function Hero({ onStartGame, onExploreIts, onOpenMyths, soundEnabled }) {
  const handleClick = (callback) => {
    playSound('click', soundEnabled);
    callback();
  };

  return (
    <section className="hero-section">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="hero-badge-pill">
        <span className="badge-sparkle">✨</span>
        <span>Espacio Seguro • 100% Confidencial • Cero Vergüenza</span>
      </div>

      <h1 className="hero-title">
        Tu cuerpo, tus decisiones.
        <br />
        <span className="gradient-text">Cero mitos, 100% diversión.</span>
      </h1>

      <p className="hero-subtitle">
        Aprende sobre prevención de Infecciones de Transmisión Sexual (ITS), métodos de barrera,
        consentimiento y salud sexual con desafíos interactivos y un <strong>juego infinito de palabras</strong>.
        ¡Sin tabúes ni explicaciones aburridas!
      </p>

      {/* Action Buttons */}
      <div className="hero-cta-group">
        <button
          className="btn-primary cta-pulse"
          onClick={() => handleClick(onStartGame)}
        >
          <span className="btn-icon">🎮</span>
          <span>Jugar Desafío Infinito</span>
        </button>

        <button
          className="btn-secondary"
          onClick={() => handleClick(onExploreIts)}
        >
          <span className="btn-icon">🔍</span>
          <span>Explorar Fichas ITS</span>
        </button>

        <button
          className="btn-tertiary"
          onClick={() => handleClick(onOpenMyths)}
        >
          <span className="btn-icon">⚡</span>
          <span>Mitos vs Realidad</span>
        </button>
      </div>

      {/* Live Impact Stats Grid */}
      <div className="hero-stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">📈</span>
            <span className="stat-value">1 de cada 2</span>
          </div>
          <p className="stat-desc">
            Nuevas ITS ocurren en menores de 25 años. ¡La información salva vidas!
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">🛡️</span>
            <span className="stat-value">98%</span>
          </div>
          <p className="stat-desc">
            De protección contra ITS y embarazos con el uso correcto del preservativo.
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">🤫</span>
            <span className="stat-value">&gt;70%</span>
          </div>
          <p className="stat-desc">
            De las ITS no dan síntomas visibles al inicio. ¡Los chequeos son la clave!
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">💖</span>
            <span className="stat-value">I = I</span>
          </div>
          <p className="stat-desc">
            Indetectable = Intransmisible. El tratamiento adecuado corta la transmisión.
          </p>
        </div>
      </div>
    </section>
  );
}
