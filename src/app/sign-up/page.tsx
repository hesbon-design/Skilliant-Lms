import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ButtonArrow from "@/components/ui/buttonArrow";
import { GoogleLogo, Logo } from "@/lib/icons";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Sign Up | ${siteName}`,
  description: "Create an account on Skillsaint to unlock expert-led online courses and learning materials.",
};

const SignUpPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl bg-primary p-8 shadow-card sm:p-10">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo className="text-purple-500" />
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-purple-600 transition-colors hover:text-purple-500"
            >
              Log in here
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-primary px-4 py-3 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50"
          >
            <GoogleLogo />
            <span>Sign up with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-primary px-4 text-xs uppercase tracking-wider text-secondary">
                Or register with email
              </span>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Create a strong password"
                required
                className="w-full"
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-xs leading-5 text-secondary"
              >
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="underline hover:text-purple-600">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline hover:text-purple-600">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button size="lg" className="w-full justify-between py-1.5 pr-1.5 pl-6">
              <span className="w-full text-center">Get Started</span>
              <ButtonArrow />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
