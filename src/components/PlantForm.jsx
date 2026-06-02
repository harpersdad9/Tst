import { useState, useEffect } from 'react';
import { Wand2, X, ChevronDown, Image } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import { getSmartDefaults, PLANT_DEFAULTS } from '../data/plantDefaults';

const LOCATIONS = [
  'Living Room', 'Bedroom', 'Kitchen', 'Bathroom',
  'Office', 'Balcony', 'Patio', 'Dining Room', 'Other',
];

const LIGHT_OPTIONS = [
  { value: 'low', label: 'Low Light', description: 'North-facing or far from windows' },
  { value: 'medium', label: 'Medium Light', description: 'East/west windows, indirect' },
  { value: 'bright indirect', label: 'Bright Indirect', description: 'Near south window, no direct rays' },
  { value: 'direct', label: 'Direct Sun', description: 'Full sun, 4+ hours direct light' },
];

const HUMIDITY_OPTIONS = [
  { value: 'low', label: 'Low', description: 'Dry air is fine' },
  { value: 'medium', label: 'Medium', description: 'Average household humidity' },
  { value: 'high', label: 'High', description: 'Mist regularly or use humidifier' },
];

const DEFAULT_FORM = {
  name: '',
  species: '',
  location: '',
  photoUrl: '',
  emoji: '🪴',
  notes: '',
  acquiredDate: new Date().toISOString().split('T')[0],
  care: {
    waterFrequencyDays: 7,
    fertilizeFrequencyDays: 30,
    light: 'medium',
    humidity: 'medium',
    soilType: '',
    seasonalNotes: '',
  },
};

