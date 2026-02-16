export const dynamic = 'force-dynamic';
import React from "react";

// Force cache bust - update this timestamp when deploying
const BUILD_TIMESTAMP = Date.now();
import { HeroCarousel } from "@/components/HeroCarousel";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Trophy, ChevronRight } from "lucide-react";

import { ScrollFade } from "@/components/animations/ScrollFade";

export default function Home() {
  // Force immediate render with timestamp
  const forceUpdate = Date.now();

  const MarqueeContent = () => (
    <>
      <Link href="/news" className="w-[300px] flex-shrink-0 cursor-pointer block">
        <Card className="hover-elevate active-elevate-2 transition-all h-full">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Latest News</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay updated with competition highlights and national announcements.
            </p>
          </CardContent>
        </Card>
      </Link>

      <a
        href="https://skippers.nrsa.com.ng"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-[300px] flex-shrink-0 cursor-pointer"
      >
        <Card className="hover-elevate active-elevate-2 transition-all h-full">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Player Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track national rankings and performance stats across Nigeria.
            </p>
          </CardContent>
        </Card>
      </a>

      <Link href="/events" className="w-[300px] flex-shrink-0 cursor-pointer block">
        <Card className="hover-elevate active-elevate-2 transition-all h-full">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Explore championships, camps, and national competitions.
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/about" className="w-[300px] flex-shrink-0 cursor-pointer block">
        <Card className="hover-elevate active-elevate-2 transition-all h-full">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ChevronRight className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">About NRSA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Learn more about our structure, leadership, and national programs.
            </p>
          </CardContent>
        </Card>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Carousel - Already has internal transitions */}
      <HeroCarousel />

      {/* About Section */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

            {/* Text Content */}
            <ScrollFade className="lg:col-span-3">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About the <span className="text-primary">Association</span>
              </h2>

              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <ScrollFade delay={100}>
                  <h3 className="text-2xl font-semibold text-primary mb-3">Our Mission</h3>
                  <p className="text-lg">
                    To promote, develop, and regulate rope skipping across Nigeria, fostering athletic
                    excellence and providing opportunities for all Nigerians to participate in this dynamic sport.
                  </p>
                </ScrollFade>

                <ScrollFade delay={200}>
                  <h3 className="text-2xl font-semibold text-primary mb-3">Our Vision</h3>
                  <p className="text-lg">
                    To establish Nigeria as a leading force in international rope skipping, producing world-class
                    athletes and hosting premier competitions that showcase Nigerian talent.
                  </p>
                </ScrollFade>

                <ScrollFade delay={300}>
                  <h3 className="text-2xl font-semibold text-primary mb-3">Our History</h3>
                  <p className="text-lg">
                    Established as Nigeria's official governing body for rope skipping, NRSA has been instrumental
                    in developing the sport from grassroots to elite levels across all 36 states.
                  </p>
                </ScrollFade>
              </div>

              <ScrollFade delay={400}>
                <Link href="/about">
                  <Button className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                    Learn More <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </ScrollFade>
            </ScrollFade>

            {/* Affiliations */}
            <ScrollFade className="lg:col-span-2" delay={500}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary text-center">International Affiliations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">

                  {/* IJRU */}
                  <div className="text-center">
                    <div className="inline-block px-6 py-3 bg-primary/10 rounded-lg mb-4">
                      <div className="text-3xl font-bold text-primary">IJRU</div>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">International Jump Rope Union</h4>
                    <p className="text-sm text-muted-foreground">
                      Global governing body setting international standards for rope skipping.
                    </p>
                    <a
                      href="https://ijru.sport"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-primary text-sm hover:underline"
                    >
                      Visit IJRU.sport →
                    </a>
                  </div>

                  {/* IRSO */}
                  <div className="border-t pt-6 text-center">
                    <div className="inline-block px-6 py-3 bg-primary/10 rounded-lg mb-4">
                      <div className="text-3xl font-bold text-primary">IRSO</div>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">International Rope Skipping Organization</h4>
                    <p className="text-sm text-muted-foreground">
                      Promoting rope skipping as a competitive global sport.
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                      ✓ Proud Member
                    </span>
                  </div>

                </CardContent>
              </Card>
            </ScrollFade>
          </div>
        </div>
      </section>

      {/* Quick Links / Explore NRSA - Marquee */}
      <section className="py-16 bg-muted/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollFade>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore NRSA</h2>
            {/* Cache bust indicator - remove after confirming */}
            <div className="text-center mb-4 text-xs text-muted-foreground">
              🔥 NEW VERSION LOADED: {forceUpdate} 🔥
            </div>
          </ScrollFade>

          <ScrollFade delay={200}>
            {/* Marquee Wrapper */}
            <div className="relative w-full">
              {/* Gradient masks for seamless look */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

              <div className="overflow-hidden w-full py-4">
                <div className="flex gap-8 w-max animate-scroll hover:[animation-play-state:paused] group">
                  {/* Original Content */}
                  <div className="flex gap-8">
                    <MarqueeContent />
                  </div>
                  {/* Duplicate Content for seamless loop */}
                  <div className="flex gap-8" aria-hidden="true">
                    <MarqueeContent />
                  </div>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background overflow-hidden border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 text-center">
          <ScrollFade>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-primary">Gallery</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Moments from our recent championships, training camps, and community outreach programs across Nigeria.
            </p>
          </ScrollFade>
        </div>

        <div className="relative w-full py-8 bg-muted/20">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused] items-center">
            {/* Gallery Images - Set 1 */}
            <div className="flex gap-6 items-center">
              <img src="/nrsf-logo.png" alt="NRSA" className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
              <img src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=400&auto=format&fit=crop" alt="Rope Skipping 1" className="h-48 w-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
              <img src="/ijru.webp" alt="IJRU" className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop" alt="Rope Skipping 2" className="h-48 w-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
              <img src="/irso.png" alt="IRSO" className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
              <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop" alt="Training" className="h-48 w-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
            </div>

            {/* Gallery Images - Set 2 (Duplicate for loop) */}
            <div className="flex gap-6 items-center" aria-hidden="true">
              <img src="/nrsf-logo.png" alt="NRSA" className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
              <img src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=400&auto=format&fit=crop" alt="Rope Skipping 1" className="h-48 w-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
              <img src="/ijru.webp" alt="IJRU" className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop" alt="Rope Skipping 2" className="h-48 w-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
              <img src="/irso.png" alt="IRSO" className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
              <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop" alt="Training" className="h-48 w-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}