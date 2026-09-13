import { blogData } from "@/components/blogs/blogData";
import { formatDate } from "@/lib/utils";
import { siteName } from "@/utils/envExport";
import { ArrowLeft } from "@/lib/icons";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogData.find((b) => b.slug.current === slug);

  if (!blog) {
    return {
      title: `Article Not Found | ${siteName}`,
    };
  }

  return {
    title: `${blog.title} | ${siteName}`,
    description: blog.shortDescription,
  };
}

const BlogDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog = blogData.find((b) => b.slug.current === slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="bg-gray-50 py-16 sm:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-primary px-4 py-2 text-sm font-medium text-secondary shadow-xs transition-colors hover:bg-gray-100 hover:text-purple-600"
          >
            <ArrowLeft className="size-4" />
            Back to Articles
          </Link>

          <h1 className="text-[clamp(2rem,1.5rem+1.5vw,3rem)] font-bold leading-tight text-gray-900">
            {blog.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-gray-200 py-4 text-sm text-secondary">
            <div className="flex items-center gap-3">
              <Image
                src={blog.author.photo || "/images/instructor/avatar.png"}
                alt={blog.author.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{blog.author.name}</p>
                <p className="text-xs text-secondary">{blog.author.title || "Author"}</p>
              </div>
            </div>
            <span className="hidden sm:inline">•</span>
            <p>Published on {formatDate(blog.date)}</p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl shadow-md">
            <Image
              src={blog.featureImage || "/images/blog/img-1.png"}
              alt={blog.title}
              width={896}
              height={504}
              className="w-full object-cover"
            />
          </div>

          <div className="mt-10 space-y-6 text-base leading-8 text-gray-700">
            <p className="text-lg leading-relaxed font-medium text-gray-900">
              {blog.shortDescription}
            </p>
            <p>
              In today&apos;s fast-evolving technological landscape, continuous learning and adapting your skill set are vital for professional excellence. Whether you are stepping into web development, refining your design workflow, or launching high-performance digital products, acquiring structured fundamentals sets you up for enduring success.
            </p>
            <h2 className="pt-4 text-2xl font-bold text-gray-900">
              Key Takeaways and Practical Application
            </h2>
            <p>
              Every great developer, designer, and marketer starts with curiosity and disciplined practice. Breaking down complex problems into modular, manageable components enables developers to write clean, maintainable code and build scalable user experiences that delight end users.
            </p>
            <blockquote className="rounded-2xl border-l-4 border-purple-500 bg-purple-50 p-6 italic text-purple-900">
              &ldquo;The best way to predict the future of technology is to build it with purpose, precision, and a relentless focus on the user experience.&rdquo;
            </blockquote>
            <p>
              Keep experimenting with new tools, contribute to collaborative open-source projects, and never stop building solutions that matter.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogDetailsPage;
