"use client";

import React, { useState } from "react";
import { initialAdminSpecializations, AdminSpecialization } from "@/data/adminBundlesData";
import { cn } from "@/lib/utils";
import { SearchIcon, PlusIcon, Trash2Icon, BundleIcon, CoursesIcon } from "../adminIcons";

// Available catalog courses to select when building a specialization
const availableCatalogCourses = [
  { id: "c-1", title: "The Complete Web Development Bootcamp", hours: 24, price: 120, instructor: "John Doe" },
  { id: "c-2", title: "Python for Data Science & Predictive Maintenance", hours: 18, price: 99, instructor: "Data Science Faculty" },
  { id: "c-3", title: "Data Science Foundations & Machine Learning", hours: 22, price: 110, instructor: "Data Science Faculty" },
  { id: "c-4", title: "Figma Fundamentals & Interactive Prototyping", hours: 14, price: 90, instructor: "Sarah Jenkins" },
  { id: "c-5", title: "UX Research, User Interviews & Usability Testing", hours: 18, price: 100, instructor: "Sarah Jenkins" },
  { id: "c-6", title: "Design Systems, Tokens & Component Libraries", hours: 20, price: 100, instructor: "Technical Design Board" },
  { id: "c-7", title: "Forklift Safety & Zero-Fault Inspection", hours: 16, price: 150, instructor: "Technical Board" },
  { id: "c-8", title: "Heavy Excavator & Hydraulic Precision Controls", hours: 24, price: 200, instructor: "Chief Operator Miller" },
  { id: "c-9", title: "DOT Hazard Compliance & Site Rigging Protocols", hours: 18, price: 100, instructor: "Compliance Inspector Daniels" },
];

