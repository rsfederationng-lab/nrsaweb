import { Users, GraduationCap, Megaphone, UserSquare2, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pathways = [
    {
        title: "For Athletes",
        icon: Users,
        description: "Join a club, compete in championships, and represent Nigeria globally.",
        link: "/contact?subject=Athlete Registration&message=I would like to register as an athlete...",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "For Schools",
        icon: GraduationCap,
        description: "Integrate rope skipping into your curriculum and school sports activities.",
        link: "/contact?subject=School Partnership&message=We are interested in integrating rope skipping into our school...",
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        title: "For Coaches",
        icon: Megaphone,
        description: "Get certified, access training resources, and build your own club.",
        link: "/contact?subject=Coach Certification&message=I am interested in becoming a certified coach...",
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        title: "For Sponsors",
        icon: UserSquare2,
        description: "Partner with NRSA to empower youth and gain national visibility.",
        link: "/partnership",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    }
];

export function UserPathways() {
    return (
        <section className="py-20 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Find Your Path</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Whether you want to jump, teach, or support, there's a place for you in the Nigerian Rope Skipping Association.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pathways.map((item, index) => (
                        <Link key={index} href={item.link}>
                            <Card className="h-full cursor-pointer group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                                <CardHeader className="text-center pb-2">
                                    <div className={`mx-auto w-20 h-20 ${item.bg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className={`w-10 h-10 ${item.color}`} />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground mb-6">
                                        {item.description}
                                    </p>
                                    <Button variant="ghost" className="group-hover:text-primary group-hover:bg-primary/5 rounded-full px-6">
                                        Get Started <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
