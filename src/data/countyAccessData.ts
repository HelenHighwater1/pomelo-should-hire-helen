/**
 * County-level maternal care access data.
 * Uses HRSA AHRF data (temporary; awaiting March of Dimes figures).
 */

import type { AccessLevel } from "./types";
import ahrfLookup from "./ahrfCountyLookup.json";

type AhrfEntry = {
  accessLevel: AccessLevel;
  womenReproductiveAge?: number;
  birthingFacilities?: number;
  obstetricClinicians?: number;
};
const lookup = ahrfLookup as Record<string, AhrfEntry>;

/**
 * Returns access level for a county by FIPS code.
 */
export function getAccessLevelForFips(fips: string): AccessLevel {
  return lookup[fips]?.accessLevel ?? "unknown";
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
  dataNotAvailable?: boolean;
} {
  const entry = lookup[fips];
  if (!entry) {
    return {
      fips,
      name,
      state,
      accessLevel: "unknown",
      dataNotAvailable: true,
    };
  }
  return {
    fips,
    name,
    state,
    accessLevel: entry.accessLevel,
    womenReproductiveAge: entry.womenReproductiveAge,
    birthingFacilities: entry.birthingFacilities,
    obstetricClinicians: entry.obstetricClinicians,
  };
}
