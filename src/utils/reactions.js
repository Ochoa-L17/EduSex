export const emitReaction = (emoji) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('edusex-reaction', { detail: emoji }));
  }
};
