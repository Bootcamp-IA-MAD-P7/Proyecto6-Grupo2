import { CircleCheck, Cpu } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { modelStatus } from "@/data/dashboard"

const statusRows = [
  { label: "Versión", value: modelStatus.version },
  { label: "Último entrenamiento", value: modelStatus.lastTraining },
  { label: "Periodo de datos", value: modelStatus.dataPeriod },
]

export function ModelStatusCard() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="size-4.5 text-primary" aria-hidden="true" />
            <h2 className="text-[0.9375rem] font-semibold text-foreground">
              Estado del modelo
            </h2>
          </div>
          <Badge variant="success">
            <CircleCheck className="mr-1 size-3.5" aria-hidden="true" />
            {modelStatus.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="mb-1" />
        <dl>
          {statusRows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-6 border-b border-border py-3 last:border-0"
            >
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="text-right text-xs font-medium text-foreground">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
