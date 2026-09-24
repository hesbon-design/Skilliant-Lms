"use client";

import React from "react";

interface SvgProps {
  className?: string;
  color?: string;
}

/**
 * 1. Classic Ornamental Academic Laurel Leaf Garland Border
 * Botanical laurel sprigs and foliage frame with corner rosettes and framing lines matching Image 1
 */
export const FloralGarlandBorderSvg = ({
  className = "size-full text-slate-400",
  color = "currentColor",
}: SvgProps) => (
  <svg
    viewBox="0 0 1000 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    <defs>
      {/* Horizontal Laurel Sprig Pattern */}
      <pattern id="laurelH" width="48" height="42" patternUnits="userSpaceOnUse">
        {/* Central vine */}
        <path d="M0 21 Q12 16 24 21 T48 21" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {/* Leaf pairs angled gracefully */}
        <path
          d="M8 18 C11 11 19 11 21 16 C18 20 11 20 8 18 Z"
          fill={color}
          fillOpacity="0.22"
          stroke={color}
          strokeWidth="0.9"
        />
        <path
          d="M8 24 C11 31 19 31 21 26 C18 22 11 22 8 24 Z"
          fill={color}
          fillOpacity="0.22"
          stroke={color}
          strokeWidth="0.9"
        />
        <path
          d="M26 17 C30 8 40 9 41 16 C38 19 30 19 26 17 Z"
          fill={color}
          fillOpacity="0.26"
          stroke={color}
          strokeWidth="0.9"
        />
        <path
          d="M26 25 C30 34 40 33 41 26 C38 23 30 23 26 25 Z"
          fill={color}
          fillOpacity="0.26"
          stroke={color}
          strokeWidth="0.9"
        />
        {/* Laurel berry clusters */}
        <circle cx="16" cy="21" r="1.5" fill={color} />
        <circle cx="35" cy="21" r="1.5" fill={color} />
      </pattern>

      {/* Vertical Laurel Sprig Pattern */}
      <pattern id="laurelV" width="42" height="48" patternUnits="userSpaceOnUse">
        <path d="M21 0 Q16 12 21 24 T21 48" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <path
          d="M18 8 C11 11 11 19 16 21 C20 18 20 11 18 8 Z"
          fill={color}
          fillOpacity="0.22"
          stroke={color}
          strokeWidth="0.9"
        />
        <path
          d="M24 8 C31 11 31 19 26 21 C22 18 22 11 24 8 Z"
          fill={color}
          fillOpacity="0.22"
          stroke={color}
          strokeWidth="0.9"
        />
        <path
          d="M17 26 C8 30 9 40 16 41 C19 38 19 30 17 26 Z"
          fill={color}
          fillOpacity="0.26"
          stroke={color}
          strokeWidth="0.9"
        />
        <path
          d="M25 26 C34 30 33 40 26 41 C23 38 23 30 25 26 Z"
          fill={color}
          fillOpacity="0.26"
          stroke={color}
          strokeWidth="0.9"
        />
        <circle cx="21" cy="16" r="1.5" fill={color} />
        <circle cx="21" cy="35" r="1.5" fill={color} />
      </pattern>
    </defs>

    {/* Outer Clean Framing Border */}
    <rect x="14" y="14" width="972" height="672" rx="3" stroke={color} strokeWidth="1.5" />
    <rect x="19" y="19" width="962" height="662" rx="2" stroke={color} strokeWidth="0.75" opacity="0.6" />

    {/* Inner Framing Border */}
    <rect x="58" y="58" width="884" height="584" rx="2" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
    <rect x="62" y="62" width="876" height="576" rx="2" stroke={color} strokeWidth="1.5" />

    {/* Top Garland Band */}
    <rect x="60" y="18" width="880" height="42" fill="url(#laurelH)" />
    {/* Bottom Garland Band */}
    <rect x="60" y="640" width="880" height="42" fill="url(#laurelH)" />
    {/* Left Garland Band */}
    <rect x="18" y="60" width="42" height="580" fill="url(#laurelV)" />
    {/* Right Garland Band */}
    <rect x="940" y="60" width="42" height="580" fill="url(#laurelV)" />

    {/* Top-Left Corner Rosette & Foliage */}
    <g transform="translate(18, 18)" stroke={color} fill="none">
      <circle cx="21" cy="21" r="16" strokeWidth="1.5" />
      <circle cx="21" cy="21" r="12" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="21" cy="21" r="5" fill={color} fillOpacity="0.3" strokeWidth="1" />
      <path d="M5 21 C12 14 30 14 37 21 C30 28 12 28 5 21 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M21 5 C14 12 14 30 21 37 C28 30 28 12 21 5 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M10 10 L32 32 M32 10 L10 32" strokeWidth="0.8" opacity="0.6" />
    </g>

    {/* Top-Right Corner Rosette & Foliage */}
    <g transform="translate(940, 18)" stroke={color} fill="none">
      <circle cx="21" cy="21" r="16" strokeWidth="1.5" />
      <circle cx="21" cy="21" r="12" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="21" cy="21" r="5" fill={color} fillOpacity="0.3" strokeWidth="1" />
      <path d="M5 21 C12 14 30 14 37 21 C30 28 12 28 5 21 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M21 5 C14 12 14 30 21 37 C28 30 28 12 21 5 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M10 10 L32 32 M32 10 L10 32" strokeWidth="0.8" opacity="0.6" />
    </g>

    {/* Bottom-Left Corner Rosette & Foliage */}
    <g transform="translate(18, 640)" stroke={color} fill="none">
      <circle cx="21" cy="21" r="16" strokeWidth="1.5" />
      <circle cx="21" cy="21" r="12" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="21" cy="21" r="5" fill={color} fillOpacity="0.3" strokeWidth="1" />
      <path d="M5 21 C12 14 30 14 37 21 C30 28 12 28 5 21 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M21 5 C14 12 14 30 21 37 C28 30 28 12 21 5 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M10 10 L32 32 M32 10 L10 32" strokeWidth="0.8" opacity="0.6" />
    </g>

    {/* Bottom-Right Corner Rosette & Foliage */}
    <g transform="translate(940, 640)" stroke={color} fill="none">
      <circle cx="21" cy="21" r="16" strokeWidth="1.5" />
      <circle cx="21" cy="21" r="12" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="21" cy="21" r="5" fill={color} fillOpacity="0.3" strokeWidth="1" />
      <path d="M5 21 C12 14 30 14 37 21 C30 28 12 28 5 21 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M21 5 C14 12 14 30 21 37 C28 30 28 12 21 5 Z" fill={color} fillOpacity="0.2" strokeWidth="0.8" />
      <path d="M10 10 L32 32 M32 10 L10 32" strokeWidth="0.8" opacity="0.6" />
    </g>
  </svg>
);

