"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getCoursePlayerData } from "@/data/coursePlayerData";

// Checkmark icon for What You'll Learn
const CheckIcon = () => (
  <svg
    className="size-4 shrink-0 text-purple-600 mt-0.5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg className="size-3.5 text-gray-400" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const StarOutlineIcon = () => (
  <svg className="size-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

export default function CourseInfoPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  // Fallback defaults matching design screenshot if specific courseInfo isn't defined
  const info = course.courseInfo || {
    lastUpdated: "June 16, 2026 5:44 pm",
    author: "hesbonombati",
    authorInitial: "H",
    about:
      "Going freelance is more than just having a skill — it's knowing how to sell it, price it, and sustain it. This course walks you through finding your niche, landing your first clients, writing winning proposals, and running your business like a pro. Practical, no-fluff, and built for people who want to start earning on their own terms.",
    whatYoullLearn: [
      "Identify and validate a profitable freelance niche",
      "Build a portfolio even without prior client work",
      "Find and approach potential clients with confidence",
      "Write proposals that focus on client outcomes",
      "Set rates, write contracts, and manage payments professionally",
    ],
    instructors: [{ name: "hesbonombati", initial: "H", role: "Instructor" }],
    categories: "Business",
    level: "Beginner",
    rating: 0.0,
    resourcesCount: `${course.resources?.length ?? 0} Files`,
    materials: [
      "Proposal template (Word doc)",
      "Freelance rate calculator (Google Sheets)",
      "Client onboarding checklist",
    ],
    requirements: [
      "No prior freelance experience needed",
      "Have a specific skill in mind before starting (writing, design, development, etc.)",
      "A LinkedIn profile is recommended but not required",
    ],
    audience: [
      "People looking to start freelancing from scratch",
      "Employed professionals wanting to build a side income",
      "Recent graduates exploring non-traditional career paths",
    ],
    certificate: "You will receive certificate on completion",
  };

  return (
    <div className="h-full overflow-y-auto bg-white px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Banner Mockup matching course info.png */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-8 text-white shadow-sm border border-purple-100/20">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-block rounded-md bg-purple-500/30 px-2.5 py-1 text-xs font-semibold tracking-wide text-purple-200 uppercase backdrop-blur-xs">
              Official Masterclass
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              {course.title}
            </h1>
            <p className="text-sm text-purple-200 font-medium">
              Start. Grow. Succeed. Your Professional Journey
            </p>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/10 blur-2xl" />
        </div>

        {/* Title, Date & Author header matching screenshot */}
        <div className="text-center space-y-2 py-2">
          <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <CalendarIcon />
            <span>{info.lastUpdated} Last Updated</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {course.title}
          </h2>
          <p className="text-sm text-gray-600">
            by{" "}
            <span className="font-semibold text-purple-700 hover:underline cursor-pointer">
              {info.author}
            </span>
          </p>
        </div>

        {/* About this Course card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-gray-900">About this Course</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            {info.about}
          </p>
        </div>

        {/* What you'll learn card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900">What you&apos;ll learn</h3>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-gray-700">
            {info.whatYoullLearn.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckIcon />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Structured Table matching screenshot */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-2xs overflow-hidden text-sm">
          <div className="divide-y divide-gray-100">
            {/* Instructors */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-center gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2">
                <span className="text-gray-400">👤</span>
                <span>Instructors</span>
              </div>
              <div className="sm:col-span-8 flex items-center gap-3">
                {info.instructors.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                      {inst.initial}
                    </div>
                    <span className="font-semibold text-gray-900">{inst.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-center gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2">
                <span className="text-gray-400">🗂</span>
                <span>Categories</span>
              </div>
              <div className="sm:col-span-8 text-gray-700 font-medium">
                {info.categories}
              </div>
            </div>

            {/* Level */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-center gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2">
                <span className="text-gray-400">📶</span>
                <span>Level</span>
              </div>
              <div className="sm:col-span-8 text-gray-700 font-medium">
                {info.level}
              </div>
            </div>

            {/* Student Ratings */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-center gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2">
                <span className="text-gray-400">⭐</span>
                <span>Student Ratings</span>
              </div>
              <div className="sm:col-span-8 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <StarOutlineIcon />
                  <StarOutlineIcon />
                  <StarOutlineIcon />
                  <StarOutlineIcon />
                  <StarOutlineIcon />
                </div>
                <span className="font-semibold text-gray-700">{info.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-center gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2">
                <span className="text-gray-400">📁</span>
                <span>Resources</span>
              </div>
              <div className="sm:col-span-8 text-gray-700 font-medium">
                {info.resourcesCount}
              </div>
            </div>

            {/* Materials */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-start gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2 pt-1">
                <span className="text-gray-400">📦</span>
                <span>Materials</span>
              </div>
              <div className="sm:col-span-8">
                <ul className="list-disc ml-4 space-y-1.5 text-gray-600">
                  {info.materials.map((mat, i) => (
                    <li key={i}>{mat}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-start gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2 pt-1">
                <span className="text-gray-400">📋</span>
                <span>Requirements</span>
              </div>
              <div className="sm:col-span-8">
                <ul className="list-disc ml-4 space-y-1.5 text-gray-600">
                  {info.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-start gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2 pt-1">
                <span className="text-gray-400">🎯</span>
                <span>Audience</span>
              </div>
              <div className="sm:col-span-8">
                <ul className="list-disc ml-4 space-y-1.5 text-gray-600">
                  {info.audience.map((aud, i) => (
                    <li key={i}>{aud}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Certificate */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-center gap-2">
              <div className="sm:col-span-4 font-bold text-gray-800 flex items-center gap-2">
                <span className="text-gray-400">📜</span>
                <span>Certificate</span>
              </div>
              <div className="sm:col-span-8 text-gray-700 font-medium">
                {info.certificate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
