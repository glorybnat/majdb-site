"use client";
import React from "react";

function getLanguage(cls?: string): string | undefined {
  if (!cls) return undefined;
  const m = cls.match(/(?:^|\s)language-([A-Za-z0-9+#-]+)/);
  return m?.[1]?.toLowerCase();
}

type ReactLikeNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | { props?: { children?: ReactLikeNode | ReactLikeNode[] } }
  | Array<ReactLikeNode>;

function toText(node: ReactLikeNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number" || typeof node === "boolean") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    const props = (node as { props?: { children?: ReactLikeNode | ReactLikeNode[] } }).props;
    return toText((props?.children ?? "") as ReactLikeNode);
  }
  return String(node ?? "");
}

function stripCommonIndentSmart(text: string): string {
  if (text.startsWith("\n")) text = text.slice(1);

  const lines = text.split("\n");
  const meta = lines.map((l, i) => {
    const match = l.match(/^[\t ]*/)?.[0] ?? "";
    return { i, line: l, isNonEmpty: l.trim().length > 0, indent: match.length };
  });

  const nonEmpty = meta.filter(m => m.isNonEmpty);
  if (nonEmpty.length === 0) return text.replace(/\n$/, "");

  const [first, ...rest] = nonEmpty;
  const minRestIndent = rest.length ? Math.min(...rest.map(m => m.indent)) : first.indent;

  const baseIndent = Math.min(first.indent, minRestIndent);

  const stripped = lines.map(l => l.slice(Math.min(baseIndent, l.length)));

  if (rest.length && minRestIndent === 0) {
    const idx = first.i;
    stripped[idx] = stripped[idx].replace(/^[\t ]+/, "");
  }

  return stripped.join("\n").replace(/\n$/, "");
}

export function CodeBlock(
  props: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }
) {
  const childrenArray = React.Children.toArray(props.children);

  type CodeProps = {
    className?: string;
    ["data-language"]?: string;
    children?: React.ReactNode;
  };

  const codeEl = childrenArray.find((child): child is React.ReactElement<CodeProps> => {
    if (!React.isValidElement(child)) return false;
    const el = child as React.ReactElement<CodeProps>;
    const cls = el.props?.className ?? "";
    const hasLangClass = typeof cls === "string" && cls.includes("language-");
    const hasDataLang = typeof el.props?.["data-language"] === "string";
    const isCodeTag = typeof el.type === "string" && el.type === "code";
    return hasLangClass || hasDataLang || isCodeTag;
  });

  const rawClass =
    codeEl?.props?.className ??
    (codeEl?.props?.["data-language"] ? `language-${codeEl.props["data-language"]}` : undefined);

  const lang = getLanguage(rawClass) ?? "text";

  const codeRaw = React.useMemo(
    () => toText((codeEl?.props?.children ?? "") as ReactLikeNode),
    [codeEl]
  );

  const code = React.useMemo(() => stripCommonIndentSmart(codeRaw), [codeRaw]);

  const lines = React.useMemo(() => code.split("\n"), [code]);
  const lineNumbers = React.useMemo(
    () => lines.map((_, i) => String(i + 1)).join("\n"),
    [lines]
  );

  const [copied, setCopied] = React.useState(false);
  const copyTimerRef = React.useRef<number | null>(null);

  const handleCopy = React.useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore copy errors
    }
  }, [code]);

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  return (
    <div className="my-4 rounded-md border border-black/10 bg-black/[0.03] overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-black/10 px-3 py-1 text-xs text-foreground/60">
        <span className="select-none uppercase tracking-wide">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-sm px-2 py-0.5 text-[11px] text-foreground/80 hover:text-foreground hover:bg-black/5 transition"
          aria-live="polite"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max flex text-sm leading-relaxed p-3">
          {/* Line numbers */}
          <pre aria-hidden="true" className="select-none opacity-50 text-right m-0 p-0 !bg-transparent tabular-nums">{lineNumbers}</pre>

          {/* Code */}
          <pre className="whitespace-pre m-0 p-0 !bg-transparent"><code className={`${rawClass ?? ""} p-0 rounded-none !bg-transparent`}>{code}</code></pre>
        </div>
      </div>
    </div>
  );
}

export default CodeBlock;
