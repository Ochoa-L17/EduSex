import { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomWord } from '../data/words';
import { playSound } from '../utils/sound';

function createScrambledLetters(wordStr) {
  const letters = wordStr.split('');
  const shuffled = [...letters];
  let attempts = 0;
  while (shuffled.join('') === wordStr && attempts < 15 && wordStr.length > 2) {
    shuffled.sort(() => Math.random() - 0.5);
    attempts++;
  }
  return shuffled;
}

export default function WordGame({
  score,
  setScore,
  streak,
  setStreak,
  soundEnabled,
}) {
  const [gameMode, setGameMode] = useState('scramble'); // 'scramble' | 'hangman'
  const [currentWordObj, setCurrentWordObj] = useState(() => getRandomWord());
  const [usedIds, setUsedIds] = useState(() => [currentWordObj?.id || 'w1']);
  const [roundNumber, setRoundNumber] = useState(1);

  // Scramble mode states
  const [scrambledLetters, setScrambledLetters] = useState(() =>
    currentWordObj ? createScrambledLetters(currentWordObj.word) : []
  );
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');

  // Hangman mode states
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingLives, setRemainingLives] = useState(5);

  // Common states
  const [hintUsed, setHintUsed] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isRoundSolved, setIsRoundSolved] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Confetti canvas ref
  const canvasRef = useRef(null);

  // Level determination
  const getLevelInfo = (xp) => {
    if (xp >= 2500) return { title: 'Leyenda Libre de Tabúes', icon: '👑', color: '#FEE440' };
    if (xp >= 1500) return { title: 'Maestro del Autocuidado', icon: '🌟', color: '#00F5D4' };
    if (xp >= 800) return { title: 'Guardián de la Salud', icon: '🛡️', color: '#FF2A85' };
    if (xp >= 300) return { title: 'Explorador Curioso', icon: '🔍', color: '#9B5DE5' };
    return { title: 'Novato Seguro', icon: '🌱', color: '#00BBF9' };
  };

  const levelInfo = getLevelInfo(score);

  // Trigger neon confetti on victory
  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#FF2A85', '#00F5D4', '#FEE440', '#9B5DE5', '#00BBF9', '#FF6B35'];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 12,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
    }));

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.alpha -= 0.015;
        p.rotation += p.vRot;
        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      if (alive) {
        animationFrame = requestAnimationFrame(render);
      }
    };
    render();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Handle victory
  const handleVictory = useCallback(() => {
    setIsRoundSolved(true);
    const newStreak = streak + 1;
    const xpBonus = 100 + newStreak * 25;
    setStreak(newStreak);
    setScore((prev) => prev + xpBonus);

    if (newStreak % 3 === 0) {
      playSound('fanfare', soundEnabled);
    } else {
      playSound('correct', soundEnabled);
    }

    fireConfetti();
    setStatusMessage({
      type: 'success',
      text: `¡EXCELENTE! +${xpBonus} XP Ganados 🔥`,
    });
  }, [fireConfetti, setScore, setStreak, soundEnabled, streak]);

  // Start new word round
  const startNewWord = useCallback(() => {
    const nextWord = getRandomWord(usedIds);
    setCurrentWordObj(nextWord);
    setUsedIds((prev) => [...prev, nextWord.id]);
    setIsRoundSolved(false);
    setIsGameOver(false);
    setStatusMessage(null);
    setHintUsed(false);
    setRevealedLetters([]);
    setGuessedLetters([]);
    setRemainingLives(5);
    setScrambledLetters(createScrambledLetters(nextWord.word));
    setSelectedIndices([]);
    setCurrentGuess('');
  }, [usedIds]);

  // Click on letter bubble in scramble mode
  const handleLetterBubbleClick = useCallback(
    (index) => {
      if (isRoundSolved || isGameOver) return;
      playSound('click', soundEnabled);

      if (selectedIndices.includes(index)) {
        const pos = selectedIndices.indexOf(index);
        const newIndices = selectedIndices.filter((_, i) => i !== pos);
        setSelectedIndices(newIndices);
        setCurrentGuess(newIndices.map((i) => scrambledLetters[i]).join(''));
      } else {
        const nextIndices = [...selectedIndices, index];
        const nextGuess = nextIndices.map((i) => scrambledLetters[i]).join('');
        setSelectedIndices(nextIndices);
        setCurrentGuess(nextGuess);

        if (nextGuess.length === currentWordObj.word.length) {
          if (nextGuess === currentWordObj.word) {
            handleVictory();
          } else {
            playSound('wrong', soundEnabled);
            setStatusMessage({
              type: 'error',
              text: '¡Casi! Revisa el orden de las letras.',
            });
            setTimeout(() => setStatusMessage(null), 1800);
          }
        }
      }
    },
    [
      currentWordObj.word,
      handleVictory,
      isGameOver,
      isRoundSolved,
      scrambledLetters,
      selectedIndices,
      soundEnabled,
    ]
  );

  // Backspace in scramble
  const handleBackspace = useCallback(() => {
    if (selectedIndices.length === 0 || isRoundSolved) return;
    playSound('click', soundEnabled);
    const newIndices = selectedIndices.slice(0, -1);
    setSelectedIndices(newIndices);
    setCurrentGuess(newIndices.map((i) => scrambledLetters[i]).join(''));
  }, [isRoundSolved, scrambledLetters, selectedIndices, soundEnabled]);

  // Shuffle button in scramble
  const handleShuffle = () => {
    playSound('click', soundEnabled);
    setScrambledLetters(createScrambledLetters(currentWordObj.word));
    setSelectedIndices([]);
    setCurrentGuess('');
  };

  // Hangman guess handler
  const handleHangmanGuess = useCallback(
    (char) => {
      if (guessedLetters.includes(char) || isRoundSolved || isGameOver) return;
      playSound('click', soundEnabled);

      const nextGuessed = [...guessedLetters, char];
      setGuessedLetters(nextGuessed);

      if (currentWordObj.word.includes(char)) {
        const isComplete = currentWordObj.word
          .split('')
          .every((c) => nextGuessed.includes(c) || revealedLetters.includes(c));
        if (isComplete) {
          handleVictory();
        }
      } else {
        const nextLives = remainingLives - 1;
        setRemainingLives(nextLives);
        playSound('wrong', soundEnabled);

        if (nextLives <= 0) {
          setIsGameOver(true);
          setStreak(0);
          setStatusMessage({
            type: 'error',
            text: `¡Se acabaron los intentos! La palabra era "${currentWordObj.word}".`,
          });
        }
      }
    },
    [
      currentWordObj.word,
      guessedLetters,
      handleVictory,
      isGameOver,
      isRoundSolved,
      remainingLives,
      revealedLetters,
      setStreak,
      soundEnabled,
    ]
  );

  // Hint button
  const handleRequestHint = () => {
    if (hintUsed || isRoundSolved || isGameOver) return;
    playSound('click', soundEnabled);
    setHintUsed(true);

    const letters = currentWordObj.word.split('');
    const unrevealed = letters.find((l) => !revealedLetters.includes(l));
    if (unrevealed) {
      setRevealedLetters((prev) => [...prev, unrevealed]);
    }
    setStatusMessage({
      type: 'info',
      text: `Pista activa: ${currentWordObj.hint}`,
    });
  };

  // Next infinite word
  const handleNextWord = useCallback(() => {
    playSound('click', soundEnabled);
    setRoundNumber((prev) => prev + 1);
    startNewWord();
  }, [soundEnabled, startNewWord]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isRoundSolved || isGameOver) {
        if (e.key === 'Enter') handleNextWord();
        return;
      }

      const key = e.key.toUpperCase();
      if (/^[A-ZÑ]$/.test(key)) {
        if (gameMode === 'scramble') {
          const availableIdx = scrambledLetters.findIndex(
            (char, idx) => char === key && !selectedIndices.includes(idx)
          );
          if (availableIdx !== -1) {
            handleLetterBubbleClick(availableIdx);
          }
        } else if (gameMode === 'hangman') {
          handleHangmanGuess(key);
        }
      } else if (e.key === 'Backspace' && gameMode === 'scramble') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameMode,
    handleBackspace,
    handleHangmanGuess,
    handleLetterBubbleClick,
    handleNextWord,
    isGameOver,
    isRoundSolved,
    scrambledLetters,
    selectedIndices,
  ]);

  const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  return (
    <section className="game-section" id="juego">
      {/* Canvas for fireworks / confetti */}
      <canvas ref={canvasRef} className="confetti-canvas"></canvas>

      {/* Game Header Bar */}
      <div className="game-header-card">
        <div className="game-header-meta">
          <div className="round-badge">
            <span className="badge-pulse">●</span>
            <span>Ronda Infinita #{roundNumber}</span>
          </div>

          <div className="level-badge" style={{ borderColor: levelInfo.color }}>
            <span className="level-icon">{levelInfo.icon}</span>
            <span className="level-text">{levelInfo.title}</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="game-mode-toggle">
          <button
            className={`mode-btn ${gameMode === 'scramble' ? 'active' : ''}`}
            onClick={() => {
              playSound('click', soundEnabled);
              setGameMode('scramble');
              setScrambledLetters(createScrambledLetters(currentWordObj.word));
              setSelectedIndices([]);
              setCurrentGuess('');
            }}
          >
            🔤 Letras Revueltas
          </button>
          <button
            className={`mode-btn ${gameMode === 'hangman' ? 'active' : ''}`}
            onClick={() => {
              playSound('click', soundEnabled);
              setGameMode('hangman');
            }}
          >
            ❤️ Ahorcado Neón
          </button>
        </div>
      </div>

      {/* Main Arena */}
      <div className="game-arena-card">
        {/* Category & Hint Pill */}
        <div className="arena-top">
          <span
            className="category-pill"
            style={{
              backgroundColor: `${currentWordObj.color}22`,
              color: currentWordObj.color,
              borderColor: currentWordObj.color,
            }}
          >
            {currentWordObj.category}
          </span>
          <span className="difficulty-pill">
            Dificultad: {currentWordObj.difficulty}
          </span>
        </div>

        {/* Clue Prompt */}
        <div className="clue-box">
          <span className="clue-icon">💡</span>
          <p className="clue-text">{currentWordObj.hint}</p>
        </div>

        {/* Status Alert Message */}
        {statusMessage && (
          <div className={`game-alert alert-${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        {/* MODE 1: SCRAMBLE / ANAGRAM */}
        {gameMode === 'scramble' && (
          <div className="scramble-view">
            {/* Word Display Slot Boxes */}
            <div className="word-slots-container">
              {currentWordObj.word.split('').map((char, index) => {
                const filledLetter = currentGuess[index] || '';
                const isRevealedByHint = revealedLetters.includes(char) && !filledLetter;
                return (
                  <div
                    key={`slot-${index}`}
                    className={`word-slot ${filledLetter ? 'slot-filled' : ''} ${
                      isRevealedByHint ? 'slot-hinted' : ''
                    }`}
                  >
                    {filledLetter || (isRevealedByHint ? char : '')}
                  </div>
                );
              })}
            </div>

            {/* Scrambled Interactive Letter Chips */}
            <div className="letter-bubbles-pool">
              {scrambledLetters.map((letter, idx) => {
                const isSelected = selectedIndices.includes(idx);
                return (
                  <button
                    key={`bubble-${idx}`}
                    className={`letter-bubble ${isSelected ? 'bubble-used' : 'bubble-active'}`}
                    onClick={() => handleLetterBubbleClick(idx)}
                    disabled={isRoundSolved || isGameOver}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Game Controls */}
            <div className="game-controls-row">
              <button
                className="btn-control btn-shuffle"
                onClick={handleShuffle}
                disabled={isRoundSolved}
                title="Reorganizar las letras"
              >
                🔀 Barajar
              </button>

              <button
                className="btn-control btn-backspace"
                onClick={handleBackspace}
                disabled={selectedIndices.length === 0 || isRoundSolved}
                title="Borrar última letra"
              >
                ⌫ Borrar
              </button>

              <button
                className={`btn-control btn-hint ${hintUsed ? 'hint-disabled' : ''}`}
                onClick={handleRequestHint}
                disabled={hintUsed || isRoundSolved}
                title="Revelar una letra de ayuda"
              >
                {hintUsed ? '✅ Pista Usada' : '💡 Pedir Pista'}
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: HANGMAN NEON */}
        {gameMode === 'hangman' && (
          <div className="hangman-view">
            {/* Lives / Shields */}
            <div className="lives-row">
              <span className="lives-label">Vidas del Guardián:</span>
              <div className="lives-hearts">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={`life-${i}`}
                    className={`heart-icon ${i < remainingLives ? 'heart-alive' : 'heart-dead'}`}
                  >
                    {i < remainingLives ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>
            </div>

            {/* Hidden Word Blanks */}
            <div className="word-slots-container">
              {currentWordObj.word.split('').map((char, index) => {
                const isVisible =
                  guessedLetters.includes(char) ||
                  revealedLetters.includes(char) ||
                  isGameOver ||
                  isRoundSolved;
                return (
                  <div
                    key={`hang-slot-${index}`}
                    className={`word-slot ${isVisible ? 'slot-filled' : 'slot-hidden'}`}
                  >
                    {isVisible ? char : ''}
                  </div>
                );
              })}
            </div>

            {/* Virtual Neon Keyboard */}
            <div className="keyboard-grid">
              {alphabet.map((char) => {
                const isGuessed = guessedLetters.includes(char);
                const isCorrect = isGuessed && currentWordObj.word.includes(char);
                const isWrong = isGuessed && !currentWordObj.word.includes(char);
                return (
                  <button
                    key={`key-${char}`}
                    className={`key-btn ${isCorrect ? 'key-correct' : ''} ${
                      isWrong ? 'key-wrong' : ''
                    }`}
                    onClick={() => handleHangmanGuess(char)}
                    disabled={isGuessed || isRoundSolved || isGameOver}
                  >
                    {char}
                  </button>
                );
              })}
            </div>

            <div className="game-controls-row">
              <button
                className={`btn-control btn-hint ${hintUsed ? 'hint-disabled' : ''}`}
                onClick={handleRequestHint}
                disabled={hintUsed || isRoundSolved || isGameOver}
              >
                {hintUsed ? '✅ Pista Usada' : '💡 Pedir Pista Extra'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VICTORY / FACT MODAL */}
      {(isRoundSolved || isGameOver) && (
        <div className="victory-modal-overlay">
          <div className="victory-modal-card">
            <div className="modal-header">
              <span className="modal-emoji">
                {isRoundSolved ? '🎉' : '💡'}
              </span>
              <h3 className="modal-title">
                {isRoundSolved ? '¡Palabra Desbloqueada!' : '¡Aprende para la próxima!'}
              </h3>
              <p className="modal-word-reveal">{currentWordObj.word}</p>
            </div>

            <div className="modal-body">
              <div className="fact-box">
                <span className="fact-badge">🩺 DATO MÉDICO PARA JÓVENES</span>
                <p className="fact-text">{currentWordObj.funFact}</p>
              </div>

              <div className="reward-summary">
                {isRoundSolved ? (
                  <p>
                    Ganaste <strong>+100 XP</strong> y mantienes tu racha en{' '}
                    <strong>🔥 {streak} seguidos</strong>.
                  </p>
                ) : (
                  <p>Tu racha se reinició, ¡pero tu aprendizaje sigue sumando!</p>
                )}
              </div>
            </div>

            <button
              className="btn-primary modal-next-btn"
              onClick={handleNextWord}
              autoFocus
            >
              <span>¡Siguiente Palabra Infinita! 🚀</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
