import { Container } from "@/components/container";
import { Stagger, Item } from "@/components/anim";
import { BackButton } from "@/components/back-button";
import { siteConfig } from "@/config/site";
import { LinksClient } from "@/components/links-client";

export const metadata = {
  title: "Links",
  description: "All my links in one place",
};

export default function LinksPage() {
  return (
    <Container>
      <div className="mb-24"></div>
      <Stagger>
        <Item fromY={20}><div className="mt-6 mb-2"><BackButton /></div></Item>
        <Item fromY={20}><h1 className="text-2xl font-semibold mt-10 mb-6">Links</h1></Item>
        <LinksClient links={siteConfig.links} />
      </Stagger>
    </Container>
  );
}
