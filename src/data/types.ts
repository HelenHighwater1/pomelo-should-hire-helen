/**
 * Type definitions for Care Desert Map data and UI state.
 */

/** Maternal care access levels per HRSA/March of Dimes classification */
export type AccessLevel = "desert" | "low" | "moderate" | "adequate";

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
}

/** Message in the AI chat */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
