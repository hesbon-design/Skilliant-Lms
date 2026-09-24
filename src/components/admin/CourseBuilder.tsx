"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CoursesIcon,
  CloseIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  FileTextIcon,
  ImageIcon,
  ExternalLinkIcon,
  MoreVerticalIcon,
  ArrowRightIcon,
  QuizIcon,
} from "@/app/admin/adminIcons";
import { cn } from "@/lib/utils";

export interface LessonItem {
  id: string;
  title: string;
  content: string;
  durationHours: number;
  durationMinutes: number;
  durationSeconds: number;
  videoUrl?: string;
  videoType?: string;
  isFreePreview: boolean;
  exerciseFilesCount: number;
  featuredImage?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  type: "Multiple Choice" | "Single Choice" | "True/False";
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  points: number;
  multipleCorrect: boolean;
  isRequired: boolean;
  randomize: boolean;
  displayPoints: boolean;
}

export interface QuizItem {
  id: string;
  title: string;
  passingGrade: number;
  questionOrder: "Random" | "Sequential";
  allowMultipleAttempts: boolean;
  maxAttempts: number;
  timeLimitMinutes: number;
  layout: "Single Question" | "Full Page";
  showPagination: boolean;
  revealAnswers: boolean;
  hidePreviousButton: boolean;
  hideQuestionNumber: boolean;
  questions: QuizQuestion[];
}

export interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
  passingMarks: number;
  deadlineDays: number;
}

export interface TopicItem {
  id: string;
  title: string;
  summary: string;
  isExpanded: boolean;
  lessons: LessonItem[];
  quizzes: QuizItem[];
  assignments: AssignmentItem[];
}

interface CourseBuilderProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    level?: string;
    isPublic?: boolean;
    visibility?: string;
    featuredImage?: string;
    introVideoUrl?: string;
    pricingModel?: "Free" | "Paid";
    price?: string;
    category?: string;
    tags?: string;
    topics?: TopicItem[];
    whatWillLearn?: string;
    targetAudience?: string;
    durationHours?: number;
    durationMinutes?: number;
    materialsIncluded?: string;
    requirements?: string;
    certificateTemplate?: string;
  };
  isEditMode?: boolean;
}

