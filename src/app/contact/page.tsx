import PageHeader from "@/components/pageHeader";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import ButtonArrow from "@/components/ui/buttonArrow";
import { Message, Telephone, Globe } from "@/lib/icons";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact Us | ${siteName}`,
  description: "Get in touch with the Skillsaint team for inquiries, support, or partnership opportunities.",
};

const contactInfo = [
  {
    icon: <Telephone />,
    title: "Call Us",
    detail: "+1 (555) 234-5678",
    subtitle: "Mon-Fri from 9am to 6pm EST",
  },
  {
    icon: <Message />,
    title: "Email Us",
    detail: "hello@skillsaint.com",
    subtitle: "We typically respond within 24 hours",
  },
  {
    icon: <Globe />,
    title: "Visit Us",
    detail: "San Francisco, CA",
    subtitle: "100 Innovation Way, Suite 400",
  },
];

const ContactPage = () => {
  return (
    <main>
      <PageHeader
        subTitle="Contact Us"
        description="Have questions or feedback? We’d love to hear from you. Send us a message and our team will get back to you shortly."
      >
        Let&apos;s Start a Conversation
      </PageHeader>

      <section className="bg-gray-50 py-16 sm:py-20 lg:py-28">
        <div className="container">
          {/* Contact Info Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-gray-200/80 bg-primary p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-purple-200"
              >
                <div className="flex size-13 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  {info.icon}
                </div>
                <h4 className="mt-5 text-lg font-semibold text-gray-900">
                  {info.title}
                </h4>
                <p className="mt-1.5 font-medium text-purple-600">
                  {info.detail}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  {info.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="mt-12 rounded-3xl bg-primary p-8 shadow-card sm:p-12 lg:mt-16">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Send us a message
              </h3>
              <p className="mt-2 text-sm leading-6 text-secondary">
                Fill out the form below and our customer support team will be in touch.
              </p>
            </div>

            <form className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input placeholder="John Doe" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input type="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <Input placeholder="Course Inquiry" required />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <Textarea
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button size="lg" className="py-1.5 pr-1.5 pl-6">
                <span className="w-full text-center">Submit Message</span>
                <ButtonArrow />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
