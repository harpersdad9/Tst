import { daysUntilDue } from './dateHelpers';
import { parseISO, isValid } from 'date-fns';

/**
 * Get water status for a plant.
 * Returns: { status: 'ok' | 'due-soon' | 'overdue' | 'never-watered', daysUntil, label }
 */
export function getWaterStatus(plant) {
  const { lastWatered, care, snoozedUntil } = plant;

  // Check if snoozed
  if (snoozedUntil) {
    const snoozeDate = parseISO(snoozedUntil);
    if (isValid(snoozeDate) && snoozeDate > new Date()) {
      return { status: 'snoozed', daysUntil: null, label: 'Snoozed' };
    }
  }

  if (!lastWatered) {
    return { status: 'never-watered', daysUntil: null, label: 'Never watered' };
  }

  const days = daysUntilDue(lastWatered, care?.waterFrequencyDays || 7);

  if (days === null) {
    return { status: 'ok', daysUntil: null, label: 'Unknown' };
  }

  if (days < 0) {
    return {
      status: 'overdue',
      daysUntil: days,
      label: `${Math.abs(days)}d overdue`,
    };
  }

  if (days === 0) {
    return { status: 'overdue', daysUntil: 0, label: 'Due today' };
  }

  if (days <= 1) {
    return { status: 'due-soon', daysUntil: days, label: 'Due tomorrow' };
  }

  return {
    status: 'ok',
    daysUntil: days,
    label: `In ${days}d`,
  };
}

/**
 * Get fertilizer status for a plant.
 */
export function getFertilizerStatus(plant) {
  const { lastFertilized, care } = plant;

  if (!lastFertilized) {
    return { status: 'never-fertilized', daysUntil: null, label: 'Never fertilized' };
  }

  const days = daysUntilDue(lastFertilized, care?.fertilizeFrequencyDays || 30);

  if (days === null) {
    return { status: 'ok', daysUntil: null, label: 'Unknown' };
  }

  if (days < 0) {
    return {
      status: 'overdue',
      daysUntil: days,
      label: `${Math.abs(days)}d overdue`,
    };
  }

  if (days === 0) {
    return { status: 'overdue', daysUntil: 0, label: 'Due today' };
  }

  if (days <= 2) {
    return { status: 'due-soon', daysUntil: days, label: `In ${days}d` };
  }

  return {
    status: 'ok',
    daysUntil: days,
    label: `In ${days}d`,
  };
}

/**
 * Get the overall status dot color for a plant.
 * 'red' = overdue water, 'yellow' = due soon, 'green' = all good
 */
export function getOverallStatus(plant) {
  const water = getWaterStatus(plant);
  if (water.status === 'overdue' || water.status === 'never-watered') return 'red';
  if (water.status === 'due-soon') return 'yellow';
  return 'green';
}

/**
 * Determine if a plant needs care today (water or fertilizer overdue or due today).
 */
export function needsCareToday(plant) {
  const water = getWaterStatus(plant);
  const fert = getFertilizerStatus(plant);

  const waterNeeded =
    water.status === 'overdue' ||
    water.status === 'never-watered' ||
    (water.daysUntil !== null && water.daysUntil <= 0);

  const fertNeeded =
    fert.status === 'overdue' ||
    (fert.daysUntil !== null && fert.daysUntil <= 0);

  return { waterNeeded, fertNeeded, needsAnyCare: waterNeeded || fertNeeded };
}

/**
 * Get all plants that need care today, sorted by urgency.
 */
export function getPlantsNeedingCare(plants) {
  return plants
    .filter((p) => {
      const { needsAnyCare } = needsCareToday(p);
      return needsAnyCare;
    })
    .sort((a, b) => {
      const statusA = getOverallStatus(a);
      const statusB = getOverallStatus(b);
      const priority = { red: 0, yellow: 1, green: 2 };
      return (priority[statusA] ?? 3) - (priority[statusB] ?? 3);
    });
}

/**
 * Count stats for dashboard.
 */
export function getDashboardStats(plants) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let wateredToday = 0;
  let overdue = 0;

  plants.forEach((p) => {
    const water = getWaterStatus(p);
    if (water.status === 'overdue' || water.status === 'never-watered') overdue++;

    // Check if watered today
    if (p.lastWatered) {
      const lw = parseISO(p.lastWatered);
      if (isValid(lw)) {
        const lwDay = new Date(lw);
        lwDay.setHours(0, 0, 0, 0);
        if (lwDay.getTime() === today.getTime()) wateredToday++;
      }
    }
  });

  return {
    total: plants.length,
    wateredToday,
    overdue,
  };
}

/**
 * Color classes by status
 */
export const STATUS_COLORS = {
  overdue: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
  },
  'due-soon': {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
  },
  ok: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
  },
  snoozed: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-500',
  },
};
