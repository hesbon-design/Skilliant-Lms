
export interface BundleSubCourseItem {
  id: string;
  title: string;
  durationHours: number;
  lessonsCount: number;
  instructor?: string;
  shortDescription?: string;
  topics?: string[];
  level?: string;
}

export type CourseType = {
  _id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  instructor: {
     name: string;
  };
  totalLearners: number;
  isCertificationProvide: boolean;
  price: number;
  discountPrice: number;
  status: "Ongoing" | "Completed";
  slug: {
    current: string;
  };
  level: string;
  overview: [];
  duration?: number; // in minutes
  lessonsCount?: number;
  // Bundle / Specialization fields
  isBundle?: boolean;
  bundleCoursesCount?: number;
  bundleSavingsPercent?: number;
  bundleIndividualTotalPrice?: number;
  bundleCourses?: BundleSubCourseItem[];
  certificateTitle?: string;
  specializationTrack?: string;
};
