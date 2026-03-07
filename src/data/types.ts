/**
 * Type definitions for Care Desert Map data and UI state.
 */

/** Maternal care access levels (extracted from HRSA AHRF CSV; temporary placeholder) */
export type AccessLevel = "desert" | "low" | "moderate" | "adequate" | "unknown";

/** County-level maternal care statistics and metadata */
export interface CountyStats {
  fips: string;
  name: string;
  state: string;
  accessLevel: AccessLevel;
  /** Women of reproductive age (15-44) in county, if available */
  womenReproductiveAge?: number;
  /** Birthing facilities count, if available */
  birthingFacilities?: number;
  /** Obstetric clinicians count, if available */
  obstetricClinicians?: number;
  /** True when county is not in AHRF; no stats available */
  dataNotAvailable?: boolean;
}

/** Message in the AI chat */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
