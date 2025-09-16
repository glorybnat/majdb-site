import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { MDXContent } from "@/components/mdx-content";
import { getAllSlugs, getEntry } from "@/lib/mdx";
import { BackButton } from "@/components/back-button";
import { Stagger, Item } from "@/components/anim";
import { FadeUp } from "@/components/anim";
import GradualBlur from "@/components/gradual-blur";
import { IconExternal, IconGitHub } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs("projects").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const { slug } = await params;
    const entry = getEntry("projects", slug);
    return {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      openGraph: {
        title: entry.frontmatter.title,
        description: entry.frontmatter.description,
        type: "article",
        url: `/projects/${slug}`,
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

export default async function ProjectPage({ params }: Params) {
  try {
  const { slug } = await params;
  const entry = getEntry("projects", slug);
    return (
      <Container>
        <div className="mb-24"></div>
        <GradualBlur target="page" position="top" height="5rem" strength={1} className="pointer-events-none" />
        <Stagger>
          <Item><div className="mt-6 mb-2"><BackButton /></div></Item>
          <Item><h1 className="text-3xl font-semibold mt-10 mb-4">{entry.frontmatter.title}</h1></Item>
          <Item>
            <div className="mb-8 flex items-center justify-between text-sm text-foreground/60">
              <p>{entry.frontmatter.date}</p>
              {(entry.frontmatter.repo || entry.frontmatter.external) && (
                <div className="flex items-center gap-4 text-foreground/70">
                  {entry.frontmatter.repo && (
                    <a
                      href={entry.frontmatter.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      <IconGitHub className="opacity-80" />
                      <span>Repo</span>
                    </a>
                  )}
                  {entry.frontmatter.external && (
                    <a
                      href={entry.frontmatter.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Visit</span>
                      <IconExternal className="opacity-80" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </Item>
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
