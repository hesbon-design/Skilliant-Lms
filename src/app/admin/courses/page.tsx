"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusIcon,
  FilterIcon,
  SortIcon,
  SearchIcon,
  MoreVerticalIcon,
  BundleIcon,
  CloseIcon,
  GraduationCapIcon,
} from "../adminIcons";

import catalogCoursesJson from "@/data/catalogCourses.json";

export type CatalogStatus = "Publish" | "Pending" | "Trash" | "Draft" | "Private";

export interface CatalogItem {
  id: string;
  slug: string;
  type: "course" | "bundle";
  title: string;
  thumbnail: string;
  bundleCoursesCount?: number;
  topics?: number;
  lessons?: number;
  quizzes?: number;
  assignments?: number;
  downloadableResources?: number;
  durationMinutes?: number;
  durationFormatted?: string;
  category: string;
  price: string;
  originalPrice?: string;
  author: string;
  authorInitial: string;
  date: string;
  status: CatalogStatus;
}

const initialCatalogItems: CatalogItem[] = catalogCoursesJson as CatalogItem[];

export default function AdminCoursesPage() {
  const [items, setItems] = useState<CatalogItem[]>(initialCatalogItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeStatusId, setActiveStatusId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<"default" | "title-asc" | "title-desc" | "date-asc" | "date-desc">("default");

  // Floating Popover Filter states (Applied)
  const [appliedType, setAppliedType] = useState<"all" | "course" | "bundle">("all");
  const [appliedStatus, setAppliedStatus] = useState<string>("all");
  const [appliedCategory, setAppliedCategory] = useState<string>("all");
  const [appliedDate, setAppliedDate] = useState<string>("");

  // Temporary filter states (while popover is open)
  const [tempType, setTempType] = useState<"all" | "course" | "bundle">("all");
  const [tempStatus, setTempStatus] = useState<string>("all");
  const [tempCategory, setTempCategory] = useState<string>("all");
  const [tempDate, setTempDate] = useState<string>("");

  // Popover controls
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"type" | "status" | "category" | null>(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close dropdowns/popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
        setOpenDropdown(null);
      }
      if (activeMenuId && !(event.target as Element).closest(".action-menu-container")) {
        setActiveMenuId(null);
      }
      if (activeStatusId && !(event.target as Element).closest(".status-menu-container")) {
        setActiveStatusId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId, activeStatusId]);

  // Sync temporary state whenever popover is opened
  const handleOpenFilters = () => {
    if (!isFilterOpen) {
      setTempType(appliedType);
      setTempStatus(appliedStatus);
      setTempCategory(appliedCategory);
      setTempDate(appliedDate);
      setCategorySearchQuery("");
      setOpenDropdown(null);
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilters = () => {
    setAppliedType(tempType);
    setAppliedStatus(tempStatus);
    setAppliedCategory(tempCategory);
    setAppliedDate(tempDate);
    setCurrentPage(1);
    setIsFilterOpen(false);
    setOpenDropdown(null);
  };

  const handleResetFilters = () => {
    setTempType("all");
    setTempStatus("all");
    setTempCategory("all");
    setTempDate("");
    setAppliedType("all");
    setAppliedStatus("all");
    setAppliedCategory("all");
    setAppliedDate("");
    setCurrentPage(1);
    setIsFilterOpen(false);
    setOpenDropdown(null);
  };

  // Live item counts computed from current dataset
  const allCount = items.length;
  const mineCount = items.filter((i) => i.author === "admin").length;
  const publishCount = items.filter((i) => i.status === "Publish").length;
  const draftCount = items.filter((i) => i.status === "Draft").length;
  const pendingCount = items.filter((i) => i.status === "Pending").length;
  const scheduledCount = 0;
  const privateCount = items.filter((i) => i.status === "Private").length;
  const trashCount = items.filter((i) => i.status === "Trash").length;

  const statusOptions = [
    { key: "all", label: `All (${allCount})` },
    { key: "mine", label: `Mine (${mineCount})` },
    { key: "Published", label: `Published (${publishCount})` },
    { key: "Draft", label: `Draft (${draftCount})` },
    { key: "Pending", label: `Pending (${pendingCount})` },
    { key: "Scheduled", label: `Scheduled (${scheduledCount})` },
    { key: "Private", label: `Private (${privateCount})` },
    { key: "Trash", label: `Trash (${trashCount})` },
  ];

  // Distinct categories
  const allCategories = Array.from(
    new Set(items.map((i) => i.category).filter(Boolean))
  );

  const filteredCategories = allCategories.filter((cat) =>
    cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Filter and sort items
  const filteredItems = items.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Type filter
    if (appliedType === "course" && item.type !== "course") return false;
    if (appliedType === "bundle" && item.type !== "bundle") return false;

    // Status filter
    if (appliedStatus === "mine") {
      if (item.author !== "admin") return false;
    } else if (appliedStatus === "Published") {
      if (item.status !== "Publish") return false;
    } else if (appliedStatus === "Draft") {
      if (item.status !== "Draft") return false;
    } else if (appliedStatus === "Pending") {
      if (item.status !== "Pending") return false;
    } else if (appliedStatus === "Scheduled") {
      return false;
    } else if (appliedStatus === "Private") {
      if (item.status !== "Private") return false;
    } else if (appliedStatus === "Trash") {
      if (item.status !== "Trash") return false;
    }

    // Category filter
    if (appliedCategory !== "all" && item.category !== appliedCategory) {
      return false;
    }

    // Date filter
    if (appliedDate) {
      const itemDate = new Date(item.date);
      if (!isNaN(itemDate.getTime())) {
        const itemDateStr = itemDate.toISOString().slice(0, 10);
        if (itemDateStr !== appliedDate) return false;
      }
    }

    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortMode === "title-asc") return a.title.localeCompare(b.title);
    if (sortMode === "title-desc") return b.title.localeCompare(a.title);
    if (sortMode === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortMode === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0; // Default JSON order
  });

  // Pagination calculation
  const totalFilteredItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length && paginatedItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((c) => c.id));
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
      setItems(items.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Publish" } : c)));
    } else if (bulkAction === "draft") {
      setItems(items.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Draft" } : c)));
    } else if (bulkAction === "trash") {
      setItems(items.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Trash" } : c)));
    } else if (bulkAction === "delete") {
      setItems(items.filter((c) => !selectedIds.includes(c.id)));
    }
    setSelectedIds([]);
    setBulkAction("");
  };

  const handleUpdateStatus = (id: string, newStatus: CatalogStatus) => {
    setItems(items.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    setActiveStatusId(null);
  };

  const handleDuplicate = (item: CatalogItem) => {
    const newItem: CatalogItem = {
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      slug: `${item.slug}-copy`,
      title: `${item.title} (Copy)`,
      status: "Draft",
      date:
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
        " " +
        new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase(),
    };
    const index = items.findIndex((i) => i.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, newItem);
    setItems(updated);
    setActiveMenuId(null);
  };

  const hasActiveFilters =
    appliedType !== "all" ||
    appliedStatus !== "all" ||
    appliedCategory !== "all" ||
    appliedDate !== "";

  const renderStatusBadge = (item: CatalogItem) => {
    const isDropdownOpen = activeStatusId === item.id;

    const getBadgeStyle = (status: CatalogStatus) => {
      switch (status) {
        case "Publish":
          return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
        case "Draft":
          return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
        case "Pending":
          return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
        case "Trash":
          return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
        case "Private":
          return "bg-purple-50 text-[#7D52F4] border-purple-200 hover:bg-purple-100";
      }
    };

    const getStatusIcon = (status: CatalogStatus) => {
      switch (status) {
        case "Publish":
          return (
            <svg className="size-3 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          );
        case "Draft":
          return (
            <svg className="size-3 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          );
        case "Pending":
          return <span className="text-amber-500 text-xs shrink-0">⏳</span>;
        case "Trash":
          return <span className="text-rose-500 text-xs shrink-0">🗑️</span>;
        case "Private":
          return <span className="text-[#7D52F4] text-xs shrink-0">🔒</span>;
      }
    };

    return (
      <div className="relative inline-block text-left status-menu-container">
        <button
          type="button"
          onClick={() => {
            setActiveStatusId(isDropdownOpen ? null : item.id);
            setActiveMenuId(null);
          }}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs transition-all whitespace-nowrap shrink-0 ${getBadgeStyle(item.status)}`}
        >
          {getStatusIcon(item.status)}
          <span className="whitespace-nowrap">{item.status}</span>
          <svg className="size-3 shrink-0 text-current opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-32 rounded-xl border border-gray-100 bg-white py-1 shadow-lg z-30 animate-in fade-in zoom-in-95 duration-150">
            {(["Publish", "Pending", "Trash", "Draft", "Private"] as CatalogStatus[]).map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => handleUpdateStatus(item.id, statusOption)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left font-medium transition-colors whitespace-nowrap shrink-0 ${
                  item.status === statusOption
                    ? "bg-[#7D52F4] text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="whitespace-nowrap">{statusOption}</span>
                {item.status === statusOption && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with New Bundle & New Course */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Courses</h1>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/bundles/new"
            className="flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-[#7D52F4] hover:bg-purple-50 shadow-2xs transition-colors whitespace-nowrap shrink-0"
          >
            <BundleIcon className="size-4 shrink-0 text-[#7D52F4]" />
            <span className="whitespace-nowrap">New Bundle</span>
          </Link>

          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 rounded-xl bg-[#7D52F4] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <PlusIcon className="size-4 shrink-0" />
            <span className="whitespace-nowrap">New Course</span>
          </Link>
        </div>
      </div>

      {/* Controls Bar with Bulk Action & Filters/Search */}
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
            <option value="trash">Move to Trash</option>
            <option value="delete">Delete Selected</option>
          </select>
          <button
            type="button"
            onClick={handleBulkApply}
            className="rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-2 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Apply</span>
          </button>
        </div>

        {/* Filter, Sort & Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filters Button & Floating Popover */}
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={handleOpenFilters}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                isFilterOpen || hasActiveFilters
                  ? "border-[#7D52F4] bg-purple-50 text-[#7D52F4] shadow-2xs"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FilterIcon className="size-3.5 text-current shrink-0" />
              <span className="whitespace-nowrap">Filters</span>
              {hasActiveFilters && (
                <span className="size-2 rounded-full bg-[#7D52F4]" />
              )}
            </button>

            {/* FLOATING FILTERS POPOVER matching screenshots */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5 text-left">
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>

                {/* Dropdown 1: Type (Courses & Bundles) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 hover:border-gray-300 focus:border-purple-500 transition-colors"
                  >
                    <span>
                      {tempType === "all"
                        ? "Courses & Bundles"
                        : tempType === "course"
                        ? "Courses"
                        : "Bundles"}
                    </span>
                    <svg
                      className={`size-3.5 text-gray-400 transition-transform ${openDropdown === "type" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openDropdown === "type" && (
                    <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-60 animate-in fade-in duration-100">
                      {([
                        { key: "all", label: "Courses & Bundles" },
                        { key: "course", label: "Courses" },
                        { key: "bundle", label: "Bundles" },
                      ] as const).map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setTempType(opt.key);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                            tempType === opt.key
                              ? "bg-gray-100 font-semibold text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown 2: Status with Live Item Counts */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 hover:border-gray-300 focus:border-purple-500 transition-colors"
                  >
                    <span>
                      {statusOptions.find((o) => o.key === tempStatus)?.label || `All (${allCount})`}
                    </span>
                    <svg
                      className={`size-3.5 text-gray-400 transition-transform ${openDropdown === "status" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openDropdown === "status" && (
                    <div className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-60 [scrollbar-width:thin] animate-in fade-in duration-100">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setTempStatus(opt.key);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                            tempStatus === opt.key
                              ? "bg-gray-100 font-semibold text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown 3: Searchable Category Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 hover:border-gray-300 focus:border-purple-500 transition-colors"
                  >
                    <span className="truncate">
                      {tempCategory === "all" ? "All Categories" : tempCategory}
                    </span>
                    <svg
                      className={`size-3.5 text-gray-400 shrink-0 transition-transform ${openDropdown === "category" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openDropdown === "category" && (
                    <div className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl z-60 animate-in fade-in duration-100 flex flex-col">
                      {/* Search box inside dropdown matching media_1789550956548.png */}
                      <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                          <SearchIcon className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search ..."
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-7 pr-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Options list */}
                      <div className="overflow-y-auto max-h-44 py-1 [scrollbar-width:thin]">
                        <button
                          type="button"
                          onClick={() => {
                            setTempCategory("all");
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                            tempCategory === "all"
                              ? "bg-gray-100 font-semibold text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          All Categories
                        </button>
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setTempCategory(cat);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                              tempCategory === cat
                                ? "bg-gray-100 font-semibold text-gray-900"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                        {filteredCategories.length === 0 && (
                          <div className="px-3.5 py-2 text-xs text-gray-400 italic">
                            No categories found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 4: Publish Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    placeholder="yyyy-MM-dd"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Action Footer: Reset + Apply Filters */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-gray-500 hover:text-[#7D52F4] transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="rounded-xl border border-purple-300 bg-purple-50/70 px-4 py-2 text-xs font-semibold text-[#7D52F4] hover:bg-[#7D52F4] hover:text-white transition-all shadow-2xs whitespace-nowrap"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sort Button */}
          <button
            type="button"
            onClick={() =>
              setSortMode(
                sortMode === "default"
                  ? "title-asc"
                  : sortMode === "title-asc"
                  ? "title-desc"
                  : "default"
              )
            }
            className={`flex items-center justify-center rounded-xl border p-2 text-gray-700 hover:bg-gray-50 transition-colors shrink-0 ${
              sortMode !== "default"
                ? "border-[#7D52F4] bg-purple-50 text-[#7D52F4]"
                : "border-gray-200 bg-white"
            }`}
            title={`Current sort: ${sortMode}`}
          >
            <SortIcon className="size-3.5 text-current" />
          </button>

          {/* Search Input */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar (when filters are applied) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-gray-500">Active filters:</span>
          {appliedType !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 font-semibold text-[#7D52F4] border border-purple-200">
              Type: {appliedType === "course" ? "Courses" : "Bundles"}
              <button
                type="button"
                onClick={() => setAppliedType("all")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          {appliedStatus !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 font-semibold text-[#7D52F4] border border-purple-200">
              Status: {appliedStatus}
              <button
                type="button"
                onClick={() => setAppliedStatus("all")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          {appliedCategory !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 font-semibold text-[#7D52F4] border border-purple-200">
              Category: {appliedCategory}
              <button
                type="button"
                onClick={() => setAppliedCategory("all")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          {appliedDate !== "" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 font-semibold text-[#7D52F4] border border-purple-200">
              Date: {appliedDate}
              <button
                type="button"
                onClick={() => setAppliedDate("")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-medium text-gray-500 hover:text-[#7D52F4] underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Courses & Bundles Table matching media_1789550830347.png */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-600 min-w-[960px]">
            <thead className="border-b border-gray-100 bg-gray-50/60 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="w-12 px-4 py-3.5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() =>
                    setSortMode(sortMode === "title-asc" ? "title-desc" : "title-asc")
                  }
                  className="px-4 py-3.5 whitespace-nowrap cursor-pointer hover:text-gray-800 transition-colors select-none"
                >
                  Title ⇅
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">Categories</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Price</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Author</th>
                <th
                  onClick={() =>
                    setSortMode(sortMode === "date-asc" ? "date-desc" : "date-asc")
                  }
                  className="px-4 py-3.5 whitespace-nowrap cursor-pointer hover:text-gray-800 transition-colors select-none"
                >
                  Date ⇅
                </th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isActionMenuOpen = activeMenuId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-purple-50/20 transition-colors ${
                      isSelected ? "bg-purple-50/40" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>

                    {/* Title + Thumbnail + Counts */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        {/* Thumbnail */}
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                          {item.thumbnail ? (
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-[#F1F3F5] text-gray-400">
                              <GraduationCapIcon className="size-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Title details */}
                        <div>
                          <Link
                            href={item.type === "bundle" ? "/admin/bundles/new" : `/admin/courses/${item.id}/edit`}
                            className="font-bold text-gray-900 hover:text-[#7D52F4] transition-colors line-clamp-1 text-sm whitespace-nowrap"
                          >
                            {item.title}
                          </Link>

                          {item.type === "bundle" ? (
                            <div className="mt-1 text-xs font-semibold text-[#7D52F4] whitespace-nowrap">
                              {item.bundleCoursesCount || 2} Courses
                            </div>
                          ) : (
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                              <span>Topic: <strong className="text-gray-700">{item.topics}</strong></span>
                              <span className="text-gray-300">|</span>
                              <span>Lesson: <strong className="text-gray-700">{item.lessons}</strong></span>
                              <span className="text-gray-300">|</span>
                              <span>Quiz: <strong className="text-gray-700">{item.quizzes}</strong></span>
                              <span className="text-gray-300">|</span>
                              <span>Assignment: <strong className="text-gray-700">{item.assignments}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">
                      {item.category}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="flex size-7 items-center justify-center rounded-full bg-[#7D52F4] text-xs font-bold text-white shrink-0">
                          {item.authorInitial}
                        </div>
                        <span className="font-medium text-gray-700">{item.author}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {item.date}
                    </td>

                    {/* Actions: Status Dropdown, View Button, Three-dots menu */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5 whitespace-nowrap">
                        {/* Status Dropdown */}
                        {renderStatusBadge(item)}

                        {/* View Button */}
                        <Link
                          href={item.type === "bundle" ? "/courses" : `/courses/${item.slug}`}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">View</span>
                        </Link>

                        {/* Three-dot options menu */}
                        <div className="relative shrink-0 action-menu-container">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(isActionMenuOpen ? null : item.id);
                              setActiveStatusId(null);
                            }}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0"
                          >
                            <MoreVerticalIcon className="size-4" />
                          </button>

                          {isActionMenuOpen && (
                            <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-[#1E2024] p-1.5 shadow-2xl z-30 text-left border border-gray-800 animate-in fade-in zoom-in-95 duration-150">
                              <Link
                                href={item.type === "bundle" ? "/admin/bundles/new" : `/admin/courses/${item.id}/edit`}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                                onClick={() => setActiveMenuId(null)}
                              >
                                <svg className="size-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleDuplicate(item)}
                                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                              >
                                <svg className="size-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Duplicate</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <p className="text-sm font-medium">No courses or bundles match the selected filters.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-2 text-xs font-semibold text-[#7D52F4] hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE PAGINATION FOOTER matching screenshots */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3.5 border-t border-gray-100 bg-white">
          {/* Left: Per page selector & range count */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-gray-50/60 px-2 py-1 text-xs font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span className="text-gray-300">|</span>
            <span>
              Showing{" "}
              <strong className="font-semibold text-gray-800">
                {totalFilteredItems === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-gray-800">
                {Math.min(endIndex, totalFilteredItems)}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold text-gray-800">{totalFilteredItems}</strong>{" "}
              entries
            </span>
          </div>

          {/* Right: Page Navigation Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>‹ Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`size-7 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                    safeCurrentPage === page
                      ? "bg-[#7D52F4] text-white shadow-2xs"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next ›</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
