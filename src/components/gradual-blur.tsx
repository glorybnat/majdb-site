"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

type GradualBlurConfig = {
  position?: Position;
  strength?: number;
  height?: string; // also used for width when horizontal
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string; // e.g. "0.3s"
  easing?: string; // CSS timing function
  opacity?: number;
  curve?: Curve;
  responsive?: boolean;
  target?: "parent" | "page";
  className?: string;
  style?: React.CSSProperties;
  hoverIntensity?: number; // multiply strength on hover
  preset?: keyof typeof PRESETS;
  onAnimationComplete?: () => void;
  // Responsive overrides (optional)
  mobileHeight?: string; tabletHeight?: string; desktopHeight?: string;
  mobileWidth?: string; tabletWidth?: string; desktopWidth?: string;
};

const DEFAULT_CONFIG: Required<Pick<GradualBlurConfig,
  | "position" | "strength" | "height" | "divCount" | "exponential" | "zIndex" | "animated" | "duration" | "easing" | "opacity" | "curve" | "responsive" | "target" | "className" | "style"
>> = {
  position: "bottom",
  strength: 2,
  height: "1rem",
  divCount: 5,
  exponential: true,
  zIndex: 1000,
  animated: true,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "ease-in",
  responsive: false,
  target: "parent",
  className: "",
  style: {},
};

const PRESETS = {
  top: { position: "top" as const, height: "6rem" },
  bottom: { position: "bottom" as const, height: "6rem" },
  left: { position: "left" as const, height: "6rem" },
  right: { position: "right" as const, height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier" as const, divCount: 10 },
  sharp: { height: "5rem", curve: "linear" as const, divCount: 4 },
  header: { position: "top" as const, height: "8rem", curve: "ease-out" as const },
  footer: { position: "bottom" as const, height: "8rem", curve: "ease-out" as const },
};

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const mergeConfigs = (...configs: Array<Partial<GradualBlurConfig>>) =>
  configs.reduce((acc, c) => ({ ...acc, ...c }), {} as Partial<GradualBlurConfig>);

const getGradientDirection = (position: Position) => {
  const directions: Record<Position, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };
  return directions[position] ?? "to bottom";
};

const debounce = <T extends (...args: unknown[]) => void>(fn: T, wait: number) => {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...a: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};

const useResponsiveDimension = (
  responsive: boolean | undefined,
  config: GradualBlurConfig,
  key: "height" | "width"
) => {
  const [val, setVal] = useState<string | undefined>(config[key]);
  useEffect(() => {
    if (!responsive) return;
    const calc = () => {
      const w = window.innerWidth; let v = config[key];
      const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
      const mobileKey = ("mobile" + cap(key)) as keyof GradualBlurConfig;
      const tabletKey = ("tablet" + cap(key)) as keyof GradualBlurConfig;
      const desktopKey = ("desktop" + cap(key)) as keyof GradualBlurConfig;
      if (w <= 480 && config[mobileKey] && typeof config[mobileKey] === "string") v = config[mobileKey] as string;
      else if (w <= 768 && config[tabletKey] && typeof config[tabletKey] === "string") v = config[tabletKey] as string;
      else if (w <= 1024 && config[desktopKey] && typeof config[desktopKey] === "string") v = config[desktopKey] as string;
      setVal(v);
    };
    const deb = debounce(calc, 100);
    calc();
    window.addEventListener("resize", deb);
    return () => window.removeEventListener("resize", deb);
  }, [responsive, config, key]);
  return responsive ? val : config[key];
};

const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, shouldObserve = false) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);
  useEffect(() => {
    if (!shouldObserve || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);
  return isVisible;
};

export type GradualBlurProps = GradualBlurConfig & React.HTMLAttributes<HTMLDivElement>;

const GradualBlur: React.FC<GradualBlurProps> & {
  PRESETS: typeof PRESETS;
  CURVE_FUNCTIONS: typeof CURVE_FUNCTIONS;
} = (props: GradualBlurProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props) as Required<typeof DEFAULT_CONFIG> & GradualBlurConfig;
  }, [props]);

  const responsiveHeight = useResponsiveDimension(config.responsive, config, "height");
  const responsiveWidth = useResponsiveDimension(config.responsive, config, "width");
  const isVisible = useIntersectionObserver(containerRef as unknown as React.RefObject<HTMLElement>, config.animated === "scroll");

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / (config.divCount ?? 5);
    const currentStrength = isHovered && config.hoverIntensity ? (config.strength ?? 2) * config.hoverIntensity : (config.strength ?? 2);
    const curveFunc = CURVE_FUNCTIONS[(config.curve ?? "linear") as Curve] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= (config.divCount ?? 5); i++) {
      let progress = i / (config.divCount ?? 5);
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * (config.divCount ?? 5) + 1) * currentStrength;
      }
      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;
      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection((config.position ?? "bottom") as Position);

      const divStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity ?? 1,
        transition: config.animated && config.animated !== "scroll" ? `backdrop-filter ${config.duration ?? "0.3s"} ${config.easing ?? "ease-out"}` : undefined,
      };

      divs.push(<div key={i} style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle = useMemo(() => {
    const position = (config.position ?? "bottom") as Position;
    const isVertical = ["top", "bottom"].includes(position);
    const isHorizontal = ["left", "right"].includes(position);
    const isPageTarget = config.target === "page";

    const baseStyle: React.CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration ?? "0.3s"} ${config.easing ?? "ease-out"}` : undefined,
      zIndex: isPageTarget ? (config.zIndex ?? 1000) + 100 : (config.zIndex ?? 1000),
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight;
      baseStyle.width = responsiveWidth || "100%";
      (baseStyle as Record<string, unknown>)[position] = 0;
      (baseStyle as Record<string, unknown>).left = 0;
      (baseStyle as Record<string, unknown>).right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight;
      baseStyle.height = "100%";
      (baseStyle as Record<string, unknown>)[position] = 0;
      (baseStyle as Record<string, unknown>).top = 0;
      (baseStyle as Record<string, unknown>).bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  const { hoverIntensity, animated, onAnimationComplete, duration } = config;
  useEffect(() => {
    if (isVisible && animated === "scroll" && onAnimationComplete) {
      const t = setTimeout(() => onAnimationComplete(), parseFloat(duration ?? "0.3s") * 1000);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"} ${config.className ?? ""}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner relative h-full w-full">{blurDivs}</div>
    </div>
  );
};

GradualBlur.displayName = "GradualBlur";
GradualBlur.PRESETS = PRESETS;
GradualBlur.CURVE_FUNCTIONS = CURVE_FUNCTIONS;

export default GradualBlur;
