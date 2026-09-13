"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusIcon,
  FilterIcon,
  SortIcon,
  SearchIcon,
  EyeIcon,
  MoreVerticalIcon,
  CoursesIcon,
} from "../adminIcons";

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  topics: number;
  lessons: number;
  quizzes: number;
  assignments: number;
  category: string;
  price: string;
  originalPrice?: string;
  author: string;
  date: string;
  status: "Publish" | "Draft";
}

const initialCourses: CourseRow[] = [
  {
    id: "1",
    slug: "new-course",
    title: "New Course",
    thumbnail: "/images/courses/web-development-bootcamp-thumbnail.webp",
    topics: 0,
    lessons: 0,
    quizzes: 0,
    assignments: 0,
    category: "—",
    price: "Free",
    author: "admin",
    date: "September 12, 2026 6:06 pm",
    status: "Draft",
  },
  {
    id: "2",
    slug: "the-complete-web-development-bootcamp",
    title: "The Complete Web Development Bootcamp",
    thumbnail: "/images/courses/web-development-bootcamp-thumbnail.webp",
    topics: 2,
    lessons: 4,
    quizzes: 1,
    assignments: 1,
    category: "Development",
    price: "Free",
    author: "admin",
    date: "September 12, 2026 4:44 pm",
    status: "Publish",
  },
  {
    id: "3",
    slug: "python-for-data-science",
    title: "Python for Data Science",
    thumbnail: "/images/courses/python-for-data-science-thumbnail.webp",
    topics: 2,
    lessons: 4,
    quizzes: 2,
    assignments: 1,
    category: "Data & AI",
    price: "$59.00",
    originalPrice: "$99.00",
    author: "admin",
    date: "June 16, 2026 5:47 pm",
    status: "Publish",
  },
  {
    id: "4",
    slug: "data-science-foundations",
    title: "Data Science Foundations",
    thumbnail: "/images/courses/data-science-foundations-thumbnail.webp",
    topics: 3,
    lessons: 9,
    quizzes: 6,
    assignments: 3,
    category: "Data & AI",
    price: "Free",
    author: "admin",
    date: "June 22, 2026 12:40 pm",
    status: "Publish",
  },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRow[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCourses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCourses.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkApply = () => {
    if (!bulkAction || selectedIds.length === 0) return;
    if (bulkAction === "publish") {
      setCourses(courses.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Publish" } : c)));
    } else if (bulkAction === "draft") {
      setCourses(courses.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Draft" } : c)));
    } else if (bulkAction === "delete") {
      setCourses(courses.filter((c) => !selectedIds.includes(c.id)));
    }
    setSelectedIds([]);
    setBulkAction("");
  };

  const toggleStatus = (id: string) => {
    setCourses(
      courses.map((c) =>
        c.id === id ? { ...c, status: c.status === "Publish" ? "Draft" : "Publish" } : c
      )
    );
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <PlusIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">New Course</span>
        </Link>
      </div>

      {/* Controls Bar matching design */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="">Bulk Action</option>
            <option value="publish">Mark as Publish</option>
            <option value="draft">Mark as Draft</option>
            <option value="delete">Delete Selected</option>
          </select>
          <button
            onClick={handleBulkApply}
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Apply</span>
          </button>
        </div>

        {/* Filter, Sort & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
          >
            <FilterIcon className="size-3.5 text-gray-400 shrink-0" />
            <span className="whitespace-nowrap">Filters</span>
          </button>
          <button
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
            title="Sort list"
          >
            <SortIcon className="size-3.5 text-gray-400" />
          </button>
          <div className="relative min-w-[220px]">
            <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Courses Table matching admin courses.PNG */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-600 min-w-[900px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="w-12 px-4 py-3.5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">Title</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Categories</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Price</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Author</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course) => {
                const isSelected = selectedIds.includes(course.id);
                return (
                  <tr
                    key={course.id}
                    className={`hover:bg-purple-50/30 transition-colors ${
                      isSelected ? "bg-purple-50/50" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(course.id)}
                        className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>

                    {/* Title + Thumbnail + Counts */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-start gap-3.5">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/courses/new?edit=${course.id}`}
                            className="font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1 text-sm whitespace-nowrap"
                          >
                            {course.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2.5 text-sm text-gray-500 whitespace-nowrap">
                            <span>Topic: <strong className="text-gray-700">{course.topics}</strong></span>
                            <span>•</span>
                            <span>Lesson: <strong className="text-gray-700">{course.lessons}</strong></span>
                            <span>•</span>
                            <span>Quiz: <strong className="text-gray-700">{course.quizzes}</strong></span>
                            <span>•</span>
                            <span>Assignment: <strong className="text-gray-700">{course.assignments}</strong></span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">
                      {course.category}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900">{course.price}</span>
                      {course.originalPrice && (
                        <span className="ml-1.5 text-sm text-gray-500 line-through">
                          {course.originalPrice}
                        </span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                          A
                        </div>
                        <span className="font-medium text-gray-700">{course.author}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {course.date}
                    </td>

                    {/* Actions & Status */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        {/* Status Toggle Dropdown / Button */}
                        <button
                          onClick={() => toggleStatus(course.id)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap shrink-0 ${
                            course.status === "Publish"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full shrink-0 ${course.status === "Publish" ? "bg-emerald-600" : "bg-gray-400"}`} />
                          <span className="whitespace-nowrap">{course.status}</span>
                        </button>

                        {/* View Button */}
                        <Link
                          href={`/courses/${course.slug}`}
                          className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">View</span>
                        </Link>

                        {/* Three-dot options menu */}
                        <div className="relative shrink-0">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === course.id ? null : course.id)}
                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0"
                          >
                            <MoreVerticalIcon className="size-4" />
                          </button>
                          {activeMenuId === course.id && (
                            <div className="absolute right-0 mt-1 w-36 rounded-xl border border-gray-100 bg-white p-1 shadow-lg z-20 text-left">
                              <Link
                                href={`/admin/courses/new?edit=${course.id}`}
                                className="block rounded-lg px-3.5 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium whitespace-nowrap"
                              >
                                Edit Course
                              </Link>
                              <button
                                onClick={() => {
                                  setCourses(courses.filter((c) => c.id !== course.id));
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left rounded-lg px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 font-medium whitespace-nowrap"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
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
