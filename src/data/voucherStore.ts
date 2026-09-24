export interface VoucherCodeItem {
  code: string;
  status: "Unused" | "Redeemed";
  createdAt: string;
  redeemedBy?: {
    name: string;
    email: string;
    redeemedAt: string;
  };
}

export interface VoucherGroup {
  id: string;
  name: string;
  institution?: string | null; // Optional: null or string
  programTitle: string;
  programType: "course" | "bundle";
  value: number;
  customPrefix?: string | null; // Max 3 uppercase characters
  createdAt: string;
  expiresAt?: string | null; // Optional expiration date (YYYY-MM-DD)
  codes: VoucherCodeItem[];
}

// Flat interface for backward compatibility
export interface AdminVoucher {
  id: string;
  code: string;
  sponsoringOrganization: string;
  programTitle: string;
  programType: "course" | "track";
  value: number;
  status: "Unused" | "Redeemed" | "Expired" | "Revoked";
  batchId: string;
  cohortTag?: string;
  domainLock?: string;
  notes?: string;
  redeemedBy?: {
    name: string;
    email: string;
    redeemedAt: string;
  };
  createdAt: string;
  expiresAt: string;
}

const VOUCHER_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCodeSegment(length: number = 4): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += VOUCHER_CHARS.charAt(Math.floor(Math.random() * VOUCHER_CHARS.length));
  }
  return result;
}

/**
 * Generate a unique code formatted as [PREFIX]-[XXXX]-[XXXX]
 * Default prefix is "VCH" if not supplied. Max 3 letters for custom prefix (e.g. ABC -> ABC-8K3P-X92L)
 */
export function generateUniqueVoucherCode(prefix: string = "VCH", existingCodes: Set<string> = new Set()): string {
  let cleanPrefix = prefix.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 3);
  if (!cleanPrefix) cleanPrefix = "VCH";

  let code = "";
  let attempts = 0;
  do {
    const seg1 = generateCodeSegment(4);
    const seg2 = generateCodeSegment(4);
    code = `${cleanPrefix}-${seg1}-${seg2}`;
    attempts++;
  } while (existingCodes.has(code) && attempts < 1000);

  return code;
}

export function generateBatchVoucherCodes(quantity: number, prefix: string = "VCH", existingCodes: Set<string> = new Set()): string[] {
  const codes: string[] = [];
  const codeSet = new Set(existingCodes);

  for (let i = 0; i < quantity; i++) {
    const newCode = generateUniqueVoucherCode(prefix, codeSet);
    codeSet.add(newCode);
    codes.push(newCode);
  }

  return codes;
}

