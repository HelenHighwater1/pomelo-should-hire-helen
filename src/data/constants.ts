/**
 * Named constants for maternal care access classifications and map styling.
 * No magic numbers - all configurable values live here.
 */

import type { AccessLevel } from "./types";

/** Access level display labels */
export const ACCESS_LEVEL_LABELS: Record<AccessLevel, string> = {
  desert: "Maternity Care Desert",
  low: "Low Access",
  moderate: "Moderate Access",
  adequate: "Adequate Access",
};

/** Map choropleth fill colors (warm, human palette) */
export const ACCESS_LEVEL_COLORS: Record<AccessLevel, string> = {
  desert: "#c45c4a",
  low: "#e8a87c",
  moderate: "#a8d5a2",
  adequate: "#5c9e5c",
};

/** Mapbox fill-opacity for choropleth */
export const CHOROPLETH_FILL_OPACITY = 0.85;

/** Mapbox outline color when county is selected (outline only so choropleth stays visible) */
export const HIGHLIGHT_OUTLINE_COLOR = "#2d5c7a";

/** Short disclaimer shown inline (clickable to open full) */
export const DATA_DISCLAIMER_SHORT =
  "Demo data only. Data sourced from HRSA's 2023 Maternity Care Desert report.";

/** Full disclaimer shown in popup */
export const DATA_DISCLAIMER_FULL =
  "This is for demo purposes only. This data sourced from HRSA's 2023 Maternity Care Desert report. Some urban counties may appear undercounted - HRSA's methodology attributes providers to their county of licensure, which doesn't always reflect where care is physically delivered. Figures should be interpreted as directional, not precise.";

/** Suggested prompt chips shown before first user message */
export const SUGGESTED_PROMPTS = [
  "What resources exist for pregnant people here?",
  "How does this county compare to nearby areas?",
  "What are the main barriers to maternal care?",
] as const;

/** Layout: map width as percentage of viewport */
export const MAP_WIDTH_PERCENT = 65;

/** Layout: panel width as percentage of viewport */
export const PANEL_WIDTH_PERCENT = 35;

/** Initial map center (US) */
export const INITIAL_MAP_CENTER: [number, number] = [-95.7129, 37.0902];

/** Initial zoom level for full US view */
export const INITIAL_ZOOM = 3;

/** Zoom level when focusing on user's county */
export const COUNTY_FOCUS_ZOOM = 8;

/** Duration of zoom animation in milliseconds */
export const ZOOM_ANIMATION_DURATION_MS = 1500;
