/**
 * County-level maternal care access data.
 * Simulates HRSA/March of Dimes classification (desert, low, moderate, adequate).
 * In production, replace with actual HRSA or March of Dimes API/dataset.
 */

import type { AccessLevel } from "./types";

/** Deterministic hash for FIPS to generate consistent access levels */
function hashFips(fips: string): number {
  let h = 0;
  for (let i = 0; i < fips.length; i++) {
    h = (h * 31 + fips.charCodeAt(i)) >>> 0;
  }
  return h % 100;
}

/**
 * Returns access level for a county by FIPS code.
 * Distribution approximates March of Dimes 2024: ~35% desert, ~25% low, ~25% moderate, ~15% adequate.
 */
export function getAccessLevelForFips(fips: string): AccessLevel {
  const h = hashFips(fips);
  if (h < 35) return "desert";
  if (h < 60) return "low";
  if (h < 85) return "moderate";
  return "adequate";
}

/** Build county stats object for display and AI context */
export function buildCountyStats(
  fips: string,
  name: string,
  state: string
): {
  fips: string;
  name: string;
  state: string;
  accessLevel: AccessLevel;
  womenReproductiveAge?: number;
  birthingFacilities?: number;
  obstetricClinicians?: number;
} {
  const accessLevel = getAccessLevelForFips(fips);
  const h = hashFips(fips);
  return {
    fips,
    name,
    state,
    accessLevel,
    womenReproductiveAge: (h + 1) * 1200 + 8000,
    birthingFacilities: accessLevel === "desert" ? 0 : (h % 5) + 1,
    obstetricClinicians: accessLevel === "desert" ? 0 : (h % 15) + 2,
  };
}
