"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  StudentsIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  ExternalLinkIcon,
  MoreVerticalIcon,
  CheckCircleIcon,
  CloseIcon,
  CoursesIcon,
} from "../adminIcons";

interface StudentRow {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  email: string;
  registrationDate: string;
  coursesTaken: number;
  courses: string[];
  company?: string;
  status: "Active" | "Completed" | "Pending";
}

const initialStudents: StudentRow[] = [
  {
    id: "1",
    name: "admin",
    avatarLetter: "A",
    avatarBg: "bg-purple-600",
    email: "dev-email@wpengine.local",
    registrationDate: "September 12, 2026 11:18 am",
    coursesTaken: 1,
    courses: ["The Complete Web Development Bootcamp"],
    company: "Skilliant Internal Academy",
    status: "Active",
  },
  {
    id: "2",
    name: "Alex Walker",
    avatarLetter: "A",
    avatarBg: "bg-teal-600",
    email: "alex.walker@apexlogistics.com",
    registrationDate: "September 10, 2026 9:30 am",
    coursesTaken: 2,
    courses: ["Heavy Machinery Inspection & Safety", "Hydraulics Operations"],
    company: "Apex Logistics Corp",
    status: "Active",
  },
  {
    id: "3",
    name: "Elena Rostova",
    avatarLetter: "E",
    avatarBg: "bg-indigo-600",
    email: "elena.r@datacore.io",
    registrationDate: "September 08, 2026 3:15 pm",
    coursesTaken: 2,
    courses: ["Python for Data Science", "Data Science Foundations"],
    company: "DataCore Systems",
    status: "Active",
  },
  {
    id: "4",
    name: "Marcus Chen",
    avatarLetter: "M",
    avatarBg: "bg-amber-600",
    email: "marcus.chen@metroworks.org",
    registrationDate: "September 05, 2026 10:45 am",
    coursesTaken: 1,
    courses: ["Python for Data Science"],
    company: "MetroWorks Transit",
    status: "Completed",
  },
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [activeStudentDetail, setActiveStudentDetail] = useState<StudentRow | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkApply = () => {
    if (bulkAction === "delete" && selectedIds.length > 0) {
      setStudents(students.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      setBulkAction("");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.company && s.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Students</h1>
        </div>
      </div>

      {/* Controls Bar matching students table.PNG */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="">Bulk Action</option>
            <option value="email">Send Broadcast Email</option>
            <option value="export">Export Transcript CSV</option>
            <option value="delete">Remove Selected</option>
          </select>
          <button
            onClick={handleBulkApply}
            className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
          >
            Apply
          </button>
        </div>

        {/* Filter, Sort & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0">
            <FilterIcon className="size-3.5 text-gray-400" />
            <span className="whitespace-nowrap">Filters</span>
          </button>
          <button
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
            title="Sort list"
          >
            <SortIcon className="size-3.5 text-gray-400" />
          </button>
          <div className="relative min-w-[180px] sm:min-w-[240px] flex-1 sm:flex-initial">
            <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Students Table matching students table.PNG */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-600 min-w-[850px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="w-12 px-4 py-3.5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">Students</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Email</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Registration Date</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Course Taken</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-purple-50/30 transition-colors ${
                      isSelected ? "bg-purple-50/50" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(student.id)}
                        className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>

                    {/* Student Avatar + Name + Link */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${student.avatarBg} text-sm font-bold text-white shadow-2xs`}
                        >
                          {student.avatarLetter}
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-gray-900">
                          <span>{student.name}</span>
                          <button
                            onClick={() => setActiveStudentDetail(student)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                            title="Open student profile"
                          >
                            <ExternalLinkIcon className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">
                      {student.email}
                    </td>

                    {/* Registration Date */}
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {student.registrationDate}
                    </td>

                    {/* Course Taken */}
                    <td className="px-4 py-4 font-bold text-purple-700 whitespace-nowrap">
                      {student.coursesTaken}
                    </td>

                    {/* Actions: Details button + Menu */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveStudentDetail(student)}
                          className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-purple-700 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">Details</span>
                        </button>
                        <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0">
                          <MoreVerticalIcon className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Slide-over Modal */}
      {activeStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setActiveStudentDetail(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 z-10 space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-11 items-center justify-center rounded-full ${activeStudentDetail.avatarBg} text-base font-bold text-white`}
                >
                  {activeStudentDetail.avatarLetter}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{activeStudentDetail.name}</h3>
                  <p className="text-sm text-gray-500">{activeStudentDetail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentDetail(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 shrink-0"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50/70 p-4">
                <div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Company / Org</span>
                  <p className="mt-1 font-bold text-gray-800">{activeStudentDetail.company || "Independent Learner"}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</span>
                  <p className="mt-1 flex items-center gap-1.5 font-bold text-emerald-600">
                    <CheckCircleIcon className="size-3.5 text-emerald-600" />
                    <span>{activeStudentDetail.status}</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Enrolled Courses ({activeStudentDetail.coursesTaken})</h4>
                <div className="mt-2 space-y-2">
                  {activeStudentDetail.courses.map((courseTitle) => (
                    <div
                      key={courseTitle}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <CoursesIcon className="size-4 text-purple-600" />
                        <span className="font-semibold text-gray-800">{courseTitle}</span>
                      </div>
                      <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 whitespace-nowrap shrink-0">
                        In Progress
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={() => setActiveStudentDetail(null)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Close</span>
              </button>
              <Link
                href={`/dashboard?viewAs=${activeStudentDetail.id}`}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">View Learner Transcript</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
