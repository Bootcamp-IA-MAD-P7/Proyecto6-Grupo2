import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"

interface TopbarProps {
  onOpenMenu: () => void
}

export function Topbar({ onOpenMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-border/80 bg-card/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </Button>
        <div>
          <p className="text-sm font-medium text-foreground">Panel ejecutivo</p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Retención de talento STEM
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">Equipo de Personas</p>
          <p className="text-xs text-muted-foreground">Responsable de RR. HH.</p>
        </div>
        <div
          className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground"
          aria-label="Perfil del equipo de Recursos Humanos"
        >
          RR
        </div>
      </div>
    </header>
  )
}
