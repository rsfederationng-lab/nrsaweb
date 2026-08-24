import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, MapPin } from "lucide-react";
import type { Player } from "@/types/schema";

interface AthleteCardProps {
    player: Player;
}

export function AthleteCard({ player }: AthleteCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <Card
            className="group overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border-t-8 border-primary rounded-xl cursor-pointer hover-elevate active-elevate-2 bg-white h-full flex flex-col"
            data-testid={`card-player-${player.id}`}
        >
            <div className="w-full aspect-[3/4] relative overflow-hidden bg-gray-100">
                {!isImageLoaded && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                <img
                    src={player.photoUrl || "https://placehold.co/400x400/e2e8f0/1e293b?text=Athlete"}
                    alt={player.name || 'Player'}
                    loading="lazy"
                    className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${!isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400/e2e8f0/1e293b?text=Athlete";
                        setIsImageLoaded(true);
                    }}
                />
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="shadow-sm bg-white/90 hover:bg-white text-primary font-bold backdrop-blur-sm">
                        {player.category || 'Athlete'}
                    </Badge>
                </div>
            </div>

            <CardContent className="pt-6 px-4 pb-6 flex-grow flex flex-col text-center">
                <h3 className="font-extrabold text-xl text-gray-900 mb-1 leading-tight">{player.name || 'Unknown Athlete'}</h3>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Trophy className="w-3 h-3 text-primary" />
                    <span className="font-medium text-foreground">{player.club || 'No Club'}</span>
                    <span className="text-gray-300">•</span>
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{player.state || 'NG'}</span>
                </div>

                <div className="pt-4 border-t mt-auto space-y-3 w-full">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Points</span>
                        <span className="text-xl font-bold text-primary">{player.totalPoints || 0}</span>
                    </div>

                    {(player.awardsWon !== undefined && player.awardsWon !== null && player.awardsWon > 0) && (
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Awards</span>
                            <span className="text-md font-bold text-foreground">{player.awardsWon}</span>
                        </div>
                    )}

                    {player.achievements && (
                        <div className="text-left mt-3 pt-3 border-t border-dashed">
                            <p className="text-xs text-muted-foreground line-clamp-2 italic">"{player.achievements}"</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
