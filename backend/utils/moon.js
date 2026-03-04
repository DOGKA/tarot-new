/**
 * Moon Astro — Astronomy Calculator
 * Phase detection (10 phases), zodiac calculation, planet of day,
 * transition times, and slot builder.
 */

const { Moon } = require("lunarphase-js");

// Synodic month in days
const SYNODIC = 29.53058770576;

// Phase boundaries in lunar age (days) — 10 phases
const PHASE_BOUNDARIES = [
  { max: 1.84566, key: "new_moon" },
  { max: 5.53699, key: "waxing_crescent" },
  { max: 9.22831, key: "first_quarter" },
  { max: 12.91963, key: "waxing_gibbous" },
  { max: 16.61096, key: "full_moon" },
  { max: 18.45662, key: "disseminating_moon" },
  { max: 20.30228, key: "waning_gibbous" },
  { max: 23.99360, key: "last_quarter" },
  { max: 27.68493, key: "waning_crescent" },
  { max: SYNODIC, key: "balsamic_moon" },
];

// Zodiac signs in ecliptic order (each 30 degrees)
const ZODIAC_KEYS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

// Planet of day: Sunday=0 ... Saturday=6 (UTC day of week)
const DAY_PLANETS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

/**
 * Get moon's ecliptic longitude (degrees 0-360) for a given date.
 * J2000.0 epoch based, with anomaly correction.
 */
function getMoonLongitude(date) {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const d = (date.getTime() - J2000) / 86400000;

  // Mean longitude
  let L = (218.3165 + 13.17639648 * d) % 360;
  if (L < 0) L += 360;

  // Mean anomaly of Moon
  const M = ((134.9634 + 13.06499295 * d) % 360) * (Math.PI / 180);

  // Mean anomaly of Sun
  const Ms = ((357.5291 + 0.98560028 * d) % 360) * (Math.PI / 180);

  // Corrections
  L += 6.29 * Math.sin(M);
  L -= 1.27 * Math.sin(M - 2 * Ms);
  L += 0.66 * Math.sin(2 * Ms);
  L += 0.21 * Math.sin(2 * M);
  L -= 0.19 * Math.sin(Ms);
  L -= 0.11 * Math.sin(2 * M * (Math.PI / 180)); // small correction

  L = ((L % 360) + 360) % 360;
  return L;
}

/**
 * Get the 10-phase key from lunar age.
 */
function getMoonPhase(date) {
  const age = Moon.lunarAge(date);
  for (const b of PHASE_BOUNDARIES) {
    if (age < b.max) return b.key;
  }
  return "new_moon";
}

/**
 * Find the next phase transition time after `date`.
 * Binary search with ~1 minute precision.
 */
