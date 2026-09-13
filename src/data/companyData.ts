export interface CompanyMember {
  id: string;
  name: string;
  email: string;
  role: "Learner" | "Manager" | "Supervisor";
  assignedProgram: string;
  programType: "course" | "track";
  progressPercent: number;
  competencyScore: number; // Non-GPA Practical Competency (e.g. 92%)
  safetyScore: number; // Safety & Compliance Rating (e.g. 98%)
  loggedPracticalHours: number;
  status: "Active" | "Pending" | "Certified" | "Remediation Required";
  joinedDate: string;
  lastActive: string;
}

export interface CompanyVoucher {
  code: string;
  programName: string;
  programType: "Course" | "Learning Track";
  totalValue: number;
  status: "Available" | "Redeemed" | "Expired";
  redeemedBy?: {
    name: string;
    email: string;
    redeemedAt: string;
  };
  expiresAt: string;
}

export interface CompanyProfile {
  name: string;
  slug: string;
  industry: string;
  tier: "Enterprise Tier" | "Growth Tier" | "Standard Tier";
  primaryAdmin: {
    name: string;
    email: string;
  };
  seatCapacity: {
    total: number;
    used: number;
    available: number;
  };
  assignedCatalog: {
    id: string;
    title: string;
    type: "Course" | "Learning Track";
    allocatedSeats: number;
    activeLearners: number;
  }[];
}

export const mockCompanyProfile: CompanyProfile = {
  name: "Apex Industrial Logistics",
  slug: "apex-logistics",
  industry: "Supply Chain & Industrial Logistics",
  tier: "Enterprise Tier",
  primaryAdmin: {
    name: "Hesbon Ombati",
    email: "hesbon@apexlogistics.com",
  },
  seatCapacity: {
    total: 25,
    used: 18,
    available: 7,
  },
  assignedCatalog: [
    {
      id: "cat-1",
      title: "Industrial Machine Operator Track",
      type: "Learning Track",
      allocatedSeats: 10,
      activeLearners: 8,
    },
    {
      id: "cat-2",
      title: "Forklift Safety & Zero-Fault Inspection",
      type: "Course",
      allocatedSeats: 8,
      activeLearners: 6,
    },
    {
      id: "cat-3",
      title: "Commercial Fleet Defensive Driving",
      type: "Course",
      allocatedSeats: 7,
      activeLearners: 4,
    },
  ],
};

export const mockCompanyMembers: CompanyMember[] = [
  {
    id: "mem-1",
    name: "Alex Mercer",
    email: "a.mercer@apexlogistics.com",
    role: "Learner",
    assignedProgram: "Industrial Machine Operator Track",
    programType: "track",
    progressPercent: 100,
    competencyScore: 96,
    safetyScore: 100,
    loggedPracticalHours: 42,
    status: "Certified",
    joinedDate: "2026-08-01",
    lastActive: "Today at 09:14 AM",
  },
  {
    id: "mem-2",
    name: "Devon Vance",
    email: "d.vance@apexlogistics.com",
    role: "Learner",
    assignedProgram: "Industrial Machine Operator Track",
    programType: "track",
    progressPercent: 78,
    competencyScore: 91,
    safetyScore: 98,
    loggedPracticalHours: 31,
    status: "Active",
    joinedDate: "2026-08-10",
    lastActive: "Yesterday at 04:30 PM",
  },
  {
    id: "mem-3",
    name: "Elena Rostova",
    email: "e.rostova@apexlogistics.com",
    role: "Supervisor",
    assignedProgram: "Forklift Safety & Zero-Fault Inspection",
    programType: "course",
    progressPercent: 100,
    competencyScore: 98,
    safetyScore: 100,
    loggedPracticalHours: 28,
    status: "Certified",
    joinedDate: "2026-08-05",
    lastActive: "2 days ago",
  },
  {
    id: "mem-4",
    name: "Marcus Brody",
    email: "m.brody@apexlogistics.com",
    role: "Learner",
    assignedProgram: "Commercial Fleet Defensive Driving",
    programType: "course",
    progressPercent: 45,
    competencyScore: 79,
    safetyScore: 82,
    loggedPracticalHours: 14,
    status: "Remediation Required",
    joinedDate: "2026-08-15",
    lastActive: "3 days ago",
  },
  {
    id: "mem-5",
    name: "Sarah Lin",
    email: "s.lin@apexlogistics.com",
    role: "Learner",
    assignedProgram: "Forklift Safety & Zero-Fault Inspection",
    programType: "course",
    progressPercent: 60,
    competencyScore: 89,
    safetyScore: 95,
    loggedPracticalHours: 19,
    status: "Active",
    joinedDate: "2026-08-20",
    lastActive: "Today at 11:20 AM",
  },
  {
    id: "mem-6",
    name: "Tariq Kaba",
    email: "t.kaba@apexlogistics.com",
    role: "Learner",
    assignedProgram: "Commercial Fleet Defensive Driving",
    programType: "course",
    progressPercent: 0,
    competencyScore: 0,
    safetyScore: 100,
    loggedPracticalHours: 0,
    status: "Pending",
    joinedDate: "2026-09-08",
    lastActive: "Invitation Sent",
  },
];

