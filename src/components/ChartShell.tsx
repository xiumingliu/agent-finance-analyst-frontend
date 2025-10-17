"use client";

import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

// Root container (3-row grid)
export function ChartShell({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl shadow border border-gray-100",
        "bg-white",
        "grid grid-rows-[auto,1fr,auto] min-h-0 overflow-hidden",
        "gap-y-3",
        className
      )}
      {...rest}
    />
  );
}

// Sub-components for the shell
// Header
type ChartShellHeaderProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode; // right-side slot (controls)
} & HTMLAttributes<HTMLDivElement>;

ChartShell.Header = function Header({
  title,
  subtitle,
  children,
  className,
  ...rest
}: ChartShellHeaderProps) {
  return (
    <div className={clsx("p-4 pb-2 flex items-center gap-4", className)} {...rest}>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-sm font-medium text-gray-700 truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-gray-500 truncate">
            {subtitle}
          </p>
        )}
      </div>
      {children ? <div className="ml-auto">{children}</div> : null}
    </div>
  );
};

// Body
type ChartShellBodyProps = { children?: ReactNode } & HTMLAttributes<HTMLDivElement>;

ChartShell.Body = function Body({ children, className, ...rest }: ChartShellBodyProps) {
  return (
    <div className={clsx("px-4 min-h-0", className)} {...rest}>
      <div className="h-full min-h-[240px]">{children}</div>
    </div>
  );
};

// Footer
type ChartShellFooterProps = { children?: ReactNode } & HTMLAttributes<HTMLDivElement>;

ChartShell.Footer = function Footer({ children, className, ...rest }: ChartShellFooterProps) {
  return (
    <div className={clsx("px-4 pb-4 pt-2", className)} {...rest}>
      {children}
    </div>
  );
};