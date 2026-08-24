import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/nrsf-logo_1761313307811.jpg";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Competitions", path: "/competitions" }, // <-- added here, right after About
    { label: "News", path: "/news" },
    { label: "Events", path: "/events" },
    { label: "Players", path: "/players" },
    { label: "Clubs", path: "/clubs" },
    { label: "Member States", path: "/member-states" },
    { label: "Leaders", path: "/leaders" },
    { label: "Media", path: "/media" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar with Phone */}
   <div className="bg-primary text-primary-foreground">
  <div className="max-w-7xl mx-auto px-6 md:px-12 py-2 flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 mb-1 sm:mb-0">
      <span className="font-medium">NIGERIA ROPE SKIPPING ASSOCIATION</span>
    </div>
    <div className="text-xs text-center sm:text-right">
      Official Governing Body for Rope Skipping in Nigeria
    </div>
  </div>
</div>
            
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
 <Link href="/" data-testid="link-home">
  <div className="flex items-center gap-2 cursor-pointer">
    <img
      src={logoUrl}
      alt="NRSA Logo"
      className="h-12 w-auto object-contain"
      data-testid="img-logo"
    />
    <div className="flex flex-col">
      <span className="font-bold text-base sm:text-lg text-foreground leading-tight whitespace-nowrap truncate">
  NRSA
</span>
      <span className="text-xs text-muted-foreground hidden sm:block">
  NIGERIA ROPE SKIPPING ASSOCIATION
</span>
    </div>
  </div>
</Link>
             

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-nav-${item.label.toLowerCase()}`}>
                <div
                  className={`
                    px-4 py-2 rounded-md font-medium text-sm cursor-pointer
                    hover-elevate active-elevate-2 transition-all
                    ${location === item.path ? "text-primary" : "text-foreground"}
                  `}
                >
                  {item.label}
                  {location === item.path && (
                    <div className="h-0.5 bg-primary mt-1 rounded-full" />
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[128px] bg-primary z-50">
          <nav className="flex flex-col p-6 gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-md font-semibold text-lg cursor-pointer
                    ${location === item.path ? "bg-white text-primary" : "text-white hover-elevate active-elevate-2"}
                  `}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
