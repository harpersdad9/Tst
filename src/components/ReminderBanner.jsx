import { Droplets, Sprout, Bell, ChevronRight, AlarmClock } from 'lucide-react';
import { getWaterStatus, getFertilizerStatus } from '../utils/careStatus';

function ReminderItem({ plant, onQuickLog, onSnooze, onViewPlant }) {
  const waterStatus = getWaterStatus(plant);
  const fertStatus = getFertilizerStatus(plant);

  const showWater = waterStatus.status === 'overdue' || waterStatus.status === 'never-watered' || (waterStatus.daysUntil !== null && waterStatus.daysUntil <= 0);
  const showFert = fertStatus.status === 'overdue' || (fertStatus.daysUntil !== null && fertStatus.daysUntil <= 0);

  const isOverdue = waterStatus.status === 'overdue' || waterStatus.status === 'never-watered';

  return (
    <div
      className={`plant-card p-3 mb-2 ${isOverdue ? 'overdue-card' : 'due-soon-card'}`}
    >
      <div className="flex items-center gap-3">
        {/* Emoji */}
        <button
          onClick={() => onViewPlant(plant.id)}
          className="w-10 h-10 rounded-xl bg-cream-dark flex items-center justify-center text-xl flex-shrink-0"
        >
          {plant.emoji || '🪴'}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0" onClick={() => onViewPlant(plant.id)}>
          <p className="font-semibold text-forest text-sm truncate">{plant.name}</p>
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {showWater && (
              <span className={`chip ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                <Droplets size={11} />
                {waterStatus.label}
              </span>
            )}
            {showFert && (
              <span className="chip bg-green-100 text-green-700">
                <Sprout size={11} />
                Feed {fertStatus.label}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onSnooze(plant.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 active:bg-gray-200 transition-colors"
            title="Snooze 1 day"
          >
            <AlarmClock size={14} className="text-gray-500" />
          </button>
          <button
            onClick={() => onQuickLog(plant)}
            className="h-8 px-3 rounded-lg flex items-center gap-1 bg-forest text-white text-xs font-semibold active:bg-forest-dark transition-colors"
          >
            <Droplets size={12} />
            Log
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReminderBanner({ plants, onQuickLog, onSnooze, onViewPlant }) {
  if (!plants || plants.length === 0) return null;

  return (
    <div>
      {plants.map((plant) => (
        <ReminderItem
          key={plant.id}
          plant={plant}
          onQuickLog={onQuickLog}
          onSnooze={onSnooze}
          onViewPlant={onViewPlant}
        />
      ))}
    </div>
  );
}
