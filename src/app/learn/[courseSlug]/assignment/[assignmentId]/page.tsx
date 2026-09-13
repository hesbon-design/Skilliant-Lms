"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCoursePlayerData } from "@/data/coursePlayerData";

// Icons
const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GraduationCapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);


const AttemptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 8 12 3 7 8" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Text formatting toolbar
const formatButtons = [
  { label: "B", cmd: "bold", className: "font-bold" },
  { label: "I", cmd: "italic", className: "italic" },
  { label: "U", cmd: "underline", className: "underline" },
];

type AssignmentState = "details" | "submitting" | "reviewing";

export default function AssignmentPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const assignmentId = params.assignmentId as string;

  const course = getCoursePlayerData(courseSlug);
  const assignment = course?.assignments[assignmentId] ?? {
    id: assignmentId,
    title: "Lesson Practical Assignment",
    totalMarks: 10,
    passingMarks: 6,
    totalAttempts: 3,
    duration: "7 Days",
    deadline: "September 30, 2026 11:59 pm",
    daysRemaining: 14,
    description: "Complete the practical assignment for this module. Follow the requirements, test your implementation, and upload your project files or repository link below.",
  };

  const [state, setState] = useState<AssignmentState>("details");
  const [, setEditorContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFormat = (cmd: string) => {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  };

  const handleFileSelect = (file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      alert("File size exceeds 2 MB limit.");
      return;
    }
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const isExpired =
    assignment.deadline === "Expired" ||
    assignment.daysRemaining <= 0 ||
    assignment.id === "lesson-3-2";

  const infoRows = [
    { icon: <CheckmarkIcon />, label: "Total Marks", value: String(assignment.totalMarks) },
    { icon: <GraduationCapIcon />, label: "Passing Marks", value: String(assignment.passingMarks) },
    { icon: <AttemptIcon />, label: "Total Attempts", value: String(assignment.totalAttempts) },
    { icon: <ClockIcon />, label: "Duration", value: assignment.duration },
    {
      icon: <CalendarIcon />,
      label: "Deadline",
      value: isExpired ? (
        <span className="text-gray-900 font-medium">Expired</span>
      ) : (
        <span>
          {assignment.deadline}{" "}
          <span className="text-gray-500">({assignment.daysRemaining} days remaining)</span>
        </span>
      ),
    },
  ];

  // ─── DETAILS STATE ───────────────────────────────────────────────────────────
  if (state === "details") {
    return (
      <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-2xl space-y-5">
          {/* Status badge + title */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="inline-block rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-xs font-medium text-gray-600">
              Not Started
            </span>
            <h2 className="mt-3 text-xl font-bold text-gray-900">{assignment.title}</h2>

            {/* Expired / Missed Deadline Warning matching missed asigment.png */}
            {isExpired && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm font-medium text-amber-900">
                <AlertIcon className="size-4 shrink-0 text-amber-600" />
                <span>You have missed the submission deadline. Please contact the instructor for more information.</span>
              </div>
            )}

            {/* Info table */}
            <div className="mt-5 divide-y divide-gray-50 rounded-xl border border-gray-100">
              {infoRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-purple-600 shrink-0">{row.icon}</span>
                  <span className="flex-1 text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Assignment Description
            </p>
            {isExpired && assignment.id === "lesson-3-2" ? (
              <div className="mt-3 space-y-5 text-sm leading-relaxed text-gray-700">
                <p>
                  Using the principles learned throughout this course, create a practical 7-day meal plan tailored to your goals.
                </p>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
                  <p className="mt-2 text-gray-600">Your meal plan must include:</p>
                  <ul className="mt-1.5 list-disc ml-5 space-y-1 text-gray-600">
                    <li>Breakfast, lunch, and dinner for 7 days</li>
                    <li>At least one healthy snack option per day</li>
                    <li>Balanced protein, carbohydrate, and fat sources</li>
                    <li>Estimated daily calorie target</li>
                    <li>Grocery shopping list</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">Submission</h3>
                  <p className="mt-2 text-gray-600">Upload:</p>
                  <ul className="mt-1.5 list-disc ml-5 space-y-1 text-gray-600">
                    <li>Completed meal plan document (PDF or DOCX)</li>
                    <li>Grocery list</li>
                    <li>Short reflection (200–300 words) explaining your meal-planning decisions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">Evaluation Criteria</h3>
                  <ul className="mt-2 list-disc ml-5 space-y-1 text-gray-600">
                    <li>Nutritional balance (40%)</li>
                    <li>Practicality and sustainability (30%)</li>
                    <li>Variety of foods (20%)</li>
                    <li>Presentation and organization (10%)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {assignment.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          {isExpired ? (
            <div className="flex items-center justify-between gap-4 pb-8">
              <Link
                href={`/learn/${courseSlug}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                ← Return to Course
              </Link>
              <a
                href="mailto:instructor@skilliant.com"
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contact Instructor
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-4 pb-8">
              <Link
                href={`/learn/${courseSlug}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Skip Assignment
              </Link>
              <button
                onClick={() => setState("submitting")}
                className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
              >
                Start Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── SUBMITTING STATE ────────────────────────────────────────────────────────
  if (state === "submitting") {
    return (
      <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-2xl">
          <button
            onClick={() => setState("details")}
            className="mb-4 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <BackArrow />
            Back
          </button>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Link href="#" className="text-sm font-medium text-purple-600 hover:underline">
              {assignment.title}
            </Link>
            <h2 className="mt-1 text-xl font-bold text-gray-900">Submit Assignment</h2>

            {/* Toolbar + Editor */}
            <div className="mt-5 rounded-xl border border-gray-200 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-3 py-2">
                <select className="rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none">
                  <option>Heading 4</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Normal</option>
                </select>
                {formatButtons.map((btn) => (
                  <button
                    key={btn.cmd}
                    onMouseDown={(e) => { e.preventDefault(); handleFormat(btn.cmd); }}
                    className={`flex size-7 items-center justify-center rounded text-sm hover:bg-gray-200 transition-colors ${btn.className}`}
                    title={btn.cmd}
                  >
                    {btn.label}
                  </button>
                ))}
                {/* Bullet + Numbered + Align buttons */}
                {["≡", "≡#", "←", "→", "↔", "⇔", "↶", "↷"].map((sym, i) => (
                  <button
                    key={i}
                    className="flex size-7 items-center justify-center rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {/* Content Editable Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                className="min-h-40 p-4 text-sm outline-none focus:outline-none text-gray-700"
                data-placeholder="Start typing your assignment here..."
              />

              {/* Footer bar showing format indicator */}
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-1.5 text-xs text-gray-500 flex justify-between">
                <span>h4</span>
                <span className="text-green-500">::::</span>
              </div>
            </div>

            {/* Attachments */}
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-gray-800">Attachments</h3>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
                  isDragOver
                    ? "border-purple-400 bg-purple-50"
                    : "border-purple-200 bg-purple-50/30 hover:bg-purple-50/60"
                }`}
              >
                <UploadIcon />
                {uploadedFile ? (
                  <p className="text-sm font-medium text-purple-600">{uploadedFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-purple-700 font-medium">
                      PDF, DOC, DOCX, JPG, PNG Formats (Max: 1 file, Total file size: Max 2 MB)
                    </p>
                    <button className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Select Files
                    </button>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setState("reviewing")}
                className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVIEWING STATE ─────────────────────────────────────────────────────────
  const submittedDate = new Date().toLocaleString();
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">{assignment.title}</h2>

          {/* Being reviewed alert */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700">
            <AlertIcon />
            Your assignment is being reviewed. You&apos;ll be notified once grading is complete
          </div>

          {/* Info table */}
          <div className="mt-5 divide-y divide-gray-50 rounded-xl border border-gray-100">
            {infoRows.map((row, idx) => (
              <div key={idx} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-purple-600 shrink-0">{row.icon}</span>
                <span className="flex-1 text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Attempt history table */}
          <div className="mt-5 overflow-x-auto [scrollbar-width:thin] rounded-xl border border-gray-100">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">Attempt Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">Total Marks</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">Pass Marks</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">Earned Marks</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-50">
                  <td className="px-4 py-3 text-purple-600 font-medium whitespace-nowrap">{submittedDate}</td>
                  <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">{assignment.totalMarks}</td>
                  <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">{assignment.passingMarks}</td>
                  <td className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">0</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600 border border-amber-200 whitespace-nowrap">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Assignment Description
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {assignment.description}
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-end pb-8">
          <Link
            href={`/learn/${courseSlug}`}
            className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
          >
            Continue Lesson
          </Link>
        </div>
      </div>
    </div>
  );
}
