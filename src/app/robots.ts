import type { MetadataRoute } from "next";

// Tells search engines what to look at: listings yes, private pages no.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/edit-link", "/api/", "/b/*/edit", "/b/*/report"] },
    sitemap: "https://www.sweetmain.com/sitemap.xml",
  };
}
