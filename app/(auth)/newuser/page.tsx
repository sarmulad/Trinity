"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/layout/logo";
import DashboardPreviews from "@/components/layout/dashboard-previews";

export default function NewUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [accessCode, setAccessCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push(`/signup?code=${accessCode}`);
      } else {
        setError(data.error || "Invalid access code. Please try again.");
      }
    } catch (error) {
      console.error("Access code error:", error);
      setError("An unexpected error occurred. Please try again.");
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

      <div className="relative z-10 hidden w-1/2 flex-col justify-start gap-[25%] items-start overflow-hidden p-12 lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85 mix-blend-luminosity"
          style={{ backgroundImage: "url('/images/map.png')" }}
        />

        <div className="relative z-10">
          <Logo width={"200px"} height={"50px"} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <DashboardPreviews />
          <div className="text-center max-w-[348px]">
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

      {/* Right Side */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-[455px] space-y-8">
          <div className="rounded-[8px] bg-[#1A1C1E] p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-semibold text-white">
                New User
              </h1>
              <p className="text-pretty text-sm text-white/60">
                If you were invited to this app, please below enter the access
                code from your invite email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <Label htmlFor="accessCode" className="text-sm text-white/80">
                  Text
                </Label>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={isLoading}
                  className="h-12 border-white/10 rounded-[8px] bg-transparent text-white placeholder:text-white/40"
                />
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-lg bg-[#34C759] !mb-6 text-base font-medium text-white hover:bg-[#22c55e]"
              >
                {isLoading ? "Verifying..." : "Submit"}
              </Button>
            </form>

            <p className="text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#34C759] hover:text-[#22c55e]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
