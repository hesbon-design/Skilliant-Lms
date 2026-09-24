import systemStudentsJson from "./systemStudents.json";
import enrollmentProgramsJson from "./enrollmentPrograms.json";
import adminEnrollmentsJson from "./adminEnrollments.json";

export interface AdminEnrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  programTitle: string;
  programType: "course" | "bundle" | "specialization";
  enrollmentType: "self_paid" | "company_voucher" | "admin_manual";
  companyName?: string;
  enrolledAt: string;
  expiresAt: string | "Lifetime";
  status: "Active" | "In Progress" | "Completed" | "Suspended";
  progress: number; // 0 to 100
  lastActive: string;
}

export interface SystemStudent {
  id: string;
  name: string;
  email: string;
  avatarLetter: string;
  avatarBg: string;
  company?: string;
  enrolledCount: number;
}

export interface EnrollmentProgramOption {
  id: string;
  type: "course" | "bundle";
  title: string;
  category: string;
  price: number;
  duration?: string;
  coursesCount?: number;
  lessonsCount?: number;
  thumbnail: string;
}

export const systemStudents: SystemStudent[] = systemStudentsJson as SystemStudent[];
export const enrollmentPrograms: EnrollmentProgramOption[] = enrollmentProgramsJson as EnrollmentProgramOption[];
export const initialAdminEnrollments: AdminEnrollment[] = adminEnrollmentsJson as AdminEnrollment[];
