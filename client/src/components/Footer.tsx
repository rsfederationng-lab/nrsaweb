import React from "react";
import { Link } from "wouter";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoUrl from "@assets/nrsf-logo_1761313307811.jpg";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About NRSA */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logoUrl} alt="NRSA Logo" className="h-12 w-auto" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-8 bg-[#009739]" />
                <div className="w-2 h-8 bg-white" />
                <div className="w-2 h-8 bg-[#009739]" />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nigeria Rope Skipping Association (NRSA) is the official governing
              body for rope skipping in Nigeria, affiliated with IJRU and IRSO.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#009739]">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Home", path: "/" },
                { label: "About", path: "/about" },
                { label: "News", path: "/news" },
                { label: "Events", path: "/events" },
                { label: "Players", path: "https://skippers.nrsa.com.ng" },
                { label: "Clubs", path: "/clubs" },

              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  data-testid={`link-footer-${item.label.toLowerCase()}`}
                >
                  <span className="text-sm text-gray-400 hover:text-[#009739] transition-colors cursor-pointer">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#009739]">Contact Info</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-[#009739]" />
                <span data-testid="text-footer-phone">+2347069465965</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-[#009739]" />
                <span>rsfederationng@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#009739]" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex gap-2 flex-wrap">
                <a
                  href="https://www.facebook.com/RSfederation_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-[#009739]"
                    data-testid="button-social-facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                </a>

                <a
                  href="https://x.com/RSfederation_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-[#009739]"
                    data-testid="button-social-twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </Button>
                </a>

                <a
                  href="https://www.instagram.com/RSfederation_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-[#009739]"
                    data-testid="button-social-instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                </a>

                <a
                  href="https://www.linkedin.com/company/RSfederation_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-[#009739]"
                    data-testid="button-social-linkedin"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </a>

                <a
                  href="https://www.youtube.com/@RSfederation_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-[#009739]"
                    data-testid="button-social-youtube"
                  >
                    <Youtube className="w-5 h-5" />
                  </Button>
                </a>


                <a
                  href="https://www.tiktok.com/@RSfederation_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-[#009739]"
                    data-testid="button-social-tiktok"
                  >
                    <span className="text-xs font-bold">TT</span>
                  </Button>
                </a>

                <a
                  href="https://medium.com/@RSfederation_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-[#009739]"
                    data-testid="button-social-medium"
                  >
                    <span className="text-xs font-bold">M</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#009739]">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Stay updated with latest news and events
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Affiliations */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-sm font-semibold text-[#009739] mb-2">
                Proud Member Of
              </div>
              <div className="flex items-center gap-6">
                <div className="text-white font-bold">IJRU</div>
                <div className="text-white font-bold">IRSO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Nigeria Rope Skipping Association. All rights reserved.</p>
          <p className="mt-2">CAC Registered Sports Federation</p>
          <Link href="/admin/login">
            <span
              className="inline-block mt-4 text-xs text-gray-600 hover:text-gray-500 transition-colors cursor-pointer opacity-50 hover:opacity-100"
              data-testid="link-admin"
            >
              •
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
