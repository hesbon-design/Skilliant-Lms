"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ButtonArrow from "@/components/ui/buttonArrow";
import { GoogleLogo } from "@/lib/icons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push("/dashboard");
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    router.push("/dashboard");
  };

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-primary px-4 py-3 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
      >
        <GoogleLogo />
        <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex.mercer@skillsaint.com"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-secondary cursor-pointer"
          >
            Remember me for 30 days
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full justify-between py-1.5 pr-1.5 pl-6"
        >
          <span className="w-full text-center">
            {isLoading ? "Signing In..." : "Sign In"}
          </span>
          <ButtonArrow />
        </Button>
      </form>
    </div>
  );
}
