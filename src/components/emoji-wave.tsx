"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

type Trigger = "loop" | "hover" | "mount";

interface WavingHandProps {
  /** How the wave should trigger */
  trigger?: Trigger; // "loop" | "hover" | "mount"
  /** Font size, e.g. 24, "1.5rem", "2em" */
  size?: number | string;
  /** Seconds for one wave cycle */
  duration?: number;
  /** Pause between repeated waves (loop mode) */
  repeatDelay?: number;
  /** Accessible label (screen readers). Set to "" to make decorative. */
  label?: string;
  className?: string;
}

/**
 * Waving iOS-style emoji hand (👋).
 * Note: exact "iOS look" depends on platform fonts. We prefer Apple Color Emoji when available.
 */
export function WavingHand({
  trigger = "loop",
  size = "1.5rem",
  duration = 0.9,
  repeatDelay = 0.8,
  label = "Waving hand",
  className,
}: WavingHandProps) {
  const shouldReduce = useReducedMotion();

  // Keyframe angles for a natural wave
  const rotateKF = [0, 18, -8, 16, -6, 0];

  const baseProps = {
    style: {
      fontSize: typeof size === "number" ? `${size}px` : size,
      lineHeight: 1,
      // Prefer Apple's emoji on Apple devices; gracefully fall back elsewhere
      fontFamily:
        '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif',
      display: "inline-block",
      transformOrigin: "70% 70%", // pivot around "wrist"
    } as React.CSSProperties,
    className: clsx("select-none", className),
    role: "img" as const,
    "aria-label": label || undefined,
    "aria-hidden": label === "" ? true : undefined,
  };

  if (shouldReduce) {
    // Minimal movement for reduced-motion users
    return (
      <span {...baseProps}>
        👋
      </span>
    );
  }

  // Animation wiring per trigger
  if (trigger === "hover") {
    return (
      <motion.span
        {...baseProps}
        whileHover={{ rotate: rotateKF }}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        👋
      </motion.span>
    );
  }

  if (trigger === "mount") {
    return (
      <motion.span
        {...baseProps}
        initial={{ rotate: 0 }}
        animate={{ rotate: rotateKF }}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        👋
      </motion.span>
    );
  }

  // Default: loop (wave → brief pause → wave …)
  return (
    <motion.span
      {...baseProps}
      animate={{ rotate: rotateKF }}
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay,
      }}
    >
      👋
    </motion.span>
  );
}
