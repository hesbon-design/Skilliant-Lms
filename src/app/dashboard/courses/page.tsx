"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Student enrolled course data model
export interface EnrolledCourse {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  enrolledDate: string;
  thumbnail: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: "in_progress" | "completed";
  lastAccessed: string;
  nextLessonTitle?: string;
  category: string;
}

const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: "enrolled-1",
    slug: "secret-tips-behind-perfect-diet-meal-plan",
    title: "Secret Tips Behind Perfect Diet & Meal Plan",
    instructor: "Sarah Jenkins, RD",
    enrolledDate: "June 22, 2026",
    thumbnail: "/images/courses/course-01.jpg",
    progress: 33,
    completedLessons: 4,
    totalLessons: 12,
    status: "in_progress",
    lastAccessed: "2 days ago",
    nextLessonTitle: "Module 2: Calculating Basal Metabolic Rate",
    category: "Health & Nutrition",
  },
  {
    id: "enrolled-2",
    slug: "javascript-mastery",
    title: "JavaScript Mastery",
    instructor: "Michael Lee",
    enrolledDate: "June 18, 2026",
    thumbnail: "/images/courses/course-02.jpg",
    progress: 100,
    completedLessons: 28,
    totalLessons: 28,
    status: "completed",
    lastAccessed: "Yesterday",
    nextLessonTitle: "All Lessons Completed — Claim Credential",
    category: "Software Development",
  },
  {
    id: "enrolled-3",
    slug: "freelance-business-launchpad",
    title: "Freelance Business Launchpad",
    instructor: "Marcus Vance",
    enrolledDate: "June 16, 2026",
    thumbnail: "/images/courses/course-03.jpg",
    progress: 17,
    completedLessons: 3,
    totalLessons: 18,
    status: "in_progress",
    lastAccessed: "4 days ago",
    nextLessonTitle: "Module 1: Positioning Your Service Offering",
    category: "Business & Career",
  },
];

// SVG Icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const GraduationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const TicketIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

const CheckCircleIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const CloseIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface VerifiedVoucherData {
  code: string;
  programTitle: string;
  sponsoredBy: string;
  slug: string;
  instructor: string;
  thumbnail: string;
  category: string;
  lessonsCount: number;
  value: number;
}

