/**
 * Moon Astro — Frontend Utilities
 * Lightweight: slot matching + suncalc wrappers for location-based data.
 */

import SunCalc from "suncalc";

// ============================================
// Types
// ============================================

export interface MoonSlot {
  id: string;
  start: string;
  end: string;
  phase: { key: string; name: string; emoji: string };
  zodiac: { key: string; name: string; symbol: string; element: string };
  planet: { key: string; name: string; symbol: string; day: string };
  content: {
    planet: { meaning: string; advice: string };
    zodiac: { meaning: string; firsat: string; his: string };
    phase: {
      sentence: string;
      general: string;
      ayna: string;
    };
  } | null;
}

export interface MoonApiResponse {
  currentSlot: MoonSlot;
  nextTransition: {
    time: string;
    type: "zodiac" | "phase" | "planet";
    to: string;
  } | null;
  allSlots: MoonSlot[];
  currentIndex: number;
}

export interface MoonLocationData {
  rise: Date | null;
  set: Date | null;
  altitude: number;
  azimuth: number;
  illumination: number;
}

// ============================================
// Slot Matching
// ============================================

export function findCurrentSlot(
  slots: MoonSlot[],
  utcNow: Date
): MoonSlot | null {
  const nowMs = utcNow.getTime();
  return (
    slots.find(
      (s) =>
        new Date(s.start).getTime() <= nowMs &&
        new Date(s.end).getTime() > nowMs
    ) || null
  );
}

// ============================================
// Location-Based Data (suncalc)
// ============================================

export function getMoonLocationData(
  date: Date,
  lat: number,
  lng: number
): MoonLocationData {
  const times = SunCalc.getMoonTimes(date, lat, lng);
  const position = SunCalc.getMoonPosition(date, lat, lng);
  const illumination = SunCalc.getMoonIllumination(date);

  return {
    rise: times.rise || null,
    set: times.set || null,
    altitude: (position.altitude * 180) / Math.PI,
    azimuth: (position.azimuth * 180) / Math.PI,
    illumination: illumination.fraction,
  };
}

export function getMoonIllumination(date: Date): number {
  return SunCalc.getMoonIllumination(date).fraction;
}

// ============================================
// Time Formatting Helpers
// ============================================

export function formatMoonTime(date: Date | null): string {
  if (!date) return "--:--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getTimeUntilTransition(transitionTime: string): number {
  return new Date(transitionTime).getTime() - Date.now();
}
