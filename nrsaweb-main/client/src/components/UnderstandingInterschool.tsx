import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Play, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export function UnderstandingInterschool() {
    // Fetch site settings to get the video URL & global registration URL
    const { data: settings = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/site-settings"],
    });

    const videoSetting = settings.find((s: any) => s.key === "interschool_video_url");
    const videoUrl = videoSetting?.value;

    const globalRegSetting = settings.find((s: any) => s.key === "interschool_registration_url");
    const globalRegUrl = globalRegSetting?.value;

    const targetUrl = globalRegUrl;

    return (
        <section className="py-20 bg-emerald-50/50 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Column 1: Info & Context */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                                Grassroots <span className="text-emerald-600">Growth</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                The National Interschool Championship is a yearly program designed to discover and nurture talent from the ground up.
                                We support public and private schools by introducing the simplified <span className="font-semibold text-emerald-700">Y-Court principle</span>, making professional rope skipping accessible, organized, and competitive for every student.
                            </p>
                        </div>

                        {/* Sub-Standard Badge/Card */}
                        <Card className="bg-white border-emerald-100 shadow-sm overflow-hidden">
                            <CardContent className="p-5 flex gap-4">
                                <div className="shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Info className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-gray-900 border-b border-emerald-50 pb-2 mb-2">
                                        Sub-Standard Match Format
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Competitions follow a rigorous 9-discipline structure designed to test speed, endurance, and freestyle skills.
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {["SRSS", "SRDU", "SRSE", "DDSR", "SROF", "SRCC", "LMS", "DDS", "SRSR"].map((code) => (
                                            <Badge key={code} variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs font-mono">
                                                {code}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {targetUrl && (
                            <div className="pt-4">
                                <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            size="lg"
                                            className="relative bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-emerald-500/20 overflow-hidden group"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                Register Your School <ExternalLink className="w-5 h-5" />
                                            </span>
                                            {/* Pulse Animation Background */}
                                            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 duration-1000"></span>
                                        </Button>
                                    </motion.div>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Video Embed */}
                    <div className="relative">
                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>

                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900 aspect-video group">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse">
                                    <div className="text-gray-500 flex flex-col items-center gap-2">
                                        <Play className="w-12 h-12 opacity-50" />
                                        <span className="text-sm font-medium">Loading Video...</span>
                                    </div>
                                </div>
                            ) : videoUrl ? (
                                <iframe
                                    src={videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                    title="Understanding Interschool"
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                                            <Play className="w-8 h-8 ml-1" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">Video Coming Soon</h3>
                                        <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                            The introduction video hasn't been set yet. Check back later!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Caption */}
                        <div className="absolute -bottom-6 right-6 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 text-xs font-bold text-emerald-800 hidden md:block transform rotate-1">
                            WATCH: The Legacy Begins
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
