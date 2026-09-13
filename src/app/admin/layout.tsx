"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  OverviewIcon,
  CoursesIcon,
  CategoriesIcon,
  StudentsIcon,
  AnnouncementsIcon,
  QuizIcon,
  QAIcon,
  OrganizationsIcon,
  BillingIcon,
  SettingsIcon,
  BellIcon,
  SearchIcon,
  LogoutIconSvg,
  SwitchPortalIcon,
  MenuIcon,
  CloseIcon,
  CouponIcon,
  VoucherIcon,
  BundleIcon,
  EnrollmentIcon,
  PaymentsIcon,
  CertificateIcon,
} from "./adminIcons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  isElevated?: boolean;
}

const academicNavItems: NavItem[] = [
  { label: "Overview", href: "/admin", icon: <OverviewIcon className="size-4" /> },
  { label: "Courses", href: "/admin/courses", icon: <CoursesIcon className="size-4" /> },
  { label: "Bundles & Specializations", href: "/admin/bundles", icon: <BundleIcon className="size-4" /> },
  { label: "Categories", href: "/admin/categories", icon: <CategoriesIcon className="size-4" /> },
  { label: "Certificates", href: "/admin/certificates", icon: <CertificateIcon className="size-4" /> },
  { label: "Enrollments", href: "/admin/enrollments", icon: <EnrollmentIcon className="size-4" /> },
  { label: "Students", href: "/admin/students", icon: <StudentsIcon className="size-4" /> },
  { label: "Announcements", href: "/admin/announcements", icon: <AnnouncementsIcon className="size-4" /> },
  { label: "Quiz Attempts", href: "/admin/quiz-attempts", icon: <QuizIcon className="size-4" /> },
  { label: "Q & A", href: "/admin/q-and-a", icon: <QAIcon className="size-4" /> },
];

const operationsNavItems: NavItem[] = [
  { label: "Coupons", href: "/admin/coupons", icon: <CouponIcon className="size-4" /> },
  { label: "Vouchers", href: "/admin/vouchers", icon: <VoucherIcon className="size-4" /> },
  { label: "Organizations", href: "/admin/organizations", icon: <OrganizationsIcon className="size-4" /> },
  { label: "Payment History", href: "/admin/payments", icon: <PaymentsIcon className="size-4" /> },
  { label: "Platform Settings", href: "/admin/settings", icon: <SettingsIcon className="size-4" /> },
];

const adminNavItems: NavItem[] = [...academicNavItems, ...operationsNavItems];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const sidebarNavRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
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
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-100 bg-white shadow-xs max-lg:hidden flex flex-col justify-between h-screen sticky top-0">
        {/* Logo */}
        <div className="px-4 pt-5 pb-2 shrink-0">
          <div className="flex items-center px-3">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo className="text-purple-600" />
            </Link>
          </div>
        </div>

        {/* Scrollable Nav Area with hidden scrollbar */}
        <div
          ref={sidebarNavRef}
          className="flex-1 overflow-y-auto px-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mt-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Course Management
            </p>
            <nav className="mt-2 space-y-1">
              {academicNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={active ? "true" : undefined}
                    onClick={(e) => {
                      e.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(active ? "text-purple-600" : "text-gray-400")}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Commerce &amp; Operations
            </p>
            <nav className="mt-2 space-y-1">
              {operationsNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={active ? "true" : undefined}
                    onClick={(e) => {
                      e.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(active ? "text-purple-600" : "text-gray-400")}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Controls & User Footer */}
        <div className="shrink-0 border-t border-gray-100 p-4 space-y-3">
          <div className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-xl border border-purple-200 bg-purple-50/60 px-3.5 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100/70 transition-colors"
            >
              <SwitchPortalIcon className="size-4" />
              <span>Switch to Learner Portal</span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center rounded-xl border border-gray-200 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← Public Website
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogoutIconSvg className="size-4" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <MenuIcon className="size-5" />
            </button>
            <div className="relative max-sm:hidden">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, students, evaluations..."
                className="w-72 rounded-xl border border-gray-200 bg-gray-50/50 py-1.5 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-gray-100 bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                title="Notifications"
              >
                <BellIcon className="size-4" />
                <span className="absolute -top-1.5 -right-1.5 flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white leading-none">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                      Notifications
                    </h4>
                    <span className="text-sm font-semibold text-purple-600 cursor-pointer hover:underline">
                      Mark all read
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-start gap-3 rounded-xl bg-purple-50/60 p-3 text-sm">
                      <div className="mt-0.5 size-2 rounded-full bg-purple-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Manual / Pay Later Registration</p>
                        <p className="text-sm text-gray-600">Acme Corp registered for Cybersecurity Track ($450.00)</p>
                        <span className="text-sm text-gray-500">12 mins ago</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 text-sm">
                      <div className="mt-0.5 size-2 rounded-full bg-gray-300 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">New Assignment Submitted</p>
                        <p className="text-sm text-gray-600">Alex Walker submitted &ldquo;Hydraulics Inspection Proof&rdquo;</p>
                        <span className="text-sm text-gray-500">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-sm shadow-xs">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-900 leading-tight">Admin User</p>
                <p className="text-sm text-gray-500">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Modal */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-64 flex-col bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <Logo className="text-purple-600" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>
              <nav className="mt-6 flex-1 space-y-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {adminNavItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-active={active ? "true" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                        active
                          ? "bg-purple-50 text-purple-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <span className={cn(active ? "text-purple-600" : "text-gray-400")}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
