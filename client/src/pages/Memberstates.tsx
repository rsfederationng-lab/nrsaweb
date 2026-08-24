import React from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { MemberState } from "@/types/schema";

export default function Memberstates() {
  const { data: states = [], isLoading } = useQuery<MemberState[]>({
    queryKey: ["/api/member-states"],
    queryFn: async () => {
      const res = await fetch("/api/member-states");
      if (!res.ok) throw new Error("Failed to fetch member states");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Member States"
        description="NRSA member states across Nigeria. Each state has its own rope skipping federation affiliated with the national body, driving grassroots development in their region."
        path="/member-states"
        breadcrumbs={[{ name: "Member States", url: "/member-states" }]}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Member States</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Explore the states officially recognized by NRSA across Nigeria.
          </p>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading member states...</p>
            </div>
          ) : states.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No member states registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {states.map((state) => (
                <Card
                  key={state.id}
                  className="hover-elevate active-elevate-2 transition-all h-full flex flex-col"
                  data-testid={`card-state-${state.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        {state.logoUrl ? (
                          <OptimizedImage
                            src={state.logoUrl}
                            alt={`${state.name} logo`}
                            className="w-full h-full object-contain p-2"
                            fallbackSrc="https://placehold.co/400x400/009739/ffffff?text=State"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-primary">
                            {state.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <Badge className="bg-primary text-primary-foreground">Recognized</Badge>
                    </div>
                    <CardTitle className="text-2xl">{state.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow space-y-4">
                    <div className="space-y-3 text-sm">
                      {state.representativeName && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <div className="text-xs text-muted-foreground">State Representative</div>
                            <div className="font-medium text-foreground">{state.representativeName}</div>
                          </div>
                        </div>
                      )}
                      {state.contactEmail && (
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground break-all">{state.contactEmail}</span>
                        </div>
                      )}
                      {state.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{state.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
