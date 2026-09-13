export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  domain: string;
  adminName: string;
  adminEmail: string;
  seatsAllocated: number;
  seatsUsed: number;
  status: "Active" | "Trial" | "Suspended";
  assignedCourses: string[];
  contractRenewal: string;
  mrr: number;
}

export interface BillingPlan {
  id: string;
  name: string;
  targetAudience: string;
  price: number;
  billingInterval: "one-time" | "monthly" | "yearly" | "per-seat";
  features: string[];
  activeSubscribers: number;
  isPopular?: boolean;
}

export interface PlatformSettingsState {
  // 1. General & Branding
  platformName: string;
  supportEmail: string;
  brandTagline: string;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  defaultTimezone: string;

  // 2. Instructor & Course Governance
  requireAdminApproval: boolean;
  allowInstructorResetProgress: boolean;
  courseRetakePolicy: boolean;
  maxRetakeAttempts: number;

  // 3. Payments & Billing
  defaultCurrency: string;
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  manualPaymentEnabled: boolean;
  offlinePaymentInstructions: string;
  taxRatePercent: number;
  couponsEnabled: boolean;

  // 4. Security & Content Protection
  concurrentSessionLimit: number; // 1 per PRD
  emailVerificationRequired: boolean;
  contentCopyProtection: boolean;

  // 5. AI Studio Integration
  aiEngineEnabled: boolean;
  aiProvider: "gemini" | "openai";
  aiApiKey: string;
  aiAutoDraftQuizzes: boolean;
  aiLessonSummaries: boolean;
  aiTutorAssistant: boolean;

  // 6. Media Storage
  storageProvider: "s3" | "r2" | "bunny";
  storageBucketName: string;
  storageAccessKey: string;
  storageSecretKey: string;
  youtubeApiKey: string;
}

export const mockOrganizations: OrganizationRecord[] = [
  {
    id: "org-1",
    name: "Apex Industrial Logistics",
    slug: "apex-logistics",
    domain: "apexlogistics.com",
    adminName: "Hesbon Ombati",
    adminEmail: "hesbon@apexlogistics.com",
    seatsAllocated: 25,
    seatsUsed: 18,
    status: "Active",
    assignedCourses: [
      "Industrial Machine Operator Track",
      "Forklift Safety & Zero-Fault Inspection",
      "Commercial Fleet Defensive Driving",
    ],
    contractRenewal: "2027-08-01",
    mrr: 2250,
  },
  {
    id: "org-2",
    name: "Summit Logistics Inc.",
    slug: "summit-logistics",
    domain: "summitlogistics.org",
    adminName: "David Henderson",
    adminEmail: "d.henderson@summitlogistics.org",
    seatsAllocated: 50,
    seatsUsed: 44,
    status: "Active",
    assignedCourses: [
      "Commercial Fleet Defensive Driving",
      "Hazardous Materials Transport Compliance",
    ],
    contractRenewal: "2027-03-15",
    mrr: 4100,
  },
  {
    id: "org-3",
    name: "Horizon Works Technical",
    slug: "horizon-works",
    domain: "horizonworks.tech",
    adminName: "Kavita Patel",
    adminEmail: "k.patel@horizonworks.tech",
    seatsAllocated: 30,
    seatsUsed: 22,
    status: "Active",
    assignedCourses: [
      "Complete React Developer Course",
      "Next.js Full Stack Bootcamp",
    ],
    contractRenewal: "2026-11-30",
    mrr: 2900,
  },
  {
    id: "org-4",
    name: "Bay Materials Handling",
    slug: "bay-materials",
    domain: "baymaterials.com",
    adminName: "Carlos Ramirez",
    adminEmail: "carlos@baymaterials.com",
    seatsAllocated: 40,
    seatsUsed: 38,
    status: "Active",
    assignedCourses: [
      "Forklift Safety & Zero-Fault Inspection",
      "Heavy Machinery Maintenance",
    ],
    contractRenewal: "2027-05-10",
    mrr: 3600,
  },
  {
    id: "org-5",
    name: "Nova Engineering Labs",
    slug: "nova-labs",
    domain: "novalabs.io",
    adminName: "Dr. Rachel Vance",
    adminEmail: "rachel@novalabs.io",
    seatsAllocated: 15,
    seatsUsed: 12,
    status: "Trial",
    assignedCourses: [
      "Next.js Full Stack Bootcamp",
      "JavaScript Mastery",
    ],
    contractRenewal: "2026-10-15",
    mrr: 0,
  },
];

