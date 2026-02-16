import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronRight, ArrowRight } from "lucide-react";
import { useNews, useEvents } from "@/hooks/useContent";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function NewsEventsDynamic() {
    const { data: news = [], isLoading: newsLoading } = useNews(4);
    const { data: events = [], isLoading: eventsLoading } = useEvents(4);

    return (
        <section className="py-24 bg-white dark:bg-black/20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">News & Events</h2>
                        <p className="text-muted-foreground text-lg">Stay connected with the latest updates and championships.</p>
                    </div>
                </div>

                <Tabs defaultValue="news" className="w-full">
                    <TabsList className="mb-8 w-full md:w-auto h-auto p-1 bg-muted/50 rounded-full">
                        <TabsTrigger value="news" className="rounded-full px-6 py-3 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                            Latest News
                        </TabsTrigger>
                        <TabsTrigger value="events" className="rounded-full px-6 py-3 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                            Upcoming Events
                        </TabsTrigger>
                    </TabsList>

                    {/* LATEST NEWS TAB */}
                    <TabsContent value="news">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {newsLoading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-[400px] bg-gray-100 rounded-xl animate-pulse" />
                                ))
                            ) : news.length > 0 ? (
                                news.map((item) => (
                                    <Link key={item.id} href={`/news/${item.id}`}>
                                        <Card className="h-full hover:shadow-lg transition-all cursor-pointer overflow-hidden group border-border/50 bg-white/50 backdrop-blur-sm flex flex-col">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={item.imageUrl || "https://placehold.co/600x400/10b981/ffffff?text=News"}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 text-primary hover:bg-white/100 backdrop-blur-sm shadow-sm">
                                                        NEWS
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="flex items-center text-xs text-muted-foreground mb-2 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                                    {item.publishedAt ? format(new Date(item.publishedAt), 'MMM dd, yyyy') : 'Recent'}
                                                </div>
                                                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <p className="text-muted-foreground text-sm line-clamp-2">
                                                    {item.excerpt || item.content?.substring(0, 80) + "..."}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-12 text-muted-foreground">
                                    No news available at the moment.
                                </div>
                            )}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/news">
                                <Button variant="outline" className="rounded-full px-8">
                                    View All News
                                </Button>
                            </Link>
                        </div>
                    </TabsContent>

                    {/* UPCOMING EVENTS TAB */}
                    <TabsContent value="events">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {eventsLoading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-[400px] bg-gray-100 rounded-xl animate-pulse" />
                                ))
                            ) : events.length > 0 ? (
                                events.map((event) => (
                                    <Link key={event.id} href={`/events`}>
                                        <Card className="h-full hover:shadow-lg transition-all cursor-pointer overflow-hidden group border-border/50 bg-white/50 backdrop-blur-sm flex flex-col">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={event.imageUrl || "https://placehold.co/600x400/3b82f6/ffffff?text=Event"}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge variant="secondary" className="bg-white/90 text-blue-600 hover:bg-white/100 backdrop-blur-sm shadow-sm">
                                                        EVENT
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardHeader className="pb-2 pt-4">
                                                <div className="flex items-center text-xs text-muted-foreground mb-2 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                                                    {event.eventDate ? format(new Date(event.eventDate), 'MMM dd, yyyy') : 'Date TBD'}
                                                </div>
                                                <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {event.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <div className="flex items-start text-sm text-muted-foreground mb-2">
                                                    <MapPin className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-1">{event.venue || 'Venue TBD'}</span>
                                                </div>
                                                <p className="text-muted-foreground text-sm line-clamp-2">
                                                    {event.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-12 text-muted-foreground">
                                    No upcoming events scheduled.
                                </div>
                            )}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/events">
                                <Button variant="outline" className="rounded-full px-8">
                                    View Calendar
                                </Button>
                            </Link>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}
