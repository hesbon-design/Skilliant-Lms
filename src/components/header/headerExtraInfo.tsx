"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloseIcon, SearchIcon } from "@/lib/icons";
import Button from "../ui/button";
import ButtonArrow from "../ui/buttonArrow";

const HeaderExtraInfo = () => {
  const router = useRouter();
  const [searchBarShow, setSearchBarShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchBarShow(false);
    }
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      {/* Desktop Search Bar */}
      <form onSubmit={handleSearch} className="relative hidden lg:block w-48 xl:w-56">
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-500 pointer-events-none">
          <SearchIcon className="size-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search course here..."
          className="h-11 w-full rounded-full border border-gray-200 bg-gray-50/80 pr-4 pl-9 text-sm text-gray-800 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
        />
      </form>

      {/* Mobile Search Button */}
      <button
        type="button"
        onClick={() => setSearchBarShow(true)}
        className="flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors lg:hidden"
        title="Search Courses"
      >
        <SearchIcon className="size-4" />
      </button>

      {/* Mobile Search Overlay */}
      {searchBarShow && (
        <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-3 bg-white px-4 shadow-md border-b border-gray-100 lg:hidden animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="relative flex flex-1 items-center">
            <span className="absolute left-3 text-gray-500">
              <SearchIcon className="size-4" />
            </span>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course here..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-9 text-sm text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </form>
          <button
            type="button"
            onClick={() => setSearchBarShow(false)}
            className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
      )}

      {/* Shopping Cart Button */}
      <Link
        href="/cart"
        className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/40 hover:text-purple-600 transition-all"
        title="Shopping Cart (2 items)"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shadow-xs">
          2
        </span>
      </Link>

      {/* Login / Sign up Button */}
      <Link
        href="/login"
        className="group hidden h-11 shrink-0 items-center justify-between gap-2.5 rounded-full bg-[#7D52F4] hover:bg-purple-700 text-white py-1 pr-1 pl-5 text-sm font-semibold tracking-base transition-colors lg:inline-flex shadow-xs"
      >
        <span>Login/ Sign up</span>
        <ButtonArrow />
      </Link>
    </div>
  );
};

export default HeaderExtraInfo;
