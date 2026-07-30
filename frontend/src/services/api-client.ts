import { useAuth } from "@clerk/clerk-react"

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "https://talentcare-back.onrender.com"

export function useApiClient() {
  const { getToken } = useAuth()

  async function apiFetch(path: string, options: RequestInit = {}) {
    const token = await getToken()
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json() as Promise<unknown>
  }

  return { apiFetch }
}