// Seed initial groups matching user's requested examples:
// "Industrial Machine Operator", "Digital Marketing Course", "Corporate Training Batch", "January Training"
export const initialVoucherGroupsSeed: VoucherGroup[] = [
  {
    id: "vch-grp-1",
    name: "Industrial Machine Operator",
    institution: "Apex Industrial Logistics",
    programTitle: "Industrial Machine Operator Track",
    programType: "bundle",
    value: 450,
    customPrefix: "APX",
    createdAt: "2026-08-01",
    expiresAt: "2026-12-31",
    codes: [
      { code: "APX-8K3P-X92L", status: "Unused", createdAt: "2026-08-01" },
      {
        code: "APX-4M7Q-T81A",
        status: "Redeemed",
        createdAt: "2026-08-01",
        redeemedBy: { name: "Alex Mercer", email: "a.mercer@apexlogistics.com", redeemedAt: "2026-08-10" },
      },
      { code: "APX-9R2N-B64K", status: "Unused", createdAt: "2026-08-01" },
      {
        code: "APX-2P8W-M51Y",
        status: "Redeemed",
        createdAt: "2026-08-01",
        redeemedBy: { name: "Devon Vance", email: "d.vance@apexlogistics.com", redeemedAt: "2026-08-14" },
      },
      { code: "APX-7T4C-K93J", status: "Unused", createdAt: "2026-08-01" },
      { code: "APX-3F6H-Z82R", status: "Unused", createdAt: "2026-08-01" },
      { code: "APX-5N1D-Q74S", status: "Unused", createdAt: "2026-08-01" },
      { code: "APX-6W9E-A38V", status: "Unused", createdAt: "2026-08-01" },
      { code: "APX-1C5L-P49G", status: "Unused", createdAt: "2026-08-01" },
      { code: "APX-8D2K-Y76M", status: "Unused", createdAt: "2026-08-01" },
    ],
  },
  {
    id: "vch-grp-2",
    name: "Digital Marketing Course",
    institution: null, // Unattached / independent
    programTitle: "Data-Driven Decision Making for Managers",
    programType: "course",
    value: 120,
    customPrefix: "MKT",
    createdAt: "2026-08-15",
    expiresAt: null, // Lifetime / No Expiry
    codes: [
      { code: "MKT-7K9A-B24E", status: "Unused", createdAt: "2026-08-15" },
      {
        code: "MKT-3P5L-R81W",
        status: "Redeemed",
        createdAt: "2026-08-15",
        redeemedBy: { name: "Chloe Bennett", email: "chloe.b@gmail.com", redeemedAt: "2026-08-20" },
      },
      { code: "MKT-4V8X-Q92M", status: "Unused", createdAt: "2026-08-15" },
      { code: "MKT-9H2N-C71K", status: "Unused", createdAt: "2026-08-15" },
      { code: "MKT-6T1F-Z45J", status: "Unused", createdAt: "2026-08-15" },
    ],
  },
  {
    id: "vch-grp-3",
    name: "Corporate Training Batch",
    institution: "TechCorp Global Academy",
    programTitle: "Modern Web Development with React",
    programType: "course",
    value: 199,
    customPrefix: "COR",
    createdAt: "2026-08-20",
    expiresAt: "2026-11-30",
    codes: [
      { code: "COR-9A1D-F84K", status: "Unused", createdAt: "2026-08-20" },
      {
        code: "COR-5B2M-L71P",
        status: "Redeemed",
        createdAt: "2026-08-20",
        redeemedBy: { name: "Marcus Brody", email: "m.brody@techcorp.io", redeemedAt: "2026-08-28" },
      },
      { code: "COR-7C4Q-R93T", status: "Unused", createdAt: "2026-08-20" },
      { code: "COR-2E8W-V51H", status: "Unused", createdAt: "2026-08-20" },
      { code: "COR-8K6N-X32Y", status: "Unused", createdAt: "2026-08-20" },
      { code: "COR-1F9J-Z74B", status: "Unused", createdAt: "2026-08-20" },
    ],
  },
  {
    id: "vch-grp-4",
    name: "January Training",
    institution: "Metro Transit Authority",
    programTitle: "Commercial Fleet Defensive Driving",
    programType: "course",
    value: 150,
    customPrefix: "JAN",
    createdAt: "2026-09-01",
    expiresAt: "2027-01-31",
    codes: [
      { code: "JAN-4R8K-W19L", status: "Unused", createdAt: "2026-09-01" },
      {
        code: "JAN-9M2P-T64C",
        status: "Redeemed",
        createdAt: "2026-09-01",
        redeemedBy: { name: "Carlos Mendez", email: "c.mendez@metrotransit.org", redeemedAt: "2026-09-05" },
      },
      { code: "JAN-3H7Q-B51V", status: "Unused", createdAt: "2026-09-01" },
      { code: "JAN-8N4X-Y92D", status: "Unused", createdAt: "2026-09-01" },
    ],
  },
];

const GROUPS_STORAGE_KEY = "skilliant_voucher_groups_v2";

export function getVoucherGroups(): VoucherGroup[] {
  if (typeof window === "undefined") {
    return initialVoucherGroupsSeed;
  }
  try {
    const raw = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(initialVoucherGroupsSeed));
      return initialVoucherGroupsSeed;
    }
    return JSON.parse(raw);
  } catch {
    return initialVoucherGroupsSeed;
  }
}

