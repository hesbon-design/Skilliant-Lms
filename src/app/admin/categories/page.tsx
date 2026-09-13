"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UploadIcon,
  ImageIcon,
  PlusIcon,
  SearchIcon,
  CategoriesIcon,
  MoreVerticalIcon,
  Trash2Icon,
  FolderTreeIcon,
} from "@/app/admin/adminIcons";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  description: string;
  image?: string;
  count: number;
}

const initialCategories: CategoryItem[] = [
  {
    id: "1",
    name: "Data & AI",
    slug: "data-ai",
    description: "Data analytics, machine learning, and artificial intelligence tracks",
    count: 2,
  },
  {
    id: "2",
    name: "Development",
    slug: "development",
    description: "Full-stack software engineering, modern web frameworks, and architecture",
    count: 1,
  },
  {
    id: "3",
    name: "Heavy Machinery & Safety",
    slug: "machinery-safety",
    description: "OSHA-compliant equipment operation, safety inspection, and hazard management",
    count: 1,
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("None");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newCategory: CategoryItem = {
      id: Date.now().toString(),
      name: name.trim(),
      slug: newSlug,
      parent: parent !== "None" ? parent : undefined,
      description: description.trim() || "—",
      count: 0,
    };

    setCategories([...categories, newCategory]);
    setName("");
    setSlug("");
    setParent("None");
    setDescription("");
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map((c) => c.id));
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
      setCategories(categories.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      setBulkAction("");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Course Categories</h1>
        </div>

        {/* Search Categories */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[240px]">
            <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout matching course categories.PNG */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Add New Category Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Add New Category</h2>

            <form onSubmit={handleAddCategory} className="mt-5 space-y-4 text-sm">
              {/* Name */}
              <div>
                <label className="block font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Industrial Automation"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The name is how it appears across your training platform.
                </p>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. industrial-automation"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The &ldquo;slug&rdquo; is the URL-friendly version of the name (lowercase, numbers, and hyphens).
                </p>
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Parent Category</label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="None">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Assign a parent category to create a hierarchical trade or department taxonomy.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of what this category covers..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The description informs learners and company administrators when browsing tracks.
                </p>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block font-semibold text-gray-700">Category Image</label>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                    <ImageIcon className="size-6 text-gray-300" />
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                  >
                    <UploadIcon className="size-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Upload Image</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  Add New Category
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Categories Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm text-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                <option value="">Bulk actions</option>
                <option value="delete">Delete</option>
              </select>
              <button
                onClick={handleBulkApply}
                className="rounded-lg border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
              >
                Apply
              </button>
            </div>
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              {filteredCategories.length} {filteredCategories.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
            <div className="overflow-x-auto [scrollbar-width:thin]">
              <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="w-10 px-3.5 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredCategories.length && filteredCategories.length > 0}
                        onChange={toggleSelectAll}
                        className="size-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Image</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Name</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Description</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Slug</th>
                    <th className="px-3.5 py-3 text-right whitespace-nowrap">Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((category) => {
                    const isSelected = selectedIds.includes(category.id);
                    return (
                      <tr
                        key={category.id}
                        className={`hover:bg-purple-50/30 transition-colors ${
                          isSelected ? "bg-purple-50/50" : ""
                        }`}
                      >
                        <td className="px-3.5 py-3.5 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(category.id)}
                            className="size-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-3.5 py-3.5 whitespace-nowrap">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold text-sm">
                            <CategoriesIcon className="size-4" />
                          </div>
                        </td>
                        <td className="px-3.5 py-3.5 font-bold text-purple-700 hover:text-purple-900 cursor-pointer whitespace-nowrap">
                          {category.name}
                        </td>
                        <td className="px-3.5 py-3.5 text-gray-500 max-w-[240px] truncate whitespace-nowrap">
                          {category.description}
                        </td>
                        <td className="px-3.5 py-3.5 text-gray-500 font-mono text-sm whitespace-nowrap">
                          {category.slug}
                        </td>
                        <td className="px-3.5 py-3.5 text-right font-bold text-purple-600 whitespace-nowrap">
                          {category.count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