export const ClassicBorderSvg = (props: SvgProps) => (
  <FloralGarlandBorderSvg {...props} color={props.color || "#94A3B8"} />
);

/**
 * 2. Modern Geometric Border
 * Sleek purple tech aesthetic with geometric corner brackets and precision lines
 */
export const ModernBorderSvg = ({ className = "size-full text-purple-600", color = "currentColor" }: SvgProps) => (
  <svg
    viewBox="0 0 1000 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    {/* Outer perimeter */}
    <rect x="24" y="24" width="952" height="652" stroke={color} strokeWidth="1.5" opacity="0.3" />
    <rect x="36" y="36" width="928" height="628" stroke={color} strokeWidth="2" />

    {/* Top-left corner brackets */}
    <path d="M20 50 L20 20 L50 20" stroke={color} strokeWidth="4" strokeLinecap="square" />
    <polygon points="36,36 48,36 36,48" fill={color} />

    {/* Top-right corner brackets */}
    <path d="M980 50 L980 20 L950 20" stroke={color} strokeWidth="4" strokeLinecap="square" />
    <polygon points="964,36 952,36 964,48" fill={color} />

    {/* Bottom-left corner brackets */}
    <path d="M20 650 L20 680 L50 680" stroke={color} strokeWidth="4" strokeLinecap="square" />
    <polygon points="36,664 48,664 36,652" fill={color} />

    {/* Bottom-right corner brackets */}
    <path d="M980 650 L980 680 L950 680" stroke={color} strokeWidth="4" strokeLinecap="square" />
    <polygon points="964,664 952,664 964,652" fill={color} />

    {/* Midpoint diamond markers */}
    <polygon points="500,32 504,36 500,40 496,36" fill={color} />
    <polygon points="500,660 504,664 500,668 496,664" fill={color} />
    <polygon points="32,350 36,354 40,350 36,346" fill={color} />
    <polygon points="960,350 964,354 968,350 964,346" fill={color} />
  </svg>
);

