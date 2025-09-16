"use client";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/pfp.jpg" alt="pfp" width={28} height={28} className="rounded-full" />
          <span className="font-medium">{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/articles" className="hover:underline">Articles</Link>
          <Link href="/projects" className="hover:underline">Projects</Link>
          <div className="flex items-center gap-3">
            <a aria-label="GitHub" href={siteConfig.links.github} target="_blank" rel="noreferrer" className="hover:opacity-80">GH</a>
            <a aria-label="Twitter" href={siteConfig.links.twitter} target="_blank" rel="noreferrer" className="hover:opacity-80">X</a>
            <a aria-label="LinkedIn" href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" className="hover:opacity-80">in</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
