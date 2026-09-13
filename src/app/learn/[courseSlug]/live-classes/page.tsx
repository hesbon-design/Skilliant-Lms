"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getCoursePlayerData } from "@/data/coursePlayerData";

const LiveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.75"/>
    <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function CourseLiveClassesPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  const liveClasses = course?.liveClasses ?? [];
  const [activeTab, setActiveTab] = useState<"upcoming" | "recordings">("upcoming");
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);

  const upcomingSessions = liveClasses.filter((c) => c.status !== "completed");
  const pastSessions = liveClasses.filter((c) => c.status === "completed");

  const displayedSessions = activeTab === "upcoming" ? upcomingSessions : pastSessions;

  const downloadCalendarFile = (title: string, date: string, time: string) => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Skilliant//Live Class//EN\nBEGIN:VEVENT\nSUMMARY:${title}\nDESCRIPTION:Live class session for ${course.title}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full flex-col px-6 py-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <span className="text-purple-600">
            <LiveIcon />
          </span>
          Live Classes &amp; Webinars
          <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
            {liveClasses.length}
          </span>
        </h2>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`rounded-lg px-4 py-1.5 transition-all ${
              activeTab === "upcoming"
                ? "bg-white text-gray-900 shadow-2xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Upcoming ({upcomingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab("recordings")}
            className={`rounded-lg px-4 py-1.5 transition-all ${
              activeTab === "recordings"
                ? "bg-white text-gray-900 shadow-2xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Recordings ({pastSessions.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6 flex-1 space-y-5">
        {displayedSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-xs">
            <div className="flex size-14 items-center justify-center rounded-full bg-purple-50 text-2xl text-purple-600">
              📹
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-800">
              {activeTab === "upcoming" ? "No Upcoming Live Sessions" : "No Past Recordings Yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {activeTab === "upcoming"
                ? "Your instructor has not scheduled any live webinars for this week. Check back soon!"
                : "Recordings of live sessions will appear here after they conclude."}
            </p>
          </div>
        ) : (
          displayedSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Status indicator */}
                {session.status === "live" ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 animate-pulse">
                    <span className="size-2 rounded-full bg-red-500" /> Live Right Now
                  </span>
                ) : session.status === "upcoming" ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                    🗓️ Upcoming Class
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                    ✓ Completed Session
                  </span>
                )}

                {/* Platform tag */}
                <span className="text-sm font-medium text-gray-500">
                  Via {session.platform} • {session.duration}
                </span>
              </div>

              {/* Title & Instructor */}
              <h3 className="mt-3 text-lg font-bold text-gray-900">{session.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <span>Instructor: <strong className="text-gray-800">{session.instructorName}</strong></span>
                <span>•</span>
                <span>{session.date} at {session.time}</span>
              </div>

              {/* Agenda */}
              {session.agenda && session.agenda.length > 0 && (
                <div className="mt-4 rounded-xl bg-gray-50/70 p-4 border border-gray-100">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Session Agenda:</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                    {session.agenda.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-50 pt-4">
                {session.status !== "completed" ? (
                  <>
                    <a
                      href={session.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                    >
                      <LiveIcon />
                      Join Live Session
                    </a>
                    <button
                      onClick={() => downloadCalendarFile(session.title, session.date, session.time)}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CalendarIcon />
                      Add to Calendar (.ics)
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedRecording(session.title)}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                  >
                    ▶ Watch Recording
                  </button>
                )}
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
