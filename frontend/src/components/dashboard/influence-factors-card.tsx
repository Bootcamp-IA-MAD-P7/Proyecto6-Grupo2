import { ChartNoAxesColumnIncreasing } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { influenceFactors } from "@/data/dashboard"

export function InfluenceFactorsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-analytics-soft text-analytics">
            <ChartNoAxesColumnIncreasing className="size-4" aria-hidden="true" />
          </span>
          <h2 className="text-[0.9375rem] font-semibold text-foreground">
            Factores con mayor influencia
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Importancia relativa estimada por el modelo.
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-5">
          {influenceFactors.map((factor) => (
            <li key={factor.label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="text-foreground">{factor.label}</span>
                <span className="font-semibold text-foreground">
                  {factor.value}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-valuenow={factor.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${factor.label}: ${factor.value} sobre 100`}
              >
                <div
                  className="h-full rounded-full bg-analytics"
                  style={{ width: `${factor.value}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
