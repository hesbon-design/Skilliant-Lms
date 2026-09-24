"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface CatalogItem {
  id: string;
  type: "course" | "bundle";
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  category: string;
}

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "c-1",
    type: "course",
    title: "The Complete Web Development Bootcamp",
    price: 199,
    originalPrice: 259,
    thumbnail: "/images/courses/school-the-complete-web-development-bootcamp-thumbnail.webp",
    category: "Development",
  },
  {
    id: "c-2",
    type: "course",
    title: "Python for Data Science",
    price: 59,
    originalPrice: 99,
    thumbnail: "/images/courses/python-for-data-science-thumbnail.webp",
    category: "Data & AI",
  },
  {
    id: "c-3",
    type: "course",
    title: "Data Privacy & Compliance for Professionals",
    price: 35,
    thumbnail: "/images/courses/Security_-Data-Privacy-Compliance-for-Professionals.webp",
    category: "Business & Operations",
  },
  {
    id: "c-4",
    type: "course",
    title: "Employee Engagement & Retention Strategies",
    price: 49,
    originalPrice: 59,
    thumbnail: "/images/courses/HR-and-Workplace_-Employee-Engagement-Retention-Strategies.webp",
    category: "Business & Operations",
  },
  {
    id: "c-5",
    type: "course",
    title: "IT Operations & DevOps Essentials",
    price: 30,
    originalPrice: 45,
    thumbnail: "/images/courses/Cloud-It-Ops_-IT-Operations-DevOps-Essentials.webp",
    category: "Development",
  },
  {
    id: "c-6",
    type: "course",
    title: "Diversity, Equity & Inclusion (DEI) in the Workplace",
    price: 49,
    originalPrice: 59,
    thumbnail: "/images/courses/HR-and-Workplace_-Diversity-Equity-Inclusion-DEI-in-the-Workplace.webp",
    category: "Business & Operations",
  },
  {
    id: "c-7",
    type: "course",
    title: "Forklift Safety & Zero-Fault Inspection",
    price: 89,
    originalPrice: 120,
    thumbnail: "/images/courses/web-development-bootcamp-thumbnail.webp",
    category: "Heavy Machinery & Safety",
  },
  {
    id: "c-8",
    type: "course",
    title: "Commercial Fleet Defensive Driving",
    price: 150,
    originalPrice: 180,
    thumbnail: "/images/courses/web-development-bootcamp-thumbnail.webp",
    category: "Heavy Machinery & Safety",
  },
  {
    id: "b-1",
    type: "bundle",
    title: "Industrial Machine Operator Track",
    price: 450,
    originalPrice: 650,
    thumbnail: "/images/courses/web-development-bootcamp-thumbnail.webp",
    category: "Heavy Machinery & Safety",
  },
  {
    id: "b-2",
    type: "bundle",
    title: "Full-Stack Software Engineering Specialization",
    price: 480,
    originalPrice: 720,
    thumbnail: "/images/courses/web-development-bootcamp-thumbnail.webp",
    category: "Development",
  },
  {
    id: "b-3",
    type: "bundle",
    title: "Commercial Fleet Professional Driving Track",
    price: 520,
    originalPrice: 750,
    thumbnail: "/images/courses/web-development-bootcamp-thumbnail.webp",
    category: "Heavy Machinery & Safety",
  },
];

export const CATEGORIES_LIST = [
  "Development",
  "Data & AI",
  "Heavy Machinery & Safety",
  "Business & Operations",
  "Design & UX",
];

