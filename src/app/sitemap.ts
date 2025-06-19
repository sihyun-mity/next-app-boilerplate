import fs from 'fs';
import path from 'path';

import type { MetadataRoute } from 'next';

const siteConfig = {
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com',
};

// Recursively collect all pages with `page.tsx` or `page.jsx`
function getStaticRoutes(dir = 'src/app', parentPath = ''): string[] {
  const currentDir = path.join(process.cwd(), dir);
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  let routes: string[] = [];

  for (const entry of entries) {
    // Ignore all slots since they aren't route segments and do not affect the URL structure
    if (entry.name.startsWith('@')) {
      continue;
    }

    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      const routePath = path.join(parentPath, entry.name);

      // Check if this directory has a page.tsx or page.jsx file
      const hasPage = ['page.tsx', 'page.jsx'].some((file) => fs.existsSync(path.join(fullPath, file)));

      if (hasPage) routes.push(`/${routePath}`);

      // Continue scanning nested folders recursively
      const nestedRoutes = getStaticRoutes(path.join(dir, entry.name), routePath);

      routes = routes.concat(nestedRoutes);
    }
  }

  return parentPath === '' ? ['/', ...routes] : routes;
}

// Get dynamic routes by calling `generateStaticParams` from dynamic pages
async function getDynamicRoutes({
  prefix,
  dynamicSegment,
  suffix = '',
}: {
  prefix: string;
  dynamicSegment: string;
  suffix?: string;
}): Promise<string[]> {
  try {
    const { generateStaticParams } = await import(`./${prefix}/[${dynamicSegment}]${suffix}/page`);
    const params = await generateStaticParams();

    // Remove catch all route syntax
    const paramName = dynamicSegment.match(/^\[?(?:\.\.\.)?(.+?)]?$/)?.at(1);

    return paramName
      ? params.map(
          (route: { [segment: string]: string }) =>
            `/${prefix.replace(/\(.*?\)/g, '')}/${Array.isArray(route[paramName]) ? route[paramName].join('/') : route[paramName]}${suffix}`,
        )
      : [];
  } catch (error) {
    console.error('Error loading dynamic routes:', error);
    return []; // Return an empty array on error
  }
}

function escapeXmlEntities(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generateRoutes = (
    await Promise.all(
      getStaticRoutes().map((route) => {
        const matches = route.match(/^\/(.*?)(?:\/\[(.+)](.*?))?$/);

        const prefix = matches?.at(1);
        const dynamicSegment = matches?.at(2);
        const suffix = matches?.at(3);

        if (!prefix || !dynamicSegment) {
          return route;
        }

        return getDynamicRoutes({ prefix, dynamicSegment, suffix });
      }),
    )
  )
    .flat()
    // Filter exclude routes
    .filter((route) => !['/error', '/route-to-exclude'].includes(route))
    // Remove route groups
    .map((route) => route.replace(/\/\([^/]+?\)(?=\/|$)/g, ''))
    // Filter root dot route
    .filter((route) => route && route !== '/.');

  return [...generateRoutes].map((route) => {
    const encodedUrl = encodeURI(`${siteConfig.url}${route}`);
    const xmlUrl = escapeXmlEntities(encodedUrl);

    return {
      url: xmlUrl,
      lastModified: new Date().toISOString(),
      priority: ['/', '/route-to-important'].includes(route) ? 1 : 0.8,
    };
  });
}
