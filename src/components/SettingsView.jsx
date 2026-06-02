import { useState } from 'react';
import { Trash2, Download, Upload, RefreshCw, Info, Heart, Leaf } from 'lucide-react';
import { SAMPLE_PLANTS, SAMPLE_CARE_EVENTS } from '../data/samplePlants';

export default function SettingsView({ plants, events, onClearData, onImportData }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      plants,
      careEvents: events,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plant-care-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.plants && data.careEvents) {
          onImportData(data.plants, data.careEvents);
          alert(`Imported ${data.plants.length} plants and ${data.careEvents.length} care events.`);
        } else {
          alert('Invalid backup file format.');
        }
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToSample = () => {
    onImportData(SAMPLE_PLANTS, SAMPLE_CARE_EVENTS);
    setShowClearConfirm(false);
  };

  return (
    <div className="main-scroll">
      <div className="px-4 pt-5 pb-4">
        <h1 className="text-xl font-bold text-forest">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your plant data</p>
      </div>

      <div className="px-4 pb-8 space-y-4">
        {/* Stats card */}
        <div className="plant-card p-4">
          <p className="section-header">Your Garden</p>
          <div className="grid grid-cols-3 gap-3">
            <StatsBox value={plants.length} label="Plants" color="text-forest" />
            <StatsBox value={events.length} label="Log entries" color="text-sage" />
            <StatsBox
              value={new Set(plants.map((p) => p.location).filter(Boolean)).size}
              label="Locations"
              color="text-amber-600"
            />
          </div>
        </div>

        {/* Data section */}
        <div className="plant-card p-4">
          <p className="section-header">Data & Backup</p>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100 active:bg-green-100 transition-colors"
            >
              <Download size={18} className="text-green-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-green-700">Export Data</p>
                <p className="text-xs text-gray-500">Download a JSON backup of all plants & history</p>
              </div>
            </button>

            <label className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 active:bg-blue-100 transition-colors cursor-pointer">
              <Upload size={18} className="text-blue-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-700">Import Data</p>
                <p className="text-xs text-gray-500">Restore from a JSON backup file</p>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Reset section */}
        <div className="plant-card p-4">
          <p className="section-header">Reset</p>
          <div className="space-y-2">
            <button
              onClick={handleResetToSample}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 active:bg-amber-100 transition-colors"
            >
              <RefreshCw size={18} className="text-amber-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-700">Reset to Sample Data</p>
                <p className="text-xs text-gray-500">Restore the original 8 sample plants</p>
              </div>
            </button>

            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 active:bg-red-100 transition-colors"
              >
                <Trash2 size={18} className="text-red-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-600">Clear All Data</p>
                  <p className="text-xs text-gray-500">Delete all plants and history permanently</p>
                </div>
              </button>
            ) : (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50">
                <p className="text-sm font-semibold text-red-700 mb-1">Are you sure?</p>
                <p className="text-xs text-gray-600 mb-3">
                  This will delete all {plants.length} plants and {events.length} log entries. This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="btn-secondary flex-1 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { onClearData(); setShowClearConfirm(false); }}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold text-sm active:bg-red-600"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Care tips */}
        <div className="plant-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={15} className="text-sage" />
            <p className="section-header mb-0">How to Use</p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span>🏠</span>
              <span><strong>Dashboard</strong> — see today's care needs and overdue plants</span>
            </li>
            <li className="flex gap-2">
              <span>🌿</span>
              <span><strong>Plants</strong> — browse, search, and manage all your plants</span>
            </li>
            <li className="flex gap-2">
              <span>📋</span>
              <span><strong>Log</strong> — full care history across all plants</span>
            </li>
            <li className="flex gap-2">
              <span>💧</span>
              <span>Tap the water drop icon to quickly log watering without leaving the list</span>
            </li>
            <li className="flex gap-2">
              <span>⏰</span>
              <span>Tap the snooze icon to push a reminder back by 1 day</span>
            </li>
            <li className="flex gap-2">
              <span>✨</span>
              <span>Use <strong>Smart Defaults</strong> when adding a plant to auto-fill care settings</span>
            </li>
          </ul>
        </div>

        {/* About */}
        <div className="plant-card p-4 text-center">
          <div className="text-4xl mb-2">🪴</div>
          <p className="font-bold text-forest text-base">Plant Care</p>
          <p className="text-xs text-gray-400 mt-0.5">Version 1.0 · Made with <Heart size={10} className="inline text-red-400" /> for plant lovers</p>
          <p className="text-xs text-gray-400 mt-1">All data stored locally on this device</p>
        </div>
      </div>
    </div>
  );
}

function StatsBox({ value, label, color }) {
  return (
    <div className="text-center bg-cream rounded-2xl p-3">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
