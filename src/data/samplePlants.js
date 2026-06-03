import { subDays, formatISO } from 'date-fns';

const today = new Date();
const d = (days) => formatISO(subDays(today, days), { representation: 'date' });

export const SAMPLE_PLANTS = [
  {
    id: 'plant-001',
    name: 'Monstera',
    species: 'Monstera deliciosa',
    location: 'Living Room',
    photoUrl: '',
    emoji: '🌿',
    notes: 'Growing a new leaf! Bought from the farmers market.',
    acquiredDate: d(180),
    care: {
      waterFrequencyDays: 7,
      fertilizeFrequencyDays: 14,
      light: 'bright indirect',
      humidity: 'high',
      soilType: 'Well-draining potting mix',
      seasonalNotes: 'Reduce watering in winter. Wipe leaves monthly. Support with moss pole.',
    },
    lastWatered: d(10),        // overdue by 3 days
    lastFertilized: d(20),     // overdue fertilizer
    snoozedUntil: null,
  },
  {
    id: 'plant-002',
    name: 'Golden Pothos',
    species: 'Epipremnum aureum',
    location: 'Bedroom',
    photoUrl: '',
    emoji: '🪴',
    notes: 'Hanging basket by the window. Getting long vines.',
    acquiredDate: d(365),
    care: {
      waterFrequencyDays: 7,
      fertilizeFrequencyDays: 30,
      light: 'low',
      humidity: 'low',
      soilType: 'Standard potting mix',
      seasonalNotes: 'Very forgiving. Trim leggy vines to encourage bushiness.',
    },
    lastWatered: d(3),         // watered recently — good
    lastFertilized: d(28),     // due very soon
    snoozedUntil: null,
  },
  {
    id: 'plant-003',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    location: 'Office',
    photoUrl: '',
    emoji: '🌱',
    notes: 'Very low maintenance. Corner of the desk.',
    acquiredDate: d(500),
    care: {
      waterFrequencyDays: 14,
      fertilizeFrequencyDays: 60,
      light: 'low',
      humidity: 'low',
      soilType: 'Cactus/succulent mix',
      seasonalNotes: 'Almost no water in winter. Highly drought tolerant.',
    },
    lastWatered: d(18),        // overdue by 4 days
    lastFertilized: d(65),     // overdue fertilizer
    snoozedUntil: null,
  },
  {
    id: 'plant-004',
    name: 'Orchid',
    species: 'Phalaenopsis sp.',
    location: 'Kitchen',
    photoUrl: '',
    emoji: '🌸',
    notes: 'Pink blooms. Got as a gift. Currently reblooming.',
    acquiredDate: d(90),
    care: {
      waterFrequencyDays: 7,
      fertilizeFrequencyDays: 14,
      light: 'bright indirect',
      humidity: 'high',
      soilType: 'Orchid bark',
      seasonalNotes: 'Water by soaking bark, then drain. Feed weakly weekly. Rebloom with cooler nights.',
    },
    lastWatered: d(6),         // due today
    lastFertilized: d(14),     // due today
    snoozedUntil: null,
  },
  {
    id: 'plant-005',
    name: 'Boston Fern',
    species: 'Nephrolepis exaltata',
    location: 'Bathroom',
    photoUrl: '',
    emoji: '🌾',
    notes: 'Loves the humidity from the shower. Hanging near the window.',
    acquiredDate: d(60),
    care: {
      waterFrequencyDays: 3,
      fertilizeFrequencyDays: 30,
      light: 'medium',
      humidity: 'high',
      soilType: 'Rich, moisture-retaining mix',
      seasonalNotes: 'Keep consistently moist. Mist daily or use humidifier. Cut back brown fronds.',
    },
    lastWatered: d(5),         // overdue by 2 days
    lastFertilized: d(15),     // good
    snoozedUntil: null,
  },
  {
    id: 'plant-006',
    name: 'Aloe Vera',
    species: 'Aloe barbadensis miller',
    location: 'Kitchen',
    photoUrl: '',
    emoji: '🌵',
    notes: 'On the windowsill. Great for sunburns!',
    acquiredDate: d(720),
    care: {
      waterFrequencyDays: 14,
      fertilizeFrequencyDays: 60,
      light: 'direct',
      humidity: 'low',
      soilType: 'Cactus/succulent mix',
      seasonalNotes: 'Allow soil to dry completely. Too much water is the #1 killer.',
    },
    lastWatered: d(5),         // good — lots of days left
    lastFertilized: d(45),     // good
    snoozedUntil: null,
  },
  {
    id: 'plant-007',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    location: 'Living Room',
    photoUrl: '',
    emoji: '🍃',
    notes: 'By the south window. Very dramatic when unhappy.',
    acquiredDate: d(240),
    care: {
      waterFrequencyDays: 7,
      fertilizeFrequencyDays: 14,
      light: 'bright indirect',
      humidity: 'medium',
      soilType: 'Well-draining potting mix',
      seasonalNotes: 'Hates being moved. Wipe leaves. Reduce water in winter.',
    },
    lastWatered: d(8),         // overdue by 1 day
    lastFertilized: d(12),     // due in 2 days
    snoozedUntil: null,
  },
  {
    id: 'plant-008',
    name: 'Calathea',
    species: 'Calathea orbifolia',
    location: 'Bedroom',
    photoUrl: '',
    emoji: '🌿',
    notes: 'Beautiful round leaves with stripes. Uses filtered water.',
    acquiredDate: d(120),
    care: {
      waterFrequencyDays: 5,
      fertilizeFrequencyDays: 30,
      light: 'low',
      humidity: 'high',
      soilType: 'Rich, moisture-retaining mix',
      seasonalNotes: 'Use distilled/filtered water. Loves humidity — try a pebble tray. Leaves fold at night.',
    },
    lastWatered: d(2),         // watered 2 days ago, due in 3 days
    lastFertilized: d(30),     // due today
    snoozedUntil: null,
  },
];

