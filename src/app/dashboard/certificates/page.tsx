"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CertificateItem {
  id: string;
  courseSlug: string;
  courseTitle: string;
  instructorName: string;
  issueDate?: string;
  credentialId?: string;
  isUnlocked: boolean;
  progress: number;
  remainingTasks?: string[];
}

interface AwardItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  isUnlocked: boolean;
  unlockedDate?: string;
  progressText?: string;
  progressPercent?: number;
}

const mockCertificates: CertificateItem[] = [
  {
    id: "cert-1",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    instructorName: "Michael Lee",
    issueDate: "September 12, 2026",
    credentialId: "SKL-JS-94819",
    isUnlocked: true,
    progress: 100,
  },
  {
    id: "cert-2",
    courseSlug: "secret-tips-behind-perfect-diet-meal-plan",
    courseTitle: "Secret Tips Behind Perfect Diet & Meal Plan",
    instructorName: "Sarah Jenkins, RD",
    isUnlocked: false,
    progress: 33,
    remainingTasks: [
      "Complete Module 2 Quiz: Meal Planning & Nutrition Assessment",
      "Submit Capstone Assignment: 7-Day Meal Plan",
    ],
  },
  {
    id: "cert-3",
    courseSlug: "freelance-business-launchpad",
    courseTitle: "Freelance Business Launchpad",
    instructorName: "Marcus Vance",
    isUnlocked: false,
    progress: 17,
    remainingTasks: [
      "Pass Freelance Fundamentals Quiz (Retake)",
      "Wait for grading on Build Your Freelance Foundation Assignment",
    ],
  },
];

const mockAwards: AwardItem[] = [
  {
    id: "award-1",
    title: "Zero-Fault Safety Honor",
    icon: "🏆",
    category: "Safety & Operational Excellence",
    description: "Achieved a 90%+ score across safety inspection and hazard perception drills on the first attempt.",
    isUnlocked: true,
    unlockedDate: "Earned Sep 10, 2026",
  },
  {
    id: "award-2",
    title: "7-Day Study Streak",
    icon: "🔥",
    category: "Consistency",
    description: "Logged into Skilliant and completed active lessons 7 consecutive days.",
    isUnlocked: true,
    unlockedDate: "Earned Sep 12, 2026",
  },
  {
    id: "award-3",
    title: "Quiz Master",
    icon: "🎯",
    category: "Assessments",
    description: "Successfully passed 5 separate module quizzes with zero retakes.",
    isUnlocked: true,
    unlockedDate: "Earned Sep 11, 2026",
  },
  {
    id: "award-4",
    title: "Sprint Starter",
    icon: "🚀",
    category: "Milestones",
    description: "Finished your first course module within 24 hours of enrollment.",
    isUnlocked: true,
    unlockedDate: "Earned Sep 9, 2026",
  },
  {
    id: "award-5",
    title: "Community Mentor",
    icon: "💬",
    category: "Engagement",
    description: "Help fellow learners by posting 5 verified answers in course discussions.",
    isUnlocked: false,
    progressText: "3 / 5 answers posted",
    progressPercent: 60,
  },
  {
    id: "award-6",
    title: "Tri-Mastery Operator",
    icon: "👑",
    category: "Professional Endorsement",
    description: "Complete 3 certified technical programs and receive verified operator endorsements.",
    isUnlocked: false,
    progressText: "1 / 3 certifications completed",
    progressPercent: 33,
  },
];

