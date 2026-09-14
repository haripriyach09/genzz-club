import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FAQItemProps = { question: string; answer: string };

export function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className="border-b border-border">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start justify-between gap-4 py-5 text-left font-display text-base leading-snug uppercase transition-colors hover:text-accent-foreground sm:text-lg"
        >
          <span>{question}</span>
          <Plus
            aria-hidden="true"
            className={cn(
              "mt-0.5 size-5 shrink-0 transition-transform duration-300",
              open && "rotate-45",
            )}
          />
        </button>
      </h3>
      <div
        id={panelId}
        hidden={!open}
        className="pb-6 pr-8 text-sm leading-relaxed text-muted-foreground sm:text-base"
      >
        {answer}
      </div>
    </li>
  );
}
