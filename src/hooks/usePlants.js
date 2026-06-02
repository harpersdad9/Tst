import { useState, useEffect, useCallback } from 'react';
import { SAMPLE_PLANTS } from '../data/samplePlants';

const STORAGE_KEY = 'plants';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load plants from storage', e);
  }
  return null;
}

function saveToStorage(plants) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  } catch (e) {
    console.error('Failed to save plants to storage', e);
  }
}

export function usePlants() {
  const [plants, setPlants] = useState(() => {
    const stored = loadFromStorage();
    if (stored) return stored;
    // First load — seed with sample data
    saveToStorage(SAMPLE_PLANTS);
    return SAMPLE_PLANTS;
  });

  // Persist on change
  useEffect(() => {
    saveToStorage(plants);
  }, [plants]);

  const addPlant = useCallback((plantData) => {
    const newPlant = {
      id: crypto.randomUUID(),
      acquiredDate: new Date().toISOString().split('T')[0],
      lastWatered: null,
      lastFertilized: null,
      snoozedUntil: null,
      emoji: '🪴',
      photoUrl: '',
      notes: '',
      ...plantData,
    };
    setPlants((prev) => [...prev, newPlant]);
    return newPlant;
  }, []);

  const updatePlant = useCallback((id, updates) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deletePlant = useCallback((id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const logWater = useCallback((id) => {
    const today = new Date().toISOString().split('T')[0];
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, lastWatered: today, snoozedUntil: null }
          : p
      )
    );
  }, []);

  const logFertilizer = useCallback((id) => {
    const today = new Date().toISOString().split('T')[0];
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, lastFertilized: today } : p
      )
    );
  }, []);

  const snoozePlant = useCallback((id) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const snoozedUntil = tomorrow.toISOString().split('T')[0];
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, snoozedUntil } : p))
    );
  }, []);

  const getPlantById = useCallback(
    (id) => plants.find((p) => p.id === id) || null,
    [plants]
  );

  return {
    plants,
    addPlant,
    updatePlant,
    deletePlant,
    logWater,
    logFertilizer,
    snoozePlant,
    getPlantById,
  };
}
