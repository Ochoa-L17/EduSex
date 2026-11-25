import { useState } from 'react';
import { playSound } from '../utils/sound';
import { emitReaction } from '../utils/reactions';

const PETS = [
  {
    id: 'foxy',
    name: 'Foxy',
    emoji: '🦊',
    role: 'Zorro Astuto del Autocuidado',
    color: '#FFD3B6',
    quotes: [
      '¡Hola! Recuerda: el preservativo se abre con los dedos, ¡cero dientes! 🦷❌',
      '¡Tener dudas es normal! Preguntar es de personas inteligentes. 🧠✨',
      'El condón también viene en versiones sin látex si eres alérgico/a. 🛡️',
      '¡Vas con todo en ese juego de palabras! Sigue así. 🔥',
    ],
  },
  {
    id: 'michi',
    name: 'Michi',
    emoji: '🐱',
    role: 'Gatito Anti-Tabúes',
    color: '#FFE5EC',
    quotes: [
      '¡Miau! ¿Sabías que el 70% de las ITS no duelen al principio? ¡Hazte chequeos! 🩺',
      'El sexo oral también transmite ITS como gonorrea o herpes; usa barreras. 🍓',
      'El consentimiento se puede cambiar en cualquier momento. ¡Siempre libres! 💕',
      '¡Un michi bien informado nunca se deja engañar por mitos! 🐾',
    ],
  },
  {
    id: 'sparky',
    name: 'Sparky',
    emoji: '🦄',
    role: 'Unicornio Rompe-Mitos',
    color: '#E8DFF5',
    quotes: [
      '¡Mágico saber que Indetectable = Intransmisible (I=I)! Rompamos el estigma. 🌈',
      'La vacuna del VPH es tanto para hombres como para mujeres. ¡Pídela! 💉',
      'La PEP funciona dentro de las primeras 72 horas. ¡El tiempo vale oro! ⏱️',
      '¡Cuidar tu cuerpo es el acto de amor propio más genial del universo! 💖',
    ],
  },
  {
    id: 'bambu',
    name: 'Bambú',
    emoji: '🐼',
    role: 'Panda Zen de la Salud',
    color: '#D8F3DC',
    quotes: [
      'Respira hondo... Ir a la consulta de salud sexual es confidencial por ley. 🍃',
      'No necesitas sentir culpa por disfrutar; solo necesitas información real. 🎋',
      '¡Dos condones juntos se rompen por la fricción! Solo usa uno a la vez. 🐼',
      '¡Estoy muy orgulloso de que te estés educando hoy aquí! 🌿',
    ],
  },
  {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    role: 'Conejita de la Prevención',
    color: '#FCF6BD',
    quotes: [
      '¡El lubricante a base de agua evita que el látex se rompa! 💧',
      '¡Una prueba rápida de VIH solo toma un pinchacito y 15 minutos! 🩸',
      'Si una pareja no quiere usar condón, ¡no hay acción! Tú mandas. 👑',
      '¡Vamos a romper el récord de racha de palabras! 🥕✨',
    ],
  },
];

export default function PetCompanion({ soundEnabled }) {
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);

  const pet = PETS[selectedPetIndex];

  const handleNextQuote = () => {
    playSound('pop', soundEnabled);
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);
    setCurrentQuoteIndex((prev) => (prev + 1) % pet.quotes.length);
    emitReaction('💖');
  };

  const handleSelectPet = (index) => {
    playSound('pop', soundEnabled);
    setSelectedPetIndex(index);
    setCurrentQuoteIndex(0);
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);
    emitReaction('✨');
  };

  return (
    <div className="pet-companion-card" style={{ '--pet-bg': pet.color }}>
      <div className="pet-top-row">
        <div className="pet-info">
          <span className="pet-badge">🧸 TU MASCOTA EDUSEX</span>
          <h4 className="pet-title">
            {pet.name} <span className="pet-role-tag">({pet.role})</span>
          </h4>
        </div>

        {/* Pet selector pills */}
        <div className="pet-selector-pills">
          {PETS.map((p, idx) => (
            <button
              key={p.id}
              className={`pet-pill-btn ${selectedPetIndex === idx ? 'active' : ''}`}
              onClick={() => handleSelectPet(idx)}
              title={`Elegir a ${p.name}`}
            >
              {p.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="pet-body-interactive" onClick={handleNextQuote}>
        <div className={`pet-avatar-circle ${isWiggling ? 'pet-wiggle' : ''}`}>
          <span className="pet-emoji-big">{pet.emoji}</span>
          <span className="tap-hint-badge">¡Tócame! 💬</span>
        </div>

        <div className="pet-speech-bubble">
          <p className="pet-quote-text">"{pet.quotes[currentQuoteIndex]}"</p>
          <span className="speech-click-sub">Haz clic sobre mí para otro consejo ✨</span>
        </div>
      </div>
    </div>
  );
}
