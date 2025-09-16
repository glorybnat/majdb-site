"use client";
import { useParams, useRouter } from "next/navigation";
import { blogs } from "@/data/blogs";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/container";

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const blog = blogs.find((b) => b.id === id);
  const router = useRouter();
  const reduce = useReducedMotion();
  if (!blog) return null;
  return (
    <Container>
      <AnimatePresence mode="wait">
        <motion.section
          key={blog.id}
          initial={{ opacity: 0, x: reduce ? 0 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduce ? 0 : -50 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-10"
        >
          <motion.button
            className="text-sm underline mb-6"
            onClick={() => router.push("/")}
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
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}>
            {blog.content.map((c, i) => (
              <motion.p key={i} variants={{ hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.2 }} className="mb-3">
                {c.text}
              </motion.p>
            ))}
          </motion.div>
        </motion.section>
      </AnimatePresence>
    </Container>
  );
}