/**
 * 3. Corporate Crest Border
 * Regal navy and gold corporate frame with layered bevel styling
 */
export const CorporateBorderSvg = ({ className = "size-full text-indigo-900", color = "currentColor" }: SvgProps) => (
  <svg
    viewBox="0 0 1000 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    <rect x="20" y="20" width="960" height="660" stroke={color} strokeWidth="3" />
    <rect x="28" y="28" width="944" height="644" stroke="#F59E0B" strokeWidth="1.5" />
    <rect x="36" y="36" width="928" height="628" stroke={color} strokeWidth="1" strokeDasharray="6 4" />

    {/* Corner Blocks */}
    <rect x="18" y="18" width="30" height="30" fill={color} />
    <rect x="24" y="24" width="18" height="18" fill="#F59E0B" />

    <rect x="952" y="18" width="30" height="30" fill={color} />
    <rect x="958" y="24" width="18" height="18" fill="#F59E0B" />

    <rect x="18" y="652" width="30" height="30" fill={color} />
    <rect x="24" y="658" width="18" height="18" fill="#F59E0B" />

    <rect x="952" y="652" width="30" height="30" fill={color} />
    <rect x="958" y="658" width="18" height="18" fill="#F59E0B" />
  </svg>
);

/**
 * 4. Technical Engineering Border
 * Teal grid calipers and calibrated engineering scale marks
 */
export const TechnicalBorderSvg = ({ className = "size-full text-teal-700", color = "currentColor" }: SvgProps) => (
  <svg
    viewBox="0 0 1000 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    <rect x="25" y="25" width="950" height="650" stroke={color} strokeWidth="2" />
    <rect x="35" y="35" width="930" height="630" stroke={color} strokeWidth="0.75" opacity="0.6" />

    {/* Corner Crosshairs */}
    <g stroke={color} strokeWidth="1.5">
      <line x1="15" y1="25" x2="35" y2="25" />
      <line x1="25" y1="15" x2="25" y2="35" />

      <line x1="965" y1="25" x2="985" y2="25" />
      <line x1="975" y1="15" x2="975" y2="35" />

      <line x1="15" y1="675" x2="35" y2="675" />
      <line x1="25" y1="665" x2="25" y2="685" />

      <line x1="965" y1="675" x2="985" y2="675" />
      <line x1="975" y1="665" x2="975" y2="685" />
    </g>

    {/* Ruler tick marks along header */}
    <path
      d="M200 25 v5 M250 25 v3 M300 25 v5 M350 25 v3 M400 25 v5 M450 25 v3 M500 25 v8 M550 25 v3 M600 25 v5 M650 25 v3 M700 25 v5 M750 25 v3 M800 25 v5"
      stroke={color}
      strokeWidth="1"
      opacity="0.75"
    />
  </svg>
);

/**
 * 5. Gold Star Academic Excellence Medallion
 * Rosette scalloped edge with central gold star and ribbon tails
 */
export const GoldMedallionSvg = ({
  className = "size-20",
  hasRibbon = false,
}: {
  className?: string;
  hasRibbon?: boolean;
}) => (
  <svg
    viewBox={hasRibbon ? "0 0 100 120" : "0 0 100 100"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Ribbon Tails */}
    {hasRibbon && (
      <>
        <path d="M35 70 L25 115 L48 100 L55 115 L50 70 Z" fill="#D97706" />
        <path d="M65 70 L75 115 L52 100 L45 115 L50 70 Z" fill="#B45309" />
      </>
    )}

    {/* Rosette Scalloped Outer Ring matching Image 1 */}
    <g fill="#F59E0B">
      <circle cx="50" cy="50" r="42" />
      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
        <circle
          key={deg}
          cx={50 + 40 * Math.cos((deg * Math.PI) / 180)}
          cy={50 + 40 * Math.sin((deg * Math.PI) / 180)}
          r="5.5"
          fill="#F59E0B"
        />
      ))}
    </g>

    {/* Inner Sunken Disc */}
    <circle cx="50" cy="50" r="35" fill="#D97706" stroke="#FEF3C7" strokeWidth="2" />
    <circle cx="50" cy="50" r="30" fill="url(#goldGradient)" />

    {/* Center 5-point Star matching Image 1 */}
    <path
      d="M50 28 L55.5 40.5 L69 42.5 L58.5 52 L61 65.5 L50 58.5 L39 65.5 L41.5 52 L31 42.5 L44.5 40.5 Z"
      fill="#FFFFFF"
      stroke="#FEF3C7"
      strokeWidth="0.8"
    />

    <defs>
      <linearGradient id="goldGradient" x1="25" y1="25" x2="75" y2="75" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * 6. Official Institutional Verification Seal
 * Circular security stamp with text: "SKILLIANT ACADEMY • OFFICIAL VERIFIED CREDENTIAL •"
 */
