export interface CartItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  instructor: string;
  price: number;
  originalPrice: number;
  quantity: number; // Seats
  type: "course" | "bundle" | "track";
  format: string;
}

export interface AppliedVoucher {
  code: string;
  discountPercent: number; // 100 for zero-balance
  sponsoredBy: string;
  programCovered: string;
}

export interface AppliedCoupon {
  code: string;
  type: "percentage" | "fixed";
  amount: number;
}

export interface PayLaterOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  items: {
    title: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "Pending Payment / Invoice Due" | "Paid / Active" | "Cancelled";
  orderDate: string;
  dueDate: string;
  invoiceUrl: string;
  notes?: string;
}

export const initialCartItems: CartItem[] = [
  {
    id: "cart-1",
    title: "Complete React Developer Course",
    slug: "complete-react-developer",
    thumbnail: "/images/courses/img-1.png",
    instructor: "John Doe",
    price: 79,
    originalPrice: 120,
    quantity: 1,
    type: "course",
    format: "Self-Paced + Practical Drills",
  },
  {
    id: "cart-2",
    title: "Industrial Machine Operator Track",
    slug: "nextjs-fullstack-bootcamp",
    thumbnail: "/images/courses/img-2.png",
    instructor: "Sarah Jenkins & Technical Board",
    price: 249,
    originalPrice: 350,
    quantity: 1,
    type: "track",
    format: "Multi-Course Certification Bundle",
  },
];

export const validVouchers: Record<string, AppliedVoucher> = {
  "SKL-APEX-2026": {
    code: "SKL-APEX-2026",
    discountPercent: 100,
    sponsoredBy: "Apex Industrial Logistics",
    programCovered: "Industrial Machine Operator Track",
  },
  "VOUCHER-DEV-100": {
    code: "VOUCHER-DEV-100",
    discountPercent: 100,
    sponsoredBy: "TechCorp Global Academy",
    programCovered: "Complete React Developer Course",
  },
  "APEX-FL-FREE": {
    code: "APEX-FL-FREE",
    discountPercent: 100,
    sponsoredBy: "Apex Industrial Logistics",
    programCovered: "Forklift Safety & Zero-Fault Inspection",
  },
};

export const validCoupons: Record<string, AppliedCoupon> = {
  SKILLIANT20: {
    code: "SKILLIANT20",
    type: "percentage",
    amount: 20,
  },
  SAVE50: {
    code: "SAVE50",
    type: "fixed",
    amount: 50,
  },
};

export const mockPayLaterOrders: PayLaterOrder[] = [
  {
    id: "ord-1",
    orderNumber: "INV-2026-0891",
    customerName: "David Henderson",
    customerEmail: "d.henderson@summitlogistics.org",
    companyName: "Summit Logistics Inc.",
    items: [
      {
        title: "Commercial Fleet Defensive Driving (5 Seats)",
        quantity: 5,
        price: 975,
      },
    ],
    totalAmount: 975,
    status: "Pending Payment / Invoice Due",
    orderDate: "2026-09-11 14:22",
    dueDate: "2026-10-11",
    invoiceUrl: "#",
    notes: "Requires PO-8819 on official invoice. Bank wire pending.",
  },
  {
    id: "ord-2",
    orderNumber: "INV-2026-0882",
    customerName: "Kavita Patel",
    customerEmail: "k.patel@horizonworks.tech",
    companyName: "Horizon Works Technical",
    items: [
      {
        title: "Industrial Machine Operator Track (3 Seats)",
        quantity: 3,
        price: 747,
      },
    ],
    totalAmount: 747,
    status: "Pending Payment / Invoice Due",
    orderDate: "2026-09-10 09:15",
    dueDate: "2026-10-10",
    invoiceUrl: "#",
    notes: "Requested split invoice for accounting cycle.",
  },
  {
    id: "ord-3",
    orderNumber: "INV-2026-0850",
    customerName: "Carlos Ramirez",
    customerEmail: "carlos@baymaterials.com",
    companyName: "Bay Materials Handling",
    items: [
      {
        title: "Forklift Safety & Zero-Fault Inspection (10 Seats)",
        quantity: 10,
        price: 1800,
      },
    ],
    totalAmount: 1800,
    status: "Paid / Active",
    orderDate: "2026-09-02 11:40",
    dueDate: "2026-10-02",
    invoiceUrl: "#",
    notes: "Wire received and cleared via Chase Treasury. Access unlocked.",
  },
];
