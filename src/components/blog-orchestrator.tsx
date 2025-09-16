"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Blog } from "@/data/blogs";

export function BlogOrchestrator({
  blogs,
  onClose,
}: {
  blogs: Blog[];
  onClose?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  // Deep-link support: if path matches /blog/[id], set active
  useEffect(() => {
    const m = pathname?.match(/^\/blog\/(.+)$/);
    if (m) setActive(decodeURIComponent(m[1]));
    else setActive(null);
  }, [pathname]);

  const blog = useMemo(() => blogs.find((b) => b.id === active) || null, [blogs, active]);

  const close = () => {
    onClose?.();
    router.push("/");
  };

  return (
    <AnimatePresence mode="wait">
      {blog && (
        <motion.section
          id="blog-space"
          key={blog.id}
          initial={{ opacity: 0, x: reduce ? 0 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduce ? 0 : -50 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-10"
        >
          <motion.button
            id="back"
            className="text-sm underline mb-6"
            onClick={close}
            initial={{ opacity: 0, x: reduce ? 0 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -50 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            ← Back
          </motion.button>

          <motion.h1 className="text-2xl font-semibold mb-3" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            {blog.title}
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
          >
            {blog.content.map((c, i) => (
              <motion.p
                key={i}
                variants={{ hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.2 }}
                className="mb-3"
              >
                {c.text}
              </motion.p>
            ))}
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
