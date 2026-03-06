"use client";

import { useCallback, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Map from "@/components/Map";
import MapLegend from "@/components/MapLegend";
import CountyPanel from "@/components/CountyPanel";
import type { CountyStats } from "@/data/types";
import {
  MAP_WIDTH_PERCENT,
  PANEL_WIDTH_PERCENT,
  HEADER_HEIGHT,
  FOOTER_MARGIN,
} from "@/data/constants";

export default function Home() {
  const [selectedCounty, setSelectedCounty] = useState<CountyStats | null>(null);
  const [selectedFips, setSelectedFips] = useState<string | null>(null);

  const handleCountySelect = useCallback((stats: CountyStats | null) => {
    setSelectedCounty(stats);
    setSelectedFips(stats?.fips ?? null);
  }, []);

  return (
    <>
      <Header />
      <div
        className="fixed left-0 z-0"
        style={{
          width: `${MAP_WIDTH_PERCENT}%`,
          top: HEADER_HEIGHT,
          bottom: FOOTER_MARGIN,
        }}
      >
        <div className="relative h-full w-full">
          <Map
            onCountySelect={handleCountySelect}
            selectedFips={selectedFips}
          />
          <MapLegend />
        </div>
      </div>
      <div
        className="fixed right-0 z-10 flex flex-col overflow-y-auto border-l border-sand-200 bg-cream-50 p-4"
        style={{
          width: `${PANEL_WIDTH_PERCENT}%`,
          top: HEADER_HEIGHT,
          bottom: FOOTER_MARGIN,
        }}
      >
        <CountyPanel county={selectedCounty} />
      </div>
      <Footer />
    </>
  );
}
