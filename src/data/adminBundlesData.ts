export interface SubCourseItem {
  id: string;
  title: string;
  durationHours: number;
  instructor: string;
  lessonsCount: number;
}

export interface AdminSpecialization {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  subCourses: SubCourseItem[];
  totalCourses: number;
  totalHours: number;
  pricing: {
    oneTimePrice: number; // e.g. 199
    installmentPrice?: number; // e.g. 49/month for 4 months
    individualTotalPrice: number; // sum of individual courses, e.g. 280
    savingsPercent: number; // calculated bundle savings (e.g. 29%)
  };
  certificateTitle: string;
  enrolledCount: number;
  status: "Published" | "Draft";
  createdAt: string;
}

export const initialAdminSpecializations: AdminSpecialization[] = [
  {
    id: "spec-1",
    title: "Full-Stack UX & Design Systems Specialization",
    slug: "full-stack-ux-design-systems",
    shortDescription:
      "A complete 3-course track mastering wireframing, user empathy research, usability testing, and enterprise design systems token architecture.",
    category: "Design & UX",
    subCourses: [
      {
        id: "sub-101",
        title: "Figma Fundamentals & Interactive Prototyping",
        durationHours: 14,
        instructor: "Sarah Jenkins",
        lessonsCount: 22,
      },
      {
        id: "sub-102",
        title: "UX Research, User Interviews & Usability Testing",
        durationHours: 18,
        instructor: "Sarah Jenkins & Research Group",
        lessonsCount: 28,
      },
      {
        id: "sub-103",
        title: "Design Systems, Tokens & Reusable Component Libraries",
        durationHours: 20,
        instructor: "Technical Design Board",
        lessonsCount: 30,
      },
    ],
    totalCourses: 3,
    totalHours: 52,
    pricing: {
      oneTimePrice: 199,
      installmentPrice: 55,
      individualTotalPrice: 290,
      savingsPercent: 31,
    },
    certificateTitle: "Professional Certified UX & Design Systems Specialist",
    enrolledCount: 14,
    status: "Published",
    createdAt: "2026-08-10",
  },
  {
    id: "spec-2",
    title: "Industrial Machinery Operator Specialization",
    slug: "industrial-machinery-operator-specialization",
    shortDescription:
      "Comprehensive heavy machinery operator curriculum covering forklift safety, excavator hydraulic control, pre-trip inspections, and OSHA field standards.",
    category: "Heavy Machinery",
    subCourses: [
      {
        id: "sub-201",
        title: "Forklift Safety & Zero-Fault Pre-Trip Inspection",
        durationHours: 16,
        instructor: "Technical Training Board",
        lessonsCount: 24,
      },
      {
        id: "sub-202",
        title: "Heavy Excavator & Hydraulic Precision Controls",
        durationHours: 24,
        instructor: "Chief Operator Miller",
        lessonsCount: 36,
      },
      {
        id: "sub-203",
        title: "DOT Hazard Compliance & Site Rigging Protocols",
        durationHours: 18,
        instructor: "Compliance Inspector Daniels",
        lessonsCount: 26,
      },
    ],
    totalCourses: 3,
    totalHours: 58,
    pricing: {
      oneTimePrice: 350,
      installmentPrice: 95,
      individualTotalPrice: 450,
      savingsPercent: 22,
    },
    certificateTitle: "Verified Master Heavy Machinery & Safety Operator",
    enrolledCount: 28,
    status: "Published",
    createdAt: "2026-08-01",
  },
  {
    id: "spec-3",
    title: "Full-Stack Web & Cloud Architecture Specialization",
    slug: "full-stack-web-cloud-architecture",
    shortDescription:
      "End-to-end modern web development, Next.js server components, database indexing, and automated production deployment pipelines.",
    category: "Development",
    subCourses: [
      {
        id: "sub-301",
        title: "Modern JavaScript & TypeScript Engineering",
        durationHours: 20,
        instructor: "John Doe",
        lessonsCount: 32,
      },
      {
        id: "sub-302",
        title: "Next.js App Router, SSR & Backend API Routes",
        durationHours: 26,
        instructor: "John Doe",
        lessonsCount: 40,
      },
      {
        id: "sub-303",
        title: "Cloud Deployment, CI/CD Pipelines & Security",
        durationHours: 16,
        instructor: "Cloud Architecture Lead",
        lessonsCount: 24,
      },
    ],
    totalCourses: 3,
    totalHours: 62,
    pricing: {
      oneTimePrice: 249,
      installmentPrice: 69,
      individualTotalPrice: 360,
      savingsPercent: 30,
    },
    certificateTitle: "Certified Full-Stack Cloud & Web Engineer",
    enrolledCount: 19,
    status: "Published",
    createdAt: "2026-08-20",
  },
  {
    id: "spec-4",
    title: "Data Science & Predictive AI Specialization",
    slug: "data-science-predictive-ai",
    shortDescription:
      "Master statistical inference, machine learning pipelines, and predictive industrial analytics using modern Python data stacks.",
    category: "Data & AI",
    subCourses: [
      {
        id: "sub-401",
        title: "Python for Data Science & Numerical Computing",
        durationHours: 18,
        instructor: "Data Science Faculty",
        lessonsCount: 28,
      },
      {
        id: "sub-402",
        title: "Applied Machine Learning & Predictive Modeling",
        durationHours: 22,
        instructor: "Data Science Faculty",
        lessonsCount: 34,
      },
    ],
    totalCourses: 2,
    totalHours: 40,
    pricing: {
      oneTimePrice: 180,
      installmentPrice: 50,
      individualTotalPrice: 230,
      savingsPercent: 21,
    },
    certificateTitle: "Verified Applied Data Science Specialist",
    enrolledCount: 0,
    status: "Draft",
    createdAt: "2026-09-08",
  },
];
