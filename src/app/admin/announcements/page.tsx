"use client";

import React, { useState } from "react";
import {
  AnnouncementsIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  PlusIcon,
  CloseIcon,
  CoursesIcon,
  MoreVerticalIcon,
  BellIcon,
} from "../adminIcons";

interface AnnouncementItem {
  id: string;
  title: string;
  courseTitle: string;
  date: string;
  content: string;
  sendEmail: boolean;
}

const initialAnnouncements: AnnouncementItem[] = [
  {
    id: "1",
    title: "Final Certification Drills Schedule Released",
    courseTitle: "The Complete Web Development Bootcamp",
    date: "September 12, 2026",
    content: "The calendar for end-of-module practical reviews is now live. Please check the Live Classes tab for booking your evaluation slot.",
    sendEmail: true,
  },
  {
    id: "2",
    title: "Updated Zero-Fault Safety Checklists",
    courseTitle: "Python for Data Science",
    date: "September 08, 2026",
    content: "We have refreshed the dataset repository with new real-world enterprise test fixtures for Module 3.",
    sendEmail: false,
  },
];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New announcement form state
  const [course, setCourse] = useState("The Complete Web Development Bootcamp");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendEmail, setSendEmail] = useState(true);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newItem: AnnouncementItem = {
      id: Date.now().toString(),
      title: title.trim(),
      courseTitle: course,
      date: "September 12, 2026",
      content: content.trim(),
      sendEmail,
    };

    setAnnouncements([newItem, ...announcements]);
    setTitle("");
    setContent("");
    setIsModalOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAnnouncements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAnnouncements.map((a) => a.id));
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
      setAnnouncements(announcements.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      setBulkAction("");
    }
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Announcements</h1>
      </div>

      {/* Banner Card matching anncouncements.PNG */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-2xs">
            <AnnouncementsIcon className="size-6" />
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Create Announcement
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Notify all students of your course
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
        >
          <PlusIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">Add New Announcement</span>
        </button>
      </div>

      {/* Controls Bar matching anncouncements.PNG */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm font-medium text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="">Bulk Action</option>
            <option value="delete">Delete Selected</option>
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
            <FilterIcon className="size-3.5 text-gray-400 shrink-0" />
            <span className="whitespace-nowrap">Filters</span>
          </button>
          <button
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 transition-colors"
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

      {/* Announcements List or Empty State */}
      {filteredAnnouncements.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-20 px-6 text-center shadow-xs">
          <div className="flex size-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <AnnouncementsIcon className="size-8 text-gray-300" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-700">No Data Found.</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            You haven&apos;t broadcasted any announcements to enrolled learners yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-sm text-gray-600 min-w-[850px]">
              <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="w-12 px-4 py-3.5 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredAnnouncements.length && filteredAnnouncements.length > 0}
                      onChange={toggleSelectAll}
                      className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Announcement</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Target Course</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Email Delivery</th>
                  <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAnnouncements.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-purple-50/30 transition-colors ${
                        isSelected ? "bg-purple-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <h4 className="font-bold text-gray-900 whitespace-nowrap">{item.title}</h4>
                          <p className="mt-1 text-sm text-gray-500 max-w-sm truncate">{item.content}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-gray-700 whitespace-nowrap">
                          <CoursesIcon className="size-3.5 text-purple-600 shrink-0" />
                          <span>{item.courseTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                            item.sendEmail
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.sendEmail ? "✓ Dispatched" : "In-App Only"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setAnnouncements(announcements.filter((a) => a.id !== item.id))}
                          className="rounded-lg px-2.5 py-1 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete announcement"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Create Course Announcement</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700">Select Target Course</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  <option>The Complete Web Development Bootcamp</option>
                  <option>Python for Data Science</option>
                  <option>Data Science Foundations</option>
                  <option>All Enrolled Students (Platform Broadcast)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for End-of-Module Evaluations"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Announcement Message</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message to enrolled students..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-purple-50/60 p-3">
                <input
                  type="checkbox"
                  id="sendEmailCheck"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="sendEmailCheck" className="text-sm text-purple-900 font-medium cursor-pointer">
                  Send immediate email notification to all enrolled students
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 whitespace-nowrap shrink-0"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
