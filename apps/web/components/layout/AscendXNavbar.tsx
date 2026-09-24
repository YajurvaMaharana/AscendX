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
  Menu,
  X,
  Bell,
  Settings,
  ShieldCheck,
  Radio,
  CheckCircle2,
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);

  // Selected date range state
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30 Days");

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const dateRangeDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

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
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
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

  // Reusable compact navigation bar island with active state indicators
  const renderNavIsland = (isMobile: boolean = false) => (
    <div
      id={isMobile ? "mobile-top-navigation-container" : "top-navigation-container"}
      className="inline-flex items-center p-1.5 rounded-full bg-white/95 dark:bg-[#151922]/95 backdrop-blur-md border border-slate-200/80 dark:border-[#222B3A] shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out shrink-0"
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
              className={`group relative flex items-center h-9 rounded-full text-xs font-bold cursor-pointer select-none transition-all duration-300 ease-in-out shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E8602E] ${
                isExpanded ? "px-3.5 gap-2" : "px-2.5 gap-0"
              } ${
                isActive
                  ? "bg-[#E8602E] text-white font-extrabold shadow-sm shadow-orange-500/30"
                  : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2534]"
              }`}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
              title={item.name}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ease-in-out ${
                  isActive
                    ? "text-white scale-100"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-[#E8602E] group-hover:scale-110"
                }`}
                aria-hidden="true"
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
              {/* Bottom active indicator dot/bar */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-white rounded-full opacity-90 shadow-2xs" aria-hidden="true" />
              )}
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
        className="sticky top-0 z-50 w-full bg-[#ECEEF2]/95 dark:bg-[#0B0F15]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-2xs transition-colors duration-300"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-2 lg:space-y-0">
          {/* Main Top Header */}
          <div className="flex items-center justify-between gap-3">
            {/* Left Area: Logo, Target Role, and Voice Practice Badge */}
            <div className="flex items-center gap-3 shrink-0">
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

              {/* Target Role Selector */}
              <div className="relative hidden sm:block" ref={roleDropdownRef}>
                <button
                  type="button"
                  id="target-role-navbar-selector"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-[#181F2C] border border-slate-200/90 dark:border-slate-700/80 text-xs font-bold text-slate-900 dark:text-white hover:border-[#E8602E] dark:hover:border-[#E8602E] shadow-2xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E8602E]"
                  title="Select Target Role"
                >
                  <Target className="w-4 h-4 text-[#E8602E]" aria-hidden="true" />
                  <span className="max-w-[150px] truncate">{selectedRole}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#181F2C] border border-slate-200/90 dark:border-slate-800 shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Target Role
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {TARGET_ROLE_OPTIONS.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleSelectRole(role)}
                          className={`w-full min-h-[40px] flex items-center justify-between px-3.5 py-2 text-left transition-colors cursor-pointer ${
                            selectedRole === role
                              ? "bg-[#FFF6F0] dark:bg-[#2F2119] text-[#E8602E] font-extrabold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <span>{role}</span>
                          {selectedRole === role && <Check className="w-4 h-4 text-[#E8602E]" aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Practice Enabled Status Badge */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-bold">
                <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" aria-hidden="true" />
                <span>Voice Practice Enabled</span>
              </div>
            </div>

            {/* Desktop Center: Compact Navigation Island */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-2">
              {renderNavIsland(false)}
            </div>

            {/* Right Section: Notification Center & Profile Menu */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Notification Center Bell Button */}
              <div className="relative" ref={notificationsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-white dark:bg-[#181F2C] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-[#E8602E] dark:hover:text-[#E8602E] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E8602E]"
                  aria-label="Notification Center"
                  aria-expanded={isNotificationsOpen}
                  title="Notifications & Practice Insights"
                >
                  <Bell className="w-4 h-4" aria-hidden="true" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8602E] ring-2 ring-white dark:ring-[#181F2C]" />
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#181F2C] border border-slate-200/90 dark:border-slate-800 shadow-xl p-4 z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">Notifications &amp; AI Alerts</h4>
                      <span className="text-xs font-bold text-[#E8602E] bg-[#FFF0E6] dark:bg-[#321F16] px-2 py-0.5 rounded-full">
                        2 New
                      </span>
                    </div>
                    <div className="space-y-2 text-slate-700 dark:text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white block">STAR Rubric Calibration</span>
                        <p className="text-slate-600 dark:text-slate-300">Your Action score increased +12 points following the Senior Staff drill.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131822] border border-slate-200/60 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white block">Target Role Benchmark</span>
                        <p className="text-slate-600 dark:text-slate-300">Updated benchmark thresholds for {selectedRole}.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-white dark:bg-[#181F2C] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E8602E]"
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-900 dark:text-white" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-900 dark:text-white" aria-hidden="true" />
                )}
              </button>

              {/* Candidate Profile Menu */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  id="profile-dropdown-trigger"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-[#E8602E] dark:hover:ring-[#E8602E] transition-all focus-visible:ring-2 focus-visible:ring-[#E8602E] cursor-pointer"
                  aria-expanded={isProfileMenuOpen}
                  title="Candidate profile and settings menu"
                >
                  <CandidateProfileAvatar className="w-9 h-9" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block mr-1" aria-hidden="true" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#181D28] border border-slate-200/90 dark:border-slate-800 shadow-xl py-2 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                  >
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                        {candidateDisplayName}
                      </p>
                      <p className="text-xs text-[#E8602E] font-bold truncate">
                        {selectedRole}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user?.email || "candidate@example.com"}
                      </p>
                    </div>

                    {/* Theme Toggle inside Profile Menu */}
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {theme === "dark" ? (
                          <Moon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
                        )}
                        <span>Appearance Theme</span>
                      </div>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                      </button>
                    </div>

                    {/* Menu Items with Explicit Icons and Labels */}
                    <div className="py-1 text-xs">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#FFF0E6] dark:hover:bg-slate-800/60 hover:text-[#E8602E] transition-colors font-bold"
                      >
                        <User className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        <span>Candidate Profile</span>
                      </Link>

                      <Link
                        href="/voice-coach"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#FFF0E6] dark:hover:bg-slate-800/60 hover:text-[#E8602E] transition-colors font-bold"
                      >
                        <Mic className="w-4 h-4 text-[#E8602E]" aria-hidden="true" />
                        <span>Voice &amp; Speech Coach</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsEditModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#FFF0E6] dark:hover:bg-slate-800/60 hover:text-[#E8602E] transition-colors text-left cursor-pointer font-bold"
                      >
                        <Edit3 className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        <span>Quick Edit Profile &amp; Goals</span>
                      </button>

                      <div className="flex items-center gap-3 px-4 py-2.5 text-slate-800 dark:text-slate-200 hover:bg-[#FFF0E6] dark:hover:bg-slate-800/60 transition-colors font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>Privacy Controls (Encrypted)</span>
                      </div>
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
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left font-extrabold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Collapsible Hamburger Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pt-3 pb-2 border-t border-slate-200/80 dark:border-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-1.5 px-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Target Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => handleSelectRole(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 bg-white dark:bg-[#181F2C] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white rounded-xl"
                >
                  {TARGET_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.tabKey;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        handleNavClick(item.tabKey);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#E8602E] text-white border-[#E8602E]"
                          : "bg-white dark:bg-[#151922] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#E8602E]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
}
