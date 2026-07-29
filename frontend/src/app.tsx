import { useEffect, useState } from "react"

import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard"
import { AssessmentPage } from "@/pages/assessment-page"

type AppView = "dashboard" | "assessment"

function getCurrentView(): AppView {
  return window.location.hash === "#assessment" ? "assessment" : "dashboard"
}

export default function App() {
  const [view, setView] = useState<AppView>(getCurrentView)

  useEffect(() => {
    const handleHashChange = () => setView(getCurrentView())
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return view === "assessment" ? <AssessmentPage /> : <ExecutiveDashboard />
}
