import React from "react";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Media } from "@/types/schema";

export default function Media() {
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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(mediaItems.map((item) => item.category)));
    return ["All", ...uniqueCategories];
  }, [mediaItems]);

  const filteredMedia =
    selectedCategory === "All"
      ? mediaItems
      : mediaItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Media Gallery</h1>
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
              <p className="text-muted-foreground text-lg">Loading media...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No media items in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:elevate transition-all"
                  data-testid={`card-media-${item.id}`}
                >
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    {item.isExternal && item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        data-testid={`img-thumbnail-${item.id}`}
                      />
                    ) : item.isExternal ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <svg className="w-16 h-16 text-primary mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        <p className="text-sm font-medium text-primary">External Link</p>
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        data-testid={`img-media-${item.id}`}
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground">
                        {item.category}
                      </Badge>
                    </div>
                    {item.isExternal && (
                      <div className="absolute bottom-3 right-3 bg-background/80 rounded-full p-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2" data-testid={`text-title-${item.id}`}>{item.title}</h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-description-${item.id}`}>{item.description}</p>
                    {item.isExternal ? (
                      <Button
                        size="sm"
                        className="mt-3 w-full bg-primary hover:bg-primary/90"
                        data-testid={`button-watch-${item.id}`}
                        onClick={() => window.open(item.imageUrl, '_blank', 'noopener,noreferrer')}
                      >
                        {item.thumbnailUrl ? "Watch" : "Open"}
                      </Button>
                    ) : isAdmin && (
                      <Button
                        size="sm"
                        className="mt-3"
                        onClick={() => handleEdit(item.id)}
                        data-testid={`button-edit-${item.id}`}
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
