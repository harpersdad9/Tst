import { Plus, Leaf, AlertCircle, Droplets } from 'lucide-react';
import { getDashboardStats, getPlantsNeedingCare, getOverallStatus } from '../utils/careStatus';
import ReminderBanner from './ReminderBanner';
import { format } from 'date-fns';

export default function Dashboard({
  plants,
  onAddPlant,
  onViewPlant,
  onQuickLog,
  onSnooze,
}) {
  const stats = getDashboardStats(plants);
  const plantsNeedingCare = getPlantsNeedingCare(plants);

  const today = format(new Date(), 'EEEE, MMMM d');
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="main-scroll">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 bg-forest text-white">
        <p className="text-xs font-medium text-sage-light opacity-80 mb-0.5">{today}</p>
        <h1 className="text-2xl font-bold">{greeting} 🌿</h1>
        <p className="text-sm text-sage-light mt-1 opacity-90">
          {plantsNeedingCare.length > 0
            ? `${plantsNeedingCare.length} plant${plantsNeedingCare.length === 1 ? '' : 's'} need${plantsNeedingCare.length === 1 ? 's' : ''} care`
            : 'All plants are happy today!'}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <StatCard
            icon={<Leaf size={16} />}
            value={stats.total}
            label="Total"
            color="bg-white/15"
          />
          <StatCard
            icon={<Droplets size={16} />}
            value={stats.wateredToday}
            label="Watered"
            color="bg-white/15"
          />
          <StatCard
            icon={<AlertCircle size={16} />}
            value={stats.overdue}
            label="Overdue"
            color={stats.overdue > 0 ? 'bg-red-500/30' : 'bg-white/15'}
          />
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Today's Care section */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-forest uppercase tracking-wide">
              Today's Care
            </h2>
            {plantsNeedingCare.length > 0 && (
              <span className="badge">{plantsNeedingCare.length}</span>
            )}
          </div>

          {plantsNeedingCare.length === 0 ? (
            <div className="plant-card p-5 flex flex-col items-center text-center gap-2">
              <div className="text-3xl">🎉</div>
              <p className="font-semibold text-forest text-sm">All caught up!</p>
              <p className="text-xs text-gray-500">
                No plants need water or fertilizer today.
              </p>
            </div>
          ) : (
            <ReminderBanner
              plants={plantsNeedingCare}
              onQuickLog={onQuickLog}
              onSnooze={onSnooze}
              onViewPlant={onViewPlant}
            />
          )}
        </div>

        {/* Recent activity */}
        <div className="mt-6">
          <h2 className="text-sm font-bold text-forest uppercase tracking-wide mb-3">
            All Plants
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {plants.slice(0, 6).map((plant) => (
              <MiniPlantCard
                key={plant.id}
                plant={plant}
                onClick={() => onViewPlant(plant.id)}
                onQuickLog={() => onQuickLog(plant)}
              />
            ))}
          </div>
          {plants.length > 6 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              +{plants.length - 6} more in Plants tab
            </p>
          )}
        </div>

        {/* Add plant CTA */}
        <button
          onClick={onAddPlant}
          className="btn-primary w-full mt-6 py-3.5"
        >
          <Plus size={18} />
          Add New Plant
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className={`${color} rounded-2xl p-3 flex flex-col gap-1`}>
      <div className="text-white/70">{icon}</div>
      <p className="text-xl font-bold text-white leading-none">{value}</p>
      <p className="text-[11px] text-white/70 font-medium">{label}</p>
    </div>
  );
}

function MiniPlantCard({ plant, onClick, onQuickLog }) {
  const status = getOverallStatus(plant);
  const dotClass = status === 'red' ? 'status-dot red' : status === 'yellow' ? 'status-dot yellow' : 'status-dot green';

  return (
    <div
      className="plant-card p-3 flex items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-xl w-8 h-8 rounded-lg bg-cream-dark flex items-center justify-center flex-shrink-0 overflow-hidden">
        {plant.photoUrl ? (
          <img src={plant.photoUrl} alt={plant.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          plant.emoji || '🪴'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-forest truncate">{plant.name}</p>
          <div className={dotClass} style={{ width: 7, height: 7 }} />
        </div>
        <p className="text-[10px] text-gray-400 truncate">{plant.location}</p>
      </div>
    </div>
  );
}
