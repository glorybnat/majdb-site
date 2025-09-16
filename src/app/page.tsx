import { siteConfig } from "@/config/site";
import { Container } from "@/components/container";
import { getList } from "@/lib/mdx";
import { HomeClient } from "@/components/home-client";

export default function Home() {
  const projects = getList("projects").slice(0, 3);
  const articles = getList("articles").slice(0, 3);
  return (
    <Container>
      <HomeClient projects={projects} articles={articles} site={siteConfig} />
    </Container>
  );
}
