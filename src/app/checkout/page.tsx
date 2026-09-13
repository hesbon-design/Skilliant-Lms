"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialCartItems, CartItem, validVouchers, validCoupons, AppliedVoucher } from "@/data/cartData";

type PaymentMethod = "card" | "manual" | "voucher";

export default function CheckoutPage() {
  const [cartItems] = useState<CartItem[]>(initialCartItems);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Alex Mercer",
    email: "a.mercer@apexlogistics.com",
    password: "••••••••••••",
    companyName: "Apex Industrial Logistics",
    poNumber: "PO-APX-2026-904",
    billingAddress: "450 Industrial Parkway",
    city: "Chicago",
    postalCode: "60607",
    country: "United States",
    termsAccepted: true,
    safetyPolicyAccepted: true,
  });

  // Voucher & Coupon State
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [voucherError, setVoucherError] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number; type: string } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedVoucher) {
    discountAmount = subtotal; // 100% covered
  } else if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = (subtotal * appliedCoupon.amount) / 100;
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.amount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Handle Voucher Redemption
  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError("");
    const trimmed = voucherInput.trim().toUpperCase();
    if (!trimmed) return;

    if (validVouchers[trimmed]) {
      const v = validVouchers[trimmed];
      setAppliedVoucher(v);
      setPaymentMethod("voucher");
      setAppliedCoupon(null); // Voucher overrides coupon
    } else {
      setVoucherError("Invalid voucher code. Example valid voucher: SKL-APEX-2026");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setPaymentMethod("card");
  };

  // Handle Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) return;

    if (validCoupons[trimmed]) {
      const c = validCoupons[trimmed];
      setAppliedCoupon({ code: c.code, amount: c.amount, type: c.type });
    } else {
      setCouponError("Invalid coupon code. Try 'SKILLIANT20'");
    }
  };

  // Handle Order Submit
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted || !formData.safetyPolicyAccepted) {
      alert("Please accept the Terms of Service and Safety Policy to continue.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `SKL-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsCompleted(true);
    }, 1200);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-lg text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className="mt-5 inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200 uppercase tracking-wider">
            Order Confirmed &bull; {orderId}
          </span>

          <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
            {appliedVoucher
              ? "Enrollment Unlocked with Voucher!"
              : paymentMethod === "manual"
              ? "Manual / Invoice Registration Submitted!"
              : "Welcome to Skilliant! Registration Complete"}
          </h2>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {appliedVoucher ? (
              <>
                Your seat has been completely funded by <strong className="text-gray-900">{appliedVoucher.sponsoredBy}</strong> using voucher code <strong className="text-purple-600">{appliedVoucher.code}</strong>. You now have full access to your learning modules.
              </>
            ) : paymentMethod === "manual" ? (
              <>
                Your order is logged under <strong className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Pending Payment / Invoice Due</strong>. An official invoice has been dispatched to <strong className="text-gray-900">{formData.email}</strong>. Our Super Admin team has been notified to verify your bank wire/PO and activate your account.
              </>
            ) : (
              <>
                Your card payment of <strong className="text-purple-600">${finalTotal.toFixed(2)}</strong> was processed successfully. A confirmation receipt has been sent to <strong className="text-gray-900">{formData.email}</strong>.
              </>
            )}
          </p>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Student Name:</span>
              <span className="font-semibold text-gray-900">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Email:</span>
              <span className="font-semibold text-gray-900">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Channel:</span>
              <span className="font-semibold text-gray-900 capitalize">
                {appliedVoucher ? "Company Voucher ($0.00)" : paymentMethod === "manual" ? "Invoice / Pay Later (Bank Wire)" : "Credit Card (Stripe)"}
              </span>
            </div>
            {paymentMethod === "manual" && (
              <div className="flex justify-between border-t border-gray-200 pt-2 text-amber-700">
                <span>Invoice Status:</span>
                <span className="font-bold">Pending Wire Clearance</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-purple-600 px-7 py-3 text-sm font-bold text-white shadow-xs hover:bg-purple-700 transition-colors"
            >
              Go to Learner Dashboard →
            </Link>
            {paymentMethod === "manual" && (
              <button
                onClick={() => alert("Simulated Invoice Download: INV-" + orderId + ".pdf downloaded")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                📥 Download Invoice PDF
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/cart" className="hover:text-purple-600 transition-colors">← Return to Cart</Link>
          <span>/</span>
          <span className="text-gray-900">Checkout</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Secure Conversion Checkout
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Single-screen registration, company voucher redemption, and flexible enrollment options.
        </p>

        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Form (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Account Creation & Identification */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  Learner Account &amp; Identity
                </h2>
              </div>
              <p className="text-sm text-gray-500 -mt-3 mb-5">
                Your permanent LMS profile and verifiable credential record will be linked to this email.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. Alex Mercer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address (Login)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                    placeholder="learner@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Account Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                    placeholder="Create secure password"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Company / Organization Name <span className="text-gray-500 font-normal">(Optional for individual learners)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. Apex Industrial Logistics"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Company Voucher Redemption Hub */}
            <div className="rounded-3xl border border-purple-200 bg-purple-50/40 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    2
                  </span>
                  <h2 className="text-base font-bold text-gray-900">
                    Company Voucher Redemption
                  </h2>
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">
                  100% Employer Funded
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Did your employer, agency, or institution issue you a training voucher? Enter it here to unlock your course at zero personal cost.
              </p>

              {appliedVoucher ? (
                <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-green-600 text-white font-bold">
                      ✓
                    </span>
                    <div>
                      <p className="text-sm font-bold text-green-900">
                        Voucher Active: {appliedVoucher.code}
                      </p>
                      <p className="text-sm text-green-700">
                        Sponsored by {appliedVoucher.sponsoredBy} &bull; 100% Balance Covered
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-sm font-semibold text-red-600 hover:text-red-800 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SKL-APEX-2026"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      className="flex-1 rounded-xl border border-purple-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                    >
                      Redeem Voucher
                    </button>
                  </div>
                  {voucherError && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{voucherError}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Try demo voucher: <code className="bg-white px-1.5 py-0.5 rounded text-purple-700 font-bold border border-purple-200">SKL-APEX-2026</code>
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method Selection */}
            {!appliedVoucher && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    3
                  </span>
                  <h2 className="text-base font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Credit / Debit Card */}
                  <label
                    className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-purple-600 bg-purple-50/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">Credit or Debit Card</span>
                        <div className="flex gap-1.5 text-xs text-gray-400">
                          <span className="font-semibold text-gray-600">Visa</span> &bull;{" "}
                          <span className="font-semibold text-gray-600">Mastercard</span> &bull;{" "}
                          <span className="font-semibold text-gray-600">Amex</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Instant activation via 256-bit encrypted Stripe gateway.
                      </p>

                      {paymentMethod === "card" && (
                        <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm focus:bg-white focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM / YY"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm focus:bg-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">CVC Code</label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm focus:bg-white focus:border-purple-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 2: Manual / Pay Later (Invoice / PO) */}
                  <label
                    className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-colors ${
                      paymentMethod === "manual"
                        ? "border-purple-600 bg-purple-50/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="manual"
                      checked={paymentMethod === "manual"}
                      onChange={() => setPaymentMethod("manual")}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                          Manual / Pay Later (Institutional Invoice &amp; PO)
                        </span>
                        <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 uppercase">
                          B2B / Invoiced
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                        For company-sponsored training, purchase orders, or bank transfers. No card required now.
                      </p>

                      {paymentMethod === "manual" && (
                        <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
                          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900 leading-relaxed">
                            <strong>How this works:</strong> Your order will be placed in <em>&ldquo;Pending Payment / Invoice Due&rdquo;</em> status. An official invoice with bank wire instructions will be sent, and our platform Super Admin will be alerted immediately to review and activate access upon wire confirmation.
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Order (PO) Number</label>
                            <input
                              type="text"
                              value={formData.poNumber}
                              onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:border-purple-500 focus:outline-none"
                              placeholder="e.g. PO-8921-2026"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Terms & Safety Liability Acceptance */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3 text-sm text-gray-600">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>
                  I agree to the <Link href="/terms" className="text-purple-600 hover:underline">Terms of Service</Link> and acknowledge the <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.safetyPolicyAccepted}
                  onChange={(e) => setFormData({ ...formData, safetyPolicyAccepted: e.target.checked })}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>
                  I understand that certification requires satisfying practical competency drill benchmarks and verified zero-fault safety inspections.
                </span>
              </label>
            </div>
          </div>

          {/* Right Sidebar: Order Summary & Completion CTA (Col 5) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">
                Enrolled Items ({cartItems.length})
              </h3>

              <div className="divide-y divide-gray-50 py-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-bold text-gray-900 leading-snug">{item.title}</p>
                      <p className="text-gray-500">{item.quantity} Seat(s) &bull; {item.format}</p>
                    </div>
                    <span className="font-extrabold text-gray-900 shrink-0">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {appliedVoucher && (
                  <div className="flex justify-between text-green-700 font-bold bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200">
                    <span>Company Voucher (100% OFF)</span>
                    <span>-${subtotal.toFixed(2)}</span>
                  </div>
                )}

                {!appliedVoucher && appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax</span>
                  <span>$0.00</span>
                </div>

                <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm font-bold text-gray-900">Total to Pay</span>
                  <span className="text-2xl font-extrabold text-purple-600">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : appliedVoucher ? (
                    <span>Unlock 100% with Voucher →</span>
                  ) : paymentMethod === "manual" ? (
                    <span>Submit Manual / Invoice Order →</span>
                  ) : (
                    <span>Pay ${finalTotal.toFixed(2)} with Card →</span>
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">
                  By completing this order, you agree to automatic enrollment in your student portal.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
