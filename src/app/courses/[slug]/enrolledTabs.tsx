"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EnrolledTabsProps {
  courseSlug: string;
  children: React.ReactNode; // Course Info content (About, What You'll Learn, Course Content)
}

export default function EnrolledTabs({ courseSlug, children }: EnrolledTabsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "qa" | "announcements" | "resources">("info");

  return (
    <div>
      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab("info")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            activeTab === "info"
              ? "bg-purple-50 text-purple-600"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          Course Info
        </button>
        <button
          onClick={() => setActiveTab("qa")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            activeTab === "qa"
              ? "bg-purple-50 text-purple-600"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          Q&amp;A
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            activeTab === "announcements"
              ? "bg-purple-50 text-purple-600"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          Announcements
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            activeTab === "resources"
              ? "bg-purple-50 text-purple-600"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          Resources
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "info" && children}

        {activeTab === "qa" && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
              ❓
            </div>
            <h4 className="mt-4 font-semibold text-gray-900">Questions &amp; Answers</h4>
            <p className="mt-1 text-sm text-gray-500">
              Have a question about this course? Ask your instructor or discuss with peers.
            </p>
            <Link
              href={`/learn/${courseSlug}`}
              className="mt-5 inline-block rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Ask in Course Player →
            </Link>
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50 text-2xl">
              📣
            </div>
            <h4 className="mt-4 font-semibold text-gray-900">Course Announcements</h4>
            <p className="mt-1 text-sm text-gray-500">
              Instructor broadcasts, updates, and notices for this course.
            </p>
            <Link
              href={`/learn/${courseSlug}/announcements`}
              className="mt-5 inline-block rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              View Course Announcements →
            </Link>
          </div>
        )}


        {activeTab === "resources" && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
              📁
            </div>
            <h4 className="mt-4 font-semibold text-gray-900">Downloadable Resources</h4>
            <p className="mt-1 text-sm text-gray-500">
              Access lesson worksheets, cheat sheets, and source code.
            </p>
            <Link
              href={`/learn/${courseSlug}/resources`}
              className="mt-5 inline-block rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Open Course Resources →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
