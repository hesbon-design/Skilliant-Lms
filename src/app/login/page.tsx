import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ButtonArrow from "@/components/ui/buttonArrow";
import { GoogleLogo, Logo } from "@/lib/icons";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Login | ${siteName}`,
  description: "Sign in to your Skillsaint account to access your courses and track your progress.",
};

const LoginPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl bg-primary p-8 shadow-card sm:p-10">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo className="text-purple-500" />
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-purple-600 transition-colors hover:text-purple-500"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-primary px-4 py-3 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50"
          >
            <GoogleLogo />
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-primary px-4 text-xs uppercase tracking-wider text-secondary">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-5">
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
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-secondary"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button size="lg" className="w-full justify-between py-1.5 pr-1.5 pl-6">
              <span className="w-full text-center">Sign In</span>
              <ButtonArrow />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
