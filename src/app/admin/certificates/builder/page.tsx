"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { initialCertificates, AdminCertificate, availableCoursesList } from "@/data/adminCertificatesData";
import defaultCertificateSettings from "@/data/certificateSettings.json";
import {
  ClassicBorderSvg,
  FloralGarlandBorderSvg,
  ModernBorderSvg,
  CorporateBorderSvg,
  TechnicalBorderSvg,
  OfficialSealSvg,
  GoldMedallionSvg,
  QrCodeSvg,
  AuthorizedSignatureSvg,
  CursiveSignatureAndrewSvg,
  CursiveSignatureRobertSvg,
  OrnateDividerSvg,
  ModernDividerSvg,
  GuillocheWatermarkSvg,
  AcademicCrestWatermarkSvg,
  MonogramWatermarkSvg,
  CreativeWaveBorderSvg,
  MinimalistBorderSvg,
} from "@/components/certificates/CertificateSvgs";
import {
  CloseIcon,
  SearchIcon,
  SettingsIcon,
  CertificateIcon,
  CoursesIcon,
  StudentsIcon,
  UploadIcon,
  CheckCircleIcon,
} from "../../adminIcons";

type BuilderTab = "templates" | "elements" | "backdrops" | "media" | "layers" | "settings";

export interface CanvasElement {
  id: string;
  type: "text" | "logo" | "seal" | "medallion" | "signature" | "qrcode" | "divider" | "image";
  label: string;
  content: string;
  subcontent?: string;
  x: number; // percentage from left: 0 - 100
  y: number; // percentage from top: 0 - 100
  fontSize?: number;
  fontFamily?: "serif" | "sans" | "mono";
  fontWeight?: "normal" | "medium" | "bold" | "extrabold";
  fontStyle?: "normal" | "italic";
  color?: string;
  textAlign?: "left" | "center" | "right";
  visible: boolean;
  locked?: boolean;
}

interface WatermarkConfig {
  type: "none" | "guilloche" | "crest" | "monogram" | "custom_text";
  text: string;
  opacity: number; // 0.05 - 0.40
  scale: number; // 0.5 - 1.5
  paperTint: "white" | "parchment" | "cream" | "slate";
}

export interface BackdropConfig {
  color: string;
  pattern: "none" | "lines" | "geometric" | "waves";
  background:
    | "none"
    | "pastel_blobs"
    | "teal_frame"
    | "ornate_silver"
    | "navy_geometry"
    | "corner_glow"
    | "pinstripe_diploma"
    | "mint_waves"
    | "mosaic_tiles"
    | "playful_curves";
}

const BACKDROP_COLORS = [
  { id: "white", color: "#FFFFFF", name: "White" },
  { id: "amber", color: "#F59E0B", name: "Amber Yellow" },
  { id: "orange", color: "#F97316", name: "Deep Orange" },
  { id: "red_orange", color: "#EF4444", name: "Coral Red" },
  { id: "crimson", color: "#DC2626", name: "Crimson" },
  { id: "emerald", color: "#22C55E", name: "Emerald Green" },
  { id: "light_green", color: "#4ADE80", name: "Sage Green" },
  { id: "lime", color: "#CCFF00", name: "Lime Yellow" },
  { id: "teal", color: "#2DD4BF", name: "Cyan Teal" },
  { id: "sky", color: "#38BDF8", name: "Sky Blue" },
  { id: "rose", color: "#E11D48", name: "Rose" },
  { id: "magenta", color: "#E879F9", name: "Magenta" },
  { id: "purple", color: "#A855F7", name: "Purple" },
  { id: "pink", color: "#F472B6", name: "Light Pink" },
];

const BACKDROP_PATTERNS = [
  { id: "lines" as const, name: "Horizontal Lines" },
  { id: "geometric" as const, name: "Abstract Geometry" },
  { id: "waves" as const, name: "Sine Waves" },
];

const BACKDROP_BACKGROUNDS = [
  { id: "pastel_blobs" as const, name: "Pastel Abstract" },
  { id: "teal_frame" as const, name: "Modern Teal Frame" },
  { id: "ornate_silver" as const, name: "Classic Guilloche" },
  { id: "navy_geometry" as const, name: "Navy Geometry" },
  { id: "corner_glow" as const, name: "Vibrant Aura Glow" },
  { id: "pinstripe_diploma" as const, name: "Ivory Pinstripe" },
  { id: "mint_waves" as const, name: "Mint Waves" },
  { id: "mosaic_tiles" as const, name: "Blue Mosaic Tiles" },
  { id: "playful_curves" as const, name: "Memphis Curves" },
];

const INITIAL_SITE_MEDIA_LIBRARY = [
  { id: "media-inst-1", title: "Instructor Dr. Helen", url: "/images/instructor/img-1.png" },
  { id: "media-hero-2", title: "Academy Graduate", url: "/images/hero/img-2.png" },
  { id: "media-feat-1", title: "Specialization Track", url: "/images/features/img-1.png" },
  { id: "media-inst-2", title: "Instructor Marcus", url: "/images/instructor/img-2.png" },
  { id: "media-hero-1", title: "Senior Scholar", url: "/images/hero/img-1.png" },
  { id: "media-inst-4", title: "Instructor Emily", url: "/images/instructor/img-4.png" },
  { id: "media-feat-2", title: "Honors Distinction", url: "/images/features/img-2.png" },
  { id: "media-user-5", title: "Alumni Leader", url: "/images/testimonial/user-5.png" },
  { id: "media-hero-3", title: "Distinguished Fellow", url: "/images/hero/img-3.png" },
  { id: "media-inst-5", title: "Instructor David", url: "/images/instructor/img-5.png" },
  { id: "media-hero-4", title: "Research Director", url: "/images/hero/img-4.png" },
  { id: "media-inst-6", title: "Instructor Robert", url: "/images/instructor/img-6.png" },
  { id: "media-cert-frame", title: "Academic Insignia", url: "/images/certificate-frame.png" },
  { id: "media-blog-1", title: "Innovation Badge", url: "/images/blog/img-1.png" },
  { id: "media-blog-2", title: "Achievement Badge", url: "/images/blog/img-2.png" },
  { id: "media-signature", title: "Verified Seal Signature", url: "/images/signature.png" },
];

const templatePresets: Array<{ name: string; style: AdminCertificate["templateStyle"] }> = [
  {
    name: "Classic Academic",
    style: "Classic Border",
  },
  {
    name: "Creative Vanguard",
    style: "Creative Vanguard",
  },
  {
    name: "Corporate Crest",
    style: "Corporate Crest",
  },
  {
    name: "Modern Geometric",
    style: "Modern Geometric",
  },
  {
    name: "Technical Excellence",
    style: "Technical Excellence",
  },
  {
    name: "Minimalist Diploma",
    style: "Minimalist Diploma",
  },
];

