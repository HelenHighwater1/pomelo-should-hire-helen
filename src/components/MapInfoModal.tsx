"use client";

import { useEffect } from "react";

interface MapInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapInfoModal({ isOpen, onClose }: MapInfoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-info-title"
    >
      <div
        className="max-h-[85vh] max-w-lg overflow-y-auto rounded-xl bg-cream-50 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="map-info-title" className="font-serif text-lg font-semibold text-peach-600">
          About this map
        </h2>
        <p className="mt-2 text-xs text-ink-400">For demo purposes only.</p>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
          <p>
            This map shows maternal care access across every US county, using data from HRSA&apos;s 2023 Maternity Care Desert report. Counties are classified as a care desert, low access, moderate access, or adequate access based on the number of OB clinicians and birthing facilities relative to population.
          </p>
          <p>
            Click any county to see its stats and ask questions about maternal care in that area.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white hover:bg-sage-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
