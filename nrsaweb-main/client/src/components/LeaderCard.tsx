import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck, MapPin } from "lucide-react";

interface Leader {
    id: number;
    name: string;
    position: string;
    bio: string;
    photoUrl: string;
    order: number;
    state?: string;
}

interface LeaderCardProps {
    leader: Leader;
    onClick: (id: number) => void;
}

export function LeaderCard({ leader, onClick }: LeaderCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <Card
            className="group overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl border-t-8 border-primary rounded-xl cursor-pointer hover-elevate active-elevate-2 bg-white max-w-[320px] mx-auto w-full"
            onClick={() => onClick(leader.id)}
        >
            <div className="w-full aspect-[3/4] relative overflow-hidden bg-gray-100">
                {!isImageLoaded && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                <img
                    src={leader.photoUrl}
                    alt={`Photo of ${leader.name}`}
                    loading="lazy"
                    className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${!isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400/009739/ffffff?text=NRSA";
                        setIsImageLoaded(true);
                    }}
                />
            </div>
            <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-extrabold text-gray-900 leading-snug tracking-tight">{leader.name}</h3>

                <p className="text-primary font-semibold mt-1 text-md flex items-center justify-center gap-1 mb-3">
                    <UserCheck className="w-4 h-4" />
                    {leader.position}
                </p>

                {leader.state && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{leader.state}</span>
                    </div>
                )}

                <div className="mt-4 text-primary font-bold text-sm tracking-wide uppercase border-b-2 border-transparent hover:border-primary transition-all inline-block pb-1">
                    Click for Full Bio
                </div>

            </CardContent>
        </Card>
    );
}
