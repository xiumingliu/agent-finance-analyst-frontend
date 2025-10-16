"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Header from "@/components/Header";
import KPICards from "@/components/KPICards";
import { ChartShell } from "@/components/ChartShell";

import type { ChatMessage, ChatResponse, KpiSummary } from "@/types";
import { apiGet, apiPost } from "@/lib/api";
import { getSessionId } from "@/lib/session";

// Placeholder chat container (no scrolling, no "thinking" state)
function ChatContainerPlaceholder({
  messages,
  isThinking,
}: {
  messages: ChatMessage[];
  isThinking: boolean;
}) {
  return (
    <div className="flex-1 overflow-auto pr-2">
      {messages.map((m, i) => (
        <div key={i} className={`mb-3 ${m.sender === "user" ? "text-right" : "text-left"}`}>
          <div
            className={`inline-block px-3 py-2 rounded-xl ${
              m.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            <pre className="whitespace-pre-wrap">{m.text}</pre>
            {m.plot && (
              <img
                src={`data:image/png;base64,${m.plot}`}
                alt="plot"
                className="mt-2 rounded"
              />
            )}
          </div>
        </div>
      ))}
      {isThinking && <div className="text-sm text-gray-500">Thinking…</div>}
    </div>
  );
}

function ChatInputPlaceholder({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [val, setVal] = useState<string>("");
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const t = val.trim();
        if (t) onSend(t);
        setVal("");
      }}
    >
      <input
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Ask about transactions, KPIs, charts…"
      />
      <button className="px-4 py-2 rounded-lg bg-black text-white">Send</button>
    </form>
  );
}

export default function Page() {
  const sessionId = getSessionId();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hi! I am your Finance Analyst.\n\nHow can I help?" },
  ]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [kpiData, setKpiData] = useState<KpiSummary | null>(null);

  // Load KPIs
  useEffect(() => {
    (async () => {
      try {
        const json = await apiGet<KpiSummary>("/kpi/summary");
        setKpiData(json);
      } catch (e) {
        console.error("Failed to fetch KPI data:", e);
      }
    })();
  }, []);

  // Send a chat message
  async function handleSendMessage(text: string) {
    const userMessage: ChatMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const data = await apiPost<ChatResponse>("/chat", {
        session_id: sessionId,
        messages: [{ sender: "user", text }],
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply, plot: data.plot ?? null },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Backend error." },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="min-h-dvh grid grid-rows-[auto,1fr]"> {/* 🔧 grid (not gird) and 2 rows */}

      {/* Header */}
      <Header className="row-start-1 row-end-2 shadow" />

      {/* Main layout (fills remaining height) */}
      <div className="row-start-2 row-end-3 overflow-hidden p-4">
        {/* 🔧 Make this a flex row that fills the width/height */}
        <div className="h-full w-full flex gap-6 min-h-0">

          {/* Dashboard Area */}
          <section className="w-[68%] bg-white rounded-2xl shadow p-4 border border-gray-300 flex flex-col min-h-0"> 
            <div className="grid grid-cols-5 gap-4 flex-1 min-h-0">

              {/* KPI Cards */}
              <KPICards data={kpiData} />

              {/* Chart Shell */}
              <div className="col-span-4 flex flex-col gap-4 min-h-0">

                <ChartShell className="flex-1 min-h-0">
                  <ChartShell.Header
                    title="Chart title"
                    subtitle="Chart subtitle or description"
                    // Right-side controls could go here
                  />
                
                  <ChartShell.Body>
                    {/* Replace with Recharts later */}
                    <div className="h-full bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500">
                      Chart goes here
                    </div>
                  </ChartShell.Body>

                  <ChartShell.Footer>
                    <div className="text-xs text-gray-500">
                      Footer info or controls could go here
                    </div>
                  </ChartShell.Footer>
                </ChartShell>

              </div>
            </div>
          </section>

          {/* Chat Area */}
          <aside className="flex-1 bg-white rounded-2xl shadow p-4 border border-gray-300 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 overflow-auto">
              <ChatContainerPlaceholder messages={messages} isThinking={isThinking} />
            </div>
            <ChatInputPlaceholder onSend={handleSendMessage} />
          </aside>

        </div>
      </div>
    </div>
  );
}
