export type Blog = {
  id: string;
  title: string;
  content: Array<{ type: "p"; text: string }>;
};

export const blogs: Blog[] = [
  {
    id: "hello-world",
    title: "Hello World",
    content: [
      { type: "p", text: "This is a sample blog entry rendered from a TS object." },
    ],
  },
];
