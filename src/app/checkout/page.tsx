"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialCartItems, CartItem, validCoupons } from "@/data/cartData";
import { Logo } from "@/lib/icons";
import { checkVoucherValidity, redeemSingleVoucher, AdminVoucher } from "@/data/voucherStore";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "voucher";
type CheckoutStep = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  // Step Navigation State (Sequential 4 Steps in One Page)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  // Cart Items State
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  // Learner Identity Form State
  const [formData, setFormData] = useState({
    fullName: "Alex Mercer",
    email: "a.mercer@gmail.com",
    password: "••••••••••••",
    companyName: "",
    jobTitle: "",
    billingAddress: "450 Parkway Ave",
    city: "Chicago",
    postalCode: "60607",
    country: "United States",
    termsAccepted: true,
    safetyPolicyAccepted: true,
  });

  // Step 2 Validation Errors
  const [step2Errors, setStep2Errors] = useState<{ [key: string]: string }>({});

  // Credit Card Form State
  const [cardData, setCardData] = useState({
    cardNumber: "4242 •••• •••• 4242",
    expiryDate: "12 / 28",
    cvc: "882",
    zipCode: "60607",
    nameOnCard: "Alex Mercer",
  });

  // Voucher State (Single-Use Unique Voucher Verification)
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    sponsoringOrganization?: string | null;
    programTitle: string;
  } | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState("");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number; type: string } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Payment Method Tab
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Cart Adjustments
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.originalPrice, 0);
  const catalogSavings = Math.max(0, originalSubtotal - subtotal);

  let discountAmount = 0;
  if (appliedVoucher) {
    discountAmount = subtotal; // 100% covered by voucher
  } else if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = (subtotal * appliedCoupon.amount) / 100;
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.amount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Handle Voucher Verification (Single-Use Unique Code Check)
  const handleApplyVoucher = (voucherCodeToApply?: string) => {
    setVoucherError("");
    setVoucherSuccess("");
    const trimmed = (voucherCodeToApply || voucherInput).trim().toUpperCase();
    if (!trimmed) {
      setVoucherError("Please enter a voucher code.");
      return;
    }

    const check = checkVoucherValidity(trimmed);
    if (check.success && check.voucher) {
      setAppliedVoucher(check.voucher);
      setPaymentMethod("voucher");
      setAppliedCoupon(null); // Voucher supersedes promotional coupon
      setVoucherSuccess(
        check.voucher.sponsoringOrganization
          ? `Verified: ${check.voucher.programTitle} (${check.voucher.sponsoringOrganization})`
          : `Verified: ${check.voucher.programTitle}`
      );
      setVoucherInput(trimmed);
    } else {
      setVoucherError(check.message || "Invalid voucher code. Each code is single-use only.");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    setVoucherSuccess("");
    setPaymentMethod("card");
  };

  // Handle Coupon Application
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) return;

    if (validCoupons[trimmed]) {
      const c = validCoupons[trimmed];
      setAppliedCoupon({ code: c.code, amount: c.amount, type: c.type });
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try 'SKILLIANT20' or 'SAVE50'.");
    }
  };

  // Step Navigation Validators
  const handleGoToStep2 = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please select at least one course to continue.");
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToStep3 = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errors.fullName = "Legal Name is required for certificate issuance.";
    if (!formData.email.trim()) errors.email = "Email Address is required for account login.";
    if (!formData.password.trim()) errors.password = "Password is required to secure your learning portal.";

    if (Object.keys(errors).length > 0) {
      setStep2Errors(errors);
      return;
    }

    setStep2Errors({});
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToStep4 = () => {
    if (paymentMethod === "voucher" && !appliedVoucher) {
      setVoucherError("Please enter and verify your voucher code before proceeding.");
      return;
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Final Order Placement
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!formData.termsAccepted || !formData.safetyPolicyAccepted) {
      alert("Please accept the Terms of Service and Safety Drills Policy to finalize enrollment.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // If payment was completed using a single-use voucher, mark ONLY that specific voucher as redeemed!
      if (appliedVoucher) {
        redeemSingleVoucher(appliedVoucher.code, {
          name: formData.fullName,
          email: formData.email,
        });
      }

      setIsSubmitting(false);
      const generatedId = `SKL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1100);
  };

  // Order Completed Celebration View
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full rounded-3xl border border-gray-100 bg-white p-8 sm:p-12 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-purple-100 text-[#7D52F4] shadow-inner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-xs font-bold text-[#7D52F4] border border-purple-200">
            <span>Order Confirmed &bull; ID: {orderId}</span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {appliedVoucher
              ? "Enrollment Unlocked with Voucher!"
              : "Registration Successful! Welcome to Skilliant"}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
            {appliedVoucher ? (
              <>
                Your enrollment was completed using voucher code <strong className="text-[#7D52F4] font-mono">{appliedVoucher.code}</strong>
                {appliedVoucher.sponsoringOrganization ? (
                  <> ({appliedVoucher.sponsoringOrganization})</>
                ) : null}. This voucher has been recorded as redeemed. Access has been unlocked immediately.
              </>
            ) : (
              <>
                Your card payment of <strong className="text-[#7D52F4] font-extrabold">${finalTotal.toFixed(2)}</strong> was processed securely. A confirmation receipt has been sent to <strong className="text-gray-900">{formData.email}</strong>.
              </>
            )}
          </p>

          {/* Enrolled Courses Pill List */}
          <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 text-left text-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="font-bold text-gray-900">Enrolled Programs ({cartItems.length})</span>
              <span className="text-xs font-semibold text-gray-500">{cartItems.length} Program(s)</span>
            </div>
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.format}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 shrink-0">
                    ${item.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Student Name:</span>
                <span className="font-semibold text-gray-900">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Login Email:</span>
                <span className="font-semibold text-gray-900">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Channel:</span>
                <span className="font-semibold text-gray-900">
                  {appliedVoucher
                    ? `Voucher (${appliedVoucher.code} - 100% Covered)`
                    : `Credit Card (•••• ${cardData.cardNumber.slice(-4)})`}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200 font-bold text-sm">
                <span className="text-gray-900">Total Paid:</span>
                <span className={appliedVoucher ? "text-emerald-600" : "text-[#7D52F4]"}>
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#7D52F4] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
            >
              Go to Learner Dashboard →
            </Link>
            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
            >
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Steps Definition Array for Stepper Bar
  const stepsConfig = [
    { num: 1, label: "Selected Programs", shortLabel: "Programs" },
    { num: 2, label: "Learner Details", shortLabel: "Profile" },
    { num: 3, label: "Payment Method", shortLabel: "Payment" },
    { num: 4, label: "Review & Confirm", shortLabel: "Confirm" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-4 sm:pt-8">
      {/* Checkout Navigation Bar */}
      <div className="border-b border-gray-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 mb-6 py-3.5">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Logo className="h-7 w-auto" />
            </Link>
            <span className="hidden sm:inline-block text-xs font-semibold text-gray-300">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#7D52F4]">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="text-xs font-semibold text-gray-500 hover:text-[#7D52F4] transition-colors flex items-center gap-1"
            >
              <span>← Return to Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* PERSISTENT STEP INDICATOR (Always visible at top of page) */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            {stepsConfig.map((step, index) => {
              const isCompletedStep = currentStep > step.num;
              const isCurrentStep = currentStep === step.num;
              const isFutureStep = currentStep < step.num;

              return (
                <React.Fragment key={step.num}>
                  {/* Step Item */}
                  <div
                    onClick={() => {
                      // Allow jumping back to any previously completed step
                      if (step.num < currentStep) {
                        setCurrentStep(step.num as CheckoutStep);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2.5 transition-all select-none",
                      step.num < currentStep ? "cursor-pointer group" : "cursor-default"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 sm:size-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all",
                        isCurrentStep && "bg-[#7D52F4] text-white shadow-md ring-4 ring-purple-100 scale-105",
                        isCompletedStep && "bg-emerald-600 text-white group-hover:bg-emerald-700",
                        isFutureStep && "bg-gray-100 text-gray-400 border border-gray-200"
                      )}
                    >
                      {isCompletedStep ? "✓" : step.num}
                    </div>

                    <div className="hidden sm:block">
                      <p
                        className={cn(
                          "text-2xs font-bold uppercase tracking-wider",
                          isCurrentStep && "text-[#7D52F4]",
                          isCompletedStep && "text-emerald-700",
                          isFutureStep && "text-gray-400"
                        )}
                      >
                        Step {step.num}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-bold whitespace-nowrap",
                          isCurrentStep && "text-gray-900",
                          isCompletedStep && "text-gray-700 group-hover:text-gray-900",
                          isFutureStep && "text-gray-400"
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Line Between Steps */}
                  {index < stepsConfig.length - 1 && (
                    <div className="flex-1 mx-2 sm:mx-4 h-0.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          currentStep > step.num ? "bg-emerald-600 w-full" : "w-0"
                        )}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Current Step Subtitle */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex sm:hidden items-center justify-between text-xs">
            <span className="font-bold text-[#7D52F4]">
              Step {currentStep} of 4: {stepsConfig[currentStep - 1].label}
            </span>
            <span className="text-gray-400">
              {currentStep === 1 && "Next: Learner Profile"}
              {currentStep === 2 && "Next: Payment Method"}
              {currentStep === 3 && "Next: Final Review"}
              {currentStep === 4 && "Ready to complete"}
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Basket State */
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-purple-50 text-[#7D52F4]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">Your enrollment basket is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You haven&apos;t added any courses or training bundles to your cart yet. Explore our course catalog to get started.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl bg-[#7D52F4] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
              >
                Browse Course Catalog →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE STEP CONTAINER (Only current step expanded) */}
            <div className="lg:col-span-7 space-y-6">

              {/* ================= STEP 1: SELECTED PROGRAMS ================= */}
              {currentStep === 1 && (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#7D52F4] text-xs font-bold text-white">
                        1
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">
                          Review Selected Programs
                        </h2>
                        <p className="text-xs text-gray-500">Confirm your selected courses and certification tracks</p>
                      </div>
                    </div>
                    <Link
                      href="/courses"
                      className="text-xs font-semibold text-[#7D52F4] hover:underline whitespace-nowrap shrink-0"
                    >
                      + Add Course
                    </Link>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-[#7D52F4] uppercase tracking-wider">
                              {item.type === "track" ? "Skill Track Bundle" : "Certificate Course"}
                            </span>
                            <h3 className="mt-0.5 font-bold text-gray-900 text-sm sm:text-base leading-snug truncate">
                              <Link href={`/courses/${item.slug}`} className="hover:text-[#7D52F4] transition-colors">
                                {item.title}
                              </Link>
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Instructor: {item.instructor} &bull; {item.format}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-5 border-t border-gray-50 sm:border-0 pt-2 sm:pt-0">
                          {/* Price */}
                          <div className="text-right min-w-[70px]">
                            <div className="text-sm font-extrabold text-gray-900">
                              ${item.price}
                            </div>
                            {item.originalPrice > item.price && (
                              <div className="text-xs text-gray-400 line-through">
                                ${item.originalPrice}
                              </div>
                            )}
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="size-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap shrink-0"
                            title="Remove item"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step 1 Footer Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {cartItems.length} program(s) selected
                    </span>
                    <button
                      type="button"
                      onClick={handleGoToStep2}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#7D52F4] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition-colors"
                    >
                      <span>Continue to Learner Details</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: LEARNER DETAILS ================= */}
              {currentStep === 2 && (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#7D52F4] text-xs font-bold text-white">
                        2
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">
                          Learner Profile &amp; Certification Account
                        </h2>
                        <p className="text-xs text-gray-500">Accredited certificates will be issued under this legal name</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Full Legal Name (Printed on Certificate) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none transition-all",
                          step2Errors.fullName ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#7D52F4]"
                        )}
                        placeholder="e.g. Alex Mercer"
                      />
                      {step2Errors.fullName && (
                        <p className="text-xs text-red-600 mt-1">{step2Errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Email Address (LMS Login) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none transition-all",
                          step2Errors.email ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#7D52F4]"
                        )}
                        placeholder="learner@company.com"
                      />
                      {step2Errors.email && (
                        <p className="text-xs text-red-600 mt-1">{step2Errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Portal Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none transition-all",
                          step2Errors.password ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#7D52F4]"
                        )}
                        placeholder="Enter secure password"
                      />
                      {step2Errors.password && (
                        <p className="text-xs text-red-600 mt-1">{step2Errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Company / Organization <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:outline-none"
                        placeholder="e.g. Apex Industrial Logistics"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Job Role / Title <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:outline-none"
                        placeholder="e.g. Operations Specialist"
                      />
                    </div>
                  </div>

                  {/* Step 2 Footer Navigation */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      ← Back to Order Review
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToStep3}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#7D52F4] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition-colors"
                    >
                      <span>Continue to Payment Method</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: PAYMENT & FUNDING ================= */}
              {currentStep === 3 && (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#7D52F4] text-xs font-bold text-white">
                        3
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">
                          Payment Method &amp; Funding Channel
                        </h2>
                        <p className="text-xs text-gray-500">Choose how this enrollment is funded</p>
                      </div>
                    </div>
                  </div>

                  {/* 3 Payment Options */}
                  <div className="space-y-3.5">
                    
                    {/* Option 1: Voucher */}
                    <div
                      onClick={() => setPaymentMethod("voucher")}
                      className={cn(
                        "rounded-2xl border p-4 cursor-pointer transition-all",
                        paymentMethod === "voucher" || appliedVoucher
                          ? "border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "voucher" || appliedVoucher !== null}
                            onChange={() => setPaymentMethod("voucher")}
                            className="size-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-bold text-gray-900">
                            Voucher
                          </span>
                        </div>
                      </div>

                      {(paymentMethod === "voucher" || appliedVoucher) && (
                        <div className="mt-4 pt-4 border-t border-emerald-100 space-y-3 animate-in fade-in duration-150">
                          {appliedVoucher ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm">
                                  ✓
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-emerald-900">
                                    Voucher Verified: <span className="font-mono">{appliedVoucher.code}</span>
                                  </p>
                                  <p className="text-xs text-emerald-700">
                                    {appliedVoucher.sponsoringOrganization ? `${appliedVoucher.sponsoringOrganization} • ` : ""}100% Tuition Covered
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveVoucher}
                                className="rounded-lg bg-white border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap shrink-0"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={voucherInput}
                                  onChange={(e) => setVoucherInput(e.target.value)}
                                  placeholder="Enter Voucher"
                                  className="flex-1 rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-sm font-mono uppercase text-gray-800 placeholder:normal-case placeholder:font-sans focus:border-emerald-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleApplyVoucher()}
                                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0"
                                >
                                  Verify
                                </button>
                              </div>
                              {voucherError && (
                                <p className="text-xs text-red-600 font-medium">{voucherError}</p>
                              )}
                              {voucherSuccess && (
                                <p className="text-xs text-emerald-700 font-medium">{voucherSuccess}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Option 2: Credit / Debit Card (Stripe) */}
                    <div
                      onClick={() => {
                        setPaymentMethod("card");
                        if (appliedVoucher) setAppliedVoucher(null);
                      }}
                      className={cn(
                        "rounded-2xl border p-4 cursor-pointer transition-all",
                        paymentMethod === "card" && !appliedVoucher
                          ? "border-[#7D52F4] bg-purple-50/20 ring-1 ring-[#7D52F4]"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "card" && !appliedVoucher}
                            onChange={() => {
                              setPaymentMethod("card");
                              if (appliedVoucher) setAppliedVoucher(null);
                            }}
                            className="size-4 text-[#7D52F4] focus:ring-[#7D52F4]"
                          />
                          <div>
                            <span className="text-sm font-bold text-gray-900 block">
                              Credit or Debit Card
                            </span>
                            <span className="text-xs text-gray-500">
                              Instant access &bull; 256-Bit SSL Stripe Gateway
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                          <span className="rounded bg-gray-100 px-1.5 py-0.5">VISA</span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5">MC</span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5">AMEX</span>
                        </div>
                      </div>

                      {paymentMethod === "card" && !appliedVoucher && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3.5 animate-in fade-in duration-150">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                              Card Number
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cardData.cardNumber}
                                onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 font-mono focus:border-[#7D52F4] focus:outline-none"
                                placeholder="4242 4242 4242 4242"
                              />
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                                🔒 256-bit
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Expiry (MM/YY)
                              </label>
                              <input
                                type="text"
                                value={cardData.expiryDate}
                                onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 font-mono focus:border-[#7D52F4] focus:outline-none"
                                placeholder="MM / YY"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                CVC / CVV
                              </label>
                              <input
                                type="text"
                                value={cardData.cvc}
                                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 font-mono focus:border-[#7D52F4] focus:outline-none"
                                placeholder="123"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Postal / ZIP
                              </label>
                              <input
                                type="text"
                                value={cardData.zipCode}
                                onChange={(e) => setCardData({ ...cardData, zipCode: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 font-mono focus:border-[#7D52F4] focus:outline-none"
                                placeholder="60607"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              value={cardData.nameOnCard}
                              onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:outline-none"
                              placeholder="Name as it appears on card"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3 Footer Navigation */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      ← Back to Learner Info
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToStep4}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#7D52F4] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition-colors"
                    >
                      <span>Continue to Review &amp; Confirm</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: REVIEW & CONFIRM ================= */}
              {currentStep === 4 && (
                <form onSubmit={handleCompleteOrder} className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#7D52F4] text-xs font-bold text-white">
                        4
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">
                          Review &amp; Confirm Order
                        </h2>
                        <p className="text-xs text-gray-500">Please verify your information before finalizing registration</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card 1: Learner Profile */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Learner Profile</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-bold text-[#7D52F4] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <p className="font-semibold text-gray-900">{formData.fullName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <p className="font-semibold text-gray-900">{formData.email}</p>
                      </div>
                      {formData.companyName && (
                        <div>
                          <span className="text-gray-400">Organization:</span>
                          <p className="font-semibold text-gray-900">{formData.companyName}</p>
                        </div>
                      )}
                      {formData.jobTitle && (
                        <div>
                          <span className="text-gray-400">Job Title:</span>
                          <p className="font-semibold text-gray-900">{formData.jobTitle}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Card 2: Payment Funding Channel */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Funding Channel</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-xs font-bold text-[#7D52F4] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    {appliedVoucher ? (
                      <div className="flex items-center gap-3 text-xs">
                        <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          🎟️
                        </div>
                        <div>
                          <p className="font-bold text-emerald-900">
                            Voucher: <span className="font-mono">{appliedVoucher.code}</span>
                          </p>
                          <p className="text-emerald-700">
                            {appliedVoucher.sponsoringOrganization ? `${appliedVoucher.sponsoringOrganization} • ` : ""}100% Covered ($0.00 Due)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-gray-900">Credit Card ending in {cardData.cardNumber.slice(-4)}</p>
                        <p className="text-gray-600">Holder: {cardData.nameOnCard} &bull; Exp: {cardData.expiryDate}</p>
                      </div>
                    )}
                  </div>

                  {/* Policies & Compliance Checkboxes */}
                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-gray-600 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                        className="mt-0.5 size-4 rounded text-[#7D52F4] focus:ring-[#7D52F4]"
                      />
                      <span>
                        I accept the <Link href="/terms" className="text-[#7D52F4] hover:underline font-semibold">Terms of Service</Link> and agree to the <Link href="/privacy" className="text-[#7D52F4] hover:underline font-semibold">Privacy Policy</Link>.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.safetyPolicyAccepted}
                        onChange={(e) => setFormData({ ...formData, safetyPolicyAccepted: e.target.checked })}
                        className="mt-0.5 size-4 rounded text-[#7D52F4] focus:ring-[#7D52F4]"
                      />
                      <span>
                        I confirm that official completion certificates require passing practical competency drill benchmarks and zero-fault inspections.
                      </span>
                    </label>
                  </div>

                  {/* Step 4 Footer Actions */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap shrink-0"
                    >
                      ← Back to Payment
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all whitespace-nowrap shrink-0",
                        appliedVoucher
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-[#7D52F4] hover:bg-purple-700",
                        isSubmitting && "opacity-50"
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="size-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Processing...</span>
                        </span>
                      ) : appliedVoucher ? (
                        <span>Redeem Voucher &amp; Unlock Access ($0.00) ✓</span>
                      ) : (
                        <span>Pay ${finalTotal.toFixed(2)} &amp; Complete Enrollment 🔒</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY (Remains visible throughout all steps) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-base font-bold text-gray-900">
                    Order Summary
                  </h3>
                  <span className="text-xs font-semibold text-gray-500">
                    {cartItems.length} Program(s)
                  </span>
                </div>

                {/* Compact Line Items */}
                <div className="divide-y divide-gray-50 py-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.format}</p>
                      </div>
                      <span className="font-extrabold text-gray-900 shrink-0">
                        ${item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promotional Coupon Input (Only visible when voucher not applied) */}
                {!appliedVoucher && (
                  <div className="border-t border-gray-100 pt-3.5 pb-2">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. SKILLIANT20)..."
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                    {couponError && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
                        <span>✓ Coupon &ldquo;{appliedCoupon.code}&rdquo; applied!</span>
                        <button
                          type="button"
                          onClick={() => setAppliedCoupon(null)}
                          className="text-gray-500 hover:text-red-600 text-xs underline whitespace-nowrap shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Financial Breakdown */}
                <div className="border-t border-gray-100 pt-3.5 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {catalogSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Catalog Savings</span>
                      <span>-${catalogSavings.toFixed(2)}</span>
                    </div>
                  )}

                  {appliedVoucher && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                      <div>
                        <span>Voucher</span>
                        <p className="text-[11px] font-normal text-emerald-800">
                          {appliedVoucher.code}{appliedVoucher.sponsoringOrganization ? ` • ${appliedVoucher.sponsoringOrganization}` : ""} (100% Covered)
                        </p>
                      </div>
                      <span>-${subtotal.toFixed(2)}</span>
                    </div>
                  )}

                  {!appliedVoucher && appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Promotional Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500">
                    <span>Taxes &amp; Processing</span>
                    <span>$0.00 (Included)</span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm font-bold text-gray-900">Total Amount Due</span>
                    <span className={cn(
                      "text-2xl font-extrabold",
                      appliedVoucher ? "text-emerald-600" : "text-[#7D52F4]"
                    )}>
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Active Step Progress Pill */}
                <div className="mt-5 rounded-xl bg-purple-50/70 border border-purple-100 p-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-900">
                    Step {currentStep} of 4: {stepsConfig[currentStep - 1].label}
                  </span>
                  <span className="text-[#7D52F4] font-bold">
                    {Math.round((currentStep / 4) * 100)}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
