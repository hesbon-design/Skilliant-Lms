"use client";

import React, { useState } from "react";
import { initialAdminEnrollments, AdminEnrollment } from "@/data/adminEnrollmentsData";
import { cn } from "@/lib/utils";
import { SearchIcon, PlusIcon, Trash2Icon } from "../adminIcons";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>(initialAdminEnrollments);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Manual Enrollment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newProgramTitle, setNewProgramTitle] = useState("Full-Stack UX & Design Systems Specialization");
  const [newProgramType, setNewProgramType] = useState<"course" | "bundle" | "specialization">("specialization");
  const [newChannel, setNewChannel] = useState<"self_paid" | "company_voucher" | "admin_manual">("admin_manual");
  const [newCompany, setNewCompany] = useState("");
  const [newValidity, setNewValidity] = useState("1 Year");

  // Handle Manual Enrollment
  const handleManualEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    const expiryFormatted =
      newValidity === "Lifetime"
        ? "Lifetime"
        : newValidity === "6 Months"
        ? "2027-03-15"
        : "2027-09-15";

    const created: AdminEnrollment = {
      id: `enr-${Date.now()}`,
      studentName: newStudentName.trim(),
      studentEmail: newStudentEmail.trim(),
      avatar: newStudentName.trim().charAt(0).toUpperCase(),
      programTitle: newProgramTitle,
      programType: newProgramType,
      enrollmentType: newChannel,
      companyName: newCompany.trim() || undefined,
      enrolledAt: new Date().toISOString().split("T")[0],
      expiresAt: expiryFormatted,
      status: "Active",
      progress: 0,
      lastActive: "Just enrolled",
    };

    setEnrollments([created, ...enrollments]);
    setIsModalOpen(false);

    // Reset Form
    setNewStudentName("");
    setNewStudentEmail("");
    setNewCompany("");
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setEnrollments(
      enrollments.map((enr) => {
        if (enr.id === id) {
          const nextStatus = enr.status === "Suspended" ? "Active" : "Suspended";
          return { ...enr, status: nextStatus };
        }
        return enr;
      })
    );
  };

  // Delete Enrollment
  const handleDeleteEnrollment = (id: string) => {
    if (confirm("Are you sure you want to revoke this student's enrollment?")) {
      setEnrollments(enrollments.filter((e) => e.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // Select all toggle
  const handleSelectAll = () => {
    if (selectedIds.length === filteredEnrollments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEnrollments.map((e) => e.id));
    }
  };

  // Filtered List
  const filteredEnrollments = enrollments.filter((enr) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      enr.studentName.toLowerCase().includes(query) ||
      enr.studentEmail.toLowerCase().includes(query) ||
      enr.programTitle.toLowerCase().includes(query) ||
      (enr.companyName && enr.companyName.toLowerCase().includes(query));

    const matchesType =
      typeFilter === "all" ? true : enr.programType === typeFilter;

    const matchesChannel =
      channelFilter === "all" ? true : enr.enrollmentType === channelFilter;

    const matchesStatus =
      statusFilter === "all" ? true : enr.status === statusFilter;

    return matchesQuery && matchesType && matchesChannel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Student Enrollments &amp; Access
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <PlusIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">Enroll Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student, email, program, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Program Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Program Types</option>
            <option value="course">Single Course</option>
            <option value="specialization">Specialization Track</option>
          </select>

          {/* Channel Filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Channels</option>
            <option value="self_paid">Self-Paid</option>
            <option value="company_voucher">Company Voucher</option>
            <option value="admin_manual">Admin Manual</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-700 min-w-[950px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      filteredEnrollments.length > 0 &&
                      selectedIds.length === filteredEnrollments.length
                    }
                    onChange={handleSelectAll}
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Trainee / Student</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Enrolled Program</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Channel &amp; Sponsor</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Progress</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Enrolled Date</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Access Expiry</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm text-gray-500">
                    No enrollments match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enr) => {
                  const isSelected = selectedIds.includes(enr.id);

                  return (
                    <tr
                      key={enr.id}
                      className={cn(
                        "hover:bg-purple-50/20 transition-colors",
                        isSelected && "bg-purple-50/40"
                      )}
                    >
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedIds(selectedIds.filter((id) => id !== enr.id));
                            } else {
                              setSelectedIds([...selectedIds, enr.id]);
                            }
                          }}
                          className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>

                      {/* Student Profile */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                            {enr.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{enr.studentName}</div>
                            <div className="text-xs text-gray-500">{enr.studentEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Program Title */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-800 line-clamp-1 max-w-[320px]">
                          {enr.programTitle}
                        </div>
                        <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mt-0.5">
                          {enr.programType === "specialization"
                            ? "Multi-Course Specialization"
                            : "Single Course"}
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {enr.enrollmentType === "company_voucher" ? (
                          <div>
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                              Company Voucher
                            </span>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {enr.companyName || "Corporate Account"}
                            </div>
                          </div>
                        ) : enr.enrollmentType === "admin_manual" ? (
                          <div>
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                              Admin Manual
                            </span>
                            {enr.companyName && (
                              <div className="text-xs text-gray-600 mt-0.5">{enr.companyName}</div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                            Self-Enrolled
                          </span>
                        )}
                      </td>

                      {/* Progress */}
                      <td className="px-4 py-4 whitespace-nowrap min-w-[130px]">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-1">
                          <span>{enr.progress}%</span>
                          <span className="text-gray-400 font-normal">{enr.lastActive}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              enr.progress === 100
                                ? "bg-green-500"
                                : enr.progress > 50
                                ? "bg-purple-600"
                                : "bg-purple-400"
                            )}
                            style={{ width: `${enr.progress}%` }}
                          />
                        </div>
                      </td>

                      {/* Enrolled Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enr.enrolledAt}
                      </td>

                      {/* Access Expiry */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {enr.expiresAt}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(enr.id)}
                          className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer",
                            enr.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : enr.status === "In Progress"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : enr.status === "Active"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                          title="Click to toggle status"
                        >
                          {enr.status === "Completed"
                            ? "✓ Completed"
                            : enr.status === "In Progress"
                            ? "● In Progress"
                            : enr.status === "Active"
                            ? "● Active"
                            : "⊘ Suspended"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(enr.id)}
                            className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                          >
                            {enr.status === "Suspended" ? "Reinstate" : "Suspend"}
                          </button>
                          <button
                            onClick={() => handleDeleteEnrollment(enr.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Revoke enrollment"
                          >
                            <Trash2Icon className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL ENROLLMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Manual Student Enrollment</h3>
                <p className="text-sm text-gray-500">
                  Grant instant course or specialization track access to a trainee.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualEnroll} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Student Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Program / Course Assignment *
                </label>
                <select
                  value={newProgramTitle}
                  onChange={(e) => {
                    setNewProgramTitle(e.target.value);
                    if (e.target.value.includes("Specialization")) {
                      setNewProgramType("specialization");
                    } else {
                      setNewProgramType("course");
                    }
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="Full-Stack UX & Design Systems Specialization">
                    Full-Stack UX & Design Systems Specialization (3 Courses)
                  </option>
                  <option value="Industrial Machine Operator Specialization">
                    Industrial Machine Operator Specialization (3 Courses)
                  </option>
                  <option value="Full-Stack Web & Cloud Architecture Specialization">
                    Full-Stack Web & Cloud Architecture Specialization (3 Courses)
                  </option>
                  <option value="The Complete Web Development Bootcamp">
                    The Complete Web Development Bootcamp (Single Course)
                  </option>
                  <option value="Heavy Excavator & Hydraulic Systems">
                    Heavy Excavator & Hydraulic Systems (Single Course)
                  </option>
                  <option value="Forklift Safety & Zero-Fault Inspection">
                    Forklift Safety & Zero-Fault Inspection (Single Course)
                  </option>
                  <option value="Python for Data Science & Predictive Maintenance">
                    Python for Data Science & Predictive Maintenance (Single Course)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Enrollment Channel
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) =>
                      setNewChannel(e.target.value as "self_paid" | "company_voucher" | "admin_manual")
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="admin_manual">Administrative Direct Enrollment</option>
                    <option value="company_voucher">Corporate Voucher Redeemed</option>
                    <option value="self_paid">Direct Payment Confirmed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Access Period
                  </label>
                  <select
                    value={newValidity}
                    onChange={(e) => setNewValidity(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="1 Year">1 Year Access</option>
                    <option value="6 Months">6 Months Access</option>
                    <option value="Lifetime">Lifetime Unlimited Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Company / Organization Affiliation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Industrial Logistics"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  Enroll Trainee Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
