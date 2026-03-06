"use client";

import { useState } from "react";
import WhyPomeloModal from "./WhyPomeloModal";

const PORTFOLIO_URL = "https://heyimhelen.com";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b border-sand-200 bg-cream-50 px-4">
        <div className="flex items-baseline gap-2">
          <h1 className="font-serif text-xl font-semibold text-peach-600">Care Desert Map</h1>
          <span className="text-xs font-normal text-ink-400">for demo purposes only</span>
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
      <WhyPomeloModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
