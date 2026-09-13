"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "@/lib/icons";

const allLiveClasses = [
  {
    id: "live-js-1",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    title: "Deep Dive into V8 Engine & Garbage Collection",
    date: "Thursday, Sep 17, 2026",
    time: "6:00 PM - 7:30 PM EST",
    duration: "90 mins",
    instructorName: "Michael Lee",
    platform: "Zoom",
    joinUrl: "https://zoom.us/j/demo-javascript",
    status: "upcoming",
    agenda: [
      "How V8 compiles JS with Ignition & TurboFan",
      "Memory leaks: WeakMap, WeakSet, and detached DOM nodes",
      "Live code profiling in Chrome DevTools",
    ],
  },
  {
    id: "live-nut-1",
    courseSlug: "secret-tips-behind-perfect-diet-meal-plan",
    courseTitle: "Secret Tips Behind Perfect Diet & Meal Plan",
    title: "Macro-Counting & Meal Prep Hands-on Workshop",
    date: "Friday, Sep 18, 2026",
    time: "4:00 PM - 5:00 PM EST",
    duration: "60 mins",
    instructorName: "Sarah Jenkins, RD",
    platform: "Zoom",
    joinUrl: "https://zoom.us/j/demo-nutrition",
    status: "upcoming",
    agenda: [
      "How to accurately estimate portions without a scale",
      "Prep once, eat for 4 days strategy",
      "Q&A and real-time meal plan reviews",
    ],
  },
  {
    id: "live-fl-1",
    courseSlug: "freelance-business-launchpad",
    courseTitle: "Freelance Business Launchpad",
    title: "Client Cold Pitching & Negotiation Live Clinic",
    date: "Monday, Sep 21, 2026",
    time: "2:00 PM - 3:30 PM EST",
    duration: "90 mins",
    instructorName: "Marcus Vance",
    platform: "Zoom",
    joinUrl: "https://zoom.us/j/demo-freelance",
    status: "upcoming",
    agenda: [
      "Reviewing student cold pitch emails live on screen",
      "How to handle price objections smoothly",
      "Contracts: payment terms, retainers, and scope creep",
    ],
  },
  {
    id: "live-js-2",
    courseSlug: "javascript-mastery",
    courseTitle: "JavaScript Mastery",
    title: "Mastering TypeScript Generics & Type Gymnastics",
    date: "Tuesday, Sep 1, 2026",
    time: "5:00 PM - 6:30 PM EST",
    duration: "90 mins",
    instructorName: "Michael Lee",
    platform: "Zoom",
    joinUrl: "#",
    status: "completed",
    recordingUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agenda: [
      "Conditional types and infer keyword",
      "Template literal types in action",
      "Refactoring messy types from open source repos",
    ],
  },
];

export default function DashboardLiveClassesPage() {
  const [filterTab, setFilterTab] = useState<"all" | "upcoming" | "recordings">("upcoming");
  const [filterCourse, setFilterCourse] = useState("all");
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);

  const filteredSessions = allLiveClasses.filter((session) => {
    const matchesCourse = filterCourse === "all" || session.courseSlug === filterCourse;
    const matchesTab =
      filterTab === "all"
        ? true
        : filterTab === "upcoming"
        ? session.status !== "completed"
        : session.status === "completed";
    return matchesCourse && matchesTab;
  });

  const downloadCalendarFile = (title: string, date: string, time: string) => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Skilliant//Live Class//EN\nBEGIN:VEVENT\nSUMMARY:${title}\nDESCRIPTION:Live class session on Skilliant\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Live Classes &amp; Webinars
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Join interactive live classes, workshops, and coaching clinics with industry experts.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
        {/* Tab switch */}
        <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-semibold">
          <button
            onClick={() => setFilterTab("upcoming")}
            className={`rounded-lg px-4 py-1.5 transition-all ${
              filterTab === "upcoming"
                ? "bg-white text-gray-900 shadow-2xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Upcoming (3)
          </button>
          <button
            onClick={() => setFilterTab("recordings")}
            className={`rounded-lg px-4 py-1.5 transition-all ${
              filterTab === "recordings"
                ? "bg-white text-gray-900 shadow-2xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Recordings (1)
          </button>
          <button
            onClick={() => setFilterTab("all")}
            className={`rounded-lg px-4 py-1.5 transition-all ${
              filterTab === "all"
                ? "bg-white text-gray-900 shadow-2xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Sessions
          </button>
        </div>

        {/* Course Filter Dropdown */}
        <div className="relative">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-4 pr-10 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:border-purple-300 focus:outline-none"
          >
            <option value="all">All Courses</option>
            <option value="javascript-mastery">JavaScript Mastery</option>
            <option value="secret-tips-behind-perfect-diet-meal-plan">Secret Tips Behind Perfect Diet</option>
            <option value="freelance-business-launchpad">Freelance Business Launchpad</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
              📹
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">No Sessions Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no live classes matching your current filter.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                  {session.courseTitle}
                </span>
                <span className="text-sm text-gray-500">
                  Via {session.platform} • {session.duration}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-gray-900">{session.title}</h3>
              <p className="mt-1 text-sm text-gray-600">
                With <strong className="text-gray-800">{session.instructorName}</strong> • {session.date} at {session.time}
              </p>

              {/* Agenda snippet */}
              {session.agenda && (
                <div className="mt-3 rounded-xl bg-gray-50/70 p-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Agenda: </span>
                  {session.agenda.join(" • ")}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2">
                  {session.status !== "completed" ? (
                    <>
                      <a
                        href={session.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                      >
                        Join Session (Zoom)
                      </a>
                      <button
                        onClick={() => downloadCalendarFile(session.title, session.date, session.time)}
                        className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Add to Calendar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedRecording(session.title)}
                      className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                    >
                      ▶ Watch Recording
                    </button>
                  )}
                </div>

                <Link
                  href={`/learn/${session.courseSlug}/live-classes`}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  View in Course Player →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recording Player Modal */}
      {selectedRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">{selectedRecording}</h3>
              <button
                onClick={() => setSelectedRecording(null)}
                className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 aspect-video rounded-2xl bg-gray-900 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg">
                  ▶
                </div>
                <p className="mt-3 text-sm text-gray-300">Class Recording Playback</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
