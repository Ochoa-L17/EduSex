import { useState } from 'react';
import { playSound } from '../utils/sound';

export default function HelpSection({ soundEnabled }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState(false);

  const faqs = [
    {
      q: '¿Mis padres o tutores se van a enterar si voy al centro de salud por un chequeo?',
      a: 'En la gran mayoría de países y servicios de salud pública, los adolescentes tienen derecho legal a la confidencialidad médica en salud sexual. El personal de salud está obligado por secreto profesional a no revelar tus consultas ni los resultados de tus pruebas sin tu consentimiento.',
    },
    {
      q: '¿Dónde puedo conseguir preservativos de forma gratuita?',
      a: 'En todos los centros de salud pública (CAP, postas médicas, hospitales), unidades de atención a la juventud, ONGs especializadas en salud sexual y programas universitarios o comunitarios. Solo acércate al mostrador o servicio de enfermería y solicítalos.',
    },
    {
      q: '¿Cómo pido una prueba de ITS sin sentir vergüenza?',
      a: 'Recuerda que para un médico o enfermero/a es tan normal como revisar una garganta inflamada. Solo debes decir con calma: "Hola, me gustaría hacerme un chequeo de rutina de salud sexual y pruebas rápidas de ITS". Te atenderán con respeto.',
    },
    {
      q: '¿Qué pasa si mi prueba de ITS sale positiva?',
      a: '¡Respira hondo! La mayoría de las ITS (clamidia, gonorrea, sífilis, tricomoniasis) se curan 100% con antibióticos sencillos. Y las que son virales (VIH, Herpes, VPH) cuentan con tratamientos altamente eficaces que te permiten llevar una vida larga, plena y saludable sin complicaciones. Lo importante es saberlo a tiempo.',
    },
  ];

  const handleToggleFaq = (idx) => {
    playSound('click', soundEnabled);
    setActiveFaq((prev) => (prev === idx ? null : idx));
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    playSound('correct', soundEnabled);
    setSubmittedQuestion(true);
    setTimeout(() => {
      setUserQuestion('');
      setSubmittedQuestion(false);
    }, 4000);
  };

  return (
    <section className="section-container" id="ayuda">
      <div className="section-header">
        <span className="section-tag">🆘 APOYO CONFIDENCIAL Y RECURSOS</span>
        <h2 className="section-title">
          Zona de <span className="gradient-text">Ayuda y Preguntas Frecuentes</span>
        </h2>
        <p className="section-desc">
          No estás solo/a. Aquí resolvemos tus dudas sin juicios, con total anonimato y con datos médicos
          reales.
        </p>
      </div>

      <div className="help-grid">
        {/* Left: FAQs */}
        <div className="faq-column">
          <h3 className="column-title">❓ Dudas Comunes de Adolescentes</h3>
          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'faq-open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => handleToggleFaq(idx)}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-arrow">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && <div className="faq-answer-box"><p>{faq.a}</p></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Anonymous Ask Box & Emergency Lines */}
        <div className="interactive-help-column">
          {/* Ask Box */}
          <div className="anon-box-card">
            <div className="anon-header">
              <span className="anon-emoji">🔒</span>
              <div>
                <h4 className="anon-title">Buzón Anónimo de Preguntas</h4>
                <p className="anon-sub">Tu consulta no guarda tu nombre ni IP.</p>
              </div>
            </div>

            {submittedQuestion ? (
              <div className="anon-success-msg">
                <span>✅</span>
                <p>
                  ¡Pregunta recibida! Nuestro equipo de educadores de salud la revisará y se añadirá a la
                  sección de respuestas anónimas frecuentes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuestion} className="anon-form">
                <textarea
                  className="anon-textarea"
                  placeholder="Escribe aquí tu duda íntima (ej. Tuve un susto con un condón hace 3 días, ¿qué hago?)..."
                  rows={4}
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                />
                <button type="submit" className="btn-primary anon-submit-btn">
                  Enviar Pregunta Anónima 🚀
                </button>
              </form>
            )}
          </div>

          {/* Hotline Cards */}
          <div className="helpline-card">
            <h4 className="helpline-title">📞 Líneas de Apoyo y Asesoría</h4>
            <p className="helpline-desc">
              Si necesitas orientación urgente o gratuita sobre ITS, PEP o salud reproductiva:
            </p>
            <div className="helpline-badges">
              <div className="helpline-item">
                <span className="phone-icon">🏥</span>
                <div>
                  <strong>Centros de Salud Pública</strong>
                  <span>Atención gratuita en ginecología, urología y pruebas rápidas.</span>
                </div>
              </div>
              <div className="helpline-item">
                <span className="phone-icon">🛡️</span>
                <div>
                  <strong>Línea Nacional de Salud Sexual</strong>
                  <span>Llamadas gratuitas y confidenciales las 24 horas del día.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
