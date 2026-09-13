"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getCoursePlayerData } from "@/data/coursePlayerData";

const CertificateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.75"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CourseCertificatePage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  const isCompleted = course.percentCompleted === 100;

  return (
    <div className="flex h-full flex-col px-6 py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <span className="text-purple-600">
            <CertificateIcon />
          </span>
          Course Certificate
        </h2>
      </div>

      {/* Main Certificate Area */}
      <div className="mt-6 flex flex-1 items-center justify-center">
        {!isCompleted ? (
          /* Locked State matching certificate note.PNG */
          <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-lg text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <span>🔒</span>
              <span>Certificate Locked</span>
            </div>

            {/* Illustration graphic */}
            <div className="mt-6 flex items-center justify-center rounded-2xl bg-purple-50/70 p-8 sm:p-12">
              <div className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-10 py-12 shadow-xs">
                {/* Simulated Certificate document lines */}
                <div className="space-y-2 text-center opacity-40">
                  <div className="mx-auto h-2 w-24 rounded bg-gray-300" />
                  <div className="mx-auto h-1.5 w-36 rounded bg-gray-200" />
                  <div className="mx-auto h-1.5 w-28 rounded bg-gray-200" />
                  <div className="mx-auto h-1.5 w-20 rounded bg-gray-200" />
                </div>
                {/* Center Lock Badge */}
                <div className="absolute flex size-16 items-center justify-center rounded-full bg-purple-600 text-2xl text-white shadow-xl">
                  🔒
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Complete the course to unlock the certificate
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You must finish all lessons, complete required assessments, and submit the final assignment.
            </p>

            {/* Progress indicators */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-gray-700">
                  {course.percentCompleted}% Completed
                </span>
                <span className="text-gray-500">
                  Required <span className="font-bold text-gray-900">100%</span>
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${course.percentCompleted}%` }}
                />
              </div>
            </div>

            {/* Action button */}
            <Link
              href={`/learn/${courseSlug}`}
              className="mt-8 inline-block w-full rounded-2xl bg-purple-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-purple-700 transition-colors text-center"
            >
              Continue Learning →
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-2xl rounded-3xl border-4 border-double border-purple-200 bg-white p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold uppercase tracking-wider px-8 py-1 rotate-45 translate-x-7 translate-y-3 shadow-xs">
              Verified
            </div>

            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-3xl">
              🎓
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-purple-600">
              Certificate of Completion
            </p>
            <h3 className="mt-2 text-2xl font-black text-gray-900">
              Hesbon Ombati
            </h3>
            <p className="mt-2 text-sm text-gray-500">has successfully mastered and completed all modules of</p>
            <h4 className="mt-1 text-lg font-bold text-purple-700">{course.title}</h4>

            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 text-sm text-gray-500">
              <div className="text-left">
                <p className="font-semibold text-gray-800">Issue Date</p>
                <p>September 12, 2026</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">Certificate ID</p>
                <p className="font-mono text-gray-600">SKL-{courseSlug.slice(0, 4).toUpperCase()}-94819</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => alert("Downloading official PDF certificate...")}
                className="rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-purple-700 transition-colors"
              >
                📥 Download Certificate (PDF)
              </button>
              <button
                onClick={() => alert("Sharing to LinkedIn...")}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                🔗 Share to LinkedIn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
