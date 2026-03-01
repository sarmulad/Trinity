"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Info,
  Mail,
  LogOut,
  Upload,
  CircleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
  { value: "green", label: "Green", color: "#34C759" },
  { value: "blue", label: "Blue", color: "#3b82f6" },
  { value: "red", label: "Red", color: "#ef4444" },
];

const COMPANY_OPTIONS = [
  { value: "trinity", label: "Trinity Energy" },
  { value: "other", label: "Other Company" },
];

interface LabelWithInfoProps {
  label: string;
  children: React.ReactNode;
  helperText?: string;
  className?: string;
}

function LabelWithInfo({
  label,
  children,
  helperText,
  className,
}: LabelWithInfoProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium text-white">{label}</Label>
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-white/60"
          title={`${label} info`}
        >
          <Info className="h-2.5 w-2.5" />
        </span>
      </div>
      {children}
      {helperText && (
        <p className="text-xs text-blue-400">{helperText}</p>
      )}
    </div>
  );
}

function ProfileHeader() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar className="h-24 w-24 rounded-full border-4 border-white/10">
        <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
        <AvatarFallback className="bg-[#34C759] text-2xl text-black">
          CK
        </AvatarFallback>
      </Avatar>
      <Button className="bg-[#34C759] text-black hover:bg-[#34C759]/90">
        <Upload className="mr-2 h-4 w-4" />
        Upload Display Image
      </Button>
    </div>
  );
}

function BioSection() {
  const [firstName, setFirstName] = React.useState("Chris");
  const [lastName, setLastName] = React.useState("Kurz");
  const [companyPhone, setCompanyPhone] = React.useState("469-600-8888");

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Bio</h2>
      <div className="grid gap-4 sm:grid-cols-1">
        <LabelWithInfo label="First Name">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-white/20 bg-[#252930] text-white placeholder:text-white/40"
          />
        </LabelWithInfo>
        <LabelWithInfo label="Last Name">
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-white/20 bg-[#252930] text-white placeholder:text-white/40"
          />
        </LabelWithInfo>
        <LabelWithInfo
          label="Company Phone Number"
          helperText="Phone number used for alarms"
        >
          <div className="relative">
            <Input
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="border-white/20 bg-[#252930] pr-10 text-white placeholder:text-white/40"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <CircleAlert className="h-3.5 w-3.5" />
            </span>
          </div>
        </LabelWithInfo>
      </div>
    </section>
  );
}

function AccountSection() {
  const [email, setEmail] = React.useState("chriskurz@trinity.com");

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Account</h2>
      <div className="space-y-4">
        <LabelWithInfo label="Email">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="border-white/20 bg-[#252930] pl-10 pr-10 text-white placeholder:text-white/40"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <CircleAlert className="h-3.5 w-3.5" />
            </span>
          </div>
        </LabelWithInfo>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-[#34C759] text-black hover:bg-[#34C759]/90">
            Reset Password
          </Button>
          <Button
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </section>
  );
}

function PreferencesSection() {
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [color, setColor] = React.useState("green");
  const [defaultCompany, setDefaultCompany] = React.useState("trinity");

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label className="text-sm font-medium text-white">
            Enable Push Notifications
          </Label>
          <Switch
            checked={pushEnabled}
            onCheckedChange={setPushEnabled}
            className="data-[state=checked]:bg-[#34C759]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white">
            Color Picker
          </Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="border-white/20 bg-[#252930] text-white [&>svg]:text-[#34C759]">
              <span className="flex flex-1 items-center gap-2">
                <span
                  className="h-4 w-4 shrink-0 rounded border border-white/20"
                  style={{
                    backgroundColor:
                      COLOR_OPTIONS.find((c) => c.value === color)?.color ??
                      "#34C759",
                  }}
                />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#252930]">
              {COLOR_OPTIONS.map((c) => (
                <SelectItem
                  key={c.value}
                  value={c.value}
                  className="text-white focus:bg-white/10 focus:text-white"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded border border-white/20"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <LabelWithInfo label="Default Company Only">
          <Select value={defaultCompany} onValueChange={setDefaultCompany}>
            <SelectTrigger className="border-white/20 bg-[#252930] text-white [&>svg]:text-[#34C759]">
              <span className="flex flex-1 items-center gap-2">
                <svg
                  className="h-4 w-4 shrink-0 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#252930]">
              {COMPANY_OPTIONS.map((c) => (
                <SelectItem
                  key={c.value}
                  value={c.value}
                  className="text-white focus:bg-white/10 focus:text-white"
                >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </LabelWithInfo>
      </div>
    </section>
  );
}

export function ProfilePage() {
  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>

        <Card className="border-white/10 bg-[#1A1C1E]/95">
          <CardContent className="space-y-8 p-6">
            <ProfileHeader />
            <BioSection />
            <hr className="border-white/10" />
            <AccountSection />
            <hr className="border-white/10" />
            <PreferencesSection />
            <hr className="border-white/10" />
            <div>
              <Button
                variant="outline"
                className="border-white/20 bg-[#252930] text-white hover:bg-white/10 hover:text-white"
                onClick={handleLogOut}
              >
                Log Out
                <LogOut className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
