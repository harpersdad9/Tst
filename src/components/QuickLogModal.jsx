import { useState } from 'react';
import { Droplets, Leaf, StickyNote, X, Check } from 'lucide-react';

export default function QuickLogModal({ plant, onClose, onLogWater, onLogFertilizer, onLogNote }) {
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [done, setDone] = useState(null); // 'water' | 'fertilize' | 'note'

  if (!plant) return null;

  const handleWater = () => {
    onLogWater(plant.id);
    setDone('water');
    setTimeout(() => onClose(), 800);
  };

  const handleFertilize = () => {
    onLogFertilizer(plant.id);
    setDone('fertilize');
    setTimeout(() => onClose(), 800);
  };

  const handleNote = () => {
    if (!noteText.trim()) return;
    onLogNote(plant.id, noteText.trim());
    setDone('note');
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Plant header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cream-dark flex items-center justify-center text-2xl flex-shrink-0">
            {plant.emoji || '🪴'}
          </div>
          <div>
            <h2 className="text-base font-bold text-forest">{plant.name}</h2>
            <p className="text-xs text-gray-500">{plant.location}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="text-forest font-semibold text-base">
              {done === 'water' && 'Watered!'}
              {done === 'fertilize' && 'Fertilized!'}
              {done === 'note' && 'Note saved!'}
            </p>
          </div>
        ) : (
          <>
            {/* Quick action buttons */}
            {!showNoteInput && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={handleWater}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 border border-blue-100 active:bg-blue-100 transition-colors"
                >
                  <Droplets size={28} className="text-blue-500" />
                  <span className="text-sm font-semibold text-blue-700">Log Water</span>
                </button>
                <button
                  onClick={handleFertilize}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-50 border border-green-100 active:bg-green-100 transition-colors"
                >
                  <Leaf size={28} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Log Fertilizer</span>
                </button>
              </div>
            )}

            {/* Note input */}
            {showNoteInput ? (
              <div className="space-y-3">
                <textarea
                  autoFocus
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="What did you notice? (e.g., new growth, yellowing leaf...)"
                  className="input-field resize-none h-24 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNoteInput(false)}
                    className="btn-secondary flex-1 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNote}
                    disabled={!noteText.trim()}
                    className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNoteInput(true)}
                className="w-full flex items-center gap-2 p-3 rounded-xl bg-cream border border-cream-dark/50 text-sm text-gray-600 font-medium"
              >
                <StickyNote size={16} className="text-gray-400" />
                Add a note
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