export const SAMPLE_CARE_EVENTS = [
  // Monstera events
  {
    id: 'evt-001',
    plantId: 'plant-001',
    type: 'water',
    date: new Date(subDays(today, 10)).toISOString(),
    note: '',
  },
  {
    id: 'evt-002',
    plantId: 'plant-001',
    type: 'water',
    date: new Date(subDays(today, 17)).toISOString(),
    note: 'Soil was quite dry',
  },
  {
    id: 'evt-003',
    plantId: 'plant-001',
    type: 'fertilize',
    date: new Date(subDays(today, 20)).toISOString(),
    note: 'Used balanced liquid fertilizer',
  },
  // Pothos events
  {
    id: 'evt-004',
    plantId: 'plant-002',
    type: 'water',
    date: new Date(subDays(today, 3)).toISOString(),
    note: '',
  },
  {
    id: 'evt-005',
    plantId: 'plant-002',
    type: 'water',
    date: new Date(subDays(today, 10)).toISOString(),
    note: '',
  },
  {
    id: 'evt-006',
    plantId: 'plant-002',
    type: 'note',
    date: new Date(subDays(today, 5)).toISOString(),
    note: 'Found a new vine growing from the soil! Might repot soon.',
  },
  // Snake plant events
  {
    id: 'evt-007',
    plantId: 'plant-003',
    type: 'water',
    date: new Date(subDays(today, 18)).toISOString(),
    note: '',
  },
  // Orchid events
  {
    id: 'evt-008',
    plantId: 'plant-004',
    type: 'water',
    date: new Date(subDays(today, 6)).toISOString(),
    note: 'Soaked the bark for 10 minutes',
  },
  {
    id: 'evt-009',
    plantId: 'plant-004',
    type: 'fertilize',
    date: new Date(subDays(today, 14)).toISOString(),
    note: 'Quarter-strength orchid fertilizer',
  },
  // Fern events
  {
    id: 'evt-010',
    plantId: 'plant-005',
    type: 'water',
    date: new Date(subDays(today, 5)).toISOString(),
    note: '',
  },
  {
    id: 'evt-011',
    plantId: 'plant-005',
    type: 'repot',
    date: new Date(subDays(today, 30)).toISOString(),
    note: 'Moved to a 10-inch pot with fresh soil',
  },
  // Aloe events
  {
    id: 'evt-012',
    plantId: 'plant-006',
    type: 'water',
    date: new Date(subDays(today, 5)).toISOString(),
    note: '',
  },
  // Fiddle leaf events
  {
    id: 'evt-013',
    plantId: 'plant-007',
    type: 'water',
    date: new Date(subDays(today, 8)).toISOString(),
    note: '',
  },
  {
    id: 'evt-014',
    plantId: 'plant-007',
    type: 'prune',
    date: new Date(subDays(today, 45)).toISOString(),
    note: 'Removed two damaged lower leaves',
  },
  // Calathea events
  {
    id: 'evt-015',
    plantId: 'plant-008',
    type: 'water',
    date: new Date(subDays(today, 2)).toISOString(),
    note: 'Used filtered water',
  },
  {
    id: 'evt-016',
    plantId: 'plant-008',
    type: 'fertilize',
    date: new Date(subDays(today, 30)).toISOString(),
    note: '',
  },
];
