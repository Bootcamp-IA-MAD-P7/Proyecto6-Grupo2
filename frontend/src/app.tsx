import { useEffect, useState } from "react"

import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard"
import { AssessmentPage } from "@/pages/assessment-page"
import { EnsembleClientPage } from "@/pages/ensemble-client-page"
import { LoginPage } from "@/pages/login-page"

type AppView = "login" | "dashboard" | "assessment" | "ensemble-client"

function getCurrentView(): AppView {
  if (window.location.hash === "#ensemble-client") {
    return "ensemble-client"
  }

  if (window.location.hash === "#assessment") {
    return "assessment"
  }

  if (!window.location.hash || window.location.hash === "#login") {
    return "login"
  }

  return "dashboard"
}

export default function App() {
  const [view, setView] = useState<AppView>(getCurrentView)

  useEffect(() => {
    const handleHashChange = () => setView(getCurrentView())
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  if (view === "login") {
    return <LoginPage onContinue={() => (window.location.hash = "home")} />
  }

  if (view === "ensemble-client") {
    return <EnsembleClientPage />
  }

  return view === "assessment" ? <AssessmentPage /> : <ExecutiveDashboard />
}
