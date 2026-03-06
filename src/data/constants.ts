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
  unknown: "Data not available",
};

/** Map choropleth fill colors (warm, human palette) */
export const ACCESS_LEVEL_COLORS: Record<AccessLevel, string> = {
  desert: "#c45c4a",
  low: "#e8a87c",
  moderate: "#a8d5a2",
  adequate: "#5c9e5c",
  unknown: "#9ca3af",
};

/** Mapbox fill-opacity for choropleth */
export const CHOROPLETH_FILL_OPACITY = 0.85;

/** Mapbox outline color when county is selected (outline only so choropleth stays visible) */
export const HIGHLIGHT_OUTLINE_COLOR = "#2d5c7a";

/** Short disclaimer shown inline (clickable to open full) */
export const DATA_DISCLAIMER_SHORT =
  "Temporary data from HRSA Area Health Resources Files. I'm waiting on actual figures from March of Dimes.";

/** Full disclaimer shown in popup */
export const DATA_DISCLAIMER_FULL =
  "This is for demo purposes only. This map uses temporary data from HRSA's Area Health Resources Files (AHRF) to approximate maternal care access. I'm waiting on actual figures from March of Dimes. Some urban counties may appear undercounted—HRSA attributes providers to county of licensure, which doesn't always reflect where care is delivered. Figures should be interpreted as directional, not precise.";

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

/** Layout: header height (matches h-14 / 3.5rem) */
export const HEADER_HEIGHT = "3.5rem";

/** Layout: bottom margin above footer */
export const FOOTER_MARGIN = "2rem";

/** County outline line width (Mapbox paint) */
export const COUNTY_OUTLINE_WIDTH = 0.5;

/** County outline color (Mapbox paint) */
export const COUNTY_OUTLINE_COLOR = "#ffffff";

/** Highlight outline line width when county selected */
export const HIGHLIGHT_OUTLINE_WIDTH = 3;

/** Resize debounce delays in ms (Mapbox layout settling) */
export const RESIZE_DEBOUNCE_DELAYS_MS = [100, 500, 1500] as const;

/** Map style load timeout in milliseconds */
export const MAP_LOAD_TIMEOUT_MS = 15000;

/** Minimum container dimension (px) before initializing map */
export const MIN_CONTAINER_SIZE_PX = 100;

/** Duration of fitBounds animation in milliseconds */
export const BOUNDS_ANIMATION_DURATION_MS = 800;

/** AI chat: max tokens per response */
export const AI_MAX_TOKENS = 1024;

/** AI chat: model identifier */
export const AI_MODEL = "claude-haiku-4-5-20251001";

/** ZIP code input max length (5 digits or 9 with hyphen) */
export const ZIP_CODE_MAX_LENGTH = 10;
