/**
 * Geocoding utilities for the Care Desert Map.
 * Uses Mapbox Geocoding API v6 to convert zip codes to coordinates.
 */

const GEOCODE_BASE = "https://api.mapbox.com/search/geocode/v6/forward";

/**
 * Geocode a US zip code to coordinates using Mapbox Geocoding API.
 * @param zip - 5-digit or 9-digit US zip code
 * @param accessToken - Mapbox public access token
 * @returns Coordinates or null if not found
 */
export async function geocodeZipCode(
  zip: string,
  accessToken: string
): Promise<{ lng: number; lat: number } | null> {
  const trimmed = zip.trim().replace(/\s+/g, "");
  const params = new URLSearchParams({
    q: trimmed,
    access_token: accessToken,
    country: "US",
    types: "postcode",
    limit: "1",
  });
  const url = `${GEOCODE_BASE}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      type: string;
      features?: Array<{
        type: string;
        geometry?: { type: string; coordinates?: [number, number] };
      }>;
    };
    const features = data?.features;
    if (!Array.isArray(features) || features.length === 0) return null;
    const coords = features[0]?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return null;
    const [lng, lat] = coords;
    if (typeof lng !== "number" || typeof lat !== "number") return null;
    return { lng, lat };
  } catch {
    return null;
  }
}
