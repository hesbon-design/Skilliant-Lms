import PageHeader from "@/components/pageHeader";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteName}`,
  description: "Understand how Skillsaint collects, stores, and protects your personal data and privacy.",
};

const PrivacyPolicyPage = () => {
  return (
    <main>
      <PageHeader
        subTitle="Legal & Policies"
        description="We are committed to safeguarding your privacy and ensuring transparency in how your personal data is handled."
      >
        Privacy Policy
      </PageHeader>

      <section className="bg-gray-50 py-16 sm:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 shadow-card sm:p-12 space-y-8 text-secondary leading-7">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                1. Information We Collect
              </h2>
              <p className="mt-3">
                We collect personal information that you provide when registering, purchasing a course, or interacting with our services. This includes your name, email address, payment details (processed securely via PCI-compliant payment gateways), and profile preferences.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                2. How We Use Your Data
              </h2>
              <p className="mt-3">
                Your data is utilized to provision course access, track learning milestones, process transactions, communicate platform updates, and deliver responsive customer support. We do not sell or rent personal information to third-party advertisers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                3. Cookies & Session Analytics
              </h2>
              <p className="mt-3">
                We employ necessary session cookies and analytics beacons to preserve your login session, measure website performance, and remember learner settings across devices.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                4. Data Protection & Security
              </h2>
              <p className="mt-3">
                {siteName} enforces strict encryption standards, secure HTTPS transport, and role-based access restrictions to protect against unauthorized data breach or disclosure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                5. Your Privacy Rights
              </h2>
              <p className="mt-3">
                Depending on your location, you have rights to access, rectify, or request deletion of your personal data stored within our systems. To exercise these rights, please reach out to our data privacy team.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
              <p>Last updated: January 2026. For questions regarding this policy, contact privacy@{siteName.toLowerCase()}.com.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
