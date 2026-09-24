"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  PlusIcon,
  CloseIcon,
  EyeIcon,
  Trash2Icon,
} from "../../adminIcons";
import { cn } from "@/lib/utils";

import catalogCoursesJson from "@/data/catalogCourses.json";
import certTemplatesJson from "@/data/certificateTemplates.json";

interface CatalogCourse {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  thumbnail: string;
  durationMinutes: number;
  durationFormatted: string;
  quizzes: number;
  lessons: number;
  downloadableResources: number;
  category: string;
}

interface CertTemplateOption {
  id: string;
  name: string;
  isNone?: boolean;
  bgGradient: string;
  badgeAccent: string;
  borderColor: string;
}

const availableCatalogCourses: CatalogCourse[] = (catalogCoursesJson as any[]).filter(
  (c) => c.type === "course"
) as CatalogCourse[];

const certificateTemplatesList: CertTemplateOption[] = certTemplatesJson as CertTemplateOption[];

export default function NewCourseBundlePage() {
  const router = useRouter();

  // Wizard Step
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1: Basics
  const [title, setTitle] = useState("New Bundle");
  const [slug, setSlug] = useState("new-bundle");
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [description, setDescription] = useState("");
  const [descTab, setDescTab] = useState<"visual" | "code">("visual");

  // Options: Enrollment
  const [maxStudents, setMaxStudents] = useState<number>(0);
  const [hasEnrollmentPeriod, setHasEnrollmentPeriod] = useState(false);
  const [pauseEnrollment, setPauseEnrollment] = useState(false);

  // Selected Courses
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [modalSelectedIds, setModalSelectedIds] = useState<string[]>([]);
  const [modalPage, setModalPage] = useState(1);

  // Right Column Sidebar
  const [visibility, setVisibility] = useState<"Public" | "Password Protected" | "Private">("Public");
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [regularPrice, setRegularPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [ribbonDisplay, setRibbonDisplay] = useState("Show Discount % Off");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Development"]);

  // Top Header Menus
  const [publishDropdownOpen, setPublishDropdownOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Step 2: Additional
  const [whatWillILearn, setWhatWillILearn] = useState("");
  const [certTab, setCertTab] = useState<"templates" | "custom">("templates");
  const [selectedCertTemplateId, setSelectedCertTemplateId] = useState<string>("none");
  const [provideIndividualCerts, setProvideIndividualCerts] = useState(true);

  // Title slug synchronization
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditingSlug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  // Open Select Courses Modal
  const handleOpenCoursesModal = () => {
    setModalSelectedIds([...selectedCourseIds]);
    setModalSearch("");
    setModalPage(1);
    setIsCoursesModalOpen(true);
  };

  const handleToggleModalCourse = (id: string) => {
    if (modalSelectedIds.includes(id)) {
      setModalSelectedIds(modalSelectedIds.filter((item) => item !== id));
    } else {
      setModalSelectedIds([...modalSelectedIds, id]);
    }
  };

  const handleApplySelectedCourses = () => {
    setSelectedCourseIds([...modalSelectedIds]);
    setIsCoursesModalOpen(false);
  };

  const handleRemoveSelectedCourse = (id: string) => {
    setSelectedCourseIds(selectedCourseIds.filter((item) => item !== id));
  };

  // Category Checkbox Toggle
  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Aggregated Selection Overview Calculations
  const selectedCoursesObjects = availableCatalogCourses.filter((c) =>
    selectedCourseIds.includes(c.id)
  );

  const totalDurationMinutes = selectedCoursesObjects.reduce((acc, c) => acc + c.durationMinutes, 0);
  const hours = Math.floor(totalDurationMinutes / 60);
  const minutes = totalDurationMinutes % 60;
  const totalDurationFormatted = hours > 0
    ? String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0")
    : "00:" + String(minutes).padStart(2, "0");

  const totalQuizPapers = selectedCoursesObjects.reduce((acc, c) => acc + c.quizzes, 0);
  const totalLessonContent = selectedCoursesObjects.reduce((acc, c) => acc + c.lessons, 0);
  const totalDownloadableResources = selectedCoursesObjects.reduce((acc, c) => acc + c.downloadableResources, 0);

  // Filtered courses in modal
  const filteredModalCourses = availableCatalogCourses.filter((c) =>
    c.title.toLowerCase().includes(modalSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // Publish / Save Handlers
  const handleSaveDraft = () => {
    setSaveToast("Bundle saved as Draft successfully!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handlePublishBundle = () => {
    setSaveToast("Bundle published successfully to catalog!");
    setTimeout(() => {
      router.push("/admin/courses");
    }, 1200);
  };

  const handleMoveToTrash = () => {
    if (confirm("Move this course bundle to trash?")) {
      router.push("/admin/courses");
    }
  };

  return (
    <div className="-m-6 sm:-m-8 lg:-m-10 min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Wizard Sticky Header matching designs */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-8 shadow-xs">
        {/* Left Side: Title + Step Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/courses"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              Courses
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-base font-bold text-gray-900 whitespace-nowrap">
              New Bundle
            </span>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold">
            {/* Step 1: Basics */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all whitespace-nowrap shrink-0",
                currentStep === 1
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <span
                className={cn(
                  "flex size-5 sm:size-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                  currentStep === 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                1
              </span>
              <span className="hidden sm:inline whitespace-nowrap">Basics</span>
            </button>

            <span className="text-gray-300">—</span>

            {/* Step 2: Additional */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all whitespace-nowrap shrink-0",
                currentStep === 2
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <span
                className={cn(
                  "flex size-5 sm:size-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                  currentStep === 2
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                2
              </span>
              <span className="hidden sm:inline whitespace-nowrap">Additional</span>
            </button>
          </div>
        </div>

        {/* Right Side: Save as Draft, Publish split button, Close button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
          >
            <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span className="hidden sm:inline whitespace-nowrap">Save as Draft</span>
          </button>

          {/* Publish Split Button */}
          <div className="relative inline-flex rounded-xl shadow-xs">
            <button
              type="button"
              onClick={handlePublishBundle}
              className="rounded-l-xl bg-purple-600 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
            >
              Publish Bundle
            </button>
            <button
              type="button"
              onClick={() => setPublishDropdownOpen(!publishDropdownOpen)}
              className="rounded-r-xl border-l border-purple-500 bg-purple-600 px-2 py-2 text-white hover:bg-purple-700 transition-colors shrink-0"
              title="Publish Options"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Options: Preview, Move to Trash (Legacy Mode omitted per directive) */}
            {publishDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="/courses"
                  target="_blank"
                  className="flex items-center justify-between px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  onClick={() => setPublishDropdownOpen(false)}
                >
                  <span>Preview</span>
                  <svg className="size-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>

                <button
                  type="button"
                  onClick={handleMoveToTrash}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 text-left transition-colors whitespace-nowrap"
                >
                  <Trash2Icon className="size-4 shrink-0" />
                  <span>Move to Trash</span>
                </button>
              </div>
            )}
          </div>

          {/* Close button returning to /admin/courses */}
          <Link
            href="/admin/courses"
            className="flex size-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
            title="Close Builder"
          >
            <CloseIcon className="size-5" />
          </Link>
        </div>
      </header>

      {/* Success Banner */}
      {saveToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4 w-full">
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">✓</span>
              <span className="font-semibold">{saveToast}</span>
            </div>
            <button onClick={() => setSaveToast(null)} className="text-xs font-bold underline">Dismiss</button>
          </div>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {currentStep === 1 ? (
          /* STEP 1: BASICS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols): Title, Description, Options, Courses */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title Input Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Bundle Title <span className="text-purple-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Course Bundle Title..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none shadow-2xs"
                  />
                  {title && (
                    <button
                      type="button"
                      onClick={() => handleTitleChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  )}
                </div>

                {/* Bundle URL Permlink */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <span>Bundle URL:</span>
                  {isEditingSlug ? (
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      onBlur={() => setIsEditingSlug(false)}
                      autoFocus
                      className="rounded border border-purple-300 px-1.5 py-0.5 text-xs text-[#7D52F4] focus:outline-none"
                    />
                  ) : (
                    <span className="font-mono text-gray-600">
                      https://skilliant.io/course-bundle/{slug}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    className="text-gray-400 hover:text-[#7D52F4]"
                    title="Edit slug"
                  >
                    <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description Card with Visual/Code tabs and Toolbar */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Bundle Description</label>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setDescTab("visual")}
                      className={"rounded-lg px-2.5 py-1 font-semibold transition-colors " + (
                        descTab === "visual" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Visual
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab("code")}
                      className={"rounded-lg px-2.5 py-1 font-semibold transition-colors " + (
                        descTab === "code" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Code
                    </button>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-y border-gray-100 py-2 text-gray-600">
                  <button type="button" className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    + Add media
                  </button>
                  <span className="text-gray-300 mx-1">|</span>
                  <select className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                    <option>Heading 3</option>
                  </select>
                  <button type="button" className="rounded p-1 font-bold text-xs hover:bg-gray-100">B</button>
                  <button type="button" className="rounded p-1 italic text-xs hover:bg-gray-100">I</button>
                  <button type="button" className="rounded p-1 underline text-xs hover:bg-gray-100">U</button>
                  <span className="text-gray-300 mx-1">|</span>
                  <button type="button" className="rounded p-1 text-xs hover:bg-gray-100" title="Bullet List">• List</button>
                  <button type="button" className="rounded p-1 text-xs hover:bg-gray-100" title="Numbered List">1. List</button>
                  <button type="button" className="rounded p-1 text-xs hover:bg-gray-100" title="Quote">“ Quote</button>
                  <span className="text-gray-300 mx-1">|</span>
                  <button type="button" className="rounded p-1 text-xs hover:bg-gray-100">Link</button>
                  <button type="button" className="rounded p-1 text-xs hover:bg-gray-100">Code</button>
                  <button type="button" className="rounded p-1 text-xs hover:bg-gray-100">Table</button>
                </div>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a comprehensive overview of what this multi-course bundle covers, student prerequisites, and the combined learning outcomes..."
                  className="w-full rounded-xl border border-gray-200 p-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                />
              </div>

              {/* Options Box with Left Navigation Tab (Enrollment) */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-3.5 bg-gray-50/50">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Bundle Options</h3>
                </div>

                <div className="grid grid-cols-12 min-h-[220px]">
                  {/* Options Sidebar (4 cols) */}
                  <div className="col-span-12 sm:col-span-4 border-r border-gray-100 bg-gray-50/30 p-2">
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-[#7D52F4] border-l-4 border-[#7D52F4] shadow-2xs text-left"
                    >
                      <svg className="size-4 text-[#7D52F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Enrollment</span>
                    </button>
                  </div>

                  {/* Options Content Area (8 cols) */}
                  <div className="col-span-12 sm:col-span-8 p-6 space-y-5">
                    {/* Maximum Student */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-semibold text-gray-700">Maximum Student</label>
                        <span className="text-gray-400 text-xs" title="0 for unlimited students">ⓘ</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={maxStudents}
                        onChange={(e) => setMaxStudents(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-[#7D52F4] focus:outline-none"
                      />
                    </div>

                    {/* Bundle Enrollment Period Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-800">Bundle Enrollment Period</span>
                      <button
                        type="button"
                        onClick={() => setHasEnrollmentPeriod(!hasEnrollmentPeriod)}
                        className={"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none " + (
                          hasEnrollmentPeriod ? "bg-[#7D52F4]" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={"pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out " + (
                            hasEnrollmentPeriod ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    {/* Pause Enrollment Checkbox */}
                    <div className="pt-2 border-t border-gray-100">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pauseEnrollment}
                          onChange={(e) => setPauseEnrollment(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                        />
                        <div>
                          <span className="text-sm font-semibold text-gray-900 block">Pause Enrollment</span>
                          <span className="text-xs text-gray-500 block mt-0.5">
                            If you pause enrolment, students will no longer be able to enroll in the bundle.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses Container (Empty state vs Selected state matching media_1789546902025.png & media_1789547285827.png) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bundle Courses <span className="text-purple-600">*</span></label>

                {selectedCourseIds.length === 0 ? (
                  /* Empty State Card */
                  <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gray-50 text-gray-300 mb-4">
                      <svg className="size-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h4 className="text-base font-bold text-gray-900">No Courses Added Yet</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Select multiple courses from your catalog to package into this high-value specialization.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenCoursesModal}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-200 px-5 py-2.5 text-sm font-bold text-[#7D52F4] hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
                    >
                      <PlusIcon className="size-4" />
                      <span>Add Courses</span>
                    </button>
                  </div>
                ) : (
                  /* Selected Courses State Card */
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
                    {/* Header: X Courses selected + Add Courses button */}
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                      <h4 className="text-base font-bold text-gray-900">
                        {selectedCourseIds.length} Courses selected
                      </h4>
                      <button
                        type="button"
                        onClick={handleOpenCoursesModal}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-4 py-2 text-xs font-semibold text-[#7D52F4] hover:bg-purple-50 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
                      >
                        <PlusIcon className="size-3.5" />
                        <span>Add Courses</span>
                      </button>
                    </div>

                    {/* Numbered Selected Course Rows */}
                    <div className="divide-y divide-gray-100">
                      {selectedCoursesObjects.map((course, idx) => (
                        <div key={course.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-400 w-4 text-center">
                              {idx + 1}
                            </span>
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                              <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                            </div>
                            <span className="text-sm font-bold text-gray-900 line-clamp-1">
                              {course.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-sm font-bold text-gray-900">{course.price}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedCourse(course.id)}
                              className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                              title="Remove from bundle"
                            >
                              <CloseIcon className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selection Overview Section matching media_1789547285827.png */}
                    <div className="border-t border-gray-100 bg-gray-50/40 p-5 space-y-3">
                      <h5 className="text-sm font-bold text-gray-900">Selection Overview</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2.5">
                          <span className="text-gray-400">🕒</span>
                          <span><strong>{totalDurationFormatted}</strong> Total Duration</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-gray-400">❓</span>
                          <span><strong>{totalQuizPapers}</strong> Quiz Papers</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-gray-400">🎥</span>
                          <span><strong>{totalLessonContent}</strong> Lesson Content</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-gray-400">☁️</span>
                          <span><strong>{totalDownloadableResources}</strong> Downloadable Resources</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Button: Next > */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-800 shadow-2xs hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Next</span>
                    <span>&gt;</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Visibility, Featured Image, Pricing, Categories */}
            <div className="lg:col-span-4 space-y-6">
              {/* Visibility Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Visibility</label>
                <div className="relative">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-gray-800 focus:border-[#7D52F4] focus:outline-none"
                  >
                    <option value="Public">Public</option>
                    <option value="Password Protected">Password Protected</option>
                    <option value="Private">Private</option>
                  </select>
                  <EyeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                </div>

                <p className="text-xs text-gray-400">Last updated on 16th September, 2026</p>

                {/* Schedule Toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-800">Schedule</span>
                  <button
                    type="button"
                    onClick={() => setIsScheduleEnabled(!isScheduleEnabled)}
                    className={"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none " + (
                      isScheduleEnabled ? "bg-[#7D52F4]" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={"pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out " + (
                        isScheduleEnabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Featured Image Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Featured Image</label>
                <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-purple-400 transition-colors">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 mb-2">
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="inline-flex rounded-lg bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-[#7D52F4] hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                  >
                    Upload Thumbnail
                  </button>
                  <p className="text-[11px] text-gray-400 mt-2">JPEG, PNG, GIF, and WebP formats, up to 300 MB</p>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Regular Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                      <input
                        type="number"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 py-2 pl-7 pr-3 text-sm text-gray-900 focus:border-[#7D52F4] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Sale Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                      <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 py-2 pl-7 pr-3 text-sm text-gray-900 focus:border-[#7D52F4] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Ribbon to Display</label>
                  <select
                    value={ribbonDisplay}
                    onChange={(e) => setRibbonDisplay(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm text-gray-800 focus:border-[#7D52F4] focus:outline-none"
                  >
                    <option>Show Discount % Off</option>
                    <option>Featured Specialization</option>
                    <option>Hot Deal</option>
                    <option>None</option>
                  </select>
                </div>
              </div>

              {/* Categories Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Categories</label>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {[
                    "AI + Data",
                    "Cloud + IT Ops",
                    "Communication Skills",
                    "Data & AI",
                    "Development",
                    "HR & Workplace Culture",
                    "Leadership & Management",
                  ].map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: ADDITIONAL (media_1789547002928.png) */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header: [←] Additional */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                title="Back to Basics"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-gray-900">Additional</h2>
            </div>

            {/* What Will I Learn? Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">What Will I Learn?</label>
              <textarea
                rows={5}
                value={whatWillILearn}
                onChange={(e) => setWhatWillILearn(e.target.value)}
                placeholder="Define the key takeaways from this course (list one benefit per line)"
                className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
              />
            </div>

            {/* Certificate Selection Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Certificate Template</h3>
              </div>

              {/* Tabs: Templates / Custom Certificates */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-6 text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => setCertTab("templates")}
                    className={"pb-2 transition-colors relative " + (
                      certTab === "templates" ? "text-[#7D52F4] border-b-2 border-[#7D52F4]" : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    Templates
                  </button>
                  <button
                    type="button"
                    onClick={() => setCertTab("custom")}
                    className={"pb-2 transition-colors relative " + (
                      certTab === "custom" ? "text-[#7D52F4] border-b-2 border-[#7D52F4]" : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    Custom Certificates
                  </button>
                </div>
              </div>

              {/* Certificate Templates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {certificateTemplatesList.map((tpl) => {
                  const isSelected = selectedCertTemplateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedCertTemplateId(tpl.id)}
                      className={"relative flex flex-col items-center justify-center rounded-2xl border-2 p-5 text-center transition-all aspect-4/3 overflow-hidden shadow-2xs " + (
                        isSelected
                          ? "border-[#7D52F4] bg-purple-50/40 ring-2 ring-purple-500/20"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      {/* Checkmark indicator badge on top right */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-[#7D52F4] text-white text-xs font-bold shadow-xs">
                          ✓
                        </div>
                      )}

                      {tpl.isNone ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex size-12 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 mb-2">
                            <span className="text-xl">⊘</span>
                          </div>
                          <span className="text-sm font-bold text-gray-700">None</span>
                        </div>
                      ) : (
                        <div className={"w-full h-full rounded-xl border " + tpl.borderColor + " bg-gradient-to-br " + tpl.bgGradient + " p-3 flex flex-col justify-between"}>
                          <div className="flex items-center justify-between">
                            <span className={"text-[10px] font-black uppercase tracking-widest " + tpl.badgeAccent}>CERTIFICATE</span>
                            <span className="text-xs">🏆</span>
                          </div>
                          <div className="text-center py-1">
                            <span className="text-[11px] font-serif font-bold text-gray-800 block">John Doe</span>
                            <div className="h-0.5 w-12 bg-gray-300 mx-auto mt-0.5" />
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-gray-400">
                            <span>{tpl.name}</span>
                            <span className="font-mono">VERIFIED</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Provide certificates for individual courses checkbox */}
              <div className="pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provideIndividualCerts}
                    onChange={(e) => setProvideIndividualCerts(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    Provide certificates for individual courses.
                  </span>
                </label>
              </div>

              {/* Bottom Back & Complete Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-gray-800 shadow-2xs hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>&lt;</span>
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublishBundle}
                  className="rounded-xl bg-[#7D52F4] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  Publish Bundle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SELECT COURSES MODAL (media_1789546918379.png) */}
      {isCoursesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-base font-bold text-gray-900">Select Courses</h3>
              <button
                type="button"
                onClick={() => setIsCoursesModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                />
              </div>

              {/* Courses Table */}
              <div className="max-h-80 overflow-y-auto rounded-xl border border-gray-100 [scrollbar-width:thin]">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={modalSelectedIds.length === filteredModalCourses.length && filteredModalCourses.length > 0}
                          onChange={() => {
                            if (modalSelectedIds.length === filteredModalCourses.length) {
                              setModalSelectedIds([]);
                            } else {
                              setModalSelectedIds(filteredModalCourses.map((c) => c.id));
                            }
                          }}
                          className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredModalCourses.map((course) => {
                      const isChecked = modalSelectedIds.includes(course.id);
                      return (
                        <tr
                          key={course.id}
                          onClick={() => handleToggleModalCourse(course.id)}
                          className={"cursor-pointer hover:bg-purple-50/30 transition-colors " + (
                            isChecked ? "bg-purple-50/50" : ""
                          )}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                                <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                              </div>
                              <span className="font-semibold text-gray-900 line-clamp-1">{course.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <span className="font-semibold text-gray-900">{course.price}</span>
                            {course.originalPrice && (
                              <span className="ml-1.5 text-xs text-gray-400 line-through">
                                {course.originalPrice}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls matching media_1789546918379.png */}
              <div className="flex items-center justify-end gap-3 text-xs text-gray-600">
                <span>Page</span>
                <input
                  type="text"
                  value={modalPage}
                  readOnly
                  className="size-7 rounded border border-gray-200 text-center font-bold text-gray-800"
                />
                <span>of 3</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={modalPage <= 1}
                    onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                    className="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    disabled={modalPage >= 3}
                    onClick={() => setModalPage((p) => Math.min(3, p + 1))}
                    className="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setIsCoursesModalOpen(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplySelectedCourses}
                className="rounded-xl bg-[#7D52F4] px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                Add {modalSelectedIds.length > 0 ? `(${modalSelectedIds.length})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
