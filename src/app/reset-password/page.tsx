import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ButtonArrow from "@/components/ui/buttonArrow";
import { Logo } from "@/lib/icons";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Reset Password | ${siteName}`,
  description: "Reset your Skillsaint account password to regain access to your courses.",
};

const ResetPasswordPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl bg-primary p-8 shadow-card sm:p-10">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo className="text-purple-500" />
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Enter the email address associated with your account and we&apos;ll send you a recovery link.
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full"
            />
          </div>

          <Button size="lg" className="w-full justify-between py-1.5 pr-1.5 pl-6">
            <span className="w-full text-center">Send Reset Link</span>
            <ButtonArrow />
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-500"
            >
              Remember your password? Back to login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
