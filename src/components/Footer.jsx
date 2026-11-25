export default function Footer({ onNavClick }) {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <span className="brand-emoji">⚡</span>
            <span className="brand-title">Edu<span className="brand-highlight">Sex</span></span>
          </div>
          <p className="footer-motto">
            Educación sexual integral, empática y gamificada para adolescentes. Porque cuidarse no debe ser
            aburrido ni motivo de vergüenza.
          </p>
        </div>

        <div className="footer-nav-col">
          <h4 className="footer-heading">Secciones Rápidas</h4>
          <ul className="footer-links">
            <li><button onClick={() => onNavClick('inicio')}>Inicio</button></li>
            <li><button onClick={() => onNavClick('juego')}>Juego Infinito de Palabras</button></li>
            <li><button onClick={() => onNavClick('its')}>Explorador de ITS</button></li>
            <li><button onClick={() => onNavClick('mitos')}>Mitos vs Realidad</button></li>
            <li><button onClick={() => onNavClick('guia')}>Guía de Preservativos y PrEP</button></li>
            <li><button onClick={() => onNavClick('ayuda')}>Ayuda SOS y Dudas</button></li>
          </ul>
        </div>

        <div className="footer-rights-col">
          <h4 className="footer-heading">Aviso Importante</h4>
          <p className="disclaimer-text">
            Este prototipo web tiene fines estrictamente educativos y de concientización para adolescentes.
            No reemplaza la consulta, diagnóstico o tratamiento de un médico especialista en infectología o
            salud sexual.
          </p>
          <div className="youth-rights-pill">
            <span>🌈 La salud sexual es un derecho universal, libre y confidencial.</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>© 2026 EduSex • Prototipo Educativo React para Jóvenes • Creado con amor y ciencia.</p>
      </div>
    </footer>
  );
}
