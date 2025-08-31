"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function ConditionalHeader() {
  const pathname = usePathname();

  // Don't show header on project pages and protected routes (they have sidebar/navigation instead)
  if (pathname.startsWith("/project") || pathname.startsWith("/protected")) {
    return null;
  }

  return <Header />;
}
