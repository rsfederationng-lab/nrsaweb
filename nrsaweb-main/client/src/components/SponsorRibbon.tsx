import React from "react";

// Placeholder logos - replacing with text for now if images aren't available, 
// or using simple placeholders.
const partners = [
    { name: "NRSA", logo: "/nrsf-logo.png" },
    { name: "IJRU", logo: "/ijru.webp" },
    { name: "IRSO", logo: "/irso.png" },
    // Duplicate for seamless loop effect since we only have 3
    { name: "NRSA", logo: "/nrsf-logo.png" },
    { name: "IJRU", logo: "/ijru.webp" },
    { name: "IRSO", logo: "/irso.png" },
];

export function SponsorRibbon() {
    return (
        <div className="w-full bg-gray-100 border-y border-gray-200 overflow-hidden py-6">
            <div className="relative w-full overflow-hidden">
                <div className="flex w-max animate-scroll">
                    {/* First set of logos */}
                    <div className="flex items-center gap-16 px-8">
                        {partners.map((partner, index) => (
                            <div
                                key={`p1-${index}`}
                                className="group relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                            >
                                {/* Using text fallback or actual logo image */}
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="h-10 md:h-12 w-auto object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Duplicate set for seamless loop */}
                    <div className="flex items-center gap-16 px-8">
                        {partners.map((partner, index) => (
                            <div
                                key={`p2-${index}`}
                                className="group relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                            >
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="h-10 md:h-12 w-auto object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
