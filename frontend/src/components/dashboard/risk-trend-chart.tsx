import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { ChartCard } from "@/components/dashboard/chart-card"
import { riskTrend } from "@/data/dashboard"

export function RiskTrendChart() {
  return (
    <ChartCard
      title="Evolución del riesgo"
      description="Evolución mensual de los niveles alto y medio"
      className="min-w-0"
    >
      <div className="h-72 w-full" aria-label="Gráfico de evolución del riesgo">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={riskTrend}
            margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              domain={[80, 300]}
              ticks={[100, 150, 200, 250, 300]}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              contentStyle={{
                border: "1px solid var(--border)",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(15, 35, 60, 0.08)",
                color: "var(--foreground)",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 6 }}
              formatter={(value, name) => [
                String(value),
                name === "high" ? "Riesgo alto" : "Riesgo medio",
              ]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 20, fontSize: 12 }}
              formatter={(value) =>
                value === "high" ? "Riesgo alto" : "Riesgo medio"
              }
            />
            <Line
              type="monotone"
              dataKey="medium"
              stroke="var(--risk-medium)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                stroke: "var(--card)",
                strokeWidth: 2,
                fill: "var(--risk-medium)",
              }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="high"
              stroke="var(--risk-high)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                stroke: "var(--card)",
                strokeWidth: 2,
                fill: "var(--risk-high)",
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
