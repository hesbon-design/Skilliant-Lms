"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCoursePlayerData } from "@/data/coursePlayerData";

// Icons
const BookOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FeatherIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#F3F4F6"/>
  </svg>
);

interface Note {
  id: string;
  text: string;
  createdAt: string;
}

function CourseLessonContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  const allLessons = course?.topics.flatMap((t) => t.lessons) ?? [];
  const lessonParam = searchParams.get("lesson");
  const currentLesson =
    allLessons.find((l) => l.id === lessonParam) || allLessons[0];

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const nextLesson =
    currentIndex !== -1 && currentIndex + 1 < allLessons.length
      ? allLessons[currentIndex + 1]
      : null;

  const getLessonHref = (targetId: string, targetType: string) => {
    if (targetType === "quiz") return `/learn/${courseSlug}/quiz/${targetId}`;
    if (targetType === "assignment") return `/learn/${courseSlug}/assignment/${targetId}`;
    return `/learn/${courseSlug}?lesson=${targetId}`;
  };

  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "comments">("overview");
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);
  const [showTakeNoteModal, setShowTakeNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "demo-1",
      text: "Remember to mix colors starting with the lightest tone first.",
      createdAt: "September 12, 2026, 11:15 am",
    },
  ]);
  const [isComplete, setIsComplete] = useState(false);

  // Mock comments
  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Alex Morgan",
      avatar: "A",
      date: "2 days ago",
      text: "This explanation of color palettes made everything click for me!",
    },
    {
      id: "c2",
      author: "Maria Santos",
      avatar: "M",
      date: "1 day ago",
      text: "Which brush pack do you recommend using for the texture section?",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        author: "Hesbonombati",
        avatar: "H",
        date: "Just now",
        text: newComment.trim(),
      },
    ]);
    setNewComment("");
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setNotes((prev) => [
      {
        id: Date.now().toString(),
        text: noteText.trim(),
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);
    setNoteText("");
    setShowTakeNoteModal(false);
  };

  if (!currentLesson) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Lesson not found.</p>
      </div>
    );
  }

  const isVideo = currentLesson.type === "video";

  return (
    <div className="relative flex flex-col min-h-full bg-gray-50/40 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-4xl flex-1 flex flex-col justify-between">
        <div>
          {/* VIDEO PLAYER VIEW (learning progress 2.PNG) */}
          {isVideo ? (
            <div>
              {/* Video Frame */}
              <div className="relative mb-6 aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md group">
                {/* Video preview / scene */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 via-amber-200 to-amber-300 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto size-20 rounded-full bg-amber-400/40 border-4 border-amber-500/40 flex items-center justify-center text-4xl mb-3">
                      🎨
                    </div>
                    <p className="text-lg font-bold text-gray-900">{currentLesson.title}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Video Lesson • {currentLesson.duration || "15:00 mins"}
                    </p>
                  </div>
                </div>

                {/* Center Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 m-auto flex size-18 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-xs transition-transform hover:scale-105 hover:bg-black/60 shadow-xl cursor-pointer"
                >
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Video Scrubber & Controls */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                      setVideoProgress(pct);
                    }}
                    className="relative h-1.5 w-full cursor-pointer rounded-full bg-white/30 mb-3"
                  >
                    <div
                      className="h-full rounded-full bg-white relative"
                      style={{ width: `${videoProgress}%` }}
                    >
                      <div className="absolute right-0 -top-1 size-3.5 rounded-full bg-white shadow-md -mr-1.5" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-purple-300 transition-colors"
                      >
                        {isPlaying ? "❚❚" : "▶"}
                      </button>
                      <div className="flex items-center gap-1.5">
                        <span>🔊</span>
                        <div className="h-1 w-12 rounded-full bg-white/40">
                          <div className="h-full w-3/4 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="font-mono text-xs text-gray-200">
                        5:14 / -09:46
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-bold">
                        CC
                      </span>
                      <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-bold">
                        720p
                      </span>
                      <button className="hover:text-purple-300 transition-colors">⚙</button>
                      <button className="hover:text-purple-300 transition-colors">⛶</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Row under Video */}
              <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === "overview"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <BookOpenIcon />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === "notes"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <NotesIcon />
                    Notes ({notes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === "comments"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Comments
                  </button>
                </div>

                <button
                  onClick={() => setShowTakeNoteModal(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <FeatherIcon />
                  Take Note
                </button>

                {/* Popover Take Note Floating Card */}
                {showTakeNoteModal && (
                  <div className="absolute right-0 top-12 z-30 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <FeatherIcon />
                        Take Note
                      </div>
                      <button
                        onClick={() => setShowTakeNoteModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <XIcon />
                      </button>
                    </div>
                    <div className="mt-3">
                      <textarea
                        autoFocus
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Type your note here to save for later"
                        rows={4}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                      />
                      <div className="mt-3 flex items-center justify-end gap-3">
                        <button
                          onClick={() => setShowTakeNoteModal(false)}
                          className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveNote}
                          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Tab Content */}
              <div className="rounded-2xl border border-gray-200/70 bg-white p-6 sm:p-8 shadow-xs mb-8">
                {activeTab === "overview" && (
                  <div
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-normal"
                    dangerouslySetInnerHTML={{
                      __html: currentLesson.content ?? "<p>No content available for this lesson.</p>",
                    }}
                  />
                )}

                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Type your note here to save for later"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                    />
                    {noteText.trim() && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveNote}
                          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700"
                        >
                          Save Note
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-y border-gray-100 py-3 text-sm text-gray-500 font-medium">
                      <span>All ({notes.length})</span>
                    </div>

                    {notes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FolderIcon />
                        <p className="mt-3 text-sm text-gray-500">No Notes Have Been Added!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                          >
                            <p className="text-sm text-gray-800">{note.text}</p>
                            <p className="mt-1 text-sm text-gray-500">{note.createdAt}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="space-y-6">
                    <form onSubmit={handleAddComment} className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                        H
                      </div>
                      <div className="flex-1 space-y-2">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ask a question or share a thought on this lesson..."
                          rows={3}
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    </form>

                    <div className="space-y-4 pt-2">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs"
                        >
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700 text-sm">
                            {comment.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {comment.author}
                              </h4>
                              <span className="text-sm text-gray-500">{comment.date}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* READING LESSON VIEW (learning progress.PNG) */
            <div className="relative rounded-2xl border border-gray-200/70 bg-white p-6 sm:p-10 shadow-xs mb-8">
              {/* Floating Take Note Popover (take note.PNG) */}
              {showTakeNoteModal && (
                <div className="absolute right-6 top-6 z-30 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <FeatherIcon />
                      Take Note
                    </div>
                    <button
                      onClick={() => setShowTakeNoteModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XIcon />
                    </button>
                  </div>
                  <div className="mt-3">
                    <textarea
                      autoFocus
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Type your note here to save for later"
                      rows={4}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                    />
                    <div className="mt-3 flex items-center justify-end gap-3">
                      <button
                        onClick={() => setShowTakeNoteModal(false)}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNote}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs Header inside Card */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === "overview"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <BookOpenIcon />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === "notes"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <NotesIcon />
                    Notes ({notes.length})
                  </button>
                </div>

                {/* Take Note Button */}
                <button
                  onClick={() => setShowTakeNoteModal(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <FeatherIcon />
                  Take Note
                </button>
              </div>

              {/* Overview Content */}
              {activeTab === "overview" && (
                <div
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{
                    __html: currentLesson.content ?? "<p>No content available for this lesson.</p>",
                  }}
                />
              )}

              {/* Notes Tab Content (capture notes.PNG) */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type your note here to save for later"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none"
                  />
                  {noteText.trim() && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNote}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700"
                      >
                        Save Note
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-y border-gray-100 py-3 text-sm text-gray-500 font-medium">
                    <span>All ({notes.length})</span>
                  </div>

                  {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FolderIcon />
                      <p className="mt-3 text-sm text-gray-500">No Notes Have Been Added!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                        >
                          <p className="text-sm text-gray-800">{note.text}</p>
                          <p className="mt-1 text-sm text-gray-500">{note.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR (learning progress.PNG & learning progress 2.PNG) */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <div className="flex-1" />
          {/* Centered Mark as Complete Button */}
          <button
            onClick={() => setIsComplete(!isComplete)}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all shadow-2xs cursor-pointer ${
              isComplete
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            <span>Mark as Complete</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Right-aligned Next Button */}
          <div className="flex-1 flex justify-end">
            {nextLesson ? (
              <Link
                href={getLessonHref(nextLesson.id, nextLesson.type)}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-purple-600 transition-colors"
              >
                <span>Next</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <Link
                href={`/courses/${courseSlug}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                <span>Finish Course →</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseLessonPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><div className="size-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" /></div>}>
      <CourseLessonContent />
    </Suspense>
  );
}
