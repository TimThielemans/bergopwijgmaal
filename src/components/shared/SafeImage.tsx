import { useEffect, useState, type ReactNode } from "react";
import type { ImageRef } from "@/content/types";
import { text } from "@/lib/safe";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  image?: ImageRef | null | undefined;
  /** Branded graphic shown when there is no usable image (or it fails to load). */
  fallback: ReactNode;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * Renders an image only when it has a usable URL, and swaps to the branded
 * fallback when the asset 404s — a dead CMS asset never leaves a broken image.
 */
export function SafeImage({ image, fallback, className, loading = "lazy" }: SafeImageProps) {
  const url = text(image?.url);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (!url || failed) return <>{fallback}</>;

  return (
    <img
      src={url}
      alt={text(image?.alt)}
      {...(image?.width ? { width: image.width } : {})}
      {...(image?.height ? { height: image.height } : {})}
      loading={loading}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
