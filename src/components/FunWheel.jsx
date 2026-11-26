import { useState, useRef } from 'react';
import { playSound } from '../utils/sound';

const WHEEL_SECTORS = [
  {
    id: 's1',
    title: '+200 XP',
    subtitle: 'Super Bonus',
    icon: '🎁',
    color: '#FFB5A7', // pastel pink
    textColor: '#571D23',
    type: 'xp',
    reward: '¡Premio gordo! Ganaste +200 XP para subir de nivel como Guardián de la Salud.',
    xp: 200,
  },
  {
    id: 's2',
    title: 'Trivia Flash',
    subtitle: 'Pregunta Rápida',
    icon: '⚡',
    color: '#A2D2FF', // pastel sky
    textColor: '#0B2545',
    type: 'trivia',
    reward: '¡Desafío Flash activado! Responde la pregunta para ganar hasta +150 XP extra.',
    xp: 150,
  },
  {
    id: 's3',
    title: 'Dato Ninja',
    subtitle: 'Curiosidad Médica',
    icon: '💡',
    color: '#B7E4C7', // pastel mint
    textColor: '#1B4332',
    type: 'fact',
    reward: '¿Sabías que el primer condón de látex moderno se fabricó en 1920? Antes se usaban de lino o tripa.',
    xp: 80,
  },
  {
    id: 's4',
    title: 'Reto Salud',
    subtitle: 'Amor Propio',
    icon: '💖',
    color: '#D4C5F9', // pastel lavender
    textColor: '#2E1F47',
    type: 'challenge',
    reward: 'Reto de hoy: Comparte con un amigo/a que la atención en salud sexual para jóvenes es 100% confidencial.',
    xp: 100,
  },
  {
    id: 's5',
    title: '+2 Racha 🔥',
    subtitle: 'Fuego Doble',
    icon: '🔥',
    color: '#FFD3B6', // pastel peach
    textColor: '#5E2905',
    type: 'streak',
    reward: '¡Tu fuego de sabiduría aumenta! Se suman +2 puntos a tu racha de aciertos en el juego.',
    xp: 90,
  },
  {
    id: 's6',
    title: 'Tip de Oro',
    subtitle: 'Super Prevención',
    icon: '🛡️',
    color: '#FFF3B0', // pastel butter
    textColor: '#4D3E02',
    type: 'tip',
    reward: '¡Regla sagrada! Jamás abras un condón con dientes ni tijeras. Usa siempre las yemas de tus dedos.',
    xp: 85,
  },
  {
    id: 's7',
    title: 'Sello Libre',
    subtitle: 'Medalla Secreta',
    icon: '🌟',
    color: '#FFC2D1', // pastel rose
    textColor: '#591626',
    type: 'badge',
    reward: '¡Desbloqueaste el Sello Mágico "Juventud Informada y Libre de Culpa"!',
    xp: 120,
  },
  {
    id: 's8',
    title: 'Consejo Zen',
    subtitle: 'Sabiduría Animal',
    icon: '🐾',
    color: '#CCE3DE', // pastel sage
    textColor: '#1C3A35',
    type: 'pet',
    reward: 'Michi y Foxy te recuerdan: La vacuna del VPH previene el 90% de los cánceres de cuello uterino y verrugas.',
    xp: 95,
  },
];

const TRIVIA_QUESTIONS = [
  {
    q: '¿Cuál es el tiempo límite MÁXIMO para iniciar la PEP tras una relación de riesgo?',
    options: ['24 horas', '72 horas', '1 semana'],
    correct: 1,
    tip: '¡Exacto! La PEP debe tomarse dentro de las 72 horas para evitar la infección por VIH.',
  },
  {
    q: '¿Qué significa el principio científico I = I respecto al VIH?',
    options: [
      'Infección = Incurable',
      'Indetectable = Intransmisible',
      'Inmunidad = Inmediata',
    ],
    correct: 1,
    tip: '¡Genial! Una persona con carga viral indetectable NO transmite el virus por vía sexual.',
  },
  {
    q: '¿Ponerse dos preservativos al mismo tiempo da el doble de seguridad?',
    options: [
      'Sí, es mucho más seguro',
      'No, la fricción entre látex los rompe',
      'Solo si se usa lubricante de cocina',
    ],
    correct: 1,
    tip: '¡Correcto! Dos condones juntos se frotan y se rompen con facilidad. Solo se usa uno.',
  },
  {
    q: '¿El sexo oral puede transmitir Infecciones de Transmisión Sexual (ITS)?',
    options: [
      'No, solo el sexo con penetración',
      'Sí, bacterias y virus pueden alojarse en garganta o boca',
      'Solo si se ingiere alcohol',
    ],
    correct: 1,
    tip: '¡Muy bien! Infecciones como gonorrea, herpes y sífilis pueden transmitirse por sexo oral.',
  },
  {
    q: '¿Las pastillas anticonceptivas protegen contra las ITS?',
    options: [
      'Sí, contra todas las bacterias',
      'No, solo evitan embarazos',
      'Solo si se toman a tiempo',
    ],
    correct: 1,
    tip: '¡Excelente! Los métodos hormonales solo evitan embarazos. El condón previene las ITS.',
  },
];

