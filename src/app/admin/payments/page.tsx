"use client";

import React, { useState } from "react";
import { initialAdminPayments, AdminPaymentRecord } from "@/data/adminPaymentsData";
import { cn } from "@/lib/utils";
import { SearchIcon, PaymentsIcon, DollarIcon, Trash2Icon } from "../adminIcons";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPaymentRecord[]>(initialAdminPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminPaymentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm Wire / Mark as Paid
  const handleConfirmPayment = (orderId: string) => {
    setPayments((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: "Completed" as const } : ord
      )
    );
    setToastMessage(`Payment for order ${orderId} confirmed. Trainee access unlocked.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete Record
  const handleDeleteRecord = (orderId: string) => {
    if (confirm("Are you sure you want to delete this payment record from the ledger?")) {
      setPayments((prev) => prev.filter((p) => p.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["OrderNumber,Customer,Email,Company,Amount,Method,Type,Status,Date"]
        .concat(
          filteredPayments.map(
            (p) =>
              `"${p.orderNumber}","${p.customerName}","${p.customerEmail}","${
                p.companyName || "Individual"
              }",${p.amount},"${p.paymentMethod}","${p.pricingType}","${p.status}","${p.transactionDate}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skilliant_payments_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      payment.orderNumber.toLowerCase().includes(query) ||
      payment.customerName.toLowerCase().includes(query) ||
      payment.customerEmail.toLowerCase().includes(query) ||
      (payment.companyName && payment.companyName.toLowerCase().includes(query)) ||
      payment.items.some((i) => i.title.toLowerCase().includes(query));

    const matchesMethod =
      methodFilter === "all" ? true : payment.paymentMethod.includes(methodFilter);

    const matchesStatus =
      statusFilter === "all" ? true : payment.status === statusFilter;

    return matchesQuery && matchesMethod && matchesStatus;
  });

  // KPI Calculations
  const completedPayments = payments.filter((p) => p.status === "Completed");
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingVolume = payments
    .filter((p) => p.status === "Pending Wire Transfer")
    .reduce((sum, p) => sum + p.amount, 0);
  const avgOrderValue =
    completedPayments.length > 0
      ? Math.round(totalRevenue / completedPayments.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in zoom-in-95">
          <span className="flex size-5 items-center justify-center rounded-full bg-green-500 text-xs text-white font-bold">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Payment History &amp; Financial Ledger
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <span className="whitespace-nowrap">Export Financial CSV</span>
          <span>↓</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Total Revenue Collected</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarIcon className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            ${totalRevenue.toLocaleString()}.00
          </h3>
          <p className="mt-1 text-sm text-gray-500">Completed customer payments</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Completed Orders</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <PaymentsIcon className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-purple-700">
            {completedPayments.length}
          </h3>
          <p className="mt-1 text-sm text-gray-500">Direct sales &amp; cleared invoices</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Pending Wire Transfers</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <span className="font-bold text-sm">⏱️</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-amber-600">
            ${pendingVolume.toLocaleString()}.00
          </h3>
          <p className="mt-1 text-sm text-gray-500">Awaiting wire clearance</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Average Order Value</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <span className="font-bold text-sm">Avg</span>
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            ${avgOrderValue.toLocaleString()}.00
          </h3>
          <p className="mt-1 text-sm text-gray-500">Per paying transaction</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order #, customer name, email, or program title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Payment Methods</option>
            <option value="Stripe">Credit Card (Stripe)</option>
            <option value="Wire">Bank Wire / Invoice</option>
            <option value="Voucher">Company Voucher</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending Wire Transfer">Pending Wire Transfer</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-700 min-w-[1000px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Order / Transaction</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Customer / Account</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Purchased Program</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Amount Paid</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Payment Method</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Date &amp; Time</th>
                <th className="px-4 py-3.5 font-semibold text-gray-700 whitespace-nowrap">Payment Status</th>
                <th className="px-4 py-3.5 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-gray-500">
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* Order Number */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-bold text-gray-900">
                        {payment.orderNumber}
                      </div>
                      <div className="text-xs text-purple-600 font-medium">{payment.pricingType}</div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{payment.customerName}</div>
                      <div className="text-xs text-gray-500">{payment.customerEmail}</div>
                      {payment.companyName && (
                        <div className="text-xs text-purple-700 font-medium mt-0.5">
                          {payment.companyName}
                        </div>
                      )}
                    </td>

                    {/* Purchased Items */}
                    <td className="px-4 py-4">
                      {payment.items.map((item, idx) => (
                        <div key={idx} className="max-w-[280px]">
                          <div className="font-medium text-gray-800 line-clamp-1">{item.title}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            Qty: {item.quantity} • {item.type}
                          </div>
                        </div>
                      ))}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-base font-bold text-gray-900">
                        ${payment.amount.toLocaleString()}.00
                      </div>
                    </td>

                    {/* Method */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {payment.paymentMethod.includes("Stripe") ? (
                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-200">
                          💳 Credit Card (Stripe)
                        </span>
                      ) : payment.paymentMethod.includes("Wire") ? (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                          🏦 Bank Wire / Invoice
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          🎟️ Company Voucher
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.transactionDate}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border",
                          payment.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : payment.status === "Pending Wire Transfer"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        )}
                      >
                        {payment.status === "Completed"
                          ? "✓ Cleared / Paid"
                          : payment.status === "Pending Wire Transfer"
                          ? "⏱️ Wire Pending"
                          : "↩ Refunded"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === "Pending Wire Transfer" && (
                          <button
                            onClick={() => handleConfirmPayment(payment.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs whitespace-nowrap shrink-0"
                            title="Confirm wire transfer receipt and unlock access"
                          >
                            Confirm Wire
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(payment)}
                          className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors whitespace-nowrap shrink-0"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(payment.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors shrink-0"
                          title="Delete payment record"
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

      {/* RECEIPT INSPECTION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Transaction Receipt
                </span>
                <h3 className="text-xl font-bold text-gray-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-xs text-gray-600">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transaction Date</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.transactionDate}</p>
                  <p className="text-xs text-purple-700 font-medium">
                    {selectedOrder.companyName || "Direct Individual Sale"}
                  </p>
                </div>
              </div>

              {/* Line items */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Line Items
                </p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} • {item.type}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toLocaleString()}.00
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total Paid</span>
                  <span>${selectedOrder.amount.toLocaleString()}.00</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Payment Gateway: {selectedOrder.paymentMethod}</span>
                  <span className="font-semibold text-emerald-600 uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 whitespace-nowrap shrink-0"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Receipt ${selectedOrder.orderNumber} PDF generated successfully.`);
                  }}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 shadow-xs whitespace-nowrap shrink-0"
                >
                  Download Official PDF Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
