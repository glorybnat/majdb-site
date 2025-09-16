"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

export function FadeUp({ children, delay = 0, duration = 0.25, blur = 0 }: PropsWithChildren<{ delay?: number; duration?: number; blur?: number }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 20, filter: blur ? `blur(${blur}px)` : undefined }}
      animate={{ opacity: 1, y: 0, filter: blur ? "blur(0px)" : undefined }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

type MotionComponent = typeof motion.div;
export function Stagger({ children, stagger = 0.05, delay = 0, as: As = motion.div }: { children: ReactNode; stagger?: number; delay?: number; as?: MotionComponent }) {
  return (
    <As
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </As>
  );
}

export function Item({ children, blur = 0, fromX, fromY, duration = 0.25 }: PropsWithChildren<{ blur?: number; fromX?: number; fromY?: number; duration?: number }>) {
  const reduce = useReducedMotion();
  const initialX = reduce ? 0 : fromX ?? 0;
  const initialY = reduce ? 0 : fromY ?? 20;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: initialX, y: initialY, filter: blur ? `blur(${blur}px)` : undefined },
        visible: { opacity: 1, x: 0, y: 0, filter: blur ? "blur(0px)" : undefined },
      }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function SlideGroup({ children, dir = 1 }: PropsWithChildren<{ dir?: 1 | -1 }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: reduce ? 0 : 60 * dir }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reduce ? 0 : -60 * dir }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
// removed
export {};
