import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { RevealImg, RevealVideo } from "@/components/media-reveal";
import { CodeBlock } from "@/components/mdx/code-block";
import { MDXTable, Th, Td } from "@/components/mdx/table";
import { Callout, Badge, YouTube } from "@/components/mdx/shortcodes";
import { ZigzagDivider } from "@/components/zigzag-divider";

export function MDXContent({ source }: { source: string }) {
  return (
    <article className="content">
      {/* RSC MDX rendering with consistent plugins */}
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypeAutolinkHeadings, { behavior: "wrap" }], rehypeSlug],
            format: "mdx",
          },
          parseFrontmatter: false,
        }}
        components={{
          img: (props: React.ComponentProps<typeof RevealImg>) => <RevealImg {...props} />,
          video: (props: React.ComponentProps<typeof RevealVideo>) => <RevealVideo {...props} />,
          pre: (props: React.ComponentProps<"pre">) => <CodeBlock {...props} />,
          ul: (props: React.ComponentProps<"ul">) => (
            <ul
              {...props}
              className={[
                "my-4 ml-6 list-disc marker:text-foreground/60",
                "space-y-2",
                (props.className ?? ""),
              ].join(" ")}
            />
          ),
          ol: (props: React.ComponentProps<"ol">) => (
            <ol
              {...props}
              className={[
                "my-4 ml-6 list-decimal marker:font-medium marker:text-foreground/70",
                "space-y-2",
                (props.className ?? ""),
              ].join(" ")}
            />
          ),
          li: (props: React.ComponentProps<"li">) => (
            <li
              {...props}
              className={[
                "leading-relaxed",
                "pl-1",
                (props.className ?? ""),
              ].join(" ")}
            />
          ),
          table: (props: React.ComponentProps<"table">) => <MDXTable {...props} />,
          th: (props: React.ComponentProps<"th">) => <Th {...props} />,
          td: (props: React.ComponentProps<"td">) => <Td {...props} />,
          hr: () => <ZigzagDivider className="opacity-80 my-8" waves={48} amplitude={2} strokeWidth={0.45} heightPx={12} />,
          Callout,
          Badge,
          YouTube,
        }}
      />
    </article>
  );
}
