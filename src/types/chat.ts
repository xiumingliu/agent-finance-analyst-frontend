// Chat turn coming from/going to your UI
export type Sender = "user" | "ai" | "bot";

export interface ChatMessage {
  sender: Sender;
  text: string;
  plot?: string | null; // base64 plot from backend (optional)
}

// What your FastAPI /chat expects
export interface ChatRequest {
  session_id?: string;
  messages: Array<{
    sender: "user" | "ai"; // backend expects "user" or "ai"
    text: string;
  }>;
}

// What FastAPI /chat returns
export interface ChatResponse {
  reply: string;
  plot?: string | null;
}