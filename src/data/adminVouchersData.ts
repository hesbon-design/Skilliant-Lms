export interface AdminVoucher {
  id: string;
  code: string;
  sponsoringOrganization: string;
  programTitle: string;
  programType: "course" | "track";
  value: number; // 100% covered sponsored amount
  status: "Available" | "Redeemed" | "Expired" | "Revoked";
  batchId: string;
  redeemedBy?: {
    name: string;
    email: string;
    redeemedAt: string;
  };
  createdAt: string;
  expiresAt: string;
}

export const initialAdminVouchers: AdminVoucher[] = [
  {
    id: "vouch-1",
    code: "SKL-APEX-2026",
    sponsoringOrganization: "Apex Industrial Logistics",
    programTitle: "Industrial Machine Operator Track",
    programType: "track",
    value: 450,
    status: "Available",
    batchId: "BATCH-APEX-01",
    createdAt: "2026-08-01",
    expiresAt: "2026-12-31",
  },
  {
    id: "vouch-2",
    code: "SKL-APEX-TRK-8921",
    sponsoringOrganization: "Apex Industrial Logistics",
    programTitle: "Industrial Machine Operator Track",
    programType: "track",
    value: 450,
    status: "Redeemed",
    batchId: "BATCH-APEX-01",
    redeemedBy: {
      name: "Alex Mercer",
      email: "a.mercer@apexlogistics.com",
      redeemedAt: "2026-08-10",
    },
    createdAt: "2026-08-01",
    expiresAt: "2026-12-31",
  },
  {
    id: "vouch-3",
    code: "SKL-APEX-TRK-8922",
    sponsoringOrganization: "Apex Industrial Logistics",
    programTitle: "Industrial Machine Operator Track",
    programType: "track",
    value: 450,
    status: "Redeemed",
    batchId: "BATCH-APEX-01",
    redeemedBy: {
      name: "Devon Vance",
      email: "d.vance@apexlogistics.com",
      redeemedAt: "2026-08-14",
    },
    createdAt: "2026-08-01",
    expiresAt: "2026-12-31",
  },
  {
    id: "vouch-4",
    code: "VOUCHER-DEV-100",
    sponsoringOrganization: "TechCorp Global Academy",
    programTitle: "The Complete Web Development Bootcamp",
    programType: "course",
    value: 120,
    status: "Available",
    batchId: "BATCH-TECHCORP-01",
    createdAt: "2026-08-20",
    expiresAt: "2026-11-30",
  },
  {
    id: "vouch-5",
    code: "APEX-FL-FREE",
    sponsoringOrganization: "Apex Industrial Logistics",
    programTitle: "Forklift Safety & Zero-Fault Inspection",
    programType: "course",
    value: 89,
    status: "Available",
    batchId: "BATCH-APEX-02",
    createdAt: "2026-09-01",
    expiresAt: "2027-01-31",
  },
  {
    id: "vouch-6",
    code: "SKL-MTA-9901",
    sponsoringOrganization: "Metro Transit Authority",
    programTitle: "Industrial Machine Operator Track",
    programType: "track",
    value: 450,
    status: "Redeemed",
    batchId: "BATCH-MTA-01",
    redeemedBy: {
      name: "Carlos Mendez",
      email: "c.mendez@metrotransit.org",
      redeemedAt: "2026-09-05",
    },
    createdAt: "2026-08-25",
    expiresAt: "2026-12-31",
  },
  {
    id: "vouch-7",
    code: "SKL-MTA-9902",
    sponsoringOrganization: "Metro Transit Authority",
    programTitle: "Industrial Machine Operator Track",
    programType: "track",
    value: 450,
    status: "Available",
    batchId: "BATCH-MTA-01",
    createdAt: "2026-08-25",
    expiresAt: "2026-12-31",
  },
  {
    id: "vouch-8",
    code: "SKL-STARK-001",
    sponsoringOrganization: "Stark Heavy Machinery",
    programTitle: "Python for Data Science & Predictive Maintenance",
    programType: "course",
    value: 149,
    status: "Expired",
    batchId: "BATCH-STARK-01",
    createdAt: "2026-04-01",
    expiresAt: "2026-07-01",
  },
];
