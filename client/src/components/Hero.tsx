import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { CountUp } from "@/components/ui/count-up";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSiteSetting } from "@/hooks/use-site-settings";

// Import competition photos for slideshow
import photo2 from "@assets/photo_2025-10-24_14-56-57_1761314282907.jpg";
import photo3 from "@assets/photo_2025-10-24_14-57-02_1761314282907.jpg";
import photo4 from "@assets/photo_2025-10-24_14-57-06_1761314282908.jpg";
import photo5 from "@assets/photo_2025-10-24_14-57-11_1761314282909.jpg";

const heroImages = [photo2, photo3, photo4, photo5];




export function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const heroMainBg = useSiteSetting("hero_main_bg");

  // Auto-slide effect
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-black bg-cover bg-center"
      style={{ backgroundImage: heroMainBg ? `url(${heroMainBg})` : undefined }}
    >
      {/* Background Carousel */}
      <Carousel
        setApi={setApi}
        opts={{ loop: true, duration: 60 }}
        className="absolute inset-0 z-0 w-full h-full"
      >
        <CarouselContent className="h-full ml-0"> {/* ml-0 to override default -ml-4 */}
          {heroImages.map((img, index) => (
            <CarouselItem key={index} className="pl-0 h-full basis-full"> {/* pl-0 to override default pl-4 */}
              <div className="relative w-full h-full">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 text-center md:text-left pt-20">

        {/* Badge / Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium tracking-wide uppercase">Official Federation</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-2xl max-w-5xl">
          The Home of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">World Record Holders</span> & National Champions
        </h1>

        {/* Subtext - Updated */}
        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mb-10 leading-relaxed font-light">
          Promoting excellence and elevating Nigerian rope skipping from the streets to the global stage.
        </p>

        {/* Interactive Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-7 text-lg font-semibold rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
            >
              Join the Movement
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/partnership">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-7 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300"
            >
              Partner with Us
            </Button>
          </Link>
        </div>

        {/* Stats / Trust Indicators */}
        <div className="mt-16 grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-8 border-t border-white/10 pt-8 text-white/80">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help transition-opacity hover:opacity-80">
                <p className="text-3xl font-bold text-white"><CountUp end={36} duration={2000} /></p>
                <p className="text-sm uppercase tracking-wider text-gray-400">States Active</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Active clubs in every state including FCT</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help transition-opacity hover:opacity-80">
                <p className="text-3xl font-bold text-white"><CountUp end={10} duration={2000} suffix="+" /></p>
                <p className="text-sm uppercase tracking-wider text-gray-400">Intl. Medals</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Gold, Silver, and Bronze at International Championships</p>
            </TooltipContent>
          </Tooltip>

          <div>
            <p className="text-3xl font-bold text-white"><CountUp end={5} duration={2000} suffix="k+" /></p>
            <p className="text-sm uppercase tracking-wider text-gray-400">Athletes</p>
          </div>
        </div>

      </div>
    </div>
  );
}

