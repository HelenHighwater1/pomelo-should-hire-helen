"use client";

import { useState } from "react";
import MapInfoModal from "./MapInfoModal";
import WhyPomeloModal from "./WhyPomeloModal";

const PORTFOLIO_URL = "https://heyimhelen.com";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapInfoOpen, setIsMapInfoOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b border-sand-200 bg-cream-50 px-4">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-xl font-semibold text-peach-600">Care Desert Map</h1>
          <button
            type="button"
            onClick={() => setIsMapInfoOpen(true)}
            aria-label="Map information"
            className="rounded p-0.5 text-ink-400 hover:text-ink-600 focus:outline-none focus:ring-2 focus:ring-sage-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
        </div>
        <nav className="flex items-center gap-3">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-500 hover:text-ink-800"
          >
            Check out Helen&apos;s Portfolio
          </a>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-sage-100 px-3 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-200"
          >
            Why Pomelo?
          </button>
        </nav>
      </header>
      <MapInfoModal isOpen={isMapInfoOpen} onClose={() => setIsMapInfoOpen(false)} />
      <WhyPomeloModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
