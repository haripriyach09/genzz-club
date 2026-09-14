import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CategoryCardData } from "@/data/categories";

export function CategoryCard({ category }: { category: CategoryCardData }) {
  const content = (
    <>
      <span className="font-display text-xl leading-none uppercase sm:text-2xl">
        {category.label}
      </span>
      <span className="mt-1 block text-sm text-muted-foreground group-hover:text-ink-muted">
        {category.blurb}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="mt-6 size-5 transition-transform duration-300 group-hover:translate-x-1"
      />
    </>
  );

  const className =
    "group flex h-full min-h-40 flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-ink-foreground";

  if (category.to === "/bulk-orders") {
    return (
      <Link to="/bulk-orders" className={className}>
        {content}
      </Link>
    );
  }

  return (
    <Link
      to="/shop"
      search={category.filter ? { c: category.filter } : {}}
      className={className}
    >
      {content}
    </Link>
  );
}
