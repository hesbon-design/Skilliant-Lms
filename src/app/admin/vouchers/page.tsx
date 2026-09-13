"use client";

import React, { useState } from "react";
import { initialAdminVouchers, AdminVoucher } from "@/data/adminVouchersData";
import { cn } from "@/lib/utils";
import {
  SearchIcon,
  PlusIcon,
  Trash2Icon,
  VoucherIcon,
  OrganizationsIcon,
  DollarIcon,
} from "../adminIcons";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>(initialAdminVouchers);
  const [searchQuery, setSearchQuery] = useState("");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Batch Generation Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [batchOrg, setBatchOrg] = useState("Apex Industrial Logistics");
  const [batchProgramTitle, setBatchProgramTitle] = useState("Industrial Machine Operator Track");
  const [batchProgramType, setBatchProgramType] = useState<"course" | "track">("track");
  const [batchProgramValue, setBatchProgramValue] = useState(450);
  const [batchQuantity, setBatchQuantity] = useState<number>(5);
  const [batchPrefix, setBatchPrefix] = useState("SKL-APEX-");
  const [batchExpiry, setBatchExpiry] = useState("2026-12-31");

  // Copy handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Generate Batch
  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.min(50, Math.max(1, Number(batchQuantity) || 1));
    const prefix = batchPrefix.trim().toUpperCase() || "SKL-VOUCH-";
    const batchId = `BATCH-${Date.now().toString().slice(-6)}`;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const newBatch: AdminVoucher[] = [];
    for (let i = 0; i < qty; i++) {
      let suffix = "";
      for (let j = 0; j < 4; j++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newBatch.push({
        id: `vouch-${Date.now()}-${i}`,
        code: `${prefix}${suffix}`,
        sponsoringOrganization: batchOrg.trim() || "Direct Enterprise Client",
        programTitle: batchProgramTitle.trim() || "Complete Professional Training",
        programType: batchProgramType,
        value: Number(batchProgramValue) || 200,
        status: "Available",
        batchId: batchId,
        createdAt: new Date().toISOString().split("T")[0],
        expiresAt: batchExpiry || "2026-12-31",
      });
    }

    setVouchers([...newBatch, ...vouchers]);
    setIsGenerateModalOpen(false);
  };

  // Revoke / Reissue
  const handleToggleRevoke = (id: string) => {
    setVouchers(
      vouchers.map((v) => {
        if (v.id === id) {
          if (v.status === "Revoked") {
            return { ...v, status: "Available" };
          }
          if (v.status === "Available") {
            return { ...v, status: "Revoked" };
          }
        }
        return v;
      })
    );
  };

  // Delete Voucher
  const handleDeleteVoucher = (id: string) => {
    if (confirm("Are you sure you want to delete this voucher record?")) {
      setVouchers(vouchers.filter((v) => v.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected vouchers?`)) {
      setVouchers(vouchers.filter((v) => !selectedIds.includes(v.id)));
      setSelectedIds([]);
    }
  };

  // Select all toggle
  const handleSelectAll = () => {
    if (selectedIds.length === filteredVouchers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVouchers.map((v) => v.id));
    }
  };

  // Export CSV simulation
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Code,Organization,Program,Type,Value,Status,RedeemedBy,Expires"]
        .concat(
          filteredVouchers.map(
            (v) =>
              `"${v.code}","${v.sponsoringOrganization}","${v.programTitle}","${v.programType}",${v.value},"${v.status}","${
                v.redeemedBy?.name || "Unclaimed"
              }","${v.expiresAt}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "skilliant_vouchers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Distinct organizations for filter
  const organizationsList = Array.from(
    new Set(vouchers.map((v) => v.sponsoringOrganization))
  );

  // Filtered vouchers
  const filteredVouchers = vouchers.filter((voucher) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      voucher.code.toLowerCase().includes(query) ||
      voucher.sponsoringOrganization.toLowerCase().includes(query) ||
      voucher.programTitle.toLowerCase().includes(query) ||
      (voucher.redeemedBy &&
        (voucher.redeemedBy.name.toLowerCase().includes(query) ||
          voucher.redeemedBy.email.toLowerCase().includes(query)));

    const matchesOrg =
      orgFilter === "all" ? true : voucher.sponsoringOrganization === orgFilter;

    const matchesStatus =
      statusFilter === "all" ? true : voucher.status === statusFilter;

    return matchesQuery && matchesOrg && matchesStatus;
  });

  // Metric Computations
  const totalIssued = vouchers.length;
  const availableCount = vouchers.filter((v) => v.status === "Available").length;
  const redeemedCount = vouchers.filter((v) => v.status === "Redeemed").length;
  const totalSponsoredValue = vouchers.reduce((sum, v) => sum + v.value, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Institutional Vouchers
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Export CSV</span>
            <span>↓</span>
          </button>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <PlusIcon className="size-4 shrink-0" />
            <span className="whitespace-nowrap">Generate Voucher Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Total Vouchers Issued</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <VoucherIcon className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{totalIssued}</h3>
          <p className="mt-1 text-sm text-gray-500">Across all enterprise accounts</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Available / Unclaimed</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <span className="font-bold text-sm">🎟️</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-emerald-600">{availableCount}</h3>
          <p className="mt-1 text-sm text-gray-500">Ready for student redemption</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Redeemed &amp; Enrolled</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <span className="font-bold text-sm">🎓</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-purple-700">{redeemedCount}</h3>
          <p className="mt-1 text-sm text-gray-500">Active trainees with 100% funding</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Total Sponsored Value</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <DollarIcon className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            ${totalSponsoredValue.toLocaleString()}
          </h3>
          <p className="mt-1 text-sm text-gray-500">Total institutional training volume</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by voucher code, organization, course, or student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Organization Filter */}
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Organizations</option>
            {organizationsList.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Redeemed">Redeemed</option>
            <option value="Expired">Expired</option>
            <option value="Revoked">Revoked</option>
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

      {/* Vouchers Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-700 min-w-[1000px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      filteredVouchers.length > 0 &&
                      selectedIds.length === filteredVouchers.length
                    }
                    onChange={handleSelectAll}
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Voucher Code</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Sponsoring Organization</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Assigned Program</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Value Covered</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Redemption Status</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Beneficiary</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Expires</th>
                <th className="px-4 py-3.5 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm text-gray-500">
                    No vouchers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((voucher) => {
                  const isSelected = selectedIds.includes(voucher.id);

                  return (
                    <tr
                      key={voucher.id}
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
                              setSelectedIds(selectedIds.filter((id) => id !== voucher.id));
                            } else {
                              setSelectedIds([...selectedIds, voucher.id]);
                            }
                          }}
                          className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>

                      {/* Voucher Code Monospace Pill */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <code className="rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-sm font-bold text-purple-700 border border-purple-200">
                            {voucher.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(voucher.code)}
                            title="Copy voucher code"
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                          >
                            {copiedCode === voucher.code ? (
                              <span className="text-xs font-bold text-emerald-600">Copied!</span>
                            ) : (
                              <span className="text-xs font-medium">📋</span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Sponsoring Organization */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                          <OrganizationsIcon className="size-3.5 text-purple-600 shrink-0" />
                          <span>{voucher.sponsoringOrganization}</span>
                        </div>
                        <div className="text-xs text-gray-500">Batch: {voucher.batchId}</div>
                      </td>

                      {/* Assigned Program */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800 line-clamp-1">
                          {voucher.programTitle}
                        </div>
                        <div className="text-xs font-medium text-purple-600 capitalize">
                          {voucher.programType === "track"
                            ? "Learning Track / Bundle"
                            : "Single Course"}
                        </div>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center font-bold text-gray-900">
                          ${voucher.value}.00
                        </span>
                        <div className="text-xs font-semibold text-emerald-600">
                          100% Covered
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border",
                            voucher.status === "Available"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : voucher.status === "Redeemed"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : voucher.status === "Expired"
                              ? "bg-gray-100 text-gray-600 border-gray-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                        >
                          {voucher.status === "Available"
                            ? "● Available"
                            : voucher.status === "Redeemed"
                            ? "✓ Redeemed"
                            : voucher.status === "Expired"
                            ? "✕ Expired"
                            : "⊘ Revoked"}
                        </span>
                      </td>

                      {/* Beneficiary */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {voucher.redeemedBy ? (
                          <div>
                            <div className="font-semibold text-gray-900">
                              {voucher.redeemedBy.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {voucher.redeemedBy.email}
                            </div>
                            <div className="text-xs text-purple-600 font-medium">
                              On {voucher.redeemedBy.redeemedAt}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">
                            — Unclaimed —
                          </span>
                        )}
                      </td>

                      {/* Expiration Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {voucher.expiresAt}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {voucher.status !== "Redeemed" && (
                            <button
                              onClick={() => handleToggleRevoke(voucher.id)}
                              className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors whitespace-nowrap shrink-0"
                            >
                              <span className="whitespace-nowrap">{voucher.status === "Revoked" ? "Re-enable" : "Revoke"}</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteVoucher(voucher.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors shrink-0"
                            title="Delete voucher record"
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

      {/* BATCH GENERATION MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Generate Institutional Voucher Batch
                </h3>
                <p className="text-sm text-gray-500">
                  Mint 100% sponsored training access codes for corporate cohort enrollments.
                </p>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateBatch} className="mt-6 space-y-4">
              {/* Sponsoring Organization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Sponsoring Organization / Employer *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Industrial Logistics"
                  value={batchOrg}
                  onChange={(e) => setBatchOrg(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Target Program Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Program / Course Assignment *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Industrial Machine Operator Track"
                    value={batchProgramTitle}
                    onChange={(e) => setBatchProgramTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Program Type
                  </label>
                  <select
                    value={batchProgramType}
                    onChange={(e) =>
                      setBatchProgramType(e.target.value as "course" | "track")
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="track">Learning Track</option>
                    <option value="course">Single Course</option>
                  </select>
                </div>
              </div>

              {/* Quantity & Unit Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quantity to Mint (Vouchers) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={batchQuantity}
                    onChange={(e) => setBatchQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-bold text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                  <p className="mt-1 text-xs text-gray-500">Batch maximum: 50 codes per run</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Course Value ($ Covered) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={batchProgramValue}
                    onChange={(e) => setBatchProgramValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-bold text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Code Prefix & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Voucher Code Prefix
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKL-APEX-"
                    value={batchPrefix}
                    onChange={(e) => setBatchPrefix(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-mono text-sm font-bold text-purple-700 uppercase focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Codes will end with 4 random alphanumeric characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    required
                    value={batchExpiry}
                    onChange={(e) => setBatchExpiry(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Summary Callout */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-purple-900">Total Batch Funding Commitment:</span>
                  <span className="text-lg font-bold text-purple-700">
                    ${(batchQuantity * batchProgramValue).toLocaleString()}.00
                  </span>
                </div>
                <p className="mt-1 text-xs text-purple-700">
                  Each voucher will unlock 100% of the program at zero cost to the trainee upon entering the voucher code at checkout.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Mint &amp; Activate Batch ({batchQuantity} Vouchers)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
