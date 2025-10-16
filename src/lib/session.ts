export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let v = localStorage.getItem("sie_session_id");
    if (!v) {
      v = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
      localStorage.setItem("sie_session_id", v);
    }
    return v;
  } catch {
    return (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
  }
}