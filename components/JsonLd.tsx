// JSON-LD Structured Data Components for SEO
// Use these in page layouts to add schema.org markup

import {
  generateProductSchema,
  generateOrganizationSchema,
  generateFAQSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo';

// Generic JSON-LD wrapper
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Pre-configured schema components
export function ProductJsonLd() {
  return <JsonLd data={generateProductSchema()} />;
}

export function OrganizationJsonLd() {
  return <JsonLd data={generateOrganizationSchema()} />;
}

export function FAQJsonLd() {
  return <JsonLd data={generateFAQSchema()} />;
}

export function WebsiteJsonLd() {
  return <JsonLd data={generateWebsiteSchema()} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return <JsonLd data={generateBreadcrumbSchema(items)} />;
}

// Combine multiple schemas for the homepage
export function HomepageJsonLd() {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <ProductJsonLd />
      <FAQJsonLd />
    </>
  );
}

// For pricing/checkout pages
export function PricingJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clawdbot.ai';
  
  return (
    <>
      <ProductJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteUrl },
          { name: 'Pricing', url: `${siteUrl}/checkout` },
        ]}
      />
    </>
  );
}
