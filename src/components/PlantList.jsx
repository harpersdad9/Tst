import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
} from 'lucide-react';
import PlantCard from './PlantCard';
import { getWaterStatus, getOverallStatus } from '../utils/careStatus';
import { daysUntilDue } from '../utils/dateHelpers';

const LOCATIONS = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Other'];
const LIGHT_OPTIONS = ['All', 'low', 'medium', 'bright indirect', 'direct'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'lastWatered', label: 'Last Watered' },
  { value: 'nextDue', label: 'Next Due' },
  { value: 'overdue', label: 'Overdue First' },
];

export default function PlantList({ plants, onViewPlant, onAddPlant, onQuickLog }) {
  const [view, setView] = useState('list'); // 'list' | 'grid'
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterLight, setFilterLight] = useState('All');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...plants];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.species?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    // Location filter
    if (filterLocation !== 'All') {
      result = result.filter((p) => p.location === filterLocation);
    }

    // Light filter
    if (filterLight !== 'All') {
      result = result.filter((p) => p.care?.light === filterLight);
    }

    // Overdue filter
    if (filterOverdue) {
      result = result.filter((p) => {
        const ws = getWaterStatus(p);
        return ws.status === 'overdue' || ws.status === 'never-watered';
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'lastWatered': {
          const da = a.lastWatered ? new Date(a.lastWatered) : new Date(0);
          const db = b.lastWatered ? new Date(b.lastWatered) : new Date(0);
          return da - db; // oldest first
        }
        case 'nextDue': {
          const daysA = daysUntilDue(a.lastWatered, a.care?.waterFrequencyDays) ?? 999;
          const daysB = daysUntilDue(b.lastWatered, b.care?.waterFrequencyDays) ?? 999;
          return daysA - daysB;
        }
        case 'overdue': {
          const statusPriority = { red: 0, yellow: 1, green: 2 };
          const sA = statusPriority[getOverallStatus(a)] ?? 3;
          const sB = statusPriority[getOverallStatus(b)] ?? 3;
          return sA - sB;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [plants, search, filterLocation, filterLight, filterOverdue, sortBy]);

  const activeFilterCount = [
    filterLocation !== 'All',
    filterLight !== 'All',
    filterOverdue,
  ].filter(Boolean).length;

  // Get unique locations from actual plants
  const plantLocations = useMemo(() => {
    const locs = new Set(plants.map((p) => p.location).filter(Boolean));
    return ['All', ...Array.from(locs).sort()];
  }, [plants]);

  return (
    <div className="main-scroll">
      {/* Search + controls */}
      <div className="px-4 pt-4 pb-2 space-y-3 bg-cream sticky top-0 z-20 border-b border-cream-dark/30">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search plants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              activeFilterCount > 0
                ? 'bg-forest text-white border-forest'
                : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 bg-white text-forest rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-3 pr-7 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 appearance-none focus:outline-none focus:border-sage"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="segment-control flex-shrink-0">
            <button
              onClick={() => setView('list')}
              className={`segment-btn px-3 ${view === 'list' ? 'active' : ''}`}
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`segment-btn px-3 ${view === 'grid' ? 'active' : ''}`}
            >
              <Grid size={15} />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm space-y-3">
            {/* Location */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Location</p>
              <div className="flex flex-wrap gap-1.5">
                {plantLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFilterLocation(loc)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filterLocation === loc
                        ? 'bg-forest text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Light */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Light</p>
              <div className="flex flex-wrap gap-1.5">
                {LIGHT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilterLight(opt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                      filterLight === opt
                        ? 'bg-forest text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Overdue toggle */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-600">Show overdue only</p>
              <button
                onClick={() => setFilterOverdue(!filterOverdue)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  filterOverdue ? 'bg-forest' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                    filterOverdue ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilterLocation('All');
                  setFilterLight('All');
                  setFilterOverdue(false);
                }}
                className="text-xs text-red-500 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Plant count */}
      <div className="px-4 py-2">
        <p className="text-xs text-gray-400">
          {filtered.length} {filtered.length === 1 ? 'plant' : 'plants'}
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Plant grid/list */}
      <div className="px-4 pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌱</div>
            <p className="font-semibold text-forest">No plants found</p>
            <p className="text-sm text-gray-500 mt-1">
              {search ? 'Try a different search term' : 'Add your first plant to get started'}
            </p>
            {!search && (
              <button onClick={onAddPlant} className="btn-primary mt-4">
                <Plus size={16} />
                Add Plant
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                view="grid"
                onClick={onViewPlant}
                onQuickLog={onQuickLog}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                view="list"
                onClick={onViewPlant}
                onQuickLog={onQuickLog}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onAddPlant}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-forest text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        aria-label="Add plant"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
