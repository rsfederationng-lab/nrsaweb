import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { Media } from "@/types/schema";
import { ScrollFade } from "@/components/animations/ScrollFade";
import { ImageIcon } from "lucide-react";

export function DynamicGallery() {
    const { data: mediaItems = [], isLoading } = useQuery<Media[]>({
        queryKey: ["/api/media"],
    });

    // Filter for photos only (isExternal is false)
    const photos = mediaItems.filter((item) => !item.isExternal);

    // If no photos and not loading, show empty state or hide
    if (!isLoading && photos.length === 0) {
        return (
            <section className="py-20 bg-background overflow-hidden border-t border-border/50">
                <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our <span className="text-primary">Gallery</span>
                    </h2>
                    <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/30">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">
                            No photos available yet. Check back soon!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // We duplicate the items to create the infinite scroll effect
    // If we have very few items (e.g. 1 or 2), we might need to duplicate them more times to fill the width
    const marqueeItems = photos.length < 5
        ? [...photos, ...photos, ...photos, ...photos]
        : [...photos, ...photos];

    return (
        <section className="py-20 bg-background overflow-hidden border-t border-border/50">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 text-center">
                <ScrollFade>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our <span className="text-primary">Gallery</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Moments from our recent championships, training camps, and community outreach programs.
                    </p>
                </ScrollFade>
            </div>

            <div className="relative w-full py-8 bg-muted/20">
                {/* Gradient masks for smooth fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused] items-center">
                    {marqueeItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex-shrink-0">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="h-48 w-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300 bg-muted"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
