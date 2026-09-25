"use client";

import React, { Suspense, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import SlidingAuth from "@/components/auth/SlidingAuth";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute =
    pathname === "/auth" ||
    pathname?.startsWith("/auth/") ||
    pathname === "/login" ||
    pathname === "/signup";

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && isAuthRoute) {
        router.replace("/dashboard");
      } else if (!isAuthenticated && !isAuthRoute) {
        router.replace("/auth?mode=signin");
      }
    }
  }, [isAuthenticated, isAuthRoute, isLoading, router]);

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

  // Strict Unauthenticated Handling:
  // If not authenticated and NOT on an auth route, display a redirecting loader state while router redirects URL to /auth.
  if (!isAuthenticated) {
    if (!isAuthRoute) {
      return (
        <div className="w-full min-h-screen bg-[#ECEEF2] dark:bg-[#0B0F15] flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Loader2 className="h-7 w-7 animate-spin text-[#E87A42]" />
            <span className="text-sm font-bold tracking-tight">Redirecting to sign in...</span>
          </div>
        </div>
      );
    }

    const initialMode = pathname === "/signup" ? "signup" : "signin";

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#ECEEF2] dark:bg-[#0B0F15] py-8 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-4xl h-[620px] rounded-2xl border bg-card shadow-2xl animate-pulse flex items-center justify-center text-muted-foreground text-sm">
              Loading AscendX Authentication...
            </div>
          }
        >
          <SlidingAuth initialMode={initialMode} />
        </Suspense>
      </div>
    );
  }

  // Dashboard & Application Shell: Rendered strictly ONLY when isAuthenticated === true after credential verification.
  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEF2] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100 relative">
      <Navbar />
      <Suspense fallback={null}>
        <main className="flex-1 w-full">{children}</main>
      </Suspense>
    </div>
  );
}
