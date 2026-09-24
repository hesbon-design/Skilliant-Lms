export interface AdminCoupon {
  id: string;
  code: string;
  title: string;
  method?: "code" | "automatic";
  discountType: "percentage" | "fixed" | "free";
  discountValue: number;
  applicableType: "all" | "course" | "track" | "category";
  applicableTargetName?: string;
  usageLimit: number | null; // null = unlimited
  limitPerCustomer?: number | null;
  usedCount: number;
  minRequirementType?: "none" | "amount" | "quantity";
  minPurchaseAmount?: number;
  minQuantity?: number;
  startDate?: string;
  startTime?: string;
  hasEndDate?: boolean;
  expiryDate: string;
  expiryTime?: string;
  status: "active" | "draft" | "expired";
  createdAt: string;
}

export const initialAdminCoupons: AdminCoupon[] = [
  {
    id: "coup-1",
    code: "SKILLIANT20",
    title: "Global Launch Promotional Discount",
    discountType: "percentage",
    discountValue: 20,
    applicableType: "all",
    applicableTargetName: "All Catalog Courses",
    usageLimit: 500,
    usedCount: 142,
    minPurchaseAmount: 0,
    expiryDate: "2026-12-31",
    status: "active",
    createdAt: "2026-08-01",
  },
  {
    id: "coup-2",
    code: "SAVE50",
    title: "Industrial Machinery Operator Summer Flash Sale",
    discountType: "fixed",
    discountValue: 50,
    applicableType: "track",
    applicableTargetName: "Industrial Machine Operator Track",
    usageLimit: 100,
    usedCount: 78,
    minPurchaseAmount: 150,
    expiryDate: "2026-10-31",
    status: "active",
    createdAt: "2026-08-15",
  },
  {
    id: "coup-3",
    code: "BOOTCAMP30",
    title: "Full-Stack Web Development Fast-Track",
    discountType: "percentage",
    discountValue: 30,
    applicableType: "course",
    applicableTargetName: "The Complete Web Development Bootcamp",
    usageLimit: 250,
    usedCount: 119,
    minPurchaseAmount: 50,
    expiryDate: "2026-11-30",
    status: "active",
    createdAt: "2026-09-01",
  },
  {
    id: "coup-4",
    code: "WELCOME10",
    title: "New Student Welcome Incentive",
    discountType: "percentage",
    discountValue: 10,
    applicableType: "all",
    applicableTargetName: "All Catalog Courses",
    usageLimit: null,
    usedCount: 312,
    minPurchaseAmount: 0,
    expiryDate: "2027-01-01",
    status: "active",
    createdAt: "2026-07-10",
  },
  {
    id: "coup-5",
    code: "EARLYBIRD40",
    title: "Q2 Early Bird Certification Campaign",
    discountType: "percentage",
    discountValue: 40,
    applicableType: "all",
    applicableTargetName: "All Catalog Courses",
    usageLimit: 100,
    usedCount: 100,
    minPurchaseAmount: 100,
    expiryDate: "2026-06-30",
    status: "expired",
    createdAt: "2026-05-01",
  },
  {
    id: "coup-6",
    code: "PARTNER25",
    title: "B2B Academic Partner Special",
    discountType: "percentage",
    discountValue: 25,
    applicableType: "track",
    applicableTargetName: "Data Science & AI Leadership Track",
    usageLimit: 50,
    usedCount: 0,
    minPurchaseAmount: 200,
    expiryDate: "2026-12-15",
    status: "draft",
    createdAt: "2026-09-10",
  },
];
