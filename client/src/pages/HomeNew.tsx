import { Helmet } from "react-helmet-async";
import { Hero } from "@/components/Hero";
import { NewsEventsUnified } from "@/components/NewsEventsUnified";
import { UserPathways } from "@/components/UserPathways";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Trophy, ChevronRight } from "lucide-react";
import { ScrollFade } from "@/components/animations/ScrollFade";
import { DynamicGallery } from "@/components/DynamicGallery";

import { SEO } from "@/components/SEO";

export default function HomeNew() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Nigeria Rope Skipping Association | Official Governing Body"
        description="The official body for rope skipping in Nigeria. Promoting grassroots sports, Y-Court competitions, and the National Alpha League."
        isHome={true}
      />

      {/* Hero Section */}
      <Hero />

      {/* News & Events Section */}
      <ScrollFade delay={200}>
        <NewsEventsUnified />
      </ScrollFade>

      {/* User Pathways - Above Footer */}
      <ScrollFade delay={300}>
        <UserPathways />
      </ScrollFade>

      {/* Explore NRSA - Dashboard Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollFade>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore NRSA</h2>
          </ScrollFade>

          <ScrollFade delay={400}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1: Latest News */}
              <Link href="/news">
                <Card className="h-full border-2 border-transparent hover:border-primary/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">Latest News</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">
                      Stay updated with competition highlights and national announcements.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Card 2: Player Rankings */}
              <a
                href="https://skippers.nrsa.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="h-full border-2 border-transparent hover:border-primary/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">Player Rankings</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">
                      Track national rankings and performance stats across Nigeria.
                    </p>
                  </CardContent>
                </Card>
              </a>

              {/* Card 3: Upcoming Events */}
              <Link href="/events">
                <Card className="h-full border-2 border-transparent hover:border-primary/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">
                      Explore championships, camps, and national competitions.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Card 4: About NRSA */}
              <Link href="/about">
                <Card className="h-full border-2 border-transparent hover:border-primary/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ChevronRight className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">About NRSA</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">
                      Learn more about our structure, leadership, and national programs.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      <DynamicGallery />
    </div>
  );
}