export default function FunWheel({ setScore, setStreak, soundEnabled, onCelebrate }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [totalSpins, setTotalSpins] = useState(() => {
    try {
      const saved = localStorage.getItem('edusex_wheel_spins');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [totalXpWon, setTotalXpWon] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('edusex_wheel_badges');
      return saved ? JSON.parse(saved) : ['s1'];
    } catch {
      return ['s1'];
    }
  });
  const [currentTrivia, setCurrentTrivia] = useState(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState(null);
  const [activeTabMode, setActiveTabMode] = useState('ruleta'); // 'ruleta' | 'coleccion'

  const audioIntervalRef = useRef(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);
    setCurrentTrivia(null);
    setTriviaAnswered(false);
    setSelectedTriviaOption(null);
    playSound('pop', soundEnabled);

    const numSectors = WHEEL_SECTORS.length;
    const sectorAngle = 360 / numSectors; // 45 deg

    // Pick random target sector index (0 to 7)
    const targetIndex = Math.floor(Math.random() * numSectors);

    // To align sector center with pointer at top (0 deg):
    // Slice i is centered at: i * 45 + 22.5 deg.
    // When wheel rotates by R deg, needle at 0 deg points to: (360 - (R % 360)) % 360.
    // We want: (360 - (R % 360)) = targetIndex * 45 + 22.5.
    const sliceCenterAngle = targetIndex * sectorAngle + sectorAngle / 2;
    const extraSpins = 360 * 5; // 5 full turns minimum
    const currentModulo = rotation % 360;
    const targetModulo = 360 - sliceCenterAngle;

    let delta = targetModulo - currentModulo;
    if (delta <= 0) delta += 360;

    const finalRotation = rotation + extraSpins + delta;
    setRotation(finalRotation);

    // Audio tick simulation
    let ticks = 0;
    audioIntervalRef.current = setInterval(() => {
      ticks++;
      if (ticks % 2 === 0) playSound('tick', soundEnabled);
      if (ticks > 28) clearInterval(audioIntervalRef.current);
    }, 110);

    setTimeout(() => {
      clearInterval(audioIntervalRef.current);
      const landed = WHEEL_SECTORS[targetIndex];
      setPrize(landed);
      setSpinning(false);
      playSound('fanfare', soundEnabled);

      const newSpins = totalSpins + 1;
      setTotalSpins(newSpins);
      try {
        localStorage.setItem('edusex_wheel_spins', String(newSpins));
      } catch {}

      // Unlock badge in collection
      if (!unlockedBadges.includes(landed.id)) {
        const nextBadges = [...unlockedBadges, landed.id];
        setUnlockedBadges(nextBadges);
        try {
          localStorage.setItem('edusex_wheel_badges', JSON.stringify(nextBadges));
        } catch {}
      }

      // Handle rewards
      if (landed.type === 'streak') {
        setStreak((prev) => prev + 2);
      }

      if (landed.type === 'trivia') {
        const randomQ = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
        setCurrentTrivia(randomQ);
      } else {
        if (landed.xp) {
          setScore((prev) => prev + landed.xp);
          setTotalXpWon((prev) => prev + landed.xp);
        }
      }

      if (onCelebrate) {
        onCelebrate();
      }
    }, 3600);
  };

  const handleTriviaAnswer = (optionIdx) => {
    if (triviaAnswered || !currentTrivia) return;
    setTriviaAnswered(true);
    setSelectedTriviaOption(optionIdx);

    const isCorrect = optionIdx === currentTrivia.correct;
    if (isCorrect) {
      playSound('correct', soundEnabled);
      setScore((s) => s + 150);
      setTotalXpWon((x) => x + 150);
    } else {
      playSound('wrong', soundEnabled);
      setScore((s) => s + 40); // consolation XP for participating
      setTotalXpWon((x) => x + 40);
    }
  };

  // SVG Geometry Calculation for 8-slice wheel
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 160;
  const sliceAngle = 360 / WHEEL_SECTORS.length;

  // Pegs around rim
  const numPegs = 24;
  const pegRadius = 173;

  return (
    <div className="fun-wheel-container">
      {/* Top Section Header */}
      <div className="wheel-header">
        <span className="section-tag" style={{ background: '#E8DFF5', color: '#6A4C93' }}>
          🎡 RULETA PASTEL DEL SABER
        </span>
        <h3 className="wheel-title">Ruleta Mágica de Premios y Curiosidades</h3>
        <p className="wheel-sub">
          ¡Gira la ruleta interactiva para ganar puntos XP, activar desafíos flash, obtener tips de
          autocuidado y completar tu colección de 8 sellos saludables!
        </p>

        {/* Tab Switcher: Ruleta vs Colección */}
        <div className="wheel-tab-switcher">
          <button
            className={`wheel-tab-btn ${activeTabMode === 'ruleta' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('ruleta')}
          >
            🎡 Girar la Ruleta
          </button>
          <button
            className={`wheel-tab-btn ${activeTabMode === 'coleccion' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('coleccion')}
          >
            🏆 Mi Colección ({unlockedBadges.length}/{WHEEL_SECTORS.length})
          </button>
        </div>
      </div>

      {/* MODE 1: THE WHEEL ARENA */}
      {activeTabMode === 'ruleta' && (
        <div className="wheel-interactive-arena">
          {/* Wheel Stats Bar */}
          <div className="wheel-stats-pills">
            <span className="wheel-stat-pill">
              🔄 Giros: <strong>{totalSpins}</strong>
            </span>
            <span className="wheel-stat-pill xp-gain-pill">
              ✨ XP Ganado: <strong>+{totalXpWon}</strong>
            </span>
            <span className="wheel-stat-pill">
              🏅 Sellos: <strong>{unlockedBadges.length} / 8</strong>
            </span>
          </div>

          {/* Wheel Stage */}
          <div className="wheel-svg-stage">
            {/* Pointer / Needle at 12 o'clock */}
            <div className="wheel-needle-top">
              <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
                <path
                  d="M22 50L6 14C3 8 7 2 14 2H30C37 2 41 8 38 14L22 50Z"
                  fill="#FF6B8B"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                <circle cx="22" cy="12" r="5" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Complete SVG Wheel */}
            <svg
              className="wheel-svg-canvas"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? 'transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)'
                  : 'none',
              }}
            >
              <defs>
                <filter id="wheelShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#8E78A8" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* Outer Golden Rim */}
              <circle
                cx={cx}
                cy={cy}
                r={radius + 18}
                fill="#FFFFFF"
                stroke="#EDE4F7"
                strokeWidth="6"
                filter="url(#wheelShadow)"
              />

              {/* Outer Pegs / Light Bulbs */}
              {Array.from({ length: numPegs }).map((_, idx) => {
                const pegAngle = (360 / numPegs) * idx * (Math.PI / 180);
                const px = cx + pegRadius * Math.cos(pegAngle);
                const py = cy + pegRadius * Math.sin(pegAngle);
                return (
                  <circle
                    key={`peg-${idx}`}
                    cx={px}
                    cy={py}
                    r="4.5"
                    fill={idx % 2 === 0 ? '#FFD166' : '#FF8FAB'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Slices Group */}
              <g id="wheel-slices-group">
                {WHEEL_SECTORS.map((sector, i) => {
                  const startAngle = i * sliceAngle;
                  const endAngle = (i + 1) * sliceAngle;
                  const midAngle = (startAngle + endAngle) / 2;

                  // Radians for SVG arc (starting at 12 o'clock = -90 deg)
                  const r1 = (startAngle - 90) * (Math.PI / 180);
                  const r2 = (endAngle - 90) * (Math.PI / 180);
                  const rMid = (midAngle - 90) * (Math.PI / 180);

                  const x1 = cx + radius * Math.cos(r1);
                  const y1 = cy + radius * Math.sin(r1);
                  const x2 = cx + radius * Math.cos(r2);
                  const y2 = cy + radius * Math.sin(r2);

                  // Label coordinates along radius
                  const iconDist = 118;
                  const textDist = 88;
                  const ix = cx + iconDist * Math.cos(rMid);
                  const iy = cy + iconDist * Math.sin(rMid);
                  const tx = cx + textDist * Math.cos(rMid);
                  const ty = cy + textDist * Math.sin(rMid);

                  return (
                    <g key={sector.id} className="svg-slice-group">
                      {/* Pie Wedge Path */}
                      <path
                        d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                        fill={sector.color}
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                      />

                      {/* Icon */}
                      <text
                        x={ix}
                        y={iy + 5}
                        fontSize="22"
                        textAnchor="middle"
                        transform={`rotate(${midAngle}, ${ix}, ${iy})`}
                      >
                        {sector.icon}
                      </text>

                      {/* Title */}
                      <text
                        x={tx}
                        y={ty + 4}
                        fontSize="12"
                        fontWeight="800"
                        fontFamily="var(--font-sans)"
                        fill={sector.textColor}
                        textAnchor="middle"
                        transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                      >
                        {sector.title}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Center Hub */}
              <circle
                cx={cx}
                cy={cy}
                r="36"
                fill="#FFFFFF"
                stroke="#EDE4F7"
                strokeWidth="4"
              />
              <circle cx={cx} cy={cy} r="28" fill="#F3E8FF" />
              <text x={cx} y={cy + 8} fontSize="22" textAnchor="middle">
                ✨
              </text>
            </svg>
          </div>

          {/* Spin Button */}
          <button
            className="btn-primary wheel-spin-btn"
            onClick={spinWheel}
            disabled={spinning}
          >
            <span>{spinning ? '¡Girando la Magia... 💫!' : '¡GIRAR RULETA PASTEL! 🎡'}</span>
          </button>

          {/* PRIZE & INTERACTION CARD */}
          {prize && (
            <div className="wheel-prize-card">
              <div className="prize-header">
                <span className="prize-icon-large">{prize.icon}</span>
                <div className="prize-meta">
                  <span className="prize-tag">{prize.subtitle}</span>
                  <h4 className="prize-title">{prize.title}</h4>
                </div>
                {prize.xp && <span className="prize-xp-tag">+{prize.xp} XP</span>}
              </div>

              <p className="prize-desc">{prize.reward}</p>

              {/* TRIVIA FLASH MINI-GAME */}
              {prize.type === 'trivia' && currentTrivia && (
                <div className="trivia-flash-box">
                  <div className="trivia-q-header">
                    <span className="trivia-badge">⚡ PREGUNTA RELÁMPAGO</span>
                    <p className="trivia-question-text">{currentTrivia.q}</p>
                  </div>

                  <div className="trivia-options-list">
                    {currentTrivia.options.map((opt, oIdx) => {
                      const isChosen = selectedTriviaOption === oIdx;
                      const isCorrect = oIdx === currentTrivia.correct;
                      let btnClass = 'trivia-opt-btn';
                      if (triviaAnswered) {
                        if (isCorrect) btnClass += ' opt-correct';
                        else if (isChosen) btnClass += ' opt-wrong';
                        else btnClass += ' opt-disabled';
                      }

                      return (
                        <button
                          key={oIdx}
                          className={btnClass}
                          onClick={() => handleTriviaAnswer(oIdx)}
                          disabled={triviaAnswered}
                        >
                          <span className="opt-letter">
                            {['A', 'B', 'C'][oIdx]})
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {triviaAnswered && (
                    <div
                      className={`trivia-feedback-row ${
                        selectedTriviaOption === currentTrivia.correct
                          ? 'trivia-correct-feedback'
                          : 'trivia-wrong-feedback'
                      }`}
                    >
                      <span className="trivia-feedback-icon">
                        {selectedTriviaOption === currentTrivia.correct ? '🎉' : '💡'}
                      </span>
                      <p>{currentTrivia.tip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: BADGE COLLECTION */}
      {activeTabMode === 'coleccion' && (
        <div className="wheel-collection-arena">
          <div className="collection-summary-box">
            <h4>Colección de Sellos de Salud</h4>
            <p>
              ¡Gira la ruleta para desbloquear los 8 sellos del conocimiento y conviértete en
              un/a Maestro/a del Autocuidado!
            </p>
            <div className="collection-progress-bar">
              <div
                className="collection-progress-fill"
                style={{
                  width: `${(unlockedBadges.length / WHEEL_SECTORS.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="badges-grid-showcase">
            {WHEEL_SECTORS.map((sector) => {
              const isUnlocked = unlockedBadges.includes(sector.id);
              return (
                <div
                  key={sector.id}
                  className={`badge-item-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}
                  style={{ '--badge-accent': sector.color }}
                >
                  <div className="badge-icon-box">
                    <span>{isUnlocked ? sector.icon : '🔒'}</span>
                  </div>
                  <h5 className="badge-card-title">{sector.title}</h5>
                  <span className="badge-card-sub">{sector.subtitle}</span>
                  <span className={`badge-status-pill ${isUnlocked ? 'status-got' : 'status-missing'}`}>
                    {isUnlocked ? '✅ Desbloqueado' : 'Gira para ganar'}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            className="btn-primary back-to-spin-btn"
            onClick={() => setActiveTabMode('ruleta')}
          >
            🎡 Volver a Girar la Ruleta
          </button>
        </div>
      )}
    </div>
  );
}
