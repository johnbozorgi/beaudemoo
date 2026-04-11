import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Heart,
  Target,
  AlertCircle,
  Calendar,
  ShoppingBag,
  ArrowUpRight,
  Clock,
  Database,
  Network,
  Camera,
  Upload,
  Sparkles,
  MessageSquare,
  ArrowRight,
  User,
  Shield,
  FlaskConical,
  Plus,
  CheckCircle2,
  Users,
  GitBranch,
  Stethoscope,
  Home,
  Loader2,
} from "lucide-react";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Reminder = {
  id: number;
  time: string;
  task: string;
  done: boolean;
  category: string;
};

type ReminderDraft = {
  task: string;
  time: string;
  category: string;
};

type MetricLogTarget = {
  name: string;
  unit: string;
} | null;

type HealthItem = {
  name: string;
  status: string;
  date: string;
  unit: string;
};

type DashboardMode = "individual" | "family";

export default function Dashboard() {
  const { gender, setGender, hasFamily, setHasFamily, agentName, setAgentName } = useDashboard();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focus = searchParams.get("focus");

  const [dashboardMode, setDashboardMode] =
    useState<DashboardMode>("individual");

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedTest, setSelectedTest] = useState<MetricLogTarget>(null);
  const [logValue, setLogValue] = useState("");
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isLogValueModalOpen, setIsLogValueModalOpen] = useState(false);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      time: "08:00 AM",
      task: "Morning Supplements",
      done: true,
      category: "Medication",
    },
    {
      id: 2,
      time: "02:00 PM",
      task: "Vitamin D3",
      done: false,
      category: "Medication",
    },
    {
      id: 3,
      time: "09:00 PM",
      task: "Evening Fasting",
      done: false,
      category: "Lifestyle",
    },
  ]);

  const [newReminder, setNewReminder] = useState<ReminderDraft>({
    task: "",
    time: "08:00",
    category: "Medication",
  });

  const handleAddReminder = () => {
    if (!newReminder.task.trim()) return;

    const timeFormatted = new Date(
      `2000-01-01T${newReminder.time}`,
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setReminders((prev) => [
      ...prev,
      {
        id: Date.now(),
        task: newReminder.task.trim(),
        time: timeFormatted,
        done: false,
        category: newReminder.category,
      },
    ]);

    setNewReminder({ task: "", time: "08:00", category: "Medication" });
    setIsReminderModalOpen(false);
    toast.success("Reminder scheduled successfully");
  };

  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    );
  };

  const startAIScan = () => {
    setIsScannerOpen(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScannerOpen(false);
            toast.success(
              "AI Analysis Complete: 450kcal detected (Grilled Salmon & Asparagus)",
            );
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleGenderSectionClick = (
    targetGender: "Male" | "Female" | "Other",
  ) => {
    if (!gender) {
      toast.error(
        "Please set your biological gender in Bio-Digital Identity first.",
        {
          action: {
            label: "Set Gender",
            onClick: () => navigate("/data-bank"),
          },
        },
      );
      return;
    }

    if (gender !== targetGender) {
      toast.error(
        `This section is optimized for ${targetGender} profiles. Would you like to update your profile settings?`,
        {
          duration: 5000,
          action: {
            label: "Update Profile",
            onClick: () => {
              setGender(targetGender);
              toast.success(`Profile updated to ${targetGender}. Navigating...`);
              navigate(
                `/dashboard?focus=${
                  targetGender === "Male"
                    ? "mens-health"
                    : targetGender === "Female"
                      ? "womens-health"
                      : "health-profile"
                }`,
              );
            },
          },
        },
      );
      return;
    }

    navigate(
      `/dashboard?focus=${
        targetGender === "Male"
          ? "mens-health"
          : targetGender === "Female"
            ? "womens-health"
            : "health-profile"
      }`,
    );
  };

  const handleOpenLogModal = (testName: string, unit = "") => {
    setSelectedTest({ name: testName, unit });
    setIsLogModalOpen(true);
  };

  const handleSaveLog = () => {
    if (!logValue || !logDate) {
      toast.error("Please enter both a value and a date.");
      return;
    }

    toast.success(
      `Logged ${logValue}${selectedTest?.unit ?? ""} for ${selectedTest?.name ?? "metric"} on ${logDate}`,
    );
    setIsLogModalOpen(false);
    setLogValue("");
  };

  useEffect(() => {
    if (focus === "mens-health" || focus === "womens-health") {
      const targetGender = focus === "mens-health" ? "Male" : "Female";

      if (!gender) {
        toast.error(
          "Please set your biological gender in Bio-Digital Identity first.",
          {
            action: {
              label: "Set Gender",
              onClick: () => navigate("/data-bank"),
            },
          },
        );
        navigate("/dashboard", { replace: true });
        return;
      }

      if (gender !== targetGender) {
        toast.error(
          `This section is optimized for ${targetGender} profiles. Would you like to update your profile settings?`,
          {
            duration: 5000,
            action: {
              label: "Update Profile",
              onClick: () => {
                setGender(targetGender);
                toast.success(`Profile updated to ${targetGender}.`);
              },
            },
          },
        );
      }
    }
  }, [focus, gender, navigate, setGender]);

  useEffect(() => {
    const handleNameChange = () => {
      setAgentName(
        localStorage.getItem("health_agent_name") || "Health AI Agent",
      );
    };

    window.addEventListener("agent_name_changed", handleNameChange);
    return () =>
      window.removeEventListener("agent_name_changed", handleNameChange);
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {!gender && dashboardMode === "individual" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] border border-blue-500/30 bg-gradient-to-br from-blue-600/15 via-black to-blue-600/5 p-8 shadow-2xl"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white serif">
                  Complete Your Biological Profile
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Set your biological sex marker to unlock focus-specific health
                  panels.
                </p>
              </div>
            </div>
            <Link
              to="/data-bank"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] hover:bg-zinc-200"
            >
              Set Gender Now
            </Link>
          </div>
        </motion.div>
      )}

      <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_24%),#050505] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />
        <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 via-white/20 to-purple-600" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.45em] text-blue-400">
                {dashboardMode === "individual"
                  ? "Biological Intelligence Core"
                  : "Family Health Coordination"}
              </span>
            </div>

            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-6xl serif">
              {dashboardMode === "individual"
                ? "My Health Intelligence"
                : "My Family Dashboard"}
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-bold uppercase tracking-[0.22em] leading-relaxed text-zinc-400">
              {dashboardMode === "individual"
                ? "Monitor your digital twin, log biological signals, and turn real-time data into clear next actions."
                : "Manage your family tree, family health goals, doctors, and shared family health data in one place."}
            </p>
          </div>

          <div className="xl:w-[520px] space-y-4">
            <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
              <button
                onClick={() => setDashboardMode("individual")}
                className={cn(
                  "flex-1 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] transition-all",
                  dashboardMode === "individual"
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Individual
                </div>
              </button>

              <button
                onClick={() => setDashboardMode("family")}
                className={cn(
                  "flex-1 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] transition-all",
                  dashboardMode === "family"
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  Family
                </div>
              </button>
            </div>

            {dashboardMode === "individual" ? (
              !gender ? (
                <button
                  onClick={() => navigate("/data-bank")}
                  className="w-full rounded-2xl border border-blue-500/30 bg-blue-600/10 p-6 text-left transition-all hover:bg-blue-600/20 group"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                      Personalization Required
                    </span>
                  </div>
                  <p className="text-xl font-black uppercase italic tracking-tight text-white serif mb-2">
                    Initialize My Health
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
                    Set your biological profile to unlock personalized health
                    modules.
                  </p>
                </button>
              ) : (
                <button
                  onClick={() => handleGenderSectionClick(gender)}
                  className={cn(
                    "w-full rounded-2xl border p-6 text-left transition-all group relative overflow-hidden",
                    gender === "Male"
                      ? "border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20"
                      : gender === "Female"
                        ? "border-pink-500/30 bg-pink-600/10 hover:bg-pink-600/20"
                        : "border-purple-500/30 bg-purple-600/10 hover:bg-purple-600/20",
                  )}
                >
                  <div className="mb-4 flex items-center gap-3">
                    {gender === "Male" ? (
                      <Shield className="h-5 w-5 text-blue-400" />
                    ) : gender === "Female" ? (
                      <FlaskConical className="h-5 w-5 text-pink-400" />
                    ) : (
                      <Activity className="h-5 w-5 text-purple-400" />
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em]",
                        gender === "Male"
                          ? "text-blue-400"
                          : gender === "Female"
                            ? "text-pink-400"
                            : "text-purple-400",
                      )}
                    >
                      Personalized Focus
                    </span>
                  </div>
                  <p className="text-2xl font-black uppercase italic tracking-tight text-white serif mb-2">
                    My{" "}
                    {gender === "Male"
                      ? "Men's"
                      : gender === "Female"
                        ? "Women's"
                        : "Health"}{" "}
                    Insights
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <span>View Insights</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>

                  <div className="absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                    {gender === "Male" ? (
                      <Shield className="h-24 w-24" />
                    ) : (
                      <FlaskConical className="h-24 w-24" />
                    )}
                  </div>
                </button>
              )
            ) : (
              <div className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-600/10 p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <Users className="h-5 w-5 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                    Family Health Mode
                  </span>
                </div>
                <p className="text-2xl font-black uppercase italic tracking-tight text-white serif mb-2">
                  Shared Family Care
                </p>
                {!hasFamily ? (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
                      You haven't set up a family profile yet. Create one to manage shared health data.
                    </p>
                    <Button 
                      onClick={() => {
                        setHasFamily(true);
                        toast.success("Family profile created successfully!");
                      }}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl"
                    >
                      Create a Family
                    </Button>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
                    Manage family relationships, health priorities, doctors, and
                    family-level data here.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {dashboardMode === "individual" ? (
          <motion.div
            key="individual-dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-10"
          >
            <AnimatePresence mode="wait">
              {focus === "mens-health" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                    <h2 className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white serif">
                      <Shield className="h-6 w-6 text-blue-500" />
                      Men&apos;s Health Dashboard
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/dashboard")}
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
                    >
                      Close Focus
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <HealthCard
                      title="Prostate Screening"
                      icon={<Shield className="h-5 w-5 text-blue-400" />}
                      items={[
                        {
                          name: "PSA Blood Test",
                          status: "Normal",
                          date: "Oct 2025",
                          unit: "ng/mL",
                        },
                        {
                          name: "Digital Rectal Exam (DRE)",
                          status: "Pending",
                          date: "Due Soon",
                          unit: "",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                    <HealthCard
                      title="Hormonal Profile"
                      icon={<FlaskConical className="h-5 w-5 text-amber-400" />}
                      items={[
                        {
                          name: "Total Testosterone",
                          status: "650 ng/dL",
                          date: "Feb 2026",
                          unit: " ng/dL",
                        },
                        {
                          name: "Free Testosterone",
                          status: "12 pg/mL",
                          date: "Feb 2026",
                          unit: " pg/mL",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                    <HealthCard
                      title="Reproductive Health"
                      icon={<Activity className="h-5 w-5 text-emerald-400" />}
                      items={[
                        {
                          name: "Testicular Self-Exam",
                          status: "Completed",
                          date: "Mar 2026",
                          unit: "",
                        },
                        {
                          name: "Semen Analysis",
                          status: "Optimal",
                          date: "Dec 2025",
                          unit: "",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                    <HealthCard
                      title="Age-Related Screenings"
                      icon={<Target className="h-5 w-5 text-red-400" />}
                      items={[
                        {
                          name: "Colonoscopy",
                          status: "Clear",
                          date: "2024",
                          unit: "",
                        },
                        {
                          name: "Bone Density",
                          status: "Normal",
                          date: "2024",
                          unit: "",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                  </div>
                </motion.div>
              )}

              {focus === "womens-health" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
                    <h2 className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white serif">
                      <FlaskConical className="h-6 w-6 text-pink-500" />
                      Women&apos;s Health Dashboard
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/dashboard")}
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
                    >
                      Close Focus
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <HealthCard
                      title="PMS & Cycle Tracking"
                      icon={<Calendar className="h-5 w-5 text-purple-400" />}
                      items={[
                        {
                          name: "Cycle Day",
                          status: "Day 14",
                          date: "Today",
                          unit: "",
                        },
                        {
                          name: "Period Start Date",
                          status: "Mar 18",
                          date: "Last Log",
                          unit: "",
                        },
                        {
                          name: "Symptom Severity",
                          status: "Low (2/10)",
                          date: "Today",
                          unit: "/10",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                    <HealthCard
                      title="Reproductive Health"
                      icon={<Heart className="h-5 w-5 text-red-400" />}
                      items={[
                        {
                          name: "Fertility (AMH)",
                          status: "Optimal",
                          date: "Jan 2026",
                          unit: " ng/mL",
                        },
                        {
                          name: "Pregnancy (hCG)",
                          status: "N/A",
                          date: "-",
                          unit: "",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                    <HealthCard
                      title="Hormonal Panel"
                      icon={<FlaskConical className="h-5 w-5 text-amber-400" />}
                      items={[
                        {
                          name: "Estrogen / Progesterone",
                          status: "Balanced",
                          date: "Feb 2026",
                          unit: "",
                        },
                        {
                          name: "FSH / LH Levels",
                          status: "Normal",
                          date: "Feb 2026",
                          unit: "",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                    <HealthCard
                      title="Breast & Cervical Health"
                      icon={<Shield className="h-5 w-5 text-pink-400" />}
                      items={[
                        {
                          name: "Mammogram",
                          status: "Clear",
                          date: "Aug 2025",
                          unit: "",
                        },
                        {
                          name: "Pap Smear",
                          status: "Normal",
                          date: "Sep 2025",
                          unit: "",
                        },
                      ]}
                      onLog={handleOpenLogModal}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-8">
                {gender && !focus && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "rounded-[2.5rem] border p-8 relative overflow-hidden group cursor-pointer",
                      gender === "Male"
                        ? "border-blue-500/20 bg-blue-600/5 hover:bg-blue-600/10"
                        : gender === "Female"
                          ? "border-pink-500/20 bg-pink-600/5 hover:bg-pink-600/10"
                          : "border-purple-500/20 bg-purple-600/5 hover:bg-purple-600/10",
                    )}
                    onClick={() => handleGenderSectionClick(gender)}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
                            gender === "Male"
                              ? "bg-blue-600 shadow-blue-600/20"
                              : gender === "Female"
                                ? "bg-pink-600 shadow-pink-600/20"
                                : "bg-purple-600 shadow-purple-600/20",
                          )}
                        >
                          {gender === "Male" ? (
                            <Shield className="h-6 w-6 text-white" />
                          ) : gender === "Female" ? (
                            <FlaskConical className="h-6 w-6 text-white" />
                          ) : (
                            <Activity className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white serif">
                            My{" "}
                            {gender === "Male"
                              ? "Men's"
                              : gender === "Female"
                                ? "Women's"
                                : "Health"}{" "}
                            Summary
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Personalized biological insights & screenings
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white"
                      >
                        View All{" "}
                        <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {gender === "Male" ? (
                        <>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Prostate Health
                            </p>
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              PSA: Normal (1.2 ng/mL)
                            </p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Hormones
                            </p>
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              Testosterone: 650 ng/dL
                            </p>
                          </div>
                        </>
                      ) : gender === "Female" ? (
                        <>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Cycle Status
                            </p>
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              Day 14: Ovulation Phase
                            </p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Hormones
                            </p>
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              Estrogen: Balanced
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Health Status
                            </p>
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              Profile: Active
                            </p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Insights
                            </p>
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              Personalized modules ready
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-[#0a0a0a] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/20">
                        <Clock className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter text-white serif">
                          Daily Biological Log
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Real-time input for your digital twin
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full border border-blue-600/20 bg-blue-600/10 px-4 py-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                        Today:{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
                    <MetricPanel
                      title="Hydration"
                      icon={<Activity className="h-4 w-4 text-blue-400" />}
                      accent="blue"
                      progress="48%"
                      summary="1.2L / 2.5L"
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {[250, 500, 750, 1000].map((ml) => (
                          <Button
                            key={ml}
                            variant="outline"
                            className="h-10 rounded-xl border-zinc-800 bg-zinc-900/50 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600/20"
                            onClick={() => toast.success(`Added ${ml}ml of water`)}
                          >
                            +{ml}ml
                          </Button>
                        ))}
                      </div>
                    </MetricPanel>

                    <MetricPanel
                      title="Nutrition"
                      icon={<ShoppingBag className="h-4 w-4 text-amber-400" />}
                      accent="amber"
                      progress="66%"
                      summary="1,450 / 2,200 kcal"
                    >
                      <div className="flex gap-3">
                        <Button
                          className="h-12 flex-1 gap-2 rounded-xl border border-zinc-800 bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800"
                          onClick={() =>
                            toast.info("Opening manual calorie entry...")
                          }
                        >
                          <Plus className="h-3 w-3" /> Manual
                        </Button>
                        <Button
                          className="h-12 flex-1 gap-2 rounded-xl bg-blue-600 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-blue-500"
                          onClick={startAIScan}
                        >
                          <Camera className="h-3 w-3" /> AI Scan
                        </Button>
                      </div>
                    </MetricPanel>

                    <div className="space-y-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/30 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                          <Clock className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-white">
                          Sleep & Recovery
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <StatMiniCard label="Last Night" value="7h 20m" />
                        <StatMiniCard
                          label="Quality"
                          value="88%"
                          valueClassName="text-emerald-400"
                        />
                      </div>
                      <div className="rounded-2xl border border-purple-500/15 bg-purple-500/5 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
                          Recovery signal improving after two nights of
                          consistent sleep timing.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/30 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                          <Activity className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-white">
                          Quick Metrics
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["Weight", "kg", "hover:bg-emerald-600/20"],
                          ["Heart Rate", "bpm", "hover:bg-red-600/20"],
                          ["Blood Pressure", "mmHg", "hover:bg-blue-600/20"],
                          ["Mood", "", "hover:bg-purple-600/20"],
                          ["Digestive Event", "", "hover:bg-orange-600/20"],
                          ["Biological Event", "", "hover:bg-zinc-600/20"],
                        ].map(([name, unit, hover]) => (
                          <Button
                            key={name}
                            variant="outline"
                            className={cn(
                              "h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-[9px] font-bold uppercase tracking-widest",
                              hover,
                            )}
                            onClick={() => handleOpenLogModal(name, unit)}
                          >
                            Log{" "}
                            {name === "Heart Rate"
                              ? "HR"
                              : name === "Blood Pressure"
                                ? "BP"
                                : name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="rounded-[2.5rem] border border-zinc-800 bg-[#0a0a0a] p-8 shadow-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <AlertCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-white">
                        Active Reminders
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 hover:bg-white/5"
                      onClick={() => setIsReminderModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 text-zinc-500" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={cn(
                          "group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all",
                          reminder.done
                            ? "border-emerald-500/20 bg-emerald-500/5 opacity-60"
                            : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700",
                        )}
                        onClick={() => toggleReminder(reminder.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                              reminder.done
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-zinc-700 group-hover:border-zinc-500",
                            )}
                          >
                            {reminder.done && (
                              <CheckCircle2 className="h-3 w-3 text-black" />
                            )}
                          </div>
                          <div>
                            <span
                              className={cn(
                                "block text-[10px] font-black uppercase tracking-widest",
                                reminder.done
                                  ? "text-zinc-500 line-through"
                                  : "text-white",
                              )}
                            >
                              {reminder.task}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">
                              {reminder.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500">
                          {reminder.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                  System Overview
                </h2>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white serif">
                  My Health Status
                </h1>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  System Live
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Last Sync: 12m ago
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 shadow-2xl md:grid-cols-3">
              <div className="group bg-[#0a0a0a] p-8 transition-colors hover:bg-zinc-900">
                <div className="mb-6 flex items-start justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 italic serif">
                    Health Index
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="font-mono text-6xl font-black tracking-tighter text-emerald-400">
                    84
                  </span>
                  <span className="font-mono text-sm text-zinc-600">/100</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  <Activity className="h-3 w-3" /> +2.4% Variance
                </div>
                <div className="mt-6 border-t border-zinc-800/50 pt-6">
                  <ExplainabilityPanel
                    title="Metric Computation"
                    sources={[
                      "Apple Watch (Continuous)",
                      "Oura Ring (Sleep)",
                      "Recent Blood Panel (1mo ago)",
                    ]}
                    method="Weighted average of 5 biological systems (Cardio, Metabolic, Neuro, Immune, Recovery)."
                    recency="Updated 12 mins ago"
                    confidence="High"
                    interpretation="Your score is in the top 15% for your age group. The recent increase is driven by improved HRV and consistent Zone 2 training."
                  />
                </div>
              </div>

              <div className="group border-l border-zinc-800 bg-[#0a0a0a] p-8 transition-colors hover:bg-zinc-900">
                <div className="mb-6 flex items-start justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 italic serif">
                    Daily Telemetry
                  </h3>
                  <Database className="h-4 w-4 text-zinc-700" />
                </div>
                <div className="space-y-6">
                  {["Sleep Duration", "Activity Count", "HRV Variance"].map(
                    (label, i) => (
                      <div
                        key={label}
                        className="flex items-end justify-between border-b border-zinc-800/50 pb-2"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          {label}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-xl",
                            i === 2 ? "text-amber-400" : "text-emerald-400",
                          )}
                        >
                          {i === 0
                            ? "07:20:00"
                            : i === 1
                              ? "08,432"
                              : "42ms"}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="group border-l border-zinc-800 bg-[#0a0a0a] p-8 transition-colors hover:bg-zinc-900">
                <div className="mb-6 flex items-start justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 italic serif">
                    Objective Tracking
                  </h3>
                  <Target className="h-4 w-4 text-blue-500" />
                </div>
                <div className="space-y-8">
                  <ProgressRow
                    label="Sleep Optimization"
                    value="65%"
                    display="65.0%"
                  />
                  <ProgressRow
                    label="Stress Mitigation"
                    value="40%"
                    display="40.0%"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Ingest Biological Data
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  Secure Gateway
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-3">
                <IngestCard
                  icon={<Network className="h-6 w-6" />}
                  title="Bluetooth Sync"
                  description="Connect smartwatch, iPhone, or wearables"
                  accent="purple"
                  onClick={() =>
                    toast.info("Scanning for nearby Bluetooth devices...")
                  }
                />
                <IngestCard
                  icon={<Camera className="h-6 w-6" />}
                  title="Webcam Capture"
                  description="Upload image or video telemetry"
                  accent="blue"
                  onClick={() => toast.info("Requesting camera access...")}
                />
                <IngestCard
                  icon={<Upload className="h-6 w-6" />}
                  title="File Upload"
                  description="Import lab results or DNA data"
                  accent="emerald"
                  onClick={() => toast.info("Opening file browser...")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                      Digital Twin Telemetry
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    v2.4.0-stable
                  </span>
                </div>
                <div className="space-y-6 p-6">
                  <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative flex aspect-[1/2] h-4/5 flex-col items-center justify-center">
                        <svg
                          viewBox="0 0 100 200"
                          className="h-full w-full fill-current text-blue-500/20"
                        >
                          <path d="M50,20 c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S55.5,20,50,20z M50,45 c-15,0-25,10-25,25v40c0,5,4,9,9,9h3c0,20,0,40,0,60c0,5,4,9,9,9s9-4,9-9c0-20,0-40,0-60h3c5,0,9-4,9-9V70C75,55,65,45,50,45z" />
                        </svg>

                        <div className="absolute inset-0">
                          <svg viewBox="0 0 100 200" className="h-full w-full">
                            {[...Array(20)].map((_, i) => (
                              <motion.circle
                                key={i}
                                cx={20 + Math.random() * 60}
                                cy={40 + Math.random() * 120}
                                r="1"
                                fill="#60a5fa"
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: [0, 1, 0],
                                  scale: [0.5, 1.5, 0.5],
                                }}
                                transition={{
                                  duration: 2 + Math.random() * 2,
                                  repeat: Infinity,
                                  delay: Math.random() * 2,
                                }}
                              />
                            ))}
                            <motion.path
                              d="M50,30 L50,180 M30,70 L70,70 M35,120 L65,120"
                              stroke="#60a5fa"
                              strokeWidth="0.5"
                              strokeDasharray="4 4"
                              fill="none"
                              animate={{ strokeDashoffset: [0, -20] }}
                              transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                          </svg>
                        </div>

                        <motion.div
                          animate={{ top: ["10%", "90%", "10%"] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">
                          Neural Sync Active
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-[8px] font-mono text-zinc-600">
                          Lat: 2ms
                        </span>
                        <span className="text-[8px] font-mono text-zinc-600">
                          Sync: 98.4%
                        </span>
                      </div>
                    </div>
                  </div>

                  <ExplainabilityCard
                    icon={<Heart className="h-5 w-5 text-blue-400" />}
                    title="Cardiovascular Model Sync"
                    description="Resting heart rate trend analysis complete. System efficiency optimized."
                    border="hover:border-blue-500/50"
                    panel={
                      <ExplainabilityPanel
                        title="Telemetry Analysis"
                        sources={["Apple Watch (Last 14 days)"]}
                        method="Time-series analysis of resting heart rate during sleep."
                        recency="Updated today"
                        confidence="High"
                        interpretation="Your RHR has dropped by an average of 3 bpm over the last two weeks, indicating improved cardiovascular efficiency."
                      />
                    }
                  />

                  <ExplainabilityCard
                    icon={<AlertCircle className="h-5 w-5 text-amber-400" />}
                    title="Biochemical Risk Alert"
                    description="Genetic predisposition detected for Vitamin D absorption variance."
                    border="hover:border-amber-500/50"
                    panel={
                      <ExplainabilityPanel
                        title="Genomic Context"
                        sources={[
                          "23andMe Raw Data",
                          "Location Data (Low Sun Exposure)",
                        ]}
                        method="Polygenic risk score combined with environmental UV index tracking."
                        recency="Updated 2 days ago"
                        confidence="Medium"
                        interpretation="You carry the VDR TaqI variant associated with lower Vitamin D absorption. Combined with a low UV index, your risk of deficiency is elevated."
                        action="Consider a 2000 IU daily Vitamin D3 supplement."
                      />
                    }
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                      System Directives
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Priority Queue
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  <DirectiveCard
                    icon={<Calendar className="h-5 w-5 text-blue-400" />}
                    title="Schedule Bloodwork"
                    status="Status: Overdue (14 Months)"
                    badge="High Priority"
                    badgeClassName="text-blue-400 border-blue-600/20 bg-blue-600/10"
                    onClick={() =>
                      toast.info("Opening lab appointment scheduler...")
                    }
                  />
                  <DirectiveCard
                    icon={<ShoppingBag className="h-5 w-5 text-zinc-300" />}
                    title="Optimize Supplements"
                    status="Status: New Insights Available"
                    onClick={() =>
                      toast.info("Loading supplement recommendations...")
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="family-dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-8"
          >
            {!hasFamily ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="h-24 w-24 rounded-full bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
                  <Users className="h-10 w-10 text-emerald-400" />
                </div>
                <div className="max-w-md">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white serif mb-4">
                    Family Mode Locked
                  </h2>
                  <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
                    You need to create a family profile to access shared health features, pedigree tracking, and family-level biological insights.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setHasFamily(true);
                    toast.success("Family profile created successfully!");
                  }}
                  className="h-16 px-12 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-emerald-600/10"
                >
                  Create a Family Now
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 via-black to-blue-600/10 p-8 shadow-2xl">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
                          Family Health Layer
                        </span>
                      </div>
                      <h2 className="mb-4 text-4xl font-black uppercase italic tracking-tighter text-white serif">
                        Family Overview
                      </h2>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] leading-relaxed text-zinc-400">
                        View your family tree, shared goals, family doctors, and
                        your family health data bank.
                      </p>
                    </div>

                    <Button
                      onClick={() => navigate("/family")}
                      className="h-16 rounded-2xl bg-white px-10 text-[11px] font-black uppercase tracking-widest text-black hover:bg-zinc-200"
                    >
                      Open Family Center
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                  <FamilyFeatureCard
                    title="Family Tree"
                    subtitle="Build and manage the family structure"
                    icon={<GitBranch className="h-6 w-6 text-emerald-400" />}
                    description="Add family members, view relationships, and manage the family tree in one shared space."
                    buttonText="Open Family Tree"
                    onClick={() => navigate("/family")}
                  />

                  <FamilyFeatureCard
                    title="Family Health Goals"
                    subtitle="Shared goals and wellness plans"
                    icon={<Target className="h-6 w-6 text-blue-400" />}
                    description="Track collective family goals like sleep, movement, nutrition, screening, and prevention."
                    buttonText="View Goals"
                    onClick={() =>
                      toast.info("Family goals dashboard coming soon.")
                    }
                  />

                  <FamilyFeatureCard
                    title="Family Doctors"
                    subtitle="Manage doctors across the family"
                    icon={<Stethoscope className="h-6 w-6 text-purple-400" />}
                    description="Review doctors assigned to family members and manage access to shared health information."
                    buttonText="Manage Doctors"
                    onClick={() => navigate("/family-doctor")}
                  />

                  <FamilyFeatureCard
                    title="Family Health Data Bank"
                    subtitle="Shared family data and records"
                    icon={<Database className="h-6 w-6 text-amber-400" />}
                    description="Store and review family-level health records, history, and uploaded shared documents."
                    buttonText="Open Data Bank"
                    onClick={() => navigate("/family-health-data")}
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <Card className="rounded-[2rem] border border-zinc-800 bg-[#0a0a0a]">
                    <CardHeader className="border-b border-zinc-800 bg-zinc-900/30">
                      <CardTitle className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white">
                        <Users className="h-5 w-5 text-emerald-400" />
                        Family Snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <MiniStatRow label="Family Members" value="4" />
                      <MiniStatRow label="Shared Goals" value="3" />
                      <MiniStatRow label="Doctors Connected" value="2" />
                      <MiniStatRow label="Shared Records" value="12" />
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border border-zinc-800 bg-[#0a0a0a]">
                    <CardHeader className="border-b border-zinc-800 bg-zinc-900/30">
                      <CardTitle className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white">
                        <Heart className="h-5 w-5 text-blue-400" />
                        Family Health Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Current Focus
                        </p>
                        <p className="text-sm font-black uppercase tracking-tight text-white">
                          Prevention & Screening
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Suggested Action
                        </p>
                        <p className="text-sm font-black uppercase tracking-tight text-white">
                          Update family history records
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent className="max-w-md rounded-[2rem] border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-light italic tracking-tight serif">
              Log {selectedTest?.name}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Enter your latest test results to update your biological twin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="value"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                Result Value{" "}
                {selectedTest?.unit && `(${selectedTest.unit.trim()})`}
              </Label>
              <div className="relative">
                <Input
                  id="value"
                  type="number"
                  placeholder="0.00"
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-700 focus:border-blue-500/50"
                />
                {selectedTest?.unit && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    {selectedTest.unit.trim()}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                Test Date
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 pl-10 text-white focus:border-blue-500/50"
                />
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsLogModalOpen(false)}
              className="rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLog}
              className="rounded-xl bg-blue-600 px-8 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-blue-500"
            >
              Save Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
        <DialogContent className="max-w-md rounded-[2rem] border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-light italic tracking-tight serif">
              New Health Reminder
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Schedule a new biological or lifestyle directive.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Task / Directive
              </Label>
              <Input
                placeholder="e.g. Morning Supplements"
                value={newReminder.task}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, task: e.target.value })
                }
                className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Time
                </Label>
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, time: e.target.value })
                  }
                  className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Category
                </Label>
                <select
                  value={newReminder.category}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, category: e.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Medication">Medication</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Exercise">Exercise</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsReminderModalOpen(false)}
              className="rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddReminder}
              className="rounded-xl bg-blue-600 px-8 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-blue-500"
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isScannerOpen && dashboardMode === "individual" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-6 backdrop-blur-xl"
          >
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[3rem] border-2 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/food/800/800')] bg-cover bg-center grayscale opacity-50" />

              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 z-10 h-1 bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,1)]"
              />

              <div className="absolute left-10 top-10 h-10 w-10 rounded-tl-xl border-l-4 border-t-4 border-blue-500" />
              <div className="absolute right-10 top-10 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-blue-500" />
              <div className="absolute bottom-10 left-10 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-blue-500" />
              <div className="absolute bottom-10 right-10 h-10 w-10 rounded-br-xl border-b-4 border-r-4 border-blue-500" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">
                    Analyzing Molecular Composition
                  </p>
                  <p className="text-4xl font-black text-white font-mono">
                    {scanProgress}%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4 text-center">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                AI Vision Ingesting...
              </h3>
              <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Synthesizing visual data with nutritional databases to calculate
                caloric density and macro-nutrient distribution.
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsScannerOpen(false)}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
              >
                Abort Scan
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FamilyFeatureCard({
  title,
  subtitle,
  icon,
  description,
  buttonText,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[2.5rem] border border-zinc-800 bg-[#0a0a0a] p-8 shadow-xl transition-all hover:border-zinc-700">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          {icon}
        </div>
        <ArrowUpRight className="h-4 w-4 text-zinc-600" />
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-3">
        {subtitle}
      </p>
      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white serif mb-4">
        {title}
      </h3>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-relaxed mb-8">
        {description}
      </p>

      <Button
        onClick={onClick}
        className="h-12 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-black hover:bg-zinc-200"
      >
        {buttonText}
      </Button>
    </div>
  );
}

function MiniStatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-4">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span className="font-mono text-lg font-black text-white">{value}</span>
    </div>
  );
}

function MetricPanel({
  title,
  icon,
  accent,
  summary,
  progress,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accent: "blue" | "amber";
  summary: string;
  progress: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/30 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              accent === "blue" ? "bg-blue-500/10" : "bg-amber-500/10",
            )}
          >
            {icon}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-white">
            {title}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-mono",
            accent === "blue" ? "text-blue-400" : "text-amber-400",
          )}
        >
          {summary}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: progress }}
          className={cn(
            "h-full",
            accent === "blue" ? "bg-blue-600" : "bg-amber-600",
          )}
        />
      </div>
      {children}
    </div>
  );
}

function StatMiniCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className={cn("text-xl font-mono text-white", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  display,
}: {
  label: string;
  value: string;
  display: string;
}) {
  return (
    <div>
      <div className="mb-3 flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-blue-400">{display}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: value }}
          className="h-full bg-blue-600"
        />
      </div>
    </div>
  );
}

function IngestCard({
  icon,
  title,
  description,
  accent,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: "purple" | "blue" | "emerald";
  onClick: () => void;
}) {
  const styles = {
    purple: {
      wrapper: "hover:bg-purple-600/10 hover:border-purple-500/50",
      icon: "bg-purple-600/10 border-purple-600/20 text-purple-400",
    },
    blue: {
      wrapper: "hover:bg-blue-600/10 hover:border-blue-500/50",
      icon: "bg-blue-600/10 border-blue-600/20 text-blue-400",
    },
    emerald: {
      wrapper: "hover:bg-emerald-600/10 hover:border-emerald-500/50",
      icon: "bg-emerald-600/10 border-emerald-600/20 text-emerald-400",
    },
  }[accent];

  return (
    <button
      className={cn(
        "group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-left transition-all",
        styles.wrapper,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-110",
          styles.icon,
        )}
      >
        {icon}
      </div>
      <h4 className="mb-1 text-sm font-black uppercase tracking-widest text-white">
        {title}
      </h4>
      <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-500">
        {description}
      </p>
    </button>
  );
}

function ExplainabilityCard({
  icon,
  title,
  description,
  border,
  panel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  border: string;
  panel: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 transition-all",
        border,
      )}
    >
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-tight text-white">
            {title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {panel}
    </div>
  );
}

function DirectiveCard({
  icon,
  title,
  status,
  badge,
  badgeClassName,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  badge?: string;
  badgeClassName?: string;
  onClick: () => void;
}) {
  return (
    <div
      className="group flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 transition-all hover:bg-zinc-800/50"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 transition-colors group-hover:bg-blue-600/20">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-tight text-white">
            {title}
          </h4>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {status}
          </p>
        </div>
      </div>
      {badge ? (
        <div className={cn("rounded-full border px-3 py-1", badgeClassName)}>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {badge}
          </span>
        </div>
      ) : (
        <ArrowUpRight className="h-4 w-4 text-zinc-700 transition-colors group-hover:text-white" />
      )}
    </div>
  );
}

function HealthCard({
  title,
  icon,
  items,
  onLog,
}: {
  title: string;
  icon: React.ReactNode;
  items: HealthItem[];
  onLog: (name: string, unit: string) => void;
}) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-[#0a0a0a] transition-colors hover:border-zinc-700">
      <CardHeader className="border-b border-zinc-800 bg-zinc-900/30 p-6">
        <CardTitle className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {items.map((item) => {
          const pending =
            item.status === "Pending" || item.status.includes("Due");
          return (
            <div
              key={item.name}
              className="flex flex-col gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => onLog(item.name, item.unit)}
                  className="group text-left"
                  title={`Click to log ${item.name}`}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-white transition-colors group-hover:text-blue-400">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                    {item.date}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  {pending ? (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      pending ? "text-amber-400" : "text-emerald-400",
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => onLog(item.name, item.unit)}
                variant="outline"
                className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg border-zinc-800 bg-zinc-900/50 text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-800"
              >
                <Plus className="h-3 w-3" />
                Add Data
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}