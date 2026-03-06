"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/data/types";
import { ACCESS_LEVEL_LABELS, SUGGESTED_PROMPTS } from "@/data/constants";
import type { CountyStats } from "@/data/types";

interface AIChatProps {
  county: CountyStats | null;
}

export default function AIChat({ county }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !county || isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            county,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "Failed to get response");
        }

        const data = (await res.json()) as { content: string };
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.content ?? "",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Sorry, I couldn't get a response. ${err instanceof Error ? err.message : "Please try again."}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [county, isLoading, messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChipClick = (prompt: string) => sendMessage(prompt);

  if (!county) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg bg-cream-50 p-6 text-center">
        <p className="text-ink-500">Select a county on the map to explore its maternal care data and ask questions.</p>
      </div>
    );
  }

  if (county.dataNotAvailable) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg bg-cream-50 p-6 text-center">
        <p className="text-ink-500">Data not available for this county. The chat is disabled. I&apos;m waiting on actual figures from March of Dimes.</p>
      </div>
    );
  }

  const showChips = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 shrink-0 rounded-lg bg-sage-50 p-3 text-sm">
        <p className="font-medium text-peach-600">County context</p>
        <p className="text-ink-500">
          {county.name} County, {county.state} - {ACCESS_LEVEL_LABELS[county.accessLevel]}
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3 min-h-0"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-4 bg-sage-200 text-ink-800"
                : "mr-4 bg-sand-200 text-ink-800"
            }`}
          >
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="mr-4 inline-flex rounded-lg bg-sand-200 px-3 py-2">
            <span className="flex items-end gap-1.5" aria-label="AI is typing">
              <span className="h-2 w-2 animate-typing rounded-full bg-sage-600" />
              <span className="h-2 w-2 animate-typing rounded-full bg-sage-600 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-typing rounded-full bg-sage-600 [animation-delay:300ms]" />
            </span>
          </div>
        )}
      </div>

      {showChips && (
        <div className="mt-2 shrink-0 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleChipClick(prompt)}
              className="rounded-full border border-sage-300 bg-white px-3 py-1.5 text-xs text-ink-600 transition hover:bg-sage-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-2 shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about maternal care in this county…"
            rows={2}
            className="flex-1 resize-none rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="self-end rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sage-700 disabled:opacity-50"
          >
            {isLoading ? "…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
