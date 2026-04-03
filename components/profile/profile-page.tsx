"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Info,
  Mail,
  LogOut,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
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

type VerificationState = "idle" | "checking" | "verified" | "failed";

const E164_REGEX = /^\+[1-9]\d{1,14}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COLOR_OPTIONS = [
  { value: "green", label: "Green", color: "#34C759" },
  { value: "blue", label: "Blue", color: "#3B82F6" },
  { value: "red", label: "Red", color: "#EF4444" },
  { value: "wichita-state", label: "Wichita State", color: "#FFCD00" },
  { value: "k-state", label: "K-State", color: "#512888" },
  { value: "ku-blue", label: "KU BLUE", color: "#0051BA" },
  { value: "ku-red", label: "KU RED", color: "#E8000D" },
  { value: "osu", label: "OSU", color: "#FF7300" },
  { value: "ou", label: "OU", color: "#841617" },
  { value: "texas-tech", label: "Texas Tech", color: "#CC0000" },
  { value: "texas", label: "Texas", color: "#bf5700" },
  { value: "nebraska", label: "Nebraska", color: "#e41c38" },
  { value: "louisiana-state", label: "Louisiana State", color: "#461D7C" },
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
        <Label className="text-sm font-medium text-black dark:text-white">
          {label}
        </Label>
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60"
          title={`${label} info`}
        >
          <Info className="h-2.5 w-2.5" />
        </span>
      </div>
      {children}
      {helperText && (
        <p className="text-xs text-black/50 dark:text-white/50">{helperText}</p>
      )}
    </div>
  );
}

function VerificationBadge({
  label,
  state,
  forAlarms = false,
}: {
  label: string;
  state: VerificationState;
  forAlarms?: boolean;
}) {
  const baseClass =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]";
  if (state === "checking") {
    return (
      <span
        className={`${baseClass} border-blue-400/35 bg-blue-400/10 text-blue-400`}
      >
        <Loader2 className="h-3 w-3 animate-spin" />
        Verifying {label}
      </span>
    );
  }
  if (state === "verified") {
    return (
      <span
        className={`${baseClass} border-[#34C759]/40 bg-[#34C759]/10 text-[#34C759]`}
      >
        <CheckCircle2 className="h-3 w-3" />
        Verified {label}
      </span>
    );
  }
  if (state === "failed") {
    return (
      <span
        className={`${baseClass} border-red-500/40 bg-red-500/10 text-red-400`}
      >
        <XCircle className="h-3 w-3" />
        Invalid {label}
      </span>
    );
  }
  return (
    <span
      className={`${baseClass} ${
        forAlarms
          ? "border-blue-500/35 bg-blue-500/10 text-blue-400"
          : "border-black/20 bg-black/5 text-black/60 dark:border-white/20 dark:bg-white/5 dark:text-white/60"
      }`}
    >
      <CheckCircle2 className="h-3 w-3" />
      {forAlarms ? "Used for alarms" : "Not verified"}
    </span>
  );
}

function ProfileHeader() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar className="h-24 w-24 rounded-full border-4 border-black/10 dark:border-white/10">
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

interface BioSectionProps {
  firstName: string;
  lastName: string;
  companyPhone: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setCompanyPhone: (value: string) => void;
  onTestPhone: () => void;
  phoneVerification: VerificationState;
}

function BioSection({
  firstName,
  lastName,
  companyPhone,
  setFirstName,
  setLastName,
  setCompanyPhone,
  onTestPhone,
  phoneVerification,
}: BioSectionProps) {
  const inputClass =
    "border-black/20 bg-black/5 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40";
  const e164Valid = E164_REGEX.test(companyPhone);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-black dark:text-white">Bio</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <LabelWithInfo label="First Name">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </LabelWithInfo>
        <LabelWithInfo label="Last Name">
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </LabelWithInfo>
      </div>

      <LabelWithInfo label="Company Phone Number">
        <div className="space-y-2">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <Input
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className={`${inputClass} pl-10 pr-24`}
              placeholder="+14696008888"
            />
            <Button
              size="sm"
              type="button"
              onClick={onTestPhone}
              className="absolute right-1.5 top-1/2 h-7 -translate-y-1/2 bg-[#34C759] px-3 text-xs text-black hover:bg-[#34C759]/90"
            >
              Test
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <VerificationBadge
              label="phone"
              state={phoneVerification}
              forAlarms
            />
            {!e164Valid && companyPhone.length > 0 && (
              <span className="text-xs text-red-400">
                Enter phone number with country code, no spaces or dashes.
              </span>
            )}
          </div>
        </div>
      </LabelWithInfo>
    </section>
  );
}

interface AccountSectionProps {
  email: string;
  setEmail: (value: string) => void;
  onTestEmail: () => void;
  emailVerification: VerificationState;
}

