"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { coursePlayerData, getCoursePlayerData } from "@/data/coursePlayerData";
import { cn } from "@/lib/utils";

// Inline icons
const QuizIllustration = () => (
  <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="74" rx="30" ry="4" fill="#EFEBFF" />
    <path
      d="M36 28h8a6 6 0 1 0 12 0h8a4 4 0 0 1 4 4v8a6 6 0 1 1 0 12v8a4 4 0 0 1-4 4h-8a6 6 0 1 1-12 0h-8a4 4 0 0 1-4-4v-8a6 6 0 1 0 0-12v-8a4 4 0 0 1 4-4z"
      fill="#F8F6FF"
      stroke="#7D52F4"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="18" r="2.5" fill="#7D52F4" opacity="0.6" />
    <circle cx="70" cy="30" r="1.5" fill="#7D52F4" opacity="0.4" />
    <circle cx="32" cy="20" r="1.5" fill="#7D52F4" opacity="0.4" />
  </svg>
);

const QuestionMarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GraduationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

type QuizState = "start" | "active" | "summary";

export default function QuizPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const quizId = params.quizId as string;

  const course = getCoursePlayerData(courseSlug);
  const quiz = course?.quizzes[quizId] ?? {
    id: quizId,
    title: "Lesson Knowledge Check",
    questions: 3,
    totalMarks: 3,
    passingGrade: 70,
    questionList: [
      {
        id: "q1",
        text: "The core principles covered in this lesson reflect current best practices.",
        type: "true_false",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "q2",
        text: "What is the primary benefit of modular architecture?",
        type: "multiple_choice",
        options: ["Maintainability", "Random execution", "Memory leaking", "Unpredictability"],
        correctIndex: 0,
      },
      {
        id: "q3",
        text: "Practicing with real-world examples improves long-term skill retention.",
        type: "true_false",
        options: ["True", "False"],
        correctIndex: 0,
      },
    ],
  };

  const [quizState, setQuizState] = useState<QuizState>("start");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  if (!quiz) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Quiz not found.</p>
      </div>
    );
  }

  const currentQ = quiz.questionList[currentQIndex];
  const progress = ((currentQIndex) / quiz.questions) * 100;

  const handleStartQuiz = () => {
    setSelectedAnswers(new Array(quiz.questions).fill(null));
    setQuizState("active");
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(secs);
      setQuizState("summary");
    }
  };

  const handleSkipQuestion = () => {
    handleNext();
  };

  const handleQuit = () => {
    const secs = Math.floor((Date.now() - startTime) / 1000);
    setElapsedSeconds(secs);
    setQuizState("summary");
  };

  // Calculate results
  const correct = selectedAnswers.filter(
    (ans, i) => ans === quiz.questionList[i]?.correctIndex
  ).length;
  const incorrect = selectedAnswers.filter(
    (ans, i) => ans !== null && ans !== quiz.questionList[i]?.correctIndex
  ).length;
  const answered = selectedAnswers.filter((a) => a !== null).length;
  const earnedMarks = (correct / quiz.questions) * quiz.totalMarks;
  const passMarks = (quiz.passingGrade / 100) * quiz.totalMarks;
  const passed = earnedMarks >= passMarks;
  const pct = quiz.questions > 0 ? Math.round((correct / quiz.questions) * 100) : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ─── START SCREEN ────────────────────────────────────────────────────────────
  if (quizState === "start") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {/* Illustration */}
            <div className="flex items-center justify-center bg-gray-50 py-10">
              <QuizIllustration />
            </div>

            {/* Details */}
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>

              <div className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="text-gray-400"><QuestionMarkIcon /></span>
                  <span className="flex-1 text-sm text-gray-500">Questions</span>
                  <span className="text-sm font-medium text-gray-900">{quiz.questions}</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="text-gray-400"><CheckmarkIcon /></span>
                  <span className="flex-1 text-sm text-gray-500">Total Marks</span>
                  <span className="text-sm font-medium text-gray-900">{quiz.totalMarks}</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="text-gray-400"><GraduationIcon /></span>
                  <span className="flex-1 text-sm text-gray-500">Passing Grade</span>
                  <span className="text-sm font-medium text-gray-900">{quiz.passingGrade}%</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-4">
                <Link
                  href={`/learn/${courseSlug}`}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Skip Quiz
                </Link>
                <button
                  onClick={handleStartQuiz}
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE QUIZ ─────────────────────────────────────────────────────────────
  if (quizState === "active") {
    return (
      <div className="flex h-full flex-col">
        {/* Quiz Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{quiz.title}</h2>
          <button
            onClick={handleQuit}
            className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
          >
            Quit
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div
            className="h-1.5 bg-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-xl">
            <p className="mb-4 text-sm text-gray-500">
              Question No:{" "}
              <span className="font-bold text-gray-900">
                {String(currentQIndex + 1).padStart(2, "0")}/{quiz.questions}
              </span>
            </p>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                  {currentQIndex + 1}
                </span>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {currentQ.text}
                </p>
              </div>

              <div className={cn(
                "mt-5 gap-3",
                currentQ.type === "true_false" ? "flex" : "grid grid-cols-1"
              )}>
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all text-center",
                      selectedAnswers[currentQIndex] === idx
                        ? "border-purple-600 bg-purple-50 text-purple-700 font-semibold"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleSkipQuestion}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip Question
          </button>
          <button
            onClick={handleNext}
            className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
          >
            {currentQIndex < quiz.questions - 1 ? "Next" : "Submit Quiz"}
          </button>
        </div>
      </div>
    );
  }

  // ─── SUMMARY SCREEN ───────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <button
          onClick={() => {
            setQuizState("start");
            setCurrentQIndex(0);
            setSelectedAnswers([]);
          }}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Quiz Summary
        </button>
        <Link href={`/learn/${courseSlug}`} className="text-gray-400 hover:text-gray-600">
          <XIcon />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center">{quiz.title}</h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            Topic{" "}
            <em>Course Topic</em>{" "}in{" "}
            <span className="underline decoration-dotted">{course.title}</span>
          </p>

          {/* Score card */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <div className="flex items-start gap-6">
              {/* Score circle */}
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-gray-200 text-3xl font-bold text-gray-900">
                {pct}
              </div>

              <div className="flex-1">
                {/* Pass/Fail badge */}
                <div className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                  passed
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                )}>
                  {passed ? <CheckmarkIcon /> : <AlertIcon />}
                  {passed ? "Passed" : "Failed"}
                </div>

                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    Earned Marks{" "}
                    <strong>{earnedMarks.toFixed(2)} ({pct}%)</strong>
                  </p>
                  <p>
                    Pass Marks{" "}
                    <strong>{passMarks.toFixed(2)} ({quiz.passingGrade}%)</strong>
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                  <ClockIcon />
                  <span>{formatTime(elapsedSeconds)} Seconds</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-1 text-sm shrink-0">
                <p className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-gray-700">{correct} correct</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-500 inline-block" />
                  <span className="text-gray-700">{incorrect} incorrect</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-gray-400 inline-block" />
                  <span className="text-gray-700">{quiz.questions} total</span>
                </p>
              </div>
            </div>

            {/* Attempted date */}
            <p className="mt-4 text-center text-sm text-gray-500">
              Attempted on: {new Date().toLocaleString()}
            </p>
          </div>

          {/* No questions answered warning */}
          {answered === 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertIcon />
              No Questions Answered.
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-end border-t border-gray-100 px-6 py-4">
        <Link
          href={`/learn/${courseSlug}`}
          className="rounded-xl bg-purple-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
        >
          Continue Lesson
        </Link>
      </div>
    </div>
  );
}
