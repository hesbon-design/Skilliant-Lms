"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  initialAdminEnrollments,
  AdminEnrollment,
  systemStudents,
  SystemStudent,
  enrollmentPrograms,
  EnrollmentProgramOption,
} from "@/data/adminEnrollmentsData";
import { cn } from "@/lib/utils";
import { SearchIcon, PlusIcon, Trash2Icon, FilterIcon } from "../adminIcons";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>(initialAdminEnrollments);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Multi-Step Enrollment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);

  // Step 1: Program Selection (Course / Bundle)
  const [programSearch, setProgramSearch] = useState("");
  const [programTypeTab, setProgramTypeTab] = useState<"all" | "course" | "bundle">("all");
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);

  // Step 2: Student Selection (Existing System Directory)
  const [studentSearch, setStudentSearch] = useState("");
  const [studentCompanyFilter, setStudentCompanyFilter] = useState<string>("all");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Step 3: Access & Terms Configuration
  const [enrollmentChannel, setEnrollmentChannel] = useState<"admin_manual" | "company_voucher" | "self_paid">("admin_manual");
  const [accessPeriod, setAccessPeriod] = useState<"1 Year" | "6 Months" | "Lifetime">("1 Year");
  const [customCompany, setCustomCompany] = useState("");
  const [sendNotification, setSendNotification] = useState(true);

  // Open Modal Helper
  const handleOpenEnrollModal = () => {
    setIsModalOpen(true);
    setModalStep(1);
    setSelectedProgramIds([]);
    setSelectedStudentIds([]);
    setProgramSearch("");
    setStudentSearch("");
    setProgramTypeTab("all");
    setStudentCompanyFilter("all");
    setEnrollmentChannel("admin_manual");
    setAccessPeriod("1 Year");
    setCustomCompany("");
    setSendNotification(true);
  };

  // Step 1: Toggle Program Selection
  const toggleProgramSelection = (id: string) => {
    if (selectedProgramIds.includes(id)) {
      setSelectedProgramIds(selectedProgramIds.filter((item) => item !== id));
    } else {
      setSelectedProgramIds([...selectedProgramIds, id]);
    }
  };

  const handleSelectAllPrograms = (filteredItems: EnrollmentProgramOption[]) => {
    if (selectedProgramIds.length === filteredItems.length) {
      setSelectedProgramIds([]);
    } else {
      setSelectedProgramIds(filteredItems.map((p) => p.id));
    }
  };

  // Step 2: Toggle Student Selection
  const toggleStudentSelection = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleSelectAllStudents = (filteredStudentsList: SystemStudent[]) => {
    if (selectedStudentIds.length === filteredStudentsList.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudentsList.map((s) => s.id));
    }
  };

  // Step 3: Complete Multi-Student, Multi-Program Enrollment
  const handleFinalEnroll = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProgramIds.length === 0 || selectedStudentIds.length === 0) return;

    const chosenPrograms = enrollmentPrograms.filter((p) => selectedProgramIds.includes(p.id));
    const chosenStudents = systemStudents.filter((s) => selectedStudentIds.includes(s.id));

    const expiryFormatted =
      accessPeriod === "Lifetime"
        ? "Lifetime"
        : accessPeriod === "6 Months"
        ? "2027-03-16"
        : "2027-09-16";

    const newEnrollmentsToCreate: AdminEnrollment[] = [];

    chosenStudents.forEach((student) => {
      chosenPrograms.forEach((program) => {
        newEnrollmentsToCreate.push({
          id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          studentName: student.name,
          studentEmail: student.email,
          avatar: student.avatarLetter,
          programTitle: program.title,
          programType: program.type === "bundle" ? "bundle" : "course",
          enrollmentType: enrollmentChannel,
          companyName: customCompany.trim() || student.company || "Individual Trainee",
          enrolledAt: new Date().toISOString().split("T")[0],
          expiresAt: expiryFormatted,
          status: "Active",
          progress: 0,
          lastActive: "Just enrolled",
        });
      });
    });

    setEnrollments([...newEnrollmentsToCreate, ...enrollments]);
    setIsModalOpen(false);

    // Show Success Feedback Banner
    const totalCreated = newEnrollmentsToCreate.length;
    setSuccessToast(
      `Successfully enrolled ${chosenStudents.length} student(s) into ${chosenPrograms.length} program(s) (${totalCreated} total active enrollments created).`
    );
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

  // Filtered List for Table
  const filteredEnrollments = enrollments.filter((enr) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      enr.studentName.toLowerCase().includes(query) ||
      enr.studentEmail.toLowerCase().includes(query) ||
      enr.programTitle.toLowerCase().includes(query) ||
      (enr.companyName && enr.companyName.toLowerCase().includes(query));

    const matchesType =
      typeFilter === "all"
        ? true
        : typeFilter === "bundle"
        ? enr.programType === "bundle" || enr.programType === "specialization"
        : enr.programType === typeFilter;

    const matchesChannel =
      channelFilter === "all" ? true : enr.enrollmentType === channelFilter;

    const matchesStatus =
      statusFilter === "all" ? true : enr.status === statusFilter;

    return matchesQuery && matchesType && matchesChannel && matchesStatus;
  });

  // Filtered Programs for Modal Step 1
  const filteredModalPrograms = enrollmentPrograms.filter((p) => {
    const query = programSearch.toLowerCase();
    const matchesQuery =
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    const matchesType =
      programTypeTab === "all" ? true : p.type === programTypeTab;
    return matchesQuery && matchesType;
  });

  // Filtered Students for Modal Step 2
  const uniqueCompanies = Array.from(
    new Set(systemStudents.map((s) => s.company).filter(Boolean))
  ) as string[];

  const filteredModalStudents = systemStudents.filter((s) => {
    const query = studentSearch.toLowerCase();
    const matchesQuery =
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      (s.company && s.company.toLowerCase().includes(query));
    const matchesCompany =
      studentCompanyFilter === "all" ? true : s.company === studentCompanyFilter;
    return matchesQuery && matchesCompany;
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
          type="button"
          onClick={handleOpenEnrollModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7D52F4] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <PlusIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">Enroll Student(s)</span>
        </button>
      </div>

      {/* Dismissible Success Notification Toast */}
      {successToast && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
              ✓
            </span>
            <span className="font-semibold">{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student, email, program, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Program Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-[#7D52F4] focus:outline-hidden"
          >
            <option value="all">All Program Types</option>
            <option value="course">Single Course</option>
            <option value="bundle">Specialization Track</option>
          </select>

          {/* Channel Filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-[#7D52F4] focus:outline-hidden"
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
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-[#7D52F4] focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Bulk Operations Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-700 border border-purple-200">
          <span>{selectedIds.length} enrollment(s) selected</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEnrollments(
                  enrollments.map((enr) =>
                    selectedIds.includes(enr.id) ? { ...enr, status: "Suspended" } : enr
                  )
                );
                setSelectedIds([]);
              }}
              className="rounded-lg bg-white border border-purple-200 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
            >
              Suspend Selected
            </button>
            <button
              type="button"
              onClick={() => {
                setEnrollments(
                  enrollments.map((enr) =>
                    selectedIds.includes(enr.id) ? { ...enr, status: "Active" } : enr
                  )
                );
                setSelectedIds([]);
              }}
              className="rounded-lg bg-white border border-purple-200 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
            >
              Reinstate Selected
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Revoke ${selectedIds.length} selected enrollment(s)?`)) {
                  setEnrollments(enrollments.filter((e) => !selectedIds.includes(e.id)));
                  setSelectedIds([]);
                }
              }}
              className="rounded-lg bg-white border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap shrink-0"
            >
              Revoke Selected
            </button>
          </div>
        </div>
      )}

      {/* Master Enrollments Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3.5 text-center w-12 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      filteredEnrollments.length > 0 &&
                      selectedIds.length === filteredEnrollments.length
                    }
                    onChange={handleSelectAll}
                    className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-[#7D52F4]"
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
                          className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-[#7D52F4]"
                        />
                      </td>

                      {/* Student Profile */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-[#7D52F4]">
                            {enr.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{enr.studentName}</div>
                            <div className="text-xs text-gray-500 font-mono">{enr.studentEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Program Title */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-800 line-clamp-1 max-w-[320px]">
                          {enr.programTitle}
                        </div>
                        <div className="text-[11px] font-semibold text-[#7D52F4] uppercase tracking-wider mt-0.5">
                          {enr.programType === "bundle" || enr.programType === "specialization"
                            ? "Specialization Track Bundle"
                            : "Single Course"}
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {enr.enrollmentType === "company_voucher" ? (
                          <div>
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-[#7D52F4] border border-purple-200">
                              Company Voucher
                            </span>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {enr.companyName || "Corporate Account"}
                            </div>
                          </div>
                        ) : enr.enrollmentType === "admin_manual" ? (
                          <div>
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-[#7D52F4] border border-purple-200">
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
                                ? "bg-emerald-500"
                                : enr.progress > 50
                                ? "bg-[#7D52F4]"
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
                          type="button"
                          onClick={() => handleToggleStatus(enr.id)}
                          className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0",
                            enr.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : enr.status === "Active"
                              ? "bg-purple-50 text-[#7D52F4] border-purple-200"
                              : enr.status === "In Progress"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
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
                            type="button"
                            onClick={() => handleToggleStatus(enr.id)}
                            className="text-sm font-semibold text-[#7D52F4] hover:text-purple-700 transition-colors whitespace-nowrap shrink-0"
                          >
                            {enr.status === "Suspended" ? "Reinstate" : "Suspend"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEnrollment(enr.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors whitespace-nowrap shrink-0"
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

      {/* MULTI-STEP ENROLLMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden my-auto border border-gray-100">
            {/* Modal Header & Step Indicator */}
            <div className="border-b border-gray-100 bg-gray-50/50 p-6 sm:p-7 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Manual Student Enrollment
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full size-8 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors whitespace-nowrap shrink-0"
                  title="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Progress Stepper Tabs */}
              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                {/* Step 1 Tab */}
                <button
                  type="button"
                  onClick={() => setModalStep(1)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all text-left whitespace-nowrap shrink-0",
                    modalStep === 1
                      ? "bg-purple-100 text-[#7D52F4] ring-1 ring-purple-300"
                      : selectedProgramIds.length > 0
                      ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[10px]",
                    modalStep === 1 ? "bg-[#7D52F4] text-white" : selectedProgramIds.length > 0 ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-600"
                  )}>
                    {selectedProgramIds.length > 0 && modalStep !== 1 ? "✓" : "1"}
                  </span>
                  <span className="truncate">1. Select Programs ({selectedProgramIds.length})</span>
                </button>

                {/* Step 2 Tab */}
                <button
                  type="button"
                  disabled={selectedProgramIds.length === 0}
                  onClick={() => selectedProgramIds.length > 0 && setModalStep(2)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all text-left whitespace-nowrap shrink-0",
                    modalStep === 2
                      ? "bg-purple-100 text-[#7D52F4] ring-1 ring-purple-300"
                      : selectedStudentIds.length > 0
                      ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[10px]",
                    modalStep === 2 ? "bg-[#7D52F4] text-white" : selectedStudentIds.length > 0 ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-600"
                  )}>
                    {selectedStudentIds.length > 0 && modalStep !== 2 ? "✓" : "2"}
                  </span>
                  <span className="truncate">2. Select Students ({selectedStudentIds.length})</span>
                </button>

                {/* Step 3 Tab */}
                <button
                  type="button"
                  disabled={selectedProgramIds.length === 0 || selectedStudentIds.length === 0}
                  onClick={() => selectedProgramIds.length > 0 && selectedStudentIds.length > 0 && setModalStep(3)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all text-left whitespace-nowrap shrink-0",
                    modalStep === 3
                      ? "bg-purple-100 text-[#7D52F4] ring-1 ring-purple-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[10px]",
                    modalStep === 3 ? "bg-[#7D52F4] text-white" : "bg-gray-300 text-gray-600"
                  )}>
                    3
                  </span>
                  <span className="truncate">3. Confirm &amp; Access</span>
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-7 overflow-y-auto flex-1">

              {/* STEP 1: SELECT COURSE(S) AND/OR BUNDLE(S) */}
              {modalStep === 1 && (
                <div className="space-y-4">
                  {/* Controls: Search, Tabs & Quick Selection */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses or bundles..."
                        value={programSearch}
                        onChange={(e) => setProgramSearch(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 p-1">
                      <button
                        type="button"
                        onClick={() => setProgramTypeTab("all")}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-bold transition-colors whitespace-nowrap shrink-0",
                          programTypeTab === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        All ({enrollmentPrograms.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setProgramTypeTab("course")}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-bold transition-colors whitespace-nowrap shrink-0",
                          programTypeTab === "course" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        Courses ({enrollmentPrograms.filter((p) => p.type === "course").length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setProgramTypeTab("bundle")}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-bold transition-colors whitespace-nowrap shrink-0",
                          programTypeTab === "bundle" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        Bundles ({enrollmentPrograms.filter((p) => p.type === "bundle").length})
                      </button>
                    </div>
                  </div>

                  {/* Selection Status Bar */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>
                      {selectedProgramIds.length === 0 ? (
                        <span className="text-amber-600 font-semibold">Select at least one program to proceed</span>
                      ) : (
                        <span className="text-[#7D52F4] font-bold">
                          ✓ {selectedProgramIds.length} program(s) selected
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectAllPrograms(filteredModalPrograms)}
                      className="text-xs font-semibold text-[#7D52F4] hover:underline whitespace-nowrap shrink-0"
                    >
                      {selectedProgramIds.length === filteredModalPrograms.length && filteredModalPrograms.length > 0
                        ? "Deselect All Filtered"
                        : "Select All Filtered"}
                    </button>
                  </div>

                  {/* Programs List */}
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden max-h-[380px] overflow-y-auto">
                    {filteredModalPrograms.length === 0 ? (
                      <div className="py-10 text-center text-sm text-gray-500">
                        No courses or bundles match your query.
                      </div>
                    ) : (
                      filteredModalPrograms.map((program) => {
                        const isSelected = selectedProgramIds.includes(program.id);
                        return (
                          <div
                            key={program.id}
                            onClick={() => toggleProgramSelection(program.id)}
                            className={cn(
                              "p-3.5 flex items-center justify-between gap-3.5 cursor-pointer transition-colors select-none",
                              isSelected ? "bg-purple-50/50 hover:bg-purple-50/80" : "hover:bg-gray-50/80 bg-white"
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleProgramSelection(program.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-[#7D52F4]"
                              />
                              <div className="relative size-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                <Image
                                  src={program.thumbnail}
                                  alt={program.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                      program.type === "bundle"
                                        ? "bg-purple-100 text-[#7D52F4]"
                                        : "bg-indigo-100 text-indigo-700"
                                    )}
                                  >
                                    {program.type === "bundle" ? "Specialization Bundle" : "Single Course"}
                                  </span>
                                  <span className="text-xs text-gray-500">&bull; {program.category}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm truncate mt-0.5">
                                  {program.title}
                                </h4>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {program.type === "bundle"
                                    ? `${program.coursesCount} Included Courses`
                                    : `${program.lessonsCount} Lessons &bull; ${program.duration}`}
                                </p>
                              </div>
                            </div>

                            <span className="font-extrabold text-sm text-gray-900 shrink-0">
                              ${program.price}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT EXISTING STUDENT(S) */}
              {modalStep === 2 && (
                <div className="space-y-4">
                  {/* Controls: Search & Company Filter */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search student by name, email, or company..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                      />
                    </div>

                    <select
                      value={studentCompanyFilter}
                      onChange={(e) => setStudentCompanyFilter(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#7D52F4] focus:outline-none whitespace-nowrap shrink-0"
                    >
                      <option value="all">All Companies ({systemStudents.length})</option>
                      {uniqueCompanies.map((comp) => (
                        <option key={comp} value={comp}>
                          {comp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selection Status Bar */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>
                      {selectedStudentIds.length === 0 ? (
                        <span className="text-amber-600 font-semibold">Select at least one trainee to proceed</span>
                      ) : (
                        <span className="text-[#7D52F4] font-bold">
                          ✓ {selectedStudentIds.length} trainee(s) selected
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectAllStudents(filteredModalStudents)}
                      className="text-xs font-semibold text-[#7D52F4] hover:underline whitespace-nowrap shrink-0"
                    >
                      {selectedStudentIds.length === filteredModalStudents.length && filteredModalStudents.length > 0
                        ? "Deselect All Filtered"
                        : "Select All Filtered"}
                    </button>
                  </div>

                  {/* Students Roster List */}
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden max-h-[380px] overflow-y-auto">
                    {filteredModalStudents.length === 0 ? (
                      <div className="py-10 text-center text-sm text-gray-500">
                        No students found matching your criteria.
                      </div>
                    ) : (
                      filteredModalStudents.map((student) => {
                        const isSelected = selectedStudentIds.includes(student.id);
                        return (
                          <div
                            key={student.id}
                            onClick={() => toggleStudentSelection(student.id)}
                            className={cn(
                              "p-3.5 flex items-center justify-between gap-3.5 cursor-pointer transition-colors select-none",
                              isSelected ? "bg-purple-50/50 hover:bg-purple-50/80" : "hover:bg-gray-50/80 bg-white"
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleStudentSelection(student.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-[#7D52F4]"
                              />
                              <div
                                className={cn(
                                  "flex size-10 items-center justify-center rounded-full font-bold text-white text-sm shrink-0",
                                  student.avatarBg
                                )}
                              >
                                {student.avatarLetter}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-gray-900 text-sm truncate">
                                    {student.name}
                                  </h4>
                                  {student.company && (
                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 truncate">
                                      {student.company}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">
                                  {student.email}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-[#7D52F4] border border-purple-200">
                                {student.enrolledCount} active course(s)
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & CONFIGURE ACCESS TERMS */}
              {modalStep === 3 && (
                <form id="final-enroll-form" onSubmit={handleFinalEnroll} className="space-y-5">
                  {/* Calculation & Summary Highlight Box */}
                  <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-purple-200/60 pb-3">
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                          Enrollment Impact
                        </span>
                        <h4 className="text-base font-extrabold text-gray-900 mt-0.5">
                          {selectedProgramIds.length} Program(s) &times; {selectedStudentIds.length} Trainee(s) ={" "}
                          <span className="text-[#7D52F4]">
                            {selectedProgramIds.length * selectedStudentIds.length} Total New Enrollments
                          </span>
                        </h4>
                      </div>
                      <span className="rounded-xl bg-[#7D52F4] text-white text-xs font-bold px-3 py-1.5">
                        Batch Ready
                      </span>
                    </div>

                    {/* Selected Programs Pills */}
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block mb-1.5">
                        Selected Program(s) ({selectedProgramIds.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {enrollmentPrograms
                          .filter((p) => selectedProgramIds.includes(p.id))
                          .map((p) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-purple-200 px-2.5 py-1 text-xs font-semibold text-gray-800"
                            >
                              <span className={p.type === "bundle" ? "text-[#7D52F4]" : "text-indigo-600"}>
                                {p.type === "bundle" ? "📦" : "📘"}
                              </span>
                              {p.title}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Selected Students Pills */}
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block mb-1.5">
                        Selected Trainee(s) ({selectedStudentIds.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {systemStudents
                          .filter((s) => selectedStudentIds.includes(s.id))
                          .map((s) => (
                            <span
                              key={s.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-purple-200 px-2.5 py-1 text-xs font-semibold text-gray-800"
                            >
                              <span className="size-4 rounded-full bg-purple-200 text-[#7D52F4] flex items-center justify-center text-[9px] font-bold">
                                {s.avatarLetter}
                              </span>
                              {s.name} ({s.email})
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Access Parameters Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Enrollment Channel
                      </label>
                      <select
                        value={enrollmentChannel}
                        onChange={(e) =>
                          setEnrollmentChannel(
                            e.target.value as "admin_manual" | "company_voucher" | "self_paid"
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:border-[#7D52F4] focus:outline-none"
                      >
                        <option value="admin_manual">Administrative Direct Enrollment</option>
                        <option value="company_voucher">Corporate Voucher Redeemed</option>
                        <option value="self_paid">Direct Payment Confirmed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Access Duration
                      </label>
                      <select
                        value={accessPeriod}
                        onChange={(e) =>
                          setAccessPeriod(e.target.value as "1 Year" | "6 Months" | "Lifetime")
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:border-[#7D52F4] focus:outline-none"
                      >
                        <option value="1 Year">1 Year Access</option>
                        <option value="6 Months">6 Months Access</option>
                        <option value="Lifetime">Lifetime Unlimited Access</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Corporate / Sponsor Tag <span className="text-gray-400 font-normal">(Optional Override)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Leave blank to use student's default company affiliation"
                        value={customCompany}
                        onChange={(e) => setCustomCompany(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Immediate Automated Notification Checkbox */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendNotification}
                        onChange={(e) => setSendNotification(e.target.checked)}
                        className="mt-0.5 size-4 rounded text-[#7D52F4] focus:ring-[#7D52F4]"
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">
                          Send automated LMS activation &amp; player access notification
                        </span>
                        <span className="text-xs text-gray-500">
                          Dispatches automated emails to all {selectedStudentIds.length} learner(s) with direct course links and instructions.
                        </span>
                      </div>
                    </label>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-4 flex items-center justify-between shrink-0">
              {modalStep === 1 ? (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalStep((prev) => (prev - 1) as 1 | 2)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  ← Back
                </button>
              )}

              {modalStep === 1 && (
                <button
                  type="button"
                  disabled={selectedProgramIds.length === 0}
                  onClick={() => setModalStep(2)}
                  className="rounded-xl bg-[#7D52F4] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-purple-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Next: Select Students ({selectedProgramIds.length}) →
                </button>
              )}

              {modalStep === 2 && (
                <button
                  type="button"
                  disabled={selectedStudentIds.length === 0}
                  onClick={() => setModalStep(3)}
                  className="rounded-xl bg-[#7D52F4] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-purple-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Next: Review &amp; Configure ({selectedStudentIds.length}) →
                </button>
              )}

              {modalStep === 3 && (
                <button
                  type="submit"
                  form="final-enroll-form"
                  className="rounded-xl bg-[#7D52F4] px-7 py-2.5 text-sm font-extrabold text-white shadow-md hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  Confirm &amp; Enroll {selectedStudentIds.length} Trainee(s) (
                  {selectedProgramIds.length * selectedStudentIds.length} Total) →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
