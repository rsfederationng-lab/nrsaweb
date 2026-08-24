import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { Affiliation } from "@/types/schema";
import { ScrollFade } from "@/components/animations/ScrollFade";

export function PartnersMarquee() {
    const { data: rawAffiliations = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/affiliations"],
    });

    // Normalize data to handle snake_case (from DB) or camelCase (from API if updated)
    const affiliations: Affiliation[] = rawAffiliations.map(a => ({
        id: a.id,
        name: a.name,
        logoUrl: a.logoUrl || a.logo_url || "",
        website: a.website,
        description: a.description,
        order: a.order || 0,
        createdAt: a.createdAt || a.created_at || new Date(),
    }));

    // Filter out any that might be hidden or invalid if necessary
    // For now, assume all returned are valid to display
    const validAffiliations = affiliations.filter(a => a.logoUrl);

    if (isLoading) {
        return <div className="py-12 text-center text-muted-foreground animate-pulse">Loading partners...</div>;
    }

    // If no partners, we can either hide the section or show a "Become a Partner" placeholder
    if (validAffiliations.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">We are proud to partner with leading organizations.</p>
                <div className="text-sm text-primary font-medium">Be the first to join our network!</div>
            </div>
        );
    }

    // Duplicate items for infinite scroll effect
    // If we have very few items, duplicate more to ensure smooth scroll
    const marqueeItems = validAffiliations.length < 5
        ? [...validAffiliations, ...validAffiliations, ...validAffiliations, ...validAffiliations]
        : [...validAffiliations, ...validAffiliations];

    return (
        <div className="relative w-full overflow-hidden bg-white py-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 text-center">
                {/* Optional header if needed, but page usually has one */}
            </div>

            <div className="relative w-full">
                {/* Gradient masks for smooth fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex gap-12 w-max animate-scroll hover:[animation-play-state:paused] items-center">
                    {marqueeItems.map((partner, index) => (
                        <div key={`${partner.id}-${index}`} className="flex-shrink-0 mx-8">
                            {partner.website ? (
                                <a
                                    href={partner.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block transition-transform duration-300 hover:scale-110"
                                >
                                    <img
                                        src={partner.logoUrl}
                                        alt={partner.name}
                                        className="h-24 w-auto object-contain max-w-[200px]"
                                    />
                                </a>
                            ) : (
                                <div className="block cursor-default">
                                    <img
                                        src={partner.logoUrl}
                                        alt={partner.name}
                                        className="h-24 w-auto object-contain max-w-[200px]"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
