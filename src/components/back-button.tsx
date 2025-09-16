"use client";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={() => router.back()}
      className={
        "group inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ring-offset-2 rounded-sm " +
        className
      }
      aria-label="Go back"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: reduce ? 0 : 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        variants={{
          rest: { x: 0 },
          hover: { x: reduce ? 0 : 2 },
          tap: { x: reduce ? 0 : 4 },
        }}
        className="mr-0.5"
      >
        ←
      </motion.span>
      <span>Back</span>
    </motion.button>
  );
}
