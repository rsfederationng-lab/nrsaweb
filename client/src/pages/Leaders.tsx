import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Loader2, Zap, UserCheck, MapPin } from "lucide-react";
import { LeaderCard } from "@/components/LeaderCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Leader {
  id: number;
  name: string;
  position: string;
  bio: string;
  photoUrl: string;
  order: number;
  state?: string;
}

const API_URL = "/api/leaders";

export default function Leaders() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} `);
        }

        const data: Leader[] = await response.json();

        data.sort((a, b) => a.order - b.order);

        setLeaders(data);
        setError(null);

      } catch (e) {
        console.error("Error fetching leaders list:", e);
        setError("Could not load leadership data. Please check the API connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const handleReadBio = (leaderId: number) => {
    const leader = leaders.find((l) => l.id === leaderId);
    if (leader) {
      setSelectedLeader(leader);
      setIsModalOpen(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-4 text-lg text-gray-600">Loading Leadership...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 border border-red-300 rounded-lg shadow-md">
          <p className="font-semibold text-red-700">Error Loading Data</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      );
    }

    if (leaders.length === 0) {
      return (
        <div className="text-center p-12 bg-yellow-50 border border-yellow-300 rounded-lg shadow-md">
          <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
          <p className="font-semibold text-xl text-yellow-700">No Leaders Found</p>
          <p className="mt-2 text-md text-yellow-600">Leader profiles will appear here once added in the admin dashboard.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map((leader) => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            onClick={handleReadBio}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Leadership Team"
        description="Meet the officials and executive members of the Nigeria Rope Skipping Association — the dedicated team steering rope skipping development across Nigeria."
        path="/leaders"
        breadcrumbs={[{ name: "Leadership", url: "/leaders" }]}
      />
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Visionary Leaders</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Meet the dedicated team guiding the Nigerian Rope Skipping Association.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {renderContent()}
        </div>
      </section>

      {/* Leader Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-none bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Leader Profile</DialogTitle>
          </DialogHeader>
          {selectedLeader && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-2">
              <div className="aspect-[3/4] w-full max-w-[260px] mx-auto rounded-xl overflow-hidden shadow-lg border border-border/50 relative group">
                <img
                  src={selectedLeader.photoUrl}
                  alt={selectedLeader.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              </div>
              <div className="flex flex-col justify-center space-y-4 md:space-y-6 py-2">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                    Leadership Team
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{selectedLeader.name}</h2>
                  <p className="text-xl text-primary font-medium mt-1 flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    {selectedLeader.position}
                  </p>
                  {selectedLeader.state && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedLeader.state}
                    </p>
                  )}
                </div>

                <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
                  <p className="whitespace-pre-line">{selectedLeader.bio || "No biography available."}</p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end md:hidden">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