function getPhaseTransitionTime(date) {
  const currentPhase = getMoonPhase(date);
  let lo = date.getTime();
  let hi = lo + 30 * 24 * 3600000; // max 30 days ahead

  // First, find a point where phase differs (coarse scan: 1-hour steps)
  let scanTime = lo;
  while (scanTime < hi) {
    scanTime += 3600000;
    if (getMoonPhase(new Date(scanTime)) !== currentPhase) {
      hi = scanTime;
      lo = scanTime - 3600000;
      break;
    }
  }

  // Binary search to ~1 minute
  while (hi - lo > 60000) {
    const mid = Math.floor((lo + hi) / 2);
    if (getMoonPhase(new Date(mid)) === currentPhase) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const nextPhase = getMoonPhase(new Date(hi));
  return { time: new Date(hi), from: currentPhase, to: nextPhase };
}

/**
 * Get zodiac sign from ecliptic longitude.
 */
function getMoonZodiac(date) {
  const lng = getMoonLongitude(date);
  const idx = Math.floor(lng / 30) % 12;
  return ZODIAC_KEYS[idx];
}

/**
 * Find the next zodiac transition time after `date`.
 * Binary search with ~1 minute precision.
 */
function getZodiacTransitionTime(date) {
  const currentZodiac = getMoonZodiac(date);
  let lo = date.getTime();
  let hi = lo + 4 * 24 * 3600000; // max ~4 days (moon takes ~2.3 days per sign)

  let scanTime = lo;
  while (scanTime < hi) {
    scanTime += 1800000; // 30-minute steps
    if (getMoonZodiac(new Date(scanTime)) !== currentZodiac) {
      hi = scanTime;
      lo = scanTime - 1800000;
      break;
    }
  }

  while (hi - lo > 60000) {
    const mid = Math.floor((lo + hi) / 2);
    if (getMoonZodiac(new Date(mid)) === currentZodiac) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const nextZodiac = getMoonZodiac(new Date(hi));
  return { time: new Date(hi), from: currentZodiac, to: nextZodiac };
}

/**
 * Get planet of day for a given UTC date.
 */
function getPlanetOfDay(date) {
  return DAY_PLANETS[date.getUTCDay()];
}

/**
 * Get all transitions within `hours` from `startDate`, sorted chronologically.
 */
function getTransitions(startDate, hours = 72) {
  const endMs = startDate.getTime() + hours * 3600000;
  const transitions = [];

  // Zodiac transitions
  let cursor = new Date(startDate);
  while (cursor.getTime() < endMs) {
    const t = getZodiacTransitionTime(cursor);
    if (t.time.getTime() >= endMs) break;
    transitions.push({ time: t.time.toISOString(), type: "zodiac", from: t.from, to: t.to });
    cursor = new Date(t.time.getTime() + 60000);
  }

  // Phase transitions
  cursor = new Date(startDate);
  while (cursor.getTime() < endMs) {
    const t = getPhaseTransitionTime(cursor);
    if (t.time.getTime() >= endMs) break;
    transitions.push({ time: t.time.toISOString(), type: "phase", from: t.from, to: t.to });
    cursor = new Date(t.time.getTime() + 60000);
  }

  // Planet transitions (every midnight UTC)
  const startDay = new Date(Date.UTC(
    startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()
  ));
  for (let d = 0; d <= Math.ceil(hours / 24); d++) {
    const midnight = new Date(startDay.getTime() + (d + 1) * 86400000);
    if (midnight.getTime() > endMs) break;
    if (midnight.getTime() <= startDate.getTime()) continue;

    const fromPlanet = getPlanetOfDay(new Date(midnight.getTime() - 1));
    const toPlanet = getPlanetOfDay(midnight);
    if (fromPlanet !== toPlanet) {
      transitions.push({ time: midnight.toISOString(), type: "planet", from: fromPlanet, to: toPlanet });
    }
  }

  transitions.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return transitions;
}

/**
 * Build slot list from transitions.
 * Each slot = a time slice where phase + zodiac + planet stay constant.
 */
function buildSlots(transitions, startDate, endDate) {
  const slots = [];
  let cursor = new Date(startDate);
  let currentPhase = getMoonPhase(cursor);
  let currentZodiac = getMoonZodiac(cursor);
  let currentPlanet = getPlanetOfDay(cursor);

  const allPoints = [
    ...transitions.map(t => new Date(t.time)),
    endDate
  ];

  for (const point of allPoints) {
    if (point.getTime() <= cursor.getTime()) continue;

    const slotStart = cursor.toISOString();
    const slotEnd = point.toISOString();
    const id = `${slotStart.replace(/[:.]/g, "").slice(0, 17)}Z_${currentPhase}_${currentZodiac}_${currentPlanet}`;

    slots.push({
      id,
      start: slotStart,
      end: slotEnd,
      phase: currentPhase,
      zodiac: currentZodiac,
      planet: currentPlanet,
      content: null
    });

    // Update state based on what changed at this transition point
    const transAtPoint = transitions.filter(t => t.time === point.toISOString());
    for (const tr of transAtPoint) {
      if (tr.type === "phase") currentPhase = tr.to;
      if (tr.type === "zodiac") currentZodiac = tr.to;
      if (tr.type === "planet") currentPlanet = tr.to;
    }

    cursor = point;
  }

  return slots;
}

module.exports = {
  getMoonPhase,
  getPhaseTransitionTime,
  getMoonZodiac,
  getZodiacTransitionTime,
  getMoonLongitude,
  getPlanetOfDay,
  getTransitions,
  buildSlots
};
