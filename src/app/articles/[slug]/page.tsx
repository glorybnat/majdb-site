import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { MDXContent } from "@/components/mdx-content";
import { getAllSlugs, getEntry } from "@/lib/mdx";
import { BackButton } from "@/components/back-button";
import { Stagger, Item } from "@/components/anim";
import { FadeUp } from "@/components/anim";
import GradualBlur from "@/components/gradual-blur";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs("articles").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
  const { slug } = await params;
  const entry = getEntry("articles", slug);
    return {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      openGraph: {
        title: entry.frontmatter.title,
        description: entry.frontmatter.description,
        type: "article",
        url: `/articles/${slug}`,
        images: [
          {
            url: entry.frontmatter.image || "/og-default.png",
            width: 1200,
            height: 630,
            alt: entry.frontmatter.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: entry.frontmatter.title,
        description: entry.frontmatter.description,
        images: [entry.frontmatter.image || "/og-default.png"],
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: Params) {
  try {
  const { slug } = await params;
  const entry = getEntry("articles", slug);
    return (
      <Container>
        <div className="mb-24"></div>
        <GradualBlur target="page" position="top" height="5rem" strength={1} className="pointer-events-none" />
        <Stagger>
          <Item><div className="mt-6 mb-2"><BackButton /></div></Item>
          <Item><h1 className="text-3xl font-semibold mt-10 mb-4">{entry.frontmatter.title}</h1></Item>
          <Item><p className="text-sm text-foreground/60 mb-8">{entry.frontmatter.date} • {entry.frontmatter.readingTime}</p></Item>
          {entry.frontmatter.tags && entry.frontmatter.tags.length > 0 && (
            <Item>
              <div className="mb-6 flex flex-wrap gap-2">
                {entry.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[11px] text-foreground/80 hover:text-foreground hover:bg-black/5 transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Item>
          )}
        </Stagger>
        <FadeUp>
          <div>
            <MDXContent source={entry.content} />
            <div className="mb-32"></div>
          </div>
        </FadeUp>
        <GradualBlur target="page" position="bottom" height="5rem" strength={1} className="pointer-events-none" />
      </Container>
    );
  } catch {
    notFound();
  }
}
