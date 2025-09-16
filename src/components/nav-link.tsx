"use client";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

export function NavLink(props: PropsWithChildren<LinkProps & { className?: string }>) {
  const { children, ...rest } = props;
  return (
  <Link {...rest}>
      {children}
    </Link>
  );
}