export default function DashboardCertificatesPage() {
  const [activeTab, setActiveTab] = useState<"certificates" | "awards">("certificates");
  const [filterCertificate, setFilterCertificate] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const filteredCertificates = mockCertificates.filter((cert) => {
    if (filterCertificate === "unlocked") return cert.isUnlocked;
    if (filterCertificate === "locked") return !cert.isUnlocked;
    return true;
  });

  const handleCopyCredential = (id: string) => {
    navigator.clipboard.writeText(`https://skilliant.com/verify/${id}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Certificates &amp; Endorsements
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View, download, and share your accredited certificates of completion, operator endorsements, and safety milestone awards.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid gap-5 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Earned Certificates</p>
            <span className="text-lg">🎓</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">1 Verified</h4>
          <p className="mt-1 text-sm text-green-600 font-semibold">Ready to download &amp; share</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">In Progress</p>
            <span className="text-lg">🔒</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">2 Programs</h4>
          <p className="mt-1 text-sm text-amber-600 font-semibold">100% completion required</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Awards &amp; Badges</p>
            <span className="text-lg">🏆</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">4 Unlocked</h4>
          <p className="mt-1 text-sm text-purple-600 font-semibold">2 honors in progress</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Operator Standing</p>
            <span className="text-lg">⭐</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">Level 4</h4>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[72%] rounded-full bg-purple-600" />
          </div>
          <p className="mt-1.5 text-sm text-gray-500">1,450 / 2,000 XP to Senior Operator</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("certificates")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "certificates"
                ? "bg-purple-50 text-purple-600"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <span>📜</span>
            <span>Course Certificates ({mockCertificates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("awards")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === "awards"
                ? "bg-purple-50 text-purple-600"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <span>🏆</span>
            <span>Competency Badges ({mockAwards.length})</span>
          </button>
        </div>

        {/* Filter for Certificates */}
        {activeTab === "certificates" && (
          <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-semibold self-start sm:self-auto">
            <button
              onClick={() => setFilterCertificate("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 transition-all",
                filterCertificate === "all"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              All ({mockCertificates.length})
            </button>
            <button
              onClick={() => setFilterCertificate("unlocked")}
              className={cn(
                "rounded-lg px-3 py-1.5 transition-all",
                filterCertificate === "unlocked"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              Earned (1)
            </button>
            <button
              onClick={() => setFilterCertificate("locked")}
              className={cn(
                "rounded-lg px-3 py-1.5 transition-all",
                filterCertificate === "locked"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              Locked (2)
            </button>
          </div>
        )}
      </div>

      {/* ================= TAB 1: CERTIFICATES ================= */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredCertificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-xs"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  {cert.isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                      <span>✓</span> Verified &amp; Claimed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                      <span>🔒</span> Locked ({cert.progress}% completed)
                    </span>
                  )}

                  {cert.credentialId && (
                    <span className="font-mono text-xs text-gray-500">
                      ID: {cert.credentialId}
                    </span>
                  )}
                </div>

                {/* Certificate Preview Miniature */}
                {cert.isUnlocked ? (
                  <div
                    onClick={() => setSelectedCert(cert)}
                    className="mt-5 cursor-pointer rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-b from-purple-50/50 to-white p-6 text-center hover:border-purple-400 transition-colors group"
                  >
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xl group-hover:scale-110 transition-transform">
                      🎓
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wider text-purple-700">
                      Certificate of Achievement
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-gray-900">{cert.courseTitle}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Issued to <strong className="text-gray-800">Hesbon Ombati</strong> on {cert.issueDate}
                    </p>
                    <p className="mt-2 text-sm font-medium text-purple-600 underline">
                      Click to view full certificate
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xl">
                      🔒
                    </div>
                    <h3 className="mt-3 text-base font-bold text-gray-900">{cert.courseTitle}</h3>
                    <p className="mt-1 text-sm text-gray-500">Instructor: {cert.instructorName}</p>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-gray-600">{cert.progress}% Completed</span>
                        <span className="text-gray-500">100% Required</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width: `${cert.progress}%` }}
                        />
                      </div>
                    </div>

                    {cert.remainingTasks && (
                      <div className="mt-4 rounded-xl bg-white p-3 text-left border border-gray-100">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Remaining to Unlock:</p>
                        <ul className="mt-1.5 space-y-1 text-xs text-gray-600 list-disc list-inside">
                          {cert.remainingTasks.map((task, i) => (
                            <li key={i}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50">
                {cert.isUnlocked ? (
                  <>
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 rounded-xl bg-purple-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors text-center"
                    >
                      View &amp; Print
                    </button>
                    <button
                      onClick={() => alert(`Downloading official PDF for ${cert.courseTitle}...`)}
                      className="rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Download PDF ↓
                    </button>
                    <button
                      onClick={() => handleCopyCredential(cert.credentialId!)}
                      className="rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      title="Copy Verification Link"
                    >
                      {copySuccess ? "✓ Copied!" : "🔗 Share"}
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/learn/${cert.courseSlug}`}
                    className="w-full rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors text-center"
                  >
                    Continue Course to Unlock →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

      {/* ================= SECTION 2: AWARDS & BADGES ================= */}
      {activeTab === "awards" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-purple-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-600 text-3xl text-white shadow-md">
                🎖️
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Student Honors &amp; Gamification</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Earn digital badges, maintain study streaks, and unlock achievement perks as you advance.
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <span className="rounded-full bg-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs">
                4 of 6 Badges Earned
              </span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockAwards.map((award) => (
              <div
                key={award.id}
                className={cn(
                  "rounded-3xl border p-6 transition-all flex flex-col justify-between",
                  award.isUnlocked
                    ? "border-gray-100 bg-white shadow-xs hover:border-purple-200"
                    : "border-dashed border-gray-200 bg-gray-50/60 opacity-80"
                )}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex size-14 items-center justify-center rounded-2xl text-2xl shadow-xs",
                        award.isUnlocked ? "bg-purple-50 text-purple-700" : "bg-gray-200 text-gray-400"
                      )}
                    >
                      {award.icon}
                    </div>

                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        award.isUnlocked
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-200 text-gray-600"
                      )}
                    >
                      {award.isUnlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <h4 className="mt-4 text-base font-bold text-gray-900">{award.title}</h4>
                  <p className="mt-0.5 text-sm font-semibold text-purple-700 uppercase tracking-wider">
                    {award.category}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {award.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  {award.isUnlocked ? (
                    <p className="text-sm font-medium text-gray-500">
                      ✓ {award.unlockedDate}
                    </p>
                  ) : (
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-gray-600">
                        <span>{award.progressText}</span>
                        <span>{award.progressPercent}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-600"
                          style={{ width: `${award.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= FULL CERTIFICATE PREVIEW MODAL ================= */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 sm:p-10 shadow-2xl">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute right-5 top-5 size-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 text-sm"
            >
              ✕
            </button>

            {/* Certificate Parchment */}
            <div className="rounded-2xl border-4 border-double border-purple-200 bg-gradient-to-b from-white to-purple-50/20 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold uppercase tracking-wider px-8 py-1 rotate-45 translate-x-7 translate-y-3 shadow-xs">
                Verified
              </div>

              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-3xl">
                🎓
              </div>

              <p className="mt-4 text-sm font-bold uppercase tracking-wider text-purple-700">
                Official Certificate of Completion
              </p>
              <h3 className="mt-2 text-2xl font-black text-gray-900">Hesbon Ombati</h3>
              <p className="mt-2 text-sm text-gray-600">
                has successfully demonstrated mastery and completed all syllabus requirements for
              </p>
              <h4 className="mt-1 text-xl font-bold text-purple-700">{selectedCert.courseTitle}</h4>

              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 text-sm text-gray-500">
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Lead Instructor</p>
                  <p>{selectedCert.instructorName}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">Date of Award</p>
                  <p>{selectedCert.issueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">Credential ID</p>
                  <p className="font-mono text-gray-700">{selectedCert.credentialId}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                🖨️ Print Certificate
              </button>
              <button
                onClick={() => alert("Downloading verified PDF certificate...")}
                className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
              >
                📥 Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
