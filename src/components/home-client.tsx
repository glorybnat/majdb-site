"use client";
import Image from "next/image";
import Link from "next/link";
import { Stagger, Item, FadeUp } from "@/components/anim";
import { NavLink } from "@/components/nav-link";
import { ZigzagDivider } from "@/components/zigzag-divider";
import type { MDXEntry } from "@/lib/mdx";
import type { SiteConfig } from "@/config/site";
import { WavingHand } from "./emoji-wave";

export function HomeClient({
  projects,
  articles,
  site,
}: {
  projects: MDXEntry[];
  articles: MDXEntry[];
  site: SiteConfig;
}) {
  const projectStagger = 0.05;
  const projectDuration = 0.25;
  const projectsListDelay = 0.05; // ensure header appears just before list
  const articlesDelayBase =
    (projects.length > 0
      ? projectDuration + projectStagger * Math.max(projects.length - 1, 0)
      : 0) + 0.1; // small gap between sections
  const dividerDelay = Math.max(0, articlesDelayBase - 0.05);
  const articlesHeaderDelay = articlesDelayBase;
  const articlesListDelay = articlesDelayBase + 0.05;
  return (
    <section className="mt-16">
      <Stagger>
        <div id="logo" className="flex items-center gap-4">
          <Item blur={2}>
            <Image src="/me.jpg" alt="Profile" width={56} height={56} className="rounded-full" />
          </Item>
          <div>
            <Item><h1 className="text-2xl font-semibold">{site.author} <WavingHand trigger="loop" repeatDelay={3} size={24} /></h1></Item>
            <Item><p className="text-[15px] opacity-80">{site.blurb[0]}</p></Item>
          </div>
        </div>

        <div id="links" className="flex gap-4 text-sm mt-5">
          <Item><a href={site.links.github} target="_blank" rel="noreferrer" className="underline transition-transform hover:scale-105 hover:-translate-y-1">GitHub</a></Item>
          <Item><a href={site.links.twitter} target="_blank" rel="noreferrer" className="underline transition-transform hover:scale-105 hover:-translate-y-1">Twitter/X</a></Item>
          <Item><a href={site.links.linkedin} target="_blank" rel="noreferrer" className="underline transition-transform hover:scale-105 hover:-translate-y-1">LinkedIn</a></Item>
          <Item>/</Item>
          <Item><a href={site.links.all} rel="noreferrer" className="underline transition-transform hover:scale-105 hover:-translate-y-1">All Links</a></Item>
        </div>

        <div id="projects" className="mt-10 space-y-10">
          <section>
            <FadeUp>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-xl font-semibold">Recent Projects</h2>
                <NavLink href="/projects" className="text-sm underline">All projects →</NavLink>
              </div>
            </FadeUp>
            {projects.length === 0 ? (
              <Item fromY={20} duration={0.18}>
                <div className="rounded-md border border-black/10 p-6 text-foreground/70">
                  <p>No projects yet. Stay tuned!</p>
                </div>
              </Item>
            ) : (
              <Stagger delay={projectsListDelay}>
                <ul className="space-y-4">
                  {projects.map((p) => (
                    <Item key={p.slug} fromY={20}>
                      <li className="group border border-black/10 rounded-md p-4 hover:bg-black/5 transition">
                        <Link href={`/projects/${p.slug}`} className="block">
                          <div className="flex items-baseline justify-between">
                            <h2 className="text-lg font-medium group-hover:underline">{p.frontmatter.title}</h2>
                            <span className="text-xs text-foreground/60">{p.frontmatter.date}</span>
                          </div>
                          {p.frontmatter.description && (
                            <p className="text-sm text-foreground/70">{p.frontmatter.description}</p>
                          )}
                        </Link>
                      </li>
                    </Item>
                  ))}
                </ul>
              </Stagger>
            )}
          </section>

          <Item fromY={0} duration={0.25}>
            <FadeUp delay={dividerDelay}>
              <ZigzagDivider />
            </FadeUp>
          </Item>

          <section>
            <FadeUp delay={articlesHeaderDelay}>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-xl font-semibold">Recent Articles</h2>
                <NavLink href="/articles" className="text-sm underline">All articles →</NavLink>
              </div>
            </FadeUp>
            {articles.length === 0 ? (
              <Item>
                <div className="rounded-md border border-black/10 p-6 text-foreground/70">
                  <p>No articles yet. Check back soon!</p>
                </div>
              </Item>
            ) : (
              <Stagger delay={articlesListDelay}>
                <ul className="space-y-4">
                  {articles.map((a) => (
                    <Item key={a.slug} fromY={20}>
                      <li className="group border border-black/10 rounded-md p-4 hover:bg-black/5 transition">
                        <Link href={`/articles/${a.slug}`} className="block">
                          <div className="flex items-baseline justify-between">
                            <h2 className="text-lg font-medium group-hover:underline">{a.frontmatter.title}</h2>
                            <span className="text-xs text-foreground/60">{a.frontmatter.readingTime}</span>
                          </div>
                          {a.frontmatter.description && (
                            <p className="text-sm text-foreground/70">{a.frontmatter.description}</p>
                          )}
                        </Link>
                      </li>
                    </Item>
                  ))}
                </ul>
              </Stagger>
            )}
          </section>
        </div>

        <footer id="footer" className="mt-8">
          <Stagger stagger={0.15}>
            <Item duration={0.1}><p className="text-xs text-foreground/60">© {new Date().getFullYear()} glorybnat • <a href="https://github.com/glorybnat/majdb-site" target="_blank" rel="noreferrer" className="hover:underline text-foreground/80">source code</a></p></Item>
          </Stagger>
        </footer>
      </Stagger>
    </section>
  );
}
