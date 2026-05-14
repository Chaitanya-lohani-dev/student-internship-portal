/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: "https://careers.chaitanya-lohani.me",
  
    generateRobotsTxt: true,
  
    robotsTxtOptions: {
      policies: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
    },
  
    changefreq: "daily",
  
    priority: 0.7,
  
    sitemapSize: 5000,
  
    exclude: [
      "/admin",
      "/admin/*",
      "/api/*",
      "/login",
      "/register",
      "/student/applications",
      "/student/applications/*"
    ],
};