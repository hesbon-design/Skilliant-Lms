"use client";

import React, { useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  SortIcon,
  CheckCircleIcon,
  CloseIcon,
  FileTextIcon,
} from "@/app/admin/adminIcons";
import { cn } from "@/lib/utils";

interface QAItem {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  lessonTitle: string;
  question: string;
  date: string;
  status: "Answered" | "Unanswered";
  repliesCount: number;
}

const initialQuestions: QAItem[] = [
  {
    id: "qa-1",
    studentName: "Marcus Brody",
    studentEmail: "m.brody@apexlogistics.com",
    courseTitle: "Python for Data Science",
    lessonTitle: "Lesson 2: Data Cleaning with Pandas",
    question: "How do we handle missing NaN values when computing rolling averages over timestamp data?",
    date: "September 12, 2026 10:14 am",
    status: "Answered",
    repliesCount: 2,
  },
  {
    id: "qa-2",
    studentName: "Elena Rostova",
    studentEmail: "elena@datacore.io",
    courseTitle: "The Complete Web Development Bootcamp",
    lessonTitle: "Lesson 4: Tailwind CSS Masterclass",
    question: "Is it better to use arbitrary values in Tailwind or customize the theme configuration in tailwind.config.ts?",
    date: "September 12, 2026 1:30 pm",
    status: "Unanswered",
    repliesCount: 0,
  },
];

export default function AdminQAQuestionsPage() {
  const [questions, setQuestions] = useState<QAItem[]>(initialQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<QAItem | null>(null);
  const [replyText, setReplyText] = useState("");

  const toggleSelectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map((q) => q.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApply = () => {
    if (bulkAction === "delete" && selectedIds.length > 0) {
      setQuestions(questions.filter((q) => !selectedIds.includes(q.id)));
      setSelectedIds([]);
      setBulkAction("");
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeQuestion) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === activeQuestion.id
          ? { ...q, status: "Answered", repliesCount: q.repliesCount + 1 }
          : q
      )
    );
    setReplyText("");
    setActiveQuestion(null);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Question &amp; Answer</h1>
      </div>

      {/* Controls Bar matching question n answer- exams.PNG */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none"
          >
            <option value="">Bulk Action</option>
            <option value="delete">Delete Selected</option>
          </select>
          <button
            onClick={handleBulkApply}
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
          >
            Apply
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0",
              showFilters
                ? "border-purple-300 bg-purple-50 text-purple-700"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <FilterIcon className="size-3.5" />
            <span className="whitespace-nowrap">Filters</span>
          </button>

          <button
            onClick={() => setQuestions((prev) => [...prev].reverse())}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
            title="Sort"
          >
            <SortIcon className="size-3.5" />
          </button>

          <div className="relative flex-1 sm:flex-initial">
            <SearchIcon className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filter Tray */}
      {showFilters && (
        <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/40 p-3.5 text-sm">
          <span className="font-semibold text-gray-700">Filter Status:</span>
          {["All", "Unanswered", "Answered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-lg px-2.5 py-1 font-medium transition-colors",
                statusFilter === status
                  ? "bg-purple-600 text-white shadow-xs font-bold"
                  : "text-gray-600 hover:text-purple-700 hover:bg-white"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Questions List / Table matching design */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-3">
              <FileTextIcon className="size-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No Data Found.</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              No questions found matching your criteria. When students submit inquiries during lessons, they appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-sm text-gray-600 min-w-[900px]">
              <thead className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="w-10 px-4 py-3.5 text-center whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === questions.length && questions.length > 0}
                      onChange={toggleSelectAll}
                      className="size-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Student</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Question &amp; Lesson</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Course</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3.5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQuestions.map((q) => {
                  const isSelected = selectedIds.includes(q.id);
                  return (
                    <tr
                      key={q.id}
                      className={cn(
                        "transition-colors hover:bg-purple-50/30",
                        isSelected && "bg-purple-50/50"
                      )}
                    >
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(q.id)}
                          className="size-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                            {q.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{q.studentName}</p>
                            <p className="text-sm text-gray-500">{q.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 min-w-[280px] whitespace-nowrap">
                        <p className="font-bold text-gray-900 truncate max-w-[340px]">{q.question}</p>
                        <p className="mt-1 text-sm font-medium text-purple-700 truncate max-w-[340px]">{q.lessonTitle}</p>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">
                        {q.courseTitle}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {q.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {q.status === "Answered" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 whitespace-nowrap">
                            <CheckCircleIcon className="size-3" /> Answered
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 whitespace-nowrap">
                            Pending Response
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveQuestion(q)}
                          className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">{q.status === "Answered" ? "View Thread" : "Reply"}</span>
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

      {/* Reply Modal */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setActiveQuestion(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                  Instructor Reply
                </span>
                <h3 className="text-base font-bold text-gray-900">{activeQuestion.lessonTitle}</h3>
              </div>
              <button
                onClick={() => setActiveQuestion(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 shrink-0"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-sm space-y-1">
              <p className="font-semibold text-gray-900">
                {activeQuestion.studentName} asks:
              </p>
              <p className="text-gray-700 leading-relaxed italic">
                &ldquo;{activeQuestion.question}&rdquo;
              </p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-800 text-sm">
                  Your Answer <span className="text-purple-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide an explanation, code reference, or guidance for the learner..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuestion(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white shadow-sm hover:bg-purple-700 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
