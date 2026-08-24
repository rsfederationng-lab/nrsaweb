import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronRight, ArrowRight } from "lucide-react";

export function NewsEvents() {
    return (
        <section className="py-24 bg-white dark:bg-black/20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">News & Events</h2>
                        <p className="text-muted-foreground text-lg">Stay connected with the latest updates and championships.</p>
                    </div>
                    <Link href="/news">
                        <Button variant="ghost" className="text-primary hover:text-primary/80 group">
                            View All News <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Latest News (2/3 Width) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* News Card 1 */}
                        <Link href="/news/national-championship-2025">
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src="https://placehold.co/600x400/10b981/ffffff?text=Championship"
                                        alt="National Championship"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                                        COMPETITION
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                                        <Calendar className="w-3 h-3 mr-1" /> Oct 24, 2025
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                        NRSA National Rope Skipping Championship 2025 Announced
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        The biggest rope skipping event in Nigeria is back! Athletes from 36 states will converge in Abuja to compete for national glory and international qualification.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <span className="text-sm font-semibold text-primary flex items-center">
                                        Read Article <ChevronRight className="w-4 h-4 ml-1" />
                                    </span>
                                </CardFooter>
                            </Card>
                        </Link>

                        {/* News Card 2 */}
                        <Link href="/news/world-record-broken">
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src="https://placehold.co/600x400/3b82f6/ffffff?text=World+Record"
                                        alt="World Record"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                        ACHIEVEMENT
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                                        <Calendar className="w-3 h-3 mr-1" /> Sep 15, 2025
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                                        Gbenga Ezekiel Breaks Another Guinness World Record
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        Nigeria's own Gbenga Ezekiel has shattered the record for "Most Skips in One Minute on One Leg", further solidifying his status as a global icon.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <span className="text-sm font-semibold text-blue-600 flex items-center">
                                        Read Article <ChevronRight className="w-4 h-4 ml-1" />
                                    </span>
                                </CardFooter>
                            </Card>
                        </Link>

                    </div>

                    {/* RIGHT COLUMN: Featured Event (1/3 Width) */}
                    <div className="lg:col-span-1">
                        <Card className="h-full bg-black text-white border-none overflow-hidden relative">
                            {/* Background Image / Overlay */}
                            <div className="absolute inset-0">
                                <img
                                    src="https://placehold.co/400x800/10b981/000000?text=Event+Bg"
                                    alt="Event Background"
                                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            </div>

                            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-white text-xs font-bold mb-6 animate-pulse">
                                        UPCOMING MAJOR EVENT
                                    </div>
                                    <h3 className="text-3xl font-black mb-2 leading-tight">
                                        LAGOS SKIP FEST 2025
                                    </h3>
                                    <p className="text-gray-300 mb-6">
                                        The ultimate grassroots showcase. Open to all ages and skill levels.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start">
                                            <Calendar className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                            <div>
                                                <p className="font-bold">December 12-14, 2025</p>
                                                <p className="text-sm text-gray-400">Main Event Series</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Clock className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                            <div>
                                                <p className="font-bold">09:00 AM Daily</p>
                                                <p className="text-sm text-gray-400">Gates Open Matches</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                            <div>
                                                <p className="font-bold">Mobolaji Johnson Arena</p>
                                                <p className="text-sm text-gray-400">Onikan, Lagos Island</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200 font-bold text-lg py-6">
                                    Register Now
                                </Button>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
}
