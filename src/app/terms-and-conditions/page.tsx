import PageHeader from "@/components/pageHeader";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Terms and Conditions | ${siteName}`,
  description: "Read the Terms and Conditions governing your access and use of the Skillsaint learning platform.",
};

const TermsPage = () => {
  return (
    <main>
      <PageHeader
        subTitle="Legal & Policies"
        description="Please review our terms of service carefully before accessing our learning resources and platform services."
      >
        Terms and Conditions
      </PageHeader>

      <section className="bg-gray-50 py-16 sm:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 shadow-card sm:p-12 space-y-8 text-secondary leading-7">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing or using the {siteName} platform, websites, services, or mobile experiences, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree, you must immediately discontinue use of the platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                2. User Accounts & Registration
              </h2>
              <p className="mt-3">
                To access certain courses and features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to maintain the security of your login credentials. You are responsible for all activities occurring under your account.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                3. Course Access & Intellectual Property
              </h2>
              <p className="mt-3">
                All video lessons, interactive materials, source code, quizzes, and documentation provided through {siteName} are the intellectual property of {siteName} and its instructors. You are granted a limited, non-exclusive, non-transferable license for personal, non-commercial educational purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                4. Payments, Enrollments, and Refunds
              </h2>
              <p className="mt-3">
                Course prices and promotional discounts are listed in USD unless stated otherwise. Enrollment fees must be paid in full prior to accessing premium materials. We offer standard refund windows as outlined in our Refund Policy for qualifying purchases.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                5. Code of Conduct
              </h2>
              <p className="mt-3">
                Learners must uphold respectful and constructive communication within community forums, discussion threads, and review sections. Harassment, unauthorized commercial promotion, and plagiarism will result in immediate suspension or termination of access.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                6. Limitation of Liability
              </h2>
              <p className="mt-3">
                In no event shall {siteName}, its affiliates, or instructors be liable for indirect, incidental, or consequential damages resulting from platform downtime or reliance on educational materials.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
              <p>Last updated: January 2026. For inquiries regarding our terms, please contact legal@{siteName.toLowerCase()}.com.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;
