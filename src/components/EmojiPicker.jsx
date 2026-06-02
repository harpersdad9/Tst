const PLANT_EMOJIS = [
  '🪴', '🌿', '🌱', '🌾', '🍃', '🌵', '🌸', '🌺',
  '🌻', '🌹', '🌷', '🪷', '🍀', '🌴', '🌲', '🌳',
  '🎋', '🎍', '🌊', '🍂', '🍁', '🌞', '🌝', '🌙',
  '💚', '💛', '🫧', '🪨', '🫙', '🏺', '🪣', '✂️',
];

export default function EmojiPicker({ selected, onSelect }) {
  return (
    <div className="emoji-grid p-2">
      {PLANT_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className={`emoji-btn ${selected === emoji ? 'selected' : ''}`}
          aria-label={emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
