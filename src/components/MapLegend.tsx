"use client";

import { ACCESS_LEVEL_LABELS, ACCESS_LEVEL_COLORS } from "@/data/constants";
import type { AccessLevel } from "@/data/types";

const LEVELS: AccessLevel[] = ["desert", "low", "moderate", "adequate"];

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 rounded-lg border border-sand-200 bg-cream-50/95 px-3 py-2 shadow-sm">
      <p className="mb-2 text-xs font-medium text-peach-600">Maternal care access</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {LEVELS.map((level) => (
          <div key={level} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: ACCESS_LEVEL_COLORS[level] }}
            />
            <span className="text-xs text-ink-600">{ACCESS_LEVEL_LABELS[level]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
