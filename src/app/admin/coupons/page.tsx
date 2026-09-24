"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialAdminCoupons, AdminCoupon } from "@/data/adminCouponsData";
import { cn } from "@/lib/utils";
import { SearchIcon, PlusIcon, Trash2Icon, FilterIcon, CouponIcon } from "../adminIcons";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(initialAdminCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState<number>(20);
  const [newApplicableType, setNewApplicableType] = useState<"all" | "course" | "track">("all");
  const [newTargetName, setNewTargetName] = useState("");
  const [newUsageLimit, setNewUsageLimit] = useState<string>("200");
  const [newExpiry, setNewExpiry] = useState("2026-12-31");
  const [newMinPurchase, setNewMinPurchase] = useState<number>(0);

  // Copy handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Generate random code helper
  const handleGenerateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "SKL-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(result);
  };

  // Create Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;

    const created: AdminCoupon = {
      id: `coup-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      discountType: newType,
      discountValue: Number(newValue) || 10,
      applicableType: newApplicableType,
      applicableTargetName:
        newApplicableType === "all"
          ? "All Catalog Courses"
          : newTargetName.trim() || "Selected Course",
      usageLimit: newUsageLimit ? Number(newUsageLimit) : null,
      usedCount: 0,
      minPurchaseAmount: Number(newMinPurchase) || 0,
      expiryDate: newExpiry || "2026-12-31",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCoupons([created, ...coupons]);
    setIsCreateModalOpen(false);

    // Reset Form
    setNewCode("");
    setNewTitle("");
    setNewType("percentage");
    setNewValue(20);
    setNewApplicableType("all");
    setNewTargetName("");
    setNewUsageLimit("200");
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setCoupons(
      coupons.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "active" ? "draft" : "active";
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // Delete Coupon
  const handleDeleteCoupon = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      setCoupons(coupons.filter((c) => c.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected coupons?`)) {
      setCoupons(coupons.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  // Select all toggle
  const handleSelectAll = () => {
    if (selectedIds.length === filteredCoupons.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCoupons.map((c) => c.id));
    }
  };

  // Filtered list
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesQuery =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.applicableTargetName &&
        coupon.applicableTargetName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      typeFilter === "all" ? true : coupon.discountType === typeFilter;

    const matchesStatus =
      statusFilter === "all" ? true : coupon.status === statusFilter;

    return matchesQuery && matchesType && matchesStatus;
  });

  // KPI calculations
  const activeCount = coupons.filter((c) => c.status === "active").length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const totalSavingsEst = coupons.reduce((sum, c) => {
    if (c.discountType === "fixed") {
      return sum + c.usedCount * c.discountValue;
    }
    return sum + c.usedCount * 25; // estimated $25 per percentage coupon
  }, 0);
  const avgDiscount =
    coupons.length > 0
      ? (
          coupons.reduce((sum, c) => sum + c.discountValue, 0) / coupons.length
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Coupons &amp; Discounts
          </h1>
        </div>

        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <PlusIcon className="size-4" />
          <span className="whitespace-nowrap shrink-0">Create Coupon</span>
        </Link>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Active Coupons</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <CouponIcon className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{activeCount}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {coupons.length} total campaigns configured
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Total Redemptions</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <span className="font-bold text-sm">✓</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-emerald-600">{totalRedemptions}</h3>
          <p className="mt-1 text-sm text-gray-500">Claimed by enrolled students</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Estimated Savings</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <span className="font-bold text-sm">$</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            ${totalSavingsEst.toLocaleString()}
          </h3>
          <p className="mt-1 text-sm text-gray-500">Total student discount value delivered</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Average Discount</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <span className="font-bold text-sm">%</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{avgDiscount}%</h3>
          <p className="mt-1 text-sm text-gray-500">Across percentage &amp; fixed rates</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by coupon code, campaign title, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Discount Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap shrink-0"
            >
              <Trash2Icon className="size-4 shrink-0" />
              <span className="whitespace-nowrap">Delete ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-700 min-w-[950px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      filteredCoupons.length > 0 &&
                      selectedIds.length === filteredCoupons.length
                    }
                    onChange={handleSelectAll}
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Coupon Code</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Campaign / Title</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Discount</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Applicable Scope</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Usage Progress</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Expires</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm text-gray-500">
                    No coupons match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isSelected = selectedIds.includes(coupon.id);
                  const isUnlimited = coupon.usageLimit === null;
                  const usagePercent = isUnlimited
                    ? 0
                    : Math.min(
                        100,
                        Math.round((coupon.usedCount / (coupon.usageLimit || 1)) * 100)
                      );

                  return (
                    <tr
                      key={coupon.id}
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
                              setSelectedIds(selectedIds.filter((id) => id !== coupon.id));
                            } else {
                              setSelectedIds([...selectedIds, coupon.id]);
                            }
                          }}
                          className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>

                      {/* Coupon Code Pill */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <code className="rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-sm font-bold text-purple-700 border border-purple-200">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy code to clipboard"
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                          >
                            {copiedCode === coupon.code ? (
                              <span className="text-xs font-bold text-emerald-600">Copied!</span>
                            ) : (
                              <span className="text-xs font-medium">📋</span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{coupon.title}</div>
                        <div className="text-xs text-gray-500">Created: {coupon.createdAt}</div>
                      </td>

                      {/* Discount Amount */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {coupon.discountType === "percentage" ? (
                          <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-1 text-sm font-bold text-purple-800">
                            {coupon.discountValue}% OFF
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-1 text-sm font-bold text-emerald-800">
                            ${coupon.discountValue}.00 OFF
                          </span>
                        )}
                      </td>

                      {/* Applicable Target */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-800 line-clamp-1">
                          {coupon.applicableTargetName || "All Catalog Courses"}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {coupon.applicableType === "all" ? "Global Catalog" : coupon.applicableType}
                        </div>
                      </td>

                      {/* Usage Progress */}
                      <td className="px-4 py-4 whitespace-nowrap min-w-[140px]">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-1">
                          <span>{coupon.usedCount} used</span>
                          <span>{isUnlimited ? "Unlimited" : `${coupon.usageLimit} max`}</span>
                        </div>
                        {!isUnlimited && (
                          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                usagePercent >= 90 ? "bg-amber-500" : "bg-purple-600"
                              )}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Expiry Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {coupon.expiryDate}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer",
                            coupon.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : coupon.status === "draft"
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                          )}
                          title="Click to toggle status"
                        >
                          {coupon.status === "active"
                            ? "● Active"
                            : coupon.status === "draft"
                            ? "○ Draft"
                            : "✕ Expired"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(coupon.id)}
                            className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span className="whitespace-nowrap">{coupon.status === "active" ? "Pause" : "Activate"}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors shrink-0"
                            title="Delete coupon"
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

      {/* CREATE COUPON MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
                <p className="text-sm text-gray-500">
                  Configure discount terms, promotional campaign scope, and usage limits.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-6 space-y-4">
              {/* Code with Generator */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKILLIANT20"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-mono text-sm font-bold uppercase text-purple-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Generate Random
                  </button>
                </div>
              </div>

              {/* Campaign Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Launch Promotion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Discount Type and Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) =>
                      setNewType(e.target.value as "percentage" | "fixed")
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed">Fixed Dollar Off ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={newType === "percentage" ? 100 : 1000}
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-bold text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Scope */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Applicable Scope
                </label>
                <select
                  value={newApplicableType}
                  onChange={(e) =>
                    setNewApplicableType(e.target.value as "all" | "course" | "track")
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="all">All Catalog Courses</option>
                  <option value="course">Specific Course Only</option>
                  <option value="track">Learning Track / Bundle Only</option>
                </select>
              </div>

              {newApplicableType !== "all" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Course / Track Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter exact course or bundle title"
                    value={newTargetName}
                    onChange={(e) => setNewTargetName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              )}

              {/* Usage Limit & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Usage Limit (Leave blank for unlimited)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 500"
                    value={newUsageLimit}
                    onChange={(e) => setNewUsageLimit(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Create &amp; Publish Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
