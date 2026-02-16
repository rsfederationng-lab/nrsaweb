import React from "react";
import { useState, useEffect } from "react";

// Import all 11 competition photos
import photo1 from "@assets/photo_2025-10-24_14-56-46_1761314282906.jpg";
import photo2 from "@assets/photo_2025-10-24_14-56-57_1761314282907.jpg";
import photo3 from "@assets/photo_2025-10-24_14-57-02_1761314282907.jpg";
import photo4 from "@assets/photo_2025-10-24_14-57-06_1761314282908.jpg";
import photo5 from "@assets/photo_2025-10-24_14-57-11_1761314282909.jpg";
import photo6 from "@assets/photo_2025-10-24_14-57-15_1761314282910.jpg";
import photo7 from "@assets/photo_2025-10-24_14-57-19_1761314282910.jpg";
import photo8 from "@assets/photo_2025-10-24_14-57-25_1761314282902.jpg";
import photo9 from "@assets/photo_2025-10-24_14-57-29_1761314282903.jpg";
import photo10 from "@assets/photo_2025-10-24_14-57-33_1761314282904.jpg";
import photo11 from "@assets/photo_2025-10-24_14-57-38_1761314282905.jpg";

const defaultSlides = [
  { imageUrl: photo1, headline: "Welcome to Nigeria Rope Skipping Association", subheadline: "Official Governing Body for Rope Skipping in Nigeria" },
  { imageUrl: photo2, headline: "Join NRSA Today", subheadline: "Be Part of Nigeria's Fastest-Growing Sport" },
  { imageUrl: photo3, headline: "National Rope Skipping Championships", subheadline: "Where Champions Are Made" },
  { imageUrl: photo4, headline: "Excellence in Rope Skipping", subheadline: "Training the Next Generation" },
  { imageUrl: photo5, headline: "Affiliated with IJRU & IRSO", subheadline: "International Standards, Nigerian Excellence" },
  { imageUrl: photo6, headline: "Competitive Excellence", subheadline: "Showcasing Nigeria's Best Athletes" },
  { imageUrl: photo7, headline: "Building Champions", subheadline: "From Grassroots to Glory" },
  { imageUrl: photo8, headline: "Team Nigeria", subheadline: "United in Sport, United in Purpose" },
  { imageUrl: photo9, headline: "Athletic Achievement", subheadline: "Setting New Standards in Rope Skipping" },
  { imageUrl: photo10, headline: "Youth Development", subheadline: "Inspiring the Next Generation of Champions" },
  { imageUrl: photo11, headline: "National Pride", subheadline: "Representing Nigeria on the Global Stage" },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = defaultSlides;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, [slides.length]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative w-full h-full">
            <img src={slide.imageUrl} alt={slide.headline} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-white font-bold text-4xl md:text-6xl mb-4 drop-shadow-lg">{slide.headline}</h1>
              {slide.subheadline && (
                <p className="text-white text-lg md:text-2xl drop-shadow-lg">{slide.subheadline}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
