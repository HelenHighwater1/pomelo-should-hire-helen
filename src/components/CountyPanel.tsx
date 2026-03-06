"use client";

import { useEffect, useState } from "react";
import {
  ACCESS_LEVEL_LABELS,
  ACCESS_LEVEL_COLORS,
  DATA_DISCLAIMER_SHORT,
  DATA_DISCLAIMER_FULL,
} from "@/data/constants";
import type { CountyStats } from "@/data/types";
import AIChat from "./AIChat";

interface CountyPanelProps {
  county: CountyStats | null;
}

export default function CountyPanel({ county }: CountyPanelProps) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isAiInfoOpen, setIsAiInfoOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDisclaimerOpen(false);
        setIsAiInfoOpen(false);
      }
    };
    if (isDisclaimerOpen || isAiInfoOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isDisclaimerOpen, isAiInfoOpen]);

  if (!county) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg bg-cream-100 p-8 text-center">
        <p className="text-ink-500">
          Click a county on the map to view maternal care statistics and ask questions.
        </p>
      </div>
    );
  }

  const color = ACCESS_LEVEL_COLORS[county.accessLevel];
  const dataNotAvailable = county.dataNotAvailable === true;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-lg border border-sand-200 bg-cream-50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-serif text-lg font-semibold text-peach-600">
            {county.name} County, {county.state}
          </h2>
          <span
            className="inline-block rounded px-2 py-0.5 text-sm font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {ACCESS_LEVEL_LABELS[county.accessLevel]}
          </span>
        </div>
        {dataNotAvailable ? (
          <p className="mt-2 text-sm text-ink-600">
            Data not available for this county. I&apos;m waiting on actual figures from March of Dimes.
          </p>
        ) : (
          <>
            <dl className="mt-2 space-y-1.5 text-sm">
              {county.womenReproductiveAge != null && (
                <div className="flex justify-between">
                  <dt className="text-ink-500">Women 15-44</dt>
                  <dd className="font-medium text-ink-800">
                    {county.womenReproductiveAge.toLocaleString()}
                  </dd>
                </div>
              )}
              {county.birthingFacilities != null && (
                <div className="flex justify-between">
                  <dt className="text-ink-500">Facilities</dt>
                  <dd className="font-medium text-ink-800">{county.birthingFacilities}</dd>
                </div>
              )}
              {county.obstetricClinicians != null && (
                <div className="flex justify-between">
                  <dt className="text-ink-500">OB clinicians</dt>
                  <dd className="font-medium text-ink-800">{county.obstetricClinicians}</dd>
                </div>
              )}
            </dl>
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(true)}
              className="mt-2 w-full border-t border-sand-200 pt-2 text-left text-xs leading-relaxed text-ink-500 underline-offset-2 hover:underline hover:text-ink-700"
            >
              {DATA_DISCLAIMER_SHORT}
            </button>
          </>
        )}
      </div>

      {isAiInfoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsAiInfoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-info-title"
        >
          <div
            className="max-h-[85vh] max-w-lg overflow-y-auto rounded-xl bg-cream-50 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="ai-info-title" className="font-serif text-lg font-semibold text-peach-600">
              About this AI assistant
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              This chat is a demo implementation using the Anthropic Claude API, designed to help users explore maternal care access data by county. It is not a medical tool and is not intended for clinical use.
            </p>
            <h3 className="mt-4 font-serif text-sm font-semibold text-ink-800">What it&apos;s designed to do</h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-ink-600">
              <li>Answer questions about county-level maternal care access, resources, and context</li>
              <li>Supplement HRSA AHRF data with general knowledge about state programs, nearby facilities, and regional context (temporary AHRF data; awaiting March of Dimes figures)</li>
              <li>Direct users to appropriate resources like local health departments, 211.org, and state Medicaid programs</li>
            </ul>
            <h3 className="mt-4 font-serif text-sm font-semibold text-ink-800">Guardrails in place</h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-ink-600">
              <li>Clinical and medical advice questions are blocked and redirected to a care provider</li>
              <li>Distress signals trigger an immediate redirect to emergency services and the PSI helpline (1-800-944-4773)</li>
              <li>Specific facility names, addresses, and phone numbers are not stated as facts, since the underlying dataset doesn&apos;t include verified directory data</li>
              <li>Off-topic questions receive a one-sentence redirect with no engagement</li>
            </ul>
            <h3 className="mt-4 font-serif text-sm font-semibold text-ink-800">What a production implementation would require</h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-ink-600">
              <li>A verified, regularly updated directory of facilities and providers by county</li>
              <li>RAG (retrieval-augmented generation) grounded in authoritative clinical sources</li>
              <li>Formal clinical review of all system prompt guardrails</li>
              <li>HIPAA-compliant infrastructure if any personal health information is collected</li>
              <li>Ongoing monitoring and human review of conversation logs for safety</li>
            </ul>
            <p className="mt-4 border-t border-sand-200 pt-3 text-xs leading-relaxed text-ink-600">
              Temporary data from HRSA Area Health Resources Files. I&apos;m waiting on actual figures from March of Dimes. AI responses are for informational purposes only and should not be used to make medical decisions.
            </p>
            <button
              type="button"
              onClick={() => setIsAiInfoOpen(false)}
              className="mt-4 rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white hover:bg-sage-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isDisclaimerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsDisclaimerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="data-disclaimer-title"
        >
          <div
            className="max-w-md rounded-xl bg-cream-50 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="data-disclaimer-title" className="font-serif text-lg font-semibold text-peach-600">
              Data disclaimer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {DATA_DISCLAIMER_FULL}
            </p>
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(false)}
              className="mt-4 rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white hover:bg-sage-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {!dataNotAvailable && (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-lg border border-sand-200 bg-cream-50 p-4">
        <div className="mb-2 flex shrink-0 items-baseline gap-2">
          <h3 className="font-serif text-sm font-semibold text-peach-600">AI insights</h3>
          <button
            type="button"
            onClick={() => setIsAiInfoOpen(true)}
            className="text-xs font-normal text-ink-400 underline-offset-2 hover:text-ink-600 hover:underline"
          >
            for demo purposes only
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
            <AIChat county={county} />
        </div>
      </div>
      )}
    </div>
  );
}
