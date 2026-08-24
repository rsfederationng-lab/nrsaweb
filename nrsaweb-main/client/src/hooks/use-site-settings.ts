
import { useQuery } from "@tanstack/react-query";

interface SiteSetting {
    id: number;
    key: string;
    value: string;
}

export function useSiteSettings() {
    return useQuery<SiteSetting[]>({
        queryKey: ["/api/site-settings"],
    });
}

export function useSiteSetting(key: string) {
    const { data: settings } = useSiteSettings();
    const setting = settings?.find((s) => s.key === key);
    return setting?.value;
}
