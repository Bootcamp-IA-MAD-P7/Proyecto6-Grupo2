import { ContextualHelp } from "@/components/ui/contextual-help"
import type { TranslationSection } from "@/types/dashboard"

interface SectionHeadingProps {
  id: string
  content: TranslationSection
  help?: {
    label: string
    content: string
  }
}

export function SectionHeading({ id, content, help }: SectionHeadingProps) {
  return (
    <header className="max-w-4xl">
      <div className="flex items-start gap-2">
        <h2
          id={id}
          className="font-editorial text-4xl leading-tight font-normal tracking-[-0.035em] text-foreground sm:text-5xl"
        >
          {content.title}
        </h2>
        {help && (
          <span className="mt-2 shrink-0">
            <ContextualHelp label={help.label} content={help.content} />
          </span>
        )}
      </div>
      <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
        {content.subtitle}
      </p>
    </header>
  )
}
