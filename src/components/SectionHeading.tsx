import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Renders as h1 on pages where this is the main heading. */
  as?: "h1" | "h2";
  align?: "left" | "center";
  tone?: "default" | "ink";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "left",
  tone = "default",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "label-eyebrow mb-3 flex items-center gap-2",
            align === "center" && "justify-center",
            tone === "ink" ? "text-accent" : "text-muted-foreground",
          )}
        >
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={cn(
          "display-lg",
          tone === "ink" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "ink" ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
