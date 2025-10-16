export interface TimePoint {
  date: string;     // "YYYY-MM" (or "YYYY-MM-DD" if you switch to daily)
  amount: number;
  amountMA: number;
}

export interface SeriesMeta {
  group: string | null;
  window: number;   // MA window (months)
}

export interface SeriesResponse {
  series: TimePoint[];
  meta: SeriesMeta;
}