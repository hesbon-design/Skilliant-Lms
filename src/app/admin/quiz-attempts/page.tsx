"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QuizIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  EyeIcon,
  FileTextIcon,
  Trash2Icon,
  CloseIcon,
} from "@/app/admin/adminIcons";
import { cn } from "@/lib/utils";

interface QuizAttempt {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passingScore: number;
  result: "Pass" | "Fail";
  date: string;
  duration: string;
}

const initialAttempts: QuizAttempt[] = [
  {
    id: "att-101",
    studentName: "Nolan Vance",
    studentEmail: "nolan.vance@example.com",
    courseTitle: "The Complete Web Development Bootcamp",
    quizTitle: "CSS Flexbox & Responsive Layouts Drill",
    totalQuestions: 10,
    correctAnswers: 9,
    score: 90,
    passingScore: 80,
    result: "Pass",
    date: "September 12, 2026 2:15 pm",
    duration: "8m 42s",
  },
  {
    id: "att-102",
    studentName: "Sarah Jenkins",
    studentEmail: "s.jenkins@acmecorp.com",
    courseTitle: "Python for Data Science",
    quizTitle: "NumPy Arrays & Linear Algebra Check",
    totalQuestions: 15,
    correctAnswers: 11,
    score: 73,
    passingScore: 80,
    result: "Fail",
    date: "September 11, 2026 11:30 am",
    duration: "14m 10s",
  },
  {
    id: "att-103",
    studentName: "David Chen",
    studentEmail: "d.chen@metroworks.org",
    courseTitle: "Data Science Foundations",
    quizTitle: "Probability & Statistical Inference Exam",
    totalQuestions: 20,
    correctAnswers: 19,
    score: 95,
    passingScore: 85,
    result: "Pass",
    date: "September 10, 2026 4:50 pm",
    duration: "22m 15s",
  },
];

export default function AdminQuizAttemptsPage() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>(initialAttempts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [filterResult, setFilterResult] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === attempts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(attempts.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApply = () => {
    if (bulkAction === "delete" && selectedIds.length > 0) {
      setAttempts(attempts.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      setBulkAction("");
    }
  };

  const handleResetAttempt = (id: string) => {
    setAttempts(attempts.filter((a) => a.id !== id));
    setActiveAttempt(null);
  };

  const filteredAttempts = attempts.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResult =
      filterResult === "All" || a.result === filterResult;
    return matchesSearch && matchesResult;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quiz Attempts</h1>
        </div>
      </div>

      {/* Controls Bar matching quiz attempts.PNG */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none"
          >
            <option value="">Bulk Action</option>
            <option value="delete">Delete Attempts</option>
          </select>
          <button
            onClick={handleBulkApply}
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
          >
            Apply
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0",
              showFilters
                ? "border-purple-300 bg-purple-50 text-purple-700"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <FilterIcon className="size-3.5 shrink-0" />
            <span className="whitespace-nowrap">Filters</span>
          </button>

          <button
            onClick={() => setAttempts((prev) => [...prev].reverse())}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Sort"
          >
            <SortIcon className="size-3.5" />
          </button>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-60 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filter Dropdown Tray */}
      {showFilters && (
        <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/40 p-3.5 text-sm">
          <span className="font-semibold text-gray-700">Filter Result:</span>
          {["All", "Pass", "Fail"].map((res) => (
            <button
              key={res}
              onClick={() => setFilterResult(res)}
              className={cn(
                "rounded-lg px-2.5 py-1 font-medium transition-colors",
                filterResult === res
                  ? "bg-purple-600 text-white font-semibold"
                  : "bg-white text-gray-600 hover:bg-purple-100/50"
              )}
            >
              {res}
            </button>
          ))}
        </div>
      )}

      {/* Attempts Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        {filteredAttempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-3">
              <FileTextIcon className="size-7" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No Data Found.</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              No quiz attempts matching your criteria. When trainees complete drills, their attempts appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-sm text-gray-600 min-w-[950px]">
              <thead className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="w-10 px-4 py-3.5 text-center whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === attempts.length && attempts.length > 0}
                      onChange={toggleSelectAll}
                      className="size-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Student</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Quiz / Drill</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Accuracy</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Score</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Result</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttempts.map((att) => {
                  const isSelected = selectedIds.includes(att.id);
                  return (
                    <tr
                      key={att.id}
                      className={cn(
                        "transition-colors hover:bg-purple-50/30",
                        isSelected && "bg-purple-50/50"
                      )}
                    >
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(att.id)}
                          className="size-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                            {att.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{att.studentName}</p>
                            <p className="text-sm text-gray-500">{att.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 min-w-[220px] whitespace-nowrap">
                        <p className="font-semibold text-gray-800">{att.quizTitle}</p>
                        <p className="text-sm text-gray-500">{att.courseTitle}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                        <span>{att.correctAnswers} / {att.totalQuestions} correct</span>
                        <span className="block text-sm text-gray-500">Time: {att.duration}</span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap">
                        <span className={cn(att.score >= att.passingScore ? "text-emerald-600" : "text-rose-600")}>
                          {att.score}%
                        </span>
                        <span className="block text-sm font-normal text-gray-500">Pass: {att.passingScore}%</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {att.result === "Pass" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                            <CheckCircleIcon className="size-3" /> Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 whitespace-nowrap">
                            <AlertCircleIcon className="size-3" /> Fail (Remediate)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {att.date}
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveAttempt(att)}
                          className="rounded-xl border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors text-sm whitespace-nowrap shrink-0"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Attempt Drawer / Modal */}
      {activeAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setActiveAttempt(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                  Attempt Audit
                </span>
                <h3 className="text-base font-bold text-gray-900">{activeAttempt.quizTitle}</h3>
              </div>
              <button
                onClick={() => setActiveAttempt(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 shrink-0"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3.5 rounded-xl">
              <div>
                <p className="text-gray-500 text-sm">Trainee</p>
                <p className="font-bold text-gray-900">{activeAttempt.studentName}</p>
                <p className="text-sm text-gray-500">{activeAttempt.studentEmail}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Performance</p>
                <p className="font-bold text-gray-900">
                  {activeAttempt.score}% ({activeAttempt.result})
                </p>
                <p className="text-sm text-gray-500">
                  {activeAttempt.correctAnswers} / {activeAttempt.totalQuestions} questions correct
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gray-800">Evaluator Actions</p>
              <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 text-sm text-gray-700">
                Granting a retake resets this attempt and allows the trainee to submit a second attempt without penalty.
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => handleResetAttempt(activeAttempt.id)}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap shrink-0"
              >
                Grant Retake (Reset)
              </button>
              <button
                onClick={() => setActiveAttempt(null)}
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
