"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getVoucherGroups, deleteVoucherGroup, VoucherGroup } from "@/data/voucherStore";
import { SearchIcon, PlusIcon, Trash2Icon } from "../adminIcons";

export default function VouchersPage() {
  const [voucherGroups, setVoucherGroups] = useState<VoucherGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadVouchers = () => {
    setVoucherGroups(getVoucherGroups());
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}" and all its associated voucher codes?`)) {
      deleteVoucherGroup(id);
      loadVouchers();
    }
  };

  const filteredGroups = voucherGroups.filter((group) => {
    const query = searchQuery.toLowerCase();
    const matchesName = group.name.toLowerCase().includes(query);
    const matchesCourse = group.programTitle.toLowerCase().includes(query);
    const matchesInst = group.institution ? group.institution.toLowerCase().includes(query) : false;
    return matchesName || matchesCourse || matchesInst;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Vouchers
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/vouchers/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            <PlusIcon className="size-4 shrink-0" />
            <span>Create Voucher</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vouchers by name, course, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-hidden"
          />
        </div>
        <div className="text-xs font-semibold text-gray-500">
          {filteredGroups.length} Voucher {filteredGroups.length === 1 ? "Batch" : "Batches"}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-700 min-w-[760px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Voucher Name</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Course / Bundle</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Institution</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Total Codes</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Redeemed</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Available</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Created / Expires</th>
                <th className="px-6 py-3.5 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-gray-500">
                    No vouchers found. Click <Link href="/admin/vouchers/new" className="text-purple-600 font-bold hover:underline">Create Voucher</Link> to generate your first batch.
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group) => {
                  const total = group.codes.length;
                  const redeemed = group.codes.filter((c) => c.status === "Redeemed").length;
                  const available = total - redeemed;

                  return (
                    <tr key={group.id} className="hover:bg-purple-50/20 transition-colors">
                      {/* Name (Clickable link to view page) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/vouchers/${group.id}`}
                          className="font-bold text-gray-900 hover:text-purple-600 transition-colors block text-sm"
                        >
                          {group.name}
                        </Link>
                        {group.customPrefix && (
                          <span className="text-2xs text-gray-400 font-mono">
                            Prefix: {group.customPrefix}
                          </span>
                        )}
                      </td>

                      {/* Course / Bundle */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800 text-xs max-w-xs truncate" title={group.programTitle}>
                          {group.programTitle}
                        </div>
                        <span className="text-2xs text-purple-600 font-medium capitalize">
                          {group.programType}
                        </span>
                      </td>

                      {/* Institution */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {group.institution ? (
                          <span className="text-xs font-semibold text-gray-800">
                            {group.institution}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            —
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-xs">
                        {total}
                      </td>

                      {/* Redeemed */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                          {redeemed}
                        </span>
                      </td>

                      {/* Available */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          {available}
                        </span>
                      </td>

                      {/* Created & Expiry */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="font-medium text-gray-700">{group.createdAt}</div>
                        <div className="text-2xs">
                          {group.expiresAt ? (
                            <span className={new Date() > new Date(group.expiresAt + "T23:59:59") ? "text-red-500 font-semibold" : "text-gray-500"}>
                              Exp: {group.expiresAt}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">No expiry</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/vouchers/${group.id}`}
                            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            View Details →
                          </Link>
                          <button
                            onClick={() => handleDelete(group.id, group.name)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete voucher batch"
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
    </div>
  );
}
