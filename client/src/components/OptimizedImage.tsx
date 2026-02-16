import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export function OptimizedImage({
    src,
    alt,
    className,
    fallbackSrc = "https://placehold.co/400x400/e2e8f0/1e293b?text=Image",
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {!isLoaded && (
                <Skeleton
                    className="absolute inset-0 w-full h-full bg-muted animate-pulse"
                    aria-label="Loading image..."
                />
            )}
            <img
                src={error ? fallbackSrc : src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={cn(
                    "transition-opacity duration-500 will-change-opacity",
                    !isLoaded ? "opacity-0" : "opacity-100",
                    className
                )}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setError(true);
                    setIsLoaded(true);
                }}
                {...props}
            />
        </div>
    );
}
