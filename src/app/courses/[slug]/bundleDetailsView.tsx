"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CourseType, BundleSubCourseItem } from "@/types/CourseType";
import BackButton from "./backButton";
import { ChevronDown } from "@/lib/icons";

interface BundleDetailsViewProps {
  course: CourseType;
}

export default function BundleDetailsView({ course }: BundleDetailsViewProps) {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(
    course.bundleCourses?.[0]?.id || null,
  );

  const toggleCourseExpand = (id: string) => {
    setExpandedCourseId((prev) => (prev === id ? null : id));
  };

  const bundleCourses: BundleSubCourseItem[] = course.bundleCourses || [];
  const totalCourses = bundleCourses.length || course.bundleCoursesCount || 3;
  const totalHours = Math.round((course.duration || 0) / 60) || 52;
  const savingsPercent = course.bundleSavingsPercent || 31;
  const originalPrice = course.bundleIndividualTotalPrice || course.price;
  const finalPrice = course.discountPrice || course.price;

  return (
    <div className="bg-gray-50 pt-10 pb-20 sm:pt-14 sm:pb-24 lg:pb-32">
      <div className="container">
        <div className="xl:px-16">
          <BackButton />

          {/* Bundle Hero Header */}
          <div className="mt-8 rounded-3xl border border-purple-100 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                <span>📦 Specialization Track</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                {totalCourses} Courses Series
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Save {savingsPercent}% vs individual enrollment
              </span>
            </div>

            <h1 className="mt-4 font-mulish text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {course.title}
            </h1>

            <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {course.shortDescription}
            </p>

            {/* Quick Metrics Strip */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-4">
              <div className="rounded-2xl bg-gray-50 p-3.5 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Curriculum</span>
                <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">{totalCourses} Full Courses</p>
                <span className="text-xs text-purple-600 font-medium">Sequential progression</span>
              </div>
              <div className="rounded-2xl bg-gray-50 p-3.5 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Duration</span>
                <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">{totalHours} Hours</p>
                <span className="text-xs text-gray-500 font-medium">Self-paced learning</span>
              </div>
              <div className="rounded-2xl bg-gray-50 p-3.5 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Lessons &amp; Drills</span>
                <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">{course.lessonsCount || 80}+ Practical Units</p>
                <span className="text-xs text-gray-500 font-medium">Portfolio-focused</span>
              </div>
              <div className="rounded-2xl bg-gray-50 p-3.5 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Access</span>
                <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">Lifetime Access</p>
                <span className="text-xs text-purple-600 font-medium">Includes future updates</span>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="mt-10 flex flex-col items-start justify-between gap-x-8 gap-y-10 lg:flex-row">
            {/* Left Content Area: Course sequence & curriculum */}
            <div className="w-full shrink space-y-12 lg:max-w-[65%]">
              {/* Visual Sequence Guide */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      Courses Included in this Specialization ({totalCourses})
                    </h2>
                    <p className="mt-1.5 text-sm text-gray-500">
                      Take these courses in sequence to master comprehensive, practical industry expertise.
                    </p>
                  </div>
                </div>

                {/* Sequential Step Cards */}
                <div className="mt-8 space-y-6">
                  {bundleCourses.map((subCourse, idx) => {
                    const isExpanded = expandedCourseId === subCourse.id;
                    const stepNumber = idx + 1;

                    return (
                      <div
                        key={subCourse.id}
                        className="relative rounded-2xl border border-gray-200/80 bg-white transition-all hover:border-purple-200"
                      >
                        {/* Course Header */}
                        <div
                          onClick={() => toggleCourseExpand(subCourse.id)}
                          className="flex cursor-pointer items-start justify-between gap-4 p-5 sm:p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-sm font-bold text-white shadow-xs">
                              {stepNumber}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                                  Course {stepNumber} of {totalCourses}
                                </span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs font-medium text-gray-500">
                                  {subCourse.durationHours} Hours
                                </span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs font-medium text-gray-500">
                                  {subCourse.lessonsCount} Lessons
                                </span>
                                {subCourse.level && (
                                  <>
                                    <span className="text-xs text-gray-300">•</span>
                                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-700">
                                      {subCourse.level}
                                    </span>
                                  </>
                                )}
                              </div>
                              <h3 className="mt-1.5 text-base font-bold text-gray-900 sm:text-lg">
                                {subCourse.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                {subCourse.shortDescription}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            aria-label={isExpanded ? "Collapse course details" : "Expand course details"}
                          >
                            <ChevronDown
                              className={`size-5 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-purple-600" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Collapsible Syllabus & Competencies */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-purple-50/20 p-5 sm:p-6 rounded-b-2xl animate-in fade-in-50 duration-200">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                              Core Skills &amp; Syllabus Covered
                            </h4>
                            {subCourse.topics && subCourse.topics.length > 0 ? (
                              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 text-sm text-gray-700">
                                {subCourse.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-sm text-gray-600">
                                Comprehensive modules with interactive quizzes and hands-on exercises.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar: Bundle Purchase & Savings */}
            <div className="sticky top-24 w-full space-y-6 lg:max-w-[32%]">
              {/* Card 1: Bundle Pricing & Enrollment CTA */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
                    Bundle Pricing
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Save {savingsPercent}%
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    ${finalPrice.toFixed(2)}
                  </span>
                  {originalPrice > finalPrice && (
                    <del className="text-base font-semibold text-gray-400">
                      ${originalPrice.toFixed(2)}
                    </del>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Total value when bought separately: ${originalPrice.toFixed(2)}
                </p>

                <div className="mt-6">
                  <Link
                    href={`/cart`}
                    className="flex w-full items-center justify-center rounded-2xl bg-purple-600 py-3.5 text-base font-bold text-white shadow-xs hover:bg-purple-700 transition-colors"
                  >
                    Enroll in Full Specialization
                  </Link>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>All {totalCourses} complete courses included</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>{course.lessonsCount || 80}+ Practical lessons &amp; quizzes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>Full project resources &amp; starter exercises</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>Lifetime updates &amp; community access</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Specialization Career Outcomes */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Who This Specialization Is For
                </h4>
                <ul className="mt-4 space-y-2.5 text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Career switchers seeking an end-to-end skill track</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Practitioners advancing from junior to senior/lead responsibilities</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Corporate teams looking for standardized workforce upskilling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
