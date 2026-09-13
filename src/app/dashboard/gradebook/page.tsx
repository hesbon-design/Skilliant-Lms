"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface StudentCourseEvaluation {
  slug: string;
  title: string;
  category: "Driving School" | "Heavy Machinery" | "Technical College";
  instructor: string;
  progress: number;
  theoryScore: string;
  practicalDrills: string;
  safetyScore: string;
  competencyStatus: "competent" | "in_training" | "retake_needed";
  competencyScore: number;
  qualificationStatus: string;
  isUnlocked: boolean;
}

const studentCourses: StudentCourseEvaluation[] = [
  {
    slug: "commercial-fleet-driving",
    title: "Commercial Fleet Driving & Advanced Hazard Overtraining",
    category: "Driving School",
    instructor: "Capt. Marcus Vance, Master Fleet Safety Director",
    progress: 78,
    theoryScore: "98% (DOT Rules)",
    practicalDrills: "94% (24.5 Behind-The-Wheel Hrs)",
    safetyScore: "100% (Zero Faults)",
    competencyStatus: "in_training",
    competencyScore: 94,
    qualificationStatus: "Class A Commercial Endorsement Eligible",
    isUnlocked: false,
  },
  {
    slug: "heavy-machinery-operation",
    title: "Heavy Machinery & Excavator Operations (OSHA/ISO Standard)",
    category: "Heavy Machinery",
    instructor: "Michael Lee, Certified Heavy Equipment Inspector",
    progress: 100,
    theoryScore: "100% (OSHA Safety)",
    practicalDrills: "96% (32 In-Cab Machine Simulator Hrs)",
    safetyScore: "98.5% (Pre-Trip Passed)",
    competencyStatus: "competent",
    competencyScore: 97,
    qualificationStatus: "Verified Heavy Equipment Operator Credential",
    isUnlocked: true,
  },
  {
    slug: "industrial-hydraulics-inspection",
    title: "Industrial Hydraulics & Pre-Trip Machine Inspection",
    category: "Technical College",
    instructor: "Sarah Jenkins, Field Safety Specialist",
    progress: 33,
    theoryScore: "78% (Theory Pass)",
    practicalDrills: "55% (Maneuver Drills Needed)",
    safetyScore: "82% (1 Minor Inspection Fault)",
    competencyStatus: "retake_needed",
    competencyScore: 58,
    qualificationStatus: "Locked — Drill Remediation Required",
    isUnlocked: false,
  },
];

export default function DashboardGradebookPage() {
  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Competency &amp; Performance Record
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time evaluation records for driving school, large machinery operations, and technical college overtraining.
          </p>
        </div>

        <Link
          href="/dashboard/certificates"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
        >
          <span>View Verified Credentials</span>
          <span>→</span>
        </Link>
      </div>

      {/* Overtraining Standards Banner */}
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-purple-50 p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white text-xl shadow-xs">
          🛡️
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-900">
            Skilliant Overtraining Standard (Zero-Fault Competency)
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            In commercial driving, crane operation, heavy earthmoving, and vocational apprenticeships, academic GPA does not apply.
            Instead, learners are overtrained to achieve <strong>≥85% practical competency</strong>, <strong>zero critical safety infractions</strong>, and certified field readiness before equipment deployment.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Practical Competency */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Practical Competency</p>
            <span className="text-lg">🎯</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">94% Mastery</h4>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[94%] rounded-full bg-green-500" />
          </div>
          <p className="mt-2 text-sm text-green-600 font-semibold">Field Ready (Benchmark ≥ 85%)</p>
        </div>

        {/* Card 2: Safety Compliance */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Safety &amp; Compliance</p>
            <span className="text-lg">🛡️</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">99.2%</h4>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[99%] rounded-full bg-purple-600" />
          </div>
          <p className="mt-2 text-sm text-purple-600 font-semibold">Zero Critical Infractions</p>
        </div>

        {/* Card 3: In-Cab & Sim Hours */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Practical &amp; Sim Hours</p>
            <span className="text-lg">⏱️</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">38.5 / 50 hrs</h4>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[77%] rounded-full bg-purple-600" />
          </div>
          <p className="mt-2 text-sm text-gray-500 font-medium">In-Cab &amp; Behind-the-Wheel</p>
        </div>

        {/* Card 4: Endorsements & Licenses */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Qualifications Earned</p>
            <span className="text-lg">📜</span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">1 Certified</h4>
          <p className="mt-1 text-sm text-gray-500">2 In Practical Training</p>
          <p className="mt-2 text-sm text-green-600 font-semibold">OSHA / DOT Standards</p>
        </div>
      </div>

      {/* Program Competency Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Program Evaluations &amp; Practical Competencies</h3>
            <p className="text-sm text-gray-500">Evaluation breakdown across driving, machinery operation, and technical disciplines</p>
          </div>
          <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 self-start sm:self-auto">
            Passing Standard: ≥ 85%
          </span>
        </div>

        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm min-w-[950px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3.5 whitespace-nowrap">Program &amp; Track</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Curriculum Progress</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Safety &amp; Theory</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Practical &amp; Sim Drills</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Competency Status</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Endorsement / License</th>
                <th className="px-6 py-3.5 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {studentCourses.map((c) => (
                <tr key={c.slug} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap min-w-[280px]">
                    <span className="inline-block rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                      {c.category}
                    </span>
                    <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      {c.title}
                    </p>
                    <p className="font-normal text-gray-500 text-sm mt-0.5 whitespace-nowrap">Instructor: {c.instructor}</p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{c.progress}%</span>
                      <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-600"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-semibold text-gray-900">{c.theoryScore}</p>
                    <p className="text-sm text-green-700 font-medium">Safety: {c.safetyScore}</p>
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">
                    {c.practicalDrills}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.competencyStatus === "competent" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200 whitespace-nowrap">
                        <span>✓</span> Certified Competent ({c.competencyScore}%)
                      </span>
                    )}
                    {c.competencyStatus === "in_training" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 whitespace-nowrap">
                        <span>⚡</span> Field Training ({c.competencyScore}%)
                      </span>
                    )}
                    {c.competencyStatus === "retake_needed" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 whitespace-nowrap">
                        <span>⚠</span> Drill Retake ({c.competencyScore}%)
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                      c.isUnlocked
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {c.qualificationStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link
                      href={`/learn/${c.slug}/gradebook`}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors whitespace-nowrap"
                    >
                      View Drills →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
