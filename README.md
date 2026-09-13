# Skilliant — Adaptive, Outcome-Driven LMS & Competency Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.7-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-purple?style=flat-square)](#)

**Skilliant** is an enterprise-ready, outcome-driven Learning Management System (LMS) and competency platform built for modern corporate training, technical academies, and institutional cohorts. Unlike generic consumer marketplaces or rigid collegiate platforms, Skilliant delivers practical, milestone-driven coursework backed by rigorous verification, B2B organizational governance, and university-style specialization degrees.

---

## 🏛️ Platform Architecture: Two-Shell Unified Model

Skilliant is architected around a consolidated, role-gated **Two-Shell UI System**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SKILLIANT PLATFORM ARCHITECTURE                                   │
├───────────────────────────────────────────────────────────────────┬─────────────────────────────────────┤
│                 SHELL 1: LEARNER & COMPANY PORTAL                 │        SHELL 2: STUDIO PORTAL       │
│                     (/dashboard/* & /learn/*)                     │              (/admin/*)             │
├─────────────────────────────────┬─────────────────────────────────┼─────────────────────────────────────┤
│       STUDENT EXPERIENCE        │      COMPANY ADMINISTRATOR      │     INSTRUCTOR & SUPER ADMIN        │
├─────────────────────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ • Course Player & Lessons       │ • Corporate Team Roster         │ • 3-Step Course Curriculum Builder  │
│ • Interactive Quizzes & Drills  │ • Voucher Distribution Engine   │ • Bundles & Multi-Course Tracks     │
│ • Capstone & File Assignments   │ • Cohort Compliance Analytics   │ • Quiz Attempts Evaluation Hub      │
│ • Gradebook & Practical Scores  │ • Seat Utilization & Invoicing  │ • Student Q&A Discussion Inbox      │
│ • Live Classes (Zoom / Meet)    │ • Departmental Training Tracks  │ • Course Categories Taxonomy        │
│ • Verified Blockchain Certs     │ • Employee Progress Reporting   │ • Institutional Vouchers Minting    │
│ • Gamified Awards & Milestones  │ • Contract Renewal Management   │ • Promotional Coupons & Discounts   │
│                                 │                                 │ • B2B Tenant Organization Provision │
│                                 │                                 │ • Payment Ledger & Wire Clearance   │
│                                 │                                 │ • Certificate Governance (Card/Grid)│
│                                 │                                 │ • Platform Settings & Branding      │
└─────────────────────────────────┴─────────────────────────────────┴─────────────────────────────────────┘
```

---

## ⚡ Core Features & Capabilities

### 1. Studio & Admin Governance Portal (`/admin/*`)
- **Executive Overview (`/admin`)**: Real-time earnings KPIs, enrollment volume, course completion rate horizontal distribution bar, and live studio evaluation queues.
- **Course Authoring Suite (`/admin/courses/new`)**: 
  - **Step 1 (Basics)**: Title, slug permalinks, difficulty tiers, featured image uploads, intro video embed, and university tuition models (`Free`, `One-Time Tuition`, `Course Installments`).
  - **Step 2 (Curriculum)**: Multi-tier topic hierarchy with drag ordering, collapse/expand all, duration counters, free preview badges, and inline additions (`+ Add Lesson`, `+ Add Quiz`, `+ Add Assignment`).
  - **Step 3 (Additional)**: "What Will I Learn?" dynamic builder, Target Audience persona mapping, prerequisite courses, downloadable resources, certificate template selector, and live Zoom / Google Meet scheduling.
  - **Embedded Editors**: Full lesson body instruction editor and quiz assessment builder (passing grade thresholds, randomized questions, answer explanations, time limits, and single-question vs. full-page layouts).
- **Bundles & Specializations (`/admin/bundles`)**: Combine multiple catalog courses into structured, ordered career specializations (e.g. *UX Design Specialization*, *Heavy Machinery Operator Specialization*) with automatic savings calculation and specialized track certificates.
- **Course Certificates Hub (`/admin/certificates`)**:
  - Dual **Card View** (miniature parchment renders with template styling) and **Table View** (data grid with master select checkboxes and bulk actions).
  - Configurable visual templates: `Classic Border`, `Modern Geometric`, `Technical Excellence`, and `Corporate Crest`.
  - High-resolution interactive live preview modal with blockchain credential IDs, signatory authority, digital seal, and print/PDF export simulations.
- **Quiz Attempts Hub (`/admin/quiz-attempts`)**: Centralized submission grading queue with detailed drill breakdowns and instant "Grant Retake" reset engine.
- **Student Q&A Inbox (`/admin/q-and-a`)**: Instructor inbox for lesson-level student questions with verified reply dispatch and thread resolution status.
- **Student Roster & Profiles (`/admin/students`)**: Searchable directory of all registered trainees, company affiliations, enrolled courses, and slide-over transcripts.
- **Financial Ledger & Payments (`/admin/payments`)**: Invoiced revenue tracking across Stripe, corporate bank wire transfers, and sponsored vouchers with itemized receipt viewing and wire clearance actions.
- **Institutional Vouchers (`/admin/vouchers`)**: Batch generation of 100% sponsored training vouchers for enterprise cohorts with custom prefixes, expiration dates, and CSV export.
- **Coupons & Promotional Pricing (`/admin/coupons`)**: Percentage or fixed discount campaigns with course targeting, max usage limits, expiration dates, and instant status toggling.
- **B2B Organization Provisioning (`/admin/organizations`)**: Enterprise client onboarding, contracted seat capacities, assigned catalogs, and renewal management.
- **Platform Governance Settings (`/admin/settings`)**: Branding, maintenance mode, pass grade enforcement, session timeouts, payment APIs, and media bucket storage configurations.

### 2. Learner Experience & Player (`/learn/*` & `/dashboard/*`)
- **Distraction-Free Course Player**: Seamless navigation between video drills, written guides, interactive quizzes, capstone assignments, and resources.
- **Student Gradebook & Milestones**: Live tracking of practical drill scores, passing thresholds, quiz attempts, and capstone grades.
- **Certificates & Awards**: Verified digital completion credentials unlocked upon 100% course completion and assessment satisfaction.
- **Live Class Integration**: Direct connectivity to scheduled Zoom meetings and Google Meet webinars.

### 3. B2B Enterprise Client Portal (`/dashboard/company/*`)
- **Team Management**: Provision seats, invite team members, and assign role permissions.
- **Voucher Distribution**: Allocate batch codes directly to department trainees.
- **Cohort Reports**: Track employee completion percentages, overdue drills, and certified operator lists.

### 4. Public Catalog & E-Commerce (`/`, `/courses`, `/cart`, `/checkout`)
- **Modern Responsive Storefront**: Dynamic hero, categorized course catalog, keyword search, price & difficulty filters.
- **Course Detail Pages**: Comprehensive syllabus breakdown, instructor profile, requirements, and tuition options.
- **Cart & Checkout**: Multi-course basket, discount coupon application, institutional voucher redemption, and Stripe checkout flow.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.2.7](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19.2.7](https://react.dev/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & Carousel**: [Framer Motion](https://www.framer.com/motion/), [Swiper](https://swiperjs.com/)
- **Icons**: Custom SVG Icon Suite & Lucide-compatible icons
- **State & Forms**: [React Hook Form](https://react-hook-form.com/), React State

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18.0 or later
- npm or yarn or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hesbon-design/Skilliant-Lms.git
   cd Skilliant-Lms
   ```

2. **Check out the active development branch**:
   ```bash
   git checkout dev
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or port 3001 if port 3000 is occupied) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Run the production server**:
   ```bash
   npm run start
   ```

---

## 🎨 Design System & Color Palette

Skilliant uses an authoritative **Signature Purple** brand palette, delivering a clean, modern, and accessible visual hierarchy:

| Color Token | Hex Code | Purpose |
|---|---|---|
| **Brand Primary** | `#7D52F4` | Primary buttons, active tabs, brand accents |
| **Brand Hover** | `#693EE0` | Button hover states, emphasized highlights |
| **Purple Tint** | `#F5F3FF` (`purple-50`) | Card backgrounds, active menu item fills |
| **Purple Border** | `#E9D5FF` (`purple-200`) | Accent borders, badges, subtle dividers |
| **Success Emerald** | `#059669` / `#10B981` | Completed statuses, verified credentials |
| **Warning Amber** | `#D97706` / `#F59E0B` | Pending reviews, draft badges, upcoming deadlines |
| **Dark Neutral** | `#111827` (`gray-900`) | Primary headings and high-contrast typography |
| **Muted Neutral** | `#6B7280` (`gray-500`) | Secondary metadata, dates, table sub-labels |
| **Canvas Background**| `#F8FAFC` | App shell backdrop |

### UI Design Rules
- **Zero Button Wrapping**: All buttons and actions enforce `whitespace-nowrap shrink-0` to guarantee single-line clarity across all viewports.
- **Clean Page Headers**: Inner administrative titles use bold, uncluttered `<h1>` headings with zero redundant supporting descriptions.
- **Table Responsiveness**: Every data table is wrapped in an `overflow-x-auto [scrollbar-width:thin]` container with explicit `min-w-[800px..1000px]` constraints.
- **Zero AI Fluff**: No artificial gimmicks, sparkles, or fake badges; all controls serve practical operational and learning workflows.

---

## 🌿 Git Branching & Contribution Workflow

This project follows a strict **Dev / Main** staging workflow:

1. **`dev` Branch**: All active feature engineering, UI polish, bug fixes, and testing occur exclusively on `dev`.
2. **`main` Branch**: Reserved strictly for stable, production-ready releases.
3. **Workflow Rules**:
   - Never commit or push directly to `main`.
   - Make all changes and verify builds on `dev`.
   - Push to `origin dev` for team review.
   - Handoff to repository administrators to review pull requests and merge `dev` into `main` for deployment.

---

## 📄 License

Proprietary — All rights reserved © 2026 Skilliant Platform.
