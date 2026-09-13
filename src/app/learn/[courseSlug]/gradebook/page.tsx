"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getCoursePlayerData } from "@/data/coursePlayerData";

const GradebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CourseGradebookPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  const gradebook = course?.gradebook ?? [];

  // Calculate statistics
  const attemptedItems = gradebook.filter((g) => g.earnedMarks !== undefined);
  const totalPossible = attemptedItems.reduce((sum, g) => sum + g.maxMarks, 0);
  const totalEarned = attemptedItems.reduce((sum, g) => sum + (g.earnedMarks ?? 0), 0);
  const gradePercent = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">✓ Competent / Passed</span>;
      case "failed":
        return <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">✕ Drill Retake Needed</span>;
      case "pending":
        return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">⏳ Field Evaluation Pending</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">Drill Not Attempted</span>;
    }
  };

  return (
    <div className="flex h-full flex-col px-6 py-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
            <span className="text-purple-600">
              <GradebookIcon />
            </span>
            Competency &amp; Evaluation Record
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Practical overtraining evaluations, zero-fault safety checklists, and operating thresholds
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-medium text-gray-600">Practical Competency</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">{gradePercent}%</h4>
          <p className="mt-1 text-sm text-purple-600 font-semibold">
            {gradePercent >= 85
              ? "Certified Competent ✓"
              : gradePercent >= 70
              ? "In Practical Training"
              : "Remediation Required"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-medium text-gray-600">Practical Drills &amp; Checks</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">{gradebook.length}</h4>
          <p className="mt-1 text-sm text-gray-500">
            {attemptedItems.length} Graded / Evaluated
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-medium text-gray-600">Curriculum &amp; Sim Completion</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">{course.percentCompleted}%</h4>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${course.percentCompleted}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <p className="text-sm font-medium text-gray-600">Endorsement / License</p>
          <h4 className="mt-2 text-sm font-bold text-gray-900 flex items-center gap-1.5">
            {course.percentCompleted === 100 ? (
              <span className="text-green-600">✓ Endorsement Ready</span>
            ) : (
              <span className="text-amber-600">🔒 In Training (100% req.)</span>
            )}
          </h4>
          <p className="mt-1 text-sm text-gray-500">Passing score required</p>
        </div>
      </div>

      {/* Graded Items Table */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-bold text-gray-900">Drill &amp; Assessment Breakdown</h3>
        </div>

        {gradebook.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No graded assessments in this course curriculum.
          </div>
        ) : (
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-sm min-w-[850px]">
              <thead className="border-b border-gray-100 bg-gray-50/70 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5 whitespace-nowrap">Practical Drill / Assessment</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Drill Type</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Passing Standard / Max</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Achieved Score</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Competency Status</th>
                  <th className="px-6 py-3.5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {gradebook.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap min-w-[240px]">
                      {item.title}
                      {item.dueDate && (
                        <p className="font-normal text-gray-500 text-sm mt-0.5 whitespace-nowrap">Due: {item.dueDate}</p>
                      )}
                      {item.submittedDate && (
                        <p className="font-normal text-gray-500 text-sm mt-0.5 whitespace-nowrap">Submitted: {item.submittedDate}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize whitespace-nowrap">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {item.passMarks} / {item.maxMarks}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      {item.earnedMarks !== undefined ? (
                        <span>{item.earnedMarks} / {item.maxMarks}</span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {item.type === "quiz" ? (
                        <Link
                          href={`/learn/${courseSlug}/quiz/${item.id}`}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 font-semibold text-purple-600 hover:bg-purple-50 transition-colors whitespace-nowrap"
                        >
                          {item.status === "passed" || item.status === "failed" ? "View Attempt" : "Take Quiz"}
                        </Link>
                      ) : (
                        <Link
                          href={`/learn/${courseSlug}/assignment/${item.id}`}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 font-semibold text-purple-600 hover:bg-purple-50 transition-colors whitespace-nowrap"
                        >
                          {item.status === "pending" ? "View Status" : "View Assignment"}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
