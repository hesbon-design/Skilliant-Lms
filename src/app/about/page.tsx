import PageHeader from "@/components/pageHeader";
import Features from "@/components/features";
import OurAchievements from "@/components/ourAchievements";
import Testimonial from "@/components/testimonial";
import Cta from "@/components/cta";
import Image from "next/image";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";
import { Check } from "@/lib/icons";

export const metadata: Metadata = {
  title: `About Us | ${siteName}`,
  description: "Learn more about Skillsaint and our mission to empower learners worldwide.",
};

const AboutPage = () => {
  return (
    <main>
      <PageHeader
        subTitle="About Us"
        description="Empowering curious minds to master modern skills through flexible, expert-led online education."
      >
        Transforming How The World Learns
      </PageHeader>

      {/* Story & Mission Section */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-28">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <Image
                src="/images/about/about.png"
                alt="About Skillsaint"
                width={570}
                height={400}
                className="w-full rounded-3xl object-cover shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-purple-50 px-4 py-1.5 text-sm font-semibold text-purple-600">
                Our Story
              </span>
              <h2 className="text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-bold leading-tight text-gray-900">
                We bridge the gap between ambitious learners and industry-leading experts.
              </h2>
              <p className="text-base leading-7 text-secondary">
                Skillsaint was founded on a simple belief: high-impact, industry-relevant learning should be accessible to anyone, anywhere. We build curated curriculums in web development, design, digital marketing, and artificial intelligence that turn curiosity into career growth.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  "Hands-on, real-world project portfolios",
                  "Direct mentorship and community support",
                  "Verified certifications recognized by leading tech companies",
                  "Flexible, self-paced learning schedules",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-secondary">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <OurAchievements />
      <Features />
      <Testimonial />
      <Cta className="pb-16 sm:pb-20 lg:pb-28" />
    </main>
  );
};

export default AboutPage;