function AccountSection({
  email,
  setEmail,
  onTestEmail,
  emailVerification,
}: AccountSectionProps) {
  const inputClass =
    "border-black/20 bg-black/5 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Account
      </h2>
      <div className="space-y-4">
        <LabelWithInfo label="Email">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={`${inputClass} pl-10 pr-24`}
              />
              <Button
                size="sm"
                type="button"
                onClick={onTestEmail}
                className="absolute right-1.5 top-1/2 h-7 -translate-y-1/2 bg-[#34C759] px-3 text-xs text-black hover:bg-[#34C759]/90"
              >
                Test
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge
                label="email"
                state={emailVerification}
                forAlarms
              />
            </div>
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

interface PreferencesSectionProps {
  pushEnabled: boolean;
  setPushEnabled: (value: boolean) => void;
  color: string;
  setColor: (value: string) => void;
  defaultCompany: string;
  setDefaultCompany: (value: string) => void;
}

function PreferencesSection({
  pushEnabled,
  setPushEnabled,
  color,
  setColor,
  defaultCompany,
  setDefaultCompany,
}: PreferencesSectionProps) {
  const triggerClass =
    "border-black/20 bg-black/5 text-black dark:border-white/20 dark:bg-[#252930] dark:text-white [&>svg]:text-[#34C759]";
  const contentClass =
    "border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]";
  const itemClass =
    "text-black focus:bg-black/5 focus:text-black dark:text-white dark:focus:bg-white/10 dark:focus:text-white";
  const swatchBorderClass = "border-black/20 dark:border-white/20";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Preferences
      </h2>
      <div className="space-y-4 rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-[#252930]/50">
        <div className="flex items-center justify-between gap-4">
          <Label className="text-sm font-medium text-black dark:text-white">
            Enable Push Notifications
          </Label>
          <Switch
            checked={pushEnabled}
            onCheckedChange={setPushEnabled}
            className="data-[state=checked]:bg-[#34C759]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-black dark:text-white">
              Color Picker
            </Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className={triggerClass}>
                <span className="flex flex-1 items-center gap-2">
                  <span
                    className={`h-4 w-4 shrink-0 rounded border ${swatchBorderClass}`}
                    style={{
                      backgroundColor:
                        COLOR_OPTIONS.find((c) => c.value === color)?.color ??
                        "#34C759",
                    }}
                  />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent className={contentClass}>
                {COLOR_OPTIONS.map((c) => (
                  <SelectItem
                    key={c.value}
                    value={c.value}
                    className={itemClass}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-3.5 w-3.5 rounded border ${swatchBorderClass}`}
                        style={{ backgroundColor: c.color }}
                      />
                      {c.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <LabelWithInfo label="Default Company" className="space-y-1.5">
            <Select value={defaultCompany} onValueChange={setDefaultCompany}>
              <SelectTrigger className={triggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={contentClass}>
                {COMPANY_OPTIONS.map((c) => (
                  <SelectItem
                    key={c.value}
                    value={c.value}
                    className={itemClass}
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </LabelWithInfo>
        </div>
      </div>
    </section>
  );
}

export function ProfilePage() {
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("Chris");
  const [lastName, setLastName] = React.useState("Kurz");
  const [companyPhone, setCompanyPhone] = React.useState("+14696008888");
  const [email, setEmail] = React.useState("chriskurz@trinity.com");
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [color, setColor] = React.useState("green");
  const [defaultCompany, setDefaultCompany] = React.useState("trinity");

  const [phoneVerification, setPhoneVerification] =
    React.useState<VerificationState>("idle");
  const [emailVerification, setEmailVerification] =
    React.useState<VerificationState>("idle");
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const handleLogOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleTestPhone = () => {
    setPhoneVerification("checking");
    window.setTimeout(() => {
      setPhoneVerification(
        E164_REGEX.test(companyPhone) ? "verified" : "failed",
      );
    }, 450);
  };

  const handleTestEmail = () => {
    setEmailVerification("checking");
    window.setTimeout(() => {
      setEmailVerification(EMAIL_REGEX.test(email) ? "verified" : "failed");
    }, 450);
  };

  const handleSave = () => {
    setSaveState("saving");
    window.setTimeout(() => {
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 1400);
    }, 600);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Profile
        </h1>
        <Card className="border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <CardContent className="space-y-8 p-6">
            <ProfileHeader />
            <BioSection
              firstName={firstName}
              lastName={lastName}
              companyPhone={companyPhone}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setCompanyPhone={setCompanyPhone}
              onTestPhone={handleTestPhone}
              phoneVerification={phoneVerification}
            />
            <hr className="border-black/10 dark:border-white/10" />
            <AccountSection
              email={email}
              setEmail={setEmail}
              onTestEmail={handleTestEmail}
              emailVerification={emailVerification}
            />
            <hr className="border-black/10 dark:border-white/10" />
            <PreferencesSection
              pushEnabled={pushEnabled}
              setPushEnabled={setPushEnabled}
              color={color}
              setColor={setColor}
              defaultCompany={defaultCompany}
              setDefaultCompany={setDefaultCompany}
            />
            <hr className="border-black/10 dark:border-white/10" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                className="border-black/20 bg-black/5 text-black hover:bg-black/10 hover:text-black dark:border-white/20 dark:bg-[#252930] dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
                onClick={handleLogOut}
              >
                Log Out
                <LogOut className="ml-2 h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {saveState === "saved" && (
                  <span className="text-xs text-[#34C759]">Saved</span>
                )}
                <Button
                  onClick={handleSave}
                  className="bg-[#34C759] text-black hover:bg-[#34C759]/90"
                  disabled={saveState === "saving"}
                >
                  {saveState === "saving" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