export const OfficialSealSvg = ({
  className = "size-24 text-purple-700",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer Toothed Ring */}
    <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="2.5" />
    <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="60" cy="60" r="42" stroke={color} strokeWidth="1.5" />

    {/* Center Emblem Disc */}
    <circle cx="60" cy="60" r="28" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1" />

    {/* Shield & Graduation Cap Motif */}
    <path
      d="M60 44 L72 50 L60 56 L48 50 Z"
      fill={color}
    />
    <path
      d="M52 53.5 V61 C52 65 60 68 60 68 C60 68 68 65 68 61 V53.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="60" cy="74" r="2" fill={color} />

    {/* Circular Text Emulation Track */}
    <path
      id="sealCirclePath"
      d="M60 18 A42 42 0 1 1 59.9 18"
      fill="none"
    />
    <text fill={color} fontSize="6.5" fontWeight="bold" letterSpacing="2.2">
      <textPath href="#sealCirclePath" startOffset="50%" textAnchor="middle">
        SKILLIANT ACADEMY • VERIFIED CREDENTIAL •
      </textPath>
    </text>
  </svg>
);

/**
 * 7. Classical Calligraphic Ornamental Divider
 * Used between Title, Student Name, and Completion Description
 */
export const OrnateDividerSvg = ({ className = "w-48 h-5 text-amber-500", color = "currentColor" }: SvgProps) => (
  <svg viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Left Flourish Wing */}
    <path
      d="M75 12 Q95 8 115 12 T135 12"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="85" cy="12" r="1.2" fill={color} />
    <circle cx="105" cy="12" r="1.8" fill={color} />
    <circle cx="125" cy="12" r="2.2" fill={color} />

    {/* Center Arabesque Clover Emblem matching Image 1 */}
    <g transform="translate(150, 12)" stroke={color} fill="none">
      <circle cx="0" cy="0" r="3" fill={color} />
      {/* 4 Clover / Fleur petals */}
      <path d="M0 -3 C-4 -9 4 -9 0 -3 Z" fill={color} fillOpacity="0.8" />
      <path d="M0 3 C-4 9 4 9 0 3 Z" fill={color} fillOpacity="0.8" />
      <path d="M-3 0 C-9 -4 -9 4 -3 0 Z" fill={color} fillOpacity="0.8" />
      <path d="M3 0 C9 -4 9 4 3 0 Z" fill={color} fillOpacity="0.8" />
      {/* Corner Filigree Loops */}
      <path d="M-5 -5 C-8 -2 -2 -8 -5 -5 Z" strokeWidth="1" />
      <path d="M5 -5 C8 -2 2 -8 5 -5 Z" strokeWidth="1" />
      <path d="M-5 5 C-8 2 -2 8 -5 5 Z" strokeWidth="1" />
      <path d="M5 5 C8 2 2 8 5 5 Z" strokeWidth="1" />
    </g>

    {/* Right Flourish Wing */}
    <path
      d="M165 12 Q185 8 205 12 T225 12"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="175" cy="12" r="2.2" fill={color} />
    <circle cx="195" cy="12" r="1.8" fill={color} />
    <circle cx="215" cy="12" r="1.2" fill={color} />
  </svg>
);

/**
 * 8. Modern Minimalist Diamond Divider
 */
