import PageHeader from "@/components/pageHeader";
import BlogCard from "@/components/blogs/blogCard";
import { blogData } from "@/components/blogs/blogData";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog | ${siteName}`,
  description: "Read the latest tutorials, tips, and insights from industry experts on Skillsaint.",
};

const BlogPage = () => {
  const blogs = blogData;

  return (
    <main>
      <PageHeader
        subTitle="Knowledge Hub"
        description="Explore in-depth articles, actionable coding guides, and design best practices crafted by experienced creators."
      >
        Articles & Learning Insights
      </PageHeader>

      <section className="bg-gray-50 py-16 sm:py-20 lg:py-28">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog._id} className="rounded-3xl bg-primary p-4 shadow-card">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