const AVAILABLE_ELEMENT_TYPES = [
  {
    id: "text",
    label: "Text",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="currentColor">
        <path d="M5 4h14v3.5h-5.25v12.5h-3.5V7.5H5V4z" />
      </svg>
    ),
  },
  {
    id: "course",
    label: "Course",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: "student_name",
    label: "Student Name",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="currentColor">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
      </svg>
    ),
  },
  {
    id: "instructor",
    label: "Instructor",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="currentColor">
        <circle cx="6.5" cy="5" r="2" />
        <path d="M6.5 8.5c-1.8 0-3 1.2-3 3v4h2v5.5h2v-5.5h1.2l2.3-3.2-1.2-1.3-1.3-.5z" />
        <rect x="11.5" y="4" width="10.5" height="7.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <line x1="16.5" y1="11.5" x2="16.5" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "signature",
    label: "Signature",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16c2.5-5 5-9 8-6s-2 8 2 5 4-8 6-5 2 6 2 6" />
      </svg>
    ),
  },
  {
    id: "verification_id",
    label: "Verification ID",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="2" y="5" width="16" height="14" rx="2" />
        <circle cx="6.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <line x1="10.5" y1="9.5" x2="15" y2="9.5" strokeLinecap="round" />
        <line x1="10.5" y1="13" x2="15" y2="13" strokeLinecap="round" />
        <line x1="5" y1="15.5" x2="8" y2="15.5" strokeLinecap="round" />
        <circle cx="18" cy="6" r="3.5" fill="#3B82F6" stroke="currentColor" strokeWidth="1.25" />
        <path d="M16.8 6l0.8 0.8 1.6-1.6" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "qr",
    label: "QR",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="currentColor">
        <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm8-2h7v7h-7V3zm2 2v3h3V5h-3zM3 13h7v7H3v-7zm2 2v3h3v-3H5zm8-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2z" />
      </svg>
    ),
  },
  {
    id: "time",
    label: "Time",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="8" cy="14" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="12" cy="14" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="16" cy="14" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="8" cy="17" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="16" cy="17" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "duration",
    label: "Duration",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 2h14M5 22h14" />
        <path d="M17 2v4a5 5 0 0 1-2 4l-3 2 3 2a5 5 0 0 1 2 4v4H7v-4a5 5 0 0 1 2-4l3-2-3-2a5 5 0 0 1-2-4V2z" />
      </svg>
    ),
  },
  {
    id: "point",
    label: "Point",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="currentColor">
        <path d="M12 2v10h10A10 10 0 0 0 12 2z" />
        <path d="M10 4.14A10 10 0 1 0 19.86 14H10V4.14z" />
      </svg>
    ),
  },
  {
    id: "grade",
    label: "Grade",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 16l2.5-8h1L14 16m-4.5-3h3.5M16 9.5v5m-2.5-2.5h5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "bundle_courses",
    label: "Bundle Courses",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 12 12 17 22 12" />
        <polyline points="2 17 12 22 22 17" />
      </svg>
    ),
  },
  {
    id: "logo",
    label: "Logo",
    icon: (
      <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
];

function CertificateThumbnailCard({
  style,
  name,
  orientation,
  isSelected,
  onClick,
}: {
  style: AdminCertificate["templateStyle"];
  name: string;
  orientation: "landscape" | "portrait";
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className={`group relative w-full rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200 text-left focus:outline-none shrink-0 ${
        orientation === "landscape" ? "aspect-[16/11]" : "aspect-[11/16]"
      } ${
        isSelected
          ? "ring-2 ring-[#7D52F4] border-2 border-[#7D52F4] shadow-md shadow-purple-950/40"
          : "border border-gray-700/60 hover:border-gray-500 hover:shadow-md opacity-85 hover:opacity-100"
      }`}
    >
      {/* Selected Indicator Checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-20 flex size-5 items-center justify-center rounded-full bg-[#7D52F4] text-white shadow-sm ring-1 ring-white">
          <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* SVG Decorative Border */}
      <div className="absolute inset-1 pointer-events-none">
        {style === "Classic Border" && <ClassicBorderSvg className="size-full text-slate-400" color="#94A3B8" />}
        {style === "Modern Geometric" && <ModernBorderSvg className="size-full text-purple-600/80" />}
        {style === "Technical Excellence" && <TechnicalBorderSvg className="size-full text-teal-600/80" />}
        {style === "Corporate Crest" && <CorporateBorderSvg className="size-full text-indigo-900/80" />}
        {style === "Creative Vanguard" && <CreativeWaveBorderSvg className="size-full" />}
        {style === "Minimalist Diploma" && <MinimalistBorderSvg className="size-full text-slate-700/80" />}
      </div>

      {/* Miniature Visual Layout */}
      <div
        className={`relative z-10 size-full flex flex-col justify-between p-2.5 sm:p-3 select-none pointer-events-none ${
          style === "Creative Vanguard" ? "pl-9" : ""
        }`}
      >
        {/* Header */}
        <div className="text-center pt-0.5">
          <p className="text-[7px] font-mono font-bold tracking-widest text-[#7D52F4] uppercase">
            SKILLIANT ACADEMY
          </p>
          <div className="h-px w-6 bg-purple-300 mx-auto mt-0.5" />
        </div>

        {/* Center Title & Recipient Simulation */}
        <div className="text-center my-auto space-y-0.5">
          <p className="text-[9px] font-serif font-bold text-[#1E3A8A] leading-tight">
            Certificate
          </p>
          <p className="text-[6px] font-serif text-[#1E3A8A] font-medium">
            Of Excellence
          </p>
          <div className="w-10 h-px bg-amber-400/80 mx-auto mt-0.5" />
          <div className="pt-0.5 space-y-0.5">
            <p className="text-[6.5px] font-serif italic text-gray-800 font-semibold truncate max-w-[150px] mx-auto border-b border-dashed border-gray-300 pb-0.5">
              [ student_name ]
            </p>
            <p className="text-[5.5px] text-gray-700 font-medium truncate max-w-[130px] mx-auto">
              [ course_title ]
            </p>
          </div>
        </div>

        {/* Footer: Signature, Medallion, QR */}
        <div className="flex items-end justify-between border-t border-gray-100 pt-1 text-[5px] text-gray-400">
          <div className="w-10">
            <div className="h-1.5 w-6 border-b border-gray-400" />
            <span className="text-[5px] text-gray-500">Authorized</span>
          </div>

          <div className="flex size-3.5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[7px] font-bold shadow-2xs">
            ★
          </div>

          <div className="text-right w-10">
            <span className="font-mono text-[5px] text-gray-500">ID: SKL</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function BackdropPatternGraphic({ pattern, isThumbnail }: { pattern: string; isThumbnail?: boolean }) {
  if (pattern === "lines") {
    return (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="size-full"
        fill="none"
        stroke={isThumbnail ? "#94A3B8" : "#475569"}
        strokeWidth={isThumbnail ? "2.5" : "1.2"}
        strokeOpacity={isThumbnail ? "1" : "0.22"}
      >
        <line x1="0" y1="12" x2="100" y2="12" />
        <line x1="0" y1="23" x2="100" y2="23" />
        <line x1="0" y1="34" x2="100" y2="34" />
        <line x1="0" y1="45" x2="100" y2="45" />
        <line x1="0" y1="56" x2="100" y2="56" />
        <line x1="0" y1="67" x2="100" y2="67" />
        <line x1="0" y1="78" x2="100" y2="78" />
        <line x1="0" y1="89" x2="100" y2="89" />
      </svg>
    );
  }

  if (pattern === "geometric") {
    return (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="size-full"
        fill={isThumbnail ? "#94A3B8" : "#475569"}
        fillOpacity={isThumbnail ? "1" : "0.25"}
        stroke={isThumbnail ? "#94A3B8" : "#475569"}
        strokeOpacity={isThumbnail ? "1" : "0.25"}
      >
        {/* Two triangles top left */}
        <polygon points="14,10 24,30 4,30" stroke="none" />
        <polygon points="34,10 44,30 24,30" stroke="none" />
        {/* Squiggle top */}
        <path d="M52 14 Q 62 6 72 14 T 88 14" fill="none" strokeWidth={isThumbnail ? "3.5" : "2"} strokeLinecap="round" />
        {/* Dot matrix right */}
        <circle cx="64" cy="28" r="2.5" stroke="none" />
        <circle cx="76" cy="28" r="2.5" stroke="none" />
        <circle cx="88" cy="28" r="2.5" stroke="none" />
        <circle cx="64" cy="40" r="2.5" stroke="none" />
        <circle cx="76" cy="40" r="2.5" stroke="none" />
        <circle cx="88" cy="40" r="2.5" stroke="none" />
        <circle cx="64" cy="52" r="2.5" stroke="none" />
        <circle cx="76" cy="52" r="2.5" stroke="none" />
        <circle cx="88" cy="52" r="2.5" stroke="none" />
        {/* Squiggle center left */}
        <path d="M8 44 Q 20 36 32 44" fill="none" strokeWidth={isThumbnail ? "3.5" : "2"} strokeLinecap="round" />
        {/* Dots middle left */}
        <circle cx="44" cy="38" r="2.5" stroke="none" />
        <circle cx="52" cy="44" r="2.5" stroke="none" />
        {/* 3 horizontal bars bottom left */}
        <rect x="6" y="60" width="46" height="5" rx="2" stroke="none" />
        <rect x="6" y="72" width="46" height="5" rx="2" stroke="none" />
        <rect x="6" y="84" width="46" height="5" rx="2" stroke="none" />
        {/* Plus sign bottom right */}
        <path d="M72 76 h14 M79 69 v14" strokeWidth={isThumbnail ? "4" : "2.5"} strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (pattern === "waves") {
    return (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="size-full"
        fill="none"
        stroke={isThumbnail ? "#94A3B8" : "#475569"}
        strokeWidth={isThumbnail ? "3" : "1.5"}
        strokeOpacity={isThumbnail ? "1" : "0.22"}
        strokeLinecap="round"
      >
        <path d="M 0 12 Q 25 3 50 12 T 100 12" />
        <path d="M 0 24 Q 25 15 50 24 T 100 24" />
        <path d="M 0 36 Q 25 27 50 36 T 100 36" />
        <path d="M 0 48 Q 25 39 50 48 T 100 48" />
        <path d="M 0 60 Q 25 51 50 60 T 100 60" />
        <path d="M 0 72 Q 25 63 50 72 T 100 72" />
        <path d="M 0 84 Q 25 75 50 84 T 100 84" />
      </svg>
    );
  }

  return null;
}

function BackdropBackgroundGraphic({
  background,
  isThumbnail,
}: {
  background: string;
  isThumbnail?: boolean;
}) {
  switch (background) {
    case "pastel_blobs":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          {/* Top-right soft pink organic blob */}
          <path d="M 60 0 C 70 22, 90 28, 100 16 L 100 0 Z" fill="#FCE7F3" opacity="0.85" />
          <path d="M 72 0 C 82 14, 94 18, 100 10 L 100 0 Z" fill="#FECDD3" opacity="0.9" />
          {/* Bottom-right soft peach/coral organic blob */}
          <path d="M 64 100 C 72 80, 88 78, 100 84 L 100 100 Z" fill="#FFEDD5" opacity="0.9" />
          <path d="M 78 100 C 84 88, 94 86, 100 90 L 100 100 Z" fill="#FED7AA" opacity="0.95" />
          {/* Bottom-left soft pastel sky blue wash & loops */}
          <path d="M 0 60 C 18 62, 28 78, 22 100 L 0 100 Z" fill="#E0F2FE" opacity="0.85" />
          <path d="M 0 74 C 12 76, 20 86, 16 100 L 0 100 Z" fill="#BAE6FD" opacity="0.9" />
          <path d="M 2 82 C 14 74, 22 92, 34 100" fill="none" stroke="#38BDF8" strokeWidth={isThumbnail ? "2.5" : "1.5"} opacity="0.6" strokeLinecap="round" />
          {/* Top-left subtle dots & arc */}
          <circle cx="10" cy="12" r={isThumbnail ? "1.5" : "1"} fill="#93C5FD" opacity="0.8" />
          <circle cx="16" cy="10" r={isThumbnail ? "1.5" : "1"} fill="#93C5FD" opacity="0.8" />
          <circle cx="12" cy="18" r={isThumbnail ? "1.5" : "1"} fill="#93C5FD" opacity="0.8" />
          <circle cx="18" cy="16" r={isThumbnail ? "1.5" : "1"} fill="#93C5FD" opacity="0.8" />
          <path d="M 8 26 C 18 16, 28 14, 34 22" fill="none" stroke="#FDBA74" strokeWidth={isThumbnail ? "2" : "1.2"} opacity="0.7" strokeLinecap="round" />
        </svg>
      );

    case "teal_frame":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          {/* Soft background */}
          <rect width="100" height="100" fill="#F8FAFC" />
          {/* Outer teal border */}
          <rect x="5" y="5" width="90" height="90" rx="1.5" fill="none" stroke="#0D9488" strokeWidth={isThumbnail ? "2.5" : "2"} />
          {/* Inner fine hairline border */}
          <rect x="7.5" y="7.5" width="85" height="85" rx="1" fill="none" stroke="#14B8A6" strokeWidth={isThumbnail ? "1" : "0.75"} strokeOpacity="0.7" />
          {/* Micro dot accents */}
          <circle cx="50" cy="20" r="0.8" fill="#14B8A6" opacity="0.3" />
          <circle cx="50" cy="80" r="0.8" fill="#14B8A6" opacity="0.3" />
          <circle cx="20" cy="50" r="0.8" fill="#14B8A6" opacity="0.3" />
          <circle cx="80" cy="50" r="0.8" fill="#14B8A6" opacity="0.3" />
        </svg>
      );

    case "ornate_silver":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <rect width="100" height="100" fill="#FFFFFF" />
          {/* Scalloped decorative border edge */}
          <rect x="4" y="4" width="92" height="92" fill="none" stroke="#94A3B8" strokeWidth={isThumbnail ? "2.5" : "2"} />
          <rect x="6.5" y="6.5" width="87" height="87" fill="none" stroke="#CBD5E1" strokeWidth={isThumbnail ? "1.5" : "1"} />
          {/* Corner ornaments */}
          <path d="M 4 14 C 10 10, 10 10, 14 4" fill="none" stroke="#64748B" strokeWidth={isThumbnail ? "2" : "1.5"} />
          <path d="M 96 14 C 90 10, 90 10, 86 4" fill="none" stroke="#64748B" strokeWidth={isThumbnail ? "2" : "1.5"} />
          <path d="M 4 86 C 10 90, 10 90, 14 96" fill="none" stroke="#64748B" strokeWidth={isThumbnail ? "2" : "1.5"} />
          <path d="M 96 86 C 90 90, 90 90, 86 96" fill="none" stroke="#64748B" strokeWidth={isThumbnail ? "2" : "1.5"} />
          {/* Subtle perimeter dashed guilloche accents */}
          <rect x="9" y="9" width="82" height="82" fill="none" stroke="#94A3B8" strokeWidth={isThumbnail ? "1" : "0.75"} strokeDasharray="2,2" strokeOpacity="0.6" />
        </svg>
      );

    case "navy_geometry":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <rect width="100" height="100" fill="#FFFFFF" />
          {/* Top-left angular corner */}
          <polygon points="0,0 36,0 0,36" fill="#1E293B" />
          <polygon points="36,0 42,0 0,42 0,36" fill="#3B82F6" opacity="0.85" />
          {/* Bottom-left angular corner */}
          <polygon points="0,64 0,100 36,100" fill="#1E293B" />
          <polygon points="0,58 0,64 36,100 42,100" fill="#3B82F6" opacity="0.85" />
          {/* Top-right corner */}
          <polygon points="64,0 100,0 100,36" fill="#1E293B" />
          <polygon points="58,0 64,0 100,36 100,42" fill="#3B82F6" opacity="0.85" />
          {/* Bottom-right corner */}
          <polygon points="100,64 100,100 64,100" fill="#1E293B" />
          <polygon points="100,58 100,64 64,100 58,100" fill="#3B82F6" opacity="0.85" />
        </svg>
      );

    case "corner_glow":
      return (
        <div className="size-full relative overflow-hidden bg-white">
          <div
            className="absolute -top-1/4 -left-1/4 w-[150%] h-[80%] rounded-full opacity-70 blur-xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, #E11D48 0%, #EC4899 40%, #A855F7 65%, transparent 85%)",
            }}
          />
        </div>
      );

    case "pinstripe_diploma":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <rect width="100" height="100" fill="#FDFCF7" />
          {/* Left pinstripe band */}
          <rect x="0" y="0" width="22" height="100" fill="#F3EFE6" />
          <line x1="4" y1="0" x2="4" y2="100" stroke="#E2DACD" strokeWidth={isThumbnail ? "1.5" : "1"} />
          <line x1="8" y1="0" x2="8" y2="100" stroke="#E2DACD" strokeWidth={isThumbnail ? "1.5" : "1"} />
          <line x1="12" y1="0" x2="12" y2="100" stroke="#E2DACD" strokeWidth={isThumbnail ? "1.5" : "1"} />
          <line x1="16" y1="0" x2="16" y2="100" stroke="#E2DACD" strokeWidth={isThumbnail ? "1.5" : "1"} />
          <line x1="22" y1="0" x2="22" y2="100" stroke="#D97706" strokeWidth={isThumbnail ? "1.5" : "1.2"} />
        </svg>
      );

    case "mint_waves":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <rect width="100" height="100" fill="#FFFFFF" />
          {/* Top-left mint curve */}
          <path d="M 0 0 L 38 0 C 35 18, 18 28, 0 22 Z" fill="#A7F3D0" opacity="0.8" />
          <path d="M 0 0 L 26 0 C 24 12, 12 18, 0 14 Z" fill="#6EE7B7" opacity="0.9" />
          {/* Bottom mint fluid wave */}
          <path d="M 0 84 C 22 74, 46 94, 72 82 C 86 76, 94 84, 100 80 L 100 100 L 0 100 Z" fill="#A7F3D0" opacity="0.8" />
          <path d="M 12 100 C 32 86, 52 98, 76 90 C 88 86, 96 92, 100 90 L 100 100 Z" fill="#6EE7B7" opacity="0.9" />
          {/* Dot cluster */}
          <circle cx="10" cy="34" r={isThumbnail ? "1.2" : "0.9"} fill="#34D399" opacity="0.7" />
          <circle cx="15" cy="32" r={isThumbnail ? "1.2" : "0.9"} fill="#34D399" opacity="0.7" />
          <circle cx="12" cy="38" r={isThumbnail ? "1.2" : "0.9"} fill="#34D399" opacity="0.7" />
        </svg>
      );

    case "mosaic_tiles":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          {/* Outer perimeter mosaic blocks */}
          <rect width="100" height="100" fill="#E0F2FE" />
          {/* Perimeter tile accents in blue */}
          <rect x="0" y="0" width="14" height="10" fill="#0284C7" />
          <rect x="14" y="0" width="16" height="8" fill="#38BDF8" />
          <rect x="30" y="0" width="12" height="10" fill="#1D4ED8" />
          <rect x="42" y="0" width="18" height="8" fill="#60A5FA" />
          <rect x="60" y="0" width="14" height="10" fill="#0284C7" />
          <rect x="74" y="0" width="14" height="8" fill="#38BDF8" />
          <rect x="88" y="0" width="12" height="10" fill="#1D4ED8" />

          <rect x="0" y="90" width="16" height="10" fill="#38BDF8" />
          <rect x="16" y="92" width="14" height="8" fill="#0284C7" />
          <rect x="30" y="90" width="18" height="10" fill="#60A5FA" />
          <rect x="48" y="92" width="14" height="8" fill="#1D4ED8" />
          <rect x="62" y="90" width="16" height="10" fill="#38BDF8" />
          <rect x="78" y="92" width="12" height="8" fill="#0284C7" />
          <rect x="90" y="90" width="10" height="10" fill="#1D4ED8" />

          <rect x="0" y="10" width="8" height="16" fill="#60A5FA" />
          <rect x="0" y="26" width="10" height="18" fill="#0284C7" />
          <rect x="0" y="44" width="8" height="18" fill="#38BDF8" />
          <rect x="0" y="62" width="10" height="16" fill="#1D4ED8" />
          <rect x="0" y="78" width="8" height="12" fill="#60A5FA" />

          <rect x="92" y="10" width="8" height="18" fill="#38BDF8" />
          <rect x="90" y="28" width="10" height="16" fill="#1D4ED8" />
          <rect x="92" y="44" width="8" height="18" fill="#60A5FA" />
          <rect x="90" y="62" width="10" height="16" fill="#0284C7" />
          <rect x="92" y="78" width="8" height="12" fill="#38BDF8" />

          {/* Clean white inner card with rounded corners */}
          <rect x="9" y="9" width="82" height="82" rx="6" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1" />
        </svg>
      );

    case "playful_curves":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <rect width="100" height="100" fill="#FFFFFF" />
          {/* Top-left soft lilac curve */}
          <path d="M 0 0 L 40 0 C 35 14, 18 22, 0 16 Z" fill="#C084FC" opacity="0.85" />
          {/* Right edge teal wave */}
          <path d="M 100 28 C 88 34, 88 64, 100 70 Z" fill="#2DD4BF" opacity="0.85" />
          {/* Left teal pill */}
          <circle cx="2" cy="55" r="7" fill="#2DD4BF" opacity="0.7" />
          {/* Bottom bubblegum pink wave */}
          <path d="M 0 91 C 28 82, 72 82, 100 91 L 100 100 L 0 100 Z" fill="#FB7185" opacity="0.9" />
          <path d="M 10 100 C 36 90, 64 90, 90 100 Z" fill="#F43F5E" opacity="0.95" />
        </svg>
      );

    default:
      return null;
  }
}

function CertificateBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const certId = searchParams.get("id");

  // Load existing certificate if ID is passed
  const existingCert = initialCertificates.find((c) => c.id === certId);

  // Template Basics
  const [templateTitle, setTemplateTitle] = useState(existingCert?.title || "Untitled Certificate Template");
  const [activeTab, setActiveTab] = useState<BuilderTab>("templates");
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [pageSize, setPageSize] = useState<"Letter" | "A4">("Letter");
  const [templateStyle, setTemplateStyle] = useState<AdminCertificate["templateStyle"]>(
    existingCert?.templateStyle || "Classic Border"
  );
  const [courseSlug, setCourseSlug] = useState(existingCert?.courseSlug || availableCoursesList[0]?.slug || "");
  const [zoomLevel, setZoomLevel] = useState(80);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState<string | null>(null);
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");

  // Selected course object
  const selectedCourse = availableCoursesList.find((c) => c.slug === courseSlug) || availableCoursesList[0];

  // Institutional Settings
  const [settings, setSettings] = useState({
    allowInstructorsToUseAdminCertificates: defaultCertificateSettings.allowInstructorsToUseAdminCertificates,
    authorizedName: existingCert?.signatoryName || defaultCertificateSettings.authorizedName,
    authorizedTitle: existingCert?.signatoryTitle || defaultCertificateSettings.authorizedTitle,
    authorizedCompany: existingCert?.organization || defaultCertificateSettings.authorizedCompany,
    showInstructorName: defaultCertificateSettings.showInstructorName,
    sendCertificateLinkInEmail: defaultCertificateSettings.sendCertificateLinkInEmail,
    requireLoginToAccess: defaultCertificateSettings.requireLoginToAccess,
    signatureImageUrl: defaultCertificateSettings.signatureImageUrl,
    verificationPageUrl: defaultCertificateSettings.verificationPageUrl,
    logoUrl: "/images/verify.svg",
  });

  // Subtle Sleek Watermark State (Default to none for pristine Image 1 look)
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    type: "none",
    text: "SKILLIANT GLOBAL ACADEMY • VERIFIED CREDENTIAL",
    opacity: 0.05,
    scale: 1.0,
    paperTint: "white",
  });

  // Backdrops System matching Tutor LMS (Color, Pattern, Background)
  const [backdropConfig, setBackdropConfig] = useState<BackdropConfig>({
    color: "#FFFFFF",
    pattern: "none",
    background: "none",
  });

  // Site Media Library State matching Tutor LMS Media Tab
  const [mediaLibrary, setMediaLibrary] = useState(INITIAL_SITE_MEDIA_LIBRARY);

  // Layers Drag-and-Drop Reordering State
  const [draggedLayerIdx, setDraggedLayerIdx] = useState<number | null>(null);
  const [dragOverLayerIdx, setDragOverLayerIdx] = useState<number | null>(null);

  // Interactive Movable Elements State matching Image 1
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: "el-main-title",
      type: "text",
      label: "Certificate Title",
      content: "Certificate",
      x: 50,
      y: 25,
      fontSize: 52,
      fontFamily: "serif",
      fontWeight: "bold",
      color: "#1E3A8A",
      textAlign: "center",
      visible: true,
    },
    {
      id: "el-subtitle",
      type: "text",
      label: "Certificate Subtitle",
      content: "Of Excellence",
      x: 50,
      y: 31,
      fontSize: 18,
      fontFamily: "serif",
      fontWeight: "medium",
      color: "#1E3A8A",
      textAlign: "center",
      visible: true,
    },
    {
      id: "el-divider",
      type: "divider",
      label: "Decorative Flourish",
      content: "ornate",
      x: 50,
      y: 37,
      visible: true,
    },
    {
      id: "el-presentation",
      type: "text",
      label: "Presentation Line",
      content: "This Diploma is given to",
      x: 50,
      y: 44,
      fontSize: 14,
      fontFamily: "sans",
      fontWeight: "medium",
      color: "#374151",
      textAlign: "center",
      visible: true,
    },
    {
      id: "el-student-name",
      type: "text",
      label: "Recipient Name",
      content: "[ student_name ]",
      x: 50,
      y: 51,
      fontSize: 40,
      fontFamily: "serif",
      fontStyle: "italic",
      fontWeight: "bold",
      color: "#0F172A",
      textAlign: "center",
      visible: true,
    },
    {
      id: "el-completion-text",
      type: "text",
      label: "Completion Note",
      content: "for completing the course",
      x: 50,
      y: 60,
      fontSize: 13,
      fontFamily: "sans",
      fontWeight: "normal",
      color: "#374151",
      textAlign: "center",
      visible: true,
    },
    {
      id: "el-course-title",
      type: "text",
      label: "Course Title",
      content: "[ course_title ]",
      x: 50,
      y: 66,
      fontSize: 20,
      fontFamily: "sans",
      fontWeight: "bold",
      color: "#0F172A",
      textAlign: "center",
      visible: true,
    },
    {
      id: "el-sig-left",
      type: "signature",
      label: "Instructor Signature",
      content: "instructor_name",
      subcontent: "Dean",
      x: 23,
      y: 84,
      visible: true,
    },
    {
      id: "el-medallion",
      type: "medallion",
      label: "Gold Star Medallion",
      content: "gold_seal",
      x: 50,
      y: 84,
      visible: true,
    },
    {
      id: "el-sig-right",
      type: "signature",
      label: "Director Signature",
      content: settings.authorizedName || "Darlene Robertson",
      subcontent: settings.authorizedTitle || "Academic Director",
      x: 77,
      y: 84,
      visible: true,
    },
  ]);

  // Selected element for editing & floating toolbar (Default to "el-main-title" matching Image 1)
  const [selectedElementId, setSelectedElementId] = useState<string | null>("el-main-title");
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [activeToolbarPopover, setActiveToolbarPopover] = useState<"typography" | "color" | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Dragging state
  const canvasRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const isDraggingRef = useRef(false);
  const dragElementIdRef = useRef<string | null>(null);
  const dragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  // Mouse Wheel Zoom in Workspace
  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if actively dragging an element or if preview modal is open
      if (isDraggingRef.current || isPreviewOpen) return;

      // Prevent native browser page/workspace scroll
      e.preventDefault();

      // Normalize delta across input devices and browsers
      let delta = -e.deltaY;
      if (e.deltaMode === 1) {
        delta *= 33; // DOM_DELTA_LINE
      } else if (e.deltaMode === 2) {
        delta *= 100; // DOM_DELTA_PAGE
      }

      // Compute zoom step:
      // For standard notched mouse wheels (|delta| >= 40), 5% per notch.
      // For trackpads or fast scrolls, smooth proportional scale clamped between 1% and 12%.
      const step =
        Math.abs(delta) >= 40
          ? Math.sign(delta) * Math.min(12, Math.max(5, Math.round(Math.abs(delta) * 0.05)))
          : Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta) * 0.04));

      setZoomLevel((prev) => Math.min(200, Math.max(40, prev + step)));
    };

    workspace.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      workspace.removeEventListener("wheel", handleWheel);
    };
  }, [isPreviewOpen]);

  // Filter templates
  const filteredTemplates = templatePresets.filter((tpl) => {
    const q = templateSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return tpl.name.toLowerCase().includes(q) || tpl.style.toLowerCase().includes(q);
  });

  const showNotice = (msg: string) => {
    setSavedSuccessNotice(msg);
    setTimeout(() => setSavedSuccessNotice(null), 3500);
  };

  const pushHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      showNotice("Action undone");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      showNotice("Action redone");
    }
  };

  // Pointer Drag Handling
  const handlePointerDownElement = (e: React.PointerEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    setActiveToolbarPopover(null);

    const targetElement = elements.find((el) => el.id === elementId);
    if (!targetElement) return;

    // If locked, allow selection but prevent dragging
    if (targetElement.locked) {
      return;
    }

    dragElementIdRef.current = elementId;
    isDraggingRef.current = true;

    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Calculate current element pixel position
    const elemPixelX = (targetElement.x / 100) * canvasRect.width;
    const elemPixelY = (targetElement.y / 100) * canvasRect.height;

    dragOffsetRef.current = {
      offsetX: e.clientX - (canvasRect.left + elemPixelX),
      offsetY: e.clientY - (canvasRect.top + elemPixelY),
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!isDraggingRef.current || !canvasRef.current || !dragElementIdRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      const newPixelX = moveEvt.clientX - rect.left - dragOffsetRef.current.offsetX;
      const newPixelY = moveEvt.clientY - rect.top - dragOffsetRef.current.offsetY;

      const rawPctX = Math.round((newPixelX / rect.width) * 100);
      const rawPctY = Math.round((newPixelY / rect.height) * 100);

      // Clamp coordinates
      const clampedX = Math.max(6, Math.min(94, rawPctX));
      const clampedY = Math.max(6, Math.min(94, rawPctY));

      setElements((prev) =>
        prev.map((el) => (el.id === dragElementIdRef.current ? { ...el, x: clampedX, y: clampedY } : el))
      );
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      dragElementIdRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      pushHistory(elements);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Duplicate an active element
  const handleDuplicateElement = (elementId: string) => {
    const target = elements.find((el) => el.id === elementId);
    if (!target) return;
    const duplicated: CanvasElement = {
      ...target,
      id: `${target.type}-${Date.now()}`,
      label: `${target.label} (Copy)`,
      x: Math.min(88, target.x + 3),
      y: Math.min(88, target.y + 3),
    };
    const updated = [...elements, duplicated];
    setElements(updated);
    setSelectedElementId(duplicated.id);
    pushHistory(updated);
    showNotice(`Duplicated ${target.label}`);
  };

  // Toggle layer lock
  const handleToggleLockElement = (elementId: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, locked: !el.locked } : el))
    );
    const target = elements.find((el) => el.id === elementId);
    showNotice(target?.locked ? "Element unlocked" : "Element locked");
  };

  // Drag-and-drop reorder canvas layers
  const handleReorderLayers = (fromOriginalIdx: number, toOriginalIdx: number) => {
    if (fromOriginalIdx === toOriginalIdx || fromOriginalIdx < 0 || toOriginalIdx < 0) return;
    const next = [...elements];
    const [removed] = next.splice(fromOriginalIdx, 1);
    if (!removed) return;
    next.splice(toOriginalIdx, 0, removed);
    setElements(next);
    pushHistory(next);
    showNotice(`Reordered layer "${removed.label}"`);
  };

  // Add an element by type from the 12 available types
  const handleAddElement = (elemTypeId: string, customX?: number, customY?: number) => {
    let newElement: CanvasElement | null = null;
    const now = Date.now();

    switch (elemTypeId) {
      case "text":
        newElement = {
          id: `el-text-${now}`,
          type: "text",
          label: "Text",
          content: "Enter your custom text here",
          x: customX ?? 50,
          y: customY ?? 72,
          fontSize: 16,
          fontFamily: "sans",
          fontWeight: "normal",
          color: "#374151",
          textAlign: "center",
          visible: true,
        };
        break;

      case "course":
        newElement = {
          id: `el-course-${now}`,
          type: "text",
          label: "Course",
          content: selectedCourse?.title || "[ course_title ]",
          x: customX ?? 50,
          y: customY ?? 66,
          fontSize: 20,
          fontFamily: "serif",
          fontWeight: "bold",
          color: "#0F172A",
          textAlign: "center",
          visible: true,
        };
        break;

      case "student_name":
        newElement = {
          id: `el-student-${now}`,
          type: "text",
          label: "Student Name",
          content: "[ student_name ]",
          x: customX ?? 50,
          y: customY ?? 51,
          fontSize: 38,
          fontFamily: "serif",
          fontStyle: "italic",
          fontWeight: "bold",
          color: "#0F172A",
          textAlign: "center",
          visible: true,
        };
        break;

      case "instructor":
        newElement = {
          id: `el-instructor-${now}`,
          type: "text",
          label: "Instructor",
          content: settings.authorizedName || "Dr. Andrew Ng",
          subcontent: settings.authorizedTitle || "Course Instructor",
          x: customX ?? 25,
          y: customY ?? 86,
          fontSize: 13,
          fontFamily: "sans",
          fontWeight: "medium",
          color: "#1E293B",
          textAlign: "center",
          visible: true,
        };
        break;

      case "signature":
        newElement = {
          id: `el-sig-${now}`,
          type: "signature",
          label: "Signature",
          content: settings.authorizedName || "Authorized Signatory",
          subcontent: "Director & Dean",
          x: customX ?? 75,
          y: customY ?? 84,
          visible: true,
        };
        break;

      case "verification_id":
        newElement = {
          id: `el-verif-${now}`,
          type: "text",
          label: "Verification ID",
          content: `Credential ID: SKL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          x: customX ?? 50,
          y: customY ?? 76,
          fontSize: 11,
          fontFamily: "mono",
          fontWeight: "bold",
          color: "#475569",
          textAlign: "center",
          visible: true,
        };
        break;

      case "qr":
        newElement = {
          id: `el-qr-${now}`,
          type: "qrcode",
          label: "QR",
          content: `SKL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          subcontent: "Scan to verify credential",
          x: customX ?? 86,
          y: customY ?? 82,
          visible: true,
        };
        break;

      case "time":
        newElement = {
          id: `el-time-${now}`,
          type: "text",
          label: "Time",
          content: `Issued on: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
          x: customX ?? 50,
          y: customY ?? 72,
          fontSize: 12,
          fontFamily: "sans",
          fontWeight: "normal",
          color: "#64748B",
          textAlign: "center",
          visible: true,
        };
        break;

      case "duration":
        newElement = {
          id: `el-duration-${now}`,
          type: "text",
          label: "Duration",
          content: "Course Duration: 48 Credit Hours",
          x: customX ?? 50,
          y: customY ?? 74,
          fontSize: 12,
          fontFamily: "sans",
          fontWeight: "normal",
          color: "#64748B",
          textAlign: "center",
          visible: true,
        };
        break;

      case "point":
        newElement = {
          id: `el-point-${now}`,
          type: "text",
          label: "Point",
          content: "Credits Earned: 120 CPD / CEU Points",
          x: customX ?? 50,
          y: customY ?? 76,
          fontSize: 12,
          fontFamily: "sans",
          fontWeight: "normal",
          color: "#64748B",
          textAlign: "center",
          visible: true,
        };
        break;

      case "grade":
        newElement = {
          id: `el-grade-${now}`,
          type: "text",
          label: "Grade",
          content: "Final Grade: A+ (Honors Distinction)",
          x: customX ?? 50,
          y: customY ?? 71,
          fontSize: 13,
          fontFamily: "sans",
          fontWeight: "bold",
          color: "#1E3A8A",
          textAlign: "center",
          visible: true,
        };
        break;

      case "bundle_courses":
        newElement = {
          id: `el-bundle-${now}`,
          type: "text",
          label: "Bundle Courses",
          content: "Specialization Track: 4 Modules Included",
          x: customX ?? 50,
          y: customY ?? 74,
          fontSize: 11,
          fontFamily: "sans",
          fontStyle: "italic",
          fontWeight: "normal",
          color: "#475569",
          textAlign: "center",
          visible: true,
        };
        break;

      case "logo":
        newElement = {
          id: `el-logo-${now}`,
          type: "logo",
          label: "Logo",
          content: "logo",
          x: customX ?? 50,
          y: customY ?? 16,
          visible: true,
        };
        break;
    }

    if (newElement) {
      const updated = [...elements, newElement];
      setElements(updated);
      setSelectedElementId(newElement.id);
      pushHistory(updated);
      showNotice(`Added "${newElement.label}" to canvas`);
    }
  };

  // Add Media Image to canvas
  const handleAddMediaToCanvas = (url: string, title?: string, customX?: number, customY?: number) => {
    const now = Date.now();
    const newElement: CanvasElement = {
      id: `el-media-${now}`,
      type: "image",
      label: title || "Media Image",
      content: url,
      x: customX ?? 50,
      y: customY ?? 50,
      visible: true,
    };
    const updated = [...elements, newElement];
    setElements(updated);
    setSelectedElementId(newElement.id);
    pushHistory(updated);
    showNotice(`Added "${newElement.label}" to canvas`);
  };

  // Handle uploading media file from Media tab
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^/.]+$/, "");
      const newMedia = {
        id: `uploaded-${Date.now()}`,
        title,
        url: fakeUrl,
      };
      setMediaLibrary((prev) => [newMedia, ...prev]);
      handleAddMediaToCanvas(fakeUrl, title);
    }
  };

  // Drag and drop onto canvas
  const handleDropOnCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const dropPctX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const dropPctY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const clampedX = Math.max(8, Math.min(92, dropPctX));
    const clampedY = Math.max(8, Math.min(92, dropPctY));

    const mediaUrl = e.dataTransfer.getData("application/x-certificate-media-url");
    const mediaTitle = e.dataTransfer.getData("application/x-certificate-media-title");
    if (mediaUrl) {
      handleAddMediaToCanvas(mediaUrl, mediaTitle || "Media Image", clampedX, clampedY);
      return;
    }

    const elemTypeId = e.dataTransfer.getData("application/x-certificate-element");
    if (elemTypeId) {
      handleAddElement(elemTypeId, clampedX, clampedY);
    }
  };

  // Handle signature upload simulation
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setSettings((prev) => ({ ...prev, signatureImageUrl: fakeUrl }));
      showNotice("Signature uploaded successfully!");
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setCustomLogoUrl(fakeUrl);
      showNotice("Logo uploaded successfully!");
    }
  };

  const handlePublish = () => {
    showNotice(`Certificate template "${templateTitle}" published successfully!`);
    setTimeout(() => {
      router.push("/admin/certificates");
    }, 1200);
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Paper background classes
  const getPaperBgClass = () => {
    switch (watermark.paperTint) {
      case "parchment":
        return "bg-[#FDFBF7]";
      case "cream":
        return "bg-[#FFFDF5]";
      case "slate":
        return "bg-[#F8FAFC]";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#18191C] text-gray-900 select-none">
      {/* ================= TOP STUDIO HEADER (Light Mode matching Tutor LMS) ================= */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 shrink-0 shadow-2xs">
        {/* Left: Editable Template Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl lg:max-w-2xl">
          <Link
            href="/admin/certificates"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
            title="Exit to Certificates Hub"
          >
            <CloseIcon className="size-5" />
          </Link>
          <div className="h-5 w-px bg-gray-200 shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="text"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              placeholder="Untitled Template"
              className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#7D52F4] text-sm font-semibold text-gray-900 px-1 py-0.5 outline-none w-full min-w-0 transition-colors"
              title="Click to rename template"
            />
          </div>
        </div>

        {/* Center: Branding Title */}
        <div className="hidden xl:flex items-center gap-1.5 text-sm font-bold text-gray-800 shrink-0 px-4">
          <span>Certificate</span>
          <span className="text-[#7D52F4]">Builder</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-lg transition-colors ${
                historyIndex > 0 ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"
              }`}
              title="Undo (Ctrl+Z)"
            >
              ↩
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-lg transition-colors ${
                historyIndex < history.length - 1 ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"
              }`}
              title="Redo (Ctrl+Y)"
            >
              ↪
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Preview
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="rounded-xl bg-[#7D52F4] hover:bg-purple-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            Publish
          </button>
        </div>
      </header>

      {/* ================= SUCCESS NOTIFICATION TOAST ================= */}
      {savedSuccessNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          ✓ {savedSuccessNotice}
        </div>
      )}

      {/* ================= WORKSPACE BODY ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* ================= 1. PRIMARY ICON TOOLSTRIP (Dark Strip matching LMS) ================= */}
        <aside className="w-16 bg-[#18191C] border-r border-gray-800 flex flex-col justify-between items-center py-3 z-20 shrink-0">
          {/* Top Tool Icons */}
          <div className="flex flex-col items-center gap-2.5 w-full">
            {[
              { id: "templates" as BuilderTab, label: "Templates", icon: "📑" },
              { id: "elements" as BuilderTab, label: "Elements", icon: "➕" },
              { id: "backdrops" as BuilderTab, label: "Backdrops", icon: "🏁" },
              { id: "media" as BuilderTab, label: "Media", icon: "🖼️" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center size-12 rounded-xl text-[10px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#7D52F4] text-white shadow-sm font-bold"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span className="text-base leading-none mb-1">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Tool Icons (Layers matching Screenshot & Settings) */}
          <div className="w-full flex flex-col items-center gap-2">
            {/* Layers Button matching User Screenshot */}
            <button
              type="button"
              onClick={() => setActiveTab("layers")}
              className={`flex flex-col items-center justify-center size-12 rounded-xl text-[10px] font-medium transition-colors relative ${
                activeTab === "layers"
                  ? "bg-gray-800 text-white font-bold"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title="Canvas Layers"
            >
              <div className="flex flex-col items-center justify-center">
                <svg viewBox="0 0 24 24" className="size-6 text-white" fill="none">
                  <polygon
                    points="12 2 22 7 12 12 2 7"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="2 12 12 17 22 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="2 16 12 21 22 16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Red active indicator line matching user screenshot */}
                {activeTab === "layers" && (
                  <div className="w-5 h-0.5 bg-red-600 rounded-full mt-1 animate-in fade-in duration-150" />
                )}
              </div>
            </button>

            {/* Bottom Settings Icon */}
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex flex-col items-center justify-center size-12 rounded-xl text-[10px] font-medium transition-colors ${
                activeTab === "settings"
                  ? "bg-[#7D52F4] text-white shadow-sm font-bold"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title="Certificate Settings"
            >
              <SettingsIcon className="size-5 mb-1" />
              <span>Settings</span>
            </button>
          </div>
        </aside>

        {/* ================= 2. SECONDARY CONTROLS PANEL ================= */}
        <div className="w-72 sm:w-80 bg-[#22252A] border-r border-gray-800 flex flex-col overflow-y-auto z-10 shrink-0 text-gray-200 [scrollbar-width:thin]">
          {/* TAB 1: TEMPLATES */}
          {activeTab === "templates" && (
            <div className="p-3.5 space-y-3.5 flex flex-col flex-1 h-full overflow-hidden">
              {/* Search Bar matching Tutor LMS */}
              <div className="relative shrink-0">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-gray-900/90 border border-gray-700/80 pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Orientation Tabs */}
              <div className="flex border-b border-gray-800 text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setOrientation("landscape")}
                  className={`pb-2 px-3 transition-colors relative ${
                    orientation === "landscape"
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7D52F4]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Landscape
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation("portrait")}
                  className={`pb-2 px-3 transition-colors relative ${
                    orientation === "portrait"
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7D52F4]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Portrait
                </button>
              </div>

              {/* Template Thumbnails Scroll List */}
              <div className="space-y-3.5 overflow-y-auto flex-1 pr-1 [scrollbar-width:thin]">
                {filteredTemplates.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">No matching templates found.</p>
                ) : (
                  filteredTemplates.map((tpl) => (
                    <CertificateThumbnailCard
                      key={tpl.style}
                      name={tpl.name}
                      style={tpl.style}
                      orientation={orientation}
                      isSelected={templateStyle === tpl.style}
                      onClick={() => {
                        setTemplateStyle(tpl.style);
                        showNotice(`Applied template "${tpl.name}"`);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ELEMENTS */}
          {activeTab === "elements" && (
            <div className="p-4 space-y-4 overflow-y-auto flex-1 [scrollbar-width:thin]">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Certificate Elements
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Click or drag elements directly onto the canvas.
                </p>
              </div>

              {/* 12-Element Grid Matching Tutor LMS */}
              <div className="grid grid-cols-2 gap-2.5">
                {AVAILABLE_ELEMENT_TYPES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/x-certificate-element", item.id);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => handleAddElement(item.id)}
                    className="bg-[#2A2F3D] hover:bg-[#343B4B] border border-gray-700/50 hover:border-[#7D52F4]/70 transition-all rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer active:scale-95 group shadow-sm text-center"
                    title={`Click to add ${item.label} or drag onto canvas`}
                  >
                    <div className="flex items-center justify-center h-8 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-200 mt-2 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BACKDROPS (Matching Tutor LMS) */}
          {activeTab === "backdrops" && (
            <div className="p-4 space-y-5 overflow-y-auto flex-1 [scrollbar-width:thin]">
              {/* SECTION 1: COLOR */}
              <div>
                <h3 className="text-xs font-semibold text-gray-200 mb-2.5">Color</h3>
                <div className="grid grid-cols-5 gap-2">
                  {BACKDROP_COLORS.map((swatch) => {
                    const isSelected = backdropConfig.color.toLowerCase() === swatch.color.toLowerCase();
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => {
                          setBackdropConfig((prev) => ({ ...prev, color: swatch.color }));
                          showNotice(`Set canvas color to ${swatch.name}`);
                        }}
                        className={`bg-[#2A2F3D] hover:bg-[#343B4B] aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                          isSelected
                            ? "border-[#7D52F4] ring-2 ring-purple-500/40 shadow-md"
                            : "border-gray-700/50 hover:border-gray-500"
                        }`}
                        title={swatch.name}
                      >
                        <span
                          className={`size-6 rounded-full shadow-xs transition-transform ${
                            isSelected ? "scale-110 ring-2 ring-white" : ""
                          }`}
                          style={{ backgroundColor: swatch.color }}
                        />
                      </button>
                    );
                  })}

                  {/* 15th: Custom Color Picker */}
                  <label
                    className={`bg-[#2A2F3D] hover:bg-[#343B4B] aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border relative ${
                      !BACKDROP_COLORS.some((c) => c.color.toLowerCase() === backdropConfig.color.toLowerCase())
                        ? "border-[#7D52F4] ring-2 ring-purple-500/40"
                        : "border-gray-700/50 hover:border-gray-500"
                    }`}
                    title="Custom Color"
                  >
                    <input
                      type="color"
                      value={backdropConfig.color}
                      onChange={(e) => {
                        setBackdropConfig((prev) => ({ ...prev, color: e.target.value }));
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <svg viewBox="0 0 24 24" className="size-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 11l-8-8-8.5 8.5a2.12 2.12 0 0 0 0 3l5 5a2.12 2.12 0 0 0 3 0L19 11z" />
                      <path d="M5 2l5 5" />
                      <path d="M2 22s3-1 5-4" />
                    </svg>
                  </label>
                </div>
              </div>

              {/* SECTION 2: PATTERN */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold text-gray-200">Pattern</h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (backdropConfig.pattern !== "none") {
                        setBackdropConfig((prev) => ({ ...prev, pattern: "none" }));
                        showNotice("Cleared pattern");
                      }
                    }}
                    className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {backdropConfig.pattern !== "none" ? "Clear" : "View all >"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {BACKDROP_PATTERNS.map((pat) => {
                    const isSelected = backdropConfig.pattern === pat.id;
                    return (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => {
                          const next = isSelected ? "none" : pat.id;
                          setBackdropConfig((prev) => ({ ...prev, pattern: next }));
                          showNotice(isSelected ? "Removed pattern" : `Applied ${pat.name}`);
                        }}
                        className={`bg-[#2A2F3D] hover:bg-[#343B4B] aspect-square rounded-xl p-2.5 flex items-center justify-center cursor-pointer transition-all border ${
                          isSelected
                            ? "border-2 border-[#7D52F4] ring-2 ring-purple-500/30 shadow-md"
                            : "border border-gray-700/60 hover:border-gray-500"
                        }`}
                        title={pat.name}
                      >
                        <div className="size-full">
                          <BackdropPatternGraphic pattern={pat.id} isThumbnail />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: BACKGROUND */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold text-gray-200">Background</h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (backdropConfig.background !== "none") {
                        setBackdropConfig((prev) => ({ ...prev, background: "none" }));
                        showNotice("Cleared background backdrop");
                      }
                    }}
                    className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {backdropConfig.background !== "none" ? "Clear" : "View all >"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {BACKDROP_BACKGROUNDS.map((bg) => {
                    const isSelected = backdropConfig.background === bg.id;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => {
                          const next = isSelected ? "none" : bg.id;
                          setBackdropConfig((prev) => ({ ...prev, background: next }));
                          showNotice(isSelected ? "Removed background" : `Applied ${bg.name}`);
                        }}
                        className={`bg-white aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border relative shadow-xs ${
                          isSelected
                            ? "border-2 border-[#7D52F4] ring-2 ring-[#7D52F4]/50 shadow-md scale-102"
                            : "border border-gray-700/60 hover:border-gray-500 opacity-90 hover:opacity-100"
                        }`}
                        title={bg.name}
                      >
                        <div className="size-full">
                          <BackdropBackgroundGraphic background={bg.id} isThumbnail />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA (Matching Tutor LMS with Site Media Library) */}
          {activeTab === "media" && (
            <div className="p-4 space-y-4 overflow-y-auto flex-1 [scrollbar-width:thin]">
              <div className="flex items-center justify-between pb-1 border-b border-gray-800/80">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Media Library
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click or drag images directly onto the canvas.
                  </p>
                </div>
              </div>

              {/* 2-Column Grid matching reference image */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Upload File Card matching reference image */}
                <label className="bg-[#2A2F3D] hover:bg-[#343B4B] border border-gray-700/60 hover:border-[#7D52F4] aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all p-3 text-center group shadow-sm active:scale-95">
                  <div className="flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-7 text-gray-300 group-hover:text-purple-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">
                    Upload File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaFileUpload}
                    className="hidden"
                  />
                </label>

                {/* 2. Media Library Items */}
                {mediaLibrary.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/x-certificate-media-url", item.url);
                      e.dataTransfer.setData("application/x-certificate-media-title", item.title);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => handleAddMediaToCanvas(item.url, item.title)}
                    className="bg-gray-900 aspect-square rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#7D52F4] transition-all cursor-pointer group relative shadow-sm hover:shadow-purple-950/30 active:scale-95 text-left p-0"
                    title={`Click to add ${item.title} to canvas or drag onto editor`}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 pointer-events-none">
                      <span className="text-[10px] font-medium text-white truncate drop-shadow-sm">
                        {item.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LAYERS (Dedicated Canvas Layers Panel matching Tutor LMS) */}
          {activeTab === "layers" && (
            <div className="p-4 space-y-4 overflow-y-auto flex-1 [scrollbar-width:thin]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Canvas Layers
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {elements.length} {elements.length === 1 ? "layer" : "layers"} on canvas
                  </p>
                </div>
              </div>

              {/* Layers List (Top to Bottom) */}
              <div className="space-y-2">
                {elements.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    No layers on canvas. Add elements from the Elements tab.
                  </div>
                ) : (
                  [...elements].reverse().map((el, revIdx) => {
                    const originalIdx = elements.length - 1 - revIdx;
                    const isSelected = selectedElementId === el.id;

                    return (
                      <div
                        key={el.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("application/x-layer-index", originalIdx.toString());
                          e.dataTransfer.effectAllowed = "move";
                          setDraggedLayerIdx(originalIdx);
                        }}
                        onDragEnd={() => {
                          setDraggedLayerIdx(null);
                          setDragOverLayerIdx(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          if (dragOverLayerIdx !== originalIdx) {
                            setDragOverLayerIdx(originalIdx);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const fromIdxStr = e.dataTransfer.getData("application/x-layer-index");
                          if (fromIdxStr !== "") {
                            const fromIdx = parseInt(fromIdxStr, 10);
                            handleReorderLayers(fromIdx, originalIdx);
                          }
                          setDraggedLayerIdx(null);
                          setDragOverLayerIdx(null);
                        }}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all group ${
                          draggedLayerIdx === originalIdx
                            ? "opacity-30 border-dashed border-[#7D52F4]"
                            : dragOverLayerIdx === originalIdx
                            ? "border-t-2 border-t-[#7D52F4] bg-purple-950/30 text-white"
                            : isSelected
                            ? "bg-purple-950/40 border-[#7D52F4] text-white shadow-sm"
                            : "bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                          <span className="text-xs shrink-0">
                            {el.type === "signature"
                              ? "✍️"
                              : el.type === "medallion"
                              ? "🏅"
                              : el.type === "divider"
                              ? "⚜️"
                              : el.type === "qrcode"
                              ? "📱"
                              : el.type === "logo" || el.label === "Logo"
                              ? "🏷️"
                              : el.type === "image"
                              ? "🖼️"
                              : el.label === "Course"
                              ? "📖"
                              : el.label === "Student Name"
                              ? "🎓"
                              : el.label === "Instructor"
                              ? "👨‍🏫"
                              : el.label === "Time"
                              ? "📅"
                              : el.label === "Duration"
                              ? "⌛"
                              : el.label === "Point"
                              ? "🥧"
                              : el.label === "Grade"
                              ? "🅰️"
                              : el.label === "Bundle Courses"
                              ? "📚"
                              : "📝"}
                          </span>
                          <div className="truncate">
                            <p className="text-xs font-semibold truncate">{el.label}</p>
                          </div>
                        </div>

                        {/* Layer Actions: Drag Handle, Lock, Visibility, Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Drag Grip Handle to Reorder in Z-Index */}
                          <div
                            className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                            title="Drag to reorder layer z-index"
                          >
                            <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
                              <circle cx="9" cy="6" r="1.5" />
                              <circle cx="15" cy="6" r="1.5" />
                              <circle cx="9" cy="12" r="1.5" />
                              <circle cx="15" cy="12" r="1.5" />
                              <circle cx="9" cy="18" r="1.5" />
                              <circle cx="15" cy="18" r="1.5" />
                            </svg>
                          </div>

                          {/* Lock Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLockElement(el.id);
                            }}
                            className={`p-1 rounded text-xs transition-colors ${
                              el.locked
                                ? "text-amber-400 bg-amber-950/40"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                            title={el.locked ? "Unlock layer" : "Lock layer"}
                          >
                            {el.locked ? "🔒" : "🔓"}
                          </button>

                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setElements((prev) =>
                                prev.map((item) =>
                                  item.id === el.id ? { ...item, visible: !item.visible } : item
                                )
                              );
                            }}
                            className="p-1 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title={el.visible ? "Hide element" : "Show element"}
                          >
                            {el.visible ? "👁️" : "🚫"}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setElements((prev) => prev.filter((item) => item.id !== el.id));
                              if (selectedElementId === el.id) setSelectedElementId(null);
                              showNotice(`Removed ${el.label}`);
                            }}
                            className="p-1 rounded text-xs text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors"
                            title="Delete layer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="p-4 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Certificate Settings
              </h2>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Authorized Signatory Name</label>
                  <input
                    type="text"
                    value={settings.authorizedName}
                    onChange={(e) => {
                      setSettings({ ...settings, authorizedName: e.target.value });
                      setElements((prev) =>
                        prev.map((el) => (el.id === "el-sig-right" || el.id === "el-signature" ? { ...el, content: e.target.value } : el))
                      );
                    }}
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Authorized Designation</label>
                  <input
                    type="text"
                    value={settings.authorizedTitle}
                    onChange={(e) => {
                      setSettings({ ...settings, authorizedTitle: e.target.value });
                      setElements((prev) =>
                        prev.map((el) => (el.id === "el-sig-right" || el.id === "el-signature" ? { ...el, subcontent: e.target.value } : el))
                      );
                    }}
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Institution / Academy Name</label>
                  <input
                    type="text"
                    value={settings.authorizedCompany}
                    onChange={(e) => {
                      setSettings({ ...settings, authorizedCompany: e.target.value });
                      setElements((prev) =>
                        prev.map((el) => (el.id === "el-org-header" ? { ...el, content: e.target.value } : el))
                      );
                    }}
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= 3. CENTER INTERACTIVE CANVAS (Light Studio Workspace matching Tutor LMS) ================= */}
        <main
          ref={workspaceRef}
          onClick={() => setSelectedElementId(null)}
          className="flex-1 bg-[#EEF1F5] relative flex overflow-auto p-6 sm:p-10 [scrollbar-width:thin]"
        >
          {/* Default Large Screen-Filling Certificate Canvas Frame Wrapper */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={handleDropOnCanvas}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedElementId(null);
                setActiveToolbarPopover(null);
              }
            }}
            style={{
              width: `${(orientation === "landscape" ? 1180 : 780) * (zoomLevel / 100)}px`,
              height: `${(orientation === "landscape" ? 780 : 1100) * (zoomLevel / 100)}px`,
            }}
            className="m-auto relative flex items-center justify-center shrink-0 transition-[width,height] duration-75 ease-out"
          >
            <div
              ref={canvasRef}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={handleDropOnCanvas}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElementId(null);
                  setActiveToolbarPopover(null);
                }
              }}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
                backgroundColor: backdropConfig.color || "#FFFFFF",
              }}
              className={`relative shadow-2xl transition-[transform] duration-75 ease-out shrink-0 border border-blue-400/40 rounded-sm overflow-hidden ${
                orientation === "landscape" ? "w-[1180px] h-[780px]" : "w-[780px] h-[1100px]"
              }`}
            >
            {/* Backdrop Background Graphic (9 designs matching Tutor LMS) */}
            {backdropConfig.background !== "none" && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <BackdropBackgroundGraphic background={backdropConfig.background} />
              </div>
            )}

            {/* Backdrop Pattern Overlay (3 patterns matching Tutor LMS) */}
            {backdropConfig.pattern !== "none" && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <BackdropPatternGraphic pattern={backdropConfig.pattern} />
              </div>
            )}
            {/* Subtle Sleek Anti-Counterfeit Background Watermark */}
            {watermark.type !== "none" && (
              <div
                style={{
                  opacity: watermark.opacity,
                  transform: `scale(${watermark.scale})`,
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              >
                {watermark.type === "guilloche" && <GuillocheWatermarkSvg className="size-[540px] text-slate-400" color="#94A3B8" />}
                {watermark.type === "crest" && <AcademicCrestWatermarkSvg className="size-[540px] text-slate-500" color="#64748B" />}
                {watermark.type === "monogram" && <MonogramWatermarkSvg className="size-[500px] text-slate-500" color="#64748B" />}
                {watermark.type === "custom_text" && (
                  <div className="rotate-[-25deg] select-none text-center">
                    <p className="text-5xl font-mono font-extrabold tracking-[0.3em] uppercase text-slate-600 whitespace-nowrap">
                      {watermark.text}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Selected Border SVG hugging sheet perimeter matching Image 1 */}
            <div className="absolute inset-3.5 pointer-events-none z-10">
              {templateStyle === "Classic Border" && <ClassicBorderSvg className="size-full text-slate-400" color="#94A3B8" />}
              {templateStyle === "Modern Geometric" && <ModernBorderSvg className="size-full text-purple-600/80" />}
              {templateStyle === "Technical Excellence" && <TechnicalBorderSvg className="size-full text-teal-600/80" />}
              {templateStyle === "Corporate Crest" && <CorporateBorderSvg className="size-full text-indigo-900/80" />}
              {templateStyle === "Creative Vanguard" && <CreativeWaveBorderSvg className="size-full" />}
              {templateStyle === "Minimalist Diploma" && <MinimalistBorderSvg className="size-full text-slate-700/80" />}
            </div>

            {/* ================= INTERACTIVE MOVABLE ELEMENTS LAYER ================= */}
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElementId(null);
                  setActiveToolbarPopover(null);
                }
              }}
              className="absolute inset-0 z-20 pointer-events-auto"
            >
              {elements
                .filter((el) => el.visible)
                .map((el) => {
                  const isSelected = selectedElementId === el.id;

                  return (
                    <div
                      key={el.id}
                      onPointerDown={(e) => handlePointerDownElement(e, el.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId(el.id);
                      }}
                      style={{
                        position: "absolute",
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className={`group cursor-grab active:cursor-grabbing select-none transition-shadow ${
                        isSelected ? "z-30" : "z-20 hover:ring-1 hover:ring-blue-300"
                      }`}
                    >
                      {/* Selection Box & Floating Dark Toolbar matching Image 1 */}
                      {isSelected && (
                        <>
                          {/* Clean, high-precision blue bounding box */}
                          <div className="absolute -inset-1.5 border-[1.5px] border-[#2563EB] pointer-events-none z-40" />

                          {/* 4 Corner Circular Handles matching Image 1 */}
                          <div className="absolute -top-1.5 -left-1.5 size-2.5 rounded-full bg-[#2563EB] ring-2 ring-white shadow-xs z-50 pointer-events-none" />
                          <div className="absolute -top-1.5 -right-1.5 size-2.5 rounded-full bg-[#2563EB] ring-2 ring-white shadow-xs z-50 pointer-events-none" />
                          <div className="absolute -bottom-1.5 -left-1.5 size-2.5 rounded-full bg-[#2563EB] ring-2 ring-white shadow-xs z-50 pointer-events-none" />
                          <div className="absolute -bottom-1.5 -right-1.5 size-2.5 rounded-full bg-[#2563EB] ring-2 ring-white shadow-xs z-50 pointer-events-none" />

                          {/* 4 Edge Pill Handles matching Image 1 */}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-full bg-[#2563EB] ring-1 ring-white shadow-2xs z-50 pointer-events-none" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-full bg-[#2563EB] ring-1 ring-white shadow-2xs z-50 pointer-events-none" />
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 h-3.5 w-1 rounded-full bg-[#2563EB] ring-1 ring-white shadow-2xs z-50 pointer-events-none" />
                          <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-3.5 w-1 rounded-full bg-[#2563EB] ring-1 ring-white shadow-2xs z-50 pointer-events-none" />

                          {/* Floating Contextual Toolbar directly above active element matching Image 1 */}
                          <div
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-md bg-[#1E2024] px-1.5 py-1 text-white shadow-2xl text-xs z-50 whitespace-nowrap border border-gray-700/70 animate-in fade-in duration-100"
                          >
                            {/* 1. Typography Button [ T ] */}
                            {el.type === "text" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveToolbarPopover((p) => (p === "typography" ? null : "typography"))
                                }
                                className={`flex items-center justify-center size-6 rounded hover:bg-gray-800 transition-colors font-serif font-bold text-xs ${
                                  activeToolbarPopover === "typography" ? "bg-gray-800 text-purple-400" : "text-gray-200"
                                }`}
                                title="Typography (Font size, family & style)"
                              >
                                T
                              </button>
                            )}

                            {/* 2. Color Swatch Button */}
                            {el.type === "text" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveToolbarPopover((p) => (p === "color" ? null : "color"))
                                }
                                className={`flex items-center justify-center size-6 rounded hover:bg-gray-800 transition-colors ${
                                  activeToolbarPopover === "color" ? "bg-gray-800 ring-1 ring-purple-400" : ""
                                }`}
                                title="Text Color"
                              >
                                <span
                                  className="size-3.5 rounded-full ring-1 ring-white/70 shadow-xs"
                                  style={{ backgroundColor: el.color || "#0F172A" }}
                                />
                              </button>
                            )}

                            {/* 3. Alignment Toggle Button */}
                            {el.type === "text" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextAlign =
                                    el.textAlign === "center"
                                      ? "left"
                                      : el.textAlign === "left"
                                      ? "right"
                                      : "center";
                                  setElements((prev) =>
                                    prev.map((item) => (item.id === el.id ? { ...item, textAlign: nextAlign } : item))
                                  );
                                }}
                                className="flex items-center justify-center size-6 rounded hover:bg-gray-800 text-gray-200 hover:text-white transition-colors text-xs font-bold"
                                title={`Text Alignment (Currently ${el.textAlign || "center"})`}
                              >
                                {el.textAlign === "left" ? "⫷" : el.textAlign === "right" ? "⫸" : "≡"}
                              </button>
                            )}

                            {/* 4. Quick Sliders / Font Size Adjust */}
                            {el.type === "text" && (
                              <div className="flex items-center gap-0.5 px-1 border-l border-gray-700">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setElements((prev) =>
                                      prev.map((item) =>
                                        item.id === el.id
                                          ? { ...item, fontSize: Math.max(10, (item.fontSize || 16) - 2) }
                                          : item
                                      )
                                    )
                                  }
                                  className="size-5 rounded flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-bold"
                                  title="Decrease font size"
                                >
                                  -
                                </button>
                                <span className="font-mono text-[10px] text-purple-300 min-w-[24px] text-center">
                                  {el.fontSize}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setElements((prev) =>
                                      prev.map((item) =>
                                        item.id === el.id
                                          ? { ...item, fontSize: Math.min(72, (item.fontSize || 16) + 2) }
                                          : item
                                      )
                                    )
                                  }
                                  className="size-5 rounded flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-bold"
                                  title="Increase font size"
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {/* Divider */}
                            <div className="h-4 w-px bg-gray-700 mx-0.5" />

                            {/* 5. Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateElement(el.id)}
                              className="flex items-center justify-center size-6 rounded text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                              title="Duplicate Element"
                            >
                              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>

                            {/* 6. Lock / Unlock Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleLockElement(el.id)}
                              className={`flex items-center justify-center size-6 rounded transition-colors ${
                                el.locked ? "text-amber-400 bg-amber-950/40" : "text-gray-300 hover:text-white hover:bg-gray-800"
                              }`}
                              title={el.locked ? "Unlock layer" : "Lock layer against dragging"}
                            >
                              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {el.locked ? (
                                  <>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                  </>
                                ) : (
                                  <>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                                  </>
                                )}
                              </svg>
                            </button>

                            {/* 7. Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setElements((prev) => prev.filter((item) => item.id !== el.id));
                                setSelectedElementId(null);
                                showNotice(`Removed ${el.label}`);
                              }}
                              className="flex items-center justify-center size-6 rounded text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors ml-0.5"
                              title="Delete Element"
                            >
                              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>

                            {/* Contextual Popover: Typography Settings */}
                            {activeToolbarPopover === "typography" && (
                              <div className="absolute -top-24 left-0 flex items-center gap-2 rounded-xl bg-gray-900 border border-gray-700/80 px-3 py-2 text-white shadow-2xl z-50 text-xs">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Family:</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setElements((prev) =>
                                        prev.map((item) => (item.id === el.id ? { ...item, fontFamily: "serif" } : item))
                                      )
                                    }
                                    className={`px-1.5 py-0.5 rounded font-serif ${
                                      el.fontFamily === "serif" ? "bg-[#7D52F4] text-white" : "hover:bg-gray-800 text-gray-300"
                                    }`}
                                  >
                                    Serif
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setElements((prev) =>
                                        prev.map((item) => (item.id === el.id ? { ...item, fontFamily: "sans" } : item))
                                      )
                                    }
                                    className={`px-1.5 py-0.5 rounded font-sans ${
                                      el.fontFamily === "sans" ? "bg-[#7D52F4] text-white" : "hover:bg-gray-800 text-gray-300"
                                    }`}
                                  >
                                    Sans
                                  </button>
                                </div>
                                <div className="h-4 w-px bg-gray-700" />
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setElements((prev) =>
                                        prev.map((item) =>
                                          item.id === el.id
                                            ? { ...item, fontWeight: item.fontWeight === "bold" ? "normal" : "bold" }
                                            : item
                                        )
                                      )
                                    }
                                    className={`size-6 rounded font-bold ${
                                      el.fontWeight === "bold" ? "bg-[#7D52F4] text-white" : "hover:bg-gray-800 text-gray-300"
                                    }`}
                                  >
                                    B
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setElements((prev) =>
                                        prev.map((item) =>
                                          item.id === el.id
                                            ? { ...item, fontStyle: item.fontStyle === "italic" ? "normal" : "italic" }
                                            : item
                                        )
                                      )
                                    }
                                    className={`size-6 rounded italic font-serif ${
                                      el.fontStyle === "italic" ? "bg-[#7D52F4] text-white" : "hover:bg-gray-800 text-gray-300"
                                    }`}
                                  >
                                    I
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Contextual Popover: Color Palette */}
                            {activeToolbarPopover === "color" && (
                              <div className="absolute -top-12 left-0 flex items-center gap-1.5 rounded-xl bg-gray-900 border border-gray-700/80 px-2.5 py-1.5 text-white shadow-2xl z-50">
                                {[
                                  { color: "#1E3A8A", title: "Navy" },
                                  { color: "#2563EB", title: "Royal Blue" },
                                  { color: "#0F172A", title: "Charcoal" },
                                  { color: "#D97706", title: "Gold" },
                                  { color: "#64748B", title: "Slate" },
                                  { color: "#7D52F4", title: "Purple" },
                                ].map((swatch) => (
                                  <button
                                    key={swatch.color}
                                    type="button"
                                    onClick={() => {
                                      setElements((prev) =>
                                        prev.map((item) => (item.id === el.id ? { ...item, color: swatch.color } : item))
                                      );
                                      setActiveToolbarPopover(null);
                                    }}
                                    style={{ backgroundColor: swatch.color }}
                                    className="size-4 rounded-full ring-1 ring-white/60 hover:scale-125 transition-transform"
                                    title={swatch.title}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Element Type Renderers matching Image 1 */}
                      {el.type === "logo" && (
                        <div className="flex items-center gap-2 p-1">
                          {customLogoUrl ? (
                            <img src={customLogoUrl} alt="Logo" className="h-8 w-auto object-contain max-w-[150px]" />
                          ) : (
                            <>
                              <div className="size-8 rounded-lg bg-[#7D52F4] flex items-center justify-center font-bold text-white text-base shadow-sm">
                                S
                              </div>
                              <span className="font-extrabold text-base tracking-tight text-gray-900">
                                Skilliant<span className="text-[#7D52F4]">.</span>
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {el.type === "image" && (
                        <div className="relative group max-w-[220px] max-h-[180px] overflow-hidden rounded-xl shadow-md border border-gray-200/50 bg-white">
                          <img
                            src={el.content}
                            alt={el.label}
                            className="w-auto h-auto max-w-[200px] max-h-[160px] object-contain pointer-events-none rounded-lg"
                          />
                        </div>
                      )}

                      {el.type === "text" && (
                        <div
                          style={{
                            fontSize: `${el.fontSize || 16}px`,
                            color: el.color || "#0F172A",
                            textAlign: el.textAlign || "center",
                          }}
                          className={`whitespace-nowrap transition-colors select-none ${
                            el.fontFamily === "serif"
                              ? "font-serif"
                              : el.fontFamily === "mono"
                              ? "font-mono"
                              : "font-sans"
                          } ${
                            el.fontWeight === "extrabold"
                              ? "font-extrabold"
                              : el.fontWeight === "bold"
                              ? "font-bold"
                              : el.fontWeight === "medium"
                              ? "font-medium"
                              : "font-normal"
                          } ${el.fontStyle === "italic" ? "italic" : "not-italic"}`}
                        >
                          {editingElementId === el.id ? (
                            <input
                              type="text"
                              autoFocus
                              value={el.content}
                              onBlur={() => setEditingElementId(null)}
                              onChange={(e) => {
                                const val = e.target.value;
                                setElements((prev) =>
                                  prev.map((item) => (item.id === el.id ? { ...item, content: val } : item))
                                );
                              }}
                              className="bg-white/90 border border-blue-500 px-2 py-0.5 rounded outline-none text-center shadow-xs"
                            />
                          ) : (
                            <span onDoubleClick={() => setEditingElementId(el.id)}>{el.content}</span>
                          )}

                          {/* Dashed underline directly beneath recipient name matching Image 1 */}
                          {el.id === "el-student-name" && (
                            <div className="w-64 sm:w-80 max-w-full mx-auto border-b border-dashed border-gray-400/80 mt-2 pointer-events-none" />
                          )}

                          {/* Subcontent: subtle caption */}
                          {el.subcontent && (
                            <p className="text-[10px] text-gray-500 font-sans not-italic font-normal tracking-wider mt-0.5">
                              {el.subcontent}
                            </p>
                          )}
                        </div>
                      )}

                      {el.type === "divider" && (
                        <div className="flex justify-center p-1">
                          <OrnateDividerSvg className="w-56 h-5 text-amber-500" color="#D97706" />
                        </div>
                      )}

                      {el.type === "signature" && (
                        <div className="text-left w-44 space-y-1 select-none">
                          <div className="h-10 flex items-center">
                            {settings.signatureImageUrl ? (
                              <Image
                                src={settings.signatureImageUrl}
                                alt="Signature"
                                width={130}
                                height={40}
                                className="max-h-9 object-contain"
                              />
                            ) : el.id === "el-sig-left" ? (
                              <CursiveSignatureAndrewSvg className="w-36 h-10 text-gray-800" />
                            ) : (
                              <CursiveSignatureRobertSvg className="w-36 h-10 text-gray-800" />
                            )}
                          </div>
                          <div className="w-40 border-t border-gray-300 pt-1">
                            <p className="text-xs font-semibold text-[#2563EB]">
                              {el.id === "el-sig-left" ? `[ ${el.content} ]` : el.content}
                            </p>
                            <p className="text-[11px] text-gray-500">{el.subcontent}</p>
                          </div>
                        </div>
                      )}

                      {el.type === "medallion" && (
                        <div className="flex items-center justify-center p-1 select-none">
                          <GoldMedallionSvg className="size-24" />
                        </div>
                      )}

                      {el.type === "qrcode" && (
                        <div className="text-right w-36 space-y-1 select-none">
                          <QrCodeSvg className="size-11 ml-auto text-gray-900" />
                          <p className="font-mono text-[10px] font-bold text-gray-800">{el.content}</p>
                          <p className="text-[9px] text-gray-500">{el.subcontent}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

          {/* Floating Zoom Controls matching Tutor LMS */}
          <div className="absolute bottom-5 right-6 z-40 flex items-center gap-2 rounded-xl bg-gray-900/90 text-white px-3 py-1.5 shadow-xl text-xs backdrop-blur-sm border border-gray-800 select-none">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(40, z - 10))}
              className="px-1.5 hover:text-purple-400 font-bold transition-colors cursor-pointer"
              title="Zoom out (or scroll mouse wheel down)"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(80)}
              className="font-mono font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
              title="Click to reset zoom (80%)"
            >
              {zoomLevel}%
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
              className="px-1.5 hover:text-purple-400 font-bold transition-colors cursor-pointer"
              title="Zoom in (or scroll mouse wheel up)"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(80)}
              className="text-[10px] text-gray-400 hover:text-purple-300 transition-colors ml-1 border-l border-gray-700 pl-2 cursor-pointer"
              title="Reset zoom to default (80%)"
            >
              Reset
            </button>
          </div>
        </main>
      </div>

      {/* ================= FULL PREVIEW MODAL ================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-5xl w-full bg-white rounded-3xl p-6 sm:p-8 text-gray-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Certificate Credential Preview</h3>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div
              style={{
                backgroundColor: backdropConfig.color || "#FFFFFF",
              }}
              className="aspect-[16/10] w-full rounded-2xl border border-gray-200 p-8 relative overflow-hidden flex flex-col justify-between text-center shadow-inner"
            >
              {/* Backdrop Background Graphic in Preview */}
              {backdropConfig.background !== "none" && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <BackdropBackgroundGraphic background={backdropConfig.background} />
                </div>
              )}

              {/* Backdrop Pattern Overlay in Preview */}
              {backdropConfig.pattern !== "none" && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <BackdropPatternGraphic pattern={backdropConfig.pattern} />
                </div>
              )}
              {/* Watermark in Preview */}
              {watermark.type !== "none" && (
                <div
                  style={{ opacity: watermark.opacity, transform: `scale(${watermark.scale})` }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                >
                  {watermark.type === "guilloche" && <GuillocheWatermarkSvg className="size-[480px] text-slate-400" color="#94A3B8" />}
                  {watermark.type === "crest" && <AcademicCrestWatermarkSvg className="size-[480px] text-slate-500" color="#64748B" />}
                  {watermark.type === "monogram" && <MonogramWatermarkSvg className="size-[440px] text-slate-500" color="#64748B" />}
                  {watermark.type === "custom_text" && (
                    <div className="rotate-[-25deg] select-none text-center">
                      <p className="text-4xl font-mono font-extrabold tracking-[0.3em] uppercase text-slate-600 whitespace-nowrap">
                        {watermark.text}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Decorative Border SVG in Preview */}
              <div className="absolute inset-2 pointer-events-none z-10">
                {templateStyle === "Classic Border" && <ClassicBorderSvg className="size-full text-slate-400 pointer-events-none" color="#94A3B8" />}
                {templateStyle === "Modern Geometric" && <ModernBorderSvg className="size-full text-purple-600 pointer-events-none" />}
                {templateStyle === "Technical Excellence" && <TechnicalBorderSvg className="size-full text-teal-600 pointer-events-none" />}
                {templateStyle === "Corporate Crest" && <CorporateBorderSvg className="size-full text-indigo-900 pointer-events-none" />}
                {templateStyle === "Creative Vanguard" && <CreativeWaveBorderSvg className="size-full pointer-events-none" />}
                {templateStyle === "Minimalist Diploma" && <MinimalistBorderSvg className="size-full text-slate-700 pointer-events-none" />}
              </div>

              {/* Preview Elements at customized coordinates */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {elements
                  .filter((el) => el.visible)
                  .map((el) => (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="select-none"
                    >
                      {el.type === "logo" && (
                        <div className="flex items-center gap-2">
                          {customLogoUrl ? (
                            <img src={customLogoUrl} alt="Logo" className="h-8 w-auto object-contain max-w-[150px]" />
                          ) : (
                            <>
                              <div className="size-8 rounded-lg bg-[#7D52F4] flex items-center justify-center font-bold text-white text-base shadow-sm">
                                S
                              </div>
                              <span className="font-extrabold text-base tracking-tight text-gray-900">
                                Skilliant<span className="text-[#7D52F4]">.</span>
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {el.type === "image" && (
                        <div className="relative max-w-[200px] max-h-[160px] overflow-hidden rounded-xl shadow-md border border-gray-200/50 bg-white">
                          <img
                            src={el.content}
                            alt={el.label}
                            className="w-auto h-auto max-w-[180px] max-h-[140px] object-contain pointer-events-none rounded-lg"
                          />
                        </div>
                      )}

                      {el.type === "text" && (
                        <div
                          style={{
                            fontSize: `${Math.round((el.fontSize || 16) * 0.9)}px`,
                            color: el.color || "#0F172A",
                            textAlign: el.textAlign || "center",
                          }}
                          className={`whitespace-nowrap ${
                            el.fontFamily === "serif"
                              ? "font-serif"
                              : el.fontFamily === "mono"
                              ? "font-mono"
                              : "font-sans"
                          } ${
                            el.fontWeight === "extrabold"
                              ? "font-extrabold"
                              : el.fontWeight === "bold"
                              ? "font-bold"
                              : el.fontWeight === "medium"
                              ? "font-medium"
                              : "font-normal"
                          } ${el.fontStyle === "italic" ? "italic" : "not-italic"}`}
                        >
                          <span>{el.content}</span>
                          {/* Dashed underline underneath student name in preview */}
                          {el.id === "el-student-name" && (
                            <div className="w-56 mx-auto border-b border-dashed border-gray-400 mt-1 pointer-events-none" />
                          )}
                          {/* Subcontent: subtle caption */}
                          {el.subcontent && (
                            <p className="text-[9px] text-gray-500 font-sans not-italic font-normal tracking-wider mt-0.5">
                              {el.subcontent}
                            </p>
                          )}
                        </div>
                      )}

                      {el.type === "divider" && (
                        <div className="flex justify-center">
                          <OrnateDividerSvg className="w-48 h-4 text-amber-500" color="#D97706" />
                        </div>
                      )}

                      {el.type === "signature" && (
                        <div className="text-left w-36 space-y-1">
                          <div className="h-8 flex items-center">
                            {settings.signatureImageUrl ? (
                              <Image
                                src={settings.signatureImageUrl}
                                alt="Signature"
                                width={110}
                                height={35}
                                className="max-h-8 object-contain"
                              />
                            ) : el.id === "el-sig-left" ? (
                              <CursiveSignatureAndrewSvg className="w-28 h-8 text-gray-800" />
                            ) : (
                              <CursiveSignatureRobertSvg className="w-28 h-8 text-gray-800" />
                            )}
                          </div>
                          <div className="w-32 border-t border-gray-400 pt-0.5">
                            <p className="text-[11px] font-semibold text-[#2563EB]">
                              {el.id === "el-sig-left" ? `[ ${el.content} ]` : el.content}
                            </p>
                            <p className="text-[9px] text-gray-500">{el.subcontent}</p>
                          </div>
                        </div>
                      )}

                      {el.type === "medallion" && (
                        <div className="flex items-center justify-center">
                          <GoldMedallionSvg className="size-20" />
                        </div>
                      )}

                      {el.type === "qrcode" && (
                        <div className="text-right w-36 space-y-0.5">
                          <QrCodeSvg className="size-9 ml-auto text-gray-900" />
                          <p className="font-mono text-[9px] font-bold text-gray-800">{el.content}</p>
                          <p className="text-[8px] text-gray-500">{el.subcontent}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CertificateBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#EEF1F5] flex items-center justify-center text-sm font-semibold text-gray-600">
          Loading Certificate Studio...
        </div>
      }
    >
      <CertificateBuilderContent />
    </Suspense>
  );
}
