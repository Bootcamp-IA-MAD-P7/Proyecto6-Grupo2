import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { departmentRisks } from "@/data/dashboard"
import type { DepartmentTrend } from "@/types/dashboard"

const trendConfig: Record<
  DepartmentTrend,
  {
    icon: typeof ArrowUpRight
    variant: "danger" | "neutral" | "success"
  }
> = {
  "Al alza": { icon: ArrowUpRight, variant: "danger" },
  Estable: { icon: Minus, variant: "neutral" },
  "A la baja": { icon: ArrowDownRight, variant: "success" },
}

export function DepartmentRiskTable() {
  return (
    <Card className="min-w-0">
      <CardHeader className="pb-3">
        <h2 className="text-[0.9375rem] font-semibold text-foreground">
          Departamentos prioritarios
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Áreas con mayor concentración de riesgo
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-2 sm:px-0 sm:pb-2">
        <table className="w-full min-w-[580px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border bg-muted/50 text-xs font-medium text-muted-foreground">
              <th className="px-5 py-3 sm:px-6">Departamento</th>
              <th className="px-4 py-3 text-right">Riesgo alto</th>
              <th className="px-4 py-3 text-right">Riesgo medio</th>
              <th className="px-5 py-3 text-right sm:px-6">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {departmentRisks.map((item) => {
              const config = trendConfig[item.trend]
              const Icon = config.icon
              return (
                <tr
                  key={item.department}
                  className="border-b border-border/80 last:border-0"
                >
                  <td className="px-5 py-4 text-sm font-medium text-foreground sm:px-6">
                    {item.department}
                    <div
                      className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-muted"
                      aria-hidden="true"
                    >
                      <div
                        className="flex h-full overflow-hidden rounded-full"
                        style={{
                          width: `${((item.high + item.medium) / 108) * 100}%`,
                        }}
                      >
                        <span
                          className="h-full bg-risk-high"
                          style={{
                            width: `${(item.high / (item.high + item.medium)) * 100}%`,
                          }}
                        />
                        <span className="h-full flex-1 bg-risk-medium" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-risk-high">
                    {item.high}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-foreground">
                    {item.medium}
                  </td>
                  <td className="px-5 py-4 text-right sm:px-6">
                    <Badge variant={config.variant}>
                      <Icon className="mr-1 size-3.5" aria-hidden="true" />
                      {item.trend}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
