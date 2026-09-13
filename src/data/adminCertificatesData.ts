export interface AdminCertificate {
  id: string;
  code: string;
  title: string;
  courseSlug: string;
  courseTitle: string;
  category: string;
  templateStyle: "Classic Border" | "Modern Geometric" | "Technical Excellence" | "Corporate Crest";
  signatoryName: string;
  signatoryTitle: string;
  organization: string;
  passingScore: number;
  validity: "Lifetime" | "1 Year" | "2 Years" | "3 Years";
  issuedCount: number;
  status: "Active" | "Draft" | "Archived";
  description: string;
  createdAt: string;
  accentColor: string;
}

export const initialCertificates: AdminCertificate[] = [
  {
    id: "cert-tpl-1",
    code: "SKL-CERT-WD01",
    title: "Full-Stack Web Engineering Professional Certificate",
    courseSlug: "web-development-bootcamp",
    courseTitle: "The Complete Web Development Bootcamp",
    category: "Development",
    templateStyle: "Classic Border",
    signatoryName: "Dr. Hesbon Ombati",
    signatoryTitle: "Dean of Technical Education & Academy Director",
    organization: "Skilliant Global Academy",
    passingScore: 80,
    validity: "Lifetime",
    issuedCount: 48,
    status: "Active",
    description: "Awarded upon successful completion of curriculum drills, full-stack capstones, and verified assessment evaluations.",
    createdAt: "2026-08-15",
    accentColor: "#7D52F4",
  },
  {
    id: "cert-tpl-2",
    code: "SKL-CERT-PDS02",
    title: "Data Science & Applied Machine Learning Specialist",
    courseSlug: "python-for-data-science",
    courseTitle: "Python for Data Science",
    category: "Data & AI",
    templateStyle: "Technical Excellence",
    signatoryName: "Dr. Elena Rostova",
    signatoryTitle: "Head of Artificial Intelligence & Analytics",
    organization: "Skilliant Institute of Technology",
    passingScore: 85,
    validity: "Lifetime",
    issuedCount: 32,
    status: "Active",
    description: "Validates competence in predictive modeling, statistical inference, data pipelines, and production machine learning.",
    createdAt: "2026-08-20",
    accentColor: "#0D9488",
  },
  {
    id: "cert-tpl-3",
    code: "SKL-CERT-FKL03",
    title: "Forklift Safety & OSHA Zero-Fault Certified Operator",
    courseSlug: "forklift-safety-zero-fault",
    courseTitle: "Forklift Safety & Zero-Fault Inspection",
    category: "Operations & Safety",
    templateStyle: "Corporate Crest",
    signatoryName: "Marcus Vance",
    signatoryTitle: "Chief Safety Officer & Field Compliance Inspector",
    organization: "Apex Industrial Logistics & Skilliant Academy",
    passingScore: 90,
    validity: "2 Years",
    issuedCount: 124,
    status: "Active",
    description: "Accredited workforce certification demonstrating zero-fault pre-operation inspection and safe industrial warehouse navigation.",
    createdAt: "2026-07-10",
    accentColor: "#2563EB",
  },
  {
    id: "cert-tpl-4",
    code: "SKL-CERT-IMO04",
    title: "Master Heavy Machinery Operator & Logistics Specialist",
    courseSlug: "industrial-machine-operator-track",
    courseTitle: "Industrial Machine Operator Track",
    category: "Heavy Industry",
    templateStyle: "Corporate Crest",
    signatoryName: "Marcus Vance",
    signatoryTitle: "Field Training Director",
    organization: "Apex Logistics Heavy Division",
    passingScore: 85,
    validity: "3 Years",
    issuedCount: 85,
    status: "Active",
    description: "Demonstrates practical machine operation mastery, hydraulic maintenance compliance, and emergency hazard response.",
    createdAt: "2026-07-28",
    accentColor: "#D97706",
  },
  {
    id: "cert-tpl-5",
    code: "SKL-CERT-DSF05",
    title: "Statistical Foundations & Quantitative Analysis Credential",
    courseSlug: "data-science-foundations",
    courseTitle: "Data Science Foundations",
    category: "Data & AI",
    templateStyle: "Classic Border",
    signatoryName: "Dr. Elena Rostova",
    signatoryTitle: "Department Chair of Data Science",
    organization: "Skilliant Global Academy",
    passingScore: 80,
    validity: "Lifetime",
    issuedCount: 19,
    status: "Active",
    description: "Confirms mastery of foundational mathematics, statistical distributions, probability hypotheses, and exploratory data analysis.",
    createdAt: "2026-09-01",
    accentColor: "#7D52F4",
  },
  {
    id: "cert-tpl-6",
    code: "SKL-CERT-RCT06",
    title: "React & Next.js Enterprise Software Architecture",
    courseSlug: "react-developer-course",
    courseTitle: "Complete React Developer Course",
    category: "Development",
    templateStyle: "Modern Geometric",
    signatoryName: "Dr. Hesbon Ombati",
    signatoryTitle: "Lead Curriculum Architect",
    organization: "Skilliant Engineering Guild",
    passingScore: 80,
    validity: "Lifetime",
    issuedCount: 0,
    status: "Draft",
    description: "Certifies production capability in modern React server components, Turbopack optimizations, state machines, and resilient UI delivery.",
    createdAt: "2026-09-10",
    accentColor: "#6366F1",
  },
];

export const availableCoursesList = [
  { slug: "web-development-bootcamp", title: "The Complete Web Development Bootcamp", category: "Development" },
  { slug: "python-for-data-science", title: "Python for Data Science", category: "Data & AI" },
  { slug: "data-science-foundations", title: "Data Science Foundations", category: "Data & AI" },
  { slug: "industrial-machine-operator-track", title: "Industrial Machine Operator Track", category: "Heavy Industry" },
  { slug: "forklift-safety-zero-fault", title: "Forklift Safety & Zero-Fault Inspection", category: "Operations & Safety" },
  { slug: "commercial-fleet-defensive-driving", title: "Commercial Fleet Defensive Driving", category: "Operations & Safety" },
  { slug: "react-developer-course", title: "Complete React Developer Course", category: "Development" },
];
