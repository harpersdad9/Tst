import { useState, useMemo } from 'react';
import {
  Droplets,
  Sprout,
  Layers,
  Scissors,
  StickyNote,
  ChevronDown,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { formatCareDateWithTime, formatCareDate, sortEventsByDate } from '../utils/dateHelpers';

const EVENT_META = {
  water: {
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    label: 'Watered',
    emoji: '💧',
  },
  fertilize: {
    icon: Sprout,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    label: 'Fertilized',
    emoji: '🌿',
  },
  repot: {
    icon: Layers,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    label: 'Repotted',
    emoji: '🪴',
  },
  prune: {
    icon: Scissors,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    label: 'Pruned',
    emoji: '✂️',
  },
  note: {
    icon: StickyNote,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    label: 'Note',
    emoji: '📝',
  },
};

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'water', label: '💧 Water' },
  { value: 'fertilize', label: '🌿 Fertilize' },
  { value: 'repot', label: '🪴 Repot' },
  { value: 'prune', label: '✂️ Prune' },
  { value: 'note', label: '📝 Notes' },
];

export default function CareLogView({ events, plants, onAddNote }) {
  const [filterType, setFilterType] = useState('all');
  const [filterPlantId, setFilterPlantId] = useState('all');
  const [search, setSearch] = useState('');

  const plantMap = useMemo(() => {
    const map = {};
    plants.forEach((p) => { map[p.id] = p; });
    return map;
  }, [plants]);

  const filtered = useMemo(() => {
    let result = sortEventsByDate(events);

    if (filterType !== 'all') {
      result = result.filter((e) => e.type === filterType);
    }

    if (filterPlantId !== 'all') {
      result = result.filter((e) => e.plantId === filterPlantId);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => {
        const plant = plantMap[e.plantId];
        return (
          plant?.name?.toLowerCase().includes(q) ||
          e.note?.toLowerCase().includes(q) ||
          EVENT_META[e.type]?.label.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [events, filterType, filterPlantId, search, plantMap]);

  // Group by date
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((event) => {
      const dateKey = formatCareDate(event.date);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });
    return Object.entries(groups);
  }, [filtered]);

  return (
    <div className="main-scroll">
      <div className="px-4 pt-4 pb-2 bg-cream sticky top-0 z-20 border-b border-cream-dark/30 space-y-2">
        <h1 className="text-xl font-bold text-forest">Care Log</h1>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search log..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm py-2.5"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filterType === f.value
                  ? 'bg-forest text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Plant filter */}
        <div className="relative">
          <select
            value={filterPlantId}
            onChange={(e) => setFilterPlantId(e.target.value)}
            className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 appearance-none focus:outline-none focus:border-sage"
          >
            <option value="all">All Plants</option>
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.name}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Count */}
        <p className="text-xs text-gray-400 py-2">{filtered.length} events</p>

        {grouped.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold text-forest">No events found</p>
            <p className="text-sm text-gray-500 mt-1">Start logging care to see history here</p>
          </div>
        ) : (
          grouped.map(([dateLabel, dateEvents]) => (
            <div key={dateLabel} className="mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{dateLabel}</p>
              <div className="space-y-2">
                {dateEvents.map((event) => {
                  const plant = plantMap[event.plantId];
                  const meta = EVENT_META[event.type] || EVENT_META.note;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={event.id}
                      className={`plant-card p-3 flex items-start gap-3 border ${meta.border}`}
                    >
                      {/* Plant emoji */}
                      <div className="w-9 h-9 rounded-xl bg-cream-dark flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {plant?.photoUrl ? (
                          <img src={plant.photoUrl} alt={plant.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          plant?.emoji || '🪴'
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={11} className={meta.color} />
                          </div>
                          <p className="text-sm font-semibold text-forest truncate">
                            {plant?.name || 'Unknown plant'}
                          </p>
                          <span className={`chip ${meta.bg} ${meta.color} ml-auto flex-shrink-0`}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatCareDateWithTime(event.date)}
                        </p>
                        {event.note && (
                          <p className="text-xs text-gray-600 mt-1 italic bg-gray-50 rounded-lg px-2 py-1">
                            "{event.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
