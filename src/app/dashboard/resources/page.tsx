"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "@/lib/icons";

const allStudentResources = [
  {
    id: "res-1",
    name: "JavaScript ES6+ Cheatsheet.pdf",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    size: "1.5 MB",
    type: "PDF",
    downloadUrl: "#",
  },
  {
    id: "res-2",
    name: "Event Loop Visual Guide.pdf",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    size: "2.1 MB",
    type: "PDF",
    downloadUrl: "#",
  },
  {
    id: "res-3",
    name: "Async Await Design Patterns.pdf",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    size: "980 KB",
    type: "PDF",
    downloadUrl: "#",
  },
  {
    id: "res-4",
    name: "Meal Planning Template.pdf",
    courseSlug: "secret-tips-behind-perfect-diet-meal-plan",
    courseTitle: "Secret Tips Behind Perfect Diet",
    size: "1.2 MB",
    type: "PDF",
    downloadUrl: "#",
  },
  {
    id: "res-5",
    name: "Macronutrient Calculator Cheat Sheet.xlsx",
    courseSlug: "secret-tips-behind-perfect-diet-meal-plan",
    courseTitle: "Secret Tips Behind Perfect Diet",
    size: "840 KB",
    type: "XLSX",
    downloadUrl: "#",
  },
  {
    id: "res-6",
    name: "Healthy Grocery Shopping List.pdf",
    courseSlug: "secret-tips-behind-perfect-diet-meal-plan",
    courseTitle: "Secret Tips Behind Perfect Diet",
    size: "650 KB",
    type: "PDF",
    downloadUrl: "#",
  },
];

export default function DashboardResourcesPage() {
  const [filterCourse, setFilterCourse] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = allStudentResources.filter((res) => {
    const matchesCourse = filterCourse === "all" || res.courseSlug === filterCourse;
    const matchesSearch =
      searchQuery === "" ||
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Resources &amp; Downloads
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Download cheat sheets, worksheets, and starter code from all your enrolled courses.
        </p>
      </div>

      {/* Toolbar */}
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
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
        </div>

        <div className="flex-1 sm:max-w-md">
          <input
            type="text"
            placeholder="Search resources by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Resources Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold text-xs uppercase shrink-0">
                  {res.type}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{res.name}</h4>
                  <div className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-purple-700">{res.courseTitle}</span>
                    <span>•</span>
                    <span>{res.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  href={`/learn/${res.courseSlug}/resources`}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  View in Course Player
                </Link>
                <a
                  href={res.downloadUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading ${res.name}...`);
                  }}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                >
                  Download ↓
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
