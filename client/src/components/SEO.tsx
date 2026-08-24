import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL  = 'https://nrsa.com.ng';
const LOGO_URL  = `${BASE_URL}/nrsf-logo.png`;
const SITE_NAME = 'Nigeria Rope Skipping Association';
const SITE_SHORT = 'NRSA';

interface SEOProps {
  /** Page-specific title — do NOT append "| NRSA" here, it is added automatically */
  title: string;
  description: string;
  /** Absolute URL for the OG/Twitter share image. Defaults to the NRSA logo. */
  image?: string;
  /** Full canonical URL for this page. Pass the full path, e.g. "/about". */
  path?: string;
  /** Schema.org @type for the page — "WebPage" or "AboutPage" etc. */
  pageType?: string;
  /** Set true only on the homepage to include the SportsOrganization JSON-LD block */
  isHome?: boolean;
  /** Optional breadcrumb list: [{name, url}] */
  breadcrumbs?: { name: string; url: string }[];
}

export function SEO({
  title,
  description,
  image = LOGO_URL,
  path = '/',
  pageType = 'WebPage',
  isHome = false,
  breadcrumbs,
}: SEOProps) {
  const canonicalUrl = `${BASE_URL}${path === '/' ? '' : path}`;
  const fullTitle    = isHome ? `${SITE_NAME} | Official Governing Body` : `${title} | ${SITE_SHORT}`;
  const ogImage      = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  // SportsOrganization — homepage only
  const orgSchema = isHome ? {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: SITE_NAME,
    alternateName: SITE_SHORT,
    url: BASE_URL,
    logo: LOGO_URL,
    sameAs: [
      'https://www.facebook.com/nrsfng',
      'https://www.instagram.com/Rsfederation_ng',
      'https://twitter.com/Rsfederation_ng',
    ],
    description,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'rsfederationng@gmail.com',
      contactType: 'customer support',
    },
  } : null;

  // WebPage / inner-page schema
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: fullTitle,
    description,
    url: canonicalUrl,
    isPartOf: { '@id': BASE_URL },
    inLanguage: 'en-NG',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  };

  // BreadcrumbList — always include when breadcrumbs provided
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      ...breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: b.name,
        item: `${BASE_URL}${b.url}`,
      })),
    ],
  } : null;

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* ── Open Graph ── */}
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:type"        content={isHome ? 'website' : 'article'} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:image:alt"   content={`${SITE_NAME} logo`} />
      <meta property="og:locale"      content="en_NG" />

      {/* ── Twitter ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@Rsfederation_ng" />
      <meta name="twitter:url"         content={canonicalUrl} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* ── JSON-LD — must be a raw string child, not JSX interpolation ── */}
      {orgSchema && (
        <script type="application/ld+json">{`${JSON.stringify(orgSchema)}`}</script>
      )}
      <script type="application/ld+json">{`${JSON.stringify(pageSchema)}`}</script>
      {breadcrumbSchema && (
        <script type="application/ld+json">{`${JSON.stringify(breadcrumbSchema)}`}</script>
      )}
    </Helmet>
  );
}
