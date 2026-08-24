
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type SiteContentSection = "partnership" | "about" | "hero";

interface SiteContentItem {
    key: string;
    label: string;
    description: string;
}

const SECTION_CONTENT: Record<SiteContentSection, SiteContentItem[]> = {
    partnership: [
        {
            key: "partnership_hero_bg",
            label: "Partnership Hero Background",
            description: "The background image for the main Partnership page header."
        }
    ],
    about: [
        {
            key: "about_hero_bg",
            label: "About Page Hero Background",
            description: "The background image for the About Us page header."
        },
        {
            key: "about_mission_image",
            label: "Mission Section Image",
            description: "Image displayed alongside the Mission Statement."
        }
    ],
    hero: [
        {
            key: "hero_main_bg",
            label: "Main Hero Background (Fallback)",
            description: "Fallback background image for the main landing page if slides fail to load."
        }
    ]
};

export default function SiteContentManager() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedSection, setSelectedSection] = useState<SiteContentSection>("partnership");

    // Fetch all settings
    const { data: settings = [] } = useQuery<any[]>({
        queryKey: ["/api/site-settings"],
    });

    // Helper to find value by key
    const getValue = (key: string) => {
        const setting = settings.find((s) => s.key === key);
        return setting ? setting.value : "";
    };

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async ({ key, value }: { key: string; value: string }) => {
            // Check if setting exists to decide between POST (create) or PATCH (update)
            // For simplicity with this specific backend implementation which might just utilize key lookups,
            // we'll try to find the ID if it exists, otherwise just POST which usually handles upsert or create.
            // Actually, standard REST suggests:
            // 1. Check if exists.
            // 2. If exists, PATCH /api/site-settings/:id
            // 3. If not, POST /api/site-settings

            const existing = settings.find((s) => s.key === key);

            if (existing) {
                const res = await apiRequest("PATCH", `/api/site-settings/${existing.id}`, { value });
                return res.json();
            } else {
                const res = await apiRequest("POST", "/api/site-settings", { key, value });
                return res.json();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
            toast({
                title: "Content Updated",
                description: "Image updated successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update content.",
                variant: "destructive",
            });
        },
    });

    const handleImageChange = (key: string, url: string) => {
        saveMutation.mutate({ key, value: url });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Site Content Manager</h1>
                <p className="text-muted-foreground">
                    Manage static images and backgrounds across the website.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Section</CardTitle>
                    <CardDescription>Choose which part of the website you want to edit.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        value={selectedSection}
                        onValueChange={(val) => setSelectedSection(val as SiteContentSection)}
                    >
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="partnership">Partnership Page</SelectItem>
                            <SelectItem value="about">About Us Page</SelectItem>
                            <SelectItem value="hero">Home Page (Hero)</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="grid gap-6">
                {SECTION_CONTENT[selectedSection].map((item) => (
                    <Card key={item.key}>
                        <CardHeader>
                            <CardTitle className="text-lg">{item.label}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUpload
                                value={getValue(item.key)}
                                onChange={(url) => handleImageChange(item.key, url)}
                                label={item.label}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
