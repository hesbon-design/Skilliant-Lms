"use client";

import { useParams } from "next/navigation";
import { getCoursePlayerData } from "@/data/coursePlayerData";

const DocumentIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#F9FAFB"/>
    <polyline points="14 2 14 8 20 8" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9" y1="13" x2="15" y2="13" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="17" x2="13" y2="17" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ResourceFileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ResourcesPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const course = getCoursePlayerData(courseSlug);

  const resources = course?.resources ?? [];

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
        <ResourceFileIcon />
        Resources
      </h2>

      <div className="mt-5 flex-1 rounded-xl border border-gray-100 bg-white overflow-hidden">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-48 py-16">
            <DocumentIcon />
            <p className="mt-3 text-sm text-gray-500">No Resources Available!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-purple-600">
                  <ResourceFileIcon />
                </span>
                <span className="text-sm font-medium text-gray-700 hover:text-purple-600">
                  {res.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