export function setVoucherGroups(groups: VoucherGroup[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (err) {
    console.error("Failed to save voucher groups", err);
  }
}

export function getVoucherGroupById(id: string): VoucherGroup | undefined {
  const groups = getVoucherGroups();
  return groups.find((g) => g.id === id);
}

export interface CreateVoucherGroupParams {
  name: string;
  institution?: string | null;
  programTitle: string;
  programType: "course" | "bundle";
  value?: number;
  quantity: number;
  customPrefix?: string | null;
  expiresAt?: string | null;
}

export function createVoucherGroup(params: CreateVoucherGroupParams): VoucherGroup {
  const currentGroups = getVoucherGroups();
  const allExistingCodes = new Set<string>();
  currentGroups.forEach((g) => g.codes.forEach((c) => allExistingCodes.add(c.code)));

  const prefix = params.customPrefix?.trim().toUpperCase().slice(0, 3) || "VCH";
  const qty = Math.max(1, Math.min(500, Number(params.quantity) || 10));
  const generatedCodes = generateBatchVoucherCodes(qty, prefix, allExistingCodes);
  const now = new Date().toISOString().split("T")[0];

  const codeItems: VoucherCodeItem[] = generatedCodes.map((code) => ({
    code,
    status: "Unused",
    createdAt: now,
  }));

  const newGroup: VoucherGroup = {
    id: `vch-grp-${Date.now()}`,
    name: params.name.trim() || "Course Training Vouchers",
    institution: params.institution?.trim() || null,
    programTitle: params.programTitle,
    programType: params.programType,
    value: params.value || 199,
    customPrefix: params.customPrefix ? prefix : null,
    createdAt: now,
    expiresAt: params.expiresAt?.trim() || null,
    codes: codeItems,
  };

  const updated = [newGroup, ...currentGroups];
  setVoucherGroups(updated);
  return newGroup;
}

/**
 * Add more vouchers to an existing voucher group
 */
export function addCodesToVoucherGroup(groupId: string, quantity: number): VoucherCodeItem[] {
  const currentGroups = getVoucherGroups();
  const targetGroup = currentGroups.find((g) => g.id === groupId);
  if (!targetGroup) return [];

  const allExistingCodes = new Set<string>();
  currentGroups.forEach((g) => g.codes.forEach((c) => allExistingCodes.add(c.code)));

  const prefix = targetGroup.customPrefix || "VCH";
  const qty = Math.max(1, Math.min(500, Number(quantity) || 10));
  const newCodes = generateBatchVoucherCodes(qty, prefix, allExistingCodes);
  const now = new Date().toISOString().split("T")[0];

  const newCodeItems: VoucherCodeItem[] = newCodes.map((code) => ({
    code,
    status: "Unused",
    createdAt: now,
  }));

  const updated = currentGroups.map((g) => {
    if (g.id === groupId) {
      return {
        ...g,
        codes: [...newCodeItems, ...g.codes],
      };
    }
    return g;
  });

  setVoucherGroups(updated);
  return newCodeItems;
}

export function deleteVoucherGroup(groupId: string): void {
  const currentGroups = getVoucherGroups();
  const updated = currentGroups.filter((g) => g.id !== groupId);
  setVoucherGroups(updated);
}

// Flat compatibility functions for Checkout & legacy imports
export interface VoucherRedemptionResult {
  success: boolean;
  message: string;
  voucher?: {
    code: string;
    sponsoringOrganization?: string;
    programTitle: string;
  };
}

export function checkVoucherValidity(code: string): VoucherRedemptionResult {
  const groups = getVoucherGroups();
  const normalized = code.trim().toUpperCase();

  for (const group of groups) {
    const item = group.codes.find((c) => c.code.toUpperCase() === normalized);
    if (item) {
      if (item.status === "Redeemed") {
        const by = item.redeemedBy ? `by ${item.redeemedBy.name}` : "";
        const at = item.redeemedBy ? ` on ${item.redeemedBy.redeemedAt}` : "";
        return {
          success: false,
          message: `This voucher code has already been redeemed ${by}${at}. Vouchers are single-use.`,
        };
      }

      // Check Expiry Date
      if (group.expiresAt) {
        const expiry = new Date(group.expiresAt + "T23:59:59");
        const today = new Date();
        if (today > expiry) {
          return {
            success: false,
            message: `This voucher batch expired on ${group.expiresAt} and can no longer be redeemed.`,
          };
        }
      }

      return {
        success: true,
        message: group.institution
          ? `Verified! Associated with ${group.institution}.`
          : `Verified! Valid voucher code.`,
        voucher: {
          code: item.code,
          sponsoringOrganization: group.institution || undefined,
          programTitle: group.programTitle,
        },
      };
    }
  }

  return {
    success: false,
    message: `Voucher code "${normalized}" was not found. Please verify the code and try again.`,
  };
}

export function redeemSingleVoucher(code: string, learner: { name: string; email: string }): VoucherRedemptionResult {
  const check = checkVoucherValidity(code);
  if (!check.success || !check.voucher) {
    return check;
  }

  const groups = getVoucherGroups();
  const normalized = code.trim().toUpperCase();
  const today = new Date().toISOString().split("T")[0];

  const updated = groups.map((g) => {
    return {
      ...g,
      codes: g.codes.map((c) => {
        if (c.code.toUpperCase() === normalized) {
          return {
            ...c,
            status: "Redeemed" as const,
            redeemedBy: {
              name: learner.name || "Learner",
              email: learner.email || "learner@example.com",
              redeemedAt: today,
            },
          };
        }
        return c;
      }),
    };
  });

  setVoucherGroups(updated);

  return {
    success: true,
    message: `Voucher ${code} successfully redeemed for ${learner.name}!`,
    voucher: check.voucher,
  };
}

// Flat seed for backwards compatibility
export const initialVoucherSeed: AdminVoucher[] = [];
