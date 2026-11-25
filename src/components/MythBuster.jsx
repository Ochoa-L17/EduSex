import { useState } from 'react';
import { MYTHS_DATA } from '../data/mythsData';
import { playSound } from '../utils/sound';

export default function MythBuster({ setScore, soundEnabled }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredState, setAnsweredState] = useState(null); // { isCorrect: boolean, chosen: boolean }
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentMyth = MYTHS_DATA[currentIndex];

  const handleAnswer = (choice) => {
    if (answeredState) return;

    const isCorrect = choice === currentMyth.isTrue;
    if (isCorrect) {
      playSound('correct', soundEnabled);
      setScore((prev) => prev + 50);
      setCorrectCount((prev) => prev + 1);
    } else {
      playSound('wrong', soundEnabled);
    }

    setAnsweredState({
      isCorrect,
      chosen: choice,
    });
  };

  const handleNext = () => {
    playSound('click', soundEnabled);
    if (currentIndex + 1 < MYTHS_DATA.length) {
      setCurrentIndex((prev) => prev + 1);
      setAnsweredState(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    playSound('click', soundEnabled);
    setCurrentIndex(0);
    setAnsweredState(null);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  return (
    <section className="section-container" id="mitos">
      <div className="section-header">
        <span className="section-tag">⚡ CAZADORES DE MITOS</span>
        <h2 className="section-title">
          ¿Mito o <span className="gradient-text">Realidad Científica</span>?
        </h2>
        <p className="section-desc">
          En los pasillos del colegio e internet circulan muchos rumores falsos sobre la sexualidad.
          ¡Pon a prueba tus conocimientos y desmóntalos!
        </p>
      </div>

      <div className="myth-arena">
        {!quizFinished ? (
          <div className="myth-card-container">
            {/* Top progress */}
            <div className="myth-progress-bar">
              <div
                className="myth-progress-fill"
                style={{
                  width: `${((currentIndex + 1) / MYTHS_DATA.length) * 100}%`,
                }}
              ></div>
            </div>

            <div className="myth-card-header">
              <span className="myth-counter">
                Pregunta {currentIndex + 1} de {MYTHS_DATA.length}
              </span>
              <span className="myth-tag-pill">{currentMyth.tag}</span>
            </div>

            {/* Statement */}
            <div className="myth-statement-box">
              <span className="quote-mark">“</span>
              <p className="myth-text">{currentMyth.statement}</p>
            </div>

            {/* Voting Buttons */}
            {!answeredState ? (
              <div className="myth-actions-row">
                <button
                  className="btn-vote btn-vote-false"
                  onClick={() => handleAnswer(false)}
                >
                  <span className="vote-emoji">❌</span>
                  <span className="vote-label">¡ES UN MITO!</span>
                </button>

                <button
                  className="btn-vote btn-vote-true"
                  onClick={() => handleAnswer(true)}
                >
                  <span className="vote-emoji">✅</span>
                  <span className="vote-label">¡ES VERDAD!</span>
                </button>
              </div>
            ) : (
              /* Answer Feedback Card */
              <div
                className={`feedback-card ${
                  answeredState.isCorrect ? 'feedback-correct' : 'feedback-incorrect'
                }`}
              >
                <div className="feedback-top">
                  <span className="feedback-icon">
                    {answeredState.isCorrect ? '🎯 ¡CORRECTO!' : '⚠️ ¡UPS! NO ES ASÍ'}
                  </span>
                  <span className="feedback-badge">{currentMyth.badge}</span>
                </div>

                <p className="feedback-explanation">{currentMyth.explanation}</p>

                <button className="btn-primary feedback-next-btn" onClick={handleNext}>
                  {currentIndex + 1 < MYTHS_DATA.length
                    ? 'Siguiente Mito ➜'
                    : 'Ver Mis Resultados 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Quiz Summary */
          <div className="quiz-results-card">
            <span className="trophy-emoji">🏆</span>
            <h3 className="results-title">¡Desafío de Mitos Completado!</h3>
            <p className="results-score">
              Acertaste <strong>{correctCount}</strong> de <strong>{MYTHS_DATA.length}</strong> mitos.
            </p>
            <p className="results-verdict">
              {correctCount >= 8
                ? '🔥 ¡Increíble! Tienes un nivel de educación sexual de élite. ¡Comparte tus conocimientos con tus amigos/as!'
                : '🌱 ¡Buen esfuerzo! Ahora sabes la verdad médica detrás de los rumores más peligrosos.'}
            </p>
            <button className="btn-primary restart-btn" onClick={handleRestart}>
              Repetir Desafío 🔄
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
