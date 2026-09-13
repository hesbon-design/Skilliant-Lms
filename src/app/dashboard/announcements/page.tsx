"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "@/lib/icons";

const allAnnouncements = [
  {
    id: "ann-js-1",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    title: "Welcome to JavaScript Mastery!",
    date: "September 8, 2026",
    authorName: "Michael Lee",
    authorRole: "Senior Frontend Engineer",
    content: "Welcome to the cohort! We are going to go from foundational closures and prototypes all the way to high-performance async workflows and modern Node.js backend integration.",
    isPinned: true,
    commentsCount: 12,
  },
  {
    id: "ann-nut-1",
    courseSlug: "secret-tips-behind-perfect-diet-meal-plan",
    courseTitle: "Secret Tips Behind Perfect Diet & Meal Plan",
    title: "Welcome to Secret Tips Behind Perfect Diet & Meal Plan!",
    date: "September 10, 2026",
    authorName: "Sarah Jenkins, RD",
    authorRole: "Lead Nutritionist",
    content: "Hello everyone and welcome! In this course, we'll strip away the fad diet myths and build sustainable, science-backed nutritional routines. Please explore Module 1 and introduce yourself in the discussion tab!",
    isPinned: true,
    commentsCount: 4,
  },
  {
    id: "ann-js-2",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    title: "Node.js 22 LTS Updates and TypeScript 5.6 compatibility",
    date: "September 11, 2026",
    authorName: "Michael Lee",
    authorRole: "Senior Frontend Engineer",
    content: "All code snippets and starter repositories in Module 2 have been updated to support Node 22 LTS. Check the resources tab for the updated cheatsheet!",
    isPinned: false,
    commentsCount: 6,
  },
  {
    id: "ann-fl-1",
    courseSlug: "freelance-business-launchpad",
    courseTitle: "Freelance Business Launchpad",
    title: "Contract Templates Available for Download",
    date: "September 7, 2026",
    authorName: "Marcus Vance",
    authorRole: "Freelance Consultant",
    content: "Make sure you check out the contract clauses discussion in Topic 2 before signing your first client agreement.",
    isPinned: false,
    commentsCount: 3,
  },
];

export default function DashboardAnnouncementsPage() {
  const [filterCourse, setFilterCourse] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAnnouncements = allAnnouncements.filter((ann) => {
    const matchesCourse = filterCourse === "all" || ann.courseSlug === filterCourse;
    const matchesSearch =
      searchQuery === "" ||
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Important updates, course broadcasts, and notifications from your instructors.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
        <div className="relative">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:border-purple-300 focus:outline-none"
          >
            <option value="all">All Enrolled Courses</option>
            <option value="javascript-mastery">JavaScript Mastery</option>
            <option value="secret-tips-behind-perfect-diet-meal-plan">Secret Tips Behind Perfect Diet</option>
            <option value="freelance-business-launchpad">Freelance Business Launchpad</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
        </div>

        <div className="flex-1 sm:max-w-md">
          <input
            type="text"
            placeholder="Search announcements by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
              📢
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">No Announcements Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your course filter or search query.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                    {ann.courseTitle}
                  </span>
                  {ann.isPinned && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
                      📌 Pinned
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{ann.date}</span>
              </div>

              <h3 className="mt-3 text-base font-bold text-gray-900">{ann.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{ann.content}</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="flex size-7 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700 text-sm">
                    {ann.authorName.charAt(0)}
                  </div>
                  <span>By <strong className="text-gray-800">{ann.authorName}</strong> ({ann.authorRole})</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-medium">💬 {ann.commentsCount} Comments</span>
                  <Link
                    href={`/learn/${ann.courseSlug}/announcements`}
                    className="font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Open in Course Player →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
