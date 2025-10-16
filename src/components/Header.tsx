"use client";

import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import type { ReactNode, HTMLAttributes } from "react";

type HeaderProps = {
  /** Override the title (defaults to APP_NAME) */
  title?: string;
  /** Optional right-side content (profile button, theme toggle, etc.) */
  right?: ReactNode;
} & HTMLAttributes<HTMLElement>;

export default function Header({
  title = APP_NAME,
  right,
  className = "",
  ...rest
}: HeaderProps) {
  return (
    <header
      className={
        "flex items-center justify-between gap-4 bg-white border-gray-300 p-4 " +
        className
      }
      {...rest}
    >
      <div className="flex items-center space-x-4 min-w-0">
        
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={160}
          height={40}
          className="h-10 w-auto object-contain"
          priority
        />
        <div className="h-8 w-px bg-gray-300" />

        {/* Title */}
        <h1 className="truncate text-2xl font-bold text-gray-800">
          {title}
        </h1>
      </div>

      {/* Right section (defaults to an 'A' avatar button) */}
      {right ?? (
        <button
          className="h-10 w-10 rounded-full bg-gray-200 text-black font-semibold
                     flex items-center justify-center hover:bg-gray-700 hover:text-white transition"
          aria-label="Profile"
        >
          A
        </button>
      )}
    </header>
  );
}