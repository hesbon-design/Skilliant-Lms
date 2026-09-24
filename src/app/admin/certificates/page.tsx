"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  initialCertificates,
  AdminCertificate,
  availableCoursesList,
} from "@/data/adminCertificatesData";
import { cn } from "@/lib/utils";
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  Trash2Icon,
  CertificateIcon,
  GridViewIcon,
  TableViewIcon,
  CloseIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from "../adminIcons";
import defaultCertificateSettings from "@/data/certificateSettings.json";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<AdminCertificate[]>(initialCertificates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<AdminCertificate | null>(null);
  const [previewCert, setPreviewCert] = useState<AdminCertificate | null>(null);

  // Governance Settings State
  const [govSettings, setGovSettings] = useState(defaultCertificateSettings);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    courseSlug: availableCoursesList[0]?.slug || "",
    courseTitle: availableCoursesList[0]?.title || "",
    category: availableCoursesList[0]?.category || "Development",
    templateStyle: "Classic Border" as AdminCertificate["templateStyle"],
    signatoryName: "Dr. Hesbon Ombati",
    signatoryTitle: "Dean of Technical Education & Academy Director",
    organization: "Skilliant Global Academy",
    passingScore: 80,
    validity: "Lifetime" as AdminCertificate["validity"],
    status: "Active" as AdminCertificate["status"],
    description: "",
  });

  // Filtering
  const filteredCertificates = certificates.filter((cert) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      cert.title.toLowerCase().includes(q) ||
      cert.code.toLowerCase().includes(q) ||
      cert.courseTitle.toLowerCase().includes(q) ||
      cert.category.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    const matchesTemplate = templateFilter === "all" || cert.templateStyle === templateFilter;

    return matchesSearch && matchesStatus && matchesTemplate;
  });

  // Select all toggle
  const handleSelectAll = () => {
    if (selectedIds.length === filteredCertificates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCertificates.map((c) => c.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Apply
  const handleBulkApply = () => {
    if (bulkAction === "delete" && selectedIds.length > 0) {
      if (confirm(`Delete ${selectedIds.length} selected certificates?`)) {
        setCertificates(certificates.filter((c) => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setBulkAction("");
      }
    } else if (bulkAction === "activate" && selectedIds.length > 0) {
      setCertificates(
        certificates.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Active" } : c))
      );
      setSelectedIds([]);
      setBulkAction("");
    } else if (bulkAction === "draft" && selectedIds.length > 0) {
      setCertificates(
        certificates.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Draft" } : c))
      );
      setSelectedIds([]);
      setBulkAction("");
    }
  };

  // Single Delete
  const handleDeleteCert = (id: string) => {
    if (confirm("Are you sure you want to delete this certificate template?")) {
      setCertificates(certificates.filter((c) => c.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    setEditingCert(null);
    setFormData({
      title: "",
      code: `SKL-CERT-GEN${randomSuffix}`,
      courseSlug: availableCoursesList[0]?.slug || "",
      courseTitle: availableCoursesList[0]?.title || "",
      category: availableCoursesList[0]?.category || "Development",
      templateStyle: "Classic Border",
      signatoryName: "Dr. Hesbon Ombati",
      signatoryTitle: "Dean of Technical Education & Academy Director",
      organization: "Skilliant Global Academy",
      passingScore: 80,
      validity: "Lifetime",
      status: "Active",
      description: "Awarded upon successful completion of required curriculum, verified quizzes, and practical assessments.",
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cert: AdminCertificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      code: cert.code,
      courseSlug: cert.courseSlug,
      courseTitle: cert.courseTitle,
      category: cert.category,
      templateStyle: cert.templateStyle,
      signatoryName: cert.signatoryName,
      signatoryTitle: cert.signatoryTitle,
      organization: cert.organization,
      passingScore: cert.passingScore,
      validity: cert.validity,
      status: cert.status,
      description: cert.description,
    });
    setIsCreateModalOpen(true);
  };

  // Save / Submit
  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) return;

    const matchedCourse = availableCoursesList.find((c) => c.slug === formData.courseSlug);
    const finalCourseTitle = matchedCourse?.title || formData.courseTitle;
    const finalCategory = matchedCourse?.category || formData.category;

    if (editingCert) {
      setCertificates((prev) =>
        prev.map((c) =>
          c.id === editingCert.id
            ? {
                ...c,
                title: formData.title.trim(),
                code: formData.code.trim().toUpperCase(),
                courseSlug: formData.courseSlug,
                courseTitle: finalCourseTitle,
                category: finalCategory,
                templateStyle: formData.templateStyle,
                signatoryName: formData.signatoryName.trim(),
                signatoryTitle: formData.signatoryTitle.trim(),
                organization: formData.organization.trim(),
                passingScore: Number(formData.passingScore) || 80,
                validity: formData.validity,
                status: formData.status,
                description: formData.description.trim(),
              }
            : c
        )
      );
    } else {
      const newCert: AdminCertificate = {
        id: `cert-tpl-${Date.now()}`,
        code: formData.code.trim().toUpperCase(),
        title: formData.title.trim(),
        courseSlug: formData.courseSlug,
        courseTitle: finalCourseTitle,
        category: finalCategory,
        templateStyle: formData.templateStyle,
        signatoryName: formData.signatoryName.trim(),
        signatoryTitle: formData.signatoryTitle.trim(),
        organization: formData.organization.trim(),
        passingScore: Number(formData.passingScore) || 80,
        validity: formData.validity,
        issuedCount: 0,
        status: formData.status,
        description: formData.description.trim(),
        createdAt: new Date().toISOString().split("T")[0],
        accentColor: "#7D52F4",
      };
      setCertificates([newCert, ...certificates]);
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header with NO supporting text subtitle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Certificates
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
          >
            <SettingsIcon className="size-4 shrink-0 text-gray-500" />
            <span className="whitespace-nowrap">Certificate Settings</span>
          </button>

          <Link
            href="/admin/certificates/builder"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7D52F4] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <PlusIcon className="size-4 shrink-0" />
            <span className="whitespace-nowrap">+ Create Certificate</span>
          </Link>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="">Bulk Action</option>
            <option value="activate">Mark as Active</option>
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

        {/* Search, Filters, and View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <SearchIcon className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>

          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Templates</option>
            <option value="Classic Border">Classic Border</option>
            <option value="Modern Geometric">Modern Geometric</option>
            <option value="Technical Excellence">Technical Excellence</option>
            <option value="Corporate Crest">Corporate Crest</option>
          </select>

          {/* Card / Table View Toggle */}
          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/70 p-1">
            <button
              onClick={() => setViewMode("card")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0",
                viewMode === "card"
                  ? "bg-white text-purple-700 shadow-2xs font-bold"
                  : "text-gray-600 hover:text-gray-900"
              )}
              title="Card View"
            >
              <GridViewIcon className="size-3.5 shrink-0" />
              <span className="whitespace-nowrap">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0",
                viewMode === "table"
                  ? "bg-white text-purple-700 shadow-2xs font-bold"
                  : "text-gray-600 hover:text-gray-900"
              )}
              title="Table View"
            >
              <TableViewIcon className="size-3.5 shrink-0" />
              <span className="whitespace-nowrap">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA: CARD VIEW OR TABLE VIEW */}
      {filteredCertificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-gray-100 bg-white text-center shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-3">
            <CertificateIcon className="size-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Certificates Found</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            No certificate templates match your current filters. Adjust your search or create a new certificate.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <PlusIcon className="size-4 shrink-0" />
            <span className="whitespace-nowrap">+ Create Certificate</span>
          </button>
        </div>
      ) : viewMode === "card" ? (
        /* ================= CARD VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => {
            const isSelected = selectedIds.includes(cert.id);

            return (
              <div
                key={cert.id}
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden transition-all hover:shadow-md hover:border-purple-200 flex flex-col justify-between",
                  isSelected && "border-purple-400 ring-2 ring-purple-100"
                )}
              >
                {/* Visual Certificate Card Simulation Preview */}
                <div className="relative bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50 p-3.5 sm:p-4 border-b border-gray-100">
                  {/* Top Bar: Checkbox & Status */}
                  <div className="flex items-center justify-between mb-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(cert.id)}
                      className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />

                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0",
                        cert.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          cert.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                        )}
                      />
                      <span>{cert.status}</span>
                    </span>
                  </div>

                  {/* Certificate Border Render - Fills Top Width */}
                  <div
                    className={cn(
                      "w-full aspect-[16/10] rounded-xl bg-white p-3.5 sm:p-4 shadow-xs border flex flex-col justify-between relative overflow-hidden",
                      cert.templateStyle === "Classic Border" && "border-2 border-amber-300 ring-2 ring-amber-50",
                      cert.templateStyle === "Corporate Crest" && "border-2 border-indigo-300 ring-2 ring-indigo-50",
                      cert.templateStyle === "Technical Excellence" && "border-2 border-teal-300 ring-2 ring-teal-50",
                      cert.templateStyle === "Modern Geometric" && "border-2 border-purple-300 ring-2 ring-purple-50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-purple-600 uppercase tracking-widest block">
                          SKILLIANT ACADEMY
                        </span>
                        <div className="h-0.5 w-12 bg-purple-400 rounded-full" />
                      </div>
                      <div className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs shadow-2xs font-bold shrink-0">
                        ★
                      </div>
                    </div>

                    <div className="text-center my-auto py-1">
                      <p className="text-xs sm:text-sm font-serif font-bold text-gray-900 leading-snug line-clamp-2">
                        {cert.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-1">
                        {cert.courseTitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 text-[10px] sm:text-xs text-gray-500">
                      <span className="font-mono">{cert.code}</span>
                      <span className="font-semibold text-purple-700">{cert.validity}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content & Title */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                    {cert.title}
                  </h3>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between gap-2 p-4 bg-gray-50/60 border-t border-gray-100">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    <ExternalLinkIcon className="size-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Preview</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/certificates/builder?id=${cert.id}`}
                      className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span className="whitespace-nowrap">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="rounded-xl p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                      title="Delete Certificate"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-sm text-gray-600 min-w-[950px]">
              <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="w-12 px-4 py-3.5 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={
                        filteredCertificates.length > 0 &&
                        selectedIds.length === filteredCertificates.length
                      }
                      onChange={handleSelectAll}
                      className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Certificate Title &amp; Code</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Assigned Course</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Template Design</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Criteria &amp; Validity</th>
                  <th className="px-4 py-3.5 text-center whitespace-nowrap">Recipients</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCertificates.map((cert) => {
                  const isSelected = selectedIds.includes(cert.id);
                  return (
                    <tr
                      key={cert.id}
                      className={cn(
                        "hover:bg-purple-50/20 transition-colors",
                        isSelected && "bg-purple-50/40"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(cert.id)}
                          className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>

                      {/* Title & Code */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{cert.title}</div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <code className="rounded bg-purple-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-purple-700">
                            {cert.code}
                          </code>
                          <span className="text-xs text-gray-500">{cert.category}</span>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-800">
                        {cert.courseTitle}
                      </td>

                      {/* Template Design */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                          {cert.templateStyle}
                        </span>
                      </td>

                      {/* Criteria & Validity */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">
                        <div>
                          Pass: <strong className="text-gray-900">{cert.passingScore}%</strong>
                        </div>
                        <div className="text-gray-500">{cert.validity}</div>
                      </td>

                      {/* Recipients Count */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="inline-block rounded-lg bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 text-xs">
                          {cert.issuedCount} Awarded
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
                            cert.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          )}
                        >
                          {cert.status === "Active" ? "● Active" : "○ Draft"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewCert(cert)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span className="whitespace-nowrap">Preview</span>
                          </button>
                          <Link
                            href={`/admin/certificates/builder?id=${cert.id}`}
                            className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span className="whitespace-nowrap">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteCert(cert.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors shrink-0"
                            title="Delete"
                          >
                            <Trash2Icon className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CREATE / EDIT CERTIFICATE MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Certificate Governance
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCert ? "Edit Course Certificate" : "Configure New Course Certificate"}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors shrink-0"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Certificate Title <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Professional Certificate in Full-Stack Web Development"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Credential Code <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKL-CERT-WD01"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm font-mono text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Assigned Course <span className="text-purple-600">*</span>
                  </label>
                  <select
                    value={formData.courseSlug}
                    onChange={(e) => setFormData({ ...formData, courseSlug: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-800 focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    {availableCoursesList.map((course) => (
                      <option key={course.slug} value={course.slug}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Visual Template Design
                  </label>
                  <select
                    value={formData.templateStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        templateStyle: e.target.value as AdminCertificate["templateStyle"],
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-800 focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Classic Border">Classic Border (Academic Gold)</option>
                    <option value="Modern Geometric">Modern Geometric (Purple Tech)</option>
                    <option value="Technical Excellence">Technical Excellence (Teal Engineering)</option>
                    <option value="Corporate Crest">Corporate Crest (Enterprise Logistics)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Passing Score Required (%)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Validity Duration
                  </label>
                  <select
                    value={formData.validity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validity: e.target.value as AdminCertificate["validity"],
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-800 focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Lifetime">Lifetime (No Expiration)</option>
                    <option value="1 Year">1 Year (Annual Recertification)</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Lifecycle Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as AdminCertificate["status"],
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-800 focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active (Issued upon course completion)</option>
                    <option value="Draft">Draft (Hidden from students)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    value={formData.signatoryName}
                    onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Signatory Title
                  </label>
                  <input
                    type="text"
                    value={formData.signatoryTitle}
                    onChange={(e) => setFormData({ ...formData, signatoryTitle: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-800 text-sm mb-1">
                    Competency Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the skills and standards certified..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Certificate Builder Preview Callout */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 text-xs text-purple-900">
                <div className="flex items-center gap-2 font-bold">
                  <CertificateIcon className="size-4 text-purple-700 shrink-0" />
                  <span>Visual Certificate Drag-and-Drop Builder</span>
                </div>
                <p className="mt-1 text-purple-800 leading-relaxed">
                  Interactive canvas customization (custom seals, company watermarks, dynamic badge layout) is scheduled for the upcoming builder upgrade. All template specifications configure immediately for learner completions.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">
                    {editingCert ? "Save Certificate" : "Publish Certificate"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CERTIFICATE PREVIEW MODAL ================= */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-10 shadow-2xl border border-gray-100 space-y-6 max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Live Credential Preview
                </span>
                <h3 className="text-lg font-bold text-gray-900">{previewCert.title}</h3>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors shrink-0"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {/* High-Resolution Certificate Simulation Paper */}
            <div
              className={cn(
                "w-full rounded-2xl bg-[#FCFDFF] p-8 sm:p-12 text-center relative overflow-hidden shadow-lg transition-all",
                previewCert.templateStyle === "Classic Border" &&
                  "border-8 border-double border-amber-400 ring-4 ring-amber-100",
                previewCert.templateStyle === "Corporate Crest" &&
                  "border-8 border-double border-indigo-600 ring-4 ring-indigo-100",
                previewCert.templateStyle === "Technical Excellence" &&
                  "border-8 border-double border-teal-600 ring-4 ring-teal-100",
                previewCert.templateStyle === "Modern Geometric" &&
                  "border-8 border-double border-purple-600 ring-4 ring-purple-100"
              )}
            >
              {/* Corner Watermarks */}
              <div className="absolute top-3 left-3 text-2xl opacity-40">⚜</div>
              <div className="absolute top-3 right-3 text-2xl opacity-40">⚜</div>
              <div className="absolute bottom-3 left-3 text-2xl opacity-40">⚜</div>
              <div className="absolute bottom-3 right-3 text-2xl opacity-40">⚜</div>

              {/* Institution Header */}
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-purple-700 uppercase tracking-widest">
                  {previewCert.organization}
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 tracking-tight">
                  Certificate of Competence &amp; Mastery
                </h2>
                <div className="mx-auto h-0.5 w-32 bg-amber-400 rounded-full my-2" />
              </div>

              {/* Body */}
              <div className="my-8 space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  This certifies that
                </p>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-purple-900 underline decoration-purple-200 underline-offset-8">
                  Alex Walker
                </h3>
                <p className="text-xs text-gray-500 max-w-lg mx-auto pt-2">
                  has satisfied all coursework, assessments, and verified laboratory drill standards with an evaluation score of 96% in:
                </p>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 pt-1">
                  {previewCert.courseTitle}
                </h4>
              </div>

              {/* Signatures & Seal Bar */}
              <div className="mt-10 pt-6 border-t border-gray-200 grid grid-cols-3 items-end text-xs">
                {/* Signatory */}
                <div className="text-center">
                  <div className="font-serif italic text-base font-bold text-gray-800">
                    {previewCert.signatoryName}
                  </div>
                  <div className="h-px w-28 bg-gray-400 mx-auto my-1" />
                  <p className="font-semibold text-gray-700">{previewCert.signatoryTitle}</p>
                </div>

                {/* Center Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 font-bold shadow-md ring-4 ring-amber-100 text-xl">
                    ★
                  </div>
                  <span className="mt-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Official Seal
                  </span>
                </div>

                {/* Verification Metadata */}
                <div className="text-center space-y-0.5">
                  <p className="font-mono text-[10px] text-gray-400">CREDENTIAL ID</p>
                  <p className="font-mono font-bold text-gray-800">{previewCert.code}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    ✓ Verified on Blockchain
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-500">
                Template: <strong>{previewCert.templateStyle}</strong> • Validity: <strong>{previewCert.validity}</strong>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/certificates/verify?code=${previewCert.code}`}
                  target="_blank"
                  className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Verify Credential ↗</span>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Print / Export PDF</span>
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="rounded-xl bg-[#7D52F4] px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Close Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= GLOBAL CERTIFICATE GOVERNANCE SETTINGS MODAL ================= */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto [scrollbar-width:thin]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#7D52F4] uppercase tracking-wider">Governance &amp; Authority</span>
                <h3 className="text-xl font-bold text-gray-900">Certificate Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {settingsNotice && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-in fade-in duration-100">
                ✓ {settingsNotice}
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* 1. Instructor Template Permission Toggle */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Allow Instructors to Use Admin Templates</span>
                  <input
                    type="checkbox"
                    checked={govSettings.allowInstructorsToUseAdminCertificates}
                    onChange={(e) =>
                      setGovSettings({ ...govSettings, allowInstructorsToUseAdminCertificates: e.target.checked })
                    }
                    className="size-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>
                <p className="text-gray-500 leading-snug">
                  Enable instructors to assign certificate templates built by admin to their courses.
                </p>
              </div>

              {/* 2. Head of Institution / Authorized Name */}
              <div className="space-y-1">
                <label className="font-bold text-gray-800">
                  Head of Institution / Authorized Name
                </label>
                <input
                  type="text"
                  value={govSettings.authorizedName}
                  onChange={(e) => setGovSettings({ ...govSettings, authorizedName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <span className="text-[11px] text-gray-400">
                  Auto-picked from admin. This name is printed under the authorized signature on credentials.
                </span>
              </div>

              {/* 3. Authorized Designation / Title */}
              <div className="space-y-1">
                <label className="font-bold text-gray-800">
                  Signatory Designation / Title
                </label>
                <input
                  type="text"
                  value={govSettings.authorizedTitle}
                  onChange={(e) => setGovSettings({ ...govSettings, authorizedTitle: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* 4. Authorized Company / Institution Name */}
              <div className="space-y-1">
                <label className="font-bold text-gray-800">
                  Authorized Company / Academy Name
                </label>
                <input
                  type="text"
                  value={govSettings.authorizedCompany}
                  onChange={(e) => setGovSettings({ ...govSettings, authorizedCompany: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <span className="text-[11px] text-gray-400">Auto-picked from application profile.</span>
              </div>

              {/* 5. Show Instructor Name Toggle */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Show Instructor Name on Certificate</span>
                  <input
                    type="checkbox"
                    checked={govSettings.showInstructorName}
                    onChange={(e) =>
                      setGovSettings({ ...govSettings, showInstructorName: e.target.checked })
                    }
                    className="size-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>
                <p className="text-gray-500 leading-snug">
                  Default is OFF. University credentials showcase the Head of Institution. Enable to also show the course instructor.
                </p>
              </div>

              {/* 6. Send Certificate Link in Course Completion Email */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Send Certificate Link in Completion Email</span>
                  <input
                    type="checkbox"
                    checked={govSettings.sendCertificateLinkInEmail}
                    onChange={(e) =>
                      setGovSettings({ ...govSettings, sendCertificateLinkInEmail: e.target.checked })
                    }
                    className="size-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>
                <p className="text-gray-500 leading-snug">
                  Automatically delivers the direct certificate link along with the completion email.
                </p>
              </div>

              {/* 7. Require Login to View Certificate */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Require Student Login to View</span>
                  <input
                    type="checkbox"
                    checked={govSettings.requireLoginToAccess}
                    onChange={(e) =>
                      setGovSettings({ ...govSettings, requireLoginToAccess: e.target.checked })
                    }
                    className="size-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>
                <p className="text-gray-500 leading-snug">
                  Students must be logged in to access credentials if public view is not enabled.
                </p>
              </div>

              {/* 8. Certificate Verification Hub Link */}
              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <span className="text-gray-600 font-medium">Verification System:</span>
                <Link
                  href="/certificates/verify"
                  target="_blank"
                  className="font-bold text-[#7D52F4] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Verification Hub ↗</span>
                </Link>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSettingsNotice("Certificate settings successfully saved!");
                  setTimeout(() => {
                    setSettingsNotice(null);
                    setIsSettingsModalOpen(false);
                  }, 1200);
                }}
                className="rounded-xl bg-[#7D52F4] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
