"use client";

import React from "react";
import Link from "next/link";
import {
  DollarIcon,
  GraduationCapIcon,
  BundleIcon,
  SettingsIcon,
  ArrowRightIcon,
} from "@/app/admin/adminIcons";

export default function AdminBillingPlansPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Billing &amp; Enrollment Architecture
        </h1>
      </div>

      {/* Modern University Model Explanation Banner */}
      <div className="rounded-3xl border border-purple-100 bg-purple-50/60 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-xs">
            <GraduationCapIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Direct Course &amp; Specialization Model
            </h2>
            <p className="text-sm text-purple-900 font-medium">
              Dedicated Financial Ledger, Student Enrollments, and Multi-Course Specializations
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-gray-700">
          In Skilliant, trainees enroll into specific courses or bundled degree-style specializations with one-time tuition fees or course installment plans. Site-wide all-access plans and the legacy manual pay later queue have been separated into dedicated administrative workspaces for cleaner operations.
        </p>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Payment History */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <DollarIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Payment History &amp; Orders</h3>
              <p className="mt-1 text-sm text-gray-600">
                Track all incoming payments across Stripe, corporate bank wire transfers, and organization vouchers with receipt viewing and wire clearance actions.
              </p>
            </div>
          </div>
          <Link
            href="/admin/payments"
            className="flex items-center justify-between rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Open Payment History</span>
            <ArrowRightIcon className="size-4 shrink-0" />
          </Link>
        </div>

        {/* Card 2: Student Enrollments */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <GraduationCapIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Student Enrollments</h3>
              <p className="mt-1 text-sm text-gray-600">
                Manage trainee course registrations, cohort progress, seat allocations, completion certificates, and manual admin student enrollments.
              </p>
            </div>
          </div>
          <Link
            href="/admin/enrollments"
            className="flex items-center justify-between rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Open Enrollments Portal</span>
            <ArrowRightIcon className="size-4 shrink-0" />
          </Link>
        </div>

        {/* Card 3: Bundles & Specializations */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <BundleIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Bundles &amp; Specializations</h3>
              <p className="mt-1 text-sm text-gray-600">
                Group multiple courses into ordered career tracks (e.g. UX Design Specialization), configure discounted bundle tuition, and issue specialized certificates.
              </p>
            </div>
          </div>
          <Link
            href="/admin/bundles"
            className="flex items-center justify-between rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Manage Specializations</span>
            <ArrowRightIcon className="size-4 shrink-0" />
          </Link>
        </div>

        {/* Card 4: Gateway & Tax Settings */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <SettingsIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Payment Gateways &amp; Taxes</h3>
              <p className="mt-1 text-sm text-gray-600">
                Configure Stripe API keys, bank wire routing instructions for institutional orders, currency selections, and default VAT/sales tax rates.
              </p>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Open Platform Settings</span>
            <ArrowRightIcon className="size-4 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