export default function CreateCouponPage() {
  const router = useRouter();

  // Form State
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [method, setMethod] = useState<"code" | "automatic">("code");
  const [title, setTitle] = useState("Summer sale 2026");
  const [code, setCode] = useState("J47KTXWY");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed" | "free">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(30);
  
  // Applies To State
  const [appliesTo, setAppliesTo] = useState<
    "all_courses" | "all_bundles" | "all_courses_and_bundles" | "specific_courses" | "specific_bundles" | "specific_category"
  >("all_bundles");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(["b-1"]);
  const [selectedCategory, setSelectedCategory] = useState("Development");

  // Item Picker Modal State
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerPage, setPickerPage] = useState(1);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  // Usage Limitations
  const [limitTotalUsage, setLimitTotalUsage] = useState(false);
  const [totalUsageLimit, setTotalUsageLimit] = useState<number>(500);
  const [limitCustomerUsage, setLimitCustomerUsage] = useState(false);
  const [customerUsageLimit, setCustomerUsageLimit] = useState<number>(1);

  // Minimum Requirements
  const [minRequirement, setMinRequirement] = useState<"none" | "amount" | "quantity">("none");
  const [minAmount, setMinAmount] = useState<number>(100);
  const [minQuantity, setMinQuantity] = useState<number>(2);

  // Validity
  const [startDate, setStartDate] = useState("2026-09-17");
  const [startTime, setStartTime] = useState("00:00");
  const [hasEndDate, setHasEndDate] = useState(true);
  const [endDate, setEndDate] = useState("2026-09-17");
  const [endTime, setEndTime] = useState("23:59");

  // UI state
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Generate random code helper
  const handleGenerateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open item picker modal
  const handleOpenItemPicker = () => {
    setTempSelectedIds([...selectedItemIds]);
    setPickerSearch("");
    setPickerPage(1);
    setIsItemPickerOpen(true);
  };

  const handleSavePickedItems = () => {
    setSelectedItemIds([...tempSelectedIds]);
    setIsItemPickerOpen(false);
  };

  const handleRemoveSelectedItem = (id: string) => {
    setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/admin/coupons");
      }, 900);
    }, 500);
  };

  // Catalog items filtered for the modal
  const availableItemsForType = useMemo(() => {
    const targetType = appliesTo === "specific_bundles" ? "bundle" : "course";
    return CATALOG_ITEMS.filter((item) => {
      const matchesType = item.type === targetType;
      const matchesSearch = item.title.toLowerCase().includes(pickerSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [appliesTo, pickerSearch]);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(availableItemsForType.length / itemsPerPage));
  const paginatedItems = availableItemsForType.slice((pickerPage - 1) * itemsPerPage, pickerPage * itemsPerPage);

  const selectedItemsData = useMemo(() => {
    return CATALOG_ITEMS.filter((item) => selectedItemIds.includes(item.id));
  }, [selectedItemIds]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar matching design */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/coupons"
            className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs shrink-0"
            title="Back to Coupons"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/coupons"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              Coupons
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl whitespace-nowrap">
              Create Coupon
            </h1>
          </div>

          {/* Status Toggle Pill */}
          <button
            type="button"
            onClick={() => setStatus((prev) => (prev === "active" ? "draft" : "active"))}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-all border shadow-2xs whitespace-nowrap shrink-0",
              status === "active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            )}
          >
            {status === "active" ? "● Active" : "○ Draft"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/coupons"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs whitespace-nowrap shrink-0"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-purple-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            {isSaving ? "Saving..." : savedSuccess ? "✓ Saved!" : "Save Coupon"}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 animate-in fade-in">
          ✓ Coupon &ldquo;{title}&rdquo; has been created successfully. Redirecting to coupons list...
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Form Cards (7 cols on lg, 8 cols on xl) */}
        <form onSubmit={handleSave} className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Card 1: Coupon Info */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Coupon Info</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Create a coupon code or set up automatic discounts applied at checkout.
              </p>
            </div>

            {/* Method Radio Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Method</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value="code"
                    checked={method === "code"}
                    onChange={() => setMethod("code")}
                    className="size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                  />
                  <span>Code</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value="automatic"
                    checked={method === "automatic"}
                    onChange={() => setMethod("automatic")}
                    className="size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                  />
                  <span>Automatic</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer sale 2026"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition-colors"
              />
            </div>

            {/* Coupon Code (Only if method === 'code') */}
            {method === "code" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors whitespace-nowrap shrink-0"
                  >
                    Generate Code
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. J47KTXWY"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 font-mono text-sm font-bold uppercase tracking-wider text-purple-700 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Discount */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Discount</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Discount Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="free">100% Free Tuition</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Discount Value
                </label>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600">
                  <span className="flex items-center justify-center bg-gray-50 px-3.5 text-sm font-semibold text-gray-500 border-r border-gray-200">
                    {discountType === "percentage" ? "%" : "$"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={discountType === "percentage" ? 100 : 10000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    disabled={discountType === "free"}
                    className="w-full bg-white px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Applies To matching design */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Applies to
                </label>
                <select
                  value={appliesTo}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setAppliesTo(val);
                    if (val === "specific_bundles") {
                      setSelectedItemIds(["b-1"]);
                    } else if (val === "specific_courses") {
                      setSelectedItemIds(["c-1"]);
                    }
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 cursor-pointer"
                >
                  <option value="all_courses">All courses</option>
                  <option value="all_bundles">All bundles</option>
                  <option value="all_courses_and_bundles">All courses and bundles</option>
                  <option value="specific_courses">Specific courses</option>
                  <option value="specific_bundles">Specific bundles</option>
                  <option value="specific_category">Specific category</option>
                </select>
              </div>

              {/* When Specific Courses or Specific Bundles is selected */}
              {(appliesTo === "specific_courses" || appliesTo === "specific_bundles") && (
                <div className="pt-1 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      Selected {appliesTo === "specific_bundles" ? "Bundles" : "Courses"} ({selectedItemIds.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenItemPicker}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                    >
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      <span className="whitespace-nowrap">+ Add items</span>
                    </button>
                  </div>

                  {/* Selected Items List */}
                  {selectedItemsData.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedItemsData.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-2.5 shadow-2xs hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0 overflow-hidden">
                              {item.type === "bundle" ? "📦" : "🎓"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">
                                {item.title}
                              </p>
                              <p className="text-2xs text-gray-500">
                                ${item.price}.00 {item.originalPrice && <span className="line-through text-gray-400 ml-1">${item.originalPrice}.00</span>}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedItem(item.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors shrink-0"
                            title="Remove item"
                          >
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
                      <p className="text-xs text-gray-500">No items selected yet.</p>
                      <button
                        type="button"
                        onClick={handleOpenItemPicker}
                        className="mt-1 text-xs font-bold text-purple-600 hover:underline whitespace-nowrap shrink-0"
                      >
                        Click here to select {appliesTo === "specific_bundles" ? "bundles" : "courses"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* When Specific Category is selected */}
              {appliesTo === "specific_category" && (
                <div className="pt-1 animate-in fade-in duration-150">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Select Target Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 cursor-pointer"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Usage Limitation */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Usage Limitation</h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={limitTotalUsage}
                  onChange={(e) => setLimitTotalUsage(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">
                    Limit number of times this coupon can be used in total
                  </span>
                  {limitTotalUsage && (
                    <div className="mt-2 animate-in fade-in duration-150 max-w-xs">
                      <input
                        type="number"
                        min={1}
                        value={totalUsageLimit}
                        onChange={(e) => setTotalUsageLimit(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm text-gray-900 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                        placeholder="e.g. 500"
                      />
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={limitCustomerUsage}
                  onChange={(e) => setLimitCustomerUsage(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">
                    Limit number of times this coupon can be used by a customer
                  </span>
                  {limitCustomerUsage && (
                    <div className="mt-2 animate-in fade-in duration-150 max-w-xs">
                      <input
                        type="number"
                        min={1}
                        value={customerUsageLimit}
                        onChange={(e) => setCustomerUsageLimit(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm text-gray-900 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                        placeholder="e.g. 1"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Card 4: Minimum Purchase Requirements */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-3">
            <h2 className="text-base font-bold text-gray-900">Minimum Purchase Requirements</h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="minRequirement"
                  value="none"
                  checked={minRequirement === "none"}
                  onChange={() => setMinRequirement("none")}
                  className="size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <span className="text-sm font-medium text-gray-800">No minimum requirements</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="minRequirement"
                  value="amount"
                  checked={minRequirement === "amount"}
                  onChange={() => setMinRequirement("amount")}
                  className="mt-1 size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">Minimum purchase amount ($)</span>
                  {minRequirement === "amount" && (
                    <div className="mt-2 animate-in fade-in duration-150 max-w-xs">
                      <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600">
                        <span className="flex items-center justify-center bg-gray-50 px-3 text-sm font-semibold text-gray-500 border-r border-gray-200">
                          $
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={minAmount}
                          onChange={(e) => setMinAmount(Number(e.target.value))}
                          className="w-full bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none"
                          placeholder="e.g. 100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="minRequirement"
                  value="quantity"
                  checked={minRequirement === "quantity"}
                  onChange={() => setMinRequirement("quantity")}
                  className="mt-1 size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">Minimum quantity of courses</span>
                  {minRequirement === "quantity" && (
                    <div className="mt-2 animate-in fade-in duration-150 max-w-xs">
                      <input
                        type="number"
                        min={1}
                        value={minQuantity}
                        onChange={(e) => setMinQuantity(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm text-gray-900 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                        placeholder="e.g. 2"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Card 5: Validity */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Validity</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Starts from
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEndDate}
                  onChange={(e) => setHasEndDate(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">Set end date</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Leaving the end date blank will make the coupon valid indefinitely.
                  </p>

                  {hasEndDate && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* Right Column: Live Interactive Ticket Preview (5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
          <div className="rounded-3xl border border-gray-100 bg-white shadow-xs p-6 relative overflow-hidden">
            {/* Semicircular Perforation Notches on edges */}
            <div className="absolute top-[168px] -left-3 size-6 rounded-full bg-[#F8FAFC] border-r border-gray-200" />
            <div className="absolute top-[168px] -right-3 size-6 rounded-full bg-[#F8FAFC] border-l border-gray-200" />

            {/* Top Ticket Header matching media_1789543103848.png */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {title || "Summer sale 2026"}
              </h3>
              <span className="text-base font-bold text-amber-600 whitespace-nowrap shrink-0">
                {discountType === "percentage"
                  ? `${Number(discountValue || 0).toFixed(2)}% OFF`
                  : discountType === "fixed"
                  ? `$${Number(discountValue || 0).toFixed(2)} OFF`
                  : "100% FREE"}
              </span>
            </div>

            {/* Prominent Code Display */}
            <div className="my-6 text-center">
              {method === "code" ? (
                <div className="group relative inline-block cursor-pointer" onClick={handleCopyCode}>
                  <p className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-[#7D52F4] transition-transform group-hover:scale-105">
                    {code || "J47KTXWY"}
                  </p>
                  <span className="mt-1 inline-block text-2xs font-semibold text-gray-400 group-hover:text-[#7D52F4] transition-colors">
                    {copied ? "✓ Copied!" : "Click to copy code"}
                  </span>
                </div>
              ) : (
                <div className="rounded-xl bg-purple-50 p-3 text-center border border-purple-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7D52F4]">
                    ⚡ Automatic Cart Discount
                  </p>
                  <p className="text-2xs text-gray-500 mt-0.5">Applied directly at checkout</p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Valid until {hasEndDate && endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "indefinitely"}
              </p>
            </div>

            {/* Perforated Cut Line */}
            <div className="border-b-2 border-dashed border-gray-200 my-6" />

            {/* Type & Details matching media_1789543103848.png */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-900">Type</p>
                <p className="text-sm text-gray-700 mt-0.5 font-medium">
                  {discountType === "percentage" ? `${Number(discountValue).toFixed(2)}% off ` : `$${Number(discountValue)}.00 off `}
                  {appliesTo === "all_courses"
                    ? "all courses"
                    : appliesTo === "all_bundles"
                    ? "all bundles"
                    : appliesTo === "all_courses_and_bundles"
                    ? "all courses & bundles"
                    : appliesTo === "specific_courses"
                    ? `${selectedItemIds.length} specific course${selectedItemIds.length === 1 ? "" : "s"}`
                    : appliesTo === "specific_bundles"
                    ? `${selectedItemIds.length} specific bundle${selectedItemIds.length === 1 ? "" : "s"}`
                    : `${selectedCategory} category`}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-900">Details</p>
                <p className="text-sm text-gray-700 mt-0.5 font-medium">
                  Active from today
                </p>
              </div>

              {/* Requirements & Limits summary */}
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                {minRequirement === "amount" && (
                  <p>• Min. purchase: ${minAmount}.00</p>
                )}
                {minRequirement === "quantity" && (
                  <p>• Min. quantity: {minQuantity} items</p>
                )}
                {limitTotalUsage && (
                  <p>• Total limit: {totalUsageLimit} redemptions</p>
                )}
                {limitCustomerUsage && (
                  <p>• Limit per customer: {customerUsageLimit}</p>
                )}
              </div>
            </div>

            {/* Bottom Barcode / Authenticity Seal */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-1.5 opacity-60">
              <div className="flex items-center gap-1">
                {[4, 2, 6, 2, 4, 3, 7, 2, 5, 2, 6, 3, 5, 2, 4].map((h, i) => (
                  <div key={i} className="w-1 bg-gray-400 rounded-xs" style={{ height: `${h * 3.5}px` }} />
                ))}
              </div>
              <span className="font-mono text-3xs uppercase tracking-widest text-gray-400">
                AUTHENTICATED SKILLIANT COUPON
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Select Items Modal matching media_1789542988245.png */}
      {isItemPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-base font-bold text-gray-900">Select items</h3>
              <button
                type="button"
                onClick={() => setIsItemPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input matching design */}
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => {
                    setPickerSearch(e.target.value);
                    setPickerPage(1);
                  }}
                  placeholder="Search..."
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none focus:ring-1 focus:ring-[#7D52F4]"
                />
              </div>
            </div>

            {/* Table of Items matching media_1789542988245.png */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30 text-xs font-semibold text-gray-600">
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={
                          paginatedItems.length > 0 &&
                          paginatedItems.every((item) => tempSelectedIds.includes(item.id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newIds = Array.from(new Set([...tempSelectedIds, ...paginatedItems.map((i) => i.id)]));
                            setTempSelectedIds(newIds);
                          } else {
                            const paginatedIds = paginatedItems.map((i) => i.id);
                            setTempSelectedIds(tempSelectedIds.filter((id) => !paginatedIds.includes(id)));
                          }
                        }}
                        className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-3 py-3 font-semibold text-gray-700">
                      {appliesTo === "specific_bundles" ? "Bundles" : "Courses"}
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedItems.map((item) => {
                    const isChecked = tempSelectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (isChecked) {
                            setTempSelectedIds(tempSelectedIds.filter((id) => id !== item.id));
                          } else {
                            setTempSelectedIds([...tempSelectedIds, item.id]);
                          }
                        }}
                        className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-3.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by tr onClick
                            className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                              {item.type === "bundle" ? "📦" : "💻"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                              <span className="inline-block text-2xs text-gray-500">{item.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right font-medium whitespace-nowrap">
                          <span className="text-gray-900 font-bold">${item.price}.00</span>
                          {item.originalPrice && (
                            <span className="line-through text-gray-400 ml-1.5 text-xs">
                              ${item.originalPrice}.00
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-sm text-gray-500">
                        No {appliesTo === "specific_bundles" ? "bundles" : "courses"} found matching &ldquo;{pickerSearch}&rdquo;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer with Pagination & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-white px-6 py-3.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Page</span>
                <span className="inline-flex size-7 items-center justify-center rounded-md border border-gray-300 font-semibold text-gray-800">
                  {pickerPage}
                </span>
                <span>of {totalPages}</span>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    disabled={pickerPage <= 1}
                    onClick={() => setPickerPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    disabled={pickerPage >= totalPages}
                    onClick={() => setPickerPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsItemPickerOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePickedItems}
                  className="rounded-xl bg-[#7D52F4] px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-2xs whitespace-nowrap shrink-0"
                >
                  Add ({tempSelectedIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
