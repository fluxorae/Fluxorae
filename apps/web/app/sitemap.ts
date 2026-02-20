import type { MetadataRoute } from 'next';

const routes = ['', '/services', '/about', '/case-studies', '/careers', '/contact', '/app', '/app/login'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `https://fluxorae.com${route}`,
    lastModified: now,
    changeFrequency: route.startsWith('/app') ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
