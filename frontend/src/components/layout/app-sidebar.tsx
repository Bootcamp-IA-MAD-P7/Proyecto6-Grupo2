import {
  FileText,
  HeartHandshake,
  LayoutDashboard,
  UsersRound,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  { label: "Resumen", icon: LayoutDashboard, active: true },
  { label: "Empleados", icon: UsersRound, active: false },
  { label: "Informes", icon: FileText, active: false },
]

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar navegación"
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navegación principal"
      >
        <div className="flex h-18 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-white/10">
              <HeartHandshake className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight">TalentCare</p>
              <p className="text-xs text-sidebar-muted">People Analytics</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-muted hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-sidebar-muted uppercase">
            Navegación
          </p>
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    disabled={!item.active}
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      item.active
                        ? "bg-white/12 text-white"
                        : "cursor-not-allowed text-sidebar-muted",
                    )}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                    <span>{item.label}</span>
                    {!item.active && (
                      <Badge className="ml-auto bg-white/8 px-2 py-0.5 text-[0.625rem] text-sidebar-muted">
                        Próximo
                      </Badge>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-5">
          <p className="text-xs leading-5 text-sidebar-muted">
            Información de apoyo para decisiones responsables de RR. HH.
          </p>
        </div>
      </aside>
    </>
  )
}
