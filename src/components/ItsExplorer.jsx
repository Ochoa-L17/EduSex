import { useState } from 'react';
import { ITS_DATA } from '../data/itsData';
import { playSound } from '../utils/sound';

export default function ItsExplorer({ soundEnabled }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todas');
  const [expandedId, setExpandedId] = useState(ITS_DATA[0].id);

  const filters = [
    { id: 'todas', label: 'Todas las ITS 🧬' },
    { id: 'virus', label: 'Virus (VPH, VIH, Herpes) 🔬' },
    { id: 'bacterias', label: 'Bacterias (Clamidia, Gonorrea, Sífilis) 🧫' },
    { id: 'curables', label: 'Curables con Tratamiento ✅' },
  ];

  const filteredData = ITS_DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'virus') return item.type.toLowerCase().includes('virus');
    if (selectedFilter === 'bacterias') return item.type.toLowerCase().includes('bacteria');
    if (selectedFilter === 'curables') return item.curable === true;
    return true;
  });

  const toggleExpand = (id) => {
    playSound('click', soundEnabled);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="section-container" id="its">
      {/* Section Header */}
      <div className="section-header">
        <span className="section-tag">🔬 GUÍA COMPLETA Y SIN TABÚES</span>
        <h2 className="section-title">
          Explorador de <span className="gradient-text">Infecciones de Transmisión Sexual</span>
        </h2>
        <p className="section-desc">
          Conocer cómo funcionan te quita el miedo y te da el control. Haz clic en cada ficha para ver
          síntomas, formas de prevención y mitos desmentidos.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-controls-card">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre (ej. Clamidia, VPH, virus, cura)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              ✖
            </button>
          )}
        </div>

        <div className="filter-pills-row">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-pill ${selectedFilter === filter.id ? 'active' : ''}`}
              onClick={() => {
                playSound('click', soundEnabled);
                setSelectedFilter(filter.id);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ITS Cards Grid */}
      <div className="its-grid">
        {filteredData.map((its) => {
          const isExpanded = expandedId === its.id;
          return (
            <div
              key={its.id}
              className={`its-card ${isExpanded ? 'card-expanded' : ''}`}
              style={{ '--its-color': its.color }}
            >
              <div
                className="its-card-header"
                onClick={() => toggleExpand(its.id)}
                role="button"
                tabIndex={0}
              >
                <div className="its-header-left">
                  <span className="its-emoji">{its.emoji}</span>
                  <div>
                    <h3 className="its-name">{its.name}</h3>
                    <span className="its-alias">{its.alias}</span>
                  </div>
                </div>

                <div className="its-header-right">
                  <span className={`cure-badge ${its.curable ? 'cure-yes' : 'cure-treatable'}`}>
                    {its.curable ? 'Curable 100%' : 'Tratable y Controlable'}
                  </span>
                  <span className="expand-indicator">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Collapsed quick tags */}
              {!isExpanded && (
                <div className="its-quick-summary">
                  <span className="quick-tag">Tipo: {its.type}</span>
                  <span className="quick-tag">Frecuencia: {its.commonInTeens.split(' ')[0]}</span>
                </div>
              )}

              {/* Detailed View */}
              {isExpanded && (
                <div className="its-details-body">
                  <div className="detail-block">
                    <h4 className="detail-title">📍 ¿Cómo se transmite?</h4>
                    <p className="detail-text">{its.transmission}</p>
                  </div>

                  <div className="detail-block symptoms-comparison">
                    <h4 className="detail-title">⚠️ Síntomas más comunes</h4>
                    <div className="symptoms-cols">
                      <div className="symptom-box">
                        <span className="gender-label">👦 En personas con pene:</span>
                        <p>{its.symptoms.males}</p>
                      </div>
                      <div className="symptom-box">
                        <span className="gender-label">👧 En personas con vagina:</span>
                        <p>{its.symptoms.females}</p>
                      </div>
                    </div>
                  </div>

                  <div className="detail-block">
                    <h4 className="detail-title">🛡️ ¿Cómo prevenirla?</h4>
                    <p className="detail-text">{its.prevention}</p>
                  </div>

                  <div className="detail-block myth-highlight">
                    <h4 className="detail-title">💡 Mito vs Realidad</h4>
                    <p className="detail-text">{its.myth}</p>
                  </div>

                  <div className="detail-block action-callout">
                    <span className="action-tag">🚀 Plan de Acción:</span>
                    <p>{its.actionPlan}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="empty-results-box">
          <p>No encontramos ninguna ITS que coincida con tu búsqueda. ¡Prueba otro término!</p>
        </div>
      )}

      {/* Semáforo de Síntomas */}
      <div className="symptom-traffic-light">
        <h3 className="traffic-title">🚦 Semáforo de Síntomas: ¿Cuándo ir al médico?</h3>
        <p className="traffic-sub">
          Ante la duda, NUNCA te automediques con pomadas o antibióticos de amigos. Consulta a un profesional.
        </p>

        <div className="traffic-grid">
          <div className="traffic-card red-zone">
            <div className="traffic-header">
              <span className="light-dot red-dot"></span>
              <h4>ROJO: Consulta Inmediata (Hoy)</h4>
            </div>
            <ul>
              <li>Llagas, úlceras o heridas abiertas en genitales, boca o ano.</li>
              <li>Secreción amarillenta o verdosa con pus por el pene o la vagina.</li>
              <li>Dolor intenso y repentino en el bajo vientre o testículos.</li>
              <li>Fiebre alta tras una relación sin protección.</li>
            </ul>
          </div>

          <div className="traffic-card yellow-zone">
            <div className="traffic-header">
              <span className="light-dot yellow-dot"></span>
              <h4>AMARILLO: Cita Esta Semana</h4>
            </div>
            <ul>
              <li>Picazón constante, escozor o irritación en la zona íntima.</li>
              <li>Molestia o leve ardor al orinar que no se quita en 2 días.</li>
              <li>Flujo con olor diferente al habitual o consistencia grumosa.</li>
              <li>Rotura de condón o relación sin protección reciente.</li>
            </ul>
          </div>

          <div className="traffic-card green-zone">
            <div className="traffic-header">
              <span className="light-dot green-dot"></span>
              <h4>VERDE: Chequeo Preventivo Anual</h4>
            </div>
            <ul>
              <li>Te sientes perfecto/a y no tienes ninguna molestia.</li>
              <li>Quieres comenzar una nueva relación con tranquilidad mutua.</li>
              <li>Revisión de carnet de vacunación (VPH y Hepatitis B).</li>
              <li>Asesoría confidencial sobre anticoncepción y PrEP.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
