export interface GradeRule {
  id: string;
  badge: string;
  name: string;
  point: number;
  pointFormatted: string;
  minPercent: number;
  maxPercent: number;
  rangeFormatted: string;
  badgeBg: string; // Tailwind background or hex
  badgeText: string;
}

export interface StudentGradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  courseTitle: string;
  courseSlug: string;
  quizScorePercent: number;
  assignmentScorePercent: number;
  overallScorePercent: number;
  status: "Passed" | "In Progress" | "Needs Review";
  gradedAt: string;
}

export const initialGradeRules: GradeRule[] = [
  {
    id: "grade-1",
    badge: "A+",
    name: "A+",
    point: 4.0,
    pointFormatted: "4.0",
    minPercent: 90,
    maxPercent: 100,
    rangeFormatted: "90-100",
    badgeBg: "bg-[#22C55E]",
    badgeText: "text-white",
  },
  {
    id: "grade-2",
    badge: "A",
    name: "A",
    point: 3.5,
    pointFormatted: "3.50",
    minPercent: 80,
    maxPercent: 89,
    rangeFormatted: "80-89",
    badgeBg: "bg-[#14B8A6]",
    badgeText: "text-white",
  },
  {
    id: "grade-3",
    badge: "A-",
    name: "A-",
    point: 3.0,
    pointFormatted: "3.0",
    minPercent: 70,
    maxPercent: 79,
    rangeFormatted: "70-79",
    badgeBg: "bg-[#2DD4BF]",
    badgeText: "text-white",
  },
  {
    id: "grade-4",
    badge: "B+",
    name: "B+",
    point: 2.5,
    pointFormatted: "2.50",
    minPercent: 60,
    maxPercent: 69,
    rangeFormatted: "60-69",
    badgeBg: "bg-[#1E3A8A]",
    badgeText: "text-white",
  },
  {
    id: "grade-5",
    badge: "B",
    name: "B",
    point: 2.0,
    pointFormatted: "2.0",
    minPercent: 50,
    maxPercent: 59,
    rangeFormatted: "50-59",
    badgeBg: "bg-[#2563EB]",
    badgeText: "text-white",
  },
  {
    id: "grade-6",
    badge: "B-",
    name: "B-",
    point: 1.5,
    pointFormatted: "1.5",
    minPercent: 40,
    maxPercent: 49,
    rangeFormatted: "40-49",
    badgeBg: "bg-[#38BDF8]",
    badgeText: "text-white",
  },
  {
    id: "grade-7",
    badge: "C",
    name: "C",
    point: 1.0,
    pointFormatted: "1.0",
    minPercent: 30,
    maxPercent: 39,
    rangeFormatted: "30-39",
    badgeBg: "bg-[#9333EA]",
    badgeText: "text-white",
  },
  {
    id: "grade-8",
    badge: "F",
    name: "F",
    point: 0.0,
    pointFormatted: "0.0",
    minPercent: 0,
    maxPercent: 29,
    rangeFormatted: "0-29",
    badgeBg: "bg-[#DC2626]",
    badgeText: "text-white",
  },
];

export const sampleStudentGrades: StudentGradeRecord[] = [
  {
    id: "sg-1",
    studentId: "stu-1",
    studentName: "Alex Mercer",
    studentEmail: "a.mercer@apexlogistics.com",
    studentAvatar: "A",
    courseTitle: "Forklift Safety & Zero-Fault Inspection",
    courseSlug: "forklift-safety-inspection",
    quizScorePercent: 96,
    assignmentScorePercent: 92,
    overallScorePercent: 94,
    status: "Passed",
    gradedAt: "2026-09-18",
  },
  {
    id: "sg-2",
    studentId: "stu-2",
    studentName: "Sarah Jenkins",
    studentEmail: "s.jenkins@outlook.com",
    studentAvatar: "S",
    courseTitle: "Figma Fundamentals & Interactive Prototyping",
    courseSlug: "figma-fundamentals",
    quizScorePercent: 88,
    assignmentScorePercent: 84,
    overallScorePercent: 86,
    status: "Passed",
    gradedAt: "2026-09-20",
  },
  {
    id: "sg-3",
    studentId: "stu-3",
    studentName: "Devon Vance",
    studentEmail: "d.vance@apexlogistics.com",
    studentAvatar: "D",
    courseTitle: "Complete React Developer Course",
    courseSlug: "complete-react-developer",
    quizScorePercent: 74,
    assignmentScorePercent: 76,
    overallScorePercent: 75,
    status: "Passed",
    gradedAt: "2026-09-21",
  },
  {
    id: "sg-4",
    studentId: "stu-4",
    studentName: "Elena Rostova",
    studentEmail: "elena.rostova@techcorp.io",
    studentAvatar: "E",
    courseTitle: "Next.js Full Stack Bootcamp",
    courseSlug: "nextjs-fullstack-bootcamp",
    quizScorePercent: 64,
    assignmentScorePercent: 68,
    overallScorePercent: 66,
    status: "Passed",
    gradedAt: "2026-09-22",
  },
  {
    id: "sg-5",
    studentId: "stu-5",
    studentName: "Marcus Brody",
    studentEmail: "m.brody@starkmachinery.com",
    studentAvatar: "M",
    courseTitle: "Heavy Machinery Hydraulic Precision Controls",
    courseSlug: "heavy-machinery-hydraulics",
    quizScorePercent: 52,
    assignmentScorePercent: 56,
    overallScorePercent: 54,
    status: "Needs Review",
    gradedAt: "2026-09-22",
  },
];
