import { ShieldCheck } from "lucide-react"

export function ResponsibleUseNotice() {
  return (
    <aside className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-4 sm:px-5">
      <ShieldCheck
        className="mt-0.5 size-4.5 shrink-0 text-primary"
        aria-hidden="true"
      />
      <p className="text-xs leading-5 text-muted-foreground">
        TalentCare ofrece información de apoyo para la toma de decisiones. Las
        predicciones deben ser revisadas por profesionales autorizados de RR. HH.
        y no deben utilizarse como única base para decisiones laborales.
      </p>
    </aside>
  )
}
