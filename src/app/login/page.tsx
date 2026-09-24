import { Logo } from "@/lib/icons";
import { siteName } from "@/utils/envExport";
import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./loginForm";

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

        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
