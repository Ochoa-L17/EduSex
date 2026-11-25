import { playSound } from '../utils/sound';

export default function Hero({ onStartGame, onExploreIts, onOpenMyths, onOpenWheel, soundEnabled }) {
  const handleClick = (callback) => {
    playSound('pop', soundEnabled);
    callback();
  };

  return (
    <section className="hero-section">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>
      <div className="hero-glow-3"></div>

      <div className="hero-badge-pill">
        <span className="badge-sparkle">🌸</span>
        <span>Espacio Seguro • 100% Confidencial • Cero Tabúes</span>
      </div>

      <h1 className="hero-title">
        Tu cuerpo, tus decisiones.
        <br />
        <span className="gradient-text-pastel">Aprende jugando sin rollos raros.</span>
      </h1>

      <p className="hero-subtitle">
        Descubre cómo protegerte de las Infecciones de Transmisión Sexual (ITS), resolver dudas con tu mascota
        guía y divertirte con nuestro <strong>juego infinito de palabras</strong> y la <strong>ruleta pastel</strong>.
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
          onClick={() => handleClick(onOpenWheel)}
        >
          <span className="btn-icon">🎡</span>
          <span>Girar Ruleta Pastel</span>
        </button>

        <button
          className="btn-tertiary"
          onClick={() => handleClick(onExploreIts)}
        >
          <span className="btn-icon">🔍</span>
          <span>Explorador de ITS</span>
        </button>

        <button
          className="btn-quaternary"
          onClick={() => handleClick(onOpenMyths)}
        >
          <span className="btn-icon">⚡</span>
          <span>Mitos vs Realidad</span>
        </button>
      </div>

      {/* Live Impact Stats Grid */}
      <div className="hero-stats-grid">
        <div className="stat-card card-pink">
          <div className="stat-card-top">
            <span className="stat-icon">📈</span>
            <span className="stat-value">1 de cada 2</span>
          </div>
          <p className="stat-desc">
            Nuevas ITS ocurren en menores de 25 años. ¡La información salva vidas!
          </p>
        </div>

        <div className="stat-card card-mint">
          <div className="stat-card-top">
            <span className="stat-icon">🛡️</span>
            <span className="stat-value">98%</span>
          </div>
          <p className="stat-desc">
            De protección contra ITS y embarazos con el uso correcto del preservativo.
          </p>
        </div>

        <div className="stat-card card-lavender">
          <div className="stat-card-top">
            <span className="stat-icon">🤫</span>
            <span className="stat-value">&gt;70%</span>
          </div>
          <p className="stat-desc">
            De las ITS no dan síntomas visibles al inicio. ¡Los chequeos son la clave!
          </p>
        </div>

        <div className="stat-card card-peach">
          <div className="stat-card-top">
            <span className="stat-icon">💖</span>
            <span className="stat-value">I = I</span>
          </div>
          <p className="stat-desc">
            Indetectable = Intransmisible. Con tratamiento adecuado se corta la transmisión.
          </p>
        </div>
      </div>
    </section>
  );
}
