"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { getCoursePlayerData } from "@/data/coursePlayerData";
import { cn } from "@/lib/utils";

// Inline SVG icons for the course player
const BackArrow = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
  </svg>
);

const QuizIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const AssignmentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#22C55E" />
    <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmptyCircle = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#D1D5DB" strokeWidth="2" />
  </svg>
);

const InProgressCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#7D52F4" strokeWidth="2" strokeDasharray="3 3" />
  </svg>
);

const FailedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#EF4444" />
    <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#F59E0B" />
    <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ResourcesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const AnnouncementIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LiveClassIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
  </svg>
);


const CertificateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function getLessonIcon(type: string) {
  switch (type) {
    case "video": return <VideoIcon />;
    case "quiz": return <QuizIcon />;
    case "assignment": return <AssignmentIcon />;
    default: return <BookIcon />;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed": return <CheckCircle />;
    case "failed": return <FailedIcon />;
    case "pending": return <PendingIcon />;
    case "in_progress": return <InProgressCircle />;
    default: return <EmptyCircle className="text-gray-300" />;
  }
}

function CoursePlayerContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  const currentLessonParam = searchParams.get("lesson");
  const firstLessonId = course?.topics[0]?.lessons[0]?.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<string[]>(
    course?.topics.map((t) => t.id) ?? []
  );
  const [showMore, setShowMore] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const sidebarNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname, currentLessonParam]);

  useEffect(() => {
    const scrollActiveIntoView = () => {
      const activeEl = sidebarNavRef.current?.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    };

    scrollActiveIntoView();
    const timer = setTimeout(scrollActiveIntoView, 100);
    return () => clearTimeout(timer);
  }, [pathname, currentLessonParam]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const isSecondaryPage =
    pathname.includes("/resources") ||
    pathname.includes("/announcements") ||
    pathname.includes("/live-classes") ||
    pathname.includes("/certificate") ||
    pathname.includes("/info");

  const moreLinks = [
    {
      label: "Resources",
      icon: <ResourcesIcon />,
      href: `/learn/${courseSlug}/resources`,
      isActive: pathname.includes("/resources"),
    },
    {
      label: "Announcements",
      icon: <AnnouncementIcon />,
      href: `/learn/${courseSlug}/announcements`,
      isActive: pathname.includes("/announcements"),
    },
    {
      label: "Live Classes",
      icon: <LiveClassIcon />,
      href: `/learn/${courseSlug}/live-classes`,
      isActive: pathname.includes("/live-classes"),
    },
    {
      label: "Certificate",
      icon: (
        <span className="relative inline-block">
          <CertificateIcon />
          <span className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white leading-none">
            🔒
          </span>
        </span>
      ),
      href: `/learn/${courseSlug}/certificate`,
      isActive: pathname.includes("/certificate"),
      action: () => setShowCertificateModal(true),
    },
    {
      label: "Course Info",
      icon: <InfoIcon />,
      href: `/learn/${courseSlug}/info`,
      isActive: pathname.includes("/info"),
    },
  ];

  const getLessonHref = (lessonId: string, type: string) => {
    if (type === "quiz") return `/learn/${courseSlug}/quiz/${lessonId}`;
    if (type === "assignment") return `/learn/${courseSlug}/assignment/${lessonId}`;
    return `/learn/${courseSlug}?lesson=${lessonId}`;
  };

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-100 px-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="flex items-center justify-center size-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          title="Back to Course Details"
        >
          <BackArrow />
        </Link>
        <h1 className="text-base font-semibold text-gray-900 truncate">
          {course.title}
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto flex items-center justify-center size-8 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          aria-label="Toggle curriculum sidebar"
        >
          <MenuIcon />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={cn(
            "flex shrink-0 flex-col border-r border-gray-100 bg-white transition-all duration-300 overflow-hidden",
            // Desktop in-flow sidebar
            "lg:w-72 lg:h-full lg:sticky lg:top-0",
            !sidebarOpen && "lg:w-0 lg:border-r-0",
            // Mobile fixed slide-over drawer
            "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-80 max-lg:max-w-[85vw] max-lg:shadow-2xl",
            !sidebarOpen && "max-lg:-translate-x-full"
          )}
        >
          <div
            ref={sidebarNavRef}
            className="flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Mobile drawer header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 lg:hidden">
              <span className="text-sm font-bold text-gray-900">Course Curriculum</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {course.percentCompleted}% Completed
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <RefreshIcon />
                </button>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all"
                  style={{ width: `${course.percentCompleted}%` }}
                />
              </div>
            </div>

            {/* Topics + Lessons */}
            <nav className="space-y-2">
              {course.topics.map((topic) => {
                const isExpanded = expandedTopics.includes(topic.id);
                return (
                  <div key={topic.id}>
                    {/* Topic Header */}
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="flex w-full items-center gap-2 py-1.5 text-left"
                    >
                      {topic.completed ? (
                        <CheckCircle />
                      ) : (
                        <EmptyCircle className="text-gray-300 shrink-0" />
                      )}
                      <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                        {topic.title}
                      </span>
                      {topic.lessons.length > 0 && (
                        <ChevronDown
                          className={cn(
                            "shrink-0 text-gray-400 transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      )}
                    </button>

                    {/* Lessons */}
                    {isExpanded && (
                      <div className="ml-5 mt-1 space-y-0.5 border-l border-gray-100">
                        {topic.lessons.map((lesson) => {
                          const isActive =
                            !isSecondaryPage &&
                            ((lesson.type === "quiz" && pathname.includes(`/quiz/${lesson.id}`)) ||
                              (lesson.type === "assignment" && pathname.includes(`/assignment/${lesson.id}`)) ||
                              (lesson.type !== "quiz" &&
                                lesson.type !== "assignment" &&
                                pathname === `/learn/${courseSlug}` &&
                                (currentLessonParam ? currentLessonParam === lesson.id : lesson.id === firstLessonId)));

                          return (
                            <Link
                              key={lesson.id}
                              href={getLessonHref(lesson.id, lesson.type)}
                              data-active={isActive ? "true" : undefined}
                              onClick={() => {
                                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                                  setSidebarOpen(false);
                                }
                              }}
                              className={cn(
                                "flex items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-all relative",
                                isActive
                                  ? "bg-gray-100 text-gray-900 border-l-[3px] border-purple-600 font-medium"
                                  : "hover:bg-gray-50 text-gray-600"
                              )}
                            >
                              <span className={cn("mt-0.5 shrink-0", isActive ? "text-purple-600" : "text-gray-400")}>
                                {getLessonIcon(lesson.type)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-sm leading-snug",
                                  isActive ? "font-semibold text-gray-900" : "text-gray-700"
                                )}>
                                  {lesson.title}
                                </p>
                                <p className="text-sm text-gray-500 capitalize mt-0.5">
                                  {lesson.type}
                                  {lesson.duration && ` - ${lesson.duration}`}
                                </p>
                              </div>
                              <span className="mt-0.5 shrink-0">
                                {getStatusIcon(lesson.status)}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Persistent Secondary Menu if on a secondary subpage (matching resources.PNG) */}
            {isSecondaryPage && (
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-1">
                {moreLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    data-active={link.isActive ? "true" : undefined}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors",
                      link.isActive
                        ? "bg-purple-50 text-purple-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span className={cn("shrink-0", link.isActive ? "text-purple-600" : "text-gray-400")}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* More Popover Trigger (matching more.PNG on lesson pages) */}
          {!isSecondaryPage && (
            <div className="relative border-t border-gray-100">
              {showMore && (
                <div className="absolute bottom-full left-0 right-0 mb-1 mx-2 rounded-xl border border-gray-100 bg-white shadow-xl py-2 z-10 animate-in fade-in slide-in-from-bottom-2">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors",
                        link.isActive && "bg-purple-50 text-purple-600 font-semibold"
                      )}
                    >
                      <span className="text-gray-500">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex w-full items-center gap-2 px-4 py-3.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MoreIcon />
                <span className="font-medium">More</span>
              </button>
            </div>
          )}

          {/* Collapse Sidebar toggle */}
          <div className="border-t border-gray-100 px-4 py-3 hidden lg:block">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center size-7 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Certificate Locked Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1 text-sm font-semibold text-amber-700 border border-amber-200">
              <span>🔒</span>
              <span>Certificate Locked</span>
            </div>

            {/* Illustration graphic */}
            <div className="mt-6 flex items-center justify-center rounded-2xl bg-purple-50/70 p-8">
              <div className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-8 py-10 shadow-xs">
                {/* Simulated Certificate document lines */}
                <div className="space-y-2 text-center opacity-40">
                  <div className="mx-auto h-2 w-20 rounded bg-gray-300" />
                  <div className="mx-auto h-1.5 w-32 rounded bg-gray-200" />
                  <div className="mx-auto h-1.5 w-24 rounded bg-gray-200" />
                  <div className="mx-auto h-1.5 w-16 rounded bg-gray-200" />
                </div>
                {/* Center Lock Badge */}
                <div className="absolute flex size-16 items-center justify-center rounded-full bg-purple-600 text-2xl text-white shadow-lg">
                  🔒
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Complete the course to unlock the certificate
            </h3>

            {/* Progress indicators */}
            <div className="mt-5">
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
            <button
              onClick={() => setShowCertificateModal(false)}
              className="mt-6 w-full rounded-2xl bg-purple-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-purple-700 transition-colors"
            >
              Okay, I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursePlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-white"><div className="size-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" /></div>}>
      <CoursePlayerContent>{children}</CoursePlayerContent>
    </Suspense>
  );
}

