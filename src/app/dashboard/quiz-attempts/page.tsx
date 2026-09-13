"use client";

import { useState } from "react";
import { mockQuizAttempts } from "@/data/coursePlayerData";
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

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function QuizAttemptsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockQuizAttempts.filter(
    (q) =>
      q.quizTitle.toLowerCase().includes(search.toLowerCase()) ||
      q.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const resultBadge = (result: string) => {
    switch (result) {
      case "passed":
        return (
          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-200">
            Passed
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
          All Courses
          <ChevronDown />
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          All ({filtered.length})
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
            placeholder="Search quizzes..."
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
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-gray-100 px-5 py-3">
          <span className="text-sm font-semibold text-gray-500">Quiz info</span>
          <span className="text-sm font-semibold text-gray-500">Marks</span>
          <span className="text-sm font-semibold text-gray-500">Time</span>
          <span className="text-sm font-semibold text-gray-500 text-right">Result</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No quiz attempts found.
          </div>
        ) : (
          filtered.map((attempt, idx) => (
            <div
              key={attempt.id}
              className={cn(
                "grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-5 py-5",
                idx < filtered.length - 1 && "border-b border-gray-50"
              )}
            >
              {/* Quiz info */}
              <div>
                <p className="text-sm font-semibold text-gray-900">{attempt.quizTitle}</p>
                <p className="mt-0.5 text-sm text-gray-500">
                  Course:{" "}
                  <em className="not-italic text-gray-700">{attempt.courseTitle}</em>
                </p>
                <p className="mt-0.5 text-sm text-gray-500">
                  Student: {attempt.student}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">{attempt.date}</p>
              </div>

              {/* Marks */}
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full border-2 border-gray-200 text-sm font-bold text-gray-700">
                  {attempt.score}
                </div>
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="size-2 rounded-full bg-green-500 inline-block" />
                    {attempt.correct} correct
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="size-2 rounded-full bg-red-500 inline-block" />
                    {attempt.incorrect} incorrect
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <ClockIcon />
                {attempt.timeTaken}
              </div>

              {/* Result */}
              <div className="flex justify-end">
                {resultBadge(attempt.result)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
