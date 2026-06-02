import { useState, useEffect, useCallback } from 'react';
import { SAMPLE_CARE_EVENTS } from '../data/samplePlants';

const STORAGE_KEY = 'careEvents';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load care events from storage', e);
  }
  return null;
}

function saveToStorage(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save care events to storage', e);
  }
}

export function useCareLog() {
  const [events, setEvents] = useState(() => {
    const stored = loadFromStorage();
    if (stored) return stored;
    saveToStorage(SAMPLE_CARE_EVENTS);
    return SAMPLE_CARE_EVENTS;
  });

  useEffect(() => {
    saveToStorage(events);
  }, [events]);

  const addEvent = useCallback((eventData) => {
    const newEvent = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      note: '',
      ...eventData,
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const getEventsForPlant = useCallback(
    (plantId) =>
      events
        .filter((e) => e.plantId === plantId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [events]
  );

  const logWaterEvent = useCallback(
    (plantId, note = '') => {
      return addEvent({ plantId, type: 'water', note });
    },
    [addEvent]
  );

  const logFertilizerEvent = useCallback(
    (plantId, note = '') => {
      return addEvent({ plantId, type: 'fertilize', note });
    },
    [addEvent]
  );

  const logNoteEvent = useCallback(
    (plantId, note) => {
      return addEvent({ plantId, type: 'note', note });
    },
    [addEvent]
  );

  const logRepotEvent = useCallback(
    (plantId, note = '') => {
      return addEvent({ plantId, type: 'repot', note });
    },
    [addEvent]
  );

  const logPruneEvent = useCallback(
    (plantId, note = '') => {
      return addEvent({ plantId, type: 'prune', note });
    },
    [addEvent]
  );

  return {
    events,
    addEvent,
    deleteEvent,
    updateEvent,
    getEventsForPlant,
    logWaterEvent,
    logFertilizerEvent,
    logNoteEvent,
    logRepotEvent,
    logPruneEvent,
  };
}
