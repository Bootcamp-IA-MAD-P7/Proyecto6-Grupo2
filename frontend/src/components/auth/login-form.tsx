import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LoginTranslations } from "@/types/dashboard"

interface LoginFormProps {
  translations: LoginTranslations
  onSuccess: (rememberSession: boolean) => void
}

interface LoginFormErrors {
  email?: string
  password?: string
}

const SIGN_IN_DELAY_MS = 650
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm({ translations, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [formNotice, setFormNotice] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const signInTimerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (signInTimerRef.current !== null) {
        window.clearTimeout(signInTimerRef.current)
      }
    },
    [],
  )

  const validate = (): LoginFormErrors => {
    const nextErrors: LoginFormErrors = {}
    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      nextErrors.email = translations.form.emailRequired
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      nextErrors.email = translations.form.emailInvalid
    }

    if (!password) {
      nextErrors.password = translations.form.passwordRequired
    }

    return nextErrors
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value)
    setErrors((currentErrors) => ({
      ...currentErrors,
      email: undefined,
    }))
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value)
    setErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setFormNotice(null)
    const nextErrors = validate()
    setErrors(nextErrors)

    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }

    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }

    setIsSubmitting(true)
    signInTimerRef.current = window.setTimeout(() => {
      signInTimerRef.current = null
      setEmail("")
      setPassword("")
      onSuccess(rememberMe)
    }, SIGN_IN_DELAY_MS)
  }

  const handleDemoAccess = () => {
    setEmail("")
    setPassword("")
    setRememberMe(false)
    setPasswordVisible(false)
    setErrors({})
    setFormNotice(null)
    onSuccess(false)
  }

  const emailErrorId = errors.email ? "login-email-error" : undefined
  const passwordErrorId = errors.password
    ? "login-password-error"
    : undefined

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="pb-4">
        <h1 className="font-editorial text-3xl tracking-[-0.025em] text-foreground sm:text-4xl">
          {translations.form.title}
        </h1>
        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
          {translations.form.description}
        </p>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          aria-busy={isSubmitting}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-foreground"
            >
              {translations.form.emailLabel}
            </label>
            <div className="group relative mt-2">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                aria-hidden="true"
              />
              <input
                ref={emailRef}
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                placeholder={translations.form.emailPlaceholder}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={emailErrorId}
                disabled={isSubmitting}
                onChange={handleEmailChange}
                className={cn(
                  "h-11 w-full rounded-md border bg-background pr-3 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60",
                  errors.email ? "border-destructive" : "border-input",
                )}
              />
            </div>
            {errors.email && (
              <p
                id="login-email-error"
                className="mt-2 text-sm text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-foreground"
            >
              {translations.form.passwordLabel}
            </label>
            <div className="group relative mt-2">
              <LockKeyhole
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                aria-hidden="true"
              />
              <input
                ref={passwordRef}
                id="login-password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                placeholder={translations.form.passwordPlaceholder}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={passwordErrorId}
                disabled={isSubmitting}
                onChange={handlePasswordChange}
                className={cn(
                  "h-11 w-full rounded-md border bg-background pr-12 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60",
                  errors.password ? "border-destructive" : "border-input",
                )}
              />
              <button
                type="button"
                aria-label={
                  passwordVisible
                    ? translations.form.hidePassword
                    : translations.form.showPassword
                }
                aria-pressed={passwordVisible}
                disabled={isSubmitting}
                onClick={() => setPasswordVisible((visible) => !visible)}
                className="absolute top-1/2 right-0.5 grid size-10 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-50"
              >
                {passwordVisible ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id="login-password-error"
                className="mt-2 text-sm text-destructive"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={rememberMe}
                disabled={isSubmitting}
                onChange={(event) => setRememberMe(event.currentTarget.checked)}
                className="size-4 rounded border-input accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed"
              />
              <span>{translations.form.rememberMe}</span>
            </label>
            <button
              type="button"
              disabled={isSubmitting}
              className="text-sm font-medium text-primary hover:underline"
              onClick={() =>
                setFormNotice(translations.form.forgotPasswordUnavailable)
              }
            >
              {translations.form.forgotPassword}
            </button>
          </div>

          <div aria-live="polite" aria-atomic="true" className="min-h-5">
            {formNotice && (
              <p className="text-xs leading-5 text-muted-foreground">
                {formNotice}
              </p>
            )}
            {isSubmitting && (
              <p className="sr-only" role="status">
                {translations.form.submitting}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full shadow-sm shadow-primary/20"
            >
              {isSubmitting
                ? translations.form.submitting
                : translations.form.submit}
            </Button>
          </div>

          <section
            className="border-t border-border pt-5"
            aria-labelledby="new-to-talentcare"
          >
            <h2
              id="new-to-talentcare"
              className="text-sm font-semibold text-foreground"
            >
              {translations.form.newUserTitle}
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {translations.form.newUserDescription}
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="mt-3 h-11 w-full"
              onClick={handleDemoAccess}
            >
              {translations.form.demoAccess}
            </Button>
            <p className="mt-3 text-[0.6875rem] leading-5 text-muted-foreground">
              {translations.form.futureAvailability}
            </p>
          </section>
        </form>
      </CardContent>
    </Card>
  )
}
