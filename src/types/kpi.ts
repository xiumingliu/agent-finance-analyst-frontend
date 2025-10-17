export interface Period {
  year: number | null;
  from: string | null; // ISO date string (yyyy-mm-dd)
  to: string | null;   // ISO date string (yyyy-mm-dd)
};

export interface KpiSummary {
  currency: string;
  period: { year: number | null; from: string | null; to: string | null };
  revenue_ytd: number;
  expenses_ytd: number;
  net_result_ytd: number;
}