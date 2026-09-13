"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialCartItems, CartItem, validCoupons } from "@/data/cartData";
import SectionTitle from "@/components/sectionTitle";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number; type: string } | null>(null);
  const [couponError, setCouponError] = useState("");

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;

    if (validCoupons[trimmed]) {
      const c = validCoupons[trimmed];
      setAppliedCoupon({ code: c.code, amount: c.amount, type: c.type });
    } else {
      setCouponError("Invalid coupon code. Try 'SKILLIANT20' for 20% off.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const totalSavings = originalSubtotal - subtotal;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = (subtotal * appliedCoupon.amount) / 100;
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.amount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <nav className="mb-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-purple-600 transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-gray-900">Cart</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review your selected courses, seat allocations, and learning track bundles.
              </p>
            </div>
            {cartItems.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-700 border border-purple-200">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Total Seat(s)
              </span>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">Your cart is currently empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Discover industry-standard practical training, safety certifications, and specialized trade tracks.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
              >
                Browse Course Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (Col 8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between">
                  <span>Enrolled Program</span>
                  <span className="hidden sm:inline">Seats &amp; Pricing</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100 border border-gray-100">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="inline-block rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 uppercase tracking-wider">
                            {item.type === "track" ? "Skill Track Bundle" : "Single Course"}
                          </span>
                          <h3 className="mt-1 font-bold text-gray-900 text-base leading-snug">
                            <Link href={`/courses/${item.slug}`} className="hover:text-purple-600 transition-colors">
                              {item.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 mt-0.5">
                            Instructor: <span className="text-gray-700 font-medium">{item.instructor}</span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.format}
                          </p>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="mt-2 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors sm:hidden flex items-center gap-1"
                          >
                            Remove item
                          </button>
                        </div>
                      </div>

                      {/* Seats & Price */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t border-gray-50 sm:border-0 pt-3 sm:pt-0">
                        {/* Quantity Counter for Seats */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 font-medium hidden sm:inline">Seats:</span>
                          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="size-7 rounded-lg text-gray-600 hover:bg-white flex items-center justify-center font-bold text-sm transition-colors"
                              title="Decrease seats"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="size-7 rounded-lg text-gray-600 hover:bg-white flex items-center justify-center font-bold text-sm transition-colors"
                              title="Increase seats"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right">
                          <div className="text-base font-extrabold text-gray-900">
                            ${item.price * item.quantity}
                          </div>
                          {item.originalPrice > item.price && (
                            <div className="text-xs text-gray-400 line-through">
                              ${item.originalPrice * item.quantity}
                            </div>
                          )}
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-500">
                              ${item.price} / seat
                            </div>
                          )}
                        </div>

                        {/* Desktop Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="hidden sm:flex size-8 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Bar: Coupon Input */}
                <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                  <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter promotional coupon (e.g. SKILLIANT20)..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors whitespace-nowrap"
                    >
                      Apply Coupon
                    </button>
                  </form>
                  {couponError && (
                    <p className="mt-2 text-xs text-red-600 font-medium">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center justify-between text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      <span>✓ Coupon &ldquo;{appliedCoupon.code}&rdquo; applied successfully!</span>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-gray-500 hover:text-red-600 text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* B2B Employer Callout */}
              <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-600 text-white shrink-0 font-bold">
                  🏢
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Enrolling a Corporate Team or Department?</h4>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    Received a Company Voucher from your employer or institution? You can redeem voucher codes for 100% discount on the next screen, or select <strong className="text-purple-700">Manual / Pay Later</strong> at checkout to generate an official institutional invoice.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar (Col 4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

                <div className="mt-5 space-y-3.5 border-b border-gray-100 pb-5 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Original Price</span>
                    <span className="line-through text-gray-400">${originalSubtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Catalog Discount</span>
                    <span className="font-semibold text-green-600">-${totalSavings}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-green-600 font-medium">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="text-gray-500 font-medium">$0.00 (Inclusive)</span>
                  </div>
                </div>

                <div className="mt-5 flex items-baseline justify-between">
                  <span className="text-base font-bold text-gray-900">Total Due</span>
                  <span className="text-2xl font-extrabold text-purple-600">${finalTotal.toFixed(2)}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-purple-700 transition-colors"
                  >
                    Proceed to Checkout →
                  </Link>
                  <Link
                    href="/courses"
                    className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ← Continue Browsing Courses
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">🔒</span>
                    <span>256-Bit SSL Bank-Grade Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">📜</span>
                    <span>Verifiable Tamper-Proof Digital Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">⚡</span>
                    <span>Instant LMS Dashboard &amp; Player Activation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
