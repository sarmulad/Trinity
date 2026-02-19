"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI, APIError } from "@/lib/api-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/layout/logo";
import DashboardPreviews from "@/components/layout/dashboard-previews";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authAPI.login(formData.email, formData.password);

      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/dashboard-bg.png')" }}
      />
      <div className="absolute inset-0 z-0 bg-[#1A1C1E]/75" />

      <div className="relative hidden w-1/2 flex-col justify-start gap-[25%] items-start overflow-hidden p-12 lg:flex">
        <div
          className="absolute inset-0 w-full bg-cover bg-center bg-no-repeat opacity-85 mix-blend-luminosity"
          style={{ backgroundImage: "url('/images/map.png')" }}
        />

        <div className=" z-10 ">
          <Logo width={"200px"} height={"50px"} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <DashboardPreviews />
          <div className="relative z-10 text-center max-w-[348px]">
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Monitor oil wells in real time
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-white/70">
              Track production data, receive instant alarms, message your team,
              and compare wells from one clear dashboard.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/60" />
              <div className="h-2 w-2 rounded-full bg-white/30" />
              <div className="h-2 w-2 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-[455px] space-y-8">
          <div className="rounded-[8px] bg-[#1A1C1E] p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-semibold text-white">
                Welcome back
              </h1>
              <p className="text-pretty text-sm text-white/60">
                Your wells are live. Check alerts, review performance, and
                compare results from your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="email" className="text-sm text-white/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="h-12 border-white/10 rounded-[8px] bg-transparent  text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-white/80">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="*********"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="h-12 border-white/10 bg-transparent rounded-[8px] pr-12 text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#34C759] hover:text-[#22c55e]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                <div className="flex justify-end !my-6">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#34C759] hover:text-[#22c55e]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-lg bg-[#34C759] !mb-6 text-base font-medium text-white hover:bg-[#22c55e]"
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>
            <p className="text-center text-sm text-white/60">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#34C759] hover:text-[#22c55e]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
