export type SeriesPoint = {
  date: string;      // "YYYY-MM"
  amount: number;
  amountMA: number;
};

export type SeriesResponse = {
  series: SeriesPoint[];
  meta: { group: string | null; window: number };
};