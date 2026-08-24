import React from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { Player } from "@/types/schema";
import { AthleteCard } from "@/components/AthleteCard";
import { SEO } from "@/components/SEO";

export default function Players() {
  const { data: players = [], isLoading, error } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  console.log('🔍 [PLAYERS FRONTEND] Render state:', { playersCount: players.length, isLoading, error });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nigerian Athletes"
        description="Meet Nigeria's top rope skipping athletes. NRSA-registered players competing in national and international championships representing Nigeria."
        path="/players"
        breadcrumbs={[{ name: "Athletes", url: "/players" }]}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Athletes</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Meet Nigeria's top rope skipping athletes representing the nation in competitions worldwide.
          </p>
        </div>
      </section>

      {/* Players Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading athletes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">Failed to load athletes. Please try again later.</p>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No athletes registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {players.map((player) => (
                <AthleteCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
