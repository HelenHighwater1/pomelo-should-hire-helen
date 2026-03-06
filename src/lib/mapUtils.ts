/**
 * Map and geometry utilities for the Care Desert Map.
 */

/** GeoJSON types for Mapbox */
export interface GeoJSONFeature {
  type: "Feature";
  geometry: { type: string; coordinates: unknown };
  properties?: Record<string, unknown>;
  id?: string | number;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

/** Extract 5-digit FIPS from Plotly GeoJSON feature (id format: "05000US06037" or similar) */
export function getFipsFromFeature(feature: GeoJSONFeature): string | null {
  const id = feature.id ?? feature.properties?.GEO_ID ?? feature.properties?.id;
  if (typeof id === "string") {
    const match = id.match(/(\d{5})$/);
    if (match) return match[1];
    if (id.length === 5 && /^\d+$/.test(id)) return id;
  }
  const state = feature.properties?.STATE;
  const county = feature.properties?.COUNTY;
  if (state != null && county != null) {
    const s = String(state).padStart(2, "0");
    const c = String(county).padStart(3, "0");
    return s + c;
  }
  return null;
}

/** Get county name from feature properties */
export function getCountyNameFromFeature(feature: GeoJSONFeature): string {
  return (feature.properties?.NAME as string) ?? "Unknown County";
}

/** Get state name/code from feature properties */
export function getStateFromFeature(feature: GeoJSONFeature): string {
  return (feature.properties?.STATE ?? feature.properties?.STUSPS ?? "Unknown") as string;
}
