import React from "react";
import { SEO } from "@/components/SEO";
import { SchoolShowcase } from "@/components/SchoolShowcase";
import { motion } from "framer-motion";
import { ScrollFade } from "@/components/animations/ScrollFade";
import { useQuery } from "@tanstack/react-query";
import { UnderstandingInterschool } from "@/components/UnderstandingInterschool";

export default function Interschool() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20"> {/* pt-20 to account for fixed navbar */}
            <SEO
                title="Interschool Championship"
                description="NRSA National Interschool Rope Skipping Championship — official rules, Y-Court format, school registration, and competition details for the 2026 season across participating states."
                path="/interschool"
                breadcrumbs={[{ name: "Interschool", url: "/interschool" }]}
            />

            {/* Page Header */}
            <section className="relative py-20 bg-emerald-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20" style={{
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/80 z-0"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            National Interschool <span className="text-emerald-400">Championship</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
                            The battleground for the next generation of greatness.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <ScrollFade>
                <UnderstandingInterschool />

                {/* About & Video Section */}
                <InterschoolContent />

                <SchoolShowcase />
            </ScrollFade>
        </div>
    );
}

function InterschoolContent() {
    const { data: years = [] } = useQuery<any[]>({
        queryKey: ["/api/interschool-years"],
    });
    const activeYear = years.find(y => y.isActive) || years[0];

    if (!activeYear) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Intro / Description */}
                {(activeYear.description || activeYear.aboutImageUrl) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">About the Championship</h2>
                            <div className="prose prose-emerald text-gray-600">
                                {activeYear.description ? (
                                    <p className="whitespace-pre-wrap">{activeYear.description}</p>
                                ) : (
                                    <p className="italic text-muted-foreground">
                                        The National Interschool Championship creates a pathway for students to showcase their skills, compete at the highest level, and build character through sportsmanship.
                                    </p>
                                )}
                            </div>
                        </div>
                        {activeYear.aboutImageUrl && (
                            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                                <img
                                    src={activeYear.aboutImageUrl}
                                    alt="Championship Roadmap"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="bg-gray-50 p-2 text-center text-xs text-muted-foreground">
                                    Road to National Interschool Championship
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Video Section */}
                {activeYear.videoUrl && (
                    <div className="mb-16">
                        <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video relative">
                            {activeYear.videoUrl.includes('youtube') || activeYear.videoUrl.includes('youtu.be') ? (
                                <iframe
                                    src={activeYear.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                    title="Championship Video"
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={activeYear.videoUrl}
                                    controls
                                    className="absolute inset-0 w-full h-full"
                                />
                            )}
                        </div>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Watch to understand the Interschool Championship structure.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
