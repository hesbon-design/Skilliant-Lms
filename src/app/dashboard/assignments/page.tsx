"use client";

import { useState } from "react";
import { mockAssignments } from "@/data/coursePlayerData";
import { cn } from "@/lib/utils";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockAssignments.filter(
    (a) =>
      a.assignmentTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return (
          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-200">
            Graded
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 border border-red-200">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600 border border-amber-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Filters row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 border border-purple-200">
          All Courses (1)
          <ChevronDown />
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          All (1)
          <ChevronDown />
        </button>
      </div>

      {/* Search row */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
          />
        </div>
        <button className="flex items-center justify-center size-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
          <CalendarIcon />
        </button>
        <button className="flex items-center justify-center size-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
          <SortIcon />
        </button>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-xl border border-gray-100 bg-white">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] border-b border-gray-100 bg-gray-50 px-5 py-3">
          <span className="text-xs font-semibold text-gray-500">Assignment Info</span>
          <span className="text-xs font-semibold text-gray-500">Marks</span>
          <span className="text-xs font-semibold text-gray-500">Time</span>
          <span className="text-xs font-semibold text-gray-500 text-right">Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No assignments found.
          </div>
        ) : (
          filtered.map((assignment, idx) => (
            <div
              key={assignment.id}
              className={cn(
                "grid grid-cols-[2fr_1fr_1.5fr_1fr] items-start px-5 py-5",
                idx < filtered.length - 1 && "border-b border-gray-50"
              )}
            >
              {/* Assignment info */}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {assignment.assignmentTitle}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">
                  Course:{" "}
                  <em className="italic text-gray-700">{assignment.courseTitle}</em>
                </p>
                <p className="mt-0.5 text-sm text-gray-500">
                  Student: {assignment.student}
                </p>
              </div>

              {/* Marks */}
              <div className="text-sm text-gray-700">
                <p className="font-medium">
                  {assignment.earnedMarks !== null
                    ? `${assignment.earnedMarks}/${assignment.totalMarks}`
                    : `-/${assignment.totalMarks}`}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Pass mark: {assignment.passMarks}
                </p>
              </div>

              {/* Time */}
              <div className="space-y-0.5">
                <p className="text-sm text-gray-500">
                  Duration:{" "}
                  <span className="font-medium text-gray-700">7 Days</span>
                </p>
                <p className="text-sm text-gray-500">
                  Submitted:{" "}
                  <span className="font-medium text-gray-700">
                    {assignment.submittedDate}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Deadline:{" "}
                  <span className="font-medium text-gray-700">
                    {assignment.deadline}
                  </span>
                </p>
              </div>

              {/* Status */}
              <div className="flex justify-end pt-0.5">
                {statusBadge(assignment.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
