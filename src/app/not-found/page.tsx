import NotFound from "../not-found";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Page Not Found | ${siteName}`,
  description: "The page you are looking for does not exist or has been moved.",
};

const NotFoundDemoPage = () => {
  return <NotFound />;
};

export default NotFoundDemoPage;
