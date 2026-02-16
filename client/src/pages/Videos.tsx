import React from "react";
import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Media } from "@/types/schema";
import { Play } from "lucide-react";

export default function Videos() {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [activeVideo, setActiveVideo] = useState<number | null>(null);
    const [, navigate] = useLocation();

    useState(() => {
        const userRole = localStorage.getItem("userRole");
        setIsAdmin(userRole === "admin");
    });

    const handleEdit = (id: number) => {
        navigate(`/admin-nrsa-dashboard/media`);
    };

    const { data: mediaItems = [], isLoading } = useQuery<Media[]>({
        queryKey: ["/api/media"],
    });

    // Helper to extract YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Filter only videos (Category has 'video' OR it is an external link)
    const videoItems = useMemo(() => {
        return mediaItems.filter(item => {
            const isVideoCategory = item.category.toLowerCase().includes("video");
            return isVideoCategory || item.isExternal;
        });
    }, [mediaItems]);

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Video Gallery - NRSA</title>
            </Helmet>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Video Gallery</h1>
                </div>
            </section>

            {/* Media Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">Loading videos...</p>
                        </div>
                    ) : videoItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">
                                No videos available at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videoItems.map((item) => {
                                const videoId = getYouTubeId(item.imageUrl);
                                const isPlaying = activeVideo === item.id;

                                return (
                                    <Card
                                        key={item.id}
                                        className="overflow-hidden hover:elevate transition-all flex flex-col h-full"
                                    >
                                        <div className="relative aspect-video bg-black flex items-center justify-center group">
                                            {isPlaying && videoId ? (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                                    title={item.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                ></iframe>
                                            ) : (
                                                <div
                                                    className="w-full h-full cursor-pointer relative"
                                                    onClick={() => videoId ? setActiveVideo(item.id) : window.open(item.imageUrl, '_blank')}
                                                >
                                                    {item.thumbnailUrl ? (
                                                        <img
                                                            src={item.thumbnailUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                                            }}
                                                        />
                                                    )}

                                                    {/* Play Button Overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="bg-primary/90 text-primary-foreground rounded-full p-4 transform transition-transform group-hover:scale-110 shadow-lg">
                                                            <Play className="w-8 h-8 fill-current translate-x-1" />
                                                        </div>
                                                    </div>

                                                    <div className="absolute top-3 right-3">
                                                        <Badge className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border-0">
                                                            Video
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">{item.description}</p>

                                            <div className="flex gap-2 mt-auto pt-2">
                                                {isAdmin && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => handleEdit(item.id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
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
