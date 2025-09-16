"use client";
import * as React from "react";
import Link from "next/link";
import { Stagger, Item } from "@/components/anim";
import { 
  IconGitHub,
  IconTwitter,
  IconLinkedIn,
  IconMail,
  IconExternal,
  IconInstagram,
  IconMedium,
  IconWhatsApp,
} from "@/components/icons";

type LinkItem = {
  key: string;
  href: string;
  label: string;
  kind: "external" | "internal" | "email";
};

function getIcon(kind: LinkItem["kind"], key: string) {
  if (kind === "email") return <IconMail className="opacity-80" />;
  const k = key.toLowerCase();
  if (k.includes("github")) return <IconGitHub className="opacity-80" />;
  if (k.includes("twitter") || k === "x") return <IconTwitter className="opacity-80" />;
  if (k.includes("linkedin")) return <IconLinkedIn className="opacity-80" />;
  if (k.includes("instagram")) return <IconInstagram className="opacity-80" />;
  if (k.includes("medium")) return <IconMedium className="opacity-80" />;
  if (k.includes("whatsapp")) return <IconWhatsApp className="opacity-80" />;
  return <IconExternal className="opacity-80" />;
}

function toItems(input: Record<string, string>): LinkItem[] {
  return Object.entries(input)
    .filter(([k]) => k !== "all")
    .map(([key, href]) => {
      const kind: LinkItem["kind"] = href.startsWith("mailto:")
        ? "email"
        : href.startsWith("/")
        ? "internal"
        : "external";
      const pretty: Record<string, string> = {
        github: "GitHub",
        twitter: "Twitter/X",
        linkedin: "LinkedIn",
        instagram: "Instagram",
        medium: "Medium",
        whatsapp: "WhatsApp",
        bracken: "My Team - Bracken",
        email: "Email",
      };
      const label = pretty[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
      return { key, href, label, kind };
    });
}

export function LinksClient({ links }: { links: Record<string, string> }) {
  const items = React.useMemo(() => toItems(links), [links]);
  const isSocial = (k: string) => /github|twitter|x|linkedin|instagram|medium|whatsapp|email/i.test(k);
  const socials = items.filter(i => isSocial(i.key));
  const others = items.filter(i => !isSocial(i.key));

  // Order links explicitly for better presentation
  const order = [
    "github",
    "linkedin",
    "twitter",
    "instagram",
    "medium",
    "whatsapp",
    "email",
  ];
  const sortByOrder = (a: LinkItem, b: LinkItem) => {
    const ia = order.indexOf(a.key);
    const ib = order.indexOf(b.key);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  };
  socials.sort(sortByOrder);

  const Section = ({ title, data }: { title: string; data: LinkItem[] }) => (
    <section>
      <Item fromY={20}><h2 className="text-xl font-semibold mb-3">{title}</h2></Item>
      <Stagger>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((item) => (
            <Item key={item.key} fromY={20}>
              <li className="group border border-black/10 rounded-md p-4 hover:bg-black/5 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 h-9 w-9 rounded-md border border-black/10 grid place-items-center bg-black/[0.03]">
                      {getIcon(item.kind, item.key)}
                    </div>
                    <div className="min-w-0">
                      {item.kind === "internal" ? (
                        <Link href={item.href} className="font-medium group-hover:underline">
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          target={item.kind === "external" ? "_blank" : undefined}
                          rel={item.kind === "external" ? "noopener noreferrer" : undefined}
                          className="font-medium group-hover:underline"
                        >
                          {item.label}
                        </a>
                      )}
                      <p className="text-xs text-foreground/60 truncate">
                        {item.kind === "email" ? item.href.replace(/^mailto:/, "") : item.href}
                      </p>
                    </div>
                  </div>
                  {/* actions removed per request */}
                </div>
              </li>
            </Item>
          ))}
        </ul>
      </Stagger>
    </section>
  );

  return (
    <div className="space-y-10">
      {socials.length > 0 && <Section title="Social" data={socials} />}
      {others.length > 0 && <Section title="Other" data={others} />}
    </div>
  );
}