export const ModernDividerSvg = ({ className = "w-40 h-4 text-purple-600", color = "currentColor" }: SvgProps) => (
  <svg viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="10" y1="8" x2="85" y2="8" stroke={color} strokeWidth="1" />
    <polygon points="100,2 106,8 100,14 94,8" fill={color} />
    <circle cx="88" cy="8" r="1.5" fill={color} />
    <circle cx="112" cy="8" r="1.5" fill={color} />
    <line x1="115" y1="8" x2="190" y2="8" stroke={color} strokeWidth="1" />
  </svg>
);

/**
 * 9. Guilloché Anti-Counterfeit Watermark
 * Subtle security lace pattern that renders in the certificate center
 */
export const GuillocheWatermarkSvg = ({
  className = "size-72 text-gray-300/30",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((deg) => (
      <ellipse
        key={deg}
        cx="150"
        cy="150"
        rx="120"
        ry="45"
        stroke={color}
        strokeWidth="0.8"
        transform={`rotate(${deg} 150 150)`}
      />
    ))}
    {[10, 30, 50, 70, 90, 110, 130, 150, 170].map((deg) => (
      <ellipse
        key={deg}
        cx="150"
        cy="150"
        rx="80"
        ry="30"
        stroke={color}
        strokeWidth="0.6"
        transform={`rotate(${deg} 150 150)`}
      />
    ))}
    <circle cx="150" cy="150" r="25" stroke={color} strokeWidth="1" strokeDasharray="4 2" />
  </svg>
);

/**
 * 9b. Academic Crest Shield Watermark
 * Subtle coat-of-arms with laurel wreath, shield, and star
 */
export const AcademicCrestWatermarkSvg = ({
  className = "size-80 text-gray-400",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer Wreath Arcs */}
    <path
      d="M60 210 C40 160 50 110 80 70 C90 90 95 120 90 150 C80 180 60 210 60 210 Z"
      stroke={color}
      strokeWidth="1.2"
      fill={color}
      fillOpacity="0.05"
    />
    <path
      d="M240 210 C260 160 250 110 220 70 C210 90 205 120 210 150 C220 180 240 210 240 210 Z"
      stroke={color}
      strokeWidth="1.2"
      fill={color}
      fillOpacity="0.05"
    />
    {/* Central Heraldic Shield */}
    <path
      d="M150 50 L210 80 V150 C210 200 150 240 150 240 C150 240 90 200 90 150 V80 Z"
      stroke={color}
      strokeWidth="2"
      fill={color}
      fillOpacity="0.04"
    />
    <path
      d="M150 62 L198 87 V145 C198 188 150 222 150 222 C150 222 102 188 102 145 V87 Z"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="4 2"
    />
    {/* Central Emblem: Graduation Cap / Star */}
    <polygon
      points="150,95 158,118 182,118 163,132 170,155 150,141 130,155 137,132 118,118 142,118"
      stroke={color}
      strokeWidth="1.5"
      fill={color}
      fillOpacity="0.1"
    />
    <circle cx="150" cy="180" r="14" stroke={color} strokeWidth="1.2" />
    <path d="M142 180 H158 M150 172 V188" stroke={color} strokeWidth="1.2" />
  </svg>
);

/**
 * 9c. Classical Interlocking Monogram Seal Watermark
 */
