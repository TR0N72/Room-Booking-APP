"use client";

import { ReactNode } from "react";
import { TopNavigation } from "./TopNavigation";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-hima-main relative overflow-hidden">
      {/* Global Background Decoratives */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-hima-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-hima-main/50 via-hima-main to-hima-main" />
      </div>

      <TopNavigation />
      <main className="relative z-10 pt-24 pb-8 sm:pt-28 px-4 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
