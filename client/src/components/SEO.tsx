import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
    isHome?: boolean;
}

export function SEO({
    title,
    description,
    image = "/images/nrsa-logo.png", // Default image
    url = "https://nrsa.com.ng", // Default URL
    type = "website",
    isHome = false
}: SEOProps) {

    const siteTitle = "Nigeria Rope Skipping Association";
    const fullTitle = title === siteTitle ? title : `${title} | NRSA`;

    // JSON-LD Schema for SportsOrganization (Only on Homepage)
    const organizationSchema = isHome ? {
        "@context": "https://schema.org",
        "@type": "SportsOrganization",
        "name": "Nigeria Rope Skipping Association",
        "alternateName": "NRSF",
        "url": "https://nrsa.com.ng",
        "logo": "https://nrsa.com.ng/images/nrsa-logo.png",
        "sameAs": [
            "https://www.facebook.com/nrsfng",
            "https://www.instagram.com/nrsf_ng",
            "https://www.youtube.com/@nrsfng"
        ],
        "description": "The official governing body for the sport of rope skipping in Nigeria. Promoting grassroots sports, Y-Court competitions, and the National Alpha League."
    } : null;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Schema */}
            {organizationSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(organizationSchema)}
                </script>
            )}
        </Helmet>
    );
}
