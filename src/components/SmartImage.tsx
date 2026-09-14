import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SmartImageProps = {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  /** Set true only for the above-the-fold hero image. */
  priority?: boolean;
  sizes?: string;
};

/**
 * Image with a graceful fallback: if the file is missing or fails to load,
 * a labelled placeholder is shown instead of a broken-image icon.
 */
export function SmartImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} — image coming soon`}
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageOff aria-hidden="true" className="size-6" />
        <span className="label-eyebrow px-4 text-center">Image coming soon</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
