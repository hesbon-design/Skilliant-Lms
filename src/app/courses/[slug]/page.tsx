import SectionTitle from "@/components/sectionTitle";
import Button from "@/components/ui/button";
import ButtonArrow from "@/components/ui/buttonArrow";
import Image from "next/image";
import Link from "next/link";
import CourseContent from "./courseContent";
import Cta from "@/components/cta";
import BackButton from "./backButton";
import EnrolledTabs from "./enrolledTabs";
import BundleDetailsView from "./bundleDetailsView";
import { coursesData } from "@/components/courses/courseData";
import { notFound } from "next/navigation";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = coursesData.find((c) => c.slug.current === slug);

  if (!course) {
    return {
      title: `Course Not Found | ${siteName}`,
    };
  }

  return {
    title: `${course.title} | ${siteName}`,
    description: course.shortDescription,
  };
}

const CourseDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const course = coursesData.find((c) => c.slug.current === slug);

  if (!course) {
    notFound();
  }

  if (course.isBundle) {
    return (
      <main>
        <BundleDetailsView course={course} />
        <Cta className="pb-16 sm:pb-20 lg:pb-28" />
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gray-50 pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pb-28">
        <div className="container">
          <div className="xl:px-24">
            <BackButton />
            <div className="mt-10 flex flex-col items-start justify-between gap-x-5 gap-y-8 lg:flex-row">
              <div className="w-full shrink space-y-12 lg:max-w-150">
                <div>
                  <SectionTitle
                    subTitle="Courses Details"
                    description={
                      course.shortDescription ||
                      "Grow your skills with expert-led lessons designed to help you achieve your goals — anytime, anywhere."
                    }
                    descriptionClass="max-w-full"
                  >
                    {course.title}
                  </SectionTitle>
                  {/* course level and stats */}
                  <div className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                        {course.level || "Intermediate"}
                      </span>
                      {course.isCertificationProvide && (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Verified Certificate
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                      <span className="text-yellow-400">★</span>
                      <span>5.0</span>
                      <span className="text-xs text-gray-400 font-normal">
                        ({course.totalLearners ? `${course.totalLearners} learners` : "Accredited"})
                      </span>
                    </div>
                  </div>
                </div>
                {/* thumb */}
                <div>
                  <Image
                    width={586}
                    height={343}
                    sizes="100vw"
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full rounded-2xl object-cover"
                  />
                </div>

                {/* Tabs & Content matching course progres.png */}
                <EnrolledTabs courseSlug={course.slug.current}>
                  <div className="space-y-10">
                    {/* About Course */}
                    <div>
                      <h4 className="font-mulish text-xl font-bold sm:text-2xl text-gray-900">
                        About Course
                      </h4>
                      <div className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
                        <p>{course.shortDescription}</p>
                        <p>
                          Master professional workflows, tools, and best practices. Across {course.lessonsCount} lessons and comprehensive hands-on exercises, you will develop practical portfolio-ready skills.
                        </p>
                      </div>
                    </div>

                    {/* What Will You Learn */}
                    <div>
                      <h4 className="font-mulish text-xl font-bold sm:text-2xl text-gray-900">
                        What Will You Learn?
                      </h4>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>Navigate professional toolsets confidently</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>Execute real-world industry projects</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>Apply core theory and best practice workflows</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>Build a portfolio-ready body of work</span>
                        </li>
                      </ul>
                    </div>

                    {/* Course Content Accordions */}
                    <div>
                      <h4 className="font-mulish text-xl font-bold sm:text-2xl text-gray-900 mb-4">
                        Course Content
                      </h4>
                      <CourseContent />
                    </div>
                  </div>
                </EnrolledTabs>
              </div>

              {/* Right Sidebar matching course progres.png */}
              <div className="sticky top-24 w-full space-y-6 lg:max-w-93.25">
                {/* Card 1: Course Progress */}
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-lg">Course Progress</h4>
                  <div className="mt-3 flex items-center justify-between text-sm font-medium text-gray-600">
                    <span>0/{course.lessonsCount || 18}</span>
                    <span className="text-purple-600 font-bold">0% Complete</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-purple-600" style={{ width: "0%" }} />
                  </div>

                  <Link
                    href={`/learn/${course.slug.current}`}
                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-purple-600 py-3 text-base font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                  >
                    Start Learning
                  </Link>
                  <button
                    className="mt-3 flex w-full items-center justify-center rounded-xl border-2 border-purple-600 py-2.5 text-base font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    Complete Course
                  </button>

                  <div className="mt-5 space-y-3.5 pt-5 border-t border-gray-100 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2.5 text-purple-900 bg-purple-50 border border-purple-100 rounded-xl p-3">
                      <span className="text-base">🎓</span>
                      <span>You enrolled in this course on September 12, 2026</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-1">
                      <span className="text-purple-600 text-base">📶</span>
                      <span className="capitalize">{course.level || "Beginner"}</span>
                    </div>
                    {course.isCertificationProvide && (
                      <div className="flex items-center gap-2.5 px-1">
                        <span className="text-purple-600 text-base">📜</span>
                        <span>Certificate of completion</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 2: Material Includes */}
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-base">Material Includes</h4>
                  <ul className="mt-4 space-y-3 text-sm font-medium text-gray-700">
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Comprehensive starter pack &amp; resources</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Hands-on worksheets &amp; exercises</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Downloadable cheatsheets &amp; guides</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Portfolio project checklist</span>
                    </li>
                  </ul>
                </div>

                {/* Card 4: Requirements */}
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-base">Requirements</h4>
                  <ul className="mt-4 space-y-3 text-sm font-medium text-gray-700">
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Computer or tablet with internet connection</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Relevant free software installed</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>No prior experience required to begin</span>
                    </li>
                  </ul>
                </div>

                {/* Card 5: Audience */}
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-base">Audience</h4>
                  <ul className="mt-4 space-y-3 text-sm font-medium text-gray-700">
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Beginner practitioners and career starters</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Professionals moving into new disciplines</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-purple-600 font-bold text-base">•</span>
                      <span>Freelancers seeking higher-paying skills</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Cta className="pb-16 sm:pb-20 lg:pb-28" />
    </main>
  );
};

export default CourseDetails;
