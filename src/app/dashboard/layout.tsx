"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoutIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

// Sidebar SVG Icons matching the design system
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CoursesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const AnnouncementsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const QuizAttemptsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.439 7.85c0-1.571-1.274-2.85-2.845-2.85a2.848 2.848 0 0 0-2.846 2.85v.571H8.05v-.571A2.848 2.848 0 0 0 5.205 5C3.634 5 2.36 6.279 2.36 7.85c0 1.258.814 2.324 1.942 2.696v5.908A2.848 2.848 0 0 0 2.36 19.15c0 1.571 1.274 2.85 2.845 2.85a2.848 2.848 0 0 0 2.846-2.85v-.571h5.698v.571a2.848 2.848 0 0 0 2.846 2.85c1.571 0 2.845-1.279 2.845-2.85a2.85 2.85 0 0 0-1.942-2.696V10.546c1.128-.372 1.942-1.438 1.942-2.696z" />
  </svg>
);

const AssignmentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const DiscussionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>
);

const LiveClassesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <polyline points="6 12 10 8 14 11 18 7" />
  </svg>
);

const GradebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const ResourcesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

const CertificateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

// Elevated Company Admin Icons
const TeamIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const VoucherIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeDasharray="2 2" />
    <circle cx="7" cy="15" r="1.5" fill="currentColor" />
    <path d="M13 14h4" />
  </svg>
);

const ReportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
    <path d="M10 9H8" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MenuIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const baseStudentNavItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: <HomeIcon /> },
  { label: "Courses", href: "/dashboard/courses", icon: <CoursesIcon /> },
  { label: "Announcements", href: "/dashboard/announcements", icon: <AnnouncementsIcon /> },
  { label: "Quiz Attempts", href: "/dashboard/quiz-attempts", icon: <QuizAttemptsIcon /> },
  { label: "Assignments", href: "/dashboard/assignments", icon: <AssignmentsIcon /> },
  { label: "Certificates & Awards", href: "/dashboard/certificates", icon: <CertificateIcon /> },
  { label: "Gradebook", href: "/dashboard/gradebook", icon: <GradebookIcon /> },
  { label: "Discussions", href: "/dashboard/discussions", icon: <DiscussionsIcon /> },
  { label: "Live Classes", href: "/dashboard/live-classes", icon: <LiveClassesIcon /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <AnalyticsIcon /> },
  { label: "Resources", href: "/dashboard/resources", icon: <ResourcesIcon /> },
];

