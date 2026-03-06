"use client";

import { useEffect } from "react";

interface WhyPomeloModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhyPomeloModal({ isOpen, onClose }: WhyPomeloModalProps) {
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
      aria-labelledby="why-pomelo-title"
    >
      <div
        className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-xl bg-cream-50 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="why-pomelo-title" className="font-serif text-lg font-semibold text-peach-600">
          Why Pomelo?
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-ink-600">
          <section>
            <p>
              Pomelo is tackling a real, hard, underserved problem - maternal care access in the US is genuinely broken, especially outside major cities. Virtual platforms like yours, especially with AI and tools like Grove to help provide clinicians with the right information easily, is such a game-changer.
            </p>
          </section>
          <section>
            <h3 className="mb-1 font-serif font-semibold text-peach-600">Why this app?</h3>
            <p>
              I am sure you get a million applications saying something similar - so I wanted to take an extra step to show you that I am actually really excited about your company and mission: I made a website.
              I chose to focus it on care access data - this felt like the most interesting way to engage with the actual problem (well…one dimension of it anyway). I added the AI chat because it&apos;s relevant to the role and I wanted to show I can actually build with these tools, not just talk about them. It&apos;s a demo and it has real limitations (listed in the <a href="https://github.com/HelenHighwater1/pomelo-should-hire-helen?tab=readme-ov-file#about-the-ai-chat" target="_blank" rel="noopener noreferrer" className="text-sage-600 underline hover:text-sage-700">GitHub readme</a>), but I wanted to show you I work with high agency, quickly, and can use these tools.
            </p>
            <p className="mt-6">
              Another aspect of the app, and not to get too personal here, but two of my sisters had complications during their births - even with good hospital access it was scary, and I think about what that looks like for someone in one of the red counties on this map.
            </p>
          </section>
          <section>
            <h3 className="mb-1 font-serif font-semibold text-peach-600">Who am I?</h3>
            <p>
              A bit more about me - I&apos;m a junior software engineer with a non-traditional background (bootcamp, some time at a SaaS company, and then a career break to care for family). I&apos;ve recently retooled and I&apos;m looking for the right place to grow - and a mission-driven startup like yours is exactly what I am looking for.
            </p>
          </section>
          <p>
            I&apos;d love to connect.
          </p>
          <p>
            <a href="mailto:hgedwards87@gmail.com" className="text-sage-600 underline hover:text-sage-700">Email</a>
            {" - "}
            <a href="https://www.linkedin.com/in/helen-highwater-96981532/" target="_blank" rel="noopener noreferrer" className="text-sage-600 underline hover:text-sage-700">LinkedIn</a>
            {" - "}
            <a href="https://heyimhelen.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 underline hover:text-sage-700">Portfolio Site</a>
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
