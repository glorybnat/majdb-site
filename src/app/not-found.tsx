import Link from "next/link";
import { Container } from "@/components/container";
import { BackButton } from "@/components/back-button";
import { Stagger, Item } from "@/components/anim";

export default function NotFound() {
  return (
    <Container>
      <div className="mb-24" />
      <Stagger>
        <Item>
          <div className="mt-6 mb-2">
            <BackButton />
          </div>
        </Item>
        <Item fromY={20}>
          <h1 className="text-3xl font-semibold mt-10 mb-4">Page not found</h1>
        </Item>
        <Item>
          <p className="text-foreground/70 mb-6">
            Sorry, we couldn’t find what you’re looking for.
          </p>
        </Item>
        <Item>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-black/[0.03] px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ring-offset-2 transition"
          >
            /go-back-home
          </Link>
        </Item>
      </Stagger>
    </Container>
  );
}
