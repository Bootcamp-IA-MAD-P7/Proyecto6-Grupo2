import { CalendarDays, ClipboardCheck, Clock3, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { dashboardMeta } from "@/data/dashboard"

export function PageHeader() {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-7 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          Resumen
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Resumen ejecutivo
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          Visión general del riesgo de abandono en mujeres que ocupan puestos STEM.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="grid gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
            Periodo: {dashboardMeta.period}
          </span>
          <span className="flex items-center gap-2">
            <Clock3 className="size-4 text-primary" aria-hidden="true" />
            Actualizado: {dashboardMeta.lastUpdated}
          </span>
          <span className="flex items-center gap-2 font-medium text-foreground">
            <ClipboardCheck className="size-4 text-primary" aria-hidden="true" />
            42 revisiones pendientes
          </span>
        </div>
        <Button variant="outline">
          <Info className="size-4" aria-hidden="true" />
          Ver metodología
        </Button>
      </div>
    </div>
  )
}
