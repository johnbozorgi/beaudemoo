import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  Check,
  Clock,
  CloudUpload,
  Dna,
  FileText,
  Heart,
  Info,
  Layers,
  Loader2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCircle2,
  X,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";
import { toast } from "sonner";
import AIAgentPopup from "@/components/AIAgentPopup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type UploadedDataItem = {
  id: string;
  label: string;
  type: string;
  source: string;
  status: "uploaded" | "connected" | "processing";
  date: string;
};

type RecommendedDataItem = {
  id: string;
  label: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export default function DigitalTwin() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [twinCreated, setTwinCreated] = useState(false);
  
  // Simulate system generation on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setTwinCreated(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<"overview" | "cardio" | "metabolic" | "neuro" | "longevity">("overview");
  const [viewMode, setViewMode] = useState<"full" | "cardio" | "metabolic">("full");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [aiInitialMessage, setAiInitialMessage] = useState("");

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationScenario, setSimulationScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  const trajectoryData = [
    { age: 35, health: 85, baseline: 85 },
    { age: 40, health: 82, baseline: 80 },
    { age: 45, health: 80, baseline: 75 },
    { age: 50, health: 78, baseline: 70 },
    { age: 55, health: 75, baseline: 65 },
    { age: 60, health: 72, baseline: 60 },
    { age: 65, health: 70, baseline: 55 },
    { age: 70, health: 68, baseline: 50 },
    { age: 75, health: 65, baseline: 45 },
    { age: 80, health: 62, baseline: 40 },
  ];

  const [uploadedData, setUploadedData] = useState<UploadedDataItem[]>([
    {
      id: "1",
      label: "DNA Genomics File",
      type: "Genomics",
      source: "23andMe Upload",
      status: "uploaded",
      date: "2 days ago",
    },
    {
      id: "2",
      label: "Apple Watch Heart + Activity",
      type: "Wearable",
      source: "Connected Device",
      status: "connected",
      date: "Live Sync",
    },
    {
      id: "3",
      label: "Lipid Panel",
      type: "Lab Result",
      source: "PDF Upload",
      status: "uploaded",
      date: "5 days ago",
    },
    {
      id: "4",
      label: "Vitamin D Blood Test",
      type: "Lab Result",
      source: "PDF Upload",
      status: "processing",
      date: "Today",
    },
  ]);

  const recommendedData: RecommendedDataItem[] = useMemo(
    () => [
      {
        id: "r1",
        label: "CBC / Complete Blood Count",
        reason: "Improves baseline biological modeling and inflammation context.",
        priority: "high",
      },
      {
        id: "r2",
        label: "Comprehensive Metabolic Panel",
        reason: "Helps improve liver, kidney, and electrolyte modeling.",
        priority: "high",
      },
      {
        id: "r3",
        label: "Sleep Data",
        reason: "Improves recovery, neurocognitive, and stress predictions.",
        priority: "medium",
      },
      {
        id: "r4",
        label: "Medication List",
        reason: "Improves safety alerts and personalized recommendations.",
        priority: "medium",
      },
      {
        id: "r5",
        label: "Family History Document",
        reason: "Improves hereditary risk and preventive guidance.",
        priority: "low",
      },
    ],
    []
  );

  const twinAgeText = useMemo(() => {
    if (!createdAt) return "Not created";
    const diffMs = Date.now() - createdAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
    if (diffHours > 0) return `${diffHours} hour${diffHours === 1 ? "" : "s"}`;
    return "Just created";
  }, [createdAt]);

  const completionScore = useMemo(() => {
    const uploadedCount = uploadedData.filter((d) => d.status !== "processing").length;
    const total = uploadedCount + recommendedData.length;
    return Math.max(15, Math.round((uploadedCount / total) * 100));
  }, [uploadedData, recommendedData]);

  const createDigitalTwin = () => {
    setTwinCreated(true);
    setCreatedAt(new Date());
    toast.success("Your Digital Twin has been created.");
  };

  const handleMockUpload = () => {
    const nextItem: UploadedDataItem = {
      id: `${Date.now()}`,
      label: "New Uploaded Health Record",
      type: "Medical Record",
      source: "Manual Upload",
      status: "uploaded",
      date: "Just now",
    };
    setUploadedData((prev) => [nextItem, ...prev]);
    toast.success("New data uploaded successfully.");
  };

  const runSimulation = async (scenario: string) => {
    const finalScenario = scenario || customScenario;
    if (!finalScenario) {
      toast.error("Please define a scenario first.");
      return;
    }

    setSimulationScenario(finalScenario);
    setIsSimulating(true);
    setIsProcessing(true);
    setSimulationResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following health scenario for a Digital Twin based on DNA and biological telemetry.

SCENARIO: ${finalScenario}

CONTEXT:
- User is 35 years old.
- DNA shows high caffeine sensitivity and Vitamin D deficiency predisposition.
- Current Biological Age: 32.4
- Current VO2 Max: 48.2
- Current Resting Heart Rate: 52 BPM

Provide a structured analysis of predicted long-term health impact.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              cancerRisk: { type: Type.NUMBER },
              cardioRisk: { type: Type.NUMBER },
              metabolicRisk: { type: Type.NUMBER },
              impacts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    system: { type: Type.STRING },
                    effect: { type: Type.STRING },
                    risk: { type: Type.STRING },
                    color: { type: Type.STRING },
                  },
                  required: ["system", "effect", "risk", "color"],
                },
              },
            },
            required: ["summary", "cancerRisk", "cardioRisk", "metabolicRisk", "impacts"],
          },
        },
      });

      const result = JSON.parse(response.text);
      setSimulationResult(result);
    } catch (error) {
      console.error(error);
      setSimulationResult({
        summary: "Simulation could not be completed. Please try again.",
        cancerRisk: 0,
        cardioRisk: 0,
        metabolicRisk: 0,
        impacts: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const activityLog = [
    { time: "Today", event: "Twin Created", contribution: "+ Core model initialized" },
    { time: "2h ago", event: "Wearable Sync", contribution: "+ Cardio fidelity" },
    { time: "Yesterday", event: "DNA File Processed", contribution: "+ Genetic model depth" },
    { time: "2 days ago", event: "Lab Import", contribution: "+ Blood biomarker context" },
  ];

  const priorityColor = (priority: RecommendedDataItem["priority"]) => {
    if (priority === "high") return "text-red-400 bg-red-500/10 border-red-500/20";
    if (priority === "medium") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-blue-400 bg-blue-500/10 border-blue-500/20";
  };

  const statusColor = (status: UploadedDataItem["status"]) => {
    if (status === "uploaded") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (status === "connected") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  };

  return (
    <div className="relative min-h-screen pb-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[12%] left-[8%] w-[55%] h-[55%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-[8%] right-[8%] w-[45%] h-[45%] bg-cyan-600/10 blur-[140px] rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">
              Biophysical Modeling
            </h2>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">
              Digital Twin
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-zinc-400 uppercase tracking-widest leading-relaxed">
              Create your digital twin, review the data powering it, and improve the model by uploading recommended health data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <Clock className="h-3 w-3 text-emerald-400" />
              Twin Age: {twinCreated ? twinAgeText : "Not created"}
            </div>
            <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <Sparkles className="h-3 w-3 text-blue-400" />
              Model Readiness: {completionScore}%
            </div>
          </div>
        </div>

        {isGenerating ? (
          <div className="min-h-[600px] flex flex-col items-center justify-center text-center space-y-8">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="h-32 w-32 rounded-full border-4 border-t-blue-500 border-white/5 flex items-center justify-center"
            >
              <Dna className="h-12 w-12 text-blue-400" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic serif mb-2">Architecting Your Twin</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Synthesizing 3.2B base pairs + real-time telemetry...</p>
            </div>
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="h-full bg-blue-600"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 relative min-h-[650px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

                <div className="absolute top-8 left-8 z-20">
                  <div className="flex items-center gap-3 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-600/30">
                      <Dna className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest">Twin Visualization</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">
                        Live Model Rendering
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 right-8 z-20">
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    Age: {twinAgeText}
                  </div>
                </div>

                <CardContent className="h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

                      <div className="relative z-10">
                        <motion.div
                          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                          transition={{
                            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                          }}
                          className="w-[420px] h-[420px] rounded-full border border-blue-500/10 flex items-center justify-center relative"
                        >
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0"
                            >
                              <div
                                className="h-2 w-2 rounded-full bg-blue-400/40 blur-[2px]"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "0",
                                  transform: `translateY(-50%) scale(${0.5 + Math.random()})`,
                                }}
                              />
                            </motion.div>
                          ))}

                          <div className="absolute inset-10 rounded-full border border-purple-500/10 animate-pulse" />
                          <div className="absolute inset-20 rounded-full border border-blue-400/5" />

                          <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent z-20"
                          />
                        </motion.div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={viewMode}
                                initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="relative flex flex-col items-center justify-center"
                              >
                                {viewMode === "full" ? (
                                  <div className="relative group">
                                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
                                    <UserCircle2 className="h-72 w-72 text-blue-400/40 relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif">Full Biological Mirror</h3>
                                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">Synchronizing 142 Biomarker Streams</p>
                                    </div>
                                  </div>
                                ) : viewMode === "cardio" ? (
                                  <div className="relative group">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
                                    <Heart className="h-72 w-72 text-emerald-400/40 relative z-10 animate-[pulse_2s_infinite] drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif">Cardiovascular Engine</h3>
                                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">Real-time Hemodynamic Simulation</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="relative group">
                                    <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full animate-pulse" />
                                    <Zap className="h-72 w-72 text-amber-400/40 relative z-10 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif">Metabolic Core</h3>
                                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">Cellular Energy & Glucose Modeling</p>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            </AnimatePresence>

                            {/* Floating AI Agent Button */}
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setAiInitialMessage(`I'm analyzing your digital twin in ${viewMode} mode. What would you like to know about your biological projections?`);
                                setAiContext(`The user is interacting with their Digital Twin in ${viewMode} mode. Provide deep insights into their health trajectory and potential optimizations.`);
                                setIsAIOpen(true);
                              }}
                              className="absolute top-4 right-4 h-14 w-14 rounded-2xl bg-blue-600 text-white shadow-2xl flex items-center justify-center group border border-white/20 z-50"
                            >
                              <Sparkles className="h-7 w-7 group-hover:animate-spin-slow" />
                            </motion.button>
                          </div>
                      </div>

                      <div className="absolute inset-0 pointer-events-none">
                        {[
                          { label: "Twin Age", value: twinAgeText, top: "18%", left: "16%", color: "blue" },
                          { label: "Readiness", value: `${completionScore}%`, top: "23%", right: "14%", color: "emerald" },
                          { label: "Uploaded Data", value: `${uploadedData.length} items`, bottom: "28%", left: "14%", color: "purple" },
                          { label: "Recommendations", value: `${recommendedData.length}`, bottom: "24%", right: "18%", color: "amber" },
                        ].map((node, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.15 }}
                            className="absolute p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl"
                            style={{ top: node.top, left: node.left, right: node.right, bottom: node.bottom }}
                          >
                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{node.label}</p>
                            <p
                              className={cn(
                                "text-xs font-black font-mono",
                                node.color === "purple"
                                  ? "text-purple-400"
                                  : node.color === "emerald"
                                    ? "text-emerald-400"
                                    : node.color === "amber"
                                      ? "text-amber-400"
                                      : "text-blue-400"
                              )}
                            >
                              {node.value}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                    <button
                      onClick={() => {
                        setViewMode("full");
                        setActiveTab("overview");
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === "full" ? "bg-white text-black" : "text-white/60 hover:text-white"
                      )}
                    >
                      Full View
                    </button>

                    <button
                      onClick={() => {
                        setViewMode("cardio");
                        setActiveTab("cardio");
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === "cardio" ? "bg-white text-black" : "text-white/60 hover:text-white"
                      )}
                    >
                      Cardio
                    </button>

                    <button
                      onClick={() => {
                        setViewMode("metabolic");
                        setActiveTab("metabolic");
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === "metabolic" ? "bg-white text-black" : "text-white/60 hover:text-white"
                      )}
                    >
                      Metabolic
                    </button>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                      <Layers className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => runSimulation("smoking for 10 years")}
                      className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Run Simulation
                    </button>
                  </div>
                </CardContent>
              </div>

              <div className="h-[650px] flex flex-col gap-6">
                <div className="p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex-1 overflow-y-auto shadow-xl">
                  <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2 italic serif">
                      Twin Metrics
                    </h3>
                    <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Overview</h2>
                  </div>

                  <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-8">
                    {[
                      { key: "overview", label: "Overview" },
                      { key: "cardio", label: "Cardio" },
                      { key: "metabolic", label: "Metabolic" },
                      { key: "neuro", label: "Neuro" },
                      { key: "longevity", label: "Longevity" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={cn(
                          "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                          activeTab === tab.key ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Biological Age</p>
                            <p className="text-2xl font-black text-emerald-400 font-mono">32.4</p>
                          </div>
                          <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Risk Score</p>
                            <p className="text-2xl font-black text-blue-400 font-mono">Low</p>
                          </div>
                          <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Simulated Future</p>
                            <p className="text-2xl font-black text-white font-mono">Stable</p>
                          </div>
                          <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Interventions</p>
                            <p className="text-2xl font-black text-amber-400 font-mono">3 Active</p>
                          </div>
                        </div>

                        <ExplainabilityPanel
                          title="System-Built Model"
                          sources={["Genomics", "Proteomics", "Biomarkers", "Lifestyle"]}
                          method="Automated synthesis of all available health data bank records."
                          recency="Real-time"
                          confidence="High"
                          interpretation="Your digital twin is automatically generated and updated as new data enters your health data bank."
                        />
                      </motion.div>
                    )}

                    {activeTab === "longevity" && (
                      <motion.div
                        key="longevity"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-5"
                      >
                        <div className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Longevity Trajectory</h4>
                          <div className="h-[180px] w-full mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={trajectoryData}>
                                <defs>
                                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                  dataKey="age" 
                                  stroke="#52525b" 
                                  fontSize={10} 
                                  tickLine={false} 
                                  axisLine={false}
                                  label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#52525b', fontSize: 10 }}
                                />
                                <YAxis hide />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                                  itemStyle={{ color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="health" stroke="#10b981" fillOpacity={1} fill="url(#colorHealth)" strokeWidth={2} />
                                <Line type="monotone" dataKey="baseline" stroke="#52525b" strokeDasharray="5 5" dot={false} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-zinc-500">Predicted Lifespan</span>
                              <span className="text-emerald-400">94.2 Years</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[85%]" />
                            </div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                              Based on current biomarkers and genetic predisposition. Intervention outcomes suggest +4.5 years with optimized sleep and nutrition.
                            </p>
                          </div>
                        </div>
                        <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Interventions</h4>
                          <ul className="space-y-3">
                            <li className="text-[9px] text-blue-300 uppercase tracking-widest font-bold flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
                              <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Target className="h-3 w-3" />
                              </div>
                              Optimize Vitamin D to 60ng/mL
                            </li>
                            <li className="text-[9px] text-blue-300 uppercase tracking-widest font-bold flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
                              <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <TrendingUp className="h-3 w-3" />
                              </div>
                              Increase Zone 2 cardio (+45m/wk)
                            </li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "cardio" && (
                      <motion.div
                        key="cardio"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-5"
                      >
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Biological Age</h4>
                              <div className="text-4xl font-black tracking-tighter text-emerald-400 font-mono">32.4</div>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                              <Heart className="h-5 w-5 text-emerald-400" />
                            </div>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-5">Chronological: 35.0</p>
                          <ExplainabilityPanel
                            title="Cardio Model"
                            sources={["Wearable Heart Rate", "VO2 Max", "Blood Lipids"]}
                            method="Cardio age estimate from fitness, recovery, and lipid-associated data."
                            recency="Updated today"
                            confidence="High"
                            interpretation="Your cardiovascular indicators currently support a younger biological age than your chronological age."
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "metabolic" && (
                      <motion.div
                        key="metabolic"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-5"
                      >
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Metabolic Index</h4>
                              <div className="text-4xl font-black tracking-tighter text-blue-400 uppercase">Optimal</div>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <Activity className="h-5 w-5 text-blue-400" />
                            </div>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-5">Glucose Stability: Good</p>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Uploading a complete metabolic panel and additional nutrition data would improve this model further.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "neuro" && (
                      <motion.div
                        key="neuro"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-5"
                      >
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Cognitive Recovery</h4>
                              <div className="text-4xl font-black tracking-tighter text-purple-400 uppercase">Stable</div>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                              <Brain className="h-5 w-5 text-purple-400" />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Sleep and stress data would strengthen the neurocognitive side of the twin.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 space-y-4">
                    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-4 w-4 text-emerald-400" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Twin Activity Log</h3>
                      </div>
                      <div className="space-y-3">
                        {activityLog.map((log, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-white uppercase tracking-tight">{log.event}</span>
                              <span className="text-[8px] text-zinc-500 uppercase tracking-widest">{log.time}</span>
                            </div>
                            <span className="text-[9px] font-mono text-emerald-400">{log.contribution}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                      <div className="flex items-center gap-3 mb-4">
                        <PlayCircle className="h-4 w-4 text-blue-400" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Simulation</h3>
                      </div>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold leading-relaxed mb-4">
                        Run predictive scenarios using the current twin model.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => runSimulation("smoking for 10 years")}
                          className="flex-1 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          10Y Smoking
                        </button>
                        <button
                          onClick={() => setIsSimulating(true)}
                          className="px-4 py-3 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                        >
                          Custom
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <Card className="xl:col-span-2 bg-black/40 backdrop-blur-3xl border-white/10 rounded-[2rem]">
                <CardHeader className="border-b border-white/5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight text-white uppercase">Uploaded Data</CardTitle>
                      <CardDescription className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">
                        Data currently powering your digital twin
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleMockUpload}
                      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {uploadedData.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.label}</h4>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-2">
                            {item.type} · {item.source}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
                            statusColor(item.status)
                          )}
                        >
                          {item.status}
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 rounded-[2rem]">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-xl font-black tracking-tight text-white uppercase">
                    Recommended Uploads
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">
                    Improve the twin with missing inputs
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {recommendedData.map((item) => (
                    <div key={item.id} className="p-4 rounded-3xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed">
                          {item.label}
                        </h4>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                            priorityColor(item.priority)
                          )}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">{item.reason}</p>
                    </div>
                  ))}

                  <Button
                    onClick={handleMockUpload}
                    variant="outline"
                    className="w-full rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest h-12"
                  >
                    <CloudUpload className="h-4 w-4 mr-2" />
                    Upload Recommended Data
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
                    Twin Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Completion</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{completionScore}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${completionScore}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
                    Safety Layer
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <p className="text-[10px] text-zinc-300 uppercase tracking-widest leading-relaxed">
                    Your twin uses uploaded and connected data to improve personalization while showing what data is still missing.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
                    Why Upload More?
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                  <p className="text-[10px] text-zinc-300 uppercase tracking-widest leading-relaxed">
                    More complete data improves twin fidelity, recommendations, and long-term prediction quality.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isSimulating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSimulating(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600">
                {isProcessing && (
                  <motion.div
                    animate={{ left: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-white/40"
                  />
                )}
              </div>

              <div className="p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 mb-2">
                      AI Predictive Simulation
                    </h3>
                    <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic serif">
                      {simulationResult ? "Scenario Analysis" : "Define Scenario"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsSimulating(false)}
                    className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {isProcessing ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="h-20 w-20 rounded-full border-2 border-dashed border-blue-500/30"
                      />
                      <Loader2 className="h-8 w-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
                      Processing digital twin simulation...
                    </p>
                  </div>
                ) : !simulationResult ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Define Scenario
                      </label>
                      <textarea
                        value={customScenario}
                        onChange={(e) => setCustomScenario(e.target.value)}
                        placeholder="e.g. poor sleep, high caffeine, no exercise, low vitamin D..."
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => runSimulation("smoking for 10 years, high sugar diet, no exercise")}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all"
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">
                          Preset
                        </span>
                        <span className="text-xs font-bold text-white">High Risk Lifestyle</span>
                      </button>

                      <button
                        onClick={() => runSimulation("plant-based diet, exercise, high sleep consistency, vitamin support")}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all"
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">
                          Preset
                        </span>
                        <span className="text-xs font-bold text-white">Longevity Protocol</span>
                      </button>
                    </div>

                    <button
                      onClick={() => runSimulation("")}
                      disabled={!customScenario}
                      className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50"
                    >
                      Run AI Simulation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <p className="text-sm text-zinc-300 leading-relaxed italic">"{simulationResult.summary}"</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cancer Risk</p>
                        <p className="text-xl font-black text-red-400 font-mono">{simulationResult.cancerRisk}%</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cardio Risk</p>
                        <p className="text-xl font-black text-amber-400 font-mono">{simulationResult.cardioRisk}%</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Metabolic Risk</p>
                        <p className="text-xl font-black text-blue-400 font-mono">{simulationResult.metabolicRisk}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {simulationResult.impacts?.map((impact: any, i: number) => (
                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className={cn("h-4 w-4", impact.color)} />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                              {impact.system}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white mb-1">{impact.effect}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Risk Level</span>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", impact.color)}>
                              {impact.risk}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setIsSimulating(false)}
                        className="flex-1 py-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest transition-all"
                      >
                        Close Simulation
                      </button>
                      <button
                        className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white/10"
                        onClick={() => toast.success("Simulation report exported successfully!")}
                      >
                        Export Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AIAgentPopup 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        initialMessage={aiInitialMessage}
        context={aiContext}
      />
    </div>
  );
}