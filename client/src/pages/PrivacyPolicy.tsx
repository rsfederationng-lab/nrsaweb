import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollFade } from "@/components/animations/ScrollFade";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy - NRSA</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            How the Nigeria Rope Skipping Association (NRSA) handles your data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollFade>
            <Card className="border-border">
              <CardContent className="p-8 md:p-12 prose prose-stone max-w-none dark:prose-invert">
                <h3>1. Introduction</h3>
                <p>
                  The Nigeria Rope Skipping Association ("NRSA", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, register for events, or participate in our programs.
                </p>

                <h3>2. Information We Collect</h3>
                <p>
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul>
                  <li>Register as an athlete, coach, or official.</li>
                  <li>Sign up for newsletters or updates.</li>
                  <li>Register for local, state, or international competitions (e.g., Inter-school championships).</li>
                  <li>Contact us via email, phone, or through our website forms.</li>
                </ul>
                <p>
                  This information may include your name, email address, phone number, date of birth, state of residence, and club/school affiliations.
                </p>

                <h3>3. How We Use Your Information</h3>
                <p>
                  We use the collected information for the following purposes:
                </p>
                <ul>
                  <li>To facilitate your registration in NRSA events and programs.</li>
                  <li>To communicate important updates, news, and technical guidelines.</li>
                  <li>To coordinate with international bodies such as IJRU and IRSO for athlete placements and records.</li>
                  <li>To improve our Website and the delivery of our grassroots and elite programs.</li>
                </ul>

                <h3>4. Sharing Your Information</h3>
                <p>
                  We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our partners. Furthermore, athlete registration data may be shared with affiliated bodies like the International Jump Rope Union (IJRU) or the International Rope Skipping Organization (IRSO) solely for the purpose of international competition eligibility and verification.
                </p>

                <h3>5. Data Security</h3>
                <p>
                  We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information and data stored on our Site.
                </p>

                <h3>6. Changes to This Privacy Policy</h3>
                <p>
                  NRSA has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage users to frequently check this page for any changes.
                </p>

                <h3>7. Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul>
                  <li><strong>Email:</strong> rsfederationng@gmail.com</li>
                  <li><strong>Phone:</strong> +2347069465965</li>
                  <li><strong>Address:</strong> Lagos, Nigeria</li>
                </ul>
                
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
