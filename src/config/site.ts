export const siteConfig = {
  name: "Majd Bnat",
  url: "https://majdb.com",
  description: "Developer • Articles • Projects",
  author: "Majd Bnat",
  blurb: [
    "Programmer and Web Pentester.",
  ],
  links: {
    github: "https://github.com/glorybnat",
    twitter: "https://twitter.com/glorybnat",
    linkedin: "https://www.linkedin.com/in/majban/",
    instagram: "https://www.instagram.com/glorybnat",
    medium: "https://medium.com/@glorybnat",
    whatsapp: "https://wa.me/962782501938",
    bracken: "https://bracken.team/",
    all: "/links",
    email: "mailto:hey@majdb.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
