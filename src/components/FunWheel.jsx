import { useState, useRef } from 'react';
import { playSound } from '../utils/sound';

const WHEEL_SECTORS = [
  {
    id: 1,
    title: '+150 XP Extra',
    icon: '🎁',
    color: '#FFB5A7',
    textColor: '#5E2129',
    reward: '¡Ganaste +150 puntos de experiencia por tu curiosidad!',
    xp: 150,
  },
  {
    id: 2,
    title: 'Dato Histórico',
    icon: '💡',
    color: '#B7E4C7',
    textColor: '#1B4332',
    reward: '¿Sabías que el primer condón de látex moderno se fabricó en 1920? ¡Antes se usaban de lino!',
    xp: 60,
  },
  {
    id: 3,
    title: 'Reto Salud',
    icon: '💖',
    color: '#D4C5F9',
    textColor: '#2E1F47',
    reward: 'Reto del día: Pregúntale a un amigo/a si sabe qué significa "I = I" (Indetectable = Intransmisible).',
    xp: 100,
  },
  {
    id: 4,
    title: 'Bonus Racha 🔥',
    icon: '🔥',
    color: '#FFD3B6',
    textColor: '#572E08',
    reward: '¡Tu llama de aprendizaje está que arde! +2 a tu racha de conocimiento.',
    xp: 80,
  },
  {
    id: 5,
    title: 'Super Tip',
    icon: '🛡️',
    color: '#A2D2FF',
    textColor: '#0B2545',
    reward: '¡Consejo de oro! Nunca guardes preservativos en la guantera del auto ni en la billetera; el calor rompe el látex.',
    xp: 75,
  },
  {
    id: 6,
    title: 'Estrella Ninja',
    icon: '🌟',
    color: '#FFF3B0',
    textColor: '#524302',
    reward: '¡Felicidades! Desbloqueaste la medalla secreta "Estudiante Libre de Tabúes".',
    xp: 120,
  },
];

export default function FunWheel({ setScore, setStreak, soundEnabled, onCelebrate }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const audioIntervalRef = useRef(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);
    playSound('pop', soundEnabled);

    // Random sector
    const sectorCount = WHEEL_SECTORS.length;
    const randomIndex = Math.floor(Math.random() * sectorCount);
    const sectorAngle = 360 / sectorCount;

    // Minimum 5 full spins (1800 deg) + offset to land on random sector
    const extraSpins = 360 * 5;
    // Align sector center with top indicator (at 270 deg)
    const targetOffset = 360 - randomIndex * sectorAngle - sectorAngle / 2;
    const finalRotation = rotation + extraSpins + (targetOffset - (rotation % 360));

    setRotation(finalRotation);

    // Audio tick simulation
    let ticks = 0;
    audioIntervalRef.current = setInterval(() => {
      ticks++;
      if (ticks % 2 === 0) playSound('tick', soundEnabled);
      if (ticks > 25) clearInterval(audioIntervalRef.current);
    }, 120);

    setTimeout(() => {
      clearInterval(audioIntervalRef.current);
      const landed = WHEEL_SECTORS[randomIndex];
      setPrize(landed);
      setSpinning(false);
      playSound('fanfare', soundEnabled);

      if (landed.xp) {
        setScore((prev) => prev + landed.xp);
      }
      if (landed.id === 4) {
        setStreak((prev) => prev + 1);
      }
      if (onCelebrate) {
        onCelebrate();
      }
    }, 3600);
  };

  return (
    <div className="fun-wheel-container">
      <div className="wheel-header">
        <span className="section-tag" style={{ background: '#E8DFF5', color: '#6A4C93' }}>
          🎡 RULETA DE PREMIOS Y DATOS
        </span>
        <h3 className="wheel-title">Ruleta Pastel de la Suerte</h3>
        <p className="wheel-sub">
          ¡Gira la ruleta mágica cada vez que quieras para ganar XP extra, consejos y desbloquear datos curiosos!
        </p>
      </div>

      <div className="wheel-interactive-arena">
        {/* Pointer Arrow */}
        <div className="wheel-pointer">▼</div>

        {/* The Rotating Wheel */}
        <div
          className="wheel-disc"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
          }}
        >
          {WHEEL_SECTORS.map((sector, idx) => {
            const angle = (360 / WHEEL_SECTORS.length) * idx;
            return (
              <div
                key={sector.id}
                className="wheel-slice"
                style={{
                  transform: `rotate(${angle}deg)`,
                  backgroundColor: sector.color,
                  color: sector.textColor,
                }}
              >
                <div className="slice-content">
                  <span className="slice-icon">{sector.icon}</span>
                  <span className="slice-label">{sector.title}</span>
                </div>
              </div>
            );
          })}
          {/* Wheel Center Hub */}
          <div className="wheel-hub" onClick={spinWheel}>
            <span>✨</span>
          </div>
        </div>

        {/* Spin CTA Button */}
        <button
          className="btn-primary wheel-spin-btn"
          onClick={spinWheel}
          disabled={spinning}
        >
          <span>{spinning ? '¡Girando la Magia... 💫!' : '¡GIRAR RULETA PASTEL! 🎡'}</span>
        </button>
      </div>

      {/* Prize Result Banner */}
      {prize && (
        <div className="wheel-prize-card">
          <div className="prize-header">
            <span className="prize-icon-large">{prize.icon}</span>
            <div>
              <h4 className="prize-title">¡Premio: {prize.title}!</h4>
              <span className="prize-xp-tag">+{prize.xp} XP</span>
            </div>
          </div>
          <p className="prize-desc">{prize.reward}</p>
        </div>
      )}
    </div>
  );
}
