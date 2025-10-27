"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { ChatMessage } from "@/types";
import clsx from "clsx";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatContainerProps = {
  messages: ChatMessage[];
  isThinking: boolean;
  className?: string; // optional extra classes for the scroll container
};

/**
 * Scrollable chat transcript with bubbles and optional plot image.
 * - Auto-scrolls to bottom on new messages or when thinking starts.
 * - Accessible live region so screen readers announce new content.
 */
export default function ChatContainer({ messages, isThinking, className }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages or thinking state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  return (
    <div
      className={clsx(
        "h-full min-h-0 overflow-auto pr-2", 
        // nice scrollbar on WebKit; fallback remains fine
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded",
        className
      )}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map((m, i) => {
        const isUser = m.sender === "user";
        return (
          <div key={i} className={clsx("mb-3", isUser ? "text-right" : "text-left")}>
            <div
              className={clsx(
                "inline-block max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-wrap align-top",
                isUser
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              {/* Message content */}
              {isUser ? (
                // Render user messages as plain text
                <span>{m.text}</span>
              ) : (
                // Render assistant messages as Markdown (GFM tables, lists, etc.)
                <div className="prose prose-sm max-w-none
                [&_*code]:break-words [&_pre]:whitespace-pre-wrap">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Customize table rendering to be responsive and styled
                      table: ({ children }) => (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left">{children}</table>
                        </div>
                      ),
                      // Table Head
                      thead: ({ children }) => (
                        <thead className="bg-gray-200/70">{children}</thead>
                      ),
                      // Table Header Cell
                      th: ({ children }) => (
                        <th className="px-3 py-2 border border-gray-300 font-semibold">
                          {children}
                        </th>
                      ),
                      // Table Data Cell
                      td: ({ children }) => (
                        <td className="px-3 py-2 border border-gray-200 align-top">
                          {children}
                        </td>
                      ),
                      // Anchor (Hyperlink)
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {m.text || ""}
                  </ReactMarkdown>
                </div>
              )}

              {/* Plot (optional) */}
              {m.plot && (
                <div className="mt-2">
                  {/* base64 data URL – use unoptimized to skip Next's loader */}
                  <Image
                    src={`data:image/png;base64,${m.plot}`}
                    alt="Generated plot"
                    className="rounded-lg"
                    width={640}
                    height={360}
                    unoptimized
                    priority={false}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isThinking && (
        <ThinkingBubble />
      )}

      <div ref={bottomRef} />
    </div>
  );
}

/** Small typing indicator bubble for the assistant */
function ThinkingBubble() {
  return (
    <div className="mb-3 text-left">
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-gray-100 text-gray-700">
        <span className="text-sm">Thinking</span>
        <span className="inline-flex gap-1">
          <Dot />
          <Dot className="animation-delay-150" />
          <Dot className="animation-delay-300" />
        </span>
      </div>
    </div>
  );
}

/** Single bouncing dot for the typing indicator */
function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-block h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500",
        "animate-bounce",
        className
      )}
    />
  );
}