"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface WavyDividerProps {
  /** Higher = tighter (more waves across the width). Try 28–40 for narrow width. */
  waves?: number;
  /** Wave height; 2–4 subtle, 5–6 bold. */
  amplitude?: number;
  /** Stroke color. */
  color?: string;
  /** SVG stroke width (ultra-thin by default). */
  strokeWidth?: number;
  /** Scroll speed in viewBox units per second (viewBox width = 100). */
  speed?: number;
  /** Wrapper classes. */
  className?: string;
  /** SVG height in CSS px. */
  heightPx?: number;
}

export function ZigzagDivider({
  waves = 52,
  amplitude = 2,
  color = "currentColor",
  strokeWidth = 0.4,
  speed = 1,
  className,
  heightPx = 12,
}: WavyDividerProps) {
  const viewW = 100;
  const viewH = 12;
  const midY = viewH / 2;

  // Derive period from desired count of full waves across the 100-unit width.
  const periods = Math.max(1, Math.floor(waves));
  const period = viewW / periods; // width of one full wave
  const half = period / 2;
  const k = 0.3642; // sine-ish cubic control-point ratio

  // Build a seamless wave from x=-period to x=100+period so edges match in phase & tangent.
  const buildSeamlessWave = () => {
    let d = `M ${-period} ${midY}`;
    let x = -period;

    while (x < viewW + period) {
      // Up half: crest at x+half
      const x2 = x + half;
      const cp1x = x + k * half;
      const cp2x = x2 - k * half;
      d += ` C ${cp1x} ${midY}, ${cp2x} ${midY - amplitude}, ${x2} ${midY - amplitude}`;

      // Down half: trough at x+period
      const x3 = x + period;
      const cp3x = x2 + k * half;
      const cp4x = x3 - k * half;
      d += ` C ${cp3x} ${midY - amplitude}, ${cp4x} ${midY + amplitude}, ${x3} ${midY + amplitude}`;

      x += period;
    }
    // Do NOT add a straight segment back to midline; we already end at a trough crossing next curve.
    return d;
  };

  const pathD = buildSeamlessWave();

  // One seamless repeat is exactly 'period' units, so animate over that distance.
  const duration = period / Math.max(0.001, speed);

  return (
    <div className={clsx("my-6 w-full", className)} aria-hidden>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="none"
        width="100%"
        height={heightPx}
        style={{ display: "block" }}
      >
        {/* Move the tiled wave group to the RIGHT by exactly one period forever */}
        <motion.g
          initial={{ x: 0 }}
          animate={{ x: [0, period] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          {/* Tile A at x=0 */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            shapeRendering="geometricPrecision"
          />
          {/* Tile B at x=-period (slides in as we translate right) */}
          <g transform={`translate(-${period}, 0)`}>
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              shapeRendering="geometricPrecision"
              opacity={0.9}
            />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
