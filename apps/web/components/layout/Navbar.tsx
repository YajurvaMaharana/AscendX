"use client";

import AscendXNavbar from "@/components/layout/AscendXNavbar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isActiveInterview =
    pathname?.startsWith("/interview/") &&
    pathname !== "/interview/new" &&
    !pathname.endsWith("/feedback");

  if (isActiveInterview) {
    return null;
  }

  return <AscendXNavbar />;
}

