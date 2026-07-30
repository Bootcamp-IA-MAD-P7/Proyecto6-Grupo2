import { useEffect, useState } from "react"

import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard"
import { AssessmentPage } from "@/pages/assessment-page"
import { LoginPage } from "@/pages/login-page"

type AppView = "login" | "dashboard" | "assessment"

const AUTH_STORAGE_KEY = "talentcare-demo-authenticated"
const DASHBOARD_HASHES = new Set([
  "#home",
  "#workforce-overview",
  "#attention-areas",
  "#preventive-actions",
  "#methodology",
])

function hasDemoSession(): boolean {
  return (
    window.localStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
    window.sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"
  )
}

function getProtectedView(): Exclude<AppView, "login"> {
  return window.location.hash === "#assessment" ? "assessment" : "dashboard"
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(hasDemoSession)
  const [view, setView] = useState<AppView>(() =>
    hasDemoSession() ? getProtectedView() : "login",
  )

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash

      if (!authenticated) {
        if (hash !== "#login") {
          window.location.replace("#login")
        }
        setView("login")
        return
      }

      if (hash === "#assessment") {
        setView("assessment")
        return
      }

      if (!DASHBOARD_HASHES.has(hash)) {
        window.location.replace("#home")
      }
      setView("dashboard")
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [authenticated])

  const handleLogin = (rememberSession: boolean) => {
    const storage = rememberSession
      ? window.localStorage
      : window.sessionStorage
    storage.setItem(AUTH_STORAGE_KEY, "true")
    setAuthenticated(true)
    setView("dashboard")
    window.location.replace("#home")
  }

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthenticated(false)
    setView("login")
    window.location.replace("#login")
  }

  if (view === "login") {
    return <LoginPage onContinue={handleLogin} />
  }

  return view === "assessment" ? (
    <AssessmentPage onLogout={handleLogout} />
  ) : (
    <ExecutiveDashboard onLogout={handleLogout} />
  )
}
