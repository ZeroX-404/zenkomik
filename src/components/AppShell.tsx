"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const hideNavigation =
    pathname.startsWith("/chapter/") ||
    (pathname.startsWith("/series/") && segments.length >= 3);

  if (hideNavigation) return <>{children}</>;

  return (
    <>
      <Navigation />
      <div className="md:pl-32 pb-24 md:pb-10">
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
