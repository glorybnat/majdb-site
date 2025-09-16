import React from "react";

type CalloutProps = {
  type?: "info" | "warn" | "error" | "success";
  title?: string;
  children?: React.ReactNode;
};

const styles: Record<NonNullable<CalloutProps["type"]>, { border: string; bg: string }> = {
  info: { border: "border-sky-500/40", bg: "bg-sky-500/5" },
  warn: { border: "border-amber-500/40", bg: "bg-amber-500/5" },
  error: { border: "border-red-500/40", bg: "bg-red-500/5" },
  success: { border: "border-emerald-500/40", bg: "bg-emerald-500/5" },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const s = styles[type];
  return (
    <div className={`my-4 rounded-md border ${s.border} ${s.bg} p-3`}> 
      {title && <div className="mb-1 text-sm font-semibold">{title}</div>}
      <div className="text-sm leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-black/20 bg-black/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground/70">
      {children}
    </span>
  );
}

export function YouTube({ id, title }: { id: string; title?: string }) {
  return (
    <div className="my-4 aspect-video w-full overflow-hidden rounded-md border border-black/10 bg-black/5">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
