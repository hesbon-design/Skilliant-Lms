export interface AdminPaymentRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  items: {
    title: string;
    type: "course" | "bundle" | "specialization";
    quantity: number;
    price: number;
  }[];
  amount: number;
  paymentMethod: "Credit Card (Stripe)" | "Bank Wire / Manual Invoice" | "Company Voucher ($0.00)";
  pricingType: "One-Time" | "Course Installment" | "Sponsored Voucher";
  status: "Completed" | "Pending Wire Transfer" | "Refunded";
  transactionDate: string;
  invoiceUrl: string;
}

export const initialAdminPayments: AdminPaymentRecord[] = [
  {
    id: "pay-101",
    orderNumber: "ORD-2026-8812",
    customerName: "Sarah Jenkins",
    customerEmail: "s.jenkins@outlook.com",
    items: [
      {
        title: "The Complete Web Development Bootcamp",
        type: "course",
        quantity: 1,
        price: 120,
      },
    ],
    amount: 120,
    paymentMethod: "Credit Card (Stripe)",
    pricingType: "One-Time",
    status: "Completed",
    transactionDate: "2026-08-15 14:22",
    invoiceUrl: "#",
  },
  {
    id: "pay-102",
    orderNumber: "ORD-2026-8813",
    customerName: "Carlos Mendez",
    customerEmail: "c.mendez@metrotransit.org",
    items: [
      {
        title: "Full-Stack UX & Design Systems Specialization",
        type: "specialization",
        quantity: 1,
        price: 199,
      },
    ],
    amount: 199,
    paymentMethod: "Credit Card (Stripe)",
    pricingType: "One-Time",
    status: "Completed",
    transactionDate: "2026-09-02 09:41",
    invoiceUrl: "#",
  },
  {
    id: "pay-103",
    orderNumber: "ORD-2026-8814",
    customerName: "Apex Logistics Procurement",
    customerEmail: "finance@apexlogistics.com",
    companyName: "Apex Industrial Logistics",
    items: [
      {
        title: "Industrial Machine Operator Specialization (Cohort Batch)",
        type: "specialization",
        quantity: 10,
        price: 350,
      },
    ],
    amount: 3500,
    paymentMethod: "Bank Wire / Manual Invoice",
    pricingType: "One-Time",
    status: "Pending Wire Transfer",
    transactionDate: "2026-09-08 16:30",
    invoiceUrl: "#",
  },
  {
    id: "pay-104",
    orderNumber: "ORD-2026-8815",
    customerName: "Alex Mercer",
    customerEmail: "a.mercer@apexlogistics.com",
    companyName: "Apex Industrial Logistics",
    items: [
      {
        title: "Industrial Machine Operator Specialization",
        type: "specialization",
        quantity: 1,
        price: 450,
      },
    ],
    amount: 0,
    paymentMethod: "Company Voucher ($0.00)",
    pricingType: "Sponsored Voucher",
    status: "Completed",
    transactionDate: "2026-08-01 11:05",
    invoiceUrl: "#",
  },
  {
    id: "pay-105",
    orderNumber: "ORD-2026-8816",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@gmail.com",
    items: [
      {
        title: "Python for Data Science & Predictive Maintenance",
        type: "course",
        quantity: 1,
        price: 59,
      },
    ],
    amount: 59,
    paymentMethod: "Credit Card (Stripe)",
    pricingType: "Course Installment",
    status: "Completed",
    transactionDate: "2026-09-08 19:12",
    invoiceUrl: "#",
  },
  {
    id: "pay-106",
    orderNumber: "ORD-2026-8817",
    customerName: "Metro Transit Academy",
    customerEmail: "billing@metrotransit.org",
    companyName: "Metro Transit Authority",
    items: [
      {
        title: "Heavy Excavator & Hydraulic Systems (Fleet Training)",
        type: "course",
        quantity: 5,
        price: 220,
      },
    ],
    amount: 1100,
    paymentMethod: "Bank Wire / Manual Invoice",
    pricingType: "One-Time",
    status: "Completed",
    transactionDate: "2026-08-20 10:15",
    invoiceUrl: "#",
  },
  {
    id: "pay-107",
    orderNumber: "ORD-2026-8818",
    customerName: "Direct Enterprise Client",
    customerEmail: "accounts@directenterprise.com",
    companyName: "Direct Enterprise Client",
    items: [
      {
        title: "Industrial Machine Operator Track (Voucher Batch #04)",
        type: "bundle",
        quantity: 4,
        price: 450,
      },
    ],
    amount: 1800,
    paymentMethod: "Bank Wire / Manual Invoice",
    pricingType: "One-Time",
    status: "Pending Wire Transfer",
    transactionDate: "2026-09-11 13:04",
    invoiceUrl: "#",
  },
];
