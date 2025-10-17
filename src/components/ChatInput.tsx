"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

type ChatInputProps = {
  onSend: (text: string) => void;
  isThinking?: boolean;          // disable input while the model is responding
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onStop?: () => void;           // optional "Stop" handler if you add streaming later
};

export default function ChatInput({
  onSend,
  isThinking = false,
  placeholder = "Ask about transactions, KPIs, charts…",
  className,
  autoFocus = false,
  onStop,
}: ChatInputProps) {
  const [val, setVal] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize the textarea up to ~6 lines
  const autoresize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    const cs = window.getComputedStyle(el);
    const borderY =
        parseFloat(cs.borderTopWidth || "0") + parseFloat(cs.borderBottomWidth || "0");
    const padY =
        parseFloat(cs.paddingTop || "0") + parseFloat(cs.paddingBottom || "0");

    const min = 40;          // px (matches button)
    const line = 22;         // <-- EXACT line-height used below (leading-[22px])
    const max = 6 * line + padY + borderY;   // ~6 lines + padding + borders

    // scrollHeight includes padding, not borders -> add borders back
    const needed = el.scrollHeight + borderY;
    const next = Math.max(min, Math.min(needed, max));
    el.style.height = `${next}px`;
    }, []);

  useEffect(() => {
    autoresize();
  }, [val, autoresize]);

  // Submit handler
  const submit = useCallback(() => {
    const text = val.trim();
    if (!text || isThinking) return;
    onSend(text);
    setVal("");
  }, [val, isThinking, onSend]);

  // Keyboard: Enter to send, Shift+Enter = newline
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      className={clsx("mt-3 flex items-end gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {/*  Textarea grows with content, up to ~6 lines */}
      <div className="flex-1 min-w-0 self-end">
        <textarea
          ref={taRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={autoresize}
          placeholder={placeholder}
          rows={1}
          autoFocus={autoFocus}
          disabled={isThinking}
          className={clsx(
            "block w-full resize-none px-3 py-2 rounded-lg",
            "min-h-[40px] leading-[22px]",
            "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10",
            "disabled:opacity-60 disabled:cursor-not-allowed box-border"
          )}
          aria-label="Chat message"
        />
      </div>
      
      {/* Send / Stop button */}
      {isThinking && onStop ? (
        <button
          type="button"
          onClick={onStop}
          className="h-[40px] px-4 rounded-lg border
                     border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 
                     self-end"
        >
          Stop
        </button>
      ) : (
        <button
          type="submit"
          disabled={isThinking || !val.trim()}
            className={clsx(
            "h-[40px] px-4 rounded-full",
            "self-end",
            val.trim() && !isThinking
              ? "bg-black text-white hover:bg-black/90"
              : "bg-gray-200 text-gray-600"
          )}
          aria-label="Send message"
          title="Send message"
        >
          ↑
        </button>
      )}
    </form>
  );
}