const elevatedCompanyNavItems: NavItem[] = [
  { label: "Company Team", href: "/dashboard/company/team", icon: <TeamIcon /> },
  { label: "Seat Vouchers", href: "/dashboard/company/vouchers", icon: <VoucherIcon /> },
  { label: "Compliance Reports", href: "/dashboard/company/reports", icon: <ReportIcon /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCompanyRoute = pathname.startsWith("/dashboard/company");

  // Dynamic RBAC: Defaults to "STUDENT" for learner dashboard, and "COMPANY_ADMIN" on /dashboard/company
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "COMPANY_ADMIN" | null>(null);
  const role = isCompanyRoute ? "COMPANY_ADMIN" : (selectedRole ?? "STUDENT");
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarNavRef = useRef<HTMLDivElement>(null);

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const scrollActiveIntoView = () => {
      const activeEl = sidebarNavRef.current?.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    };

    scrollActiveIntoView();
    const timer = setTimeout(scrollActiveIntoView, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar matching designs */}
      <aside className="w-64 shrink-0 border-r border-gray-100 bg-white px-5 py-6 shadow-xs max-lg:hidden flex flex-col justify-between h-screen sticky top-0">
        <div
          ref={sidebarNavRef}
          className="flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link href="/" className="inline-block py-1 px-2">
            <Logo className="text-purple-600" />
          </Link>

          {/* Role Status Tag */}
          <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                {role === "COMPANY_ADMIN" ? "Company Portal" : "Student Portal"}
              </span>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-800 truncate">
              {role === "COMPANY_ADMIN" ? "Apex Industrial Logistics" : "Alex Mercer"}
            </p>
            {!isCompanyRoute && (
              <button
                type="button"
                onClick={() => setSelectedRole(role === "STUDENT" ? "COMPANY_ADMIN" : "STUDENT")}
                className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-colors block text-left"
              >
                {role === "STUDENT" ? "Switch to Company Admin →" : "Switch to Student View →"}
              </button>
            )}
          </div>

          {/* Elevated Company Controls Section */}
          {role === "COMPANY_ADMIN" && (
            <div className="mt-5 border-b border-gray-100 pb-4">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Company Administration
              </p>
              <nav className="mt-2 space-y-1">
                {elevatedCompanyNavItems.map((item) => {
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      data-active={active ? "true" : undefined}
                      onClick={(e) => {
                        e.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
                      }}
                      className={cn(
                        "flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-purple-50 text-purple-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span className={cn("shrink-0", active ? "text-purple-600" : "text-gray-400")}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Standard Student/Learner Navigation */}
          <div className="mt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {role === "COMPANY_ADMIN" ? "My Learning & Drills" : "Curriculum & Drills"}
            </p>
            <nav className="mt-2 space-y-1">
              {baseStudentNavItems.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    data-active={active ? "true" : undefined}
                    onClick={(e) => {
                      e.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-purple-50 text-purple-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span className={cn("shrink-0", active ? "text-purple-600" : "text-gray-400")}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="shrink-0 space-y-2 pt-4 border-t border-gray-100">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-xl border border-purple-200 bg-purple-50/50 px-3.5 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100/70 transition-colors"
          >
            <span>Switch to Studio / Admin</span>
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← Back to Main Website
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogoutIcon className="size-4" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Desktop Persistent Header Bar */}
        <header className="hidden lg:flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-8">
          {/* Functional Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, lessons, resources..."
              className="w-80 rounded-xl border border-gray-200 bg-gray-50/50 py-1.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell with Flyout */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-gray-100 bg-gray-50 p-2.5 text-gray-500 hover:bg-gray-100 transition-colors"
                title="Notifications"
              >
                <BellIcon />
                <span className="absolute -top-1.5 -right-1.5 flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white leading-none">
                  2
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-bold text-gray-900">
                      Notifications
                    </h4>
                    <span className="text-sm font-semibold text-purple-600 cursor-pointer hover:underline">
                      Mark all read
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5 text-sm">
                    <Link
                      href="/dashboard/company/team"
                      className="flex items-start gap-3 rounded-xl bg-purple-50/60 p-2.5 hover:bg-purple-100/60 transition-colors"
                    >
                      <div className="mt-0.5 size-2 rounded-full bg-purple-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">New Trainee Joined</p>
                        <p className="text-sm text-gray-600">Sarah Lin accepted company invite for Forklift Safety.</p>
                        <span className="text-sm text-gray-500">10 mins ago</span>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/certificates"
                      className="flex items-start gap-3 rounded-xl bg-gray-50 p-2.5 hover:bg-gray-100 transition-colors"
                    >
                      <div className="mt-0.5 size-2 rounded-full bg-green-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Certificate Issued</p>
                        <p className="text-sm text-gray-600">Industrial Machine Operator Track license ready.</p>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Student Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-sm shadow-xs">
                {role === "COMPANY_ADMIN" ? "H" : "A"}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {role === "COMPANY_ADMIN" ? "Hesbon Ombati" : "Alex Mercer"}
                </p>
                <p className="text-xs text-gray-500">
                  {role === "COMPANY_ADMIN" ? "Company Admin" : "Student"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
              title="Open Navigation Menu"
            >
              <MenuIcon className="size-5" />
            </button>
            <Link href="/" className="inline-block py-1">
              <Logo className="text-purple-600 max-sm:w-28" />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-xs shadow-xs">
              {role === "COMPANY_ADMIN" ? "H" : "A"}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Modal */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-72 max-w-[85vw] flex-col bg-white p-5 shadow-2xl h-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Logo className="text-purple-600" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  title="Close Menu"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>

              {/* Role Indicator in Mobile Drawer */}
              <div className="mt-3 rounded-xl border border-purple-100 bg-purple-50/60 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    {role === "COMPANY_ADMIN" ? "Company Admin Mode" : "Learner Mode"}
                  </span>
                  <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <p className="mt-0.5 text-xs font-semibold text-gray-800 truncate">
                  {role === "COMPANY_ADMIN" ? "Apex Industrial Logistics" : "Alex Mercer (Learner)"}
                </p>
              </div>

              {/* Scrollable Nav List */}
              <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {role === "COMPANY_ADMIN" && (
                  <div>
                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Company Administration
                    </p>
                    <nav className="mt-1 space-y-0.5">
                      {elevatedCompanyNavItems.map((item) => {
                        const active = isItemActive(item.href);
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                              active
                                ? "bg-purple-50 text-purple-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <span className={cn("shrink-0", active ? "text-purple-600" : "text-gray-400")}>
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                )}

                <div>
                  <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {role === "COMPANY_ADMIN" ? "My Learning & Drills" : "Curriculum & Drills"}
                  </p>
                  <nav className="mt-1 space-y-0.5">
                    {baseStudentNavItems.map((item) => {
                      const active = isItemActive(item.href);
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                            active
                              ? "bg-purple-50 text-purple-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <span className={cn("shrink-0", active ? "text-purple-600" : "text-gray-400")}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="shrink-0 space-y-2 pt-3 border-t border-gray-100">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/60 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100/70 transition-colors"
                >
                  Switch to Studio / Admin
                </Link>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ← Public Website
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogoutIcon className="size-3.5" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
