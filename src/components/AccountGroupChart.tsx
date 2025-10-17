"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { ChartShell } from "@/components/ChartShell";
import { apiGet } from "@/lib/api";
import type { SeriesResponse, SeriesPoint } from "@/types";

const MA_OPTIONS = [3, 6, 12];

// currency formatter (SEK compact for axis, normal for tooltip)
const fmtSEKCompact = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("sv-SE", { notation: "compact", maximumFractionDigits: 1 }).format(n)
    : "—";

const fmtSEK = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n)
    : "—";

// x-axis tick "YYYY-MM" → "MMM YYYY"
const fmtTickDate = (s: string) => {
  const d = new Date(`${s}-01T00:00:00`);
  if (Number.isNaN(+d)) return s;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};

export default function AccountGroupChart() {
  const [groups, setGroups] = useState<string[]>([]);
  const [group, setGroup] = useState<string | undefined>(undefined);
  const [windowMA, setWindowMA] = useState<number>(6);
  const [data, setData] = useState<SeriesPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1) Load account groups once
  useEffect(() => {
    (async () => {
      try {
        const json = await apiGet<{ groups: string[] }>("/account-groups");
        setGroups(json.groups || []);
        if (!group && json.groups?.length) setGroup(json.groups[0]); // pick first by default
      } catch (e) {
        console.error("Failed to load account groups", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Load series whenever (group, windowMA) changes
  useEffect(() => {
    if (group == null) return;
    (async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (group) query.set("group", group);
        query.set("window", String(windowMA));
        const json = await apiGet<SeriesResponse>(`/series/amount-by-group?${query.toString()}`);
        setData(json.series || []);
      } catch (e) {
        console.error("Failed to load series", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [group, windowMA]);

/*   const subtitle = useMemo(
    () => (group ? `Monthly amount for ${group} (MA ${windowMA})` : "Monthly amount"),
    [group, windowMA]
  ); */

  return (
    <ChartShell className="flex-1 min-h-0">
      <ChartShell.Header title="Amounts by Account Group" subtitle="Monthly amounts">
        <div className="flex items-center gap-2 min-w-0">
            {/* Group select – fixed width prevents stretch */}
            <div className="relative w-48 sm:w-64 min-w-0">
            <select
                className="block w-full h-9 rounded-lg border border-gray-300 px-2 text-sm
                        overflow-hidden text-ellipsis whitespace-nowrap"
                value={group ?? ""}
                onChange={(e) => setGroup(e.target.value || undefined)}
                title={group}  // shows full text on hover
            >
                {groups.map((g) => (
                <option key={g} value={g}>{g}</option>
                ))}
            </select>
            </div>

            {/* MA window – small fixed width */}
            <div className="relative w-36">
            <select
                className="block w-full h-9 rounded-lg border border-gray-300 px-2 text-sm"
                value={windowMA}
                onChange={(e) => setWindowMA(Number(e.target.value))}
            >
                {[3,6,12].map((n) => (
                <option key={n} value={n}>{n}-month MA</option>
                ))}
            </select>
            </div>
        </div>
      </ChartShell.Header>

      <ChartShell.Body>
        {loading ? (
          <div className="h-full bg-gray-100 rounded animate-pulse my-2" />
        ) : (
          <div className="h-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtTickDate}
                  minTickGap={24}
                />
                <YAxis
                  width={72}
                  tickFormatter={fmtSEKCompact}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [fmtSEK(Number(val)), name]}
                  labelFormatter={(label: string) =>
                    new Date(label + "-01T00:00:00").toLocaleDateString("en-GB", {
                      month: "long", year: "numeric"
                    })
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="black"
                  name="Amount"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="amountMA"
                  stroke="gray"
                  name={`${windowMA}-month MA`}
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartShell.Body>

      {/* Footer – quick presets (optional) */}
      <ChartShell.Footer>
        <div className="flex items-center justify-center gap-1">
          {["1Y","2Y","All"].map((lbl) => (
            <button
              key={lbl}
              className="px-3 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 hover:bg-white"
              onClick={() => {
                // client-side zoom/preset (optional): if you want to slice `data` locally,
                // or just ignore for now—backend already returns the full series.
              }}
            >
              {lbl}
            </button>
          ))}
        </div>
      </ChartShell.Footer>
    </ChartShell>
  );
}