"use client";

import React, { useState } from "react";
import {
  GradeRule,
  StudentGradeRecord,
  initialGradeRules,
  sampleStudentGrades,
} from "@/data/gradebookData";
import { cn } from "@/lib/utils";

const colorPresets = [
  { label: "Green", class: "bg-[#22C55E]", hex: "#22C55E" },
  { label: "Teal", class: "bg-[#14B8A6]", hex: "#14B8A6" },
  { label: "Aqua", class: "bg-[#2DD4BF]", hex: "#2DD4BF" },
  { label: "Navy", class: "bg-[#1E3A8A]", hex: "#1E3A8A" },
  { label: "Blue", class: "bg-[#2563EB]", hex: "#2563EB" },
  { label: "Sky Blue", class: "bg-[#38BDF8]", hex: "#38BDF8" },
  { label: "Purple", class: "bg-[#9333EA]", hex: "#9333EA" },
  { label: "Amber", class: "bg-[#F59E0B]", hex: "#F59E0B" },
  { label: "Red", class: "bg-[#DC2626]", hex: "#DC2626" },
];

export default function AdminGradebookPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "overview">("settings");
  const [gradeRules, setGradeRules] = useState<GradeRule[]>(initialGradeRules);
  const [studentGrades, setStudentGrades] = useState<StudentGradeRecord[]>([]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    point: "",
    minPercent: "",
    maxPercent: "",
    badgeBg: "bg-[#22C55E]",
  });

  // Search & Filter in Overview
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  // Helper to open modal for Add
  const handleOpenAddModal = () => {
    setEditingRuleId(null);
    setFormData({
      name: "",
      point: "",
      minPercent: "",
      maxPercent: "",
      badgeBg: "bg-[#22C55E]",
    });
    setIsModalOpen(true);
  };

  // Helper to open modal for Edit
  const handleOpenEditModal = (rule: GradeRule) => {
    setEditingRuleId(rule.id);
    setFormData({
      name: rule.name,
      point: rule.pointFormatted,
      minPercent: String(rule.minPercent),
      maxPercent: String(rule.maxPercent),
      badgeBg: rule.badgeBg,
    });
    setIsModalOpen(true);
  };

  // Save Rule (Add or Edit)
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseFloat(formData.minPercent) || 0;
    const max = parseFloat(formData.maxPercent) || 100;
    const point = parseFloat(formData.point) || 0;
    const name = formData.name.trim() || "Grade";

    if (editingRuleId) {
      setGradeRules((prev) =>
        prev.map((r) =>
          r.id === editingRuleId
            ? {
                ...r,
                name,
                badge: name,
                point,
                pointFormatted: point.toFixed(point % 1 === 0 ? 1 : 2),
                minPercent: min,
                maxPercent: max,
                rangeFormatted: `${min}-${max}`,
                badgeBg: formData.badgeBg,
              }
            : r,
        ),
      );
    } else {
      const newRule: GradeRule = {
        id: `grade-${Date.now()}`,
        name,
        badge: name,
        point,
        pointFormatted: point.toFixed(point % 1 === 0 ? 1 : 2),
        minPercent: min,
        maxPercent: max,
        rangeFormatted: `${min}-${max}`,
        badgeBg: formData.badgeBg,
        badgeText: "text-white",
      };
      setGradeRules((prev) => [...prev, newRule]);
    }

    setIsModalOpen(false);
  };

  // Delete Rule
  const handleDeleteRule = (id: string) => {
    if (confirm("Are you sure you want to delete this grade rule?")) {
      setGradeRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Helper to compute grade badge for a given score %
  const getGradeForScore = (score: number) => {
    const matched = gradeRules.find(
      (r) => score >= r.minPercent && score <= r.maxPercent,
    );
    return matched || gradeRules[gradeRules.length - 1];
  };

  // Populate sample overview records if empty
  const handleLoadSampleRecords = () => {
    setStudentGrades(sampleStudentGrades);
  };

  // Filtered Overview records
  const filteredStudents = studentGrades.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || s.courseSlug === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row matching screenshot */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 pb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gradebook</h1>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-400 bg-white px-3.5 py-1 text-sm font-semibold text-purple-600 shadow-2xs hover:bg-purple-50 transition-colors"
          >
            <span>+ Add New</span>
          </button>
        </div>

        {/* Right Tabs matching screenshot */}
        <div className="flex items-center gap-8 self-start sm:self-auto text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "pb-1 transition-all relative",
              activeTab === "overview"
                ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Overview ({studentGrades.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={cn(
              "pb-1 transition-all relative",
              activeTab === "settings"
                ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Grade Settings ({gradeRules.length})
          </button>
        </div>
      </div>

      {/* TAB 1: GRADE SETTINGS TABLE (Exact visual match to user's screenshot) */}
      {activeTab === "settings" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 pb-4 border-b border-transparent">
                  <th className="pb-6 font-medium text-gray-500 w-36">Grade Badge</th>
                  <th className="pb-6 font-medium text-gray-500 w-44">Grade Name</th>
                  <th className="pb-6 font-medium text-gray-500 w-44">Grade Point</th>
                  <th className="pb-6 font-medium text-gray-500">Grade Range %</th>
                  <th className="pb-6 font-medium text-gray-500 text-right w-44"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gradeRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Grade Badge */}
                    <td className="py-4">
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs",
                          rule.badgeBg,
                        )}
                      >
                        {rule.badge}
                      </div>
                    </td>

                    {/* Grade Name */}
                    <td className="py-4 font-bold text-gray-900 text-sm">
                      {rule.name}
                    </td>

                    {/* Grade Point */}
                    <td className="py-4 font-semibold text-gray-800 text-sm">
                      {rule.pointFormatted}
                    </td>

                    {/* Grade Range % */}
                    <td className="py-4 font-semibold text-gray-800 text-sm">
                      {rule.rangeFormatted}
                    </td>

                    {/* Actions: Edit & Delete buttons */}
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(rule)}
                          className="rounded-lg border border-purple-300 bg-white px-3.5 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="rounded-lg border border-purple-300 bg-white px-3.5 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {studentGrades.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-purple-50 text-2xl">
                📊
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Student Grades Recorded Yet
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                Student performance reports and evaluations will automatically compute based on your active Grade Settings.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleLoadSampleRecords}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                >
                  Load Sample Student Grades
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Configure Grade Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search by student name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full sm:max-w-xs rounded-xl border border-gray-200 px-3.5 text-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="h-10 rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-white"
                  >
                    <option value="all">All Courses</option>
                    <option value="forklift-safety-inspection">Forklift Safety</option>
                    <option value="figma-fundamentals">Figma Fundamentals</option>
                    <option value="complete-react-developer">React Developer</option>
                    <option value="nextjs-fullstack-bootcamp">Next.js Bootcamp</option>
                    <option value="heavy-machinery-hydraulics">Heavy Machinery</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setStudentGrades([])}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors self-end sm:self-auto"
                >
                  Clear Records
                </button>
              </div>

              {/* Student Grades Table */}
              <div className="overflow-x-auto [scrollbar-width:thin]">
                <table className="w-full text-left text-sm min-w-[750px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <th className="pb-3.5">Student</th>
                      <th className="pb-3.5">Course</th>
                      <th className="pb-3.5">Quizzes</th>
                      <th className="pb-3.5">Assignments</th>
                      <th className="pb-3.5">Overall %</th>
                      <th className="pb-3.5">Assigned Grade</th>
                      <th className="pb-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredStudents.map((rec) => {
                      const grade = getGradeForScore(rec.overallScorePercent);
                      return (
                        <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white text-xs shadow-xs">
                                {rec.studentAvatar}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm leading-tight">
                                  {rec.studentName}
                                </p>
                                <p className="text-xs text-gray-500">{rec.studentEmail}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 font-medium text-gray-800 text-sm">
                            {rec.courseTitle}
                          </td>

                          <td className="py-4 font-semibold text-gray-700">
                            {rec.quizScorePercent}%
                          </td>

                          <td className="py-4 font-semibold text-gray-700">
                            {rec.assignmentScorePercent}%
                          </td>

                          <td className="py-4 font-bold text-gray-900">
                            {rec.overallScorePercent}%
                          </td>

                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "size-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs",
                                  grade.badgeBg,
                                )}
                              >
                                {grade.badge}
                              </span>
                              <span className="text-xs font-semibold text-gray-600">
                                ({grade.pointFormatted} pts)
                              </span>
                            </div>
                          </td>

                          <td className="py-4">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                rec.status === "Passed"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200",
                              )}
                            >
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT GRADE RULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900">
              {editingRuleId ? "Edit Grade Rule" : "Add New Grade Rule"}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Configure the grade label, GPA point value, score percentage boundaries, and badge color.
            </p>

            <form onSubmit={handleSaveRule} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Grade Name / Badge Text
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A+, B, Distinction"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Grade Point (GPA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 4.0, 3.5"
                  value={formData.point}
                  onChange={(e) =>
                    setFormData({ ...formData, point: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Min Score %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 90"
                    value={formData.minPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, minPercent: e.target.value })
                    }
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Max Score %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 100"
                    value={formData.maxPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPercent: e.target.value })
                    }
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Badge Color Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Badge Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c.class}
                      type="button"
                      onClick={() => setFormData({ ...formData, badgeBg: c.class })}
                      className={cn(
                        "size-7 rounded-full transition-transform",
                        c.class,
                        formData.badgeBg === c.class
                          ? "ring-2 ring-purple-600 ring-offset-2 scale-110"
                          : "hover:scale-105",
                      )}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Badge Preview:</span>
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs",
                    formData.badgeBg,
                  )}
                >
                  {formData.name || "A"}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                >
                  {editingRuleId ? "Update Grade Rule" : "Save Grade Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