export const mockCompanyVouchers: CompanyVoucher[] = [
  {
    code: "SKL-APEX-TRK-8921",
    programName: "Industrial Machine Operator Track",
    programType: "Learning Track",
    totalValue: 450,
    status: "Redeemed",
    redeemedBy: {
      name: "Alex Mercer",
      email: "a.mercer@apexlogistics.com",
      redeemedAt: "2026-08-01",
    },
    expiresAt: "2026-12-31",
  },
  {
    code: "SKL-APEX-TRK-8922",
    programName: "Industrial Machine Operator Track",
    programType: "Learning Track",
    totalValue: 450,
    status: "Redeemed",
    redeemedBy: {
      name: "Devon Vance",
      email: "d.vance@apexlogistics.com",
      redeemedAt: "2026-08-10",
    },
    expiresAt: "2026-12-31",
  },
  {
    code: "SKL-APEX-TRK-8923",
    programName: "Industrial Machine Operator Track",
    programType: "Learning Track",
    totalValue: 450,
    status: "Available",
    expiresAt: "2026-12-31",
  },
  {
    code: "SKL-APEX-TRK-8924",
    programName: "Industrial Machine Operator Track",
    programType: "Learning Track",
    totalValue: 450,
    status: "Available",
    expiresAt: "2026-12-31",
  },
  {
    code: "SKL-APEX-FL-4101",
    programName: "Forklift Safety & Zero-Fault Inspection",
    programType: "Course",
    totalValue: 180,
    status: "Redeemed",
    redeemedBy: {
      name: "Elena Rostova",
      email: "e.rostova@apexlogistics.com",
      redeemedAt: "2026-08-05",
    },
    expiresAt: "2026-12-31",
  },
  {
    code: "SKL-APEX-FL-4102",
    programName: "Forklift Safety & Zero-Fault Inspection",
    programType: "Course",
    totalValue: 180,
    status: "Available",
    expiresAt: "2026-12-31",
  },
  {
    code: "SKL-APEX-DD-6201",
    programName: "Commercial Fleet Defensive Driving",
    programType: "Course",
    totalValue: 195,
    status: "Redeemed",
    redeemedBy: {
      name: "Marcus Brody",
      email: "m.brody@apexlogistics.com",
      redeemedAt: "2026-08-15",
    },
    expiresAt: "2026-12-31",
  },
  {
    code: "SKL-APEX-DD-6202",
    programName: "Commercial Fleet Defensive Driving",
    programType: "Course",
    totalValue: 195,
    status: "Available",
    expiresAt: "2026-12-31",
  },
];
