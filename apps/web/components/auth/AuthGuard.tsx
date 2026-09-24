"use client";

import React, { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import SlidingAuth from "@/components/auth/SlidingAuth";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const isAuthRoute =
    pathname?.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/signup";

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#ECEEF2] dark:bg-[#0B0F15] flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Loader2 className="h-7 w-7 animate-spin text-[#E87A42]" />
          <span className="text-sm font-bold tracking-tight">Authenticating AscendX session...</span>
        </div>
      </div>
    );
  }

  // Keep the Application Shell Intact:
  // Render both the navigation bar and main dashboard container simultaneously within the primary layout wrapper.
  // When unauthenticated, render the authentication modal overlay inside the persistent dashboard shell.
  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEF2] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100 relative">
      <Navbar />
      <Suspense fallback={null}>
        <main className="flex-1 w-full">{children}</main>
      </Suspense>

      {!isAuthenticated && !isAuthRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <Suspense
            fallback={
              <div className="w-full max-w-4xl h-[620px] rounded-2xl border bg-card shadow-2xl animate-pulse flex items-center justify-center text-muted-foreground text-sm">
                Loading Sign In Screen...
              </div>
            }
          >
            <SlidingAuth initialMode="signin" />
          </Suspense>
        </div>
      )}
    </div>
  );
}