export default function PlantForm({ plant, onSave, onCancel }) {
  const isEdit = Boolean(plant);
  const [form, setForm] = useState(() =>
    plant
      ? {
          ...DEFAULT_FORM,
          ...plant,
          care: { ...DEFAULT_FORM.care, ...plant.care },
        }
      : { ...DEFAULT_FORM }
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [smartDefaultApplied, setSmartDefaultApplied] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const setCareField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      care: { ...prev.care, [field]: value },
    }));
  };

  const handleSmartDefaults = () => {
    const query = form.species || form.name;
    const defaults = getSmartDefaults(query);
    if (defaults) {
      setForm((prev) => ({
        ...prev,
        care: { ...prev.care, ...defaults },
      }));
      setSmartDefaultApplied(true);
      setTimeout(() => setSmartDefaultApplied(false), 2500);
    } else {
      alert(`No smart defaults found for "${query}". Try a common name like "Monstera" or "Pothos".`);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Plant name is required';
    if (!form.location) errs.location = 'Please select a location';
    if (form.care.waterFrequencyDays < 1 || form.care.waterFrequencyDays > 365)
      errs.waterFrequencyDays = 'Must be between 1 and 365 days';
    if (form.care.fertilizeFrequencyDays < 1 || form.care.fertilizeFrequencyDays > 365)
      errs.fertilizeFrequencyDays = 'Must be between 1 and 365 days';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      care: {
        ...form.care,
        waterFrequencyDays: Number(form.care.waterFrequencyDays),
        fertilizeFrequencyDays: Number(form.care.fertilizeFrequencyDays),
      },
    });
  };

  return (
    <div className="main-scroll">
      <div className="px-4 pt-4 pb-4 border-b border-cream-dark/40 flex items-center gap-3 bg-cream sticky top-0 z-10">
        <button onClick={onCancel} className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200">
          <X size={18} className="text-gray-500" />
        </button>
        <h1 className="text-lg font-bold text-forest flex-1">
          {isEdit ? 'Edit Plant' : 'Add New Plant'}
        </h1>
        <button
          onClick={handleSubmit}
          className="btn-primary py-2 px-4 text-sm"
        >
          {isEdit ? 'Save' : 'Add Plant'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pb-8 space-y-5 mt-4">
        {/* Emoji + Name */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-16 h-16 rounded-2xl bg-cream-dark flex items-center justify-center text-3xl border-2 border-transparent focus:border-sage transition-colors"
            >
              {form.emoji}
            </button>
            <span className="text-[10px] text-gray-400">Tap to change</span>
          </div>

          <div className="flex-1">
            <label className="input-label">Plant Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. Monstera, My Fiddle Fig"
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="plant-card overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-forest">Pick an emoji</span>
              <button type="button" onClick={() => setShowEmojiPicker(false)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <EmojiPicker
              selected={form.emoji}
              onSelect={(e) => { setField('emoji', e); setShowEmojiPicker(false); }}
            />
          </div>
        )}

        {/* Species */}
        <div>
          <label className="input-label">Species (optional)</label>
          <input
            type="text"
            value={form.species}
            onChange={(e) => setField('species', e.target.value)}
            placeholder="e.g. Monstera deliciosa"
            className="input-field"
          />
        </div>

        {/* Smart defaults */}
        <button
          type="button"
          onClick={handleSmartDefaults}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
            smartDefaultApplied
              ? 'border-green-400 bg-green-50 text-green-700'
              : 'border-dashed border-sage text-sage bg-sage/5'
          }`}
        >
          <Wand2 size={16} />
          {smartDefaultApplied ? '✓ Smart defaults applied!' : 'Use Smart Defaults'}
        </button>
        <p className="text-[11px] text-gray-400 -mt-3 text-center">
          Auto-fills care settings based on plant name/species
        </p>

        {/* Location */}
        <div>
          <label className="input-label">Location *</label>
          <div className="relative">
            <select
              value={form.location}
              onChange={(e) => setField('location', e.target.value)}
              className={`input-field appearance-none pr-9 ${errors.location ? 'border-red-400' : ''}`}
            >
              <option value="">Select a room...</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
        </div>

        {/* Photo URL */}
        <div>
          <label className="input-label">Photo URL (optional)</label>
          <div className="relative">
            <Image size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => setField('photoUrl', e.target.value)}
              placeholder="https://..."
              className="input-field pl-9"
            />
          </div>
          {form.photoUrl && (
            <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={form.photoUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* Acquired date */}
        <div>
          <label className="input-label">Date Acquired</label>
          <input
            type="date"
            value={form.acquiredDate}
            onChange={(e) => setField('acquiredDate', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="input-label">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            placeholder="Any special notes about this plant..."
            className="input-field resize-none h-20"
          />
        </div>

        {/* Divider */}
        <div className="pt-2 pb-1">
          <h2 className="text-base font-bold text-forest">Care Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Set how often this plant needs care</p>
        </div>

        {/* Water frequency */}
        <div>
          <label className="input-label">Water Every (days) *</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="365"
              value={form.care.waterFrequencyDays}
              onChange={(e) => setCareField('waterFrequencyDays', e.target.value)}
              className={`input-field w-24 ${errors.waterFrequencyDays ? 'border-red-400' : ''}`}
            />
            <FrequencySlider
              value={form.care.waterFrequencyDays}
              onChange={(v) => setCareField('waterFrequencyDays', v)}
              min={1}
              max={30}
            />
          </div>
          {errors.waterFrequencyDays && <p className="text-xs text-red-500 mt-1">{errors.waterFrequencyDays}</p>}
          <p className="text-xs text-gray-400 mt-1">
            {form.care.waterFrequencyDays <= 3
              ? 'Very frequent — keep soil moist'
              : form.care.waterFrequencyDays <= 7
              ? 'Weekly watering'
              : form.care.waterFrequencyDays <= 14
              ? 'Every 2 weeks'
              : 'Drought tolerant'}
          </p>
        </div>

        {/* Fertilize frequency */}
        <div>
          <label className="input-label">Fertilize Every (days) *</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="365"
              value={form.care.fertilizeFrequencyDays}
              onChange={(e) => setCareField('fertilizeFrequencyDays', e.target.value)}
              className={`input-field w-24 ${errors.fertilizeFrequencyDays ? 'border-red-400' : ''}`}
            />
            <FrequencySlider
              value={form.care.fertilizeFrequencyDays}
              onChange={(v) => setCareField('fertilizeFrequencyDays', v)}
              min={7}
              max={90}
            />
          </div>
          {errors.fertilizeFrequencyDays && <p className="text-xs text-red-500 mt-1">{errors.fertilizeFrequencyDays}</p>}
        </div>

        {/* Light */}
        <div>
          <label className="input-label">Light Requirement</label>
          <div className="space-y-2">
            {LIGHT_OPTIONS.map((opt) => (
              <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                form.care.light === opt.value
                  ? 'border-forest bg-forest/5'
                  : 'border-gray-100 bg-white'
              }`}>
                <input
                  type="radio"
                  name="light"
                  value={opt.value}
                  checked={form.care.light === opt.value}
                  onChange={() => setCareField('light', opt.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  form.care.light === opt.value ? 'border-forest' : 'border-gray-300'
                }`}>
                  {form.care.light === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-forest" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-forest">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Humidity */}
        <div>
          <label className="input-label">Humidity Preference</label>
          <div className="grid grid-cols-3 gap-2">
            {HUMIDITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCareField('humidity', opt.value)}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  form.care.humidity === opt.value
                    ? 'border-forest bg-forest/5'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <p className="text-sm font-semibold text-forest">{opt.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Soil type */}
        <div>
          <label className="input-label">Soil Type</label>
          <input
            type="text"
            value={form.care.soilType}
            onChange={(e) => setCareField('soilType', e.target.value)}
            placeholder="e.g. Well-draining potting mix"
            className="input-field"
          />
        </div>

        {/* Seasonal notes */}
        <div>
          <label className="input-label">Seasonal Care Notes</label>
          <textarea
            value={form.care.seasonalNotes}
            onChange={(e) => setCareField('seasonalNotes', e.target.value)}
            placeholder="Tips for winter, summer, etc."
            className="input-field resize-none h-20"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary w-full py-3.5 mt-2">
          {isEdit ? 'Save Changes' : 'Add Plant'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary w-full py-3"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

function FrequencySlider({ value, onChange, min, max }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={Math.min(Number(value), max)}
      onChange={(e) => onChange(Number(e.target.value))}
      className="flex-1 accent-forest h-2"
    />
  );
}
