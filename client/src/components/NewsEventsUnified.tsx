import React, { useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useNews, useEvents } from "@/hooks/useContent";
import { format } from "date-fns";
import { ScrollFade } from "@/components/animations/ScrollFade";

export function NewsEventsUnified() {
    // Fetch more items since it's a scrolling marquee
    const { data: news = [], isLoading: newsLoading } = useNews(10);
    const { data: events = [], isLoading: eventsLoading } = useEvents(10);

    const unifiedItems = useMemo(() => {
        // 1. Process Events
        const processedEvents = events.map(event => ({
            id: `event-${event.id}`,
            originalId: event.id,
            type: 'event',
            title: event.title,
            date: event.eventDate,
            location: event.venue,
            imageUrl: event.imageUrl,
            link: '/events', // OR /events/:id if we had individual event pages
            isFeatured: event.isFeatured
        }));

        // 2. Process News
        const processedNews = news.map(item => ({
            id: `news-${item.id}`,
            originalId: item.id,
            type: 'news',
            title: item.title,
            date: item.publishedAt,
            location: null,
            imageUrl: item.imageUrl,
            link: `/news/${item.id}`,
            isFeatured: item.isFeatured
        }));

        // 3. Merge
        const allItems = [...processedEvents, ...processedNews];

        // 4. Sort
        // Logic: Featured first, then by date (future events close to now, then recent news)
        // For simplicity: mix them. Or just sort by date descending?
        // User asked for "most important one that is feature or upcoming".

        // Let's sort by date descending (newest first) generally, but maybe put upcoming events at the top?
        // Actually, simple date sort meant for "What's New/Next" is usually best.
        // But since events are future and news is past, let's just sort by "Relevance"
        // Future Events ASC (soonest first) -> then News DESC (newest first).

        const futureEvents = processedEvents
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const pastEventsAndNews = [...processedNews, ...processedEvents.filter(e => new Date(e.date) < new Date())]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return [...futureEvents, ...pastEventsAndNews];
    }, [news, events]);

    const isLoading = newsLoading || eventsLoading;

    if (isLoading) {
        return <div className="py-20 text-center text-muted-foreground">Loading updates...</div>;
    }

    if (unifiedItems.length === 0) {
        return null; // Don't show section if empty
    }

    // Duplicate for infinite scroll if needed
    const marqueeItems = unifiedItems.length < 5
        ? [...unifiedItems, ...unifiedItems, ...unifiedItems, ...unifiedItems]
        : [...unifiedItems, ...unifiedItems];

    return (
        <section className="py-20 bg-muted/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <ScrollFade>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">News & <span className="text-primary">Events</span></h2>
                        <p className="text-muted-foreground text-lg">
                            Latest updates, upcoming championships, and highlights.
                        </p>
                    </ScrollFade>

                    <ScrollFade delay={100}>
                        <div className="flex gap-2">
                            <Link href="/news">
                                <Button variant="outline" size="sm">News</Button>
                            </Link>
                            <Link href="/events">
                                <Button variant="outline" size="sm">Events</Button>
                            </Link>
                        </div>
                    </ScrollFade>
                </div>
            </div>

            <div className="relative w-full py-4">
                {/* Gradient masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused] items-stretch pl-6">
                    {marqueeItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="w-[350px] flex-shrink-0">
                            <Link href={item.link}>
                                <Card className="h-full hover:shadow-xl transition-all cursor-pointer overflow-hidden group border-border/50 bg-card/50 backdrop-blur-sm flex flex-col hover:-translate-y-1 duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={item.imageUrl || (item.type === 'event'
                                                ? "https://placehold.co/600x400/3b82f6/ffffff?text=Event"
                                                : "https://placehold.co/600x400/10b981/ffffff?text=News")}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className={`${item.type === 'event' ? 'bg-blue-600' : 'bg-primary'} text-white shadow-sm`}>
                                                {item.type === 'event' ? 'EVENT' : 'NEWS'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2 pt-4 flex-grow">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 font-medium">
                                            <div className="flex items-center">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                                {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'Date TBD'}
                                            </div>
                                            {item.location && (
                                                <div className="flex items-center truncate max-w-[120px]" title={item.location}>
                                                    <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                                                    {item.location}
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 pb-4">
                                        <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
