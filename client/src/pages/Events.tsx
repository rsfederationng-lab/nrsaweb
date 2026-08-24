import React from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/types/schema";

export default function Events() {
  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  console.log('🔍 [EVENTS FRONTEND] Render state:', { eventsCount: events.length, isLoading, error });
  console.log('🔍 [EVENTS FRONTEND] Events data:', events);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Upcoming Events"
        description="Stay up to date with NRSA events — national championships, regional competitions, training workshops, and rope skipping festivals across Nigeria."
        path="/events"
        breadcrumbs={[{ name: "Events", url: "/events" }]}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Discover championships, training camps, and rope skipping events happening across Nigeria.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">Failed to load events. Please try again later.</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No upcoming events at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const eventDate = new Date(event.eventDate);
                const isValidDate = !isNaN(eventDate.getTime());

                return (
                  <Card
                    key={event.id}
                    className={`hover-elevate active-elevate-2 transition-all h-full flex flex-col ${event.isFeatured ? "md:col-span-2 border-primary/40" : ""
                      }`}
                    data-testid={`card-event-${event.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-lg flex flex-col items-center justify-center text-white">
                          <div className="text-2xl font-bold">{isValidDate ? format(eventDate, "dd") : "--"}</div>
                          <div className="text-xs uppercase">{isValidDate ? format(eventDate, "MMM") : "---"}</div>
                        </div>
                        <div className="flex-grow">
                          {event.isFeatured && (
                            <Badge className="bg-primary text-primary-foreground mb-2">Featured Event</Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-2xl leading-tight">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <p className="text-muted-foreground leading-relaxed">{event.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{event.venue}, {event.city}, {event.state}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{isValidDate ? format(eventDate, "EEEE, MMMM dd, yyyy") : "Date TBD"}</span>
                        </div>
                        {event.registrationDeadline && (
                          <div className="flex items-center gap-2 text-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>Registration closes: {(() => {
                              const regDate = new Date(event.registrationDeadline);
                              return !isNaN(regDate.getTime()) ? format(regDate, "MMM dd, yyyy") : "TBD";
                            })()}</span>
                          </div>
                        )}
                      </div>

                      {(event as any).registrationLink && (
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          data-testid={`button-register-${event.id}`}
                          onClick={() => window.open((event as any).registrationLink, '_blank')}
                        >
                          Register Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