export const mockBillingPlans: BillingPlan[] = [
  {
    id: "plan-single",
    name: "Individual Course Pass",
    targetAudience: "Individual learners mastering a single practical skill",
    price: 79,
    billingInterval: "one-time",
    features: [
      "Lifetime access to course curriculum",
      "All quizzes, drills & practical proof uploads",
      "Official certificate upon 100% completion",
      "Downloadable worksheets & notes",
    ],
    activeSubscribers: 840,
  },
  {
    id: "plan-track",
    name: "Multi-Course Skill Track",
    targetAudience: "Specialists completing full trade or certification bundles",
    price: 249,
    billingInterval: "one-time",
    isPopular: true,
    features: [
      "All courses inside the skill track bundle",
      "Verified digital badge & verifiable license QR",
      "Priority grading in the instructor review queue",
      "Access to live group workshop webinars",
      "Permanent portfolio project locker",
    ],
    activeSubscribers: 420,
  },
  {
    id: "plan-enterprise",
    name: "Enterprise Seat Allocation",
    targetAudience: "Companies & organizations onboarding teams",
    price: 49,
    billingInterval: "per-seat",
    features: [
      "Dedicated Company Admin management portal",
      "Real-time seat capacity tracker & instant voucher generator",
      "Invite students by email + designated course allocation",
      "Non-GPA Practical Competency & Safety Logbook",
      "One-click CSV/PDF compliance audit report export",
      "Dedicated account manager & PO/invoice billing",
    ],
    activeSubscribers: 312,
  },
];

export const initialPlatformSettings: PlatformSettingsState = {
  platformName: "Skilliant Custom Training & Competency Platform",
  supportEmail: "support@skilliant.com",
  brandTagline: "Adaptive, Outcome-Driven Custom Training for Any Organization",
  maintenanceMode: false,
  maintenanceNotice: "Skilliant is undergoing planned scheduled maintenance. Learner access will resume at 04:00 UTC.",
  defaultTimezone: "UTC / US Eastern (EST)",

  requireAdminApproval: true,
  allowInstructorResetProgress: true,
  courseRetakePolicy: true,
  maxRetakeAttempts: 3,

  defaultCurrency: "USD ($)",
  stripeEnabled: true,
  stripePublishableKey: "pk_live_51M0...skilliant9819",
  stripeSecretKey: "sk_live_51M0...••••••••••••••••••••••••",
  stripeWebhookSecret: "whsec_98af...••••••••••••••••",
  manualPaymentEnabled: true,
  offlinePaymentInstructions: "Wire transfer details: JPMorgan Chase, Routing: 021000021, Account: 8829-1029-4410, Beneficiary: Skilliant Technologies Inc. Please reference your Order/Invoice ID on wire memo.",
  taxRatePercent: 0,
  couponsEnabled: true,

  concurrentSessionLimit: 1,
  emailVerificationRequired: true,
  contentCopyProtection: true,

  aiEngineEnabled: true,
  aiProvider: "gemini",
  aiApiKey: "AIzaSy...••••••••••••••••••••••••••••••",
  aiAutoDraftQuizzes: true,
  aiLessonSummaries: true,
  aiTutorAssistant: true,

  storageProvider: "r2",
  storageBucketName: "skilliant-enterprise-media",
  storageAccessKey: "cf_acc_9814...••••••••",
  storageSecretKey: "cf_sec_0192...••••••••••••••••••••••••",
  youtubeApiKey: "AIzaSy...••••••••••••••••",
};
