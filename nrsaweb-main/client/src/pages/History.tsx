import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History as HistoryIcon, Globe, Trophy, TrendingUp, Award } from "lucide-react";

export default function History() {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Our History - NRSA</title>
            </Helmet>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <HistoryIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold">Our History</h1>
                    </div>
                    <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
                        The journey of the Nigeria Rope Skipping Association: From humble beginnings to the global stage.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Main Narrative */}
                        <div className="space-y-8">
                            <div className="prose prose-lg text-foreground/80 max-w-none">
                                <p className="text-xl leading-relaxed font-medium text-foreground">
                                    The Nigeria Rope Skipping Association (NRSA) was established as the official governing body
                                    for rope skipping in Nigeria, with the mandate to organize, promote, and develop the sport
                                    across all 36 states and the Federal Capital Territory.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <TrendingUp className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-2">Growth & Development</h3>
                                                <p className="text-muted-foreground">
                                                    Since our inception, we have been instrumental in creating structured pathways for athletes,
                                                    from grassroots development programs to elite-level competitions.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Trophy className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-2">National Achievements</h3>
                                                <p className="text-muted-foreground">
                                                    NRSA has successfully organized numerous national championships, training camps, and
                                                    certification programs for coaches and officials, expanding the sport to schools and communities nationwide.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Visual/Sidebar Content */}
                        <div className="space-y-8">
                            <Card className="bg-muted/30 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <Globe className="w-5 h-5" />
                                        Global Affiliations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-muted-foreground">
                                        Our affiliation with international bodies ensures that Nigerian athletes compete at the highest standards globally.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-background p-4 rounded-lg border flex items-center gap-3">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">IJRU</Badge>
                                            <span className="font-semibold text-sm">Intl. Jump Rope Union</span>
                                        </div>
                                        <div className="bg-background p-4 rounded-lg border flex items-center gap-3">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">IRSO</Badge>
                                            <span className="font-semibold text-sm">Intl. Rope Skipping Org.</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stats/Highlight */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-primary text-primary-foreground">
                                    <CardContent className="p-6 text-center">
                                        <Award className="w-8 h-8 mx-auto mb-2 opacity-80" />
                                        <div className="text-3xl font-bold">36+</div>
                                        <div className="text-sm opacity-90">States Active</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-primary text-primary-foreground">
                                    <CardContent className="p-6 text-center">
                                        <Globe className="w-8 h-8 mx-auto mb-2 opacity-80" />
                                        <div className="text-3xl font-bold">Global</div>
                                        <div className="text-sm opacity-90">Recognition</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
