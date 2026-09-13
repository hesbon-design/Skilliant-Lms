"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  FilterIcon,
  DollarIcon,
  CoursesIcon,
  GraduationCapIcon,
  StarIcon,
  PlusIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  TrendingUpIcon,
} from "./adminIcons";

export default function AdminOverviewPage() {
  const [timeFilter, setTimeFilter] = useState("All Time");

  return (
    <div className="space-y-8">
      {/* Top Greeting Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Hi, admin <span className="inline-block animate-wave">👋</span>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-xs shrink-0">
            <CalendarIcon className="size-3.5 text-gray-400 shrink-0" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option>All Time</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          <button
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-xs hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0"
            title="Filter Settings"
          >
            <FilterIcon className="size-4" />
          </button>

          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <PlusIcon className="size-4 shrink-0" />
            <span className="whitespace-nowrap">Create Course</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Earnings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Earnings</span>
            <div className="flex size-9 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <DollarIcon className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-purple-600">$0.00</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <TrendingUpIcon className="size-3.5 text-emerald-500" /> Invoiced &amp; online sales
            </p>
          </div>
        </div>

        {/* Total Courses */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Courses</span>
            <div className="flex size-9 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <CoursesIcon className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-teal-600">3</h3>
            <p className="mt-1 text-sm text-gray-500">Published in catalog</p>
          </div>
        </div>

        {/* Total Students */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Students</span>
            <div className="flex size-9 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <GraduationCapIcon className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-purple-600">1</h3>
            <p className="mt-1 text-sm text-gray-500">Active enrolled trainee</p>
          </div>
        </div>

        {/* Avg. Rating */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Avg. Rating</span>
            <div className="flex size-9 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <StarIcon className="size-4 text-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-amber-500">0</h3>
            <p className="mt-1 text-sm text-gray-500">From 0 verified student reviews</p>
          </div>
        </div>
      </div>

      {/* Course Completion Rate Horizontal Bar Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Course Completion Rate</h2>
          <span className="text-sm text-gray-500">Active Cohort Summary</span>
        </div>

        {/* Segmented Horizontal Bar */}
        <div className="mt-6 flex h-14 w-full overflow-hidden rounded-xl bg-gray-100 p-1">
          {/* Enrolled: 50% */}
          <div
            className="flex h-full w-1/2 items-center justify-center rounded-lg bg-purple-600 text-sm font-semibold text-white shadow-xs transition-all"
            title="Enrolled: 1"
          >
            Enrolled (1)
          </div>
          {/* Inactive: 50% */}
          <div
            className="flex h-full w-1/2 items-center justify-center rounded-lg bg-gray-300 text-sm font-semibold text-gray-700 transition-all"
            title="Inactive: 1"
          >
            Inactive (1)
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-purple-600" />
            <span>Enrolled</span>
            <span className="font-bold text-gray-900">1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-emerald-500" />
            <span>Completed</span>
            <span className="font-bold text-gray-900">0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-amber-400" />
            <span>In Progress</span>
            <span className="font-bold text-gray-900">0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-gray-400" />
            <span>Inactive</span>
            <span className="font-bold text-gray-900">1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose-500" />
            <span>Cancelled</span>
            <span className="font-bold text-gray-900">0</span>
          </div>
        </div>
      </div>

      {/* Quick Access & Active Management Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Courses Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Your Active Courses</h3>
              <p className="text-sm text-gray-500">Currently published in studio catalog</p>
            </div>
            <Link
              href="/admin/courses"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              View all <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { title: "The Complete Web Development Bootcamp", category: "Development", enrolled: 1, price: "Free" },
              { title: "Python for Data Science", category: "Data & AI", enrolled: 0, price: "$59.00" },
              { title: "Data Science Foundations", category: "Data & AI", enrolled: 0, price: "Free" },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-center justify-between rounded-xl bg-gray-50/70 p-3.5 hover:bg-purple-50/40 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{c.title}</h4>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span className="rounded bg-gray-200/70 px-1.5 py-0.5 text-xs text-gray-600">{c.category}</span>
                    <span>{c.enrolled} enrolled</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-purple-700">{c.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Queues & Compliance Health */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Studio Evaluation Queue</h3>
              <p className="text-sm text-gray-500">Pending submissions &amp; inquiries</p>
            </div>
            <Link
              href="/admin/quiz-attempts"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">Evaluation hub</span>
              <ArrowRightIcon className="size-3.5 shrink-0" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/50 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-purple-600 text-white shrink-0">
                  <ClockIcon className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Quiz Attempts to Review</h4>
                  <p className="text-sm text-gray-600">0 evaluations pending</p>
                </div>
              </div>
              <Link
                href="/admin/quiz-attempts"
                className="rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-purple-700 shadow-2xs hover:bg-purple-50 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Review</span>
              </Link>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-teal-500 text-white shrink-0">
                  <CheckCircleIcon className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Student Q&amp;A Questions</h4>
                  <p className="text-sm text-gray-600">All questions answered</p>
                </div>
              </div>
              <Link
                href="/admin/q-and-a"
                className="rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Open Q&amp;A</span>
              </Link>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-purple-600 text-white shrink-0">
                  <DollarIcon className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Payment Ledger &amp; Wire Clearances</h4>
                  <p className="text-sm text-gray-600">Review Stripe transactions &amp; corporate wire orders</p>
                </div>
              </div>
              <Link
                href="/admin/payments"
                className="rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-purple-700 shadow-2xs hover:bg-purple-50 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Payment Ledger</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