export default function DashboardCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>(mockEnrolledCourses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "in_progress" | "completed">("all");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "progress">("recent");

  // Voucher Redemption Flow State
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedVoucher, setVerifiedVoucher] = useState<VerifiedVoucherData | null>(null);
  const [redeemedBanner, setRedeemedBanner] = useState<{
    title: string;
    sponsor: string;
    slug: string;
  } | null>(null);

  const handleVerifyVoucher = (codeToVerify?: string) => {
    setVoucherError("");
    const targetCode = (codeToVerify || voucherInput).trim().toUpperCase();
    if (!targetCode) {
      setVoucherError("Please enter a voucher code.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (targetCode === "SKL-APEX-2026") {
        setVerifiedVoucher({
          code: "SKL-APEX-2026",
          programTitle: "Industrial Machine Operator Track",
          sponsoredBy: "Apex Industrial Logistics",
          slug: "nextjs-fullstack-bootcamp",
          instructor: "Michael Lee, Certified Equipment Inspector",
          thumbnail: "/images/courses/img-2.png",
          category: "Heavy Machinery",
          lessonsCount: 32,
          value: 450,
        });
      } else if (targetCode === "VOUCHER-DEV-100") {
        setVerifiedVoucher({
          code: "VOUCHER-DEV-100",
          programTitle: "Complete React Developer Course",
          sponsoredBy: "TechCorp Global Academy",
          slug: "complete-react-developer",
          instructor: "John Doe",
          thumbnail: "/images/courses/img-1.png",
          category: "Software Development",
          lessonsCount: 24,
          value: 120,
        });
      } else if (targetCode === "APEX-FL-FREE") {
        setVerifiedVoucher({
          code: "APEX-FL-FREE",
          programTitle: "Forklift Safety & Zero-Fault Inspection",
          sponsoredBy: "Apex Industrial Logistics",
          slug: "commercial-fleet-driving",
          instructor: "Capt. Marcus Vance",
          thumbnail: "/images/courses/course-01.jpg",
          category: "Fleet Logistics",
          lessonsCount: 16,
          value: 200,
        });
      } else if (targetCode.startsWith("SKL-") || targetCode.startsWith("VOUCH-")) {
        setVerifiedVoucher({
          code: targetCode,
          programTitle: "Commercial Fleet Driving & Advanced Hazard Overtraining",
          sponsoredBy: "Enterprise Training Partner",
          slug: "secret-tips-behind-perfect-diet-meal-plan",
          instructor: "Capt. Marcus Vance, Master Fleet Director",
          thumbnail: "/images/courses/course-01.jpg",
          category: "Driving School",
          lessonsCount: 20,
          value: 350,
        });
      } else {
        setVoucherError("Invalid or expired voucher code. Try demo voucher: SKL-APEX-2026 or VOUCHER-DEV-100");
      }
    }, 350);
  };

  const handleClaimVoucher = () => {
    if (!verifiedVoucher) return;

    const alreadyEnrolled = courses.some(
      (c) => c.slug === verifiedVoucher.slug || c.title === verifiedVoucher.programTitle
    );

    if (alreadyEnrolled) {
      setVoucherError("You are already enrolled in this course. Access it from your dashboard.");
      return;
    }

    const newEnrolledCourse: EnrolledCourse = {
      id: `enrolled-${Date.now()}`,
      slug: verifiedVoucher.slug,
      title: verifiedVoucher.programTitle,
      instructor: verifiedVoucher.instructor,
      enrolledDate: "Today",
      thumbnail: verifiedVoucher.thumbnail,
      progress: 0,
      completedLessons: 0,
      totalLessons: verifiedVoucher.lessonsCount,
      status: "in_progress",
      lastAccessed: "Just now",
      nextLessonTitle: "Module 1: Getting Started & Course Overview",
      category: verifiedVoucher.category,
    };

    setCourses((prev) => [newEnrolledCourse, ...prev]);
    setRedeemedBanner({
      title: verifiedVoucher.programTitle,
      sponsor: verifiedVoucher.sponsoredBy,
      slug: verifiedVoucher.slug,
    });
    setIsVoucherModalOpen(false);
    setVerifiedVoucher(null);
    setVoucherInput("");
  };

  // Filtering & Sorting
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesStatus =
          statusFilter === "all" || course.status === statusFilter;
        const matchesSearch =
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.instructor.toLowerCase().includes(search.toLowerCase()) ||
          course.category.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "progress") return b.progress - a.progress;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [courses, search, statusFilter, sortBy]);

  const inProgressCount = courses.filter((c) => c.status === "in_progress").length;
  const completedCount = courses.filter((c) => c.status === "completed").length;

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Enrolled Courses
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your progress, resume ongoing lessons, and review completed course materials.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setIsVoucherModalOpen(true);
              setVoucherInput("");
              setVoucherError("");
              setVerifiedVoucher(null);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-2xs hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
          >
            <TicketIcon className="size-4" />
            <span className="whitespace-nowrap shrink-0">Redeem a Voucher</span>
          </button>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-2xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap shrink-0">Explore More Courses</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Redeemed Voucher Success Banner */}
      {redeemedBanner && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-purple-50 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
              <CheckCircleIcon className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Voucher Redeemed Successfully!
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                You have been enrolled in <strong className="text-gray-900">{redeemedBanner.title}</strong> sponsored by <strong className="text-purple-700">{redeemedBanner.sponsor}</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href={`/learn/${redeemedBanner.slug}`}
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
            >
              Start Learning Now →
            </Link>
            <button
              onClick={() => setRedeemedBanner(null)}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* When student has ZERO enrolled courses: Full Empty State */}
      {courses.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 sm:p-16 text-center shadow-xs">
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-purple-50 text-purple-600 text-4xl shadow-xs">
            🎓
          </div>
          <h2 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
            You Haven&apos;t Enrolled in Any Courses Yet
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500 leading-relaxed">
            Discover hundreds of expert-led courses in web development, design, marketing, and business.
            Enroll today to get lifetime access to video lessons, interactive quizzes, and verified certificates.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsVoucherModalOpen(true);
                setVoucherInput("");
                setVoucherError("");
                setVerifiedVoucher(null);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 shadow-2xs hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
            >
              <TicketIcon className="size-4" />
              <span className="whitespace-nowrap shrink-0">Redeem a Voucher</span>
            </button>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap shrink-0">Browse Courses Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Controls Bar: Filter Pills + Search + Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            {/* Filter Pills */}
            <div className="inline-flex rounded-xl bg-gray-100 p-1 text-sm font-semibold self-start">
              <button
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition-all",
                  statusFilter === "all"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                All Enrolled ({courses.length})
              </button>
              <button
                onClick={() => setStatusFilter("in_progress")}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition-all",
                  statusFilter === "in_progress"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                In Progress ({inProgressCount})
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition-all",
                  statusFilter === "completed"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Completed ({completedCount})
              </button>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search enrolled courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "title" | "progress")}
                  className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-300 focus:outline-none"
                >
                  <option value="recent">Recently Enrolled</option>
                  <option value="title">Course Title (A-Z)</option>
                  <option value="progress">Progress (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group flex flex-col justify-between rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-xs hover:border-purple-200 hover:shadow-md transition-all"
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        {course.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-xs">
                            ✓ Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-xs">
                            In Progress ({course.progress}%)
                          </span>
                        )}
                      </div>

                      {/* Enrolled date overlay */}
                      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white/90 text-sm font-medium drop-shadow-xs">
                        <CalendarIcon />
                        <span>Enrolled {course.enrolledDate}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                          {course.category}
                        </span>
                        <span>Active {course.lastAccessed}</span>
                      </div>

                      <h3 className="mt-2 text-base font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </h3>

                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
                        <GraduationIcon />
                        <span>Instructor: <strong className="text-gray-700 font-medium">{course.instructor}</strong></span>
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span className="text-gray-600">
                            {course.completedLessons} of {course.totalLessons} Lessons
                          </span>
                          <span className={cn(course.status === "completed" ? "text-green-600" : "text-purple-600")}>
                            {course.progress}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={cn(
                               "h-full rounded-full transition-all duration-500",
                              course.status === "completed" ? "bg-green-500" : "bg-purple-600"
                            )}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {course.nextLessonTitle && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-1">
                          <strong className="font-semibold text-gray-700">Next:</strong> {course.nextLessonTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0">
                    <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                      {course.status === "completed" ? (
                        <div className="flex gap-2">
                          <Link
                            href={`/learn/${course.slug}`}
                            className="flex-1 rounded-xl bg-purple-600 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                          >
                            Review Course →
                          </Link>
                          <Link
                            href="/dashboard/certificates"
                            className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2.5 text-center text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                            title="View Certificate"
                          >
                            📜 Certificate
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/learn/${course.slug}`}
                          className="w-full rounded-xl bg-purple-600 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>Continue Learning</span>
                          <span>→</span>
                        </Link>
                      )}

                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-center text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors py-1"
                      >
                        View Course Syllabus &amp; Info
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Search filter yielding no results */
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-base font-bold text-gray-900">No enrolled courses match your filter</p>
              <p className="mt-1 text-sm text-gray-500">
                Try searching for a different course title or clear your active filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-4 rounded-xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-100 transition-colors"
              >
                Clear Search &amp; Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Redeem Voucher Interactive Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-2xs">
                  <TicketIcon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Redeem a Voucher
                  </h3>
                  <p className="text-xs text-gray-500">
                    Unlock sponsored courses with zero personal tuition
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVoucherModalOpen(false);
                  setVerifiedVoucher(null);
                  setVoucherError("");
                }}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4">
              {!verifiedVoucher ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyVoucher();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Enter Voucher Code
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="e.g. SKL-APEX-2026"
                          value={voucherInput}
                          onChange={(e) => {
                            setVoucherInput(e.target.value.toUpperCase());
                            if (voucherError) setVoucherError("");
                          }}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-gray-900 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                          autoFocus
                        />
                        {voucherInput && (
                          <button
                            type="button"
                            onClick={() => setVoucherInput("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifying || !voucherInput.trim()}
                        className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs hover:bg-purple-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                      >
                        {isVerifying ? "Verifying..." : "Verify Code"}
                      </button>
                    </div>

                    {voucherError && (
                      <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1.5">
                        <span>⚠</span> {voucherError}
                      </p>
                    )}
                  </div>

                  {/* Quick Sample Vouchers */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-600">
                      Sample Vouchers (Click to autofill):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: "SKL-APEX-2026", label: "Heavy Machinery Track" },
                        { code: "VOUCHER-DEV-100", label: "React Developer Bootcamp" },
                        { code: "APEX-FL-FREE", label: "Forklift Safety Inspection" },
                      ].map((v) => (
                        <button
                          key={v.code}
                          type="button"
                          onClick={() => {
                            setVoucherInput(v.code);
                            handleVerifyVoucher(v.code);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
                        >
                          <span>{v.code}</span>
                          <span className="text-gray-400 font-normal font-sans text-[11px]">({v.label})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              ) : (
                /* Voucher Verified Preview Card */
                <div className="space-y-4">
                  <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
                        <CheckCircleIcon className="size-3.5" />
                        <span>Valid Voucher Verified</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-purple-700 bg-white px-2.5 py-1 rounded-md border border-purple-200 shadow-2xs">
                        {verifiedVoucher.code}
                      </span>
                    </div>

                    <div>
                      <span className="inline-block rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">
                        {verifiedVoucher.category}
                      </span>
                      <h4 className="text-base font-bold text-gray-900">
                        {verifiedVoucher.programTitle}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Instructor: {verifiedVoucher.instructor} • {verifiedVoucher.lessonsCount} Modules
                      </p>
                    </div>

                    <div className="border-t border-purple-200/60 pt-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-gray-500">Sponsoring Organization:</span>
                        <p className="font-semibold text-gray-900">{verifiedVoucher.sponsoredBy}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500">Student Balance:</span>
                        <p className="font-bold text-green-600 text-sm">$0.00 (100% Covered)</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVerifiedVoucher(null);
                        setVoucherError("");
                      }}
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                    >
                      Use Different Code
                    </button>
                    <button
                      type="button"
                      onClick={handleClaimVoucher}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Claim &amp; Enroll Course</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
