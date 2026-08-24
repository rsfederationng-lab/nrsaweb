import React from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollFade } from "@/components/animations/ScrollFade";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service"
        description="Read the NRSA Terms of Service — the rules, responsibilities, and conditions governing use of the Nigeria Rope Skipping Association website and services."
        path="/terms-of-service"
        pageType="WebPage"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Rules and guidelines for using the NRSA website and participating in our activities.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollFade>
            <Card className="border-border">
              <CardContent className="p-8 md:p-12 prose prose-stone max-w-none dark:prose-invert">
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing and using the Nigeria Rope Skipping Association (NRSA) website ("Site"), you accept and agree to be bound by the terms and provision of this agreement. 
                </p>

                <h3>2. About NRSA</h3>
                <p>
                  The NRSA is a CAC Registered Sports Federation and the official governing body for rope skipping in Nigeria. We are affiliated with the International Jump Rope Union (IJRU) and the International Rope Skipping Organization (IRSO).
                </p>

                <h3>3. Use of the Site</h3>
                <p>
                  You agree to use the Site only for lawful purposes. You are prohibited from violating or attempting to violate the security of the Site, including accessing data not intended for you, or attempting to probe, scan, or test the vulnerability of our systems.
                </p>

                <h3>4. Membership and Registrations</h3>
                <p>
                  When registering as an athlete, club, or school for NRSA events (e.g., Inter-school championships, national selections), you agree to provide accurate, current, and complete information. NRSA reserves the right to suspend or terminate registrations if any information provided is proven to be false or misleading.
                </p>

                <h3>5. Intellectual Property</h3>
                <p>
                  All content included on this Site, such as text, graphics, logos, images, audio clips, and digital downloads, is the property of the NRSA or its content suppliers and protected by copyright laws. You may not reproduce, distribute, or otherwise use such material without explicit permission from the NRSA.
                </p>

                <h3>6. Athlete Conduct</h3>
                <p>
                  As an organization representing Nigeria on the global stage, we hold our athletes, coaches, and clubs to the highest standards of sportsmanship. Any behavior deemed detrimental to the sport or the association, whether online or off, may result in disciplinary action.
                </p>

                <h3>7. Limitation of Liability</h3>
                <p>
                  The NRSA will not be liable for any damages of any kind arising from the use of this site or from participation in our events, including, but not limited to direct, indirect, incidental, punitive, and consequential damages, unless otherwise specified in writing.
                </p>

                <h3>8. Changes to Terms</h3>
                <p>
                  We reserve the right to modify these terms at any time. Your continued use of the Site following any changes indicates your acceptance of the new Terms of Service.
                </p>

                <h3>9. Contact Information</h3>
                <p>
                  For any questions regarding these terms, please contact us at <strong>rsfederationng@gmail.com</strong> or call <strong>+2347069465965</strong>.
                </p>

                <p className="text-sm text-muted-foreground mt-8">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </ScrollFade>
        </div>
      </section>
    </div>
  );
}
