import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { ChartCard } from "@/components/dashboard/chart-card"
import { riskDistribution } from "@/data/dashboard"

export function RiskDistribution() {
  return (
    <ChartCard
      title="Distribución actual"
      description="Nivel de riesgo sobre 1.248 empleadas"
      className="min-w-0"
    >
      <div className="relative h-48" aria-label="Distribución actual del riesgo">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistribution}
              dataKey="value"
              nameKey="level"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={3}
              isAnimationActive={false}
            >
              {riskDistribution.map((item) => (
                <Cell key={item.level} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                border: "1px solid var(--border)",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(15, 35, 60, 0.08)",
              }}
              formatter={(value) => [String(value), "Empleadas"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="text-2xl font-semibold tracking-tight">1.248</span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {riskDistribution.map((item) => (
          <li
            key={item.level}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.level}
            </span>
            <span className="font-medium text-foreground">
              {item.value.toLocaleString("es-ES")}
            </span>
            <span className="w-12 text-right text-xs text-muted-foreground">
              {item.percentage.toLocaleString("es-ES")} %
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
