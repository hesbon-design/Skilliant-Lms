"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createVoucherGroup, VoucherGroup } from "@/data/voucherStore";
import { CATALOG_ITEMS } from "../../coupons/new/page";
import { cn } from "@/lib/utils";

const INSTITUTIONS_LIST = [
  "None / Independent",
  "Apex Industrial Logistics",
  "TechCorp Global Academy",
  "Metro Transit Authority",
  "Stark Heavy Machinery",
  "Horizon Logistics Ltd.",
  "Custom Institution...",
];

export default function CreateVoucherPage() {
  const router = useRouter();

  // 1. Voucher Name
  const [name, setName] = useState("Industrial Machine Operator");

  // 2. Institution (Optional)
  const [institutionSelection, setInstitutionSelection] = useState("None / Independent");
  const [customInstitution, setCustomInstitution] = useState("");

  // 3. Course or Bundle
  const [selectedItemId, setSelectedItemId] = useState("b-1");

  // 4. Number of vouchers to generate (Simple number input, NO slider)
  const [quantity, setQuantity] = useState<number>(10);

  // 5. Custom prefix (Optional checkbox + max 3 letters)
  const [useCustomPrefix, setUseCustomPrefix] = useState(false);
  const [customPrefix, setCustomPrefix] = useState("ABC");

  // 6. Expiry Date (Optional)
  const [hasExpiryDate, setHasExpiryDate] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  // Generated Result State
  const [createdVoucher, setCreatedVoucher] = useState<VoucherGroup | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Export CSV & Email State
  const [isExportExpanded, setIsExportExpanded] = useState(true);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [exportEmail, setExportEmail] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Determine effective institution
  const effectiveInstitution =
    institutionSelection === "None / Independent"
      ? null
      : institutionSelection === "Custom Institution..."
      ? customInstitution.trim() || null
      : institutionSelection;

  // Selected catalog item
  const selectedItem = CATALOG_ITEMS.find((i) => i.id === selectedItemId) || CATALOG_ITEMS[0];

  // Handle Generate
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const group = createVoucherGroup({
        name: name.trim(),
        institution: effectiveInstitution,
        programTitle: selectedItem.title,
        programType: selectedItem.type,
        value: selectedItem.price,
        quantity: Math.max(1, Math.min(500, Number(quantity) || 10)),
        customPrefix: useCustomPrefix ? customPrefix.trim().toUpperCase().slice(0, 3) : null,
        expiresAt: hasExpiryDate && expiryDate.trim() ? expiryDate.trim() : null,
      });

      setCreatedVoucher(group);
      setIsGenerating(false);
    }, 300);
  };

  // Copy single code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Copy all codes
  const handleCopyAllCodes = () => {
    if (!createdVoucher) return;
    const allText = createdVoucher.codes.map((c) => c.code).join("\n");
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Direct CSV download helper for newly created vouchers
  const handleDownloadCsv = () => {
    if (!createdVoucher) return;
    const headers = [
      "Voucher Code",
      "Status",
      "Uses",
      "Remaining Uses",
      "Voucher Name",
      "Course / Bundle",
      "Created Date",
      "Expiry Date",
    ];
    const rows = createdVoucher.codes.map((c) =>
      [
        `"${c.code}"`,
        `"${c.status}"`,
        0,
        1,
        `"${createdVoucher.name}"`,
        `"${createdVoucher.programTitle}"`,
        `"${createdVoucher.createdAt}"`,
        `"${createdVoucher.expiresAt || "Lifetime"}"`,
      ].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const filename = `vouchers-${createdVoucher.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.csv`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Export CSV & Email
  const handleGenerateExport = () => {
    if (!createdVoucher) return;

    if (isEmailChecked && !exportEmail.trim()) {
      setExportFeedback({
        type: "error",
        text: "Please enter at least one recipient email address.",
      });
      setTimeout(() => setExportFeedback(null), 3500);
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      handleDownloadCsv();
      setIsExporting(false);

      if (isEmailChecked && exportEmail.trim()) {
        setExportFeedback({
          type: "success",
          text: `✓ CSV downloaded & report emailed to: ${exportEmail.trim()}`,
        });
      } else {
        setExportFeedback({
          type: "success",
          text: `✓ CSV export downloaded successfully!`,
        });
      }
      setTimeout(() => setExportFeedback(null), 5000);
    }, 300);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/vouchers"
            className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs"
            title="Back to Vouchers"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/admin/vouchers" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Vouchers
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Create Voucher
            </h1>
          </div>
        </div>

        <Link
          href="/admin/vouchers"
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
        >
          Cancel
        </Link>
      </div>

      {/* Two Column Layout (Clean & Focused like Coupons) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Simple Creation Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-5">
            {/* 1. Voucher Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Voucher Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Industrial Machine Operator"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            {/* 2. Institution (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Institution
                </label>
                <span className="text-2xs text-gray-400 font-normal">Optional</span>
              </div>
              <select
                value={institutionSelection}
                onChange={(e) => setInstitutionSelection(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
              >
                {INSTITUTIONS_LIST.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>

              {institutionSelection === "Custom Institution..." && (
                <input
                  type="text"
                  value={customInstitution}
                  onChange={(e) => setCustomInstitution(e.target.value)}
                  placeholder="Enter organization / company name"
                  className="w-full mt-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
                />
              )}
            </div>

            {/* 3. Course or Bundle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Course or Bundle <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
              >
                <optgroup label="Specialization Tracks & Bundles">
                  {CATALOG_ITEMS.filter((i) => i.type === "bundle").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} (${item.price}.00)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Individual Courses">
                  {CATALOG_ITEMS.filter((i) => i.type === "course").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} (${item.price}.00)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 4. Number of Vouchers to Generate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Number of Vouchers to Generate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="e.g. 10, 20, 50"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            {/* 5. Custom Prefix (Optional) */}
            <div className="space-y-2 pt-1 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomPrefix}
                  onChange={(e) => setUseCustomPrefix(e.target.checked)}
                  className="size-4 rounded text-purple-600 focus:ring-purple-600"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Custom Prefix (Optional)
                </span>
              </label>

              {useCustomPrefix && (
                <div className="pl-6 animate-in fade-in duration-100">
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      type="text"
                      maxLength={3}
                      value={customPrefix}
                      onChange={(e) => setCustomPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                      placeholder="ABC"
                      className="w-24 font-mono uppercase font-bold text-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
                    />
                    <span className="text-xs text-gray-400">
                      Max 3 letters (e.g. {customPrefix || "ABC"}-8K3P-X92L)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Expiry Date (Optional) */}
            <div className="space-y-2 pt-1 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasExpiryDate}
                    onChange={(e) => {
                      setHasExpiryDate(e.target.checked);
                      if (e.target.checked && !expiryDate) {
                        const d = new Date();
                        d.setDate(d.getDate() + 90);
                        setExpiryDate(d.toISOString().split("T")[0]);
                      }
                    }}
                    className="size-4 rounded text-purple-600 focus:ring-purple-600 accent-purple-600"
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    Expiry Date (Optional)
                  </span>
                </label>
                {hasExpiryDate && expiryDate && (
                  <span className="text-2xs text-purple-600 font-medium font-mono">
                    Expires: {expiryDate}
                  </span>
                )}
              </div>

              {hasExpiryDate && (
                <div className="pl-6 space-y-2 animate-in fade-in duration-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-600 focus:outline-none"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 30);
                          setExpiryDate(d.toISOString().split("T")[0]);
                        }}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-2xs font-semibold text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                      >
                        +30d
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 90);
                          setExpiryDate(d.toISOString().split("T")[0]);
                        }}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-2xs font-semibold text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                      >
                        +90d
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 180);
                          setExpiryDate(d.toISOString().split("T")[0]);
                        }}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-2xs font-semibold text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                      >
                        +180d
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setFullYear(d.getFullYear() + 1);
                          setExpiryDate(d.toISOString().split("T")[0]);
                        }}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-2xs font-semibold text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                      >
                        +1yr
                      </button>
                    </div>
                  </div>
                  <p className="text-2xs text-gray-400">
                    Codes will expire and reject redemptions after this date.
                  </p>
                </div>
              )}
            </div>

            {/* 7. Generate Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full rounded-xl bg-purple-600 py-3 text-sm font-bold text-white shadow-xs hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : `Generate ${quantity || 10} Vouchers`}
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Generated Voucher Codes List */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs min-h-[420px] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Generated Vouchers
                </h3>
                <p className="text-xs text-gray-400">
                  {createdVoucher ? `${createdVoucher.codes.length} unique codes generated` : "Waiting for generation"}
                </p>
              </div>

              {createdVoucher && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAllCodes}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
                  >
                    {copiedAll ? "✓ Copied All" : "Copy All"}
                  </button>
                  <Link
                    href={`/admin/vouchers/${createdVoucher.id}`}
                    className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg transition-colors"
                  >
                    View Voucher →
                  </Link>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center py-4">
              {!createdVoucher ? (
                <div className="text-center py-16 space-y-2 text-gray-400">
                  <div className="mx-auto size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl text-gray-400 border border-gray-100">
                    🎟️
                  </div>
                  <p className="text-sm font-medium text-gray-600">No vouchers generated yet</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Fill in the voucher details on the left and click Generate to produce unique individual codes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-purple-900">{createdVoucher.name}</span>
                      <p className="text-purple-700 text-2xs">
                        {createdVoucher.programTitle} &bull; Created: {createdVoucher.createdAt}
                        {createdVoucher.expiresAt ? ` &bull; Expires: ${createdVoucher.expiresAt}` : " &bull; Lifetime"}
                      </p>
                    </div>
                    <span className="font-mono text-purple-700 font-bold bg-white px-2 py-0.5 rounded border border-purple-200">
                      {createdVoucher.codes.length} codes
                    </span>
                  </div>

                  {/* Scrollable list of generated codes */}
                  <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                    {createdVoucher.codes.map((item) => (
                      <div
                        key={item.code}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/20 transition-colors"
                      >
                        <code className="font-mono text-xs font-bold text-gray-800 tracking-wider">
                          {item.code}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.code)}
                          className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          {copiedCode === item.code ? (
                            <span className="text-emerald-600 font-bold">✓ Copied</span>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Below the red lines: Export CSV & Email Card (Rendered when voucher batch is generated) */}
          {createdVoucher && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Export CSV
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Download newly generated codes or dispatch via email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExportExpanded(!isExportExpanded)}
                  className="p-1 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                  title={isExportExpanded ? "Collapse" : "Expand"}
                >
                  <svg
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isExportExpanded ? "" : "rotate-180"
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </button>
              </div>

              {isExportExpanded && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Download the CSV of your {createdVoucher.codes.length} newly generated voucher codes, or email the CSV report directly to administrators and partner institutions.
                  </p>

                  {/* Email CSV Section */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isEmailChecked}
                        onChange={(e) => setIsEmailChecked(e.target.checked)}
                        className="size-4 rounded text-purple-600 focus:ring-purple-600 cursor-pointer accent-purple-600"
                      />
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        Email CSV
                      </span>
                    </label>

                    {isEmailChecked && (
                      <div className="space-y-1.5 pl-6 animate-in fade-in duration-100">
                        <input
                          type="text"
                          placeholder="e.g. partner@apexlogistics.com, hr@company.com"
                          value={exportEmail}
                          onChange={(e) => setExportEmail(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-purple-600 focus:outline-none transition-colors"
                        />
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Send to multiple emails by separating emails addresses with commas.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Feedback Notification */}
                  {exportFeedback && (
                    <div
                      className={cn(
                        "p-3 rounded-xl text-xs font-semibold animate-in fade-in duration-200",
                        exportFeedback.type === "success" &&
                          "bg-emerald-50 text-emerald-800 border border-emerald-200",
                        exportFeedback.type === "error" &&
                          "bg-red-50 text-red-800 border border-red-200",
                        exportFeedback.type === "info" &&
                          "bg-purple-50 text-purple-800 border border-purple-200"
                      )}
                    >
                      {exportFeedback.text}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      disabled={isExporting}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                    >
                      <svg className="size-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>Download CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateExport}
                      disabled={isExporting}
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-purple-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isExporting ? "Processing..." : isEmailChecked ? "Generate & Email Export" : "Generate Export"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
