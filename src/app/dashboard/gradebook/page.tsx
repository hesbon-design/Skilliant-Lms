"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialGradeRules } from "@/data/gradebookData";
import { cn } from "@/lib/utils";

interface StudentCourseGrade {
  courseId: string;
  courseTitle: string;
  category: string;
  courseSlug: string;
  quizScore: number;
  assignmentScore: number;
  overallScore: number;
  completedLessons: number;
  totalLessons: number;
  completionDate: string;
  certificateEarned: boolean;
}

const learnerCourseGrades: StudentCourseGrade[] = [
  {
    courseId: "c-1",
    courseTitle: "Forklift Safety & Zero-Fault Inspection",
    category: "Heavy Machinery",
    courseSlug: "forklift-safety-inspection",
    quizScore: 96,
    assignmentScore: 92,
    overallScore: 94,
    completedLessons: 24,
    totalLessons: 24,
    completionDate: "September 18, 2026",
    certificateEarned: true,
  },
  {
    courseId: "c-2",
    courseTitle: "Complete React Developer Course",
    category: "Software Development",
    courseSlug: "complete-react-developer",
    quizScore: 88,
    assignmentScore: 84,
    overallScore: 86,
    completedLessons: 22,
    totalLessons: 24,
    completionDate: "In Progress",
    certificateEarned: false,
  },
  {
    courseId: "c-3",
    courseTitle: "Figma Fundamentals & Interactive Prototyping",
    category: "Design & UX",
    courseSlug: "figma-fundamentals",
    quizScore: 78,
    assignmentScore: 80,
    overallScore: 79,
    completedLessons: 18,
    totalLessons: 22,
    completionDate: "In Progress",
    certificateEarned: false,
  },
];

export default function StudentGradebookPage() {
  const [selectedTerm, setSelectedTerm] = useState("all");

  const getGradeRule = (score: number) => {
    const matched = initialGradeRules.find(
      (r) => score >= r.minPercent && score <= r.maxPercent,
    );
    return matched || initialGradeRules[initialGradeRules.length - 1];
  };

  const gpaValues = learnerCourseGrades.map((c) => getGradeRule(c.overallScore).point);
  const averageGpa = (
    gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length
  ).toFixed(2);
  const averageScore = Math.round(
    learnerCourseGrades.map((c) => c.overallScore).reduce((a, b) => a + b, 0) /
      learnerCourseGrades.length,
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Gradebook</h1>
          <p className="mt-1 text-sm text-gray-500">
            Official academic transcript, quiz evaluations, and course grade performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/certificates"
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100/70 transition-colors"
          >
            View Certificates →
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Cumulative GPA</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{averageGpa}</span>
            <span className="text-xs text-gray-500 font-medium">/ 4.00 Scale</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">Good Academic Standing</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Average Course Score</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{averageScore}%</span>
            <span className="text-xs text-purple-600 font-medium">Weighted Score</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Across {learnerCourseGrades.length} enrolled subjects</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Certificates Awarded</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">
              {learnerCourseGrades.filter((c) => c.certificateEarned).length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Accredited</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Passing threshold ≥ 70%</p>
        </div>
      </div>

      {/* Transcript Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base">Course Grades &amp; Performance</h3>
          <span className="text-xs text-gray-500">Grading Scale: Standard 4.0</span>
        </div>

        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3.5">Course Subject</th>
                <th className="px-6 py-3.5">Quizzes Avg</th>
                <th className="px-6 py-3.5">Assignments Avg</th>
                <th className="px-6 py-3.5">Overall Score</th>
                <th className="px-6 py-3.5">Grade Badge</th>
                <th className="px-6 py-3.5">Grade Point</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {learnerCourseGrades.map((course) => {
                const grade = getGradeRule(course.overallScore);

                return (
                  <tr key={course.courseId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                          {course.category}
                        </span>
                        <p className="mt-1 font-bold text-gray-900 text-sm">
                          {course.courseTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.completedLessons}/{course.totalLessons} lessons completed
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {course.quizScore}%
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {course.assignmentScore}%
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {course.overallScore}%
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs",
                          grade.badgeBg,
                        )}
                      >
                        {grade.badge}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {grade.pointFormatted} pts
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/learn/${course.courseSlug}`}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        Open Course →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
