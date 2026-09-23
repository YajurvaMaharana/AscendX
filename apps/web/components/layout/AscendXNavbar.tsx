"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AscendXLogo from "@/components/layout/AscendXLogo";
import { CandidateProfileAvatar } from "@/components/interview/PersonaAvatars";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTab, type TabType } from "@/context/TabContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mic,
  Calendar,
  BarChart3,
  Award,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Edit3,
  Target,
  CalendarDays,
  Check,
  Sparkles,
} from "lucide-react";

const TARGET_ROLE_OPTIONS = [
  "Frontend Developer",
  "Senior Full-Stack Engineer",
  "Backend & Distributed Systems",
  "Mobile Engineer (iOS/Android)",
  "AI & ML Solutions Engineer",
  "DevOps & Cloud Architect",
  "Engineering Manager",
];

const DATE_RANGE_OPTIONS = [
  "Last 30 Days",
  "Last 7 Days",
  "Last 90 Days",
  "All Sessions",
];

interface AscendXNavbarProps {
  onOpenGroundingModal?: () => void;
  onOpenVoiceModal?: () => void;
}

export default function AscendXNavbar({
  onOpenGroundingModal,
  onOpenVoiceModal,
}: AscendXNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab } = useTab();

  // Dropdown states
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);

  // Selected date range state
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30 Days");

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const dateRangeDropdownRef = useRef<HTMLDivElement>(null);

  const u = user as any;
  const candidateDisplayName =
    u?.display_name ||
    u?.user_metadata?.display_name ||
    u?.user_metadata?.full_name ||
    u?.email?.split("@")[0] ||
    "Candidate";

  const currentRole =
    u?.target_role ||
    u?.user_metadata?.target_role ||
    "Frontend Developer";

  const [selectedRole, setSelectedRole] = useState(currentRole);

  useEffect(() => {
    if (currentRole) {
      setSelectedRole(currentRole);
    }
  }, [currentRole]);

  // Sync activeTab when navigating to specific routes
  useEffect(() => {
    if (pathname === "/voice-coach") {
      setActiveTab("voice-coach");
    } else if (pathname === "/feedback-hub") {
      setActiveTab("feedback-hub");
    } else if (pathname === "/day-simulations") {
      setActiveTab("day-simulations");
    } else if (pathname === "/resume-jd-grounding") {
      setActiveTab("resume-grounding");
    } else if (pathname === "/mock-interviews" || pathname === "/interview/new") {
      setActiveTab("mock-interviews");
    } else if (pathname === "/dashboard") {
      setActiveTab("dashboard");
    }
  }, [pathname, setActiveTab]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
      if (
        dateRangeDropdownRef.current &&
        !dateRangeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDateRangeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectRole = async (newRole: string) => {
    setSelectedRole(newRole);
    setIsRoleDropdownOpen(false);
    try {
      if (updateUserProfile) {
        await updateUserProfile({ target_role: newRole });
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("ascendx_target_role", newRole);
      }
    } catch (e) {
      console.warn("Failed to update role:", e);
    }
  };

  const navItems = [
    {
      name: "Overview",
      tabKey: "dashboard" as TabType,
      icon: LayoutDashboard,
    },
    {
      name: "Mock Interviews",
      tabKey: "mock-interviews" as TabType,
      icon: Users,
    },
    {
      name: "Resume & JD Grounding",
      tabKey: "resume-grounding" as TabType,
      icon: FileText,
    },
    {
      name: "Voice Coach",
      tabKey: "voice-coach" as TabType,
      icon: Mic,
    },
    {
      name: "Day Simulations",
      tabKey: "day-simulations" as TabType,
      icon: Calendar,
    },
    {
      name: "Insights & Trends",
      tabKey: "insights" as TabType,
      icon: BarChart3,
    },
    {
      name: "Feedback Hub",
      tabKey: "feedback-hub" as TabType,
      icon: Award,
    },
  ];

  const handleNavClick = (tabKey: TabType) => {
    setActiveTab(tabKey);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  // Reusable compact navigation bar island
  const renderNavIsland = (isMobile: boolean = false) => (
    <div
      id={isMobile ? "mobile-top-navigation-container" : "top-navigation-container"}
      className="inline-flex items-center p-1 rounded-full bg-white/95 dark:bg-[#151922]/95 backdrop-blur-md border border-slate-200/80 dark:border-[#222B3A] shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out shrink-0"
    >
      <nav
        id={isMobile ? "mobile-top-navigation-bar" : "top-navigation-bar"}
        aria-label="Main Navigation"
        className="flex items-center gap-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tabKey;
          const isHovered = hoveredTab === item.tabKey;
          const isExpanded = isActive || isHovered;

          return (
            <button
              key={item.name}
              id={`${isMobile ? "mobile-" : ""}nav-item-${item.tabKey}`}
              type="button"
              onClick={() => handleNavClick(item.tabKey)}
              onMouseEnter={() => setHoveredTab(item.tabKey)}
              onMouseLeave={() => setHoveredTab(null)}
              onFocus={() => setHoveredTab(item.tabKey)}
              onBlur={() => setHoveredTab(null)}
              className={`group relative flex items-center h-8 rounded-full text-xs font-medium cursor-pointer select-none transition-all duration-300 ease-in-out shrink-0 ${
                isExpanded ? "px-3.5 gap-2" : "px-2.5 gap-0"
              } ${
                isActive
                  ? "bg-[#E8602E] text-white font-semibold shadow-xs shadow-orange-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-[#1E2534]"
              }`}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
              title={item.name}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ease-in-out ${
                  isActive
                    ? "text-white scale-100"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-[#E87A42] group-hover:scale-110"
                }`}
              />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-xs ${
                  isExpanded
                    ? "max-w-[170px] opacity-100 translate-x-0"
                    : "max-w-0 opacity-0 -translate-x-1 pointer-events-none"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <header
        id="app-header-navigation"
        className="sticky top-0 z-50 w-full bg-[#ECEEF2]/95 dark:bg-[#0B0F15]/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 shadow-xs transition-colors duration-300"
      >
        <div className="max-w-[1380px] mx-auto px-3 sm:px-6 lg:px-7 py-2 sm:py-2.5 space-y-2 lg:space-y-0">
          {/* Main Top Header: Streamlined Controls (Target Role Selector, Date Range Filter, Profile Menu) */}
          <div className="flex items-center justify-between gap-3">
            {/* Left Area: Logo & Essential Selectors */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Logo */}
              <button
                type="button"
                id="navbar-brand-logo-button"
                onClick={() => handleNavClick("dashboard")}
                className="flex items-center transition-transform hover:scale-[1.01] cursor-pointer bg-transparent border-none p-0 focus:outline-hidden shrink-0"
                title="AscendX AI Mock Interview Studio"
              >
                <AscendXLogo size="md" />
              </button>

              {/* Essential Control 1: Target Role Selector */}
              <div className="relative hidden sm:block" ref={roleDropdownRef}>
                <button
                  type="button"
                  id="target-role-navbar-selector"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#181F2C] border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-[#E8602E] dark:hover:border-[#E8602E] shadow-2xs transition-colors cursor-pointer"
                  title="Select Target Role"
                >
                  <Target className="w-3.5 h-3.5 text-[#E8602E]" />
                  <span className="max-w-[140px] truncate">{selectedRole}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#181F2C] border border-slate-200/90 dark:border-slate-800 shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Target Role
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {TARGET_ROLE_OPTIONS.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleSelectRole(role)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                            selectedRole === role
                              ? "bg-[#FFF6F0] dark:bg-[#2F2119] text-[#E8602E] font-bold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <span>{role}</span>
                          {selectedRole === role && <Check className="w-3.5 h-3.5 text-[#E8602E]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Essential Control 2: Date Range / Session Filter */}
              <div className="relative hidden md:block" ref={dateRangeDropdownRef}>
                <button
                  type="button"
                  id="date-range-navbar-filter"
                  onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#181F2C] border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs transition-colors cursor-pointer"
                  title="Filter Sessions by Date Range"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{selectedDateRange}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isDateRangeOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#181F2C] border border-slate-200/90 dark:border-slate-800 shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Session Range
                    </div>
                    {DATE_RANGE_OPTIONS.map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          setSelectedDateRange(range);
                          setIsDateRangeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                          selectedDateRange === range
                            ? "bg-[#FFF6F0] dark:bg-[#2F2119] text-[#E8602E] font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span>{range}</span>
                        {selectedDateRange === range && <Check className="w-3.5 h-3.5 text-[#E8602E]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Center: Compact Expandable Navigation Tabs */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-2">
              {renderNavIsland(false)}
            </div>

            {/* Right Section: Essential Control 3 (Profile Menu) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Candidate Profile Avatar & Streamlined Dropdown Menu */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  id="profile-dropdown-trigger"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-2 hover:ring-[#E8602E] transition-all focus:outline-hidden cursor-pointer"
                  aria-expanded={isProfileMenuOpen}
                  title="Candidate profile and menu"
                >
                  <CandidateProfileAvatar className="w-8 h-8 sm:w-8.5 sm:h-8.5" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
                </button>

                {/* Streamlined Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#181D28] border border-slate-200/90 dark:border-slate-800 shadow-xl py-2 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                  >
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {candidateDisplayName}
                      </p>
                      <p className="text-[11px] text-[#E8602E] font-medium truncate">
                        {selectedRole}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {user?.email || "candidate@example.com"}
                      </p>
                    </div>

                    {/* Theme Toggle inside Profile Menu */}
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {theme === "dark" ? (
                          <Moon className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-500" />
                        )}
                        <span>Appearance</span>
                      </div>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1 text-xs">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800/60 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Candidate Profile</span>
                      </Link>

                      <Link
                        href="/voice-coach"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800/60 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        <Mic className="w-4 h-4 text-[#E8602E]" />
                        <span>Voice & Speech Coach</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsEditModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800/60 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-slate-400" />
                        <span>Quick Edit Profile & Goals</span>
                      </button>
                    </div>

                    {/* Footer: Sign Out */}
                    <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        id="navbar-logout-button"
                        onClick={async () => {
                          setIsProfileMenuOpen(false);
                          await signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Screen (< lg): Centered Compact Navigation Island */}
          <div className="lg:hidden flex items-center justify-center pt-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {renderNavIsland(true)}
          </div>
        </div>
      </header>

      {/* Quick Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
