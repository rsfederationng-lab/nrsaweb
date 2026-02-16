import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Trophy, Users, Globe, Target, Eye, Check, Flag } from "lucide-react";
import { Link } from "wouter";
import { CountUp } from "@/components/ui/count-up";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { useSiteSetting } from "@/hooks/use-site-settings";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Ambassador } from "@/types/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function Partnership() {
    const partnershipHeroBg = useSiteSetting("partnership_hero_bg");

    const { data: rawAmbassadors = [], isLoading, isError } = useQuery<any[]>({
        queryKey: ["/api/ambassadors"],
    });

    const ambassadors: Ambassador[] = rawAmbassadors.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        photoUrl: a.photoUrl || a.photo_url || "",
        bio: a.bio,
        socialLinks: a.socialLinks || a.social_links,
        order: a.order || 0,
        createdAt: a.createdAt || a.created_at || new Date(),
    }));

    const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handlePreview = (ambassador: Ambassador) => {
        setSelectedAmbassador(ambassador);
        setPreviewOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
            <Helmet>
                <title>Partnership - NRSA</title>
            </Helmet>

            {/* Header / Hero */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black text-white">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                >
                    <source src="/logo-animation.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/50 z-10" />

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium tracking-widest uppercase mb-6 backdrop-blur-sm">
                        Partner with Excellence
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none text-white drop-shadow-2xl">
                        FUEL THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">FUTURE</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
                        Align your brand with the fastest-growing youth sport in Nigeria. Join us in shaping champions.
                    </p>
                </div>
            </section>

            {/* Key Partners / Affiliations - Scrolling Ribbon */}
            <div className="bg-white border-b border-gray-100">
                <div className="py-4 text-center">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                        Affiliation/Partner
                    </p>
                </div>
                <PartnersMarquee />
            </div>

            {/* Why NRSA Section */}
            <section className="relative py-24 bg-black text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5" />

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-poppins">
                            Leading the Future of Nigerian Sport
                        </h2>
                        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Card 1: Global Excellence */}
                        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Trophy className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 font-poppins">Global Excellence</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Home to <span className="text-white font-medium">Guinness World Record</span> holders. We are building a legacy of international dominance and putting Nigeria on the map.
                            </p>
                        </div>

                        {/* Card 2: Youth Empowerment */}
                        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Users className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 font-poppins">Youth Empowerment</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Direct access to a massive demographic of active, aspiring young athletes. We provide a platform for talent, discipline, and community growth.
                            </p>
                        </div>

                        {/* Card 3: National Pride */}
                        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Flag className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 font-poppins">National Pride</h3>
                            <p className="text-gray-400 leading-relaxed">
                                A truly national footprint. From Lagos to Kano, our programs reach every corner of Nigeria, uniting the country through sport.
                            </p>
                        </div>

                    </div>
                </div>
            </section>


            {/* Sponsorship Tiers - Redesigned */}
            <section className="py-24 relative">
                {/* Background blur/glow spots */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Sponsorship Tiers</h2>
                        <p className="text-lg text-muted-foreground">Select the strategic alliance that suits your brand.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                        {/* Silver Partner */}
                        <TierCard
                            name="Silver Partner"
                            description="Perfect for local businesses supporting youth development."
                            features={[
                                "Logo on Website Footer",
                                "Social Media Shoutout (2x)",
                                "Certificate of Partnership",
                                "Event Exhibition Space (Local)",
                                "Branded Thank You Post"
                            ]}
                            href="/contact?subject=Silver Partnership Inquiry&message=I am interested in the Silver Partnership package..."
                        />

                        {/* Gold Partner - EMPHASIZED */}
                        <TierCard
                            name="Gold Partner"
                            description="For brands seeking nationwide visibility and deep engagement."
                            features={[
                                "Logo on National Kits & Jerseys",
                                "TV & Livestream Ad Spots",
                                "Exclusive Product Category Rights",
                                "VIP Hospitality for 5 Guests",
                                "Access to Athlete Database"
                            ]}
                            href="/contact?subject=Gold Partnership Inquiry&message=I am interested in the Gold Partnership package..."
                            isPopular={true}
                            badgeText="RECOMMENDED"
                        />

                        {/* Platinum Partner */}
                        <TierCard
                            name="Platinum Partner"
                            description="Maximum impact. Own the event naming rights and main assets."
                            features={[
                                "Event Naming Rights (NRSA x Brand)",
                                "Center Court & Arena Branding",
                                "Athlete Brand Ambassador Rights",
                                "Speaking Opportunity at Finals",
                                "All National & Grassroots Benefits"
                            ]}
                            href="/contact?subject=Platinum Partnership Inquiry&message=I am interested in the Platinum Partnership package..."
                        />

                    </div>

                    <div className="text-center mt-20">
                        <Link href="/contact?subject=Partnership Inquiry">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-8 text-xl font-bold rounded-full shadow-2xl hover:shadow-primary/50 hover:-translate-y-1 transition-all">
                                Become a Partner
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ambassadors Section */}
            <section className="py-24 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h2 className="text-3xl font-bold text-center mb-16 px-4">Featured Ambassadors</h2>

                    {isLoading ? (
                        <div className="text-center text-muted-foreground py-10">
                            <p className="text-lg animate-pulse">Loading ambassadors...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center text-red-500 py-10">
                            <p>Failed to load ambassadors. Please try again later.</p>
                        </div>
                    ) : ambassadors.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="mb-4">No ambassadors featured yet.</p>
                            <a href="https://ambassadors.nrsa.com.ng" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">Apply to be an Ambassador</Button>
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {ambassadors
                                .sort((a, b) => a.order - b.order)
                                .map((ambassador) => (
                                    <div
                                        key={ambassador.id}
                                        className="group text-center cursor-pointer"
                                        onClick={() => handlePreview(ambassador)}
                                    >
                                        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary transition-all duration-300 shadow-lg group-hover:scale-105">
                                            <img
                                                src={ambassador.photoUrl}
                                                alt={ambassador.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Eye className="text-white w-8 h-8 drop-shadow-md" />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{ambassador.name}</h4>
                                        <p className="text-sm text-primary font-medium">{ambassador.role}</p>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Ambassador Details Modal */}
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-none bg-background/95 backdrop-blur-xl shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="sr-only">Ambassador Profile</DialogTitle>
                        </DialogHeader>
                        {selectedAmbassador && (
                            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-2">
                                <div className="aspect-[3/4] w-full max-w-[260px] mx-auto rounded-xl overflow-hidden shadow-lg border border-border/50 relative group">
                                    <img
                                        src={selectedAmbassador.photoUrl}
                                        alt={selectedAmbassador.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                </div>
                                <div className="flex flex-col justify-center space-y-4 md:space-y-6 py-2">
                                    <div>
                                        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                                            Featured Ambassador
                                        </div>
                                        <h2 className="text-4xl font-extrabold tracking-tight text-foreground">{selectedAmbassador.name}</h2>
                                        <p className="text-xl text-primary font-medium mt-1">{selectedAmbassador.role}</p>
                                    </div>

                                    <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
                                        <p className="whitespace-pre-line">{selectedAmbassador.bio || "No biography available."}</p>
                                    </div>

                                    {/* Optional: Add Social Links parsing if implemented later */}
                                    {/* <div className="flex gap-4 pt-4 border-t border-border/50"> ... </div> */}
                                </div>
                            </div>
                        )}
                        <div className="mt-4 flex justify-end md:hidden">
                            <Button variant="outline" onClick={() => setPreviewOpen(false)} className="w-full">Close</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </section>

        </div >
    );
}

// Helper Components for Cleaner JSX

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}

function TierCard({ name, description, features, href, isPopular = false, badgeText = "MOST POPULAR" }: { name: string, description: string, features: string[], href: string, isPopular?: boolean, badgeText?: string }) {
    return (
        <Card className={`relative overflow-hidden border transition-all duration-300 h-full flex flex-col
      ${isPopular
                ? "bg-black/5 backdrop-blur-md border-primary shadow-2xl shadow-primary/20 scale-105 z-10"
                : "bg-white/50 backdrop-blur-sm border-gray-200 hover:border-gray-300 hover:shadow-lg"
            }
    `}>
            {isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {badgeText}
                </div>
            )}
            <CardHeader>
                <h3 className={`text-2xl font-bold ${isPopular ? "text-primary" : "text-gray-900"}`}>{name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="space-y-3">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className={`w-4 h-4 mt-0.5 ${isPopular ? "text-primary" : "text-gray-400"}`} />
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Link href={href} className="w-full">
                    <Button className={`w-full font-semibold ${isPopular ? "bg-primary hover:bg-primary/90" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                        Select Tier
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}


