"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UploadIcon,
  ImageIcon,
  PlusIcon,
  SearchIcon,
  CategoriesIcon,
  Trash2Icon,
  CloseIcon,
} from "@/app/admin/adminIcons";
import categoriesJson from "@/data/categories.json";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  description: string;
  image?: string;
  coursesCount: number;
}

const initialCategories: CategoryItem[] = categoriesJson as CategoryItem[];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [parentFilter, setParentFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  // Modal State for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form Fields (Slug removed per user directive)
  const [formName, setFormName] = useState("");
  const [formParent, setFormParent] = useState("None");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formError, setFormError] = useState("");

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormParent("None");
    setFormDescription("");
    setFormImage("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormParent(category.parent && category.parent !== "None" ? category.parent : "None");
    setFormDescription(category.description && category.description !== "—" ? category.description : "");
    setFormImage(category.image || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormError("");
  };

  // Save (Create or Update)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Please provide a category name.");
      return;
    }

    const derivedSlug = formName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (editingCategory) {
      // Update existing
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formName.trim(),
                slug: derivedSlug || c.slug,
                parent: formParent !== "None" ? formParent : undefined,
                description: formDescription.trim() || "—",
                image: formImage || c.image,
              }
            : c
        )
      );
    } else {
      // Create new
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        slug: derivedSlug,
        parent: formParent !== "None" ? formParent : undefined,
        description: formDescription.trim() || "—",
        image: formImage || undefined,
        coursesCount: 0,
      };
      setCategories([newCat, ...categories]);
    }

    handleCloseModal();
  };

  // Delete Single
  const handleDeleteSingle = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      setCategories(categories.filter((c) => c.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  // Select All
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map((c) => c.id));
    }
  };

  // Select Single Checkbox
  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Apply
  const handleBulkApply = () => {
    if (bulkAction === "delete" && selectedIds.length > 0) {
      if (confirm(`Delete ${selectedIds.length} selected categories?`)) {
        setCategories(categories.filter((c) => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setBulkAction("");
      }
    }
  };

  // Unique Parents for Filter
  const uniqueParents = Array.from(
    new Set(categories.map((c) => c.parent).filter((p): p is string => Boolean(p) && p !== "None"))
  );

  // Filtered List
  const filteredCategories = categories.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      (c.parent && c.parent.toLowerCase().includes(query));
    const matchesParent =
      parentFilter === "all"
        ? true
        : parentFilter === "top_level"
        ? !c.parent || c.parent === "None"
        : c.parent === parentFilter;
    return matchesQuery && matchesParent;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Course Categories
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7D52F4] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <PlusIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">Add New Category</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name, description, or parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Parent Hierarchy Filter */}
          <select
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-[#7D52F4] focus:outline-none cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="top_level">Top Level Only</option>
            {uniqueParents.map((parent) => (
              <option key={parent} value={parent}>
                Sub-category of: {parent}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm font-medium text-gray-700 focus:border-[#7D52F4] focus:outline-none cursor-pointer"
          >
            <option value="">Bulk actions</option>
            <option value="delete">Delete Selected</option>
          </select>
          <button
            type="button"
            onClick={handleBulkApply}
            disabled={!bulkAction || selectedIds.length === 0}
            className="rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-sm font-semibold text-[#7D52F4] hover:bg-purple-100 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            Apply
          </button>
          {selectedIds.length > 0 && (
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          Showing {filteredCategories.length} of {categories.length} {categories.length === 1 ? "category" : "categories"}
        </span>
      </div>

      {/* Full Width Categories Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left text-sm text-gray-600 min-w-[850px]">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="w-12 px-4 py-3.5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCategories.length && filteredCategories.length > 0}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Parent Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Description</th>
                <th className="px-4 py-3.5 text-center whitespace-nowrap">Courses</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    No categories found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  const isSelected = selectedIds.includes(category.id);
                  const isTopLevel = !category.parent || category.parent === "None";

                  return (
                    <tr
                      key={category.id}
                      className={`hover:bg-purple-50/20 transition-colors ${
                        isSelected ? "bg-purple-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(category.id)}
                          className="size-4 rounded border-gray-300 text-[#7D52F4] focus:ring-purple-500 cursor-pointer"
                        />
                      </td>

                      {/* Image + Category Name */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-purple-50 text-[#7D52F4]">
                                <CategoriesIcon className="size-5" />
                              </div>
                            )}
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(category)}
                              className="font-bold text-gray-900 hover:text-[#7D52F4] transition-colors text-left line-clamp-1 block text-sm"
                            >
                              {category.name}
                            </button>
                            <span className="text-xs text-gray-400 font-mono block">
                              /{category.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Parent Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {isTopLevel ? (
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            Top Level
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-lg bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-semibold text-[#7D52F4]">
                            ↳ {category.parent}
                          </span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-sm">
                          {category.description}
                        </p>
                      </td>

                      {/* Courses Count */}
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center min-w-8 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-[#7D52F4] border border-purple-200">
                          {category.coursesCount}
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(category)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:border-purple-200 hover:bg-purple-50 hover:text-[#7D52F4] transition-colors whitespace-nowrap shrink-0"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSingle(category.id, category.name)}
                            className="rounded-xl p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap shrink-0"
                            title="Delete category"
                          >
                            <Trash2Icon className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT MODAL (Slug & Extra Input Descriptions Removed) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors shrink-0"
                title="Close"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 space-y-5">
              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                  {formError}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formError) setFormError("");
                  }}
                  placeholder="e.g. Industrial Automation"
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                />
              </div>

              {/* Parent Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Parent Category
                </label>
                <select
                  value={formParent}
                  onChange={(e) => setFormParent(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 focus:border-[#7D52F4] focus:outline-none cursor-pointer"
                >
                  <option value="None">None (Top Level Category)</option>
                  {categories
                    .filter((c) => !editingCategory || c.id !== editingCategory.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief summary of what this category covers..."
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7D52F4] focus:outline-none"
                />
              </div>

              {/* Category Image Uploader */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Category Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                    {formImage ? (
                      <Image
                        src={formImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-6 text-gray-300" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        // Quick pick demo image if none set
                        if (!formImage) {
                          setFormImage("/images/courses/web-development-bootcamp-thumbnail.webp");
                        } else {
                          setFormImage("");
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-semibold text-[#7D52F4] hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0 self-start"
                    >
                      <UploadIcon className="size-3.5 shrink-0" />
                      <span>{formImage ? "Remove / Change Image" : "Upload Image"}</span>
                    </button>
                    <span className="text-[11px] text-gray-400">
                      PNG, JPG, or WebP (max 5 MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#7D52F4] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors whitespace-nowrap shrink-0"
                >
                  {editingCategory ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
