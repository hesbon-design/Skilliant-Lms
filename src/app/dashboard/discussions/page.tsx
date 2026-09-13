"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "@/lib/icons";

const mockDiscussions = [
  {
    id: "disc-1",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    authorName: "Alex Rivera",
    date: "2 hours ago",
    title: "Difference between WeakMap and Map for DOM caching?",
    preview: "I'm testing memory management in Module 2. When referencing HTML elements as keys, why does WeakMap prevent leaks while standard Map doesn't?",
    replies: 5,
    votes: 8,
    isSolved: true,
  },
  {
    id: "disc-2",
    courseSlug: "secret-tips-behind-perfect-diet-meal-plan",
    courseTitle: "Secret Tips Behind Perfect Diet",
    authorName: "Emily Chen",
    date: "1 day ago",
    title: "How to balance protein intake on a plant-based diet?",
    preview: "For the 7-day meal plan assignment, what are the best whole food sources to reach 120g of daily protein without relying exclusively on processed protein powders?",
    replies: 8,
    votes: 14,
    isSolved: false,
  },
  {
    id: "disc-3",
    courseSlug: "freelance-business-launchpad",
    courseTitle: "Freelance Business Launchpad",
    authorName: "Liam Johnson",
    date: "3 days ago",
    title: "What payment terms work best for first-time clients?",
    preview: "Should I request 50% upfront and 50% upon completion, or break it into milestone payments? Marcus mentioned milestone billing in the workshop.",
    replies: 11,
    votes: 19,
    isSolved: true,
  },
];

export default function DashboardDiscussionsPage() {
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAskModal, setShowAskModal] = useState(false);
  const [discussions, setDiscussions] = useState(mockDiscussions);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [selectedCourseForQuestion, setSelectedCourseForQuestion] = useState("javascript-mastery");

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const courseNames: Record<string, string> = {
      "javascript-mastery": "JavaScript Mastery",
      "secret-tips-behind-perfect-diet-meal-plan": "Secret Tips Behind Perfect Diet",
      "freelance-business-launchpad": "Freelance Business Launchpad",
    };

    const newDisc = {
      id: `disc-${Date.now()}`,
      courseSlug: selectedCourseForQuestion,
      courseTitle: courseNames[selectedCourseForQuestion] || "General Discussion",
      authorName: "You",
      date: "Just now",
      title: newTitle.trim(),
      preview: newBody.trim() || newTitle.trim(),
      replies: 0,
      votes: 1,
      isSolved: false,
    };

    setDiscussions([newDisc, ...discussions]);
    setNewTitle("");
    setNewBody("");
    setShowAskModal(false);
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCourse = filterCourse === "all" || d.courseSlug === filterCourse;
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "solved"
        ? d.isSolved
        : !d.isSolved;
    return matchesCourse && matchesStatus;
  });

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Discussions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Ask questions, collaborate with peers, and discuss assignments with instructors.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors self-start sm:self-auto"
        >
          <span>💬</span> Ask a Question
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-semibold">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterStatus === "all"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("solved")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterStatus === "solved"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Solved
            </button>
            <button
              onClick={() => setFilterStatus("unanswered")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterStatus === "unanswered"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Unsolved
            </button>
          </div>
        </div>

        {/* Course Filter Dropdown */}
        <div className="relative">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-4 pr-10 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:border-purple-300 focus:outline-none"
          >
            <option value="all">All Courses</option>
            <option value="javascript-mastery">JavaScript Mastery</option>
            <option value="secret-tips-behind-perfect-diet-meal-plan">Secret Tips Behind Perfect Diet</option>
            <option value="freelance-business-launchpad">Freelance Business Launchpad</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
        </div>
      </div>

      {/* Thread list */}
      <div className="space-y-4">
        {filteredDiscussions.map((thread) => (
          <div
            key={thread.id}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                  {thread.courseTitle}
                </span>
                {thread.isSolved ? (
                  <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    ✓ Solved
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    Open
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{thread.date}</span>
            </div>

            <h3 className="mt-3 text-base font-bold text-gray-900">{thread.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{thread.preview}</p>

            <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4 text-sm">
              <span className="text-gray-500">
                Posted by <strong className="text-gray-800">{thread.authorName}</strong>
              </span>

              <div className="flex items-center gap-4">
                <span className="text-gray-500">▲ {thread.votes} Upvotes</span>
                <span className="font-semibold text-purple-600">💬 {thread.replies} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Ask a Question</h3>
              <button
                onClick={() => setShowAskModal(false)}
                className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Course</label>
                <select
                  value={selectedCourseForQuestion}
                  onChange={(e) => setSelectedCourseForQuestion(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-purple-300 focus:outline-none"
                >
                  <option value="javascript-mastery">JavaScript Mastery</option>
                  <option value="secret-tips-behind-perfect-diet-meal-plan">Secret Tips Behind Perfect Diet</option>
                  <option value="freelance-business-launchpad">Freelance Business Launchpad</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Question Title</label>
                <input
                  type="text"
                  required
                  placeholder="What is your question?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Details</label>
                <textarea
                  rows={4}
                  placeholder="Provide context, code snippets, or lesson details..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
