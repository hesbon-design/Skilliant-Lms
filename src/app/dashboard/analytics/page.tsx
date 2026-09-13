"use client";

import Link from "next/link";

const weeklyStudyData = [
  { day: "Mon", hours: 1.5, percent: 50 },
  { day: "Tue", hours: 2.0, percent: 66 },
  { day: "Wed", hours: 0.5, percent: 16 },
  { day: "Thu", hours: 3.0, percent: 100 },
  { day: "Fri", hours: 1.8, percent: 60 },
  { day: "Sat", hours: 2.5, percent: 83 },
  { day: "Sun", hours: 1.2, percent: 40 },
];

export default function DashboardAnalyticsPage() {
  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Training &amp; Operational Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your weekly simulation hours, hazard recognition accuracy, and operational skill competencies.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <p className="text-sm font-semibold text-gray-700">Weekly Sim &amp; Field Hours</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">12.5 hrs</h4>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[83%] rounded-full bg-purple-600" />
          </div>
          <p className="mt-2 text-sm text-gray-500">Target: 15 hrs / week</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <p className="text-sm font-semibold text-gray-700">Hazard &amp; Safety Accuracy</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">94%</h4>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[94%] rounded-full bg-green-500" />
          </div>
          <p className="mt-2 text-sm text-green-700 font-semibold">+6% vs last week (Safe Operator)</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <p className="text-sm font-semibold text-gray-700">Consecutive Drill Days</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">4 Days 🔥</h4>
          <p className="mt-3 text-sm text-purple-700 font-semibold">Keep it up tomorrow!</p>
          <p className="text-sm text-gray-500">Longest streak: 12 days</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <p className="text-sm font-semibold text-gray-700">Drills &amp; Checks Passed</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">14 / 46</h4>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[30%] rounded-full bg-purple-600" />
          </div>
          <p className="mt-2 text-sm text-gray-500">Across enrolled training programs</p>
        </div>
      </div>

      {/* Chart & Retention Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Practical &amp; Sim Hours Distribution</h3>
              <p className="text-sm text-gray-500">Hours spent in simulation, field drills, and safety inspection over the last 7 days</p>
            </div>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              This Week
            </span>
          </div>

          <div className="mt-8 flex items-end justify-between gap-2 h-44 px-4 pb-2">
            {weeklyStudyData.map((item) => (
              <div key={item.day} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-purple-700 mb-1">
                  {item.hours}h
                </div>
                <div
                  className="w-8 sm:w-12 rounded-t-xl bg-purple-100 group-hover:bg-purple-600 transition-colors"
                  style={{ height: `${item.percent}%` }}
                />
                <span className="mt-2 text-sm font-semibold text-gray-600">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Competencies */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <h3 className="text-lg font-bold text-gray-900">Skill Competencies</h3>
          <p className="text-sm text-gray-500">Proficiency by topic domain</p>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-700">JavaScript &amp; Asynchronous Logic</span>
                <span className="text-purple-600">85%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[85%] rounded-full bg-purple-600" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-700">Nutrition &amp; Meal Architecture</span>
                <span className="text-purple-600">72%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[72%] rounded-full bg-purple-600" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-700">Client Outreach &amp; Pitching</span>
                <span className="text-purple-600">55%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[55%] rounded-full bg-purple-600" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-700">TypeScript &amp; Type Systems</span>
                <span className="text-purple-600">60%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[60%] rounded-full bg-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
