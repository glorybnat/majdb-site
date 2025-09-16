"use client";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export function RevealImg(props: HTMLMotionProps<"img">) {
  const reduce = useReducedMotion();
  return (
    <motion.img
      {...props}
      className={(props.className ? props.className + " " : "") + "rounded-md border border-black/10"}
      initial={{ opacity: 0, filter: reduce ? undefined : "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
  );
}

export function RevealVideo(props: HTMLMotionProps<"video">) {
  const reduce = useReducedMotion();
  return (
    <motion.video
      {...props}
      className={(props.className ? props.className + " " : "") + "rounded-md border border-black/10"}
      initial={{ opacity: 0, scale: reduce ? 1 : 0.995 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
  );
}
