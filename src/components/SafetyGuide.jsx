import { useState } from 'react';
import { CONDOM_STEPS, PREP_PEP_GUIDE } from '../data/guidesData';
import { playSound } from '../utils/sound';

export default function SafetyGuide({ soundEnabled }) {
  const [activeStep, setActiveStep] = useState(0);
  const [simulatedHours, setSimulatedHours] = useState(24);

  const step = CONDOM_STEPS[activeStep];

  const handleStepChange = (index) => {
    playSound('click', soundEnabled);
    setActiveStep(index);
  };

  return (
    <section className="section-container" id="guia">
      <div className="section-header">
        <span className="section-tag">🛡️ GUÍA PRÁCTICA DE AUTOCUIDADO</span>
        <h2 className="section-title">
          Uso Correcto de <span className="gradient-text">Métodos de Barrera</span> y PrEP/PEP
        </h2>
        <p className="section-desc">
          El 99% de las fallas del preservativo no se deben al material, sino a errores comunes al ponerlo
          o retirarlo. ¡Domina la técnica paso a paso!
        </p>
      </div>

      {/* Interactive Condom Step Guide */}
      <div className="guide-card">
        <div className="guide-card-header">
          <span className="guide-badge">TUTORIAL PASO A PASO</span>
          <h3 className="guide-title">Cómo colocar un preservativo a la perfección</h3>
        </div>

        {/* Step Indicator Tabs */}
        <div className="steps-nav-row">
          {CONDOM_STEPS.map((s, idx) => (
            <button
              key={s.step}
              className={`step-indicator-btn ${activeStep === idx ? 'step-active' : ''}`}
              onClick={() => handleStepChange(idx)}
            >
              <span className="step-num">#{s.step}</span>
              <span className="step-name-short">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Step Showcase */}
        <div className="step-showcase-box">
          <div className="step-showcase-top">
            <span className="step-emoji-big">{step.emoji}</span>
            <div className="step-heading-info">
              <span className="step-badge-counter">Paso {step.step} de {CONDOM_STEPS.length}</span>
              <h4 className="step-main-title">{step.title}</h4>
            </div>
          </div>

          <p className="step-description">{step.desc}</p>

          <div className="step-pro-tip">
            <span className="tip-icon">💡</span>
            <div className="tip-content">
              <strong>Tip de Oro:</strong> {step.tip}
            </div>
          </div>

          <div className="step-navigation-controls">
            <button
              className="btn-secondary"
              disabled={activeStep === 0}
              onClick={() => handleStepChange(activeStep - 1)}
            >
              ◀ Paso Anterior
            </button>

            <button
              className="btn-primary"
              disabled={activeStep === CONDOM_STEPS.length - 1}
              onClick={() => handleStepChange(activeStep + 1)}
            >
              Siguiente Paso ▶
            </button>
          </div>
        </div>
      </div>

      {/* PrEP & PEP Interactive Emergency Arena */}
      <div className="prep-pep-section">
        <div className="section-header">
          <span className="section-tag">⚡ MEDICACIÓN DE VANGUARDIA</span>
          <h3 className="section-title">¿Qué son la PrEP y la PEP?</h3>
          <p className="section-desc">
            Son dos herramientas médicas fundamentales para prevenir la infección por VIH antes o después
            de una situación de exposición.
          </p>
        </div>

        <div className="prep-pep-grid">
          {/* PrEP Card */}
          <div className="prep-card">
            <div className="pill-badge-top" style={{ backgroundColor: PREP_PEP_GUIDE.prep.color }}>
              {PREP_PEP_GUIDE.prep.badge}
            </div>
            <h4 className="pill-title">{PREP_PEP_GUIDE.prep.title}</h4>
            <p className="pill-sub">{PREP_PEP_GUIDE.prep.subtitle}</p>

            <div className="pill-body-item">
              <strong>¿Qué es?</strong>
              <p>{PREP_PEP_GUIDE.prep.whatIs}</p>
            </div>

            <div className="pill-body-item highlight-item">
              <strong>Eficacia:</strong>
              <p>{PREP_PEP_GUIDE.prep.efficacy}</p>
            </div>

            <div className="pill-body-item alert-item">
              <strong>Importante:</strong>
              <p>{PREP_PEP_GUIDE.prep.important}</p>
            </div>
          </div>

          {/* PEP Card */}
          <div className="pep-card">
            <div className="pill-badge-top" style={{ backgroundColor: PREP_PEP_GUIDE.pep.color }}>
              {PREP_PEP_GUIDE.pep.badge}
            </div>
            <h4 className="pill-title">{PREP_PEP_GUIDE.pep.title}</h4>
            <p className="pill-sub">{PREP_PEP_GUIDE.pep.subtitle}</p>

            <div className="pill-body-item">
              <strong>¿Qué es?</strong>
              <p>{PREP_PEP_GUIDE.pep.whatIs}</p>
            </div>

            <div className="pill-body-item highlight-item">
              <strong>Límite Crítico:</strong>
              <p>{PREP_PEP_GUIDE.pep.urgency}</p>
            </div>

            <div className="pill-body-item alert-item">
              <strong>¿Dónde acudir?</strong>
              <p>{PREP_PEP_GUIDE.pep.whereToGet}</p>
            </div>
          </div>
        </div>

        {/* 72H Simulator */}
        <div className="pep-simulator-card">
          <h4 className="sim-title">⏱️ Simulador de Emergencia: La Ventana de las 72 Horas</h4>
          <p className="sim-desc">
            Desliza para ver qué tan efectiva es la PEP según las horas transcurridas desde la relación
            desprotegida:
          </p>

          <div className="slider-wrapper">
            <input
              type="range"
              min="1"
              max="96"
              value={simulatedHours}
              onChange={(e) => setSimulatedHours(Number(e.target.value))}
              className="hours-slider"
            />
            <div className="slider-value-display">
              <span className="hours-num">{simulatedHours} horas</span> transcurridas
            </div>
          </div>

          <div
            className={`sim-result-box ${
              simulatedHours <= 24
                ? 'status-optimal'
                : simulatedHours <= 72
                ? 'status-urgent'
                : 'status-late'
            }`}
          >
            {simulatedHours <= 24 && (
              <p>
                🟢 <strong>¡Momento Óptimo!</strong> Dentro de las primeras 24 horas la PEP ofrece su
                máxima tasa de éxito evitando la replicación del VIH. ¡Ve a urgencias ya!
              </p>
            )}
            {simulatedHours > 24 && simulatedHours <= 72 && (
              <p>
                🟡 <strong>¡Tiempo Crítico!</strong> Todavía estás dentro de la ventana de las 72 horas.
                No lo dejes para mañana; acude al hospital más cercano de inmediato.
              </p>
            )}
            {simulatedHours > 72 && (
              <p>
                🔴 <strong>Ventana de PEP Vencida.</strong> Pasadas las 72 horas la PEP ya no es eficaz,
                pero debes acudir al centro de salud para realizarte pruebas diagnósticas y recibir
                orientación personalizada.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Assertive Communication Tips */}
      <div className="communication-tips-card">
        <h3 className="comm-title">💬 Cómo exigir condón con seguridad y sin rollos</h3>
        <p className="comm-sub">
          Si tu pareja pone pretextos para no usar protección, aquí tienes respuestas claras y firmes:
        </p>

        <div className="phrases-grid">
          <div className="phrase-card">
            <span className="pretext-tag">Pretexto típico:</span>
            <p className="pretext-text">"Es que con condón no se siente igual..."</p>
            <span className="response-tag">Tu respuesta:</span>
            <p className="response-text">
              "Con condón se siente tranquilidad y los dos disfrutamos sin estrés. Hay condones ultra finos
              y con texturas geniales; probemos uno."
            </p>
          </div>

          <div className="phrase-card">
            <span className="pretext-tag">Pretexto típico:</span>
            <p className="pretext-text">"¿Acaso no confías en mí?"</p>
            <span className="response-tag">Tu respuesta:</span>
            <p className="response-text">
              "Confío en ti, pero las infecciones muchas veces no dan síntomas y nadie las elige. Cuidarnos
              es la mejor forma de demostrarnos cariño."
            </p>
          </div>

          <div className="phrase-card">
            <span className="pretext-tag">Pretexto típico:</span>
            <p className="pretext-text">"Yo tomo pastillas / tengo implante, no hace falta."</p>
            <span className="response-tag">Tu respuesta:</span>
            <p className="response-text">
              "Las pastillas protegen de embarazos, pero no de las ITS. El condón es el único que nos cubre
              de infecciones a ambos."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
