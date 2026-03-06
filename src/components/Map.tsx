"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  ACCESS_LEVEL_COLORS,
  CHOROPLETH_FILL_OPACITY,
  COUNTY_FOCUS_ZOOM,
  HIGHLIGHT_OUTLINE_COLOR,
  INITIAL_MAP_CENTER,
  INITIAL_ZOOM,
  ZOOM_ANIMATION_DURATION_MS,
} from "@/data/constants";
import { buildCountyStats, getAccessLevelForFips } from "@/data/countyAccessData";
import type { CountyStats } from "@/data/types";
import { formatStateCode } from "@/lib/stateCodes";
import {
  getFipsFromFeature,
  getCountyNameFromFeature,
  getStateFromFeature,
  type GeoJSONFeature,
  type GeoJSONFeatureCollection,
} from "@/lib/mapUtils";
import ZipCodeSearch from "./ZipCodeSearch";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

interface MapProps {
  onCountySelect: (stats: CountyStats | null) => void;
  selectedFips: string | null;
}

export default function Map({ onCountySelect, selectedFips }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geolocationAttempted = useRef(false);
  const geoJsonRef = useRef<GeoJSONFeatureCollection | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const resizeMapRef = useRef<(() => void) | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleZipLocationFound = useCallback(
    (lng: number, lat: number) => {
      const map = mapRef.current;
      if (!map || !map.getLayer("counties-fill")) return;

      map.flyTo({
        center: [lng, lat],
        zoom: COUNTY_FOCUS_ZOOM,
        duration: ZOOM_ANIMATION_DURATION_MS,
      });

      map.once("moveend", () => {
        const point = map.project([lng, lat]);
        const features = map.queryRenderedFeatures(point, {
          layers: ["counties-fill"],
        });
        const f = features[0] as GeoJSONFeature | undefined;
        if (f) {
          const fips = getFipsFromFeature(f);
          const name = getCountyNameFromFeature(f);
          const stateCode = getStateFromFeature(f);
          const state = formatStateCode(stateCode);
          if (fips) {
            const stats = buildCountyStats(fips, name, state);
            onCountySelect(stats);
          }
        }
      });
    },
    [onCountySelect]
  );

  const geolocationZoom = useCallback((map: mapboxgl.Map) => {
    if (geolocationAttempted.current) return;
    geolocationAttempted.current = true;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const [lng, lat] = [pos.coords.longitude, pos.coords.latitude];
        map.flyTo({
          center: [lng, lat],
          zoom: COUNTY_FOCUS_ZOOM,
          duration: ZOOM_ANIMATION_DURATION_MS,
        });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  const setupMap = useCallback(() => {
    if (!containerRef.current) return;

    const token = (process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "").trim();
    if (!token) {
      console.warn("NEXT_PUBLIC_MAPBOX_TOKEN not set. Map will not load.");
      setTokenMissing(true);
      setIsLoading(false);
      return;
    }

    setLoadError(null);
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: INITIAL_MAP_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current = map;

    map.on("error", (e) => {
      console.error("Mapbox error:", e);
      setLoadError(e.error?.message ?? "Map failed to load. Check the browser console.");
      setIsLoading(false);
    });

    const resizeMap = () => map.resize();
    resizeMapRef.current = resizeMap;
    resizeMap();
    const t1 = setTimeout(resizeMap, 100);
    const t2 = setTimeout(resizeMap, 500);
    const t3 = setTimeout(resizeMap, 1500);
    window.addEventListener("resize", resizeMap);

    const resizeObserver = new ResizeObserver(() => resizeMap());
    resizeObserverRef.current = resizeObserver;
    resizeObserver.observe(containerRef.current);

    const loadTimeout = setTimeout(() => {
      if (!map.isStyleLoaded()) {
        map.resize();
        setIsLoading(false);
      }
    }, 15000);

    map.on("load", async () => {
      map.resize();
      try {
        const res = await fetch(GEOJSON_URL);
        const gj = (await res.json()) as GeoJSONFeatureCollection;

        gj.features.forEach((f) => {
          const fips = getFipsFromFeature(f);
          const props = f.properties ?? {};
          if (fips) {
            (props as Record<string, string>)["fips-color"] =
              ACCESS_LEVEL_COLORS[getAccessLevelForFips(fips)];
            (props as Record<string, string>)["fips"] = fips;
          }
        });
        geoJsonRef.current = gj;

        map.addSource("counties", {
          type: "geojson",
          data: gj as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
        });
        map.addLayer({
          id: "counties-fill",
          type: "fill",
          source: "counties",
          paint: {
            "fill-color": ["get", "fips-color"],
            "fill-opacity": CHOROPLETH_FILL_OPACITY,
          },
        });
        map.addLayer({
          id: "counties-outline",
          type: "line",
          source: "counties",
          paint: { "line-width": 0.5, "line-color": "#ffffff" },
        });

        map.addLayer({
          id: "counties-highlight-outline",
          type: "line",
          source: "counties",
          paint: {
            "line-width": 3,
            "line-color": HIGHLIGHT_OUTLINE_COLOR,
          },
          filter: ["==", ["get", "fips"], ""],
        });

        map.on("click", "counties-fill", (e) => {
          const f = e.features?.[0] as GeoJSONFeature | undefined;
          if (!f) return;

          const fips = getFipsFromFeature(f);
          const name = getCountyNameFromFeature(f);
          const stateCode = getStateFromFeature(f);
          const state = formatStateCode(stateCode);

          if (fips) {
            const stats = buildCountyStats(fips, name, state);
            onCountySelect(stats);
          }
        });

        map.getCanvas().style.cursor = "pointer";

        map.on("mouseenter", "counties-fill", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "counties-fill", () => {
          map.getCanvas().style.cursor = "";
        });

        geolocationZoom(map);
      } catch (err) {
        console.error("Failed to load county GeoJSON:", err);
      } finally {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(loadTimeout);
        // Keep ResizeObserver and resize listener active; cleanup on unmount only.
        if (map.loaded()) {
          map.resize();
        } else {
          const poll = setInterval(() => {
            if (map.loaded()) {
              map.resize();
              clearInterval(poll);
            }
          }, 50);
          setTimeout(() => clearInterval(poll), 5000);
        }
        map.once("idle", () => map.resize());
        requestAnimationFrame(() => map.resize());
        setIsLoading(false);
      }
    });
  }, [onCountySelect, geolocationZoom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    const initMap = () => {
      if (cancelled) return;
      const { clientHeight, clientWidth } = el;
      if (clientHeight < 100 || clientWidth < 100) {
        requestAnimationFrame(initMap);
        return;
      }
      // Defer one more frame so layout is fully settled before Mapbox reads getBoundingClientRect.
      requestAnimationFrame(() => {
        if (cancelled) return;
        setupMap();
      });
    };

    const id = requestAnimationFrame(initMap);

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (resizeMapRef.current) {
        window.removeEventListener("resize", resizeMapRef.current);
        resizeMapRef.current = null;
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [setupMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("counties-fill")) return;

    const highlightFilter =
      selectedFips ? ["==", ["get", "fips"], selectedFips] : ["==", ["get", "fips"], ""];
    map.setFilter("counties-highlight-outline", highlightFilter);

    if (selectedFips) {
      const gj = geoJsonRef.current;
      const feat = gj?.features?.find((f) => getFipsFromFeature(f) === selectedFips);
      const geom = feat?.geometry as { type: string; coordinates: number[][][] | number[][][][] } | undefined;
      if (geom) {
        let allLngs: number[] = [];
        let allLats: number[] = [];
        if (geom.type === "Polygon") {
          const [outer] = geom.coordinates as number[][][];
          allLngs = outer?.map((c) => c[0]) ?? [];
          allLats = outer?.map((c) => c[1]) ?? [];
        } else if (geom.type === "MultiPolygon") {
          for (const poly of geom.coordinates as number[][][][]) {
            const [outer] = poly;
            allLngs.push(...(outer?.map((c) => c[0]) ?? []));
            allLats.push(...(outer?.map((c) => c[1]) ?? []));
          }
        }
        if (allLngs.length && allLats.length) {
          const bounds: [[number, number], [number, number]] = [
            [Math.min(...allLngs), Math.min(...allLats)],
            [Math.max(...allLngs), Math.max(...allLats)],
          ];
          map.fitBounds(bounds, { duration: 800 });
        }
      }
    }
  }, [selectedFips]);

  const showMapControls = !isLoading && !tokenMissing && !loadError;

  return (
    <div className="absolute inset-0" style={{ width: "100%", height: "100%" }}>
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />
      {showMapControls && (
        <ZipCodeSearch onLocationFound={handleZipLocationFound} />
      )}
      {tokenMissing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sand-100 p-6 text-center">
          <p className="font-medium text-ink-800">Mapbox token required</p>
          <p className="text-sm text-ink-500">
            Add <code className="rounded bg-sand-200 px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
            <code className="rounded bg-sand-200 px-1.5 py-0.5">.env.local</code> and restart the dev server.
          </p>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-500 underline hover:text-ink-800"
          >
            Get a free token at Mapbox
          </a>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sand-100 p-6 text-center">
          <p className="font-medium text-ink-800">Map failed to load</p>
          <p className="text-sm text-ink-500">{loadError}</p>
          <p className="text-xs text-ink-400">
            Restart the dev server after changing <code className="rounded bg-sand-200 px-1 py-0.5">.env</code>. Token must be <code className="rounded bg-sand-200 px-1 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> (public <code className="rounded bg-sand-200 px-1 py-0.5">pk.</code>).
          </p>
        </div>
      )}
      {isLoading && !tokenMissing && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand-100">
          <p className="text-ink-500">Loading map…</p>
        </div>
      )}
    </div>
  );
}
