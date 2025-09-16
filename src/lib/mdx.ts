import 'server-only';
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import readingTime from "reading-time";

export type MDXFrontmatter = {
  title: string;
  description?: string;
  date?: string; // always normalized to YYYY-MM-DD
  tags?: string[];
  draft?: boolean;
  external?: string;
  repo?: string;
  image?: string;
};

export type MDXEntry = {
  slug: string;
  content: string;
  frontmatter: MDXFrontmatter & { readingTime: string };
};

const contentDir = (type: "articles" | "projects") =>
  path.join(process.cwd(), "content", type);

export function getAllSlugs(type: "articles" | "projects") {
  const dir = contentDir(type);
  if (!fs.existsSync(dir)) return [] as string[];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getEntry(type: "articles" | "projects", slug: string): MDXEntry {
  const full = path.join(contentDir(type), `${slug}.mdx`);
  const raw = fs.readFileSync(full, "utf8");
  const { content, data } = matter(raw);
  const stats = readingTime(content);
  // Normalize date to ISO date string (YYYY-MM-DD)
  const normalizeDate = (d: unknown): string | undefined => {
    if (!d) return undefined;
    if (typeof d === "string") return d;
    if (d instanceof Date) return d.toISOString().slice(0, 10);
    try {
      const maybe = new Date(String(d));
      return isNaN(maybe.getTime()) ? undefined : maybe.toISOString().slice(0, 10);
    } catch {
      return undefined;
    }
  };

  const fm = {
    title: data.title ?? slug,
    description: data.description ?? "",
    date: normalizeDate(data.date),
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    external: data.external ?? undefined,
    repo: data.repo ?? undefined,
    image: data.image ?? undefined,
    readingTime: stats.text,
  } as MDXFrontmatter & { readingTime: string };
  return { slug, content, frontmatter: fm };
}

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
    format: "mdx" as const,
  },
};

export function getList(type: "articles" | "projects") {
  return getAllSlugs(type)
    .map((slug) => getEntry(type, slug))
    .filter((e) => !e.frontmatter.draft)
    .sort((a, b) => {
      const ad = a.frontmatter.date ? Date.parse(a.frontmatter.date) : 0;
      const bd = b.frontmatter.date ? Date.parse(b.frontmatter.date) : 0;
      return isNaN(bd - ad) ? 0 : bd - ad;
    });
}
