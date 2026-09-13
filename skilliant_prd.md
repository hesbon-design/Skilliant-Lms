# Product Requirements Document (PRD): Skilliant Custom Training & Competency Platform

**Document Version:** 2.3.0  
**Status:** Approved Specification  
**Platform Name:** Skilliant  
**Product Vision:** Adaptive, Outcome-Driven Custom Training for Any Organization  
**UI Architectural Principle:** Two-Shell Unified UI with Role-Based Access Gating  
**Reference Benchmark:** [lifterlms.md](file:///c:/MY%20FILES/Skilliant/lifterlms.md)

---

## 1. Executive Summary & Market Positioning

### 1.1 The Market Gap: Between Coursera and Udemy
Modern online learning platforms fall into two flawed extremes:
- **The "Coursera" Flaw:** Overly academic, heavy semester models, rigid collegiate grading (GPA, transcripts), theoretical lectures, and high-friction university bureaucracy. It is not designed for fast, practical, custom organizational training.
- **The "Udemy" Flaw:** A passive, uncurated consumer marketplace with low completion rates, no organizational governance, no rigorous practical competency verification, and zero team accountability.

### 1.2 The Skilliant Positioning: The Outcome-Driven Custom Course Platform
**Skilliant** occupies the high-impact middle ground:
- **Adaptable to Any Organization:** Whether a corporate enterprise training account managers, a technical agency onboarding developers, an aviation facility certifying maintenance crews, a logistics fleet training commercial drivers, or a specialized training academy delivering private bootcamps.
- **Custom Outcome-Driven Courses:** Focused on *doing* and *mastering*, not just watching videos. Every course has tangible competencies, practical drills, checklists, and verified real-world milestones.
- **Competency over Academic GPA:** Replaces collegiate GPA and arbitrary letter grades with real-world **Competency Scores**, **Safety & Compliance Ratings**, and **Logged Practical Hours**.
- **Organizational B2B Governance:** Turnkey seat allocation, team vouchers, and real-time manager compliance reporting.

---

## 2. Core UI Architecture: The Two-Shell Unified Model

A critical architectural mandate for Skilliant is **UI Consolidation**. We **do not create separate, siloed applications or fragmented screens for different user roles**. 

Instead, Skilliant operates on **Two Unified UI Shells** with dynamic role-based access gating:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                SKILLIANT PLATFORM ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────┬───────────────────────────────┤
│                SHELL 1: LEARNER & COMPANY PORTAL            │     SHELL 2: STUDIO PORTAL    │
│                        (/dashboard/*)                       │           (/admin/*)          │
├──────────────────────────────┬──────────────────────────────┼───────────────┬───────────────┤
│           STUDENT            │        COMPANY ADMIN         │  INSTRUCTOR   │  SUPER ADMIN  │
│          (Learner)           │     (Company/Org Leader)     │   (Author)    │(Platform Owner│
├──────────────────────────────┼──────────────────────────────┼───────────────┼───────────────┤
│ • My Enrolled Courses        │ • All Student Features       │ • Course      │ • All Author  │
│ • Lesson Player & Focus Mode │   [PLUS Elevated Controls]:  │   Builder     │   Features    │
│ • Quizzes & Timed Drills     │ • Company Info & Name        │ • Question    │   [PLUS]:     │
│ • Assignments & Uploads      │ • Assigned Courses/Bundles   │   Banks       │ • All Orgs    │
│ • Competency Gradebook       │ • Seat Capacity (Used/Total) │ • Grading     │ • Platform    │
│ • Certificates & Badges      │ • Invite Students (+Course)  │   Queue       │   Settings    │
│ • Live Classes & Events      │ • Voucher Distribution Hub   │ • Live Class  │ • Payment     │
│ • Resources & Discussions    │ • Member Roster & Reports    │   Hosting     │   Gateways    │
└──────────────────────────────┴──────────────────────────────┴───────────────┴───────────────┘
```

### 2.1 Shell 1: Learner & Company Portal (`/dashboard/*`)
- **Shared by:** **Students** and **Company Admins (Company/Institution Leaders)**.
- **Terminology Rule:** Designated as **"Company"** (not "Group", which sounds informal/social).
- **Common Layout:** Single sidebar, responsive header, consistent purple branding, unified navigation.
- **Dynamic Access Level:**
  - **Student View:** Clean, focused learner experience. Shows enrolled courses, quiz attempts, assignments, practical records, certificates, and community resources.
  - **Company Admin View:** Exactly the same student interface, with **elevated company management modules dynamically unlocked in the sidebar and dashboard overview**:
    - **Company Identity & Capacity:** Shows Company Name, active memberships, assigned courses/bundles, and seat capacity limits (e.g. 18 / 25 seats utilized).
    - **Invite Students Flow:** Direct modal to add students by entering their email, **selecting the designated course or bundle/track** from the company's purchased allocation, and dispatching an email invitation to join the company.
    - **Voucher Distribution Hub:** View and distribute generated voucher codes (associated with specific courses or multi-course bundles/tracks).
    - **Team Compliance & Progress Reports:** Real-time completion rates, drill scores, and exportable audit reports.

### 2.2 Shell 2: Management & Authoring Studio (`/admin/*`)
- **Shared by:** **Instructors** and **Super Admins**.
- **Common Layout:** Professional authoring and operations workspace.
- **Dynamic Access Level:**
  - **Instructor View:** Author and edit assigned courses, build quizzes, access question banks, grade practical submissions in the review queue, view student progress for their courses, and host live sessions.
  - **Super Admin View:** Exactly the same instructor studio, with **platform-wide governance unlocked in the navigation**:
    - `All Organizations & Companies` (manage tenant accounts, assign seat caps).
    - `System Users & Roles` (elevate users, manage instructors).
    - `Global Access Plans & Billing` (Stripe/payment gateway setups, subscriptions, voucher pools).
    - `Platform Settings` (whitelabeling, domain configuration, email templates).

---

## 3. Feature Breakdown & Functional Requirements

### Module 1: Course Delivery & Interactive Learning Engine

#### 1.1 Multi-Modal Lesson Player
- **Extracted from LifterLMS:** *Multimedia Lessons*, *Focus Mode*, *Lesson Downloads*, *Note Taking*.
- **Requirements:**
  - Accommodates video (MP4, Vimeo, YouTube, HLS), audio guides, downloadable worksheets, interactive checklists, code snippets, and markdown.
  - **Focus Mode:** Full-screen HUD toggle `[ |< ]` that collapses the sidebar for distraction-free learning.
  - **Integrated Note-Taking:** Trainees take timestamped notes in the player that save automatically to their profile and export to PDF.
  - **Downloadable Resource Repository:** Direct access to cheat sheets, templates, procedure manuals, and offline guides.

#### 1.2 Sequential Pacing & Mastery Gating
- **Extracted from LifterLMS:** *Drip Content*, *Prerequisites*, *Course Tracks*.
- **Requirements:**
  - **Drip Scheduling:** Release lessons by elapsed days, calendar dates, or upon passing prerequisite milestones.
  - **Strict Prerequisites:** Prevent access to advanced modules until core foundational checks or prerequisite courses are completed.
  - **Trade & Skill Tracks:** Bundle multiple related courses into cohesive certification programs (e.g. *Enterprise Cybersecurity Track*, *Industrial Machine Operator Track*).

---

### Module 2: Outcome-Driven Assessments & Drills

#### 2.1 Comprehensive Testing & Quiz Engine
- **Extracted from LifterLMS:** *Quizzes*, *LifterLMS Advanced Quizzes*, *Question Banks*, *Quiz Timer*, *Testing Tools*.
- **Requirements:**
  - **Question Types:** Multiple Choice, Multi-Select, True/False, Fill-in-the-Blank, Sequencing/Ordering, and Image Hotspots.
  - **Question Banks:** Create categorized pools of questions. Quizzes pull randomized sets per attempt to eliminate answer sharing and rote cheating.
  - **Stress Timers:** Configurable timers per quiz or per question to test rapid decision-making in high-stakes scenarios.
  - **Remediation & Retake Policies:** Enforce attempt caps and mandatory cooldown periods (e.g., 24 hours) between failed attempts, with instructor override capabilities.

#### 2.2 Actionable Assignments & Practical Proof
- **Extracted from LifterLMS:** *LifterLMS Assignments*, *Form Integrations*.
- **Requirements:**
  - Trainees submit real-world artifacts: video demonstrations, inspection logs, written case studies, design files, or spreadsheets.
  - Drag-and-drop file uploader with status badges (`Submitted`, `Under Review`, `Approved`, `Needs Revision`).
  - Evaluators review submissions in the unified Studio with standardized rubrics and inline feedback.

---

### Module 3: Practical Competency, Hours & Performance Record

#### 3.1 Non-GPA Competency Framework (Replacing Academic GPA)
- **Extracted from LifterLMS:** *Gradebook*, *LifterLMS Continuing Education*.
- **Requirements:**
  - Eliminates collegiate GPA (4.0 scales) and letter grades (A, B, C) that are meaningless in organizational and professional training.
  - **Practical Competency Rating:** Real percentage score reflecting mastery against an organizational benchmark (e.g. ≥85% required for field clearance).
  - **Safety & Compliance Score:** Tracks zero-fault safety adherence and procedural accuracy.
  - **Practical Hours Logbook:** Tracks logged practical hours, simulator drills, workshop hours, or client project hours.
  - **Status Categories:**
    - `✓ Certified Competent`: Meets or exceeds mastery standard.
    - `⚡ In Training`: Active progression, non-critical drills pending.
    - `⚠ Remediation Required`: Failed key drill; practical retake necessary.

---

### Module 4: Digital Credentials, Badges & Verifiable Portability

#### 4.1 Tamper-Proof Certificates & Licenses
- **Extracted from LifterLMS:** *Certificates*, *LifterLMS PDFs*, *Graphics Pack*.
- **Requirements:**
  - Automated certificate issuance upon 100% curriculum and competency completion.
  - **Public Verification URL & QR Code:** Unique credential ID (e.g. `SKL-ENG-94819`) verifiable by any third party, employer, or client.
  - **Print & High-Res PDF:** Interactive on-screen preview with one-click print and 300 DPI PDF download.

#### 4.2 Achievement Badges & Gamification
- **Extracted from LifterLMS:** *Achievement Badges*.
- **Requirements:**
  - Visual badges unlocked for milestones (e.g. *First Module Finished*, *7-Day Consistency Streak*, *Zero-Fault Inspection*, *Top Evaluator Honor*).
  - Progress meters showing requirements for upcoming locked badges.

---

### Module 5: Events, Live Sessions & Coaching

#### 5.1 Live Classes & Workshops
- **Extracted from LifterLMS:** *Events*, *LifterLMS Events*.
- **Requirements:**
  - Integrated scheduling for live webinars, group debriefs, and in-person workshop sessions.
  - Native launch buttons for Zoom, Microsoft Teams, and Google Meet.
  - Automated calendar exports (`.ics` / Google Calendar).
  - Embedded recording library for post-session replay and review.

#### 5.2 Private Coaching & 1-on-1 Feedback
- **Extracted from LifterLMS:** *Private Coaching Upsells*, *LifterLMS Private Areas*.
- **Requirements:**
  - Dedicated private feedback channel between instructors and trainees.
  - File attachment support for project critiques, screen recordings, or audit feedback.

#### 5.3 Announcements & Discussions
- **Extracted from LifterLMS:** *Personalized Email*, *Email Notifications*.
- **Requirements:**
  - Broadcast announcements with email dispatches to enrolled trainees.
  - Searchable course Q&A forums with verified instructor responses.

---

### Module 6: Company Management, Voucher Engine & Member Invitations (Company Admin)

#### 6.1 Unified Company Admin Experience (Inside Shell 1)
- **Extracted from LifterLMS:** *Bulk Sales*, *LifterLMS Groups*, *Course Cohorts*, *LifterLMS Custom Fields*, *company/org account voucher codes*.
- **Naming Convention:** Explicitly designated as **"Company"** (avoiding the informal term "Group").
- **Core Requirements & Capabilities:**
  - **Company Identity & Assigned Catalog:**
    - Company Admins see their **Company Name** and the specific **Courses, Bundles, or Memberships** that the platform/Super Admin has assigned to their company based on what the institution purchased.
    - **Capacity & Seat Tracking:** Real-time seat allocation metrics set by the platform admin (e.g., 50 total seats purchased; 32 assigned, 18 remaining).
  - **Student Addition & Invitation Flow:**
    - Company Admin enters the student's **Email Address**.
    - Company Admin **must select the specific Course or Bundle/Learning Track** from the company's assigned catalog.
    - The system dispatches a branded invitation email to the student with a secure token to join that specific company and automatically enroll in the selected training program.
  - **Voucher Lifecycle (Courses & Bundles):**
    - Platform/Super Admin generates batch voucher codes tied to specific courses or multi-course bundles/learning tracks based on the company's contract.
    - Vouchers are delivered directly to the Company Admin within their `/dashboard` management view.
    - The Company Admin can copy, export, and distribute these vouchers to trainees.
    - Vouchers unlock a single course or an entire multi-course learning track when redeemed by the trainee.
  - **Team Roster & Compliance Matrix:**
    - Master list of all company members, their active courses, completion percentages, practical competency scores, and safety compliance status.
    - One-click CSV and PDF audit export for company leadership and regulatory compliance.

---

### Module 7: Commerce, Cart, Checkout & Access Plans

#### 7.1 Cart & Dedicated Checkout Engine
- **Extracted from LifterLMS:** *Checkout*, *Cart Abandonment Recovery*, *LifterLMS Cart Abandonment Recovery*, *Coupons*, *Gift System*, *Preselling*, *Require Terms*.
- **Core Requirements & Architecture:**
  - **Dedicated Cart Experience (`/cart`):**
    - Trainees can add individual courses, multi-course bundles, or organization membership passes.
    - Displays line items, course thumbnails, regular prices, and order subtotal.
  - **Single-Screen Conversion Checkout (`/checkout`):**
    - Account creation / login fields.
    - Mandatory Terms of Service and Liability Waiver acceptance checkboxes.
    - **Voucher Redemption Field:** Dedicated voucher input for trainees who received a voucher code from their Company Admin. Applying a valid voucher code instantly unlocks the associated course or multi-course learning track at $0 balance.
    - **Coupon Discount Field:** Promotional coupon code field supporting percentage discounts (e.g. 20% off) or fixed amount reductions (e.g. $50 off).
  - **Flexible Payment Methods (Including Manual / Pay Later):**
    - **Credit / Debit Card (Stripe / Electronic Gateways).**
    - **Manual / Pay Later Option:**
      - Available during checkout for institutional registrations, employer-sponsored learners, or invoiced accounts.
      - When selected, the trainee/company completes registration without immediate card entry.
      - The order is logged in `Pending Payment / Invoice Due` status.
      - **Super Admin Notification:** The platform admin receives an immediate notification (email and dashboard alert): *"New Registration: [Name] ([Email]) registered for [Course/Bundle] via Manual / Pay Later"*.
      - This notification initiates the administrative payment workflow (issuing purchase order/invoice, confirming bank wire/offline transfer, and manual activation).

#### 7.2 Flexible Pricing Models & Access Plans
- **Extracted from LifterLMS:** *Credit Card Payments*, *One-Time Payments*, *Recurring Payments*, *Payment Plans*, *Unlimited Pricing Models*, *Subscriptions*, *Course Bundles*, *Free Courses*, *Offline Sales*.
- **Requirements:**
  - **One-Time Purchase:** Single fee for lifetime or term-limited access.
  - **Subscriptions & Memberships:** Monthly or annual recurring access for ongoing training libraries.
  - **Payment Plans:** Split course tuition into 3 or 4 monthly installments.
  - **Course Bundles:** Grouping complementary courses into discounted single-SKU bundles or career tracks.
  - **Cart Abandonment Recovery:** Automated email follow-up sequence to recover drop-offs.

---

### Module 8: Studio Authoring & Platform Administration (Instructor / Super Admin)

#### 8.1 Unified Studio Experience (Inside Shell 2)
- **Extracted from LifterLMS:** *Course Builder*, *Multi Instructor*, *Instructional Design*, *Course Import*, *Authoring Tools*, *Course Protection*, *Detailed Reporting*, *Student Management*, *Access Management*, *LMS Roles*, *Security*, *LifterLMS Private Site*.
- **Requirements:**
  - Instructors and Super Admins share the exact same `/admin` studio layout:
    - **Intuitive Course Builder:** Drag-and-drop hierarchy (Course ➔ Topic/Module ➔ Lesson) with lesson content editor.
    - **Centralized Evaluation Queue:** Single inbox displaying all student quiz attempts, assignments, and practical submissions awaiting review.
    - **Student Management:** View student profiles, grant extra quiz attempts, manually enroll or unenroll trainees.
    - **Elevated Super Admin Controls (Conditionally Unlocked):**
      - Platform-wide Organization & Company Management.
      - User role elevation and instructor assignments.
      - Global Payment Gateways (Stripe API, currency, tax rules).
      - Private Site / Intranet Lockdown Mode (whitelabeling platform for enterprise-only access).
      - Audit logs and platform-wide revenue/enrollment reporting.

#### 8.2 Architectural Rationalization: Built-in Code Defaults vs. Super Admin Settings

A critical architectural distinction between legacy WordPress LMS plugins (LifterLMS/TutorLMS) and Skilliant's modern full-stack architecture (Next.js/React/Tailwind) is eliminating database configuration bloat. Legacy CMS plugins turn every routing slug, theme layout toggle, HTML element, and standard convention into a confusing administrative setting. Skilliant builds clean, modern conventions directly into code while concentrating necessary operational governance inside the Super Admin Studio (`/admin/settings`).

##### Category A: Built Directly into Code (Eliminated from Admin Settings)
1. **Deterministic Next.js Routing & Native Rich-Text Editing:**
   - Standardized, fixed routes: `/dashboard`, `/courses`, `/cart`, `/checkout`, `/login`, `/sign-up`, `/terms`, `/privacy`, `/learn/[slug]`, and `/admin`.
   - *Eliminated Settings:* Page selectors (Terms page, Privacy page, Dashboard page, Course archive page), permalink prefix pickers (`/courses/` vs `/custom/`), WP-login vs Tutor-login toggles, Gutenberg vs Classic editor switches, and WP-admin bar visibility toggles.
2. **Unified Responsive Design System & Dynamic Layouts:**
   - Strict responsive Tailwind layout conforming 100% to Skilliant brand purple (`#7D52F4`, `#693EE0`, `bg-purple-50`, `border-purple-200`, zero `blue-*`).
   - Dynamic Course Details rendering: Content sections (Benefits, Requirements, Target Audience, Materials Included, Curriculum, Reviews, FAQ) render automatically if the instructor populates them in the Course Builder.
   - *Eliminated Settings:* Theme modes (Kids vs Legacy vs Modern), column-per-row dropdowns (1-4 columns), profile card layouts (minimal, cover, portrait), and 20+ micro-toggles for individual page element visibility.
3. **Native Multi-Source Video Engine:**
   - Unified lesson player natively supports direct HTML5 (MP4/HLS), YouTube, Vimeo, and iframe embeds without requiring admin plugin toggles.
   - *Eliminated Settings:* Checkbox whitelist for video sources; instructors choose the video provider directly when authoring a lesson.
4. **Outcome-Driven Progression & Access Defaults:**
   - Platform defaults strictly to requiring 100% completion of lessons, quizzes, and practical assignments for certification.
   - Instructors and Super Admins inherently have preview/bypass access to all course content without requiring mock enrollment.
   - *Eliminated Settings:* Flexible course completion toggle and course content bypass switches.
5. **Learner-Centric Player HUD:**
   - Lesson Notes are permanently integrated into the player HUD (with PDF export).
   - Autoplay Next Content is a learner-facing toggle directly in the player controls (not a global admin mandate).
6. **Mandatory Account Creation & Direct Enrollment:**
   - Single-step account creation integrated into `/checkout` (no anonymous guest checkout, ensuring every enrollment is linked to a permanent learner transcript).
   - Direct "Enroll Now / Buy Now" button skips the cart straight to `/checkout`.

##### Category B: Super Admin Panel Settings (`/admin/settings`)
Organized into 6 dedicated, clean tabs within the Super Admin portal:

1. **General & Platform Branding:**
   - `Platform Name`: Tenant or platform display name.
   - `Support Email`: Primary customer/learner support contact address.
   - `Brand Logo & Favicon`: Light and Dark mode logo upload, browser favicon.
   - `Maintenance Mode`: Global toggle with customizable maintenance banner text (restricts public and learner access while keeping `/admin` open).

2. **Instructor & Course Governance:**
   - `Require Admin Approval for Course Publishing`: Global toggle. When enabled, instructors submit courses for review; when disabled, trusted instructors can publish directly.
   - `Allow Instructors to Reset Learner Progress`: Toggle permitting instructors to reset a student's attempts or course progress for retakes.
   - `Course Retake Policy`: Global toggle enabling learners to retake completed courses for score improvement.

3. **Payments, Taxes & Billing:**
   - `Currency Selection`: Default platform currency (USD, EUR, GBP, KES, CAD, etc.).
   - `Payment Gateways`:
     - *Stripe Gateway*: Enable/Disable toggle, Publishable Key, Secret Key, and Webhook Signing Secret.
     - *Manual / Pay Later*: Enable/Disable toggle, customizable offline payment instructions (bank wire details, PO submission address).
   - `Tax Configuration`: Enable/Disable tax toggle, standard percentage rate (%), and inclusive/exclusive tax pricing toggle (or Stripe Tax sync).
   - `Coupons & Discounts`: Global toggle to enable/disable promotional coupon fields at `/checkout`.

4. **Security, Session Control & Content Protection:**
   - `Concurrent Session Limiting`: Toggle to enforce 1 active login session per user account, preventing credential sharing among corporate employees.
   - `Email Verification Requirement`: Toggle requiring verified email before unlocking lesson playback.
   - `Proprietary Content Copy Protection`: Toggle disabling text selection, right-click, and developer copy shortcuts on proprietary lesson content.

5. **AI Studio Integration:**
   - `AI Engine Enablement`: Master toggle for platform-wide AI assistance.
   - `AI Provider & API Key`: Selection of provider (Google Gemini API / OpenAI) and secure secret API key input.
   - `AI Capabilities`: Toggles for automated quiz question drafting, lesson summary generation, and learner AI tutor assistant.

6. **Media Storage & Third-Party APIs:**
   - `Cloud Storage Credentials`: Optional AWS S3 / Cloudflare R2 / BunnyCDN bucket configuration for high-throughput enterprise video hosting.
   - `YouTube API Key`: Optional API key for fetching video durations and metadata automatically.

##### Category C: Studio Course & Quiz Builder Configuration (Per-Course & Per-Quiz)
Decisions that belong to the instructor/course author on an individual curriculum level rather than a global site setting:
- **Course Builder (Per-Course):**
  - Content Drip Schedule (immediate, calendar date, or days-after-enrollment).
  - Prerequisites (must complete Course X before starting Course Y).
  - Lesson Discussions / Q&A (enable/disable discussion forum under specific lessons).
  - Free Preview Lessons (mark specific lessons as public previews).
- **Quiz Builder (Per-Quiz):**
  - Time Limit & Expiration Action (`Auto-Submit answers` vs `Auto-Abandon attempt`).
  - Final Grade Calculation Method (`Highest Score`, `Average Score`, `First Attempt`, `Last Attempt`).
  - Answer Privacy (`Hide question answers and details` for high-stakes certification exams).
  - Question Navigation (`Allow Previous Button` vs strict forward-only exam progression).

---

### Module 9: Automated Engagement Engine & Multi-Channel Notification System

#### 9.1 The Event-Driven Engagement Engine (Trigger ➔ Rule ➔ Action)
- **Extracted from LifterLMS:** *LifterLMS Engagements*, *Personalized Email*, *Email Notifications*, *Achievement Badges*, *Certificates*, *Cart Abandonment Recovery*.
- **Architecture & Operational Logic:**
  - An event-driven automation bus that listens for learner actions, instructor feedback, compliance milestones, and B2B activity to automatically trigger targeted real-time actions.
  - **Comprehensive Trigger Catalog:**
    - **Learner Milestones & Practical Drills:**
      - `lesson_completed`: A trainee completes a lesson or watches a required video.
      - `section_completed`: All lessons within a topic/module finished.
      - `course_completed`: 100% curriculum and practical competency verified.
      - `track_completed`: All courses within a multi-course certification bundle completed.
      - `quiz_passed`: Trainee passes a quiz or safety drill (with threshold e.g. ≥85% or 100% on zero-fault safety checks).
      - `quiz_failed`: Trainee scores below passing threshold; triggers automated remediation and retake guidance.
      - `assignment_submitted`: Practical proof uploaded and routed to the studio grading queue.
      - `assignment_evaluated`: Instructor reviews submission (Pass / Needs Revision) and leaves rubric feedback.
    - **Behavioral & Time-Based Triggers:**
      - `user_enrolled`: Learner joins a course or organization.
      - `inactivity_detected`: Learner has not logged in for 3, 7, or 14 days (study streak warning).
      - `live_class_approaching`: Scheduled live session starting in 24 hours and 15 minutes.
      - `compliance_expiring`: Annual safety certification expiring in 30 days.
      - `cart_abandoned`: Learner added courses/bundles to `/cart` but did not complete `/checkout` within 1 hour.
    - **B2B & Administrative Triggers:**
      - `member_invited`: Company Admin dispatches an invitation email with designated course/bundle.
      - `member_joined`: Employee accepts company invitation and creates learner profile.
      - `company_seat_threshold`: Company reaches 80% or 100% of purchased seat capacity.
      - `manual_payment_submitted`: Learner/Company selects "Manual / Pay Later" at checkout.
      - `course_submitted_for_review`: Instructor submits course awaiting Super Admin publishing approval.
  - **Action Dispatchers:**
    - `dispatch_email`: Sends personalized HTML email with dynamic merge variables.
    - `award_badge`: Unlocks a digital achievement badge in the learner profile locker.
    - `issue_certificate`: Generates printable PDF certificate with tamper-proof verification ID and QR code.
    - `push_in_app_notification`: Pushes an alert to the global notification bell HUD and in-app toast.
    - `emit_webhook`: Dispatches webhook payload for third-party CRM, Slack, or enterprise webhooks.

#### 9.2 In-App Notification Center (Shell 1 & Shell 2 HUD)
- **Unified Global Notification Bell:**
  - Located in the persistent top header of both `/dashboard/*` (Learners & Company Admins) and `/admin/*` (Instructors & Super Admins).
  - **Live Unread Counter:** Badge displaying number of unread notifications.
  - **Interactive Flyout Drawer / Dropdown:**
    - Filter tabs: `All`, `Milestones`, `Feedback & Grades`, `Compliance & System`.
    - Notification cards contain: Category icon, title, contextual timestamp (e.g. "10 minutes ago"), unread indicator dot, and direct deep-link action button.
    - **Deep-Link Navigation:** Clicking an assignment notification jumps straight to `/dashboard/assignments`; clicking a new certificate jumps to `/dashboard/certificates`; clicking a quiz failure alert opens the quiz review.
    - Actions: `Mark all as read`, individual item dismiss, and link to full notification history.

#### 9.3 Transactional & Behavioral Dynamic Email Engine
- **Branded HTML & Text Email Templates:**
  - Designed in Skilliant purple (`#7D52F4`, `#693EE0`) with responsive mobile layout.
- **Dynamic Merge Tag Variable System:**
  - `{{learner_name}}`: Trainee's full name.
  - `{{course_title}}`: Name of the course or learning track.
  - `{{lesson_title}}`: Specific lesson completed or unlocked.
  - `{{competency_rating}}`: Practical percentage or drill score.
  - `{{company_name}}`: Associated employer or institution.
  - `{{instructor_name}}`: Assigned instructor or evaluator.
  - `{{certificate_url}}`: Tamper-proof verification URL.
  - `{{action_url}}`: One-click button link directly to the relevant dashboard view.
  - `{{days_inactive}}`: Number of days since last active session.
- **Automated Behavioral Sequences:**
  - *Welcome & Orientation:* Triggered immediately upon account registration or invitation acceptance.
  - *Streak & Re-Engagement:* Triggered after 5 days of inactivity with "Pick up where you left off" lesson link.
  - *Remediation Nudge:* Triggered after a failed drill with encouraging guidance and study pointers.
  - *Cart Abandonment Recovery:* Follow-up email sent 1 hour and 24 hours after checkout abandonment.
  - *Compliance Expiration Warning:* Sent 30 days and 7 days before annual certification renewal deadline.

#### 9.4 Cross-Role Notification Matrix
| Notification Event | Target Recipient(s) | Delivery Channels | Primary Action / Deep-Link |
| :--- | :--- | :--- | :--- |
| Assignment Graded & Feedback Ready | Learner | In-App Bell + Email | View Instructor Evaluation & Rubric |
| Critical Drill / Quiz Failed | Learner & Instructor | In-App Bell + Email | Review Mistakes & Schedule Retake |
| Course Completed & Certified | Learner & Company Admin | In-App Bell + Email | Download PDF Certificate & Credential |
| Inactivity Streak Warning | Learner | Email | Resume Next Lesson Player |
| Live Class Starting in 15 Minutes | Learner & Instructor | In-App Toast + Email | Launch Zoom / Google Meet Session |
| Practical Submission Pending Review | Assigned Instructor | In-App Bell + Email | Open Studio Grading Queue |
| Question Posted in Lesson Discussion | Assigned Instructor | In-App Bell | Reply to Student in Discussion Thread |
| New Member Accepted Company Invite | Company Admin | In-App Bell | View Updated Company Roster |
| Company Seat Capacity Near Limit (≥80%) | Company Admin | In-App Bell + Email | View Vouchers & Upgrade Capacity |
| Employee Overdue on Compliance Deadline | Company Admin & Learner | In-App Bell + Email | View Employee Audit Progress |
| New "Manual / Pay Later" Registration | Super Admin | In-App Bell + Email (High Priority) | Open Pending Orders & Issue Invoice |
| Course Submitted for Publishing Review | Super Admin | In-App Bell + Email | Review Course Content in Studio |

#### 9.5 Granular User Notification Preferences
- In both `/dashboard/settings` and `/admin/settings`, users can configure delivery preferences:
  - **Email Notifications:** Toggle on/off for Course Announcements, Assignment Feedback, Live Event Reminders, and Weekly Performance Digests.
  - **In-App Alerts:** Toggle on/off for non-critical toast popups.
  - **Non-silenceable Mandatory Alerts:** Mandatory compliance warnings, security 2FA alerts, and billing/invoice notices cannot be disabled.

---

## 4. UI Shell Navigation Matrix

### Shell 1: Learner & Company Portal (`/dashboard`)
| Route / View | Accessible by Student | Accessible by Company Admin | Elevated Company Admin Controls |
| :--- | :---: | :---: | :--- |
| `/dashboard` (Home Overview) | Yes | Yes | Company Name banner, active membership & seat status |
| `/dashboard/courses` (My Courses) | Yes | Yes | "Assign to Employee" modal trigger |
| `/dashboard/announcements` | Yes | Yes | Filter by Company announcements |
| `/dashboard/quiz-attempts` | Yes | Yes | Personal quiz history |
| `/dashboard/assignments` | Yes | Yes | Personal practical submissions |
| `/dashboard/gradebook` | Yes | Yes | Personal competency record |
| `/dashboard/certificates` | Yes | Yes | Personal credentials & wallet cards |
| `/dashboard/analytics` | Yes | Yes | Personal training velocity & drill hours |
| `/dashboard/live-classes` | Yes | Yes | Class schedule & meeting launcher |
| `/dashboard/resources` | Yes | Yes | Downloadable operational files |
| `/dashboard/discussions` | Yes | Yes | Technical Q&A forums |
| **`/dashboard/company/team` (New Hub)** | **No (Hidden)** | **Yes (Unlocked)** | **Company Roster, Invite Student (Email + Course selection)** |
| **`/dashboard/company/vouchers` (New Hub)** | **No (Hidden)** | **Yes (Unlocked)** | **Seat Allocation, Course/Bundle Vouchers, Code Export** |
| **`/dashboard/company/reports` (New Hub)** | **No (Hidden)** | **Yes (Unlocked)** | **Company Compliance Matrix, CSV/PDF Audit Export** |

### Public & Commerce Routes
| Route / View | Accessible by | Description & Functional Scope |
| :--- | :--- | :--- |
| `/cart` | Public / All Users | Shopping cart showing line items, bundles, seat quantities, and subtotal. |
| `/checkout` | Public / All Users | Single-screen checkout with **Voucher Code redemption** (100% unlock), **Coupon Discounts**, and Payment methods (Cards + **Manual / Pay Later** with automated admin notification). |

---

### Shell 2: Studio Portal (`/admin`)
| Route / View | Accessible by Instructor | Accessible by Super Admin | Elevated Super Admin Controls |
| :--- | :---: | :---: | :--- |
| `/admin` (Studio Overview) | Yes | Yes | Global platform statistics & tenant metrics |
| `/admin/courses` (Course Builder) | Yes (Assigned only) | Yes (All courses) | Create, edit, delete, publish any course |
| `/admin/question-banks` | Yes | Yes | System-wide question pool governance |
| `/admin/grading-queue` | Yes | Yes | Grade submissions, leave video/text feedback |
| `/admin/live-sessions` | Yes | Yes | Schedule webinars, configure Zoom/Meet links |
| `/admin/roster` (Students) | Yes (Course students) | Yes (All users) | Grant extra quiz attempts, override retakes |
| **`/admin/organizations` (New Hub)** | **No (Hidden)** | **Yes (Unlocked)** | **Create/Edit B2B Companies, Assign Courses & Set Capacity** |
| **`/admin/billing-plans` (New Hub)** | **No (Hidden)** | **Yes (Unlocked)** | **Stripe Gateway, Access Plans, Manual/Pay Later Orders, Invoices** |
| **`/admin/settings` (New Hub)** | **No (Hidden)** | **Yes (Unlocked)** | **Whitelabel, Private Site Lockdown, Email SMTP** |

---

## 5. Technical Implementation Guidelines

### 5.1 RBAC State Management (Next.js & React)
- The application layout must never duplicate layout components.
- In `src/app/dashboard/layout.tsx`, navigation items are dynamically computed from the user's role:
```typescript
// Conceptual Implementation in src/app/dashboard/layout.tsx
const userRole = currentUser.role; // "STUDENT" | "COMPANY_ADMIN"

const navItems = [
  { label: "Home", href: "/dashboard", icon: <HomeIcon /> },
  { label: "Courses", href: "/dashboard/courses", icon: <CoursesIcon /> },
  { label: "Announcements", href: "/dashboard/announcements", icon: <AnnouncementsIcon /> },
  { label: "Quiz Attempts", href: "/dashboard/quiz-attempts", icon: <QuizAttemptsIcon /> },
  { label: "Assignments", href: "/dashboard/assignments", icon: <AssignmentsIcon /> },
  { label: "Certificates & Awards", href: "/dashboard/certificates", icon: <CertificateIcon /> },
  { label: "Gradebook", href: "/dashboard/gradebook", icon: <GradebookIcon /> },
  { label: "Discussions", href: "/dashboard/discussions", icon: <DiscussionsIcon /> },
  { label: "Live Classes", href: "/dashboard/live-classes", icon: <LiveClassesIcon /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <AnalyticsIcon /> },
  { label: "Resources", href: "/dashboard/resources", icon: <ResourcesIcon /> },
  // Dynamically appended for Company Admins:
  ...(userRole === "COMPANY_ADMIN"
    ? [
        { label: "Company Team", href: "/dashboard/company/team", icon: <TeamIcon /> },
        { label: "Seat Vouchers", href: "/dashboard/company/vouchers", icon: <VoucherIcon /> },
        { label: "Compliance Reports", href: "/dashboard/company/reports", icon: <ReportIcon /> },
      ]
    : []),
];
```

### 5.2 Strict Design System & Palette
- All components in both Shell 1 and Shell 2 must adhere 100% to the Skilliant brand purple palette (`#7D52F4`, `#693EE0`, `bg-purple-50`, `border-purple-200`).
- Absolutely zero `blue-*` classes.

---

## 6. Summary of Architectural Advantages

1. **Zero Code Duplication:** Students and Company Admins share the exact same UI shell, components, and course views. Instructors and Super Admins share the exact same studio layout.
2. **Frictionless Role Upgrades:** When an organization promotes an employee to Company Admin, their existing dashboard simply unlocks new tabs without forcing them into a completely different platform.
3. **Market Breadth:** Seamlessly serves driving schools, technical agencies, healthcare compliance, corporate onboarding, safety certifications, or trade apprenticeships.
4. **Outcome Certainty:** Replaces passive lecture watching with active drills, practical proof uploads, zero-fault safety scores, and verifiable digital licenses.
