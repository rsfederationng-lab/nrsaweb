import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, MapPin, ExternalLink, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";

// --- Types ---
interface InterschoolYear {
    id: number;
    year: string;
    logoUrl: string;
    isActive: boolean;
    themeColor: string;
}

interface SchoolStanding {
    id: number;
    schoolName: string;
    state: string;
    points: number;
}

interface SchoolActivation {
    id: number;
    schoolName: string;
    eventTitle: string;
    eventDate: string;
    imageUrl?: string;
}

// --- Animations ---

interface NewsItem {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string; // Optional if needed
    isFeatured: boolean;
    publishedAt: string;
    createdAt: string;
}

// --- Animations ---

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const tableVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
};

export function SchoolShowcase() {
    // 1. Fetch Years to find active one
    const { data: years = [] } = useQuery<InterschoolYear[]>({
        queryKey: ["/api/interschool-years"],
    });

    // Fetch site settings for global registration URL
    const { data: settings = [] } = useQuery<{ id: number; key: string; value: string }[]>({
        queryKey: ["/api/site-settings"],
    });
    const globalRegSetting = settings.find((s) => s.key === "interschool_registration_url");
    const globalRegUrl = globalRegSetting?.value;

    const activeYear = years.find(y => y.isActive) || years[0];

    // State for selected year (defaults to active year)
    const [selectedYear, setSelectedYear] = useState<InterschoolYear | null>(null);

    // Set selected year to active year on initial load
    useEffect(() => {
        if (activeYear && !selectedYear) {
            setSelectedYear(activeYear);
        }
    }, [activeYear]);

    // 2. Fetch Standings & News for selected year
    const { data: standings = [] } = useQuery<SchoolStanding[]>({
        queryKey: ["/api/school-standings", { yearId: selectedYear?.id }],
        enabled: !!selectedYear,
    });

    const { data: newsItems = [] } = useQuery<NewsItem[]>({
        queryKey: ["/api/interschool-news", { yearId: selectedYear?.id }],
        enabled: !!selectedYear,
    });

    // State for viewing news details
    const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);

    // If no active season is set up yet, show a placeholder or nothing?
    // We'll show the section but with empty state or loading if needed.
    // For now, if no years exist, we might want to hide or show "Coming Soon".

    if (!activeYear && years.length === 0) return null; // Or skeleton

    return (
        <section className="py-24 relative overflow-hidden bg-emerald-50/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
            }}></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="mb-4 border-emerald-500 text-emerald-700 bg-emerald-50 px-4 py-1 text-xs tracking-widest uppercase font-bold">
                            Grassroots Development
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                            Current <span className="text-emerald-500">Standings</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                            Bringing students together through the power of the jump rope. Stay updated on venue details, team rankings, and the latest news from our national interschool circuit.
                        </p>

                        {/* Year Selector */}
                        {years.length > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-6">
                                <span className="text-sm font-medium text-gray-700">View Season:</span>
                                <Select
                                    value={selectedYear?.id.toString()}
                                    onValueChange={(value) => {
                                        const year = years.find(y => y.id === parseInt(value));
                                        if (year) setSelectedYear(year);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px] bg-white">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year.id} value={year.id.toString()}>
                                                {year.year} {year.isActive && "⭐"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Leaderboard Section (2 cols) */}
                    <motion.div
                        className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden"
                        variants={tableVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {selectedYear?.logoUrl && (
                                    <img
                                        src={selectedYear.logoUrl}
                                        alt={`${selectedYear.year} Logo`}
                                        className="w-20 h-20 object-contain bg-white rounded-full p-2 shadow-sm"
                                    />
                                )}
                                <div>
                                    <h3 className="font-bold text-xl leading-none">Top Schools</h3>
                                    <span className="text-emerald-100 text-xs font-medium">
                                        Season {selectedYear?.year || "Upcoming"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-emerald-100">
                                        <TableHead className="w-[60px] text-center font-bold text-emerald-700">#</TableHead>
                                        <TableHead className="text-emerald-900 font-semibold">School</TableHead>
                                        <TableHead className="text-emerald-900 font-semibold text-right">Pts</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {standings.slice(0, 3).map((school, index) => (
                                        <TableRow key={school.id} className="hover:bg-emerald-50/50 border-emerald-50 transition-colors">
                                            <TableCell className="font-black text-center text-emerald-600 text-lg">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-gray-800">{school.schoolName}</div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    {school.state}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-bold text-gray-700">
                                                {school.points}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {standings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                No standings available yet for {activeYear?.year}.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                            <Link href="/rankings/schools" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1">
                                View Full Leaderboard <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div> */}
                    </motion.div>

                    {/* Activation Grid Section (3 cols) */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-2xl text-gray-800">Interschool News</h3>
                            {/* <Link href="/news" className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors">
                                See all updates &rarr;
                            </Link> */}
                        </div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {newsItems.slice(0, 3).map((item) => (
                                <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
                                    <Card
                                        className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white cursor-pointer"
                                        onClick={() => setSelectedNewsItem(item)}
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-gray-100">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <Trophy className="w-8 h-8 opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                News
                                            </div>
                                        </div>
                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.publishedAt).toLocaleDateString()}
                                            </div>
                                            <h4 className="font-bold text-md text-gray-900 mb-1 leading-tight group-hover:text-emerald-600 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                            {newsItems.length === 0 && (
                                <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-emerald-100">
                                    <p className="text-muted-foreground">No news posted for this season yet.</p>
                                </div>
                            )}
                        </motion.div>


                    </div>
                </div>
            </div>

            {/* News Detail Dialog */}
            <Dialog open={!!selectedNewsItem} onOpenChange={() => setSelectedNewsItem(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedNewsItem?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedNewsItem?.imageUrl && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <img
                                    src={selectedNewsItem.imageUrl}
                                    alt={selectedNewsItem.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                            {selectedNewsItem?.publishedAt && new Date(selectedNewsItem.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="text-base whitespace-pre-wrap">
                            {selectedNewsItem?.content}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