export const MonogramWatermarkSvg = ({
  className = "size-80 text-gray-400",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="150" cy="150" r="120" stroke={color} strokeWidth="2" />
    <circle cx="150" cy="150" r="110" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="150" cy="150" r="100" stroke={color} strokeWidth="1.5" />
    {/* Intertwined Stylized 'S' & 'A' */}
    <path
      d="M125 105 C140 90 170 90 180 110 C188 125 170 140 150 150 C130 160 115 175 125 195 C135 215 170 215 185 198"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M110 200 L150 95 L190 200 M124 165 H176"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

/**
 * 10. QR Code SVG Component
 * Generates an authentic, crisp vector QR Code representation
 */
export const QrCodeSvg = ({
  className = "size-14 text-gray-900",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Corner Position Square: Top-Left */}
    <rect x="8" y="8" width="28" height="28" rx="2" stroke={color} strokeWidth="4" />
    <rect x="16" y="16" width="12" height="12" fill={color} />

    {/* Corner Position Square: Top-Right */}
    <rect x="64" y="8" width="28" height="28" rx="2" stroke={color} strokeWidth="4" />
    <rect x="72" y="16" width="12" height="12" fill={color} />

    {/* Corner Position Square: Bottom-Left */}
    <rect x="8" y="64" width="28" height="28" rx="2" stroke={color} strokeWidth="4" />
    <rect x="16" y="72" width="12" height="12" fill={color} />

    {/* Timing & Data Matrix Blocks */}
    <rect x="42" y="12" width="6" height="6" fill={color} />
    <rect x="52" y="12" width="6" height="6" fill={color} />
    <rect x="42" y="24" width="6" height="6" fill={color} />
    <rect x="42" y="36" width="6" height="6" fill={color} />
    <rect x="12" y="42" width="6" height="6" fill={color} />
    <rect x="24" y="42" width="6" height="6" fill={color} />
    <rect x="36" y="42" width="6" height="6" fill={color} />
    <rect x="48" y="48" width="8" height="8" fill={color} />
    <rect x="60" y="42" width="6" height="6" fill={color} />
    <rect x="72" y="42" width="6" height="6" fill={color} />
    <rect x="84" y="42" width="6" height="6" fill={color} />
    <rect x="60" y="54" width="6" height="6" fill={color} />
    <rect x="76" y="54" width="6" height="6" fill={color} />
    <rect x="42" y="64" width="6" height="6" fill={color} />
    <rect x="52" y="72" width="6" height="6" fill={color} />
    <rect x="42" y="80" width="6" height="6" fill={color} />
    <rect x="64" y="68" width="6" height="6" fill={color} />
    <rect x="76" y="68" width="6" height="6" fill={color} />
    <rect x="84" y="76" width="6" height="6" fill={color} />
    <rect x="68" y="84" width="6" height="6" fill={color} />
    <rect x="80" y="84" width="8" height="8" fill={color} />
  </svg>
);

/**
 * 11. Realistic Authorized Cursive Signature
 * Smooth cursive pen strokes for Dr. Hesbon Ombati
 */
export const AuthorizedSignatureSvg = ({
  className = "w-36 h-12 text-gray-800",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Initial D loop and stem */}
    <path
      d="M18 42 C16 30 18 12 24 10 C28 9 32 15 30 25 C28 35 20 48 15 48 C12 48 10 44 14 36"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="36" cy="42" r="1.5" fill={color} />

    {/* Capital H flourished swoop */}
    <path
      d="M48 12 C44 26 40 44 43 46 C45 47 48 38 52 28 C55 20 60 16 63 18 C65 20 62 34 58 48 C55 52 50 51 55 45 L78 30 C72 38 68 45 74 46 C80 47 88 38 92 34"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* "esbon" cursive connections */}
    <path
      d="M93 36 C95 32 100 32 99 37 C98 42 94 44 98 44 C102 44 106 36 108 34 C107 38 106 43 111 44 C116 45 120 38 122 35 C124 32 127 34 126 38 C125 43 121 46 128 44 C133 42 136 34 139 34 C138 38 138 43 143 43 C148 43 154 36 156 32"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Final flourishing underline underline and tail */}
    <path
      d="M30 52 C65 48 115 50 178 38 C185 36 190 34 186 38 C180 44 160 52 140 54"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 11b. Realistic Cursive Signature (Andrew Childress style matching Image 1)
 */
export const CursiveSignatureAndrewSvg = ({
  className = "w-36 h-12 text-gray-800",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Initial tall A stroke & loop */}
    <path
      d="M22 46 C20 32 24 16 32 12 C36 10 40 16 36 28 C32 40 24 50 18 48 C14 47 16 38 24 30 L44 32"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* "ndrew" cursive stroke */}
    <path
      d="M44 34 C46 28 50 28 50 34 C50 40 48 44 54 44 C58 44 60 36 62 30 C64 36 68 44 74 42 C78 40 80 34 84 34 C88 34 88 42 94 40 C98 38 102 32 108 30"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Second word initial C loop */}
    <path
      d="M106 20 C108 14 116 12 118 16 C120 22 114 36 110 44 C108 48 112 50 118 46 L134 36"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Trailing cursive line */}
    <path
      d="M134 36 C138 34 142 38 146 36 C150 34 154 36 160 34 L170 32"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 11c. Realistic Cursive Signature (Robert Gates style matching Image 1)
 */
