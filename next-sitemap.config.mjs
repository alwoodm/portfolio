/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  sitemapSize: 5000,
};

export default config;
