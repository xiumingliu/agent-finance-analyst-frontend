"use client";

import type { KpiSummary } from "@/types";

type Props = {
  data: KpiSummary | null;       // pass the API payload or null while loading
  className?: string;            // optional extra classes for the outer grid cell
};

// tiny helper – stable currency formatting
function fmtSEK(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function KPICards({ data, className = "" }: Props) {
  return (
    <div className={`col-span-1 flex flex-col gap-4 h-full ${className}`}>
      {/* Revenue */}
      <div className="flex flex-col justify-center flex-1 min-h-0 bg-white rounded-xl p-4 shadow text-center">
        <h3 className="text-sm font-medium text-gray-600">Revenue (YTD)</h3>
        <p className="text-xl font-bold text-gray-900">
          {fmtSEK(data?.revenue_ytd)}
        </p>
      </div>

      {/* Expenses */}
      <div className="flex flex-col justify-center flex-1 min-h-0 bg-white rounded-xl p-4 shadow text-center">
        <h3 className="text-sm font-medium text-gray-600">Expenses (YTD)</h3>
        <p className="text-xl font-bold text-gray-900">
          {fmtSEK(data?.expenses_ytd)}
        </p>
      </div>

      {/* Net Result */}
      <div className="flex flex-col justify-center flex-1 min-h-0 bg-white rounded-xl p-4 shadow text-center">
        <h3 className="text-sm font-medium text-gray-600">Net Result (YTD)</h3>
        <p className="text-xl font-bold text-gray-900">
          {fmtSEK(data?.net_result_ytd)}
        </p>
      </div>
    </div>
  );
}