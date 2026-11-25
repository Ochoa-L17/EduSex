import { useState, useEffect, useCallback } from 'react';

export default function FloatingReactions({ onTrigger }) {
  const [activeItems, setActiveItems] = useState([]);

  const spawnReaction = useCallback((emoji) => {
    const newItem = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      left: Math.random() * 80 + 10,
      size: Math.random() * 16 + 22,
      duration: Math.random() * 1.5 + 2.5,
    };
    setActiveItems((prev) => [...prev, newItem]);
    if (onTrigger) onTrigger(emoji);
  }, [onTrigger]);

  // Listen to window-level reaction events
  useEffect(() => {
    const handleCustomReaction = (e) => {
      if (e.detail) {
        spawnReaction(e.detail);
      }
    };
    window.addEventListener('edusex-reaction', handleCustomReaction);
    return () => window.removeEventListener('edusex-reaction', handleCustomReaction);
  }, [spawnReaction]);

  // Clean old reactions
  useEffect(() => {
    if (activeItems.length > 0) {
      const timer = setTimeout(() => {
        setActiveItems((prev) => prev.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeItems]);

  const reactionEmojis = ['💖', '🔥', '👏', '🧠', '✨', '🌈'];

  return (
    <>
      {/* Floating particles layer */}
      <div className="floating-reactions-layer">
        {activeItems.map((item) => (
          <span
            key={item.id}
            className="floating-emoji-item"
            style={{
              left: `${item.left}%`,
              fontSize: `${item.size}px`,
              animationDuration: `${item.duration}s`,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Quick reaction floating dock */}
      <div className="reaction-dock">
        <span className="dock-label">Reacciona:</span>
        <div className="dock-buttons">
          {reactionEmojis.map((emoji) => (
            <button
              key={emoji}
              className="dock-emoji-btn"
              onClick={() => spawnReaction(emoji)}
              title={`Enviar ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
