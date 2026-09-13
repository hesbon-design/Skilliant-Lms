"use client";

import React, { useState } from "react";
import { mockCompanyVouchers, CompanyVoucher, mockCompanyProfile } from "@/data/companyData";

export default function CompanyVouchersPage() {
  const [vouchers, setVouchers] = useState<CompanyVoucher[]>(mockCompanyVouchers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestedSeats, setRequestedSeats] = useState(10);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const availableCount = vouchers.filter((v) => v.status === "Available").length;
  const redeemedCount = vouchers.filter((v) => v.status === "Redeemed").length;

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.redeemedBy?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (v.redeemedBy?.email.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Code,Program,Type,Value,Status,RedeemedBy,RedeemedAt,ExpiresAt\n" +
      vouchers
        .map(
          (v) =>
            `"${v.code}","${v.programName}","${v.programType}","$${v.totalValue}","${v.status}","${
              v.redeemedBy?.email || ""
            }","${v.redeemedBy?.redeemedAt || ""}","${v.expiresAt}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_vouchers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Voucher Distribution Hub
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View, distribute, and manage pre-funded course and skill track vouchers issued to {mockCompanyProfile.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <span>📥 Export CSV</span>
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
          >
            <span>+ Request Additional Vouchers</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Contract Vouchers</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{vouchers.length}</p>
          <p className="mt-1 text-sm text-gray-500">Allocated across 3 specialized tracks</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Available to Distribute</p>
          <p className="mt-2 text-3xl font-extrabold text-purple-600">{availableCount}</p>
          <p className="mt-1 text-sm text-green-700 font-medium">Ready for immediate employee onboarding</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Redeemed by Trainees</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{redeemedCount}</p>
          <p className="mt-1 text-sm text-gray-500">Active enrollments in progress</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Voucher Value Pool</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">$7,420</p>
          <p className="mt-1 text-sm text-gray-500">100% pre-paid institutional rate</p>
        </div>
      </div>

      {/* Program Batch Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mockCompanyProfile.assignedCatalog.map((cat) => {
          const catVouchers = vouchers.filter((v) => v.programName === cat.title);
          const avail = catVouchers.filter((v) => v.status === "Available").length;
          return (
            <div key={cat.id} className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5">
              <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-purple-700 uppercase border border-purple-200">
                {cat.type}
              </span>
              <h3 className="mt-2 text-sm font-bold text-gray-900">{cat.title}</h3>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>Available Codes:</span>
                <strong className="text-purple-700 font-extrabold">{avail} of {catVouchers.length}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search voucher code, student name, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Vouchers ({vouchers.length})</option>
            <option value="Available">Available ({availableCount})</option>
            <option value="Redeemed">Redeemed ({redeemedCount})</option>
          </select>
        </div>

        <div className="text-sm text-gray-500 font-medium">
          Showing <strong>{filteredVouchers.length}</strong> vouchers
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Voucher Code</th>
                <th className="px-4 py-4 whitespace-nowrap">Associated Program</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Type</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-4 whitespace-nowrap">Redeemed By</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Expires</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.code} className="hover:bg-gray-50/50 transition-colors">
                  {/* Code */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-xs font-bold text-purple-700 border border-purple-200">
                        {voucher.code}
                      </code>
                    </div>
                  </td>

                  {/* Program */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">{voucher.programName}</span>
                    <span className="block text-sm text-gray-500">Value: ${voucher.totalValue}</span>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                      {voucher.programType}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        voucher.status === "Available"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {voucher.status}
                    </span>
                  </td>

                  {/* Redeemed By */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {voucher.redeemedBy ? (
                      <div>
                        <p className="font-semibold text-gray-900">{voucher.redeemedBy.name}</p>
                        <p className="text-sm text-gray-500">{voucher.redeemedBy.email} &bull; {voucher.redeemedBy.redeemedAt}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Unclaimed</span>
                    )}
                  </td>

                  {/* Expiration */}
                  <td className="px-4 py-4 text-center text-gray-500 font-medium whitespace-nowrap">
                    {voucher.expiresAt}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleCopyCode(voucher.code)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                    >
                      {copiedCode === voucher.code ? (
                        <span className="text-green-600 font-bold">✓ Copied!</span>
                      ) : (
                        <span>Copy Code</span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Additional Vouchers Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setIsRequestModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl z-10">
            <h3 className="text-base font-bold text-gray-900">
              Request Additional Voucher Batch
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Need more seats for upcoming cohorts? Submit an expansion request to the platform Super Admin.
            </p>

            {requestSubmitted ? (
              <div className="mt-5 rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
                <span className="text-2xl">✓</span>
                <p className="mt-2 text-sm font-bold text-green-900">Request Dispatched!</p>
                <p className="text-sm text-green-700 mt-1">
                  Our Super Admin has received your request for {requestedSeats} additional vouchers and an updated invoice will be generated shortly.
                </p>
                <button
                  onClick={() => {
                    setIsRequestModalOpen(false);
                    setRequestSubmitted(false);
                  }}
                  className="mt-4 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Program</label>
                  <select className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800">
                    {mockCompanyProfile.assignedCatalog.map((cat) => (
                      <option key={cat.id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Number of Vouchers / Seats</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={requestedSeats}
                    onChange={(e) => setRequestedSeats(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800"
                  />
                </div>

                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-purple-900">
                  Estimated add-on tuition: <strong>${requestedSeats * 180}</strong> (Invoiced via PO).
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setIsRequestModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setRequestSubmitted(true)}
                    className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
