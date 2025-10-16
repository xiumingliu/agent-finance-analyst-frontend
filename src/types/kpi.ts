export interface Period {
  year: number | null;
  from: string | null; // ISO date string (yyyy-mm-dd)
  to: string | null;   // ISO date string (yyyy-mm-dd)
}

export interface KpiSummary {
  currency: string; // "SEK" (or from SIE #VALUTA)
  period: Period;
  revenue_ytd: number;
  expenses_ytd: number;
  net_result_ytd: number;
  // Optional diagnostics your endpoint might include:
  diagnostic?: unknown;
}