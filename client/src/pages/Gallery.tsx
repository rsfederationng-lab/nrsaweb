import React from "react";
import { SEO } from "@/components/SEO";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Media } from "@/types/schema";

export default function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
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

    // Filter out videos for the gallery
    const photoItems = useMemo(() => {
        return mediaItems.filter(item => {
            const isVideoCategory = item.category.toLowerCase().includes("video");
            return !isVideoCategory && !item.isExternal;
        });
    }, [mediaItems]);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(photoItems.map((item) => item.category)));
        return ["All", ...uniqueCategories];
    }, [photoItems]);

    const filteredMedia =
        selectedCategory === "All"
            ? photoItems
            : photoItems.filter((item) => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background">
            <SEO
              title="Photo Gallery"
              description="Browse the NRSA photo gallery — official images from national championships, training sessions, and rope skipping events across Nigeria."
              path="/gallery"
              breadcrumbs={[{ name: "Gallery", url: "/gallery" }]}
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Photo Gallery</h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
                        Explore photos from training, achievements, events, and announcements.
                    </p>
                </div>
            </section>

            {/* Category Filters */}
            <section className="py-8 bg-muted/30">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Media Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">Loading photos...</p>
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">
                                No photos in this category.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMedia.map((item) => (
                                <Card
                                    key={item.id}
                                    className="overflow-hidden hover:elevate transition-all"
                                >
                                    <div className="relative aspect-video bg-muted flex items-center justify-center">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-primary text-primary-foreground">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                        {isAdmin && (
                                            <Button
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => handleEdit(item.id)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
