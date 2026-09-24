"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface RoleSwitcherProps {
  className?: string;
  size?: "sm" | "md";
}

export default function RoleSwitcher({
  className,
  size = "md",
}: RoleSwitcherProps) {
  const pathname = usePathname();

  const isInstructorActive =
    pathname === "/admin/courses" ||
    pathname.startsWith("/admin/courses/") ||
    pathname === "/admin/quiz-attempts" ||
    pathname === "/admin/q-and-a";

  const isAdminActive =
    pathname.startsWith("/admin") && !isInstructorActive;

  const isStudentActive =
    pathname.startsWith("/dashboard");

  const roles = [
    {
      id: "student",
      label: "Student",
      shortLabel: "Student",
      icon: "🎓",
      href: "/dashboard",
      isActive: isStudentActive,
      description: "Learner Portal",
    },
    {
      id: "instructor",
      label: "Instructor",
      shortLabel: "Instructor",
      icon: "👨‍🏫",
      href: "/admin/courses",
      isActive: isInstructorActive,
      description: "Course Studio",
    },
    {
      id: "admin",
      label: "Admin",
      shortLabel: "Admin",
      icon: "⚙️",
      href: "/admin",
      isActive: isAdminActive,
      description: "Platform Suite",
    },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl border border-gray-200/80 bg-gray-100/80 p-1 shadow-inner",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
      role="group"
      aria-label="Portal Role Selector"
    >
      {roles.map((role) => (
        <Link
          key={role.id}
          href={role.href}
          title={`Switch to ${role.label} (${role.description})`}
          className={cn(
            "flex items-center gap-1.5 rounded-xl font-semibold transition-all duration-200",
            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs sm:text-sm",
            role.isActive
              ? "bg-white text-purple-700 shadow-sm ring-1 ring-black/5"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50",
          )}
        >
          <span className="text-sm leading-none">{role.icon}</span>
          <span>{role.label}</span>
        </Link>
      ))}
    </div>
  );
}
