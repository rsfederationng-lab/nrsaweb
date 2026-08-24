import React from "react";
import { Link, useLocation } from "wouter";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function Navbar() {
    const [location] = useLocation();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Helper to check active state
    const isActive = (path: string) => location === path;

    const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) => (
        <NavigationMenuLink asChild>
            <Link
                href={href}
                className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary data-[active]:bg-transparent data-[state=open]:bg-transparent text-base font-medium transition-colors font-poppins cursor-pointer",
                    isActive(href) && "text-primary border-b-2 border-primary rounded-none",
                    className
                )}
            >
                {children}
            </Link>
        </NavigationMenuLink>
    );

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
                    : "bg-background/95 backdrop-blur-sm border-b border-transparent"
            )}
        >
            <div
                className={cn(
                    "max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-300",
                    isScrolled ? "h-16" : "h-20"
                )}
            >

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                    <img src="/nrsf-logo.png" alt="NRSA Logo" className="h-12 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">

                            {/* About */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={cn("text-base font-poppins bg-transparent hover:text-primary hover:bg-transparent focus:bg-transparent focus:text-primary", isActive('/about') && "text-primary border-b-2 border-primary rounded-none")}>
                                    About
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    href="/"
                                                >
                                                    <div className="mb-2 mt-4 flex justify-center">
                                                        <img src="/nrsf-logo.png" alt="NRSA Logo" className="h-24 w-auto object-contain" />
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground text-center mt-2">
                                                        The National Rope Skipping Association of Nigeria.
                                                    </p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/about" title="Mission & Vision">
                                            Our core values and strategic goals.
                                        </ListItem>
                                        <ListItem href="/leaders" title="Leadership">
                                            Meet the executives driving the sport.
                                        </ListItem>
                                        <ListItem href="/history" title="History">
                                            The journey of rope skipping in Nigeria.
                                        </ListItem>
                                        <ListItem href="/clubs" title="Registered Clubs">
                                            Find a club near you.
                                        </ListItem>
                                        <ListItem href="/member-states" title="Member States">
                                            See our presence across Nigeria.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Competitions */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={cn("text-base font-poppins bg-transparent hover:text-primary hover:bg-transparent focus:bg-transparent focus:text-primary", isActive('/competitions') && "text-primary border-b-2 border-primary rounded-none")}>
                                    Competitions
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        <ListItem href="/players" title="National Athletes">
                                            Explore profiles of our registered athletes.
                                        </ListItem>
                                        <ListItem href="/events" title="Calendar">
                                            Upcoming events and championships.
                                        </ListItem>
                                        <ListItem href="/interschool" title="Interschool Championship">
                                            School rankings and activation updates.
                                        </ListItem>
                                        <ListItem href="/competitions" title="Competition System">
                                            Official rules and how the Y-Court is played.
                                        </ListItem>
                                        <ListItem href="https://skippers.nrsa.com.ng" title="Results" target="_blank" rel="noopener noreferrer">
                                            Competition scores, rankings, and player stats.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Media */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={cn("text-base font-poppins bg-transparent hover:text-primary hover:bg-transparent focus:bg-transparent focus:text-primary", isActive('/media') && "text-primary border-b-2 border-primary rounded-none")}>
                                    Media
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        <ListItem href="/news" title="News">
                                            Latest announcements and press releases.
                                        </ListItem>
                                        <ListItem href="/gallery" title="Photo Gallery">
                                            Highlights from recent events.
                                        </ListItem>
                                        <ListItem href="/videos" title="Videos">
                                            Watch tutorials and competition replays.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Get Involved */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={cn("text-base font-poppins bg-transparent hover:text-primary hover:bg-transparent focus:bg-transparent focus:text-primary", isActive('/get-involved') && "text-primary border-b-2 border-primary rounded-none")}>
                                    Get Involved
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                                        <ListItem href="/contact?subject=Registration&message=I would like to register as a..." title="Register">
                                            Join as an athlete, coach, or judge.
                                        </ListItem>
                                        <ListItem href="/contact?subject=Volunteer&message=I am interested in volunteering for..." title="Volunteer">
                                            Help organize our next big event.
                                        </ListItem>
                                        <ListItem href="/partnership" title="Sponsorship">
                                            Partner with us to grow the sport.
                                        </ListItem>
                                        <ListItem href="https://ambassadors.nrsa.com.ng" title="Ambassadors" target="_blank" rel="noopener noreferrer">
                                            Meet our featured athletes.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Contact */}
                            <NavigationMenuItem>
                                <NavLink href="/contact">Contact</NavLink>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* CTA Button */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link href="/contact?subject=Join NRSA&message=I would like to join the NRSA as...">
                        <Button size="lg" className="rounded-full font-bold px-8">
                            Join NRSA
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu (Sheet) */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
                            <Menu className="w-8 h-8" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                        <SheetHeader className="mb-6 text-left">
                            <SheetTitle className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                                    <img src="/nrsf-logo.png" alt="NRSA Logo" className="h-10 w-auto" />
                                </Link>
                            </SheetTitle>
                        </SheetHeader>

                        <Accordion type="single" collapsible className="w-full">

                            <AccordionItem value="about">
                                <AccordionTrigger className="text-lg font-medium">About</AccordionTrigger>
                                <AccordionContent className="flex flex-col space-y-2 pl-4">
                                    <MobileLink href="/about" onClick={() => setIsOpen(false)}>Mission & Vision</MobileLink>
                                    <MobileLink href="/leaders" onClick={() => setIsOpen(false)}>Leadership</MobileLink>
                                    <MobileLink href="/history" onClick={() => setIsOpen(false)}>History</MobileLink>
                                    <MobileLink href="/clubs" onClick={() => setIsOpen(false)}>Registered Clubs</MobileLink>
                                    <MobileLink href="/member-states" onClick={() => setIsOpen(false)}>Member States</MobileLink>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="competitions">
                                <AccordionTrigger className="text-lg font-medium">Competitions</AccordionTrigger>
                                <AccordionContent className="flex flex-col space-y-2 pl-4">
                                    <MobileLink href="/players" onClick={() => setIsOpen(false)}>National Athletes</MobileLink>
                                    <MobileLink href="/events" onClick={() => setIsOpen(false)}>Calendar</MobileLink>
                                    <MobileLink href="/interschool" onClick={() => setIsOpen(false)}>Interschool Championship</MobileLink>
                                    <MobileLink href="/competitions" onClick={() => setIsOpen(false)}>Competition System</MobileLink>
                                    <a href="https://skippers.nrsa.com.ng" target="_blank" rel="noopener noreferrer" className="block py-2 text-base text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Results</a>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="media">
                                <AccordionTrigger className="text-lg font-medium">Media</AccordionTrigger>
                                <AccordionContent className="flex flex-col space-y-2 pl-4">
                                    <MobileLink href="/news" onClick={() => setIsOpen(false)}>News</MobileLink>
                                    <MobileLink href="/gallery" onClick={() => setIsOpen(false)}>Photo Gallery</MobileLink>
                                    <MobileLink href="/videos" onClick={() => setIsOpen(false)}>Videos</MobileLink>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="get-involved">
                                <AccordionTrigger className="text-lg font-medium">Get Involved</AccordionTrigger>
                                <AccordionContent className="flex flex-col space-y-2 pl-4">
                                    <MobileLink href="/contact?subject=Registration&message=I would like to register as a..." onClick={() => setIsOpen(false)}>Register</MobileLink>
                                    <MobileLink href="/contact?subject=Volunteer&message=I am interested in volunteering for..." onClick={() => setIsOpen(false)}>Volunteer</MobileLink>
                                    <MobileLink href="/partnership" onClick={() => setIsOpen(false)}>Sponsorship</MobileLink>
                                    <a href="https://ambassadors.nrsa.com.ng" target="_blank" rel="noopener noreferrer" className="block py-2 text-base text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Ambassadors</a>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Contact Specific Link (No Accordion needed if single, but user said 'categories') */}
                            <div className="py-4 border-b">
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-lg cursor-pointer"
                                >
                                    Contact
                                </Link>
                            </div>

                        </Accordion>

                        <div className="mt-8 space-y-6">
                            <Link href="/contact?subject=Join NRSA&message=I would like to join the NRSA as...">
                                <Button className="w-full text-lg py-6 rounded-xl font-bold">Join NRSA</Button>
                            </Link>

                            <div className="flex items-center justify-center gap-6 text-muted-foreground pt-6 border-t">
                                <a href="https://facebook.com/rsfederation_ng" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Facebook className="w-6 h-6" /></a>
                                <a href="https://twitter.com/rsfederation_ng" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Twitter className="w-6 h-6" /></a>
                                <a href="https://instagram.com/rsfederation_ng" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Instagram className="w-6 h-6" /></a>
                                <a href="https://www.youtube.com/@rsfederation_ng" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Youtube className="w-6 h-6" /></a>
                                <a href="https://linkedin.com/in/rsfederation_ng" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Linkedin className="w-6 h-6" /></a>
                            </div>
                        </div>

                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
    const isExternal = href?.startsWith("http");

    if (isExternal) {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        href={href}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }

    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href!}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                        className
                    )}
                    onClick={(e) => {
                        // Forward ref if needed or handle click
                    }}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

const MobileLink = ({ href, children, onClick }: { href: string; children: React.ReactNode, onClick: () => void }) => (
    <Link
        href={href}
        onClick={onClick}
        className="block py-2 text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer"
    >
        {children}
    </Link>
);
