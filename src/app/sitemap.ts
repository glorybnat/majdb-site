import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getList } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 0.8, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/articles`, priority: 0.7, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/projects`, priority: 0.7, changeFrequency: "weekly", lastModified: new Date() },
  { url: `${base}/links`, priority: 0.5, changeFrequency: "monthly", lastModified: new Date() },
  ];
  const posts = getList("articles").map((e) => ({
    url: `${base}/articles/${e.slug}`,
    lastModified: e.frontmatter.date ? new Date(e.frontmatter.date) : new Date(),
  }));
  const projs = getList("projects").map((e) => ({
    url: `${base}/projects/${e.slug}`,
    lastModified: e.frontmatter.date ? new Date(e.frontmatter.date) : new Date(),
  }));
  return [...pages, ...posts, ...projs];
}
