"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo, ChevronDown as ChevronDownIcon } from "@/lib/icons";
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

export default function CourseBuilder({ initialData, isEditMode = false }: CourseBuilderProps) {
  const router = useRouter();

  // Step Wizard State: 1 = Basics, 2 = Curriculum, 3 = Additional
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basics Form State
  const [title, setTitle] = useState(initialData?.title || "Digital Illustration with Procreate");
  const [slug, setSlug] = useState(initialData?.slug || "digital-illustration-with-procreate");
  const [description, setDescription] = useState(
    initialData?.description ||
      "Master digital illustration from sketch to finished artwork using Procreate. Learn professional workflows, drawing fundamentals, color theory, and portfolio development techniques used by modern digital artists."
  );
  const [activeOptionTab, setActiveOptionTab] = useState<"General" | "Content Drip" | "Enrollment">("General");
  const [difficultyLevel, setDifficultyLevel] = useState(initialData?.level || "Beginner");
  const [isPublicCourse, setIsPublicCourse] = useState(initialData?.isPublic ?? true);
  const [dripMode, setDripMode] = useState<"immediate" | "days" | "date">("immediate");
  const [dripDays, setDripDays] = useState(7);
  const [maxSeats, setMaxSeats] = useState(50);

  // Right Column Basics
  const [visibility, setVisibility] = useState(initialData?.visibility || "Public");
  const [isScheduled, setIsScheduled] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage || "/images/courses/web-development-bootcamp-thumbnail.webp"
  );
  const [introVideoUrl, setIntroVideoUrl] = useState(initialData?.introVideoUrl || "");
  const [pricingModel, setPricingModel] = useState<"Free" | "Paid">(initialData?.pricingModel || "Paid");
  const [pricingType, setPricingType] = useState<"free" | "one-time" | "installments">("one-time");
  const [installmentCount, setInstallmentCount] = useState(3);
  const [installmentAmount, setInstallmentAmount] = useState("$20.00");
  const [price, setPrice] = useState(initialData?.price || "$49.00");
  const [category, setCategory] = useState(initialData?.category || "Development");
  const [tags, setTags] = useState(initialData?.tags || "Illustration, Procreate, Digital Art");
  const [author, setAuthor] = useState("admin (hesbonombati1@gmail.com)");

  // Step 2: Curriculum State
  const [topics, setTopics] = useState<TopicItem[]>(
    initialData?.topics || [
      {
        id: "topic-1",
        title: "Procreate Fundamentals",
        summary: "Learn the essential tools and interface elements needed to work efficiently inside Procreate.",
        isExpanded: true,
        lessons: [
          {
            id: "les-1",
            title: "Understanding the Procreate Workspace",
            content: "Learn why navigating gestures and layout is key to professional digital workflow.",
            durationHours: 0,
            durationMinutes: 15,
            durationSeconds: 30,
            isFreePreview: true,
            exerciseFilesCount: 1,
          },
          {
            id: "les-2",
            title: "Brushes and Drawing Tools",
            content: "Explore custom pressure dynamics, streamline, and brush engine configurations.",
            durationHours: 0,
            durationMinutes: 22,
            durationSeconds: 10,
            isFreePreview: false,
            exerciseFilesCount: 2,
          },
          {
            id: "les-3",
            title: "Working with Layers & Blending Modes",
            content: "Master clipping masks, alpha lock, and lighting blend modes.",
            durationHours: 0,
            durationMinutes: 18,
            durationSeconds: 45,
            isFreePreview: false,
            exerciseFilesCount: 1,
          },
        ],
        quizzes: [
          {
            id: "quiz-1",
            title: "Procreate Basics Assessment",
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
                title: "What gesture undoes your last stroke in Procreate?",
                type: "Multiple Choice",
                options: [
                  { id: "opt-1", text: "Two-finger tap on the screen", isCorrect: true },
                  { id: "opt-2", text: "Three-finger tap", isCorrect: false },
                  { id: "opt-3", text: "Pinch zoom out", isCorrect: false },
                  { id: "opt-4", text: "Double tap the pencil", isCorrect: false },
                ],
                explanation: "A two-finger tap undoes your last action, while a three-finger tap redoes it.",
                points: 1,
                multipleCorrect: false,
                isRequired: true,
                randomize: true,
                displayPoints: true,
              },
              {
                id: "q-2",
                title: "Which mask feature isolates painting strictly to existing layer pixels?",
                type: "Multiple Choice",
                options: [
                  { id: "opt-21", text: "Alpha Lock", isCorrect: true },
                  { id: "opt-22", text: "Gaussian Blur", isCorrect: false },
                  { id: "opt-23", text: "ColorDrop", isCorrect: false },
                ],
                explanation: "Alpha Lock restricts changes strictly to opaque pixels on that layer.",
                points: 1,
                multipleCorrect: false,
                isRequired: true,
                randomize: true,
                displayPoints: true,
              },
            ],
          },
        ],
        assignments: [
          {
            id: "asg-1",
            title: "Create Your Digital Workspace Setup",
            description: "Set up your custom brush palette and upload a canvas screenshot with 3 distinct layer groups.",
            totalMarks: 15,
            passingMarks: 10,
            deadlineDays: 7,
          },
        ],
      },
      {
        id: "topic-2",
        title: "Drawing & Character Design",
        summary: "Identify proportion rules, silhouette generation, and character anatomy workflows.",
        isExpanded: false,
        lessons: [
          {
            id: "les-4",
            title: "Anatomy Landmarks and Gesture Sketching",
            content: "Quick timed gesture exercises to loosen up character poses.",
            durationHours: 0,
            durationMinutes: 25,
            durationSeconds: 0,
            isFreePreview: false,
            exerciseFilesCount: 2,
          },
        ],
        quizzes: [],
        assignments: [],
      },
      {
        id: "topic-3",
        title: "Coloring, Lighting & Portfolio Creation",
        summary: "Render dramatic rim lights, ambient occlusion, and export for client showcases.",
        isExpanded: false,
        lessons: [],
        quizzes: [],
        assignments: [],
      },
    ]
  );

  // Step 3: Additional Form State
  const [whatWillLearn, setWhatWillLearn] = useState(
    initialData?.whatWillLearn ||
      "Design original characters\nBuild a portfolio-ready artwork collection\nMaster digital brushes, layers, and blending modes\nExport professional print and digital files for commercial clients"
  );
  const [targetAudience, setTargetAudience] = useState(
    initialData?.targetAudience ||
      "Hobby illustrators\nFreelancers seeking illustration skills\nDesigners wanting to add digital painting to their service offerings"
  );
  const [durationHours, setDurationHours] = useState(initialData?.durationHours || 8);
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes || 30);
  const [materialsIncluded, setMaterialsIncluded] = useState(
    initialData?.materialsIncluded ||
      "Brush pack (25 professional brushes)\nCharacter design worksheet (PDF)\nColor palette guide\nCommercial client proposal template"
  );
  const [requirements, setRequirements] = useState(
    initialData?.requirements || "iPad with Apple Pencil support\nProcreate app installed (version 5.2 or newer)"
  );
  const [selectedCertificateTemplate, setSelectedCertificateTemplate] = useState(
    initialData?.certificateTemplate || "Classic Border"
  );
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<string[]>([
    "procreate_reference_cheatsheet.pdf",
    "commercial_license_guidelines.pdf",
  ]);

  // Modals State
  const [activeTopicForLesson, setActiveTopicForLesson] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ topicId: string; lesson: LessonItem } | null>(null);
  const [activeTopicForQuiz, setActiveTopicForQuiz] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{ topicId: string; quiz: QuizItem } | null>(null);
  const [quizModalTab, setQuizModalTab] = useState<"Question Details" | "Settings">("Question Details");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Helper Functions
  const toggleTopicExpand = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExpanded: !t.isExpanded } : t))
    );
  };

  const collapseAllTopics = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, isExpanded: false })));
  };

  const expandAllTopics = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, isExpanded: true })));
  };

  const handleAddTopic = () => {
    const newTopic: TopicItem = {
      id: `topic-${Date.now()}`,
      title: `Topic ${topics.length + 1}: New Module`,
      summary: "Add a brief overview of the topics, competencies, and practical checks in this module.",
      isExpanded: true,
      lessons: [],
      quizzes: [],
      assignments: [],
    };
    setTopics([...topics, newTopic]);
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter((t) => t.id !== id));
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== editingLesson.topicId) return t;
        const existingIdx = t.lessons.findIndex((l) => l.id === editingLesson.lesson.id);
        if (existingIdx >= 0) {
          const updatedLessons = [...t.lessons];
          updatedLessons[existingIdx] = editingLesson.lesson;
          return { ...t, lessons: updatedLessons };
        } else {
          return { ...t, lessons: [...t.lessons, editingLesson.lesson] };
        }
      })
    );
    setEditingLesson(null);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz) return;

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== editingQuiz.topicId) return t;
        const existingIdx = t.quizzes.findIndex((q) => q.id === editingQuiz.quiz.id);
        if (existingIdx >= 0) {
          const updatedQuizzes = [...t.quizzes];
          updatedQuizzes[existingIdx] = editingQuiz.quiz;
          return { ...t, quizzes: updatedQuizzes };
        } else {
          return { ...t, quizzes: [...t.quizzes, editingQuiz.quiz] };
        }
      })
    );
    setEditingQuiz(null);
  };

  const handlePublishCourse = () => {
    router.push("/admin/courses");
  };

  return (
    <div className="-m-6 sm:-m-8 lg:-m-10 min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Wizard Sticky Header matching designs */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-3 sm:px-6 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-6">
          <Link href="/admin/courses" className="flex items-center gap-2">
            <Logo className="text-purple-600 max-sm:w-24" />
          </Link>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setCurrentStep(1)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3 py-1.5 transition-all whitespace-nowrap shrink-0",
                currentStep === 1
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <span
                className={cn(
                  "flex size-5 sm:size-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                  currentStep === 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                1
              </span>
              <span className="hidden sm:inline whitespace-nowrap">Basics</span>
            </button>

            <span className="text-gray-300">—</span>

            <button
              onClick={() => setCurrentStep(2)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3 py-1.5 transition-all whitespace-nowrap shrink-0",
                currentStep === 2
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <span
                className={cn(
                  "flex size-5 sm:size-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                  currentStep === 2
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                2
              </span>
              <span className="hidden sm:inline whitespace-nowrap">Curriculum</span>
            </button>

            <span className="text-gray-300">—</span>

            <button
              onClick={() => setCurrentStep(3)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-3 py-1.5 transition-all whitespace-nowrap shrink-0",
                currentStep === 3
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <span
                className={cn(
                  "flex size-5 sm:size-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                  currentStep === 3
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                3
              </span>
              <span className="hidden sm:inline whitespace-nowrap">Additional</span>
            </button>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href={`/courses/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap shrink-0"
            title="Preview Course"
          >
            <span className="hidden sm:inline whitespace-nowrap">Preview</span>
            <ExternalLinkIcon className="size-3.5 shrink-0" />
          </Link>

          <button
            onClick={handlePublishCourse}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">{isEditMode ? "Update" : "Publish"} Course</span>
          </button>

          <Link
            href="/admin/courses"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 shrink-0"
            title="Close Builder"
          >
            <CloseIcon className="size-5" />
          </Link>
        </div>
      </header>

      {/* Main Form Content by Step */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* ================= STEP 1: BASICS ================= */}
        {currentStep === 1 && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Title, Description, Options */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Course Title <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                  placeholder="e.g. Digital Illustration with Procreate"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-semibold text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <p className="text-xs text-gray-500">
                  Course URL: <span className="font-mono text-purple-600">https://skilliant.io/courses/{slug}</span>
                </p>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Course Description
                  </label>
                </div>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of the curriculum, competencies taught, and practical outcomes..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm leading-relaxed text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Options Tabs: General, Content Drip, Enrollment */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
                <div className="flex border-b border-gray-100 bg-gray-50/60 overflow-x-auto [scrollbar-width:none]">
                  {(["General", "Content Drip", "Enrollment"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveOptionTab(tab)}
                      className={cn(
                        "px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                        activeOptionTab === tab
                          ? "border-purple-600 bg-white text-purple-700"
                          : "border-transparent text-gray-500 hover:text-gray-900"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeOptionTab === "General" && (
                    <div className="space-y-4 text-sm max-w-md">
                      <div>
                        <label className="block font-semibold text-gray-800">Difficulty Level</label>
                        <select
                          value={difficultyLevel}
                          onChange={(e) => setDifficultyLevel(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
                        <div>
                          <p className="font-semibold text-gray-800">Public Course</p>
                          <p className="text-xs text-gray-500">
                            Available in public catalog for open registration
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isPublicCourse}
                          onChange={(e) => setIsPublicCourse(e.target.checked)}
                          className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {activeOptionTab === "Content Drip" && (
                    <div className="space-y-4 text-sm max-w-md">
                      <div>
                        <label className="block font-semibold text-gray-800">Drip Content Pacing</label>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Schedule when lessons become accessible to enrolled trainees
                        </p>
                        <select
                          value={dripMode}
                          onChange={(e) => setDripMode(e.target.value as any)}
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="immediate">Immediate Access (Self-paced)</option>
                          <option value="days">Drip by Days After Enrollment</option>
                          <option value="date">Fixed Calendar Release Dates</option>
                        </select>
                      </div>

                      {dripMode === "days" && (
                        <div>
                          <label className="block font-semibold text-gray-800">Release Interval (Days)</label>
                          <input
                            type="number"
                            value={dripDays}
                            onChange={(e) => setDripDays(Number(e.target.value))}
                            className="mt-1.5 w-32 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {activeOptionTab === "Enrollment" && (
                    <div className="space-y-4 text-sm max-w-md">
                      <div>
                        <label className="block font-semibold text-gray-800">Maximum Seat Capacity</label>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Cap the number of concurrent trainees allowed in this cohort
                        </p>
                        <input
                          type="number"
                          value={maxSeats}
                          onChange={(e) => setMaxSeats(Number(e.target.value))}
                          className="mt-1.5 w-40 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Visibility, Image, Pricing, Categories */}
            <div className="lg:col-span-4 space-y-6">
              {/* Visibility & Schedule */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4 text-sm">
                <div>
                  <label className="block font-bold text-gray-800">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private / Organization Only</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Schedule Launch</span>
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3 text-sm">
                <label className="block font-bold text-gray-800">Featured Image</label>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  <Image src={featuredImage} alt="Course Preview" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFeaturedImage(
                      featuredImage === "/images/courses/data-science-foundations-thumbnail.webp"
                        ? "/images/courses/web-development-bootcamp-thumbnail.webp"
                        : "/images/courses/data-science-foundations-thumbnail.webp"
                    )
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <UploadIcon className="size-3.5 text-purple-600" />
                  <span>Change Image</span>
                </button>
              </div>

              {/* Intro Video */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3 text-sm">
                <label className="block font-bold text-gray-800">Intro Video</label>
                <input
                  type="text"
                  value={introVideoUrl}
                  onChange={(e) => setIntroVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <p className="text-xs text-gray-500">
                  Supports YouTube, Vimeo, direct MP4, or HLS stream URLs.
                </p>
              </div>

              {/* Course Tuition Model */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4 text-sm">
                <div>
                  <label className="block font-bold text-gray-800">Course Tuition Model</label>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Direct course enrollment pricing. No site-wide subscriptions.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPricingModel("Free");
                      setPricingType("free");
                    }}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-center text-xs font-bold transition-all",
                      pricingType === "free"
                        ? "border-purple-600 bg-purple-50/60 text-purple-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricingModel("Paid");
                      setPricingType("one-time");
                    }}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-center text-xs font-bold transition-all",
                      pricingType === "one-time"
                        ? "border-purple-600 bg-purple-50/60 text-purple-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricingModel("Paid");
                      setPricingType("installments");
                    }}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-center text-xs font-bold transition-all",
                      pricingType === "installments"
                        ? "border-purple-600 bg-purple-50/60 text-purple-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Installments
                  </button>
                </div>

                {pricingType === "one-time" && (
                  <div className="pt-2">
                    <label className="block font-semibold text-gray-700 text-xs">One-Time Tuition Fee (USD)</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="$49.00"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Trainee pays once for full access to this course.
                    </p>
                  </div>
                )}

                {pricingType === "installments" && (
                  <div className="pt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 text-xs"># Payments</label>
                        <select
                          value={installmentCount}
                          onChange={(e) => setInstallmentCount(Number(e.target.value))}
                          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                        >
                          <option value={2}>2 Payments</option>
                          <option value={3}>3 Payments</option>
                          <option value={4}>4 Payments</option>
                          <option value={6}>6 Payments</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 text-xs">Per Payment</label>
                        <input
                          type="text"
                          value={installmentAmount}
                          onChange={(e) => setInstallmentAmount(e.target.value)}
                          placeholder="$20.00"
                          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Course-specific installment plan (e.g. {installmentCount} monthly installments of {installmentAmount}).
                    </p>
                  </div>
                )}

                {pricingType === "free" && (
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ Open enrollment — anyone with an account can take this course for free.
                  </p>
                )}
              </div>

              {/* Categories & Tags */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4 text-sm">
                <div>
                  <label className="block font-bold text-gray-800">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Development">Development</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Business & Freelance">Business & Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800">Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Separate tags with commas"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Next Step Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Continue to Curriculum</span>
                  <ArrowRightIcon className="size-3.5 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CURRICULUM ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Curriculum Header Bar matching curriculm.png & skillsaint-lms.png */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 shrink-0"
                  title="Back to Basics"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Curriculum</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={collapseAllTopics}
                  className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors"
                >
                  Collapse All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={expandAllTopics}
                  className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors"
                >
                  Expand All
                </button>
              </div>
            </div>

            {/* Topics List */}
            <div className="space-y-4">
              {topics.map((topic, topicIndex) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden"
                >
                  {/* Topic Header Bar */}
                  <div className="flex items-center justify-between p-4 bg-gray-50/70 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTopicExpand(topic.id)}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                      >
                        <ChevronDownIcon
                          className={cn(
                            "size-5 transition-transform",
                            !topic.isExpanded && "-rotate-90"
                          )}
                        />
                      </button>
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-700 text-sm">
                          {topicIndex + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900">{topic.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{topic.summary}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-purple-100/70 px-2 py-0.5 text-xs font-semibold text-purple-700">
                        {topic.lessons.length} Lessons • {topic.quizzes.length} Quizzes
                      </span>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Section"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Topic Body (Expanded) */}
                  {topic.isExpanded && (
                    <div className="p-5 space-y-3">
                      {/* Lessons in this Topic */}
                      {topic.lessons.map((les) => (
                        <div
                          key={les.id}
                          className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-3 hover:border-purple-200 hover:bg-white transition-all text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400">📄</span>
                            <div>
                              <p className="font-bold text-gray-900">{les.title}</p>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                                <span>{les.durationMinutes} mins</span>
                                {les.isFreePreview && (
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingLesson({ topicId: topic.id, lesson: les })}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                              Edit Lesson
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Quizzes in this Topic */}
                      {topic.quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 p-3 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-amber-500">🏆</span>
                            <div>
                              <p className="font-bold text-gray-900">{quiz.title}</p>
                              <p className="text-xs text-gray-500">
                                {quiz.questions.length} Questions • Pass: {quiz.passingGrade}%
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingQuiz({ topicId: topic.id, quiz });
                                setQuizModalTab("Question Details");
                              }}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                              Edit Quiz
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Assignments in this Topic */}
                      {topic.assignments.map((asg) => (
                        <div
                          key={asg.id}
                          className="flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50/40 p-3 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-teal-600">📋</span>
                            <div>
                              <p className="font-bold text-gray-900">{asg.title}</p>
                              <p className="text-xs text-gray-500">
                                Max Marks: {asg.totalMarks} • Deadline: {asg.deadlineDays} days
                              </p>
                            </div>
                          </div>

                          <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                            Practical Proof
                          </span>
                        </div>
                      ))}

                      {/* Add Buttons matching designs */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            const newLesson: LessonItem = {
                              id: `les-${Date.now()}`,
                              title: "New Lesson",
                              content: "",
                              durationHours: 0,
                              durationMinutes: 10,
                              durationSeconds: 0,
                              isFreePreview: false,
                              exerciseFilesCount: 0,
                            };
                            setEditingLesson({ topicId: topic.id, lesson: newLesson });
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-700"
                        >
                          <PlusIcon className="size-3.5" />
                          <span>Lesson</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newQuiz: QuizItem = {
                              id: `quiz-${Date.now()}`,
                              title: "New Practical Quiz",
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
                                  title: "Sample Question",
                                  type: "Multiple Choice",
                                  options: [
                                    { id: "opt-1", text: "Correct Answer", isCorrect: true },
                                    { id: "opt-2", text: "Incorrect Option", isCorrect: false },
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
                          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-700"
                        >
                          <PlusIcon className="size-3.5" />
                          <span>Quiz</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newAsg: AssignmentItem = {
                              id: `asg-${Date.now()}`,
                              title: "Practical Workplace Task",
                              description: "Upload verified workplace or demonstration proof.",
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
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-700"
                        >
                          <PlusIcon className="size-3.5" />
                          <span>Assignment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* + Add Topic Button */}
              <button
                type="button"
                onClick={handleAddTopic}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 py-3.5 text-sm font-bold text-purple-700 hover:bg-purple-100/50 w-full transition-colors"
              >
                <PlusIcon className="size-4" />
                <span>Add Topic Module</span>
              </button>
            </div>

            {/* Stepper Footer Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">← Back to Basics</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-purple-700 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Continue to Additional Information</span>
                <ArrowRightIcon className="size-3.5 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ADDITIONAL ================= */}
        {currentStep === 3 && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Overview, Certs */}
            <div className="lg:col-span-8 space-y-6">
              {/* Overview Details */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4 text-sm">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Overview Information
                </h3>

                <div>
                  <label className="block font-bold text-gray-800">What Will I Learn?</label>
                  <textarea
                    rows={4}
                    value={whatWillLearn}
                    onChange={(e) => setWhatWillLearn(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800">Target Audience</label>
                  <textarea
                    rows={3}
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800">Total Duration (Hours)</label>
                    <input
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800">Total Duration (Minutes)</label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800">Materials Included</label>
                  <textarea
                    rows={3}
                    value={materialsIncluded}
                    onChange={(e) => setMaterialsIncluded(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800">Requirements / Instructions</label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Certificate Template Selection */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Certificate of Completion</h3>
                    <p className="text-xs text-gray-500">Award verifiable digital credential upon 100% completion</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "None", label: "No Certificate" },
                    { id: "Classic Border", label: "Classic Border" },
                    { id: "Modern Geometric", label: "Modern Geometric" },
                    { id: "Technical Excellence", label: "Technical Excellence" },
                    { id: "Corporate Crest", label: "Corporate Crest" },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedCertificateTemplate(tpl.id)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all",
                        selectedCertificateTemplate === tpl.id
                          ? "border-purple-600 bg-purple-50/60 shadow-xs"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{tpl.label}</span>
                        {selectedCertificateTemplate === tpl.id && (
                          <CheckCircleIcon className="size-3.5 text-purple-600" />
                        )}
                      </div>
                      <div className="mt-2 h-10 w-full rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                        {tpl.id === "None" ? "No Award" : "300 DPI PDF"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Prerequisites, Attachments, Live Sessions */}
            <div className="lg:col-span-4 space-y-6 text-sm">
              {/* Prerequisites */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
                <label className="block font-bold text-gray-800">Course Prerequisites</label>
                <p className="text-xs text-gray-500">
                  Select courses that must be completed before starting this one.
                </p>
                <select
                  onChange={(e) => {
                    if (e.target.value && !selectedPrerequisites.includes(e.target.value)) {
                      setSelectedPrerequisites([...selectedPrerequisites, e.target.value]);
                    }
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="">+ Add Prerequisite Course</option>
                  <option value="The Complete Web Development Bootcamp">The Complete Web Development Bootcamp</option>
                  <option value="Python for Data Science">Python for Data Science</option>
                </select>

                <div className="space-y-1.5 pt-1">
                  {selectedPrerequisites.map((pre) => (
                    <div
                      key={pre}
                      className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700"
                    >
                      <span>{pre}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPrerequisites(selectedPrerequisites.filter((p) => p !== pre))}
                        className="text-purple-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
                <label className="block font-bold text-gray-800">Course Resource Attachments</label>
                <div className="space-y-2">
                  {attachments.map((att, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-sm font-medium text-gray-700"
                    >
                      <span className="truncate">{att}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                        className="text-gray-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setAttachments([...attachments, `resource_guide_${attachments.length + 1}.pdf`])}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  <UploadIcon className="size-3.5 text-purple-600" />
                  <span>Upload Attachment</span>
                </button>
              </div>

              {/* Live Classes Zoom/Meet */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
                <label className="block font-bold text-gray-800">Schedule Live Virtual Class</label>
                <p className="text-xs text-gray-500">
                  Connect webinars and live practical debrief sessions.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => alert("Zoom Meeting configured and linked to course schedule.")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/50 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100/60"
                  >
                    <VideoIcon className="size-3.5" />
                    <span>Create Zoom Meeting</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Google Meet link generated and saved.")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100/60"
                  >
                    <VideoIcon className="size-3.5" />
                    <span>Create Google Meet Link</span>
                  </button>
                </div>
              </div>

              {/* Final Publish Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handlePublishCourse}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white shadow-md hover:bg-purple-700 transition-all whitespace-nowrap shrink-0"
                >
                  <CheckCircleIcon className="size-4 shrink-0" />
                  <span className="whitespace-nowrap">{isEditMode ? "Save All Changes" : "Publish Course Now"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: LESSON EDITOR ================= */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setEditingLesson(null)}
          />
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-purple-600 font-bold">📄</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Lesson Editor</h3>
                  <p className="text-xs text-gray-500">Configure content, playback, and exercise downloads</p>
                </div>
              </div>
              <button
                onClick={() => setEditingLesson(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="grid gap-6 lg:grid-cols-12 text-sm">
              {/* Left Column: Title and Content */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <label className="block font-bold text-gray-800">
                    Lesson Name <span className="text-purple-600">*</span>
                  </label>
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
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800">Lesson Body &amp; Instructions</label>
                  <textarea
                    rows={8}
                    value={editingLesson.lesson.content}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, content: e.target.value },
                      })
                    }
                    placeholder="Type lesson instructions, safety protocols, or reading material..."
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm leading-relaxed text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Video & Preview */}
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <label className="block font-bold text-gray-800">Video URL</label>
                  <input
                    type="text"
                    value={editingLesson.lesson.videoUrl || ""}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, videoUrl: e.target.value },
                      })
                    }
                    placeholder="YouTube or MP4 URL"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800">Playback Duration</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Minutes</span>
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
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-sm"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Seconds</span>
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
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <div>
                    <p className="font-semibold text-gray-800">Free Preview</p>
                    <p className="text-xs text-gray-500">Accessible without login</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingLesson.lesson.isFreePreview}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: {
                          ...editingLesson.lesson,
                          isFreePreview: e.target.checked,
                        },
                      })
                    }
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="lg:col-span-12 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-700 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Save Lesson</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: QUIZ BUILDER ================= */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setEditingQuiz(null)}
          />
          <div className="relative w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header matching quiz prep.PNG */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <QuizIcon className="size-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{editingQuiz.quiz.title}</h3>
                  <p className="text-xs text-gray-500">Interactive Drill &amp; Assessment Engine</p>
                </div>
              </div>

              {/* Tabs: Question Details vs Settings */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setQuizModalTab("Question Details")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition-all",
                    quizModalTab === "Question Details"
                      ? "bg-white text-purple-700 shadow-2xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Question Details
                </button>
                <button
                  type="button"
                  onClick={() => setQuizModalTab("Settings")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition-all",
                    quizModalTab === "Settings"
                      ? "bg-white text-purple-700 shadow-2xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Settings
                </button>
              </div>

              <button
                onClick={() => setEditingQuiz(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {/* TAB 1: QUESTION DETAILS */}
            {quizModalTab === "Question Details" && (
              <div className="grid gap-6 lg:grid-cols-12 text-sm">
                {/* Left Questions List Sidebar */}
                <div className="lg:col-span-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-bold text-gray-700">Questions</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newQ: QuizQuestion = {
                          id: `q-${Date.now()}`,
                          title: `New Question ${editingQuiz.quiz.questions.length + 1}`,
                          type: "Multiple Choice",
                          options: [
                            { id: "1", text: "Option A", isCorrect: true },
                            { id: "2", text: "Option B", isCorrect: false },
                          ],
                          explanation: "",
                          points: 1,
                          multipleCorrect: false,
                          isRequired: true,
                          randomize: true,
                          displayPoints: true,
                        };
                        const updatedQ = [...editingQuiz.quiz.questions, newQ];
                        setEditingQuiz({
                          ...editingQuiz,
                          quiz: { ...editingQuiz.quiz, questions: updatedQ },
                        });
                        setActiveQuestionIndex(updatedQ.length - 1);
                      }}
                      className="rounded-md bg-purple-600 p-1 text-white hover:bg-purple-700"
                      title="Add Question"
                    >
                      <PlusIcon className="size-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {editingQuiz.quiz.questions.map((q, idx) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-all",
                          activeQuestionIndex === idx
                            ? "bg-purple-600 text-white font-semibold"
                            : "bg-white text-gray-700 hover:bg-purple-50"
                        )}
                      >
                        <span className="font-mono">{idx + 1}.</span>
                        <span className="truncate">{q.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center Question Details Panel */}
                <div className="lg:col-span-6 space-y-4">
                  {editingQuiz.quiz.questions[activeQuestionIndex] && (
                    <>
                      <div>
                        <label className="block font-bold text-gray-800">
                          {activeQuestionIndex + 1}. Question Prompt
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
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 font-semibold focus:border-purple-500 focus:bg-white focus:outline-none"
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        <label className="block font-bold text-gray-700">Answer Options</label>
                        {editingQuiz.quiz.questions[activeQuestionIndex].options.map((opt, optIdx) => (
                          <div
                            key={opt.id}
                            className={cn(
                              "flex items-center gap-2.5 rounded-xl border p-2.5 transition-colors",
                              opt.isCorrect
                                ? "border-emerald-300 bg-emerald-50/60"
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
                                "flex size-5.5 items-center justify-center rounded-md border text-xs font-bold",
                                opt.isCorrect
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-gray-300 text-gray-400"
                              )}
                            >
                              ✓
                            </button>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const updated = [...editingQuiz.quiz.questions];
                                updated[activeQuestionIndex].options[optIdx].text = e.target.value;
                                setEditingQuiz({
                                  ...editingQuiz,
                                  quiz: { ...editingQuiz.quiz, questions: updated },
                                });
                              }}
                              className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block font-bold text-gray-700">Answer Explanation</label>
                        <textarea
                          rows={2}
                          value={editingQuiz.quiz.questions[activeQuestionIndex].explanation}
                          onChange={(e) => {
                            const updated = [...editingQuiz.quiz.questions];
                            updated[activeQuestionIndex].explanation = e.target.value;
                            setEditingQuiz({
                              ...editingQuiz,
                              quiz: { ...editingQuiz.quiz, questions: updated },
                            });
                          }}
                          placeholder="Write why the correct answer is accurate..."
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Right Conditions Sidebar */}
                <div className="lg:col-span-3 space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <span className="font-bold text-gray-700 uppercase tracking-wider text-sm">
                    Conditions
                  </span>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Answer Required</span>
                      <input
                        type="checkbox"
                        checked={editingQuiz.quiz.questions[activeQuestionIndex]?.isRequired ?? true}
                        onChange={(e) => {
                          const updated = [...editingQuiz.quiz.questions];
                          updated[activeQuestionIndex].isRequired = e.target.checked;
                          setEditingQuiz({
                            ...editingQuiz,
                            quiz: { ...editingQuiz.quiz, questions: updated },
                          });
                        }}
                        className="size-4 rounded text-purple-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Randomize Choices</span>
                      <input
                        type="checkbox"
                        checked={editingQuiz.quiz.questions[activeQuestionIndex]?.randomize ?? true}
                        onChange={(e) => {
                          const updated = [...editingQuiz.quiz.questions];
                          updated[activeQuestionIndex].randomize = e.target.checked;
                          setEditingQuiz({
                            ...editingQuiz,
                            quiz: { ...editingQuiz.quiz, questions: updated },
                          });
                        }}
                        className="size-4 rounded text-purple-600"
                      />
                    </div>

                    <div>
                      <span className="text-gray-600 block">Points</span>
                      <input
                        type="number"
                        value={editingQuiz.quiz.questions[activeQuestionIndex]?.points ?? 1}
                        onChange={(e) => {
                          const updated = [...editingQuiz.quiz.questions];
                          updated[activeQuestionIndex].points = Number(e.target.value);
                          setEditingQuiz({
                            ...editingQuiz,
                            quiz: { ...editingQuiz.quiz, questions: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SETTINGS matching quiz settings.PNG */}
            {quizModalTab === "Settings" && (
              <div className="grid gap-6 lg:grid-cols-12 text-sm">
                {/* Scope & Timing */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Quiz Scope */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
                    <h4 className="font-bold text-gray-900">Quiz Scope &amp; Gating</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-gray-700 block">Passing Grade (%)</label>
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
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block">Question Order</label>
                        <select
                          value={editingQuiz.quiz.questionOrder}
                          onChange={(e) =>
                            setEditingQuiz({
                              ...editingQuiz,
                              quiz: {
                                ...editingQuiz.quiz,
                                questionOrder: e.target.value as any,
                              },
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm"
                        >
                          <option value="Random">Random</option>
                          <option value="Sequential">Sequential</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium text-gray-700">Allow Multiple Attempts</span>
                      <input
                        type="checkbox"
                        checked={editingQuiz.quiz.allowMultipleAttempts}
                        onChange={(e) =>
                          setEditingQuiz({
                            ...editingQuiz,
                            quiz: {
                              ...editingQuiz.quiz,
                              allowMultipleAttempts: e.target.checked,
                            },
                          })
                        }
                        className="size-4 rounded text-purple-600"
                      />
                    </div>
                  </div>

                  {/* Navigation & Display */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
                    <h4 className="font-bold text-gray-900">Navigation &amp; Display</h4>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingQuiz({
                            ...editingQuiz,
                            quiz: { ...editingQuiz.quiz, layout: "Single Question" },
                          })
                        }
                        className={cn(
                          "flex-1 rounded-xl border p-3 text-center transition-all",
                          editingQuiz.quiz.layout === "Single Question"
                            ? "border-purple-600 bg-purple-50 text-purple-700 font-bold"
                            : "border-gray-200 bg-white text-gray-600"
                        )}
                      >
                        Single Question View
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingQuiz({
                            ...editingQuiz,
                            quiz: { ...editingQuiz.quiz, layout: "Full Page" },
                          })
                        }
                        className={cn(
                          "flex-1 rounded-xl border p-3 text-center transition-all",
                          editingQuiz.quiz.layout === "Full Page"
                            ? "border-purple-600 bg-purple-50 text-purple-700 font-bold"
                            : "border-gray-200 bg-white text-gray-600"
                        )}
                      >
                        Full Page View
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Reveal answers after submission</span>
                        <input
                          type="checkbox"
                          checked={editingQuiz.quiz.revealAnswers}
                          onChange={(e) =>
                            setEditingQuiz({
                              ...editingQuiz,
                              quiz: {
                                ...editingQuiz.quiz,
                                revealAnswers: e.target.checked,
                              },
                            })
                          }
                          className="size-4 rounded text-purple-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Hide &ldquo;Previous&rdquo; button (Strict Forward)</span>
                        <input
                          type="checkbox"
                          checked={editingQuiz.quiz.hidePreviousButton}
                          onChange={(e) =>
                            setEditingQuiz({
                              ...editingQuiz,
                              quiz: {
                                ...editingQuiz.quiz,
                                hidePreviousButton: e.target.checked,
                              },
                            })
                          }
                          className="size-4 rounded text-purple-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Summary Badge */}
                <div className="lg:col-span-4 rounded-xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
                  <h4 className="font-bold text-gray-900">Drill Specification</h4>
                  <div className="rounded-xl bg-purple-50 p-4 text-center space-y-1">
                    <p className="text-3xl font-extrabold text-purple-700">
                      {editingQuiz.quiz.passingGrade}%
                    </p>
                    <p className="text-xs font-semibold text-purple-700">Passing Grade</p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>Total questions: <strong>{editingQuiz.quiz.questions.length}</strong></p>
                    <p>Passing standard: <strong>Zero-fault / Practical Competence</strong></p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingQuiz(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveQuiz}
                className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-700 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Save Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
