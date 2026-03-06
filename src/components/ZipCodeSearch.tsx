"use client";

import { useState, FormEvent } from "react";
import { geocodeZipCode } from "@/lib/geocoding";
import { ZIP_CODE_MAX_LENGTH } from "@/data/constants";

const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;

interface ZipCodeSearchProps {
  onLocationFound: (lng: number, lat: number) => void;
  disabled?: boolean;
}

export default function ZipCodeSearch({
  onLocationFound,
  disabled = false,
}: ZipCodeSearchProps) {
  const [zip, setZip] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = zip.trim();
    if (!trimmed) return;

    if (!ZIP_CODE_REGEX.test(trimmed)) {
      setError("Please enter a valid 5-digit US ZIP code");
      return;
    }

    const token = (process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "").trim();
    if (!token) {
      setError("Map not configured");
      return;
    }

    setIsSearching(true);
    try {
      const result = await geocodeZipCode(trimmed, token);
      if (result) {
        onLocationFound(result.lng, result.lat);
        setZip("");
      } else {
        setError("ZIP code not found");
      }
    } catch {
      setError("Search failed. Try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute left-4 top-4 z-10 flex flex-col gap-1 rounded-lg border border-sand-200 bg-cream-50/95 px-3 py-2 shadow-sm"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          onFocus={() => setError(null)}
          placeholder="Enter ZIP code"
          maxLength={ZIP_CODE_MAX_LENGTH}
          disabled={disabled || isSearching}
          className="w-28 rounded border border-sand-200 bg-white px-2 py-1.5 text-sm text-ink-800 placeholder:text-ink-300 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || isSearching}
          className="rounded bg-sage-100 px-2.5 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-200 disabled:opacity-60"
        >
          {isSearching ? "Searching…" : "Go"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
