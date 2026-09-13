"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getCoursePlayerData } from "@/data/coursePlayerData";

const AnnouncementIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmptyAnnounceIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <line x1="2" y1="2" x2="22" y2="22" stroke="#EF4444" strokeWidth="2" />
  </svg>
);

export default function CourseAnnouncementsPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  const announcements = course?.announcements ?? [];
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});

  const handlePostComment = (annId: string) => {
    if (!commentText.trim()) return;
    setCommentsMap((prev) => ({
      ...prev,
      [annId]: [...(prev[annId] || []), commentText.trim()],
    }));
    setCommentText("");
  };

  return (
    <div className="flex h-full flex-col px-6 py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <span className="text-purple-600">
            <AnnouncementIcon />
          </span>
          Course Announcements
          <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
            {announcements.length}
          </span>
        </h2>
      </div>

      {/* Content */}
      <div className="mt-6 flex-1 space-y-5">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-xs">
            <EmptyAnnounceIcon />
            <h3 className="mt-4 text-base font-semibold text-gray-800">No Announcements Available</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Your instructor hasn&apos;t posted any announcements for this course yet. Check back soon for course updates!
            </p>
          </div>
        ) : (
          announcements.map((ann) => {
            const extraComments = commentsMap[ann.id] || [];
            const totalComments = ann.commentsCount + extraComments.length;

            return (
              <div
                key={ann.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all"
              >
                {/* Top Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700 uppercase">
                      {ann.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{ann.authorName}</h4>
                      <p className="text-sm text-gray-500">{ann.authorRole} • {ann.date}</p>
                    </div>
                  </div>

                  {ann.isPinned && (
                    <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                      <span>📌</span> Pinned
                    </span>
                  )}
                </div>

                {/* Title & Body */}
                <h3 className="mt-4 text-base font-bold text-gray-900">{ann.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{ann.content}</p>

                {/* Footer / Comments trigger */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                  <button
                    onClick={() => setActiveCommentBox(activeCommentBox === ann.id ? null : ann.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    💬 {totalComments} Comments
                  </button>

                  <span className="text-sm text-gray-500">
                    Official Announcement
                  </span>
                </div>

                {/* Comments Thread */}
                {activeCommentBox === ann.id && (
                  <div className="mt-4 space-y-3 rounded-xl bg-gray-50/60 p-4 border border-gray-100">
                    {extraComments.map((cmt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                          You
                        </div>
                        <div className="rounded-lg bg-white p-2.5 shadow-2xs flex-1">
                          <p className="font-semibold text-gray-900">You <span className="font-normal text-gray-500">• Just now</span></p>
                          <p className="mt-1">{cmt}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a reply or question..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handlePostComment(ann.id);
                        }}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                      />
                      <button
                        onClick={() => handlePostComment(ann.id)}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