export default function AdminBundlesPage() {
  const [specializations, setSpecializations] = useState<AdminSpecialization[]>(
    initialAdminSpecializations
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Specialization Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategory, setNewCategory] = useState("Design & UX");
  const [newDesc, setNewDesc] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([
    "c-4",
    "c-5",
    "c-6",
  ]);
  const [newBundlePrice, setNewBundlePrice] = useState<number>(199);
  const [newInstallmentPrice, setNewInstallmentPrice] = useState<number>(55);
  const [newCertTitle, setNewCertTitle] = useState("Professional Certified Specialist");

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    setNewSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  // Toggle selected course
  const handleToggleCourse = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  // Calculations for selected courses in modal
  const selectedCoursesData = availableCatalogCourses.filter((c) =>
    selectedCourseIds.includes(c.id)
  );
  const calculatedIndividualSum = selectedCoursesData.reduce((sum, c) => sum + c.price, 0);
  const calculatedSavingsPercent =
    calculatedIndividualSum > newBundlePrice
      ? Math.round(((calculatedIndividualSum - newBundlePrice) / calculatedIndividualSum) * 100)
      : 0;

  // Create Specialization Form Submit
  const handleCreateSpecialization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || selectedCourseIds.length === 0) return;

    const totalHours = selectedCoursesData.reduce((sum, c) => sum + c.hours, 0);

    const created: AdminSpecialization = {
      id: `spec-${Date.now()}`,
      title: newTitle.trim(),
      slug: newSlug.trim() || `specialization-${Date.now()}`,
      shortDescription: newDesc.trim() || "Comprehensive multi-course specialization track.",
      category: newCategory,
      subCourses: selectedCoursesData.map((c, i) => ({
        id: `sub-${Date.now()}-${i}`,
        title: c.title,
        durationHours: c.hours,
        instructor: c.instructor,
        lessonsCount: Math.round(c.hours * 1.5),
      })),
      totalCourses: selectedCoursesData.length,
      totalHours: totalHours,
      pricing: {
        oneTimePrice: Number(newBundlePrice) || 150,
        installmentPrice: Number(newInstallmentPrice) || undefined,
        individualTotalPrice: calculatedIndividualSum,
        savingsPercent: calculatedSavingsPercent,
      },
      certificateTitle: newCertTitle.trim() || "Certified Professional Specialist",
      enrolledCount: 0,
      status: "Published",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setSpecializations([created, ...specializations]);
    setIsModalOpen(false);

    // Reset Form
    setNewTitle("");
    setNewSlug("");
    setNewDesc("");
    setSelectedCourseIds(["c-4", "c-5", "c-6"]);
    setNewBundlePrice(199);
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setSpecializations(
      specializations.map((spec) => {
        if (spec.id === id) {
          const next = spec.status === "Published" ? "Draft" : "Published";
          return { ...spec, status: next };
        }
        return spec;
      })
    );
  };

  // Delete Specialization
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this specialization bundle?")) {
      setSpecializations(specializations.filter((s) => s.id !== id));
    }
  };

  // Filtered List
  const filteredSpecializations = specializations.filter((spec) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      spec.title.toLowerCase().includes(query) ||
      spec.shortDescription.toLowerCase().includes(query) ||
      spec.subCourses.some((c) => c.title.toLowerCase().includes(query));

    const matchesCategory =
      categoryFilter === "all" ? true : spec.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ? true : spec.status === statusFilter;

    return matchesQuery && matchesCategory && matchesStatus;
  });

  // KPIs
  const totalSpecs = specializations.length;
  const activeSpecs = specializations.filter((s) => s.status === "Published").length;
  const totalBundledCourses = specializations.reduce((sum, s) => sum + s.totalCourses, 0);
  const totalEnrollees = specializations.reduce((sum, s) => sum + s.enrolledCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Bundles &amp; Specializations
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <PlusIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">Create Specialization</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Specializations</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <BundleIcon className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{totalSpecs}</h3>
          <p className="mt-1 text-sm text-gray-500">{activeSpecs} published in catalog</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Courses Bundled</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <CoursesIcon className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-purple-700">{totalBundledCourses}</h3>
          <p className="mt-1 text-sm text-gray-500">Across multi-course tracks</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Specialization Students</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <span className="font-bold text-sm">🎓</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-emerald-600">{totalEnrollees}</h3>
          <p className="mt-1 text-sm text-gray-500">Enrolled in full tracks</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Average Bundle Savings</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <span className="font-bold text-sm">%</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">26%</h3>
          <p className="mt-1 text-sm text-gray-500">Savings vs individual courses</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search specializations, sub-courses, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Design & UX">Design &amp; UX</option>
            <option value="Heavy Machinery">Heavy Machinery</option>
            <option value="Development">Development</option>
            <option value="Data & AI">Data &amp; AI</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Specializations Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-700 min-w-[950px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Specialization Track</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Sub-Courses Included</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Total Duration</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Bundle Pricing</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Trainees Enrolled</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSpecializations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                    No specializations match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredSpecializations.map((spec) => (
                  <tr key={spec.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* Specialization Details */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900 text-base line-clamp-1">
                        {spec.title}
                      </div>
                      <div className="text-xs text-purple-600 font-semibold uppercase tracking-wider mt-0.5">
                        {spec.category} • /{spec.slug}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {spec.shortDescription}
                      </div>
                    </td>

                    {/* Sub-Courses Pill Stack */}
                    <td className="px-4 py-4 min-w-[280px]">
                      <div className="space-y-1">
                        {spec.subCourses.map((course, idx) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-1.5 text-xs text-gray-700"
                          >
                            <span className="flex size-4 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-medium truncate max-w-[240px]" title={course.title}>
                              {course.title}
                            </span>
                            <span className="text-gray-400 shrink-0">({course.durationHours}h)</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-1.5 text-xs font-semibold text-purple-700">
                        {spec.totalCourses} Sequential Courses
                      </div>
                    </td>

                    {/* Total Duration */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{spec.totalHours} Hours</div>
                      <div className="text-xs text-gray-500">Comprehensive Track</div>
                    </td>

                    {/* Bundle Pricing */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900">
                          ${spec.pricing.oneTimePrice}.00
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ${spec.pricing.individualTotalPrice}.00
                        </span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          Save {spec.pricing.savingsPercent}%
                        </span>
                      </div>
                      {spec.pricing.installmentPrice && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          Or ${spec.pricing.installmentPrice}/mo installments
                        </div>
                      )}
                    </td>

                    {/* Enrolled Count */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{spec.enrolledCount}</div>
                      <div className="text-xs text-gray-500">Active Students</div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(spec.id)}
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer",
                          spec.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        )}
                        title="Click to toggle publish status"
                      >
                        {spec.status === "Published" ? "● Published" : "○ Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(spec.id)}
                          className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          {spec.status === "Published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDelete(spec.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete specialization"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SPECIALIZATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Create New Specialization</h3>
                <p className="text-sm text-gray-500">
                  Assemble individual catalog courses into a structured specialization curriculum.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSpecialization} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Specialization Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack UX Design Specialization"
                    value={newTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Design & UX">Design &amp; UX</option>
                    <option value="Heavy Machinery">Heavy Machinery</option>
                    <option value="Development">Development</option>
                    <option value="Data & AI">Data &amp; AI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  URL Slug Permalink
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                  <span>/specializations/</span>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Overview of learning outcomes, skills acquired, and industry application..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Sub-courses selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Catalog Courses for this Specialization ({selectedCourseIds.length} Selected)
                  </label>
                  <span className="text-xs text-purple-700 font-medium">
                    Sum of Courses: ${calculatedIndividualSum}.00
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/40 p-3 space-y-2 [scrollbar-width:thin]">
                  {availableCatalogCourses.map((course) => {
                    const isChecked = selectedCourseIds.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={cn(
                          "flex items-center justify-between rounded-xl p-2.5 text-sm cursor-pointer transition-all border",
                          isChecked
                            ? "border-purple-300 bg-purple-50/60 font-semibold text-purple-900"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCourse(course.id)}
                            className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span>{course.title}</span>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">
                          {course.hours} hrs • ${course.price}.00
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Bundle Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    One-Time Bundle Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newBundlePrice}
                    onChange={(e) => setNewBundlePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-bold text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                  {calculatedSavingsPercent > 0 && (
                    <p className="mt-1 text-xs font-semibold text-emerald-600">
                      Trainees save {calculatedSavingsPercent}% compared to purchasing individually!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Monthly Installment Plan ($/mo)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newInstallmentPrice}
                    onChange={(e) => setNewInstallmentPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                  <p className="mt-1 text-xs text-gray-500">e.g. 3 monthly payments of ${newInstallmentPrice}</p>
                </div>
              </div>

              {/* Certification Credential Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Awarded Certification Credential *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified UX & Design Systems Specialist"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 whitespace-nowrap shrink-0"
                >
                  Create &amp; Publish Specialization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
