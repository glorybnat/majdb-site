import Link from "next/link";
import { Container } from "@/components/container";
import { getList } from "@/lib/mdx";
import { Stagger, Item } from "@/components/anim";
import { BackButton } from "@/components/back-button";

export const metadata = {
  title: "All Projects",
  description: "Things I've built",
};

export default function ProjectsPage() {
  const list = getList("projects");
  return (
    <Container>
      <div className="mb-24"></div>
      <Stagger>
        <Item><div className="mt-6 mb-2"><BackButton /></div></Item>
        <Item fromY={20}><h1 className="text-2xl font-semibold mt-10 mb-6">All Projects</h1></Item>
        {list.length === 0 ? (
          <Item>
            <div className="rounded-md border border-black/10 p-6 text-foreground/70">
              <p>No projects yet. Stay tuned!</p>
            </div>
          </Item>
        ) : (
          <ul className="space-y-4">
            {list.map((item) => (
              <Item key={item.slug} fromY={20}>
                <li className="group border border-black/10 rounded-md p-4 hover:bg-black/5 transition">
                  <Link href={`/projects/${item.slug}`} className="block">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-lg font-medium group-hover:underline">
                        {item.frontmatter.title}
                      </h2>
                      <span className="text-xs text-foreground/60">
                        {item.frontmatter.date}
                      </span>
                    </div>
                    {item.frontmatter.description && (
                      <p className="text-sm text-foreground/70">
                        {item.frontmatter.description}
                      </p>
                    )}
                  </Link>
                </li>
              </Item>
            ))}
          </ul>
        )}
      </Stagger>
    </Container>
  );
}