export const CursiveSignatureRobertSvg = ({
  className = "w-36 h-12 text-gray-800",
  color = "currentColor",
}: SvgProps) => (
  <svg viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Bold Tall 'R' Stem and upper loop */}
    <path
      d="M18 14 C18 24 16 38 15 48 M16 16 C22 12 34 12 36 18 C38 24 28 28 17 28 C26 30 32 38 36 48"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* "obert" rapid connected cursive letters */}
    <path
      d="M38 38 C42 34 46 34 46 40 C46 44 42 46 46 46 C50 46 54 38 56 36 C58 40 60 46 64 44 C68 42 70 34 74 34 M72 26 V44"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* "Gates" / Second Word Capital G flourish with deep drop */}
    <path
      d="M86 28 C88 20 94 14 100 16 C106 18 104 28 98 38 C94 44 92 54 96 56 C100 58 106 50 110 40 L126 34"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* "ates" ending flourish and t-cross */}
    <path
      d="M124 38 C128 34 134 34 136 40 C138 44 142 36 146 32 C148 40 152 44 158 42 M144 26 V44 M138 32 H154"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M156 42 C162 40 168 36 174 32"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 12. Creative Vanguard / Geometric Wave Border (Inspired by modern LMS design)
 * Graphic curved color blocks on left flank with clean outer border
 */
export const CreativeWaveBorderSvg = ({
  className = "size-full",
}: SvgProps) => (
  <svg
    viewBox="0 0 1000 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    {/* Clean outer line */}
    <rect x="20" y="20" width="960" height="660" rx="6" stroke="#CBD5E1" strokeWidth="2" />
    <rect x="30" y="30" width="940" height="640" rx="4" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

    {/* Graphic Side Flank (Tutor LMS style) */}
    <g opacity="0.95">
      {/* Top curved block - Teal */}
      <path d="M20 20 H110 C110 90 60 140 20 140 Z" fill="#0D9488" />
      {/* Upper-mid wave - Amber/Orange */}
      <path d="M20 140 C60 140 110 190 110 260 C60 260 20 230 20 210 Z" fill="#F97316" />
      {/* Center geometric block - Navy */}
      <path d="M20 260 C80 260 120 310 120 380 H20 Z" fill="#1E3A8A" />
      {/* Lower wave - Purple */}
      <path d="M20 380 C70 380 110 430 110 500 C50 500 20 470 20 440 Z" fill="#7D52F4" />
      {/* Bottom curved block - Coral */}
      <path d="M20 500 C80 500 110 560 110 680 H20 Z" fill="#FB923C" />
    </g>

    {/* Top Right subtle accent arc */}
    <path d="M980 20 V100 C920 100 880 60 880 20 Z" fill="#7D52F4" fillOpacity="0.15" />
    {/* Bottom Right subtle accent arc */}
    <path d="M980 680 V600 C920 600 880 640 880 680 Z" fill="#0D9488" fillOpacity="0.15" />
  </svg>
);

/**
 * 13. Minimalist Diploma Border
 * Modern double-hairline frame with elegant corner rosettes
 */
export const MinimalistBorderSvg = ({
  className = "size-full text-slate-700",
  color = "currentColor",
}: SvgProps) => (
  <svg
    viewBox="0 0 1000 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="none"
  >
    <rect x="28" y="28" width="944" height="644" stroke={color} strokeWidth="1.5" />
    <rect x="36" y="36" width="928" height="628" stroke={color} strokeWidth="0.75" opacity="0.6" />

    {/* Corner Rosettes */}
    <g fill={color}>
      <circle cx="28" cy="28" r="4" />
      <circle cx="972" cy="28" r="4" />
      <circle cx="28" cy="672" r="4" />
      <circle cx="972" cy="672" r="4" />
    </g>

    {/* Header ribbon badge on left */}
    <path d="M70 28 V120 L95 100 L120 120 V28 Z" fill="#7D52F4" fillOpacity="0.85" />
    <polygon points="95,45 100,58 114,60 104,70 106,84 95,77 84,84 86,70 76,60 90,58" fill="#FFFFFF" />
  </svg>
);