// Reusable iOS-style toggle slider switch matching Tutor LMS
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-[#7D52F4]" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function CourseBuilder({
  initialData,
  isEditMode = false,
}: CourseBuilderProps) {
  const router = useRouter();

  // Wizard Step State: 1 = Basics, 2 = Curriculum, 3 = Additional
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basics Form State
  const [title, setTitle] = useState(
    initialData?.title || "Mastering Workplace Communication"
  );
  const [slug, setSlug] = useState(
    initialData?.slug || "mastering-workplace-communication"
  );
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [description, setDescription] = useState(
    initialData?.description ||
      "A comprehensive, practical course to improve clarity, writing, presentations, and team collaboration. It combines frameworks, templates, and practice exercises to make communication more effective across functions.\n\nDesigned for managers and professionals who want immediate, workplace-ready improvements."
  );
  const [descTab, setDescTab] = useState<"visual" | "code">("visual");

  // Options Box States (Images 1, 2, 3)
  const [activeOptionTab, setActiveOptionTab] = useState<
    "General" | "Content Drip" | "Enrollment"
  >("General");
  const [difficultyLevel, setDifficultyLevel] = useState(
    initialData?.level || "Intermediate"
  );
  const [isPublicCourse, setIsPublicCourse] = useState(
    initialData?.isPublic ?? false
  );
  const [contentDripType, setContentDripType] = useState<
    | "schedule_date"
    | "days_after"
    | "sequential"
    | "prerequisites"
    | "none"
  >("none");
  const [maxStudents, setMaxStudents] = useState<number>(0);
  const [courseEnrollmentPeriod, setCourseEnrollmentPeriod] = useState<boolean>(false);
  const [pauseEnrollment, setPauseEnrollment] = useState<boolean>(false);

  // Right Column Basics
  const [visibility, setVisibility] = useState(initialData?.visibility || "Public");
  const [isScheduled, setIsScheduled] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage ||
      "/images/courses/Communication-Skill_-Mastering-Workplace-Communication.webp"
  );
  const [introVideoUrl, setIntroVideoUrl] = useState(initialData?.introVideoUrl || "");
  const [pricingModel, setPricingModel] = useState<"Free" | "Paid">(
    initialData?.pricingModel || "Free"
  );
  const [price, setPrice] = useState(initialData?.price || "$49.00");
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Communication Skills",
  ]);
  const [tagsList, setTagsList] = useState<string[]>([
    "Career Growth",
    "Communication",
    "Corporate",
  ]);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState("admin (dev-email@wpengine.local)");
  const [instructorSearch, setInstructorSearch] = useState("");
  const [instructors, setInstructors] = useState<string[]>([]);

  // Publish / Actions Dropdown & Toast
  const [publishDropdownOpen, setPublishDropdownOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Step 2: Curriculum State
  const [topics, setTopics] = useState<TopicItem[]>(
    initialData?.topics || [
      {
        id: "topic-1",
        title: "Communication Fundamentals",
        summary: "Understand foundational verbal, vocal, and non-verbal message transmission.",
        isExpanded: true,
        lessons: [
          {
            id: "les-1",
            title: "Principles of Effective Communication",
            content: "Explore the core 7 C's of communication and how they apply across organizational tiers.",
            durationHours: 0,
            durationMinutes: 18,
            durationSeconds: 0,
            isFreePreview: true,
            exerciseFilesCount: 1,
            featuredImage: "",
          },
          {
            id: "les-2",
            title: "Verbal vs. Non-Verbal Communication",
            content: "Learn how micro-expressions, posture, and active listening cues alter team dynamics.",
            durationHours: 0,
            durationMinutes: 24,
            durationSeconds: 30,
            isFreePreview: false,
            exerciseFilesCount: 2,
            featuredImage: "",
          },
          {
            id: "les-3",
            title: "Listening Skills & Active Feedback",
            content: "Techniques for active paraphrasing, supportive silence, and non-defensive questioning.",
            durationHours: 0,
            durationMinutes: 15,
            durationSeconds: 45,
            isFreePreview: false,
            exerciseFilesCount: 1,
            featuredImage: "",
          },
        ],
        quizzes: [
          {
            id: "quiz-1",
            title: "Evaluate Your Daily Communication Style",
            passingGrade: 80,
            questionOrder: "Random",
            allowMultipleAttempts: true,
            maxAttempts: 3,
            timeLimitMinutes: 15,
            layout: "Single Question",
            showPagination: true,
            revealAnswers: true,
            hidePreviousButton: false,
            hideQuestionNumber: false,
            questions: [
              {
                id: "q-1",
                title: "Which element accounts for the largest proportion of face-to-face message interpretation?",
                type: "Multiple Choice",
                options: [
                  { id: "opt-1", text: "Body language and non-verbal cues", isCorrect: true },
                  { id: "opt-2", text: "Verbal word choices strictly", isCorrect: false },
                  { id: "opt-3", text: "Font size in presentations", isCorrect: false },
                ],
                explanation: "Mehrabian's communication model highlights the impact of non-verbal signals in interpersonal dialogue.",
                points: 1,
                multipleCorrect: false,
                isRequired: true,
                randomize: true,
                displayPoints: true,
              },
            ],
          },
          {
            id: "quiz-2",
            title: "Communication Basics",
            passingGrade: 75,
            questionOrder: "Sequential",
            allowMultipleAttempts: true,
            maxAttempts: 2,
            timeLimitMinutes: 10,
            layout: "Full Page",
            showPagination: false,
            revealAnswers: true,
            hidePreviousButton: false,
            hideQuestionNumber: false,
            questions: [
              {
                id: "q-21",
                title: "What is the primary objective of active listening?",
                type: "Multiple Choice",
                options: [
                  { id: "opt-211", text: "To fully understand before evaluating or formulating a response", isCorrect: true },
                  { id: "opt-212", text: "To win the debate immediately", isCorrect: false },
                ],
                explanation: "Active listening prioritizes mutual clarity over rapid rebuttal.",
                points: 1,
                multipleCorrect: false,
                isRequired: true,
                randomize: false,
                displayPoints: true,
              },
            ],
          },
        ],
        assignments: [],
      },
      {
        id: "topic-2",
        title: "Team Communication Techniques",
        summary: "Cross-functional synchronization, standup protocols, and asynchronous documentation.",
        isExpanded: false,
        lessons: [
          {
            id: "les-4",
            title: "Leading High-Impact Team Briefings",
            content: "Structure 15-minute syncs that eliminate roadblocks without draining energy.",
            durationHours: 0,
            durationMinutes: 20,
            durationSeconds: 0,
            isFreePreview: false,
            exerciseFilesCount: 1,
            featuredImage: "",
          },
        ],
        quizzes: [],
        assignments: [],
      },
      {
        id: "topic-3",
        title: "Professional Writing Skills",
        summary: "Executive summaries, concise emails, and technical documentation.",
        isExpanded: false,
        lessons: [],
        quizzes: [],
        assignments: [],
      },
      {
        id: "topic-4",
        title: "Conflict Resolution & Negotiation",
        summary: "De-escalation frameworks, interest-based bargaining, and constructive mediation.",
        isExpanded: false,
        lessons: [],
        quizzes: [],
        assignments: [],
      },
      {
        id: "topic-5",
        title: "Developing EI in Your Organization",
        summary: "Emotional self-regulation, empathy in high-pressure leadership, and organizational trust.",
        isExpanded: false,
        lessons: [],
        quizzes: [],
        assignments: [],
      },
    ]
  );

  // Hover states for lessons and topics
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);

  // Drag and drop state for topics and lessons
  const [draggedTopicIdx, setDraggedTopicIdx] = useState<number | null>(null);
  const [dragOverTopicIdx, setDragOverTopicIdx] = useState<number | null>(null);
  const [draggedLessonInfo, setDraggedLessonInfo] = useState<{
    topicId: string;
    index: number;
  } | null>(null);
  const [dragOverLessonInfo, setDragOverLessonInfo] = useState<{
    topicId: string;
    index: number;
  } | null>(null);

  // Step 3: Additional Form State
  const [whatWillLearn, setWhatWillLearn] = useState(
    initialData?.whatWillLearn ||
      "Core principles of clear verbal and written communication\nStructuring messages for different audiences (executives, peers)"
  );
  const [targetAudience, setTargetAudience] = useState(
    initialData?.targetAudience ||
      "Specify the target audience that will benefit the most from the course. (One Line Per target audience)"
  );
  const [durationHours, setDurationHours] = useState(initialData?.durationHours ?? 26);
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes ?? 0);
  const [materialsIncluded, setMaterialsIncluded] = useState(
    initialData?.materialsIncluded ||
      "Downloadable Communication Planning Template (PDF)\nTeam Meeting Checklist (Google Docs)\nSlide Deck: Effective Communication Models\nSample Email Scripts for Common Scenarios"
  );
  const [requirements, setRequirements] = useState(
    initialData?.requirements ||
      "No prerequisites; suitable for all professional levels\nWillingness to practice presentations and writing task"
  );
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>([]);
  const [prereqSearch, setPrereqSearch] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);

  // Modals State
  const [editingLesson, setEditingLesson] = useState<{
    topicId: string;
    topicTitle: string;
    lesson: LessonItem;
  } | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{
    topicId: string;
    quiz: QuizItem;
  } | null>(null);
  const [quizModalTab, setQuizModalTab] = useState<"Question Details" | "Settings">(
    "Question Details"
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Notice helper
  const showNotice = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditingSlug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  // Toggle Topic Expand
  const toggleTopicExpand = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExpanded: !t.isExpanded } : t))
    );
  };

  // Expand / Collapse All
  const expandAllTopics = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, isExpanded: true })));
  };
  const collapseAllTopics = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, isExpanded: false })));
  };

  // Topic Actions
  const handleAddTopic = () => {
    const newTopic: TopicItem = {
      id: `topic-${Date.now()}`,
      title: `New Module Topic ${topics.length + 1}`,
      summary: "Add a concise module summary and practical competency focus.",
      isExpanded: true,
      lessons: [],
      quizzes: [],
      assignments: [],
    };
    setTopics([...topics, newTopic]);
    showNotice("Added new topic module");
  };

  const handleCopyTopic = (topic: TopicItem) => {
    const clone: TopicItem = {
      ...topic,
      id: `topic-${Date.now()}`,
      title: `${topic.title} (Copy)`,
      lessons: topic.lessons.map((l) => ({
        ...l,
        id: `les-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      })),
      quizzes: topic.quizzes.map((q) => ({
        ...q,
        id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      })),
      assignments: topic.assignments.map((a) => ({
        ...a,
        id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      })),
    };
    setTopics([...topics, clone]);
    showNotice(`Duplicated topic "${topic.title}"`);
  };

  const handleDeleteTopic = (id: string) => {
    if (confirm("Are you sure you want to delete this topic and all its contents?")) {
      setTopics(topics.filter((t) => t.id !== id));
      showNotice("Deleted topic");
    }
  };

  // Reorder Topics
  const handleReorderTopics = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const updated = [...topics];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setTopics(updated);
    showNotice("Reordered topic");
  };

  // Reorder Lessons within Topic
  const handleReorderLessons = (
    topicId: string,
    fromIdx: number,
    toIdx: number
  ) => {
    if (fromIdx === toIdx) return;
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newLessons = [...t.lessons];
        const [moved] = newLessons.splice(fromIdx, 1);
        newLessons.splice(toIdx, 0, moved);
        return { ...t, lessons: newLessons };
      })
    );
    showNotice("Reordered lesson");
  };

  // Lesson CRUD
  const handleOpenNewLesson = (topic: TopicItem) => {
    const newLesson: LessonItem = {
      id: `les-${Date.now()}`,
      title: "New Lesson",
      content: "",
      durationHours: 0,
      durationMinutes: 10,
      durationSeconds: 0,
      videoUrl: "",
      isFreePreview: false,
      exerciseFilesCount: 0,
      featuredImage: "",
    };
    setEditingLesson({
      topicId: topic.id,
      topicTitle: topic.title,
      lesson: newLesson,
    });
  };

  const handleCopyLesson = (topicId: string, lesson: LessonItem) => {
    const clone: LessonItem = {
      ...lesson,
      id: `les-${Date.now()}`,
      title: `${lesson.title} (Copy)`,
    };
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, lessons: [...t.lessons, clone] } : t
      )
    );
    showNotice(`Duplicated lesson "${lesson.title}"`);
  };

  const handleDeleteLesson = (topicId: string, lessonId: string) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? { ...t, lessons: t.lessons.filter((l) => l.id !== lessonId) }
          : t
      )
    );
    showNotice("Deleted lesson");
  };

  const handleSaveLessonModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    const { topicId, lesson } = editingLesson;
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const existingIdx = t.lessons.findIndex((l) => l.id === lesson.id);
        if (existingIdx >= 0) {
          const updated = [...t.lessons];
          updated[existingIdx] = lesson;
          return { ...t, lessons: updated };
        } else {
          return { ...t, lessons: [...t.lessons, lesson] };
        }
      })
    );
    showNotice(`Saved lesson "${lesson.title}"`);
    setEditingLesson(null);
  };

  // Save Course
  const handlePublishCourse = () => {
    showNotice(
      isEditMode
        ? "Course updated successfully!"
        : "Course published successfully!"
    );
    setTimeout(() => {
      router.push("/admin/courses");
    }, 1200);
  };

  // Categories list
  const ALL_CATEGORIES = [
    "AI + Data",
    "Cloud + IT Ops",
    "Communication Skills",
    "Data & AI",
    "Development",
    "HR and Workplace",
    "Leadership and Management",
    "Security",
  ];

  const filteredCategories = ALL_CATEGORIES.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-base">
      {/* ================= BREADCRUMB NAVIGATION (No background) ================= */}
      <div className="flex items-center justify-between px-6 sm:px-8 pt-5 pb-2 bg-transparent shrink-0">
        {/* Left: Title & Wizard Steps */}
        <div className="flex items-center gap-4 sm:gap-8">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 whitespace-nowrap">
            Course Builder
          </h1>

          {/* Stepper Navigation Pills: 1 Basics — 2 Curriculum — 3 Additional */}
          <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors cursor-pointer",
                currentStep === 1
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              <span
                className={cn(
                  "flex size-6 sm:size-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold shrink-0",
                  currentStep === 1
                    ? "bg-[#7D52F4] text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                1
              </span>
              <span>Basics</span>
            </button>

            <span className="text-gray-300 select-none font-medium">—</span>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors cursor-pointer",
                currentStep === 2
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              <span
                className={cn(
                  "flex size-6 sm:size-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold shrink-0",
                  currentStep === 2
                    ? "bg-[#7D52F4] text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                2
              </span>
              <span>Curriculum</span>
            </button>

            <span className="text-gray-300 select-none font-medium">—</span>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors cursor-pointer",
                currentStep === 3
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              <span
                className={cn(
                  "flex size-6 sm:size-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold shrink-0",
                  currentStep === 3
                    ? "bg-[#7D52F4] text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                3
              </span>
              <span>Additional</span>
            </button>
          </div>
        </div>

        {/* Right Action Controls: Preview ↗, Update ⌵, Close ✕ */}
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-gray-600 hover:text-[#7D52F4] px-2 py-1.5 transition-colors"
          >
            <span>Preview</span>
            <ExternalLinkIcon className="size-4 text-gray-400" />
          </Link>

          {/* Update Split Button */}
          <div className="relative inline-flex rounded-lg shadow-xs">
            <button
              type="button"
              onClick={handlePublishCourse}
              className="bg-[#7D52F4] hover:bg-purple-700 text-white px-5 py-2 text-sm sm:text-base font-semibold rounded-l-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setPublishDropdownOpen(!publishDropdownOpen)}
              className="bg-[#7D52F4] hover:bg-purple-700 border-l border-purple-400 text-white px-2.5 py-2 rounded-r-lg transition-colors shadow-xs"
              title="More update actions"
            >
              <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {publishDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setPublishDropdownOpen(false);
                    showNotice("Draft saved successfully");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </button>
                <Link
                  href={`/courses/${slug}`}
                  target="_blank"
                  onClick={() => setPublishDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Preview Course</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setPublishDropdownOpen(false);
                    if (confirm("Move course to trash?")) {
                      router.push("/admin/courses");
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Move to Trash
                </button>
              </div>
            )}
          </div>

          {/* Close Builder Cross */}
          <Link
            href="/admin/courses"
            className="flex size-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Close Course Builder"
          >
            <CloseIcon className="size-5" />
          </Link>
        </div>
      </div>

      {/* Floating Notice Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{saveToast}</span>
            </div>
            <button
              onClick={() => setSaveToast(null)}
              className="ml-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex-1 px-6 sm:px-8 py-5 max-w-7xl mx-auto w-full">
        {/* ================= STEP 1: BASICS ================= */}
        {currentStep === 1 && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Title, Description, Options Card */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Course title..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-11 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none shadow-2xs"
                  />
                  {title && (
                    <button
                      type="button"
                      onClick={() => handleTitleChange("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear title"
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  )}
                </div>

                {/* Course URL Permalink with pencil editor */}
                <div className="flex items-center gap-2 text-sm text-gray-500 pt-0.5">
                  <span>Course URL:</span>
                  {isEditingSlug ? (
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      onBlur={() => setIsEditingSlug(false)}
                      autoFocus
                      className="rounded border border-purple-300 px-2 py-0.5 text-sm text-purple-700 focus:outline-none"
                    />
                  ) : (
                    <span className="text-gray-700 font-medium underline decoration-dotted">
                      http://tutorlms.local/courses/{slug}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    className="text-gray-400 hover:text-gray-700 ml-0.5"
                    title="Edit slug"
                  >
                    <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description Rich Editor */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Description
                </label>

                <div className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-2xs">
                  {/* Top Bar: Add media + Visual/Code tabs */}
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 bg-gray-50/70">
                    <button
                      type="button"
                      onClick={() => showNotice("Media Library selector opened")}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ImageIcon className="size-4 text-purple-600" />
                      <span>Add media</span>
                    </button>

                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white text-sm">
                      <button
                        type="button"
                        onClick={() => setDescTab("visual")}
                        className={cn(
                          "px-3.5 py-1.5 font-medium transition-colors",
                          descTab === "visual"
                            ? "bg-gray-100 text-gray-900 font-semibold"
                            : "text-gray-500 hover:text-gray-800"
                        )}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescTab("code")}
                        className={cn(
                          "px-3.5 py-1.5 font-medium transition-colors border-l border-gray-200",
                          descTab === "code"
                            ? "bg-gray-100 text-gray-900 font-semibold"
                            : "text-gray-500 hover:text-gray-800"
                        )}
                      >
                        Code
                      </button>
                    </div>
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 px-4 py-2 text-sm text-gray-600 bg-white">
                    <select className="rounded border border-gray-300 px-2.5 py-1 text-sm bg-white text-gray-700 focus:outline-none">
                      <option>Paragraph</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                      <option>Heading 3</option>
                    </select>

                    <span className="text-gray-300 mx-1.5">|</span>

                    <button type="button" className="p-1.5 font-bold rounded hover:bg-gray-100" title="Bold">
                      B
                    </button>
                    <button type="button" className="p-1.5 italic rounded hover:bg-gray-100" title="Italic">
                      I
                    </button>
                    <button type="button" className="p-1.5 underline rounded hover:bg-gray-100" title="Underline">
                      U
                    </button>

                    <span className="text-gray-300 mx-1.5">|</span>

                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Bullet List">
                      •≡
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Numbered List">
                      1≡
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Quote">
                      “
                    </button>

                    <span className="text-gray-300 mx-1.5">|</span>

                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Align Left">
                      ⫷
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Align Center">
                      ≡
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Align Right">
                      ⫸
                    </button>

                    <span className="text-gray-300 mx-1.5">|</span>

                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Insert Link">
                      🔗
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Code">
                      {"{}"}
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-gray-100" title="Table">
                      ▦
                    </button>
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 text-sm sm:text-base text-gray-800 leading-relaxed focus:outline-none resize-y"
                    placeholder="Enter detailed course overview..."
                  />
                </div>
              </div>

              {/* ================= OPTIONS BOX (Matching Screenshots 1, 2, 3) ================= */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Options
                </label>

                <div className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-2xs flex flex-col md:flex-row min-h-[220px]">
                  {/* Left Sidebar Tabs: General, Content Drip, Enrollment */}
                  <div className="w-full md:w-48 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-gray-200 py-2 flex md:flex-col shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveOptionTab("General")}
                      className={cn(
                        "w-full text-left px-5 py-3.5 text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer",
                        activeOptionTab === "General"
                          ? "bg-white text-purple-900 border-l-4 border-[#7D52F4] shadow-2xs"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                      )}
                    >
                      <span className={activeOptionTab === "General" ? "text-purple-600" : "text-gray-500"}>⚙</span>
                      <span>General</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOptionTab("Content Drip")}
                      className={cn(
                        "w-full text-left px-5 py-3.5 text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer",
                        activeOptionTab === "Content Drip"
                          ? "bg-white text-purple-900 border-l-4 border-[#7D52F4] shadow-2xs"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                      )}
                    >
                      <span className={activeOptionTab === "Content Drip" ? "text-purple-600" : "text-gray-500"}>🕒</span>
                      <span>Content Drip</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOptionTab("Enrollment")}
                      className={cn(
                        "w-full text-left px-5 py-3.5 text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer",
                        activeOptionTab === "Enrollment"
                          ? "bg-white text-purple-900 border-l-4 border-[#7D52F4] shadow-2xs"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                      )}
                    >
                      <span className={activeOptionTab === "Enrollment" ? "text-purple-600" : "text-gray-500"}>🔄</span>
                      <span>Enrollment</span>
                    </button>
                  </div>

                  {/* Right Content Area */}
                  <div className="flex-1 p-6">
                    {/* TAB 1: GENERAL (Image 1) */}
                    {activeOptionTab === "General" && (
                      <div className="space-y-5 max-w-md">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <label className="text-sm font-semibold text-gray-800">
                              Difficulty Level
                            </label>
                            <span className="text-gray-400 text-sm cursor-help" title="Skill level recommended for trainees">
                              ⓘ
                            </span>
                          </div>
                          <select
                            value={difficultyLevel}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                          >
                            <option value="All Levels">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-800">
                              Public Course
                            </span>
                            <span className="text-gray-400 text-sm cursor-help" title="When enabled, anyone can view course content without enrollment">
                              ⓘ
                            </span>
                          </div>
                          <ToggleSwitch
                            checked={isPublicCourse}
                            onChange={setIsPublicCourse}
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 2: CONTENT DRIP (Image 2) */}
                    {activeOptionTab === "Content Drip" && (
                      <div className="space-y-4 max-w-lg">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-gray-900">
                            Content Drip Type
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            You can schedule your course content using one of the following Content Drip options
                          </p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-700 pt-1">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="contentDrip"
                              value="schedule_date"
                              checked={contentDripType === "schedule_date"}
                              onChange={() => setContentDripType("schedule_date")}
                              className="size-4 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                            />
                            <span>Schedule course content by date</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="contentDrip"
                              value="days_after"
                              checked={contentDripType === "days_after"}
                              onChange={() => setContentDripType("days_after")}
                              className="size-4 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                            />
                            <span>Content available after X days from enrollment</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="contentDrip"
                              value="sequential"
                              checked={contentDripType === "sequential"}
                              onChange={() => setContentDripType("sequential")}
                              className="size-4 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                            />
                            <span>Course content available sequentially</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="contentDrip"
                              value="prerequisites"
                              checked={contentDripType === "prerequisites"}
                              onChange={() => setContentDripType("prerequisites")}
                              className="size-4 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                            />
                            <span>Course content unlocked after finishing prerequisites</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="contentDrip"
                              value="none"
                              checked={contentDripType === "none"}
                              onChange={() => setContentDripType("none")}
                              className="size-4 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                            />
                            <span className="font-semibold text-gray-900">None</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: ENROLLMENT (Image 3) */}
                    {activeOptionTab === "Enrollment" && (
                      <div className="space-y-5 max-w-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <label className="text-sm font-semibold text-gray-800">
                              Maximum Student
                            </label>
                            <span className="text-gray-400 text-sm cursor-help" title="Set 0 for unlimited students">
                              ⓘ
                            </span>
                          </div>
                          <input
                            type="number"
                            value={maxStudents}
                            onChange={(e) => setMaxStudents(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3.5">
                          <span className="text-sm font-semibold text-gray-800">
                            Course Enrollment Period
                          </span>
                          <ToggleSwitch
                            checked={courseEnrollmentPeriod}
                            onChange={setCourseEnrollmentPeriod}
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pauseEnrollment}
                              onChange={(e) => setPauseEnrollment(e.target.checked)}
                              className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                            />
                            <span className="text-sm font-semibold text-gray-800">
                              Pause Enrollment
                            </span>
                          </label>
                          <p className="text-xs text-gray-500 pl-6.5">
                            If you pause enrolment, students will no longer be able to enroll in the course.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next > Step Button under Options card matching theme button system */}
                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 rounded-xl bg-[#7D52F4] px-6 py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-purple-700 shadow-xs transition-colors"
                  >
                    <span>Next: Curriculum</span>
                    <span>&gt;</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Visibility, Schedule, Featured Image, Video, Pricing, Categories, Tags, Author, Instructors */}
            <div className="lg:col-span-4 space-y-5">
              {/* Visibility */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">
                  Visibility
                </label>
                <div className="relative">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none cursor-pointer"
                  >
                    <option value="Public">👁 Public</option>
                    <option value="Private">🔒 Private</option>
                    <option value="Password Protected">🔑 Password Protected</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 pt-0.5">
                  Last updated on 17th September, 2025
                </p>
              </div>

              {/* Schedule */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-2xs">
                <span className="text-sm font-semibold text-gray-800">Schedule</span>
                <ToggleSwitch checked={isScheduled} onChange={setIsScheduled} />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Featured Image
                </label>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-2xs group">
                  <Image
                    src={featuredImage}
                    alt="Course Featured"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => showNotice("Image updated from media library")}
                      className="rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-white"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Intro Video */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Intro Video
                </label>
                <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center">
                  <button
                    type="button"
                    onClick={() => showNotice("Select video file to upload")}
                    className="flex items-center gap-2 rounded-lg bg-purple-50 border border-purple-200 px-4 py-2 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors"
                  >
                    <VideoIcon className="size-4" />
                    <span>Upload Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt("Enter video URL (YouTube, Vimeo, MP4):", introVideoUrl);
                      if (url !== null) setIntroVideoUrl(url);
                    }}
                    className="text-sm text-[#7D52F4] hover:text-purple-700 hover:underline mt-2.5 cursor-pointer font-medium"
                  >
                    Add from URL
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    MP4, and WebM formats, up to 300 MB
                  </p>
                </div>
              </div>

              {/* Pricing Model */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Pricing Model
                </label>
                <div className="flex items-center gap-5 text-sm text-gray-800 pt-0.5">
                  <label className="flex items-center gap-2.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="pricing"
                      value="Free"
                      checked={pricingModel === "Free"}
                      onChange={() => setPricingModel("Free")}
                      className="size-4 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                    />
                    <span>Free</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="pricing"
                      value="Paid"
                      checked={pricingModel === "Paid"}
                      onChange={() => setPricingModel("Paid")}
                      className="size-4 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                    />
                    <span>Paid</span>
                  </label>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Categories
                </label>
                <div className="rounded-xl border border-gray-300 bg-white p-3.5 space-y-3 shadow-2xs">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-8 pr-3 text-sm text-gray-800 focus:outline-none focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4]"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      🔍
                    </span>
                  </div>

                  {/* List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto [scrollbar-width:thin] text-sm text-gray-700">
                    {filteredCategories.map((cat) => {
                      const isChecked = selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, cat]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter((c) => c !== cat)
                                );
                              }
                            }}
                            className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                          />
                          <span>{cat}</span>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt("Enter new category name:");
                      if (name) setSelectedCategories([...selectedCategories, name]);
                    }}
                    className="flex items-center gap-1.5 text-sm text-[#7D52F4] font-semibold hover:underline pt-1 cursor-pointer"
                  >
                    <span>+ Add</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Tags
                </label>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagInput.trim()) {
                        e.preventDefault();
                        if (!tagsList.includes(tagInput.trim())) {
                          setTagsList([...tagsList, tagInput.trim()]);
                        }
                        setTagInput("");
                      }
                    }}
                    placeholder="Add tags"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                  />

                  {/* Tags Badges with ✕ */}
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => setTagsList(tagsList.filter((t) => t !== tag))}
                          className="text-gray-400 hover:text-gray-600 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Author
                </label>
                <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-bold">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none">admin</p>
                      <p className="text-xs text-gray-500 leading-none mt-1">
                        dev-email@wpengine.local
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">⌵</span>
                </div>
              </div>

              {/* Instructors */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Instructors
                </label>
                <div className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={instructorSearch}
                      onChange={(e) => setInstructorSearch(e.target.value)}
                      placeholder="Search to add instructor"
                      className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      🔍
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 text-center py-2.5">
                    No instructors added.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CURRICULUM ================= */}
        {currentStep === 2 && (
          <div className="space-y-5">
            {/* Curriculum Header Bar: ← Curriculum, Expand All */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex size-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs text-base"
                  title="Back to Basics"
                >
                  ←
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Curriculum</h2>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={expandAllTopics}
                  className="text-sm font-semibold text-gray-600 hover:text-[#7D52F4] transition-colors"
                >
                  Expand All
                </button>
                <span className="text-gray-300 font-medium">|</span>
                <button
                  type="button"
                  onClick={collapseAllTopics}
                  className="text-sm font-semibold text-gray-600 hover:text-[#7D52F4] transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Topics Modules List */}
            <div className="space-y-4">
              {topics.map((topic, topicIdx) => {
                const isHovered = hoveredTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", topicIdx.toString());
                      e.dataTransfer.effectAllowed = "move";
                      setDraggedTopicIdx(topicIdx);
                    }}
                    onDragEnd={() => {
                      setDraggedTopicIdx(null);
                      setDragOverTopicIdx(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverTopicIdx !== topicIdx) setDragOverTopicIdx(topicIdx);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedTopicIdx !== null) {
                        handleReorderTopics(draggedTopicIdx, topicIdx);
                      }
                      setDraggedTopicIdx(null);
                      setDragOverTopicIdx(null);
                    }}
                    onMouseEnter={() => setHoveredTopicId(topic.id)}
                    onMouseLeave={() => setHoveredTopicId(null)}
                    className={cn(
                      "rounded-xl border bg-white shadow-2xs transition-all overflow-hidden",
                      draggedTopicIdx === topicIdx && "opacity-40 border-dashed border-[#7D52F4]",
                      dragOverTopicIdx === topicIdx && "border-t-2 border-t-[#7D52F4] bg-purple-50/30",
                      topic.isExpanded ? "border-gray-300" : "border-gray-200"
                    )}
                  >
                    {/* TOPIC HEADER ROW: 6-dots icon, Title, on hover: edit, copy, delete, collapse */}
                    <div
                      onClick={() => toggleTopicExpand(topic.id)}
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer transition-colors select-none",
                        topic.isExpanded ? "bg-white hover:bg-gray-50/60" : "bg-gray-50/70 hover:bg-gray-100/70"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                        {/* 6-dot drag grip handle */}
                        <div
                          className="p-1 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing shrink-0"
                          title="Drag to reorder topic"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="size-4.5" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="9" cy="6" r="1.5" />
                            <circle cx="15" cy="6" r="1.5" />
                            <circle cx="9" cy="12" r="1.5" />
                            <circle cx="15" cy="12" r="1.5" />
                            <circle cx="9" cy="18" r="1.5" />
                            <circle cx="15" cy="18" r="1.5" />
                          </svg>
                        </div>

                        {/* Topic Title: Softer font color & weight, not harsh jet black */}
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 truncate">
                          {topic.title}
                        </h3>
                      </div>

                      {/* Right Action Icons (Revealed on hover / controls) */}
                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Edit Topic Title */}
                        <button
                          type="button"
                          onClick={() => {
                            const newTitle = prompt("Edit Topic Title:", topic.title);
                            if (newTitle) {
                              setTopics(
                                topics.map((t) =>
                                  t.id === topic.id ? { ...t, title: newTitle } : t
                                )
                              );
                              showNotice("Updated topic title");
                            }
                          }}
                          className={cn(
                            "p-2 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-opacity",
                            isHovered ? "opacity-100" : "opacity-0 sm:opacity-40"
                          )}
                          title="Edit Topic"
                        >
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Copy Topic */}
                        <button
                          type="button"
                          onClick={() => handleCopyTopic(topic)}
                          className={cn(
                            "p-2 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-opacity",
                            isHovered ? "opacity-100" : "opacity-0 sm:opacity-40"
                          )}
                          title="Duplicate Topic"
                        >
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>

                        {/* Delete Topic */}
                        <button
                          type="button"
                          onClick={() => handleDeleteTopic(topic.id)}
                          className={cn(
                            "p-2 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-opacity",
                            isHovered ? "opacity-100" : "opacity-0 sm:opacity-40"
                          )}
                          title="Delete Topic"
                        >
                          <Trash2Icon className="size-4" />
                        </button>

                        {/* Collapse / Expand Toggle Chevron */}
                        <button
                          type="button"
                          onClick={() => toggleTopicExpand(topic.id)}
                          className="p-2 rounded text-gray-400 hover:text-gray-700 transition-transform"
                          title={topic.isExpanded ? "Collapse Topic" : "Expand Topic"}
                        >
                          <svg
                            className={cn(
                              "size-4.5 transition-transform duration-200",
                              topic.isExpanded ? "rotate-180" : "rotate-0"
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED TOPIC BODY: Lessons & Quizzes List with Hover transformation & Drag */}
                    {topic.isExpanded && (
                      <div className="border-t border-gray-100 bg-[#FBFBFC] p-4 sm:p-5 space-y-3">
                        {/* Lessons List */}
                        {topic.lessons.map((les, lIdx) => {
                          const isLesHovered = hoveredLessonId === les.id;
                          return (
                            <div
                              key={les.id}
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                e.dataTransfer.setData("text/plain", lIdx.toString());
                                e.dataTransfer.effectAllowed = "move";
                                setDraggedLessonInfo({ topicId: topic.id, index: lIdx });
                              }}
                              onDragEnd={() => {
                                setDraggedLessonInfo(null);
                                setDragOverLessonInfo(null);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = "move";
                                if (
                                  dragOverLessonInfo?.topicId !== topic.id ||
                                  dragOverLessonInfo?.index !== lIdx
                                ) {
                                  setDragOverLessonInfo({ topicId: topic.id, index: lIdx });
                                }
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (
                                  draggedLessonInfo &&
                                  draggedLessonInfo.topicId === topic.id
                                ) {
                                  handleReorderLessons(topic.id, draggedLessonInfo.index, lIdx);
                                }
                                setDraggedLessonInfo(null);
                                setDragOverLessonInfo(null);
                              }}
                              onMouseEnter={() => setHoveredLessonId(les.id)}
                              onMouseLeave={() => setHoveredLessonId(null)}
                              onClick={() =>
                                setEditingLesson({
                                  topicId: topic.id,
                                  topicTitle: topic.title,
                                  lesson: les,
                                })
                              }
                              className={cn(
                                "flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer select-none",
                                isLesHovered
                                  ? "border-gray-200 bg-white shadow-xs"
                                  : "border-transparent bg-transparent hover:border-gray-200/80 hover:bg-white/70",
                                draggedLessonInfo?.topicId === topic.id &&
                                  draggedLessonInfo?.index === lIdx &&
                                  "opacity-30 border-dashed border-[#7D52F4]"
                              )}
                            >
                              {/* Left: Book icon transforms to 3-bar on hover + Title */}
                              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                                <div className="size-5 flex items-center justify-center shrink-0">
                                  {isLesHovered ? (
                                    /* Hovered: 3-bar hamburger/drag handle */
                                    <svg
                                      className="size-4.5 text-gray-700 cursor-grab active:cursor-grabbing"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <title>Drag lesson to reorder</title>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                  ) : (
                                    /* Default: Book outline icon */
                                    <svg
                                      className="size-4.5 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={1.75}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                      />
                                    </svg>
                                  )}
                                </div>

                                <span
                                  className={cn(
                                    "text-sm sm:text-base truncate transition-colors",
                                    isLesHovered
                                      ? "font-semibold text-gray-900"
                                      : "font-normal text-gray-600"
                                  )}
                                >
                                  {les.title}
                                </span>
                              </div>

                              {/* Right: Hover action icons (Edit, Copy, Delete) */}
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 shrink-0 transition-opacity",
                                  isLesHovered ? "opacity-100" : "opacity-0"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingLesson({
                                      topicId: topic.id,
                                      topicTitle: topic.title,
                                      lesson: les,
                                    })
                                  }
                                  className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                  title="Edit Lesson"
                                >
                                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopyLesson(topic.id, les)}
                                  className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                  title="Duplicate Lesson"
                                >
                                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteLesson(topic.id, les.id)}
                                  className="p-1.5 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Lesson"
                                >
                                  <Trash2Icon className="size-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Quizzes List */}
                        {topic.quizzes.map((quiz) => {
                          const isQuizHovered = hoveredLessonId === quiz.id;
                          return (
                            <div
                              key={quiz.id}
                              onMouseEnter={() => setHoveredLessonId(quiz.id)}
                              onMouseLeave={() => setHoveredLessonId(null)}
                              onClick={() => {
                                setEditingQuiz({ topicId: topic.id, quiz });
                                setQuizModalTab("Question Details");
                              }}
                              className={cn(
                                "flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer select-none",
                                isQuizHovered
                                  ? "border-gray-200 bg-white shadow-xs"
                                  : "border-transparent bg-transparent hover:border-gray-200/80 hover:bg-white/70"
                              )}
                            >
                              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                                <div className="size-5 flex items-center justify-center shrink-0">
                                  {isQuizHovered ? (
                                    <svg
                                      className="size-4.5 text-gray-700 cursor-grab active:cursor-grabbing"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <title>Drag quiz to reorder</title>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="size-4.5 text-emerald-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={1.75}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "text-sm sm:text-base truncate transition-colors",
                                    isQuizHovered
                                      ? "font-semibold text-gray-900"
                                      : "font-normal text-gray-600"
                                  )}
                                >
                                  {quiz.title}
                                </span>
                              </div>

                              <div
                                className={cn(
                                  "flex items-center gap-1.5 shrink-0 transition-opacity",
                                  isQuizHovered ? "opacity-100" : "opacity-0"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingQuiz({ topicId: topic.id, quiz });
                                    setQuizModalTab("Question Details");
                                  }}
                                  className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                  title="Edit Quiz"
                                >
                                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopics((prev) =>
                                      prev.map((t) =>
                                        t.id === topic.id
                                          ? {
                                              ...t,
                                              quizzes: t.quizzes.filter((q) => q.id !== quiz.id),
                                            }
                                          : t
                                      )
                                    );
                                    showNotice("Deleted quiz");
                                  }}
                                  className="p-1.5 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Delete Quiz"
                                >
                                  <Trash2Icon className="size-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Assignments List */}
                        {topic.assignments.map((asg) => {
                          const isAsgHovered = hoveredLessonId === asg.id;
                          return (
                            <div
                              key={asg.id}
                              onMouseEnter={() => setHoveredLessonId(asg.id)}
                              onMouseLeave={() => setHoveredLessonId(null)}
                              onClick={() => {
                                const newTitle = prompt("Edit Assignment Title:", asg.title);
                                if (newTitle) {
                                  setTopics((prev) =>
                                    prev.map((t) =>
                                      t.id === topic.id
                                        ? {
                                            ...t,
                                            assignments: t.assignments.map((a) =>
                                              a.id === asg.id ? { ...a, title: newTitle } : a
                                            ),
                                          }
                                        : t
                                    )
                                  );
                                  showNotice("Updated assignment");
                                }
                              }}
                              className={cn(
                                "flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer select-none",
                                isAsgHovered
                                  ? "border-gray-200 bg-white shadow-xs"
                                  : "border-transparent bg-transparent hover:border-gray-200/80 hover:bg-white/70"
                              )}
                            >
                              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                                <div className="size-5 flex items-center justify-center shrink-0">
                                  <svg
                                    className="size-4.5 text-amber-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.75}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                  </svg>
                                </div>
                                <span
                                  className={cn(
                                    "text-sm sm:text-base truncate transition-colors",
                                    isAsgHovered
                                      ? "font-semibold text-gray-900"
                                      : "font-normal text-gray-600"
                                  )}
                                >
                                  {asg.title}
                                </span>
                              </div>

                              <div
                                className={cn(
                                  "flex items-center gap-1.5 shrink-0 transition-opacity",
                                  isAsgHovered ? "opacity-100" : "opacity-0"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopics((prev) =>
                                      prev.map((t) =>
                                        t.id === topic.id
                                          ? {
                                              ...t,
                                              assignments: t.assignments.filter((a) => a.id !== asg.id),
                                            }
                                          : t
                                      )
                                    );
                                    showNotice("Deleted assignment");
                                  }}
                                  className="p-1.5 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Delete Assignment"
                                >
                                  <Trash2Icon className="size-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add Buttons inside Topic Bar matching screenshot 4 */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-gray-200">
                          {/* Left: + Lesson, + Quiz, + Assignment */}
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleOpenNewLesson(topic)}
                              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-200 hover:bg-purple-50/50 hover:text-[#7D52F4] shadow-2xs transition-colors"
                            >
                              <span>+</span>
                              <span>Lesson</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newQuiz: QuizItem = {
                                  id: `quiz-${Date.now()}`,
                                  title: "New Quiz",
                                  passingGrade: 80,
                                  questionOrder: "Random",
                                  allowMultipleAttempts: true,
                                  maxAttempts: 3,
                                  timeLimitMinutes: 15,
                                  layout: "Single Question",
                                  showPagination: true,
                                  revealAnswers: true,
                                  hidePreviousButton: false,
                                  hideQuestionNumber: false,
                                  questions: [
                                    {
                                      id: `q-${Date.now()}`,
                                      title: "Sample Question 1",
                                      type: "Multiple Choice",
                                      options: [
                                        { id: "1", text: "Correct Option", isCorrect: true },
                                        { id: "2", text: "Incorrect Option", isCorrect: false },
                                      ],
                                      explanation: "",
                                      points: 1,
                                      multipleCorrect: false,
                                      isRequired: true,
                                      randomize: true,
                                      displayPoints: true,
                                    },
                                  ],
                                };
                                setEditingQuiz({ topicId: topic.id, quiz: newQuiz });
                                setQuizModalTab("Question Details");
                              }}
                              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-200 hover:bg-purple-50/50 hover:text-[#7D52F4] shadow-2xs transition-colors"
                            >
                              <span>+</span>
                              <span>Quiz</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const asgTitle = prompt("Enter Assignment Title:");
                                if (asgTitle) {
                                  const newAsg: AssignmentItem = {
                                    id: `asg-${Date.now()}`,
                                    title: asgTitle,
                                    description: "Practical workplace deliverable.",
                                    totalMarks: 20,
                                    passingMarks: 16,
                                    deadlineDays: 7,
                                  };
                                  setTopics((prev) =>
                                    prev.map((t) =>
                                      t.id === topic.id
                                        ? { ...t, assignments: [...t.assignments, newAsg] }
                                        : t
                                    )
                                  );
                                  showNotice("Added assignment");
                                }
                              }}
                              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-200 hover:bg-purple-50/50 hover:text-[#7D52F4] shadow-2xs transition-colors"
                            >
                              <span>+</span>
                              <span>Assignment</span>
                            </button>
                          </div>

                          {/* Right: Content Bank, ⋮ options */}
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => showNotice("Content Bank accessed")}
                              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-200 hover:bg-purple-50/50 hover:text-[#7D52F4] shadow-2xs transition-colors"
                            >
                              <span>⧉</span>
                              <span>Content Bank</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => showNotice("More options menu")}
                              className="rounded-lg border border-gray-300 bg-white p-2 text-gray-500 hover:text-gray-800 shadow-2xs"
                              title="More topic actions"
                            >
                              ⋮
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* + Add Topic Module Button */}
              <button
                type="button"
                onClick={handleAddTopic}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-4 text-sm sm:text-base font-bold text-gray-700 hover:border-purple-300 hover:bg-purple-50/30 hover:text-[#7D52F4] w-full transition-colors shadow-2xs"
              >
                <span>+</span>
                <span>Add Topic Module</span>
              </button>
            </div>

            {/* Stepper Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
              >
                ← Back to Basics
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 rounded-xl bg-[#7D52F4] px-6 py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-purple-700 transition-colors shadow-xs"
              >
                <span>Continue to Additional</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ADDITIONAL (Image 5 with Zoom/Meet Crossed Out) ================= */}
        {currentStep === 3 && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Overview, What Will I Learn?, Target Audience, Total Duration, Materials, Requirements */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-xl border border-gray-300 bg-white p-6 sm:p-7 shadow-2xs space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Overview</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide essential course information to attract and inform potential students
                  </p>
                </div>

                {/* What Will I Learn? */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    What Will I Learn?
                  </label>
                  <textarea
                    rows={4}
                    value={whatWillLearn}
                    onChange={(e) => setWhatWillLearn(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3.5 text-sm sm:text-base text-gray-800 leading-relaxed focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                    placeholder="Enter key competencies and practical takeaways (one per line)..."
                  />
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Target Audience
                  </label>
                  <textarea
                    rows={3}
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3.5 text-sm sm:text-base text-gray-800 leading-relaxed focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                    placeholder="Specify the target audience that will benefit the most from the course..."
                  />
                </div>

                {/* Total Course Duration: [ 26 ] hour(s) [ 0 ] min(s) */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Total Course Duration
                  </label>
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden bg-white">
                      <input
                        type="number"
                        value={durationHours}
                        onChange={(e) => setDurationHours(Number(e.target.value))}
                        className="w-24 px-3.5 py-2.5 text-sm sm:text-base text-gray-900 font-semibold focus:outline-none"
                      />
                      <span className="bg-gray-50 px-3.5 py-2.5 text-sm text-gray-600 border-l border-gray-200">
                        hour(s)
                      </span>
                    </div>

                    <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden bg-white">
                      <input
                        type="number"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-20 px-3.5 py-2.5 text-sm sm:text-base text-gray-900 font-semibold focus:outline-none"
                      />
                      <span className="bg-gray-50 px-3.5 py-2.5 text-sm text-gray-600 border-l border-gray-200">
                        min(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Materials Included */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Materials Included
                  </label>
                  <textarea
                    rows={4}
                    value={materialsIncluded}
                    onChange={(e) => setMaterialsIncluded(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3.5 text-sm sm:text-base text-gray-800 leading-relaxed focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                  />
                </div>

                {/* Requirements / Instructions */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Requirements/Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3.5 text-sm sm:text-base text-gray-800 leading-relaxed focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Course Prerequisites & Attachments (NO Zoom/Google Meet per user's red crossout!) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Course Prerequisites */}
              <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-2xs space-y-3.5">
                <label className="block text-sm font-semibold text-gray-800">
                  Course Prerequisites
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={prereqSearch}
                    onChange={(e) => setPrereqSearch(e.target.value)}
                    placeholder="Search courses for prerequisites"
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3.5 text-sm text-gray-800 focus:border-[#7D52F4] focus:ring-1 focus:ring-[#7D52F4] focus:outline-none"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    🔍
                  </span>
                </div>

                {/* Empty State Illustration matching Image 5 */}
                {selectedPrerequisites.length === 0 && (
                  <div className="py-6 text-center space-y-1.5">
                    <div className="mx-auto size-12 text-gray-300 flex items-center justify-center text-3xl">
                      🗂️
                    </div>
                    <p className="text-sm font-semibold text-gray-800">No course selected</p>
                    <p className="text-xs text-gray-400">
                      Select a course to add as a prerequisite.
                    </p>
                  </div>
                )}

                {selectedPrerequisites.length > 0 && (
                  <div className="space-y-2">
                    {selectedPrerequisites.map((pre) => (
                      <div
                        key={pre}
                        className="flex items-center justify-between rounded-lg bg-purple-50 border border-purple-200 px-3 py-2 text-sm text-[#7D52F4] font-medium"
                      >
                        <span className="truncate">{pre}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPrerequisites(
                              selectedPrerequisites.filter((p) => p !== pre)
                            )
                          }
                          className="text-purple-400 hover:text-rose-600 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-2xs space-y-3.5">
                <label className="block text-sm font-semibold text-gray-800">
                  Attachments
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const fname = prompt("Enter attachment file name (e.g. syllabus.pdf):");
                    if (fname) setAttachments([...attachments, fname]);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-50 border border-purple-200 py-3 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors"
                >
                  <span>📎</span>
                  <span>Upload Attachment</span>
                </button>

                {attachments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                      >
                        <span className="truncate">{att}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments(attachments.filter((_, idx) => idx !== i))
                          }
                          className="text-gray-400 hover:text-rose-600 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stepper Footer Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePublishCourse}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#7D52F4] py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-purple-700 transition-colors shadow-xs"
                >
                  <span>{isEditMode ? "Save All Changes" : "Update Course"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: LESSON EDITOR (Image 6 Exact Match) ================= */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setEditingLesson(null)}
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150 text-sm sm:text-base">
            {/* Header: Book icon 📖 Lesson | Topic: [Topic Title] and ✕ close */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
              <div className="flex items-center gap-3 text-base">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Lesson</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500 font-medium">
                  Topic: {editingLesson.topicTitle}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                title="Close"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleSaveLessonModal} className="flex-1 overflow-y-auto p-6 sm:p-7 [scrollbar-width:thin]">
              <div className="grid gap-7 lg:grid-cols-12">
                {/* Left Column: Name & Content with rich toolbar */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={editingLesson.lesson.title}
                        onChange={(e) =>
                          setEditingLesson({
                            ...editingLesson,
                            lesson: { ...editingLesson.lesson, title: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-[#7D52F4] ring-2 ring-purple-500/20 bg-white py-2.5 pl-4 pr-9 text-sm sm:text-base text-gray-900 focus:outline-none"
                      />
                      {editingLesson.lesson.title && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingLesson({
                              ...editingLesson,
                              lesson: { ...editingLesson.lesson, title: "" },
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <CloseIcon className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Content
                    </label>

                    <div className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-2xs">
                      {/* Top Bar: Add media + Visual/Code tabs */}
                      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 bg-gray-50/70">
                        <button
                          type="button"
                          onClick={() => showNotice("Media dialog opened")}
                          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <ImageIcon className="size-4 text-purple-600" />
                          <span>Add media</span>
                        </button>

                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white text-sm">
                          <button
                            type="button"
                            className="bg-gray-100 text-gray-900 font-semibold px-3.5 py-1.5"
                          >
                            Visual
                          </button>
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-800 px-3.5 py-1.5 border-l border-gray-200"
                          >
                            Code
                          </button>
                        </div>
                      </div>

                      {/* Toolbar */}
                      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 px-4 py-2 text-sm text-gray-600 bg-white">
                        <select className="rounded border border-gray-300 px-2.5 py-1 text-sm bg-white text-gray-700 focus:outline-none">
                          <option>Paragraph</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                        </select>
                        <span className="text-gray-300 mx-1.5">|</span>
                        <button type="button" className="p-1.5 font-bold rounded hover:bg-gray-100">B</button>
                        <button type="button" className="p-1.5 italic rounded hover:bg-gray-100">I</button>
                        <button type="button" className="p-1.5 underline rounded hover:bg-gray-100">U</button>
                        <span className="text-gray-300 mx-1.5">|</span>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">•≡</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">1≡</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">“</button>
                        <span className="text-gray-300 mx-1.5">|</span>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">⫷</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">≡</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">⫸</button>
                        <span className="text-gray-300 mx-1.5">|</span>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">🔗</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">⛓</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">▦</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">{"{}"}</button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100">⌨</button>
                      </div>

                      <textarea
                        rows={10}
                        value={editingLesson.lesson.content}
                        onChange={(e) =>
                          setEditingLesson({
                            ...editingLesson,
                            lesson: { ...editingLesson.lesson, content: e.target.value },
                          })
                        }
                        placeholder="Write lesson text, discussion prompts, or resource references..."
                        className="w-full p-4 text-sm sm:text-base text-gray-800 leading-relaxed focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Featured Image, Video, Playback Time, Exercise Files, Lesson Preview */}
                <div className="lg:col-span-4 space-y-5">
                  {/* Featured Image */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Featured Image
                    </label>
                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 flex flex-col items-center justify-center text-center">
                      <div className="text-gray-400 mb-1.5 text-2xl">🖼️</div>
                      <button
                        type="button"
                        onClick={() => showNotice("Featured image uploaded")}
                        className="rounded-lg bg-purple-50 border border-purple-200 px-4 py-2 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors"
                      >
                        Upload Image
                      </button>
                      <p className="text-xs text-gray-400 mt-2">
                        JPEG, PNG, GIF, and WebP formats, up to 300 MB
                      </p>
                    </div>
                  </div>

                  {/* Video */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Video
                    </label>
                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 flex flex-col items-center justify-center text-center">
                      <button
                        type="button"
                        onClick={() => showNotice("Lesson video uploaded")}
                        className="flex items-center gap-2 rounded-lg bg-purple-50 border border-purple-200 px-4 py-2 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors"
                      >
                        <VideoIcon className="size-4" />
                        <span>Upload Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const vurl = prompt("Video URL:", editingLesson.lesson.videoUrl || "");
                          if (vurl !== null) {
                            setEditingLesson({
                              ...editingLesson,
                              lesson: { ...editingLesson.lesson, videoUrl: vurl },
                            });
                          }
                        }}
                        className="text-sm text-[#7D52F4] hover:text-purple-700 hover:underline mt-2.5 cursor-pointer font-medium"
                      >
                        Add from URL
                      </button>
                      <p className="text-xs text-gray-400 mt-2">
                        MP4, and WebM formats, up to 300 MB
                      </p>
                    </div>
                  </div>

                  {/* Video Playback Time: [ 0 ] hour [ 0 ] min [ 0 ] sec */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Video Playback Time
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden bg-white">
                        <input
                          type="number"
                          value={editingLesson.lesson.durationHours}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              lesson: {
                                ...editingLesson.lesson,
                                durationHours: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full px-2.5 py-2 text-sm text-gray-800 font-semibold focus:outline-none"
                        />
                        <span className="bg-gray-50 px-2.5 py-2 text-xs text-gray-500 border-l border-gray-200">
                          hour
                        </span>
                      </div>

                      <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden bg-white">
                        <input
                          type="number"
                          value={editingLesson.lesson.durationMinutes}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              lesson: {
                                ...editingLesson.lesson,
                                durationMinutes: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full px-2.5 py-2 text-sm text-gray-800 font-semibold focus:outline-none"
                        />
                        <span className="bg-gray-50 px-2.5 py-2 text-xs text-gray-500 border-l border-gray-200">
                          min
                        </span>
                      </div>

                      <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden bg-white">
                        <input
                          type="number"
                          value={editingLesson.lesson.durationSeconds}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              lesson: {
                                ...editingLesson.lesson,
                                durationSeconds: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full px-2.5 py-2 text-sm text-gray-800 font-semibold focus:outline-none"
                        />
                        <span className="bg-gray-50 px-2.5 py-2 text-xs text-gray-500 border-l border-gray-200">
                          sec
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise Files */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Exercise Files
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLesson({
                          ...editingLesson,
                          lesson: {
                            ...editingLesson.lesson,
                            exerciseFilesCount: editingLesson.lesson.exerciseFilesCount + 1,
                          },
                        });
                        showNotice("Attached exercise resource");
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-50 border border-purple-200 py-3 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors"
                    >
                      <span>📎</span>
                      <span>Upload Attachment</span>
                    </button>
                    {editingLesson.lesson.exerciseFilesCount > 0 && (
                      <p className="text-xs text-gray-500">
                        {editingLesson.lesson.exerciseFilesCount} attachment(s) linked
                      </p>
                    )}
                  </div>

                  {/* Lesson Preview ⓘ Toggle Switch */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-800">
                        Lesson Preview
                      </span>
                      <span className="text-gray-400 text-sm cursor-help" title="Allows unregistered students to preview this lesson for free">
                        ⓘ
                      </span>
                    </div>
                    <ToggleSwitch
                      checked={editingLesson.lesson.isFreePreview}
                      onChange={(checked) =>
                        setEditingLesson({
                          ...editingLesson,
                          lesson: { ...editingLesson.lesson, isFreePreview: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#7D52F4] px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-xs"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUIZ BUILDER ================= */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs"
            onClick={() => setEditingQuiz(null)}
          />
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 text-sm font-bold">
                  📋
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingQuiz.quiz.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Interactive Drill &amp; Assessment Engine
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setQuizModalTab("Question Details")}
                  className={cn(
                    "px-3.5 py-1.5 rounded transition-colors",
                    quizModalTab === "Question Details"
                      ? "bg-white text-gray-900 font-bold shadow-2xs"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Question Details
                </button>
                <button
                  type="button"
                  onClick={() => setQuizModalTab("Settings")}
                  className={cn(
                    "px-3.5 py-1.5 rounded transition-colors",
                    quizModalTab === "Settings"
                      ? "bg-white text-gray-900 font-bold shadow-2xs"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Settings
                </button>
              </div>

              <button
                type="button"
                onClick={() => setEditingQuiz(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {/* Quiz Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 [scrollbar-width:thin]">
              {quizModalTab === "Question Details" ? (
                <div className="grid gap-6 lg:grid-cols-12 text-sm">
                  {/* Left: Questions list */}
                  <div className="lg:col-span-4 rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-200">
                      <span className="font-bold text-gray-800">Questions</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newQ: QuizQuestion = {
                            id: `q-${Date.now()}`,
                            title: `Question ${editingQuiz.quiz.questions.length + 1}`,
                            type: "Multiple Choice",
                            options: [
                              { id: "1", text: "Answer Option A", isCorrect: true },
                              { id: "2", text: "Answer Option B", isCorrect: false },
                            ],
                            explanation: "",
                            points: 1,
                            multipleCorrect: false,
                            isRequired: true,
                            randomize: true,
                            displayPoints: true,
                          };
                          const updated = [...editingQuiz.quiz.questions, newQ];
                          setEditingQuiz({
                            ...editingQuiz,
                            quiz: { ...editingQuiz.quiz, questions: updated },
                          });
                          setActiveQuestionIndex(updated.length - 1);
                        }}
                        className="rounded bg-[#7D52F4] hover:bg-purple-700 px-2.5 py-1 text-white font-bold text-xs transition-colors"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {editingQuiz.quiz.questions.map((q, idx) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setActiveQuestionIndex(idx)}
                          className={cn(
                            "w-full text-left p-2.5 rounded-lg transition-colors truncate text-sm",
                            activeQuestionIndex === idx
                              ? "bg-[#7D52F4] text-white font-semibold"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {idx + 1}. {q.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right: Question Editor */}
                  <div className="lg:col-span-8 space-y-4">
                    {editingQuiz.quiz.questions[activeQuestionIndex] && (
                      <>
                        <div className="space-y-1.5">
                          <label className="font-bold text-gray-800 text-sm">
                            Question Prompt
                          </label>
                          <input
                            type="text"
                            value={editingQuiz.quiz.questions[activeQuestionIndex].title}
                            onChange={(e) => {
                              const updated = [...editingQuiz.quiz.questions];
                              updated[activeQuestionIndex].title = e.target.value;
                              setEditingQuiz({
                                ...editingQuiz,
                                quiz: { ...editingQuiz.quiz, questions: updated },
                              });
                            }}
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 font-medium focus:outline-none"
                          />
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          <label className="font-bold text-gray-800 text-sm">Choices</label>
                          {editingQuiz.quiz.questions[activeQuestionIndex].options.map(
                            (opt, optIdx) => (
                              <div
                                key={opt.id}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg border p-2.5",
                                  opt.isCorrect
                                    ? "border-emerald-300 bg-emerald-50/50"
                                    : "border-gray-200 bg-white"
                                )}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editingQuiz.quiz.questions];
                                    updated[activeQuestionIndex].options = updated[
                                      activeQuestionIndex
                                    ].options.map((o, i) => ({
                                      ...o,
                                      isCorrect: i === optIdx,
                                    }));
                                    setEditingQuiz({
                                      ...editingQuiz,
                                      quiz: { ...editingQuiz.quiz, questions: updated },
                                    });
                                  }}
                                  className={cn(
                                    "size-5.5 rounded flex items-center justify-center text-xs font-bold shrink-0",
                                    opt.isCorrect
                                      ? "bg-emerald-600 text-white"
                                      : "border border-gray-300 text-transparent"
                                  )}
                                >
                                  ✓
                                </button>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const updated = [...editingQuiz.quiz.questions];
                                    updated[activeQuestionIndex].options[optIdx].text =
                                      e.target.value;
                                    setEditingQuiz({
                                      ...editingQuiz,
                                      quiz: { ...editingQuiz.quiz, questions: updated },
                                    });
                                  }}
                                  className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Settings Tab */
                <div className="space-y-4 max-w-md text-sm">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Passing Grade (%)</label>
                    <input
                      type="number"
                      value={editingQuiz.quiz.passingGrade}
                      onChange={(e) =>
                        setEditingQuiz({
                          ...editingQuiz,
                          quiz: {
                            ...editingQuiz.quiz,
                            passingGrade: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-800">Time Limit (Minutes)</label>
                    <input
                      type="number"
                      value={editingQuiz.quiz.timeLimitMinutes}
                      onChange={(e) =>
                        setEditingQuiz({
                          ...editingQuiz,
                          quiz: {
                            ...editingQuiz.quiz,
                            timeLimitMinutes: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-gray-800">Allow Multiple Attempts</span>
                    <ToggleSwitch
                      checked={editingQuiz.quiz.allowMultipleAttempts}
                      onChange={(checked) =>
                        setEditingQuiz({
                          ...editingQuiz,
                          quiz: {
                            ...editingQuiz.quiz,
                            allowMultipleAttempts: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setEditingQuiz(null)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopics((prev) =>
                    prev.map((t) => {
                      if (t.id !== editingQuiz.topicId) return t;
                      const existingIdx = t.quizzes.findIndex(
                        (q) => q.id === editingQuiz.quiz.id
                      );
                      if (existingIdx >= 0) {
                        const updated = [...t.quizzes];
                        updated[existingIdx] = editingQuiz.quiz;
                        return { ...t, quizzes: updated };
                      } else {
                        return { ...t, quizzes: [...t.quizzes, editingQuiz.quiz] };
                      }
                    })
                  );
                  showNotice("Saved quiz");
                  setEditingQuiz(null);
                }}
                className="rounded-xl bg-[#7D52F4] px-6 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-xs"
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
