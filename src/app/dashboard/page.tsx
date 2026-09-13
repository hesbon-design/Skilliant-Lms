"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bolt,
  BookOpen,
  Bulb,
  Certificate,
  ChevronDown,
  Clock,
  DashboardIcon,
  FileAlt,
  Logo,
  LogoutIcon,
  Pencil,
  QuestionMarkCircle,
  Setting,
  Telephone,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

type TabKey =
  | "overview"
  | "courses"
  | "quizzes"
  | "certifications"
  | "settings"
  | "support"
  | "announcements"
  | "discussions"
  | "live-classes"
  | "analytics";

function DashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get("tab") as TabKey) || "overview";
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [courseFilter, setCourseFilter] = useState<"overview" | "ongoing" | "completed">("overview");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(1);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Settings mock state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "anonymous",
    lastName: "designer",
    profession: "-",
    email: "anonymousdesigner730@gmail.com",
    bio: "-",
  });

  const [addressInfo, setAddressInfo] = useState({
    country: "-",
    cityState: "-",
    postalCode: "-",
    road: "-",
  });

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);


  const menuItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <DashboardIcon className="size-5" /> },
    { key: "courses", label: "My course", icon: <BookOpen className="size-5" /> },
    { key: "quizzes", label: "Quizzes", icon: <Bulb className="size-5" /> },
    { key: "certifications", label: "Certifications", icon: <Certificate className="size-5" /> },
    { key: "settings", label: "Settings", icon: <Setting className="size-5" /> },
    { key: "support", label: "Support & Help", icon: <QuestionMarkCircle /> },
  ];

  const faqItems = [
    {
      id: 1,
      question: "1. How Do I Enroll In A Course?",
      answer:
        "Simply browse our course catalog, select your preferred course, and click “Enroll Now.” You can securely complete your purchase online and start learning instantly.",
    },
    {
      id: 2,
      question: "2. Do I Get Lifetime Access To The Courses?",
      answer:
        "Yes! Once enrolled in any course on Skillsaint, you receive lifetime access to all lessons, downloadable resources, and all future updates.",
    },
    {
      id: 3,
      question: "3. Are There Any Prerequisites To Start Learning?",
      answer:
        "Most beginner courses require no prior experience. Advanced courses will explicitly list recommended prerequisites directly on their course overview page.",
    },
    {
      id: 4,
      question: "4. Will I Get A Certificate After Completing A Course?",
      answer:
        "Yes, upon completing 100% of the lessons and required quizzes in a qualifying course, your official certificate will automatically be issued in the Certifications tab.",
    },
    {
      id: 5,
      question: "5. Can I Learn From My Mobile Or Tablet?",
      answer:
        "Absolutely. Skillsaint is designed to run seamlessly on mobile, tablet, and desktop browsers so you can learn anywhere, anytime.",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-12 space-y-8">

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, Nolan! Ready to continue learning?
              </p>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {/* Stat 1 */}
              <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <BookOpen className="size-5" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">2</h3>
                  <p className="mt-1 text-sm text-gray-500">Courses in Progress</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Clock className="size-5" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">14 h</h3>
                  <p className="mt-1 text-sm text-gray-500">Total Hours Learned</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Certificate className="size-5" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">1</h3>
                  <p className="mt-1 text-sm text-gray-500">Certificates Earned</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Bolt className="size-5" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">50%</h3>
                  <p className="mt-1 text-sm text-gray-500">Average Progress</p>
                </div>
              </div>
            </div>

            {/* Middle Split Row: Enrolled Courses & Recent Activity */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7 shadow-xs">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">
                      Enrolled Courses (3)
                    </h2>
                    <Link
                      href="/dashboard/courses"
                      className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-xl border border-gray-100 p-3.5 hover:border-purple-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">In Progress</span>
                          <h4 className="text-sm font-bold text-gray-900 mt-0.5">Secret Tips Behind Perfect Diet &amp; Meal Plan</h4>
                          <p className="text-sm text-gray-500 mt-0.5">Sarah Jenkins, RD</p>
                        </div>
                        <Link
                          href="/learn/secret-tips-behind-perfect-diet-meal-plan"
                          className="self-start sm:self-auto shrink-0 rounded-lg bg-purple-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                        >
                          Resume →
                        </Link>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-purple-600 w-[33%]" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">33%</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-3.5 hover:border-purple-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-green-700">✓ Completed</span>
                          <h4 className="text-sm font-bold text-gray-900 mt-0.5">JavaScript Mastery</h4>
                          <p className="text-sm text-gray-500 mt-0.5">Michael Lee</p>
                        </div>
                        <Link
                          href="/learn/javascript-mastery"
                          className="self-start sm:self-auto shrink-0 rounded-lg bg-purple-50 px-3.5 py-1.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                        >
                          Review →
                        </Link>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-green-500 w-[100%]" />
                        </div>
                        <span className="text-sm font-semibold text-green-700">100%</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-3.5 hover:border-purple-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">In Progress</span>
                          <h4 className="text-sm font-bold text-gray-900 mt-0.5">Freelance Business Launchpad</h4>
                          <p className="text-sm text-gray-500 mt-0.5">Marcus Vance</p>
                        </div>
                        <Link
                          href="/learn/freelance-business-launchpad"
                          className="self-start sm:self-auto shrink-0 rounded-lg bg-purple-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                        >
                          Resume →
                        </Link>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-purple-600 w-[17%]" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">17%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-start gap-3 rounded-xl bg-gray-50/70 p-3 text-sm">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 font-bold">✓</span>
                      <div>
                        <p className="font-semibold text-gray-800">Completed JavaScript Mastery course</p>
                        <p className="text-sm text-gray-500 mt-0.5">Yesterday • Earned Certificate SKL-JS-94819</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-gray-50/70 p-3 text-sm">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">📝</span>
                      <div>
                        <p className="font-semibold text-gray-800">Passed Functions &amp; Scope Quiz (92%)</p>
                        <p className="text-sm text-gray-500 mt-0.5">2 days ago • JavaScript Mastery</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-gray-50/70 p-3 text-sm">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">📤</span>
                      <div>
                        <p className="font-semibold text-gray-800">Submitted Assignment for Review</p>
                        <p className="text-sm text-gray-500 mt-0.5">4 days ago • Freelance Business Launchpad</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Certificates */}
            <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Certificates &amp; Awards
                </h2>
                <Link
                  href="/dashboard/certificates"
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  Manage Certificates →
                </Link>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-purple-100 bg-purple-50/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-lg">
                    🎓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">JavaScript Mastery — Official Credential</h4>
                    <p className="text-sm text-gray-500 mt-0.5">ID: SKL-JS-94819 • Awarded September 12, 2026</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/certificates"
                  className="rounded-lg bg-purple-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                >
                  View Credential
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MY COURSE ================= */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  My Enrolled Courses
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  All your active and completed courses in one place.
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
              >
                Browse Catalog →
              </Link>
            </div>

            {/* Filter pills matching screenshot */}
            <div className="inline-flex rounded-2xl bg-white p-1 border border-gray-100 shadow-xs">
              {(["overview", "ongoing", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCourseFilter(tab)}
                  className={cn(
                    "rounded-xl px-5 py-2 text-sm font-medium capitalize transition-colors",
                    courseFilter === tab
                      ? "bg-purple-50 text-purple-600 font-semibold"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: "1",
                  slug: "secret-tips-behind-perfect-diet-meal-plan",
                  title: "Secret Tips Behind Perfect Diet & Meal Plan",
                  instructor: "Sarah Jenkins, RD",
                  progress: 33,
                  status: "ongoing",
                  thumbnail: "/images/courses/course-01.jpg",
                },
                {
                  id: "2",
                  slug: "javascript-mastery",
                  title: "JavaScript Mastery",
                  instructor: "Michael Lee",
                  progress: 100,
                  status: "completed",
                  thumbnail: "/images/courses/course-02.jpg",
                },
                {
                  id: "3",
                  slug: "freelance-business-launchpad",
                  title: "Freelance Business Launchpad",
                  instructor: "Marcus Vance",
                  progress: 17,
                  status: "ongoing",
                  thumbnail: "/images/courses/course-03.jpg",
                },
              ]
                .filter((c) => {
                  if (courseFilter === "ongoing") return c.status === "ongoing";
                  if (courseFilter === "completed") return c.status === "completed";
                  return true;
                })
                .map((course) => (
                  <div
                    key={course.id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                          course.status === "completed" ? "bg-green-50 text-green-700" : "bg-purple-50 text-purple-700"
                        )}>
                          {course.status === "completed" ? "Completed" : "In Progress"}
                        </span>
                        <span className="text-gray-700 font-semibold">{course.progress}%</span>
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">Instructor: {course.instructor}</p>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", course.status === "completed" ? "bg-green-500" : "bg-purple-600")}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50">
                      <Link
                        href={`/learn/${course.slug}`}
                        className="block w-full rounded-xl bg-purple-600 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                      >
                        {course.status === "completed" ? "Review Course →" : "Continue Learning →"}
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: QUIZZES ================= */}
        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Quizzes
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Test your knowledge and track your progress
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500">
                No quizzes found in your enrolled courses.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CERTIFICATIONS ================= */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Certification
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Your completed courses and earned certificates.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500">
                No certificates available yet.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your profile information and preferences.
              </p>
            </div>

            {/* My Profile */}
            <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
              <h2 className="text-base font-semibold text-gray-900">
                My Profile
              </h2>
              <div className="mt-6 flex items-center gap-5">
                <div className="relative">
                  <div className="size-16 rounded-full bg-gray-900 overflow-hidden flex items-center justify-center">
                    <Image
                      src="/images/instructor/avatar.png"
                      alt="Avatar"
                      width={64}
                      height={64}
                      className="size-full object-cover"
                    />
                  </div>
                  <button
                    title="Change Photo"
                    className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 shadow-xs hover:bg-gray-50"
                  >
                    <Pencil className="size-3" />
                  </button>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    anonymous designer
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Profession &nbsp;|&nbsp; City, Country
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-purple-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <Pencil className="size-3" />
                  <span>{isEditingPersonal ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              {isEditingPersonal ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsEditingPersonal(false);
                  }}
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last name</label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Profession</label>
                    <input
                      type="text"
                      value={personalInfo.profession}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, profession: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, email: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="mt-1 font-medium text-gray-800">{personalInfo.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last name</p>
                    <p className="mt-1 font-medium text-gray-800">{personalInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Profession</p>
                    <p className="mt-1 font-medium text-gray-800">{personalInfo.profession}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 font-medium text-gray-800">{personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                    <p className="mt-1 font-medium text-gray-800">{personalInfo.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Address
                </h2>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-purple-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <Pencil className="size-3" />
                  <span>{isEditingAddress ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              {isEditingAddress ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsEditingAddress(false);
                  }}
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={addressInfo.country}
                      onChange={(e) =>
                        setAddressInfo({ ...addressInfo, country: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">City/State</label>
                    <input
                      type="text"
                      value={addressInfo.cityState}
                      onChange={(e) =>
                        setAddressInfo({ ...addressInfo, cityState: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      value={addressInfo.postalCode}
                      onChange={(e) =>
                        setAddressInfo({ ...addressInfo, postalCode: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Road</label>
                    <input
                      type="text"
                      value={addressInfo.road}
                      onChange={(e) =>
                        setAddressInfo({ ...addressInfo, road: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p className="mt-1 font-medium text-gray-800">{addressInfo.country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">City/State</p>
                    <p className="mt-1 font-medium text-gray-800">{addressInfo.cityState}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Postal Code</p>
                    <p className="mt-1 font-medium text-gray-800">{addressInfo.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Road</p>
                    <p className="mt-1 font-medium text-gray-800">{addressInfo.road}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SUPPORT & HELP ================= */}
        {activeTab === "support" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Support & Help
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Reach out for help or guidance anytime.
              </p>
            </div>

            {/* Top 3 Cards */}
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-transform hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <QuestionMarkCircle />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">FAQs</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Find answers to commonly asked questions
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-transform hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Telephone />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">Contact Us</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get in touch with our support team
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-transform hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <FileAlt className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">Documentation</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse our help documentation
                </p>
              </div>
            </div>

            {/* Split row: Submit Support Ticket + Common Help Topics */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Submit Ticket */}
              <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
                <h2 className="text-base font-semibold text-gray-900">
                  Submit a Support Ticket
                </h2>

                {ticketSubmitted ? (
                  <div className="mt-6 rounded-xl bg-purple-50 p-6 text-center text-purple-700">
                    <p className="font-semibold">Ticket Submitted Successfully!</p>
                    <p className="mt-1 text-sm">Our support team will respond within 24 hours.</p>
                    <button
                      onClick={() => setTicketSubmitted(false)}
                      className="mt-4 text-sm font-semibold underline"
                    >
                      Submit another ticket
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setTicketSubmitted(true);
                    }}
                    className="mt-6 space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Brief description of your issue"
                        className="mt-1.5 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          required
                          defaultValue=""
                          className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-purple-300 focus:outline-none"
                        >
                          <option value="" disabled>
                            Select A Category
                          </option>
                          <option value="account">Account & Login</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="course">Course Content</option>
                          <option value="technical">Technical Glitch</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Enter your message here..."
                        className="mt-1.5 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                    >
                      Submit Now
                    </button>
                  </form>
                )}
              </div>

              {/* Common Help Topics */}
              <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
                <h2 className="text-base font-semibold text-gray-900">
                  Common Help Topics
                </h2>

                <div className="mt-6 space-y-3">
                  {faqItems.map((faq) => {
                    const isOpen = expandedFaq === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4 transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                          className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-900"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={cn(
                              "size-4 shrink-0 text-gray-400 transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-3 text-sm leading-relaxed text-gray-600">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: ANNOUNCEMENTS ================= */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Announcements
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Important updates, course news, and community broadcasts.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600 font-bold shrink-0">
                  📢
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                      System
                    </span>
                    <span className="text-sm text-gray-500">September 12, 2026</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900">
                    Welcome to the new Skilliant Student Portal!
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    We have updated the student dashboard with course player, interactive quiz engine, assignment submission tools, and downloadable certifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: DISCUSSIONS ================= */}
        {activeTab === "discussions" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Discussions
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Connect with fellow learners and instructors.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
                💬
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">No active discussions</h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                You haven&apos;t joined any discussion channels yet. Check your enrolled courses to start interacting with peers!
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 9: LIVE CLASSES ================= */}
        {activeTab === "live-classes" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Live Classes
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Join scheduled webinars and live tutoring sessions.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
                📹
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">No live classes scheduled</h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Your enrolled courses do not have upcoming live sessions this week. Check back soon for new webinar announcements.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 10: ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Learning Analytics
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your study habits, retention rate, and milestones.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <p className="text-sm font-semibold text-gray-700">Weekly Goal</p>
                <h4 className="mt-2 text-2xl font-bold text-gray-900">3 / 5 hrs</h4>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full w-3/5 rounded-full bg-purple-600" />
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <p className="text-sm font-semibold text-gray-700">Quiz Accuracy</p>
                <h4 className="mt-2 text-2xl font-bold text-gray-900">85%</h4>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full w-[85%] rounded-full bg-green-500" />
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                <p className="text-sm font-semibold text-gray-700">Streak</p>
                <h4 className="mt-2 text-2xl font-bold text-gray-900">4 Days 🔥</h4>
                <p className="mt-2 text-sm text-gray-500">Keep it going tomorrow!</p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading student dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

