import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { News, Event } from "@/types/schema";

export function useNews(limit: number = 3) {
    return useQuery({
        queryKey: ["news", limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .eq("is_featured", true) // User confirmed they want FEATURED ONLY
                .order("published_at", { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Map snake_case to camelCase matches the schema interface
            const formattedNews = (data || []).map((item: any) => ({
                ...item,
                imageUrl: item.image_url || item.imageUrl, // Handle both just in case
                isFeatured: item.is_featured,
                publishedAt: item.published_at || item.created_at,
                createdAt: item.created_at
            }));

            return formattedNews as unknown as News[];
        },
    });
}

export function useEvents(limit: number = 3) {
    return useQuery({
        queryKey: ["events", limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .gte("event_date", new Date().toISOString()) // Only future events
                .order("event_date", { ascending: true })
                .limit(limit);

            if (error) throw error;

            const formattedEvents = (data || []).map((event: any) => ({
                ...event,
                imageUrl: event.image_url || event.imageUrl,
                eventDate: event.event_date,
                isFeatured: event.is_featured,
                createdAt: event.created_at
            }));

            return formattedEvents as unknown as Event[];
        },
    });
}
