import { MapPin, Droplets, Clock } from 'lucide-react';
import { getWaterStatus, getFertilizerStatus, getOverallStatus } from '../utils/careStatus';
import { formatDate } from '../utils/dateHelpers';

export default function PlantCard({ plant, view = 'list', onClick, onQuickLog }) {
  const waterStatus = getWaterStatus(plant);
  const fertStatus = getFertilizerStatus(plant);
  const overallStatus = getOverallStatus(plant);

  const statusColor = {
    red: 'status-dot red',
    yellow: 'status-dot yellow',
    green: 'status-dot green',
  }[overallStatus] || 'status-dot green';

  if (view === 'grid') {
    return (
      <div
        className="plant-card p-3 cursor-pointer"
        onClick={() => onClick(plant.id)}
      >
        {/* Emoji / Photo */}
        <div className="w-full aspect-square rounded-xl bg-cream-dark flex items-center justify-center text-4xl mb-3 relative overflow-hidden">
          {plant.photoUrl ? (
            <img
              src={plant.photoUrl}
              alt={plant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            plant.emoji || '🪴'
          )}
          <div className={`absolute top-2 right-2 ${statusColor}`} />
        </div>

        <p className="font-semibold text-forest text-sm truncate">{plant.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
          <MapPin size={10} />
          {plant.location || 'No location'}
        </p>

        {/* Water status */}
        <div className="mt-2 flex items-center gap-1">
          <Droplets size={12} className={
            waterStatus.status === 'overdue' || waterStatus.status === 'never-watered'
              ? 'text-red-500'
              : waterStatus.status === 'due-soon'
              ? 'text-amber-500'
              : 'text-blue-400'
          } />
          <span className={`text-[11px] font-medium ${
            waterStatus.status === 'overdue' || waterStatus.status === 'never-watered'
              ? 'text-red-600'
              : waterStatus.status === 'due-soon'
              ? 'text-amber-600'
              : 'text-gray-500'
          }`}>
            {waterStatus.status === 'never-watered' ? 'Never watered' : waterStatus.label}
          </span>
        </div>

        {/* Quick log button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickLog(plant);
          }}
          className="mt-2 w-full py-1.5 rounded-lg bg-forest/10 text-forest text-xs font-semibold active:bg-forest/20 transition-colors"
        >
          + Log Care
        </button>
      </div>
    );
  }

  // List view
  return (
    <div
      className={`plant-card p-3 cursor-pointer flex items-center gap-3 ${
        waterStatus.status === 'overdue' || waterStatus.status === 'never-watered'
          ? 'overdue-card'
          : waterStatus.status === 'due-soon'
          ? 'due-soon-card'
          : ''
      }`}
      onClick={() => onClick(plant.id)}
    >
      {/* Emoji / Photo */}
      <div className="w-12 h-12 rounded-xl bg-cream-dark flex items-center justify-center text-2xl flex-shrink-0 relative overflow-hidden">
        {plant.photoUrl ? (
          <img
            src={plant.photoUrl}
            alt={plant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          plant.emoji || '🪴'
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-forest text-sm truncate">{plant.name}</p>
          <div className={statusColor} />
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <MapPin size={10} />
          {plant.location || 'No location'}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-[11px] flex items-center gap-1 ${
            waterStatus.status === 'overdue' || waterStatus.status === 'never-watered'
              ? 'text-red-600 font-medium'
              : waterStatus.status === 'due-soon'
              ? 'text-amber-600 font-medium'
              : 'text-gray-400'
          }`}>
            <Droplets size={11} />
            {waterStatus.status === 'never-watered' ? 'Never watered' : waterStatus.label}
          </span>
          {fertStatus.status === 'overdue' && (
            <span className="text-[11px] text-green-700 font-medium flex items-center gap-0.5">
              🌿 Feed due
            </span>
          )}
        </div>
      </div>

      {/* Quick log */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onQuickLog(plant);
        }}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center active:bg-forest/20 transition-colors"
        aria-label="Quick log"
      >
        <Droplets size={16} className="text-forest" />
      </button>
    </div>
  );
}
