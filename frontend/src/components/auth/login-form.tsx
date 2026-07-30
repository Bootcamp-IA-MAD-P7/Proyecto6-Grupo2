import { useEffect } from "react"
import { SignIn, useAuth } from "@clerk/clerk-react"

import type { LoginTranslations } from "@/types/dashboard"

interface LoginFormProps {
  translations: LoginTranslations
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { isSignedIn } = useAuth()

  useEffect(() => {
    if (isSignedIn) onSuccess()
  }, [isSignedIn, onSuccess])

  return (
    <div className="flex justify-center">
      <SignIn routing="hash" />
    </div>
  )
}
