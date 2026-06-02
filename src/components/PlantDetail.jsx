import { useState } from 'react';
import {
  Droplets,
  Sprout,
  Sun,
  Wind,
  Layers,
  Calendar,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  StickyNote,
  Scissors,
  RefreshCw,
  Leaf,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getWaterStatus, getFertilizerStatus } from '../utils/careStatus';
import { formatDate, formatCareDateWithTime, relativeTime } from '../utils/dateHelpers';
import { BEST_PRACTICES } from '../data/plantDefaults';
import Header from './layout/Header';

const LIGHT_ICONS = {
  low: '🌑',
  medium: '🌤',
  'bright indirect': '☀️',
  direct: '🔆',
};

const HUMIDITY_ICONS = {
  low: '🏜️',
  medium: '💧',
  high: '🌊',
};

const EVENT_ICONS = {
  water: { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Watered' },
  fertilize: { icon: Sprout, color: 'text-green-600', bg: 'bg-green-50', label: 'Fertilized' },
  repot: { icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Repotted' },
  prune: { icon: Scissors, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Pruned' },
  note: { icon: StickyNote, color: 'text-gray-500', bg: 'bg-gray-50', label: 'Note' },
};

export default function PlantDetail({
  plant,
  careEvents,
  onBack,
  onEdit,
  onDelete,
  onLogWater,
  onLogFertilizer,
  onLogNote,
  onLogRepot,
  onLogPrune,
}) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [justLogged, setJustLogged] = useState(null);

  const waterStatus = getWaterStatus(plant);
  const fertStatus = getFertilizerStatus(plant);

  const handleLogWater = () => {
    onLogWater(plant.id);
    setJustLogged('water');
    setTimeout(() => setJustLogged(null), 2000);
  };

  const handleLogFertilizer = () => {
    onLogFertilizer(plant.id);
    setJustLogged('fertilize');
    setTimeout(() => setJustLogged(null), 2000);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onLogNote(plant.id, noteText.trim());
    setNoteText('');
    setShowNoteInput(false);
  };

  const displayedEvents = showAllEvents ? careEvents : careEvents.slice(0, 5);

  const lightTip = plant.care?.light ? BEST_PRACTICES[plant.care.light]?.light : null;

  return (
    <div className="main-scroll">
      {/* Hero section */}
      <div className="relative">
        {plant.photoUrl ? (
          <div className="w-full h-56 overflow-hidden">
            <img
              src={plant.photoUrl}
              alt={plant.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-forest to-forest-light flex items-center justify-center text-7xl">
            {plant.emoji || '🪴'}
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>

        {/* Edit button */}
        <button
          onClick={() => onEdit(plant.id)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md"
        >
          <Edit2 size={16} className="text-forest" />
        </button>
      </div>

      <div className="px-4 pb-24">
        {/* Name & location */}
        <div className="mt-4 mb-4">
          <h1 className="text-2xl font-bold text-forest">{plant.name}</h1>
          {plant.species && (
            <p className="text-sm text-gray-500 italic mt-0.5">{plant.species}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin size={13} className="text-gray-400" />
            <span className="text-sm text-gray-500">{plant.location || 'No location'}</span>
            {plant.acquiredDate && (
              <>
                <span className="text-gray-300">·</span>
                <Calendar size={13} className="text-gray-400" />
                <span className="text-sm text-gray-500">Since {formatDate(plant.acquiredDate)}</span>
              </>
            )}
          </div>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <StatusCard
            title="Water"
            status={waterStatus}
            icon={<Droplets size={18} />}
            lastDate={plant.lastWatered}
            frequencyDays={plant.care?.waterFrequencyDays}
          />
          <StatusCard
            title="Fertilizer"
            status={fertStatus}
            icon={<Sprout size={18} />}
            lastDate={plant.lastFertilized}
            frequencyDays={plant.care?.fertilizeFrequencyDays}
          />
        </div>

        {/* Quick actions */}
        <div className="plant-card p-3 mb-4">
          <p className="section-header mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleLogWater}
              className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${
                justLogged === 'water'
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-blue-50 border border-blue-100 active:bg-blue-100'
              }`}
            >
              <Droplets size={18} className="text-blue-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-blue-700">
                {justLogged === 'water' ? '✓ Logged!' : 'Log Water'}
              </span>
            </button>
            <button
              onClick={handleLogFertilizer}
              className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${
                justLogged === 'fertilize'
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-green-50 border border-green-100 active:bg-green-100'
              }`}
            >
              <Sprout size={18} className="text-green-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-green-700">
                {justLogged === 'fertilize' ? '✓ Logged!' : 'Log Fertilizer'}
              </span>
            </button>
            <button
              onClick={() => { onLogRepot(plant.id); setJustLogged('repot'); setTimeout(() => setJustLogged(null), 2000); }}
              className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 active:bg-amber-100 transition-colors"
            >
              <Layers size={18} className="text-amber-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-amber-700">
                {justLogged === 'repot' ? '✓ Done!' : 'Log Repot'}
              </span>
            </button>
            <button
              onClick={() => { onLogPrune(plant.id); setJustLogged('prune'); setTimeout(() => setJustLogged(null), 2000); }}
              className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100 active:bg-purple-100 transition-colors"
            >
              <Scissors size={18} className="text-purple-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-purple-700">
                {justLogged === 'prune' ? '✓ Done!' : 'Log Prune'}
              </span>
            </button>
          </div>

          {/* Add note */}
          {showNoteInput ? (
            <div className="mt-2 space-y-2">
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note about this plant..."
                className="input-field resize-none h-20 text-sm"
              />
              <div className="flex gap-2">
                <button onClick={() => { setShowNoteInput(false); setNoteText(''); }} className="btn-secondary flex-1 py-2 text-sm">
                  Cancel
                </button>
                <button onClick={handleSaveNote} disabled={!noteText.trim()} className="btn-primary flex-1 py-2 text-sm disabled:opacity-50">
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNoteInput(true)}
              className="mt-2 w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 font-medium active:bg-gray-50 transition-colors"
            >
              <StickyNote size={15} className="text-gray-400" />
              Add a note
            </button>
          )}
        </div>

        {/* Notes */}
        {plant.notes && (
          <div className="plant-card p-4 mb-4">
            <p className="section-header">Notes</p>
            <p className="text-sm text-gray-600 leading-relaxed">{plant.notes}</p>
          </div>
        )}

        {/* Care profile */}
        <div className="plant-card p-4 mb-4">
          <p className="section-header">Care Profile</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <InfoRow
              icon={<Droplets size={14} className="text-blue-400" />}
              label="Water"
              value={`Every ${plant.care?.waterFrequencyDays || '?'} days`}
            />
            <InfoRow
              icon={<Sprout size={14} className="text-green-500" />}
              label="Fertilize"
              value={`Every ${plant.care?.fertilizeFrequencyDays || '?'} days`}
            />
            <InfoRow
              icon={<Sun size={14} className="text-amber-400" />}
              label="Light"
              value={`${LIGHT_ICONS[plant.care?.light] || '☀️'} ${plant.care?.light || 'Unknown'}`}
            />
            <InfoRow
              icon={<Wind size={14} className="text-sky-400" />}
              label="Humidity"
              value={`${HUMIDITY_ICONS[plant.care?.humidity] || '💧'} ${plant.care?.humidity || 'Unknown'}`}
            />
            {plant.care?.soilType && (
              <div className="col-span-2">
                <InfoRow
                  icon={<Layers size={14} className="text-amber-700" />}
                  label="Soil"
                  value={plant.care.soilType}
                />
              </div>
            )}
          </div>
        </div>

        {/* Best practices */}
        {(plant.care?.seasonalNotes || lightTip) && (
          <div className="plant-card p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Info size={15} className="text-sage" />
              <p className="section-header mb-0">Best Practices</p>
            </div>
            {lightTip && (
              <div className="flex gap-2 mb-2">
                <Sun size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{lightTip}</p>
              </div>
            )}
            {plant.care?.seasonalNotes && (
              <div className="flex gap-2">
                <Calendar size={14} className="text-forest flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{plant.care.seasonalNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Care history */}
        <div className="plant-card p-4 mb-4">
          <p className="section-header">Care History</p>
          {careEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-3">No events logged yet</p>
          ) : (
            <>
              {displayedEvents.map((event) => {
                const meta = EVENT_ICONS[event.type] || EVENT_ICONS.note;
                const Icon = meta.icon;
                return (
                  <div key={event.id} className="care-entry">
                    <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={14} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-forest">{meta.label}</p>
                      <p className="text-xs text-gray-400">{formatCareDateWithTime(event.date)}</p>
                      {event.note && (
                        <p className="text-xs text-gray-600 mt-0.5 italic">"{event.note}"</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {careEvents.length > 5 && (
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="w-full flex items-center justify-center gap-1 mt-2 py-2 text-xs font-medium text-sage"
                >
                  {showAllEvents ? (
                    <><ChevronUp size={14} /> Show less</>
                  ) : (
                    <><ChevronDown size={14} /> Show {careEvents.length - 5} more</>
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {/* Delete */}
        {showDeleteConfirm ? (
          <div className="plant-card p-4 border border-red-200">
            <p className="text-sm font-semibold text-red-700 mb-3">Delete {plant.name}?</p>
            <p className="text-xs text-gray-500 mb-4">This will remove the plant and all its care history. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button
                onClick={() => onDelete(plant.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm active:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 font-medium"
          >
            <Trash2 size={15} />
            Delete plant
          </button>
        )}
      </div>
    </div>
  );
}

function StatusCard({ title, status, icon, lastDate, frequencyDays }) {
  const colorMap = {
    overdue: 'bg-red-50 border-red-200',
    'never-watered': 'bg-red-50 border-red-200',
    'never-fertilized': 'bg-gray-50 border-gray-100',
    'due-soon': 'bg-amber-50 border-amber-200',
    ok: 'bg-green-50 border-green-200',
    snoozed: 'bg-gray-50 border-gray-100',
  };
  const textMap = {
    overdue: 'text-red-700',
    'never-watered': 'text-red-600',
    'never-fertilized': 'text-gray-500',
    'due-soon': 'text-amber-700',
    ok: 'text-green-700',
    snoozed: 'text-gray-500',
  };

  const cardClass = colorMap[status.status] || colorMap.ok;
  const textClass = textMap[status.status] || textMap.ok;

  return (
    <div className={`rounded-2xl border p-3 ${cardClass}`}>
      <div className={`flex items-center gap-1.5 mb-1 ${textClass}`}>
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{title}</span>
      </div>
      <p className={`text-base font-bold ${textClass}`}>{status.label}</p>
      {lastDate ? (
        <p className="text-[11px] text-gray-500 mt-0.5">
          Last: {relativeTime(lastDate)}
        </p>
      ) : (
        <p className="text-[11px] text-gray-400 mt-0.5">Never logged</p>
      )}
      {frequencyDays && (
        <p className="text-[11px] text-gray-400">Every {frequencyDays}d</p>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-forest capitalize">{value}</p>
      </div>
    </div>
  );
}
