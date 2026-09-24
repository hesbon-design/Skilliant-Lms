"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getVoucherGroupById,
  addCodesToVoucherGroup,
  VoucherGroup,
  VoucherCodeItem,
} from "@/data/voucherStore";
import { cn } from "@/lib/utils";
import { SearchIcon, PlusIcon, VoucherIcon, CheckCircleIcon } from "../../adminIcons";

export default function VoucherViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [voucher, setVoucher] = useState<VoucherGroup | null>(null);
  const [activeTab, setActiveTab] = useState<"codes" | "redemptions">("codes");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Unused" | "Redeemed">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add More Vouchers Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [additionalCount, setAdditionalCount] = useState<number>(20);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState("");

  // Email CSV Modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailReportType, setEmailReportType] = useState<"all" | "unused" | "redemptions">("all");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Export Dropdown
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const loadVoucher = () => {
    const data = getVoucherGroupById(resolvedParams.id);
    if (data) {
      setVoucher(data);
    }
  };

  useEffect(() => {
    loadVoucher();
  }, [resolvedParams.id]);

  if (!voucher) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/vouchers"
            className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            ←
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Voucher Not Found</h1>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-xs">
          This voucher batch could not be found or has been removed.
          <div className="mt-4">
            <Link
              href="/admin/vouchers"
              className="inline-flex rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Back to Vouchers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derived statistics
  const totalCodes = voucher.codes.length;
  const unusedCodes = voucher.codes.filter((c) => c.status === "Unused");
  const redeemedCodes = voucher.codes.filter((c) => c.status === "Redeemed");

  // Filtered Codes
  const filteredCodes = voucher.codes.filter((item) => {
    const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Redemptions
  const filteredRedemptions = redeemedCodes.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesCode = item.code.toLowerCase().includes(query);
    const matchesStudent =
      item.redeemedBy?.name.toLowerCase().includes(query) ||
      item.redeemedBy?.email.toLowerCase().includes(query);
    return matchesCode || matchesStudent;
  });

  // Copy code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Add more vouchers handler
  const handleAddMoreVouchers = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, Math.min(500, Number(additionalCount) || 10));
    setIsAdding(true);

    setTimeout(() => {
      addCodesToVoucherGroup(voucher.id, count);
      loadVoucher();
      setIsAdding(false);
      setAddSuccessMsg(`✓ Added ${count} new unique vouchers!`);
      setTimeout(() => {
        setAddSuccessMsg("");
        setIsAddModalOpen(false);
      }, 1200);
    }, 400);
  };

  // Export CSV Helper
  const downloadCSV = (content: string, filename: string) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  const handleExportAllCodes = () => {
    const csvContent =
      "Voucher Code,Status,Created Date,Expiry Date,Redeemed By,Redeemed Email,Redeemed Date\n" +
      voucher.codes
        .map(
          (c) =>
            `"${c.code}","${c.status}","${c.createdAt}","${voucher.expiresAt || "Lifetime"}","${c.redeemedBy?.name || ""}","${
              c.redeemedBy?.email || ""
            }","${c.redeemedBy?.redeemedAt || ""}"`
        )
        .join("\n");
    downloadCSV(csvContent, `${voucher.name.replace(/\s+/g, "_")}_all_codes.csv`);
  };

  const handleExportUnusedCodes = () => {
    const csvContent =
      "Voucher Code,Status,Created Date,Expiry Date\n" +
      unusedCodes.map((c) => `"${c.code}","Unused","${c.createdAt}","${voucher.expiresAt || "Lifetime"}"`).join("\n");
    downloadCSV(csvContent, `${voucher.name.replace(/\s+/g, "_")}_unused_codes.csv`);
  };

  const handleExportRedemptions = () => {
    const csvContent =
      "Voucher Code,Student Name,Student Email,Course / Bundle,Redemption Date\n" +
      redeemedCodes
        .map(
          (c) =>
            `"${c.code}","${c.redeemedBy?.name || ""}","${c.redeemedBy?.email || ""}","${voucher.programTitle}","${
              c.redeemedBy?.redeemedAt || ""
            }"`
        )
        .join("\n");
    downloadCSV(csvContent, `${voucher.name.replace(/\s+/g, "_")}_redemptions.csv`);
  };

  // Email CSV handler
  const handleSendEmailCSV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipients.trim()) return;
    setIsSendingEmail(true);

    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSentSuccess(true);
      setTimeout(() => {
        setEmailSentSuccess(false);
        setIsEmailModalOpen(false);
        setEmailRecipients("");
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/vouchers"
            className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs shrink-0"
            title="Back to Vouchers"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>

          <div>
            <Link
              href="/admin/vouchers"
              className="text-xs font-medium text-gray-500 hover:text-purple-600 transition-colors block"
            >
              Vouchers
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl mt-0.5">
              {voucher.name}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Created: {voucher.createdAt} &middot; {voucher.expiresAt ? `Expires: ${voucher.expiresAt}` : "No Expiry"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add More Vouchers Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            <PlusIcon className="size-4" />
            <span>Add More Vouchers</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs whitespace-nowrap"
            >
              <span>Export CSV ▾</span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-20 animate-in fade-in duration-100">
                <button
                  onClick={handleExportAllCodes}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors"
                >
                  Export All Codes ({totalCodes})
                </button>
                <button
                  onClick={handleExportUnusedCodes}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors"
                >
                  Export Unused Codes Only ({unusedCodes.length})
                </button>
                <button
                  onClick={handleExportRedemptions}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors"
                >
                  Export Redemptions ({redeemedCodes.length})
                </button>
              </div>
            )}
          </div>

          {/* Email CSV Button */}
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs whitespace-nowrap"
          >
            <span>✉ Email CSV</span>
          </button>
        </div>
      </div>

      {/* High-Level Voucher Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Program</p>
          <p className="mt-1.5 text-base font-bold text-gray-900 truncate" title={voucher.programTitle}>
            {voucher.programTitle}
          </p>
          <p className="mt-0.5 text-xs text-purple-600 font-medium capitalize">
            {voucher.programType} &bull; ${voucher.value} value
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Institution / Sponsor</p>
          <p className="mt-1.5 text-base font-bold text-gray-900 truncate">
            {voucher.institution || "Independent / Unattached"}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            Prefix: <span className="font-mono font-bold text-gray-600">{voucher.customPrefix || "VCH"}</span> &bull;{" "}
            {voucher.expiresAt ? (
              <span className={new Date() > new Date(voucher.expiresAt + "T23:59:59") ? "text-red-500 font-semibold" : "text-gray-500"}>
                Exp: {voucher.expiresAt}
              </span>
            ) : (
              <span className="text-gray-400 italic">Lifetime</span>
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unused Codes</p>
          <p className="mt-1.5 text-2xl font-extrabold text-emerald-600">
            {unusedCodes.length}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Available to distribute</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Redeemed</p>
          <p className="mt-1.5 text-2xl font-extrabold text-purple-600">
            {redeemedCodes.length} <span className="text-xs font-normal text-gray-400">/ {totalCodes}</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {Math.round((redeemedCodes.length / (totalCodes || 1)) * 100)}% claimed
          </p>
        </div>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        {/* Tab Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 p-4 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("codes")}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap",
                activeTab === "codes"
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Voucher Codes ({totalCodes})
            </button>
            <button
              onClick={() => setActiveTab("redemptions")}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap",
                activeTab === "redemptions"
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Redemptions ({redeemedCodes.length})
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === "codes" ? "Search code..." : "Search student..."}
                className="rounded-xl border border-gray-200 bg-gray-50/50 py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none"
              />
            </div>

            {activeTab === "codes" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:border-purple-600 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Unused">Unused Only</option>
                <option value="Redeemed">Redeemed Only</option>
              </select>
            )}
          </div>
        </div>

        {/* Tab Content: Codes */}
        {activeTab === "codes" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Unique Code</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Created Date</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Beneficiary</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-xs text-gray-400">
                      No voucher codes match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map((item) => (
                    <tr key={item.code} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <code className="rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-xs font-bold text-purple-700 border border-purple-200">
                          {item.code}
                        </code>
                      </td>

                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                            item.status === "Unused"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          )}
                        >
                          {item.status === "Unused" ? "● Unused" : "✓ Redeemed"}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {item.createdAt}
                      </td>

                      <td className="px-6 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                        {item.redeemedBy ? (
                          <div>
                            <span className="font-bold text-gray-900">{item.redeemedBy.name}</span>
                            <span className="text-gray-400 ml-1.5">({item.redeemedBy.email})</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">— Available —</span>
                        )}
                      </td>

                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCopyCode(item.code)}
                          className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center gap-1"
                        >
                          {copiedCode === item.code ? (
                            <span className="text-emerald-600 font-bold">✓ Copied</span>
                          ) : (
                            <span>Copy Code</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Redemptions */}
        {activeTab === "redemptions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Voucher Code Used</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Student Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Student Email</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Course / Bundle</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Redemption Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRedemptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-xs text-gray-400">
                      No redemptions recorded for this voucher batch yet.
                    </td>
                  </tr>
                ) : (
                  filteredRedemptions.map((item) => (
                    <tr key={item.code} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <code className="rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-xs font-bold text-purple-700 border border-purple-200">
                          {item.code}
                        </code>
                      </td>

                      <td className="px-6 py-3.5 text-xs font-bold text-gray-900 whitespace-nowrap">
                        {item.redeemedBy?.name || "Learner"}
                      </td>

                      <td className="px-6 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                        {item.redeemedBy?.email || "—"}
                      </td>

                      <td className="px-6 py-3.5 text-xs whitespace-nowrap">
                        <div className="font-semibold text-gray-800 max-w-xs truncate" title={voucher.programTitle}>
                          {voucher.programTitle}
                        </div>
                        <span className="text-2xs text-purple-600 font-medium capitalize">
                          {voucher.programType}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-xs text-purple-700 font-semibold whitespace-nowrap">
                        {item.redeemedBy?.redeemedAt || item.createdAt}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD MORE VOUCHERS MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Add More Vouchers to Batch
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMoreVouchers} className="mt-4 space-y-4">
              <p className="text-xs text-gray-500">
                Generate additional unique single-use codes for <strong>{voucher.name}</strong>.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Number of Vouchers to Add
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={additionalCount}
                  onChange={(e) => setAdditionalCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:border-purple-600 focus:outline-none"
                  placeholder="e.g. 20"
                />
              </div>

              {addSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                  {addSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {isAdding ? "Generating..." : `Add ${additionalCount} Vouchers`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMAIL CSV MODAL */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Email Voucher CSV Report
              </h3>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmailCSV} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Recipient Email Address(es)
                </label>
                <textarea
                  rows={2}
                  required
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  placeholder="e.g. manager@apexlogistics.com, hr-team@apexlogistics.com"
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-900 focus:border-purple-600 focus:outline-none"
                />
                <p className="text-2xs text-gray-400 mt-1">Separate multiple emails with commas</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Report Type
                </label>
                <select
                  value={emailReportType}
                  onChange={(e) => setEmailReportType(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 focus:border-purple-600 focus:outline-none"
                >
                  <option value="all">All Voucher Codes &amp; Status</option>
                  <option value="unused">Unused Codes Only</option>
                  <option value="redemptions">Student Redemptions Report</option>
                </select>
              </div>

              {emailSentSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                  ✓ CSV report successfully sent to {emailRecipients}!
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSendingEmail ? "Sending Report..." : "Send CSV via Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
