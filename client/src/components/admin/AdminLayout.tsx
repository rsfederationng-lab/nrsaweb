import React from "react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Home as HomeIcon,
  Newspaper,
  Calendar,
  Users,
  Trophy,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  LogOut,
  ShieldCheck,
  Menu,
  Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoUrl from "@assets/nrsf-logo_1761313307811.jpg";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout Component
 * 
 * Provides the admin dashboard layout with:
 * - JWT authentication check: Redirects to login if no token is found
 * - Sidebar navigation with all admin sections (Responsive: Sheet on mobile, Sidebar on desktop)
 * - Logout functionality that clears the JWT token
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // JWT Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  const navItems = [
    { label: "Dashboard", path: "/admin-nrsa-dashboard", icon: LayoutDashboard },
    { label: "Hero Slides", path: "/admin-nrsa-dashboard/hero-slides", icon: HomeIcon },
    { label: "News", path: "/admin-nrsa-dashboard/news", icon: Newspaper },
    { label: "Events", path: "/admin-nrsa-dashboard/events", icon: Calendar },
    { label: "Interschool", path: "/admin-nrsa-dashboard/interschool", icon: Trophy },
    { label: "Players", path: "/admin-nrsa-dashboard/players", icon: Users },
    { label: "Clubs", path: "/admin-nrsa-dashboard/clubs", icon: Trophy },
    { label: "Leaders", path: "/admin-nrsa-dashboard/leaders", icon: Users },
    { label: "Media", path: "/admin-nrsa-dashboard/media", icon: ImageIcon },
    { label: "Affiliations", path: "/admin-nrsa-dashboard/affiliations", icon: Handshake },
    { label: "Member State", path: "/admin-nrsa-dashboard/Memberstate", icon: LinkIcon },
    { label: "Contact Messages", path: "/admin-nrsa-dashboard/contacts", icon: Mail },
    { label: "Site Content", path: "/admin-nrsa-dashboard/site-content", icon: ImageIcon },
    { label: "Ambassadors", path: "/admin-nrsa-dashboard/ambassadors", icon: Users },
    { label: "Manage Admins", path: "/admin-nrsa-dashboard/admins", icon: ShieldCheck },
    { label: "Site Settings", path: "/admin-nrsa-dashboard/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-primary text-primary-foreground">
      {/* Logo */}
      <div className="p-6 border-b border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="NRSA Logo" className="h-12 w-auto" />
          <div>
            <div className="font-bold text-lg">NRSA</div>
            <div className="text-xs opacity-90">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                onClick={() => setIsMobileOpen(false)} // Close sheet on mobile click
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer
                    transition-all
                    ${isActive
                    ? "bg-primary-foreground/20 border-l-4 border-white"
                    : "hover-elevate active-elevate-2"
                  }
                  `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary-foreground/10">
        <Button
          variant="destructive"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-none w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="text-sm text-muted-foreground hidden sm:block">
              Admin Portal / {navItems.find(item => item.path === location)?.label || "Dashboard"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Administrator</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
