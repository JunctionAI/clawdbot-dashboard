// SEO Configuration and Utilities for Clawdbot
// Centralized SEO config for consistent meta tags across the app

import { Metadata } from 'next';

export const siteConfig = {
  name: 'Clawdbot',
  tagline: 'Your Personal AI Agent',
  description: 'Enterprise-grade AI assistant that remembers everything. Automate tasks, manage communications, and boost productivity.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://clawdbot.ai',
  ogImage: '/og-image.png',
  twitterImage: '/twitter-image.png',
  twitterHandle: '@clawdbot',
  creator: 'Clawdbot Team',
  keywords: [
    'AI assistant',
    'personal AI',
    'AI agent',
    'automation',
    'productivity',
    'ChatGPT alternative',
    'AI memory',
    'email automation',
    'task automation',
    'AI workflow',
    'Claude AI',
    'intelligent assistant',
  ],
};

// Generate consistent metadata for pages
export function generateMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;
  
  return {
    title,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    robots: noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.twitterImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
  };
}

// Schema.org Product structured data for pricing pages
export function generateProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Clawdbot',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Organization',
      name: 'Clawdbot',
      url: siteConfig.url,
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        description: '100 messages/month, 5 skills, basic memory',
      },
      {
        '@type': 'Offer',
        name: 'Personal',
        price: '9',
        priceCurrency: 'USD',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        description: '2,000 messages/month, 10 skills, calendar integration',
      },
      {
        '@type': 'Offer',
        name: 'Plus',
        price: '19',
        priceCurrency: 'USD',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        description: '10,000 messages/month, 15 skills, Gmail integration',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '39',
        priceCurrency: 'USD',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        description: 'Unlimited messages, unlimited skills, all integrations',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '2000',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

// Schema.org Organization structured data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Clawdbot',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [
      'https://twitter.com/clawdbot',
      'https://github.com/clawdbot',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@clawdbot.ai',
    },
  };
}

// Schema.org FAQ structured data for common questions
export function generateFAQSchema() {
  const faqs = [
    {
      question: 'What is Clawdbot?',
      answer: 'Clawdbot is an AI-powered personal assistant that remembers everything. Unlike ChatGPT, it maintains context across sessions, integrates with your tools, and works proactively in the background.',
    },
    {
      question: 'How is Clawdbot different from ChatGPT?',
      answer: 'Clawdbot has persistent memory, meaning it remembers your preferences, projects, and past conversations. It also integrates with Gmail, Calendar, Slack, and more to automate real tasks.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start exploring.',
    },
    {
      question: 'How long does setup take?',
      answer: 'Clawdbot can be set up in under 45 seconds. No servers, SSH, or complex configuration required.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. All data is encrypted at rest and in transit using 256-bit SSL. Your data is private and never used to train AI models.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Schema.org WebSite with SearchAction
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Breadcrumb schema generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
