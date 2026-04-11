import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Target, TrendingUp, CheckCircle2, Clock, Plus, 
  ChevronRight, Activity, Heart, Zap, Sparkles, 
  Brain, Droplets, Utensils, Smartphone, Stethoscope,
  Users, PawPrint, Trash2, Edit2, Share2, Info,
  Calendar, ArrowUpRight, AlertCircle, ShieldCheck,
  Dna, FileText, Database, Siren
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
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

interface Goal {
  id: string;
  title: string;
  category: "Biological" | "Lifestyle" | "Cognitive" | "Longevity";
  progress: number;
  target: string;
  deadline: string;
  status: "Active" | "Completed" | "At Risk";
  icon: any;
  color: string;
  aiInsight: string;
  aiReminders?: boolean;
  adherenceData?: { day: string; value: number }[];
}

export default function HealthGoals() {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("active");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [aiInitialMessage, setAiInitialMessage] = useState("");

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Reduce Biological Age",
      category: "Longevity",
      progress: 65,
      target: "-2.5 Years",
      deadline: "2025-12-31",
      status: "Active",
      icon: Dna,
      color: "text-purple-400",
      aiInsight: "Based on your current methylation trends, you are on track to exceed this goal by 15%.",
      aiReminders: true,
      adherenceData: [
        { day: "Mon", value: 80 },
        { day: "Tue", value: 90 },
        { day: "Wed", value: 70 },
        { day: "Thu", value: 85 },
        { day: "Fri", value: 95 },
        { day: "Sat", value: 60 },
        { day: "Sun", value: 75 },
      ]
    },
    {
      id: "2",
      title: "Optimize HRV Baseline",
      category: "Biological",
      progress: 42,
      target: "+15 ms",
      deadline: "2025-11-30",
      status: "At Risk",
      icon: Heart,
      color: "text-red-400",
      aiInsight: "Recent sleep disruptions are impacting your recovery. Consider adjusting your evening routine.",
      aiReminders: false,
      adherenceData: [
        { day: "Mon", value: 40 },
        { day: "Tue", value: 30 },
        { day: "Wed", value: 50 },
        { day: "Thu", value: 20 },
        { day: "Fri", value: 45 },
        { day: "Sat", value: 10 },
        { day: "Sun", value: 35 },
      ]
    },
    {
      id: "3",
      title: "Deep Sleep Optimization",
      category: "Lifestyle",
      progress: 88,
      target: "2.0 Hours Avg",
      deadline: "2025-10-15",
      status: "Active",
      icon: Zap,
      color: "text-amber-400",
      aiInsight: "Your magnesium supplementation has significantly improved your deep sleep architecture.",
      aiReminders: true,
      adherenceData: [
        { day: "Mon", value: 95 },
        { day: "Tue", value: 98 },
        { day: "Wed", value: 90 },
        { day: "Thu", value: 92 },
        { day: "Fri", value: 85 },
        { day: "Sat", value: 80 },
        { day: "Sun", value: 88 },
      ]
    }
  ]);

  const handleAddGoal = () => {
    setIsAddOpen(false);
    toast.success("New health goal established!");
    addNotification({
      title: "Goal Established",
      message: "Your new biological optimization goal has been synchronized with your Digital Twin.",
      type: "success"
    });
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success("Goal removed");
  };

  const toggleAIReminders = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, aiReminders: !g.aiReminders } : g));
    const goal = goals.find(g => g.id === id);
    if (goal) {
      toast.success(`AI Reminders ${!goal.aiReminders ? "Enabled" : "Disabled"} for ${goal.title}`);
    }
  };

  const filteredGoals = activeTab === "active" 
    ? goals.filter(g => g.status !== "Completed")
    : goals.filter(g => g.status === "Completed");

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Biological Optimization</h2>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">Health Goals</h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">Establish and track your path to peak biological performance</p>
        </div>
        <div className="flex gap-4">
          <Tabs className="bg-white/5 p-1 rounded-2xl border border-white/10">
            <TabsList className="bg-transparent border-none">
              <TabsTrigger 
                active={activeTab === "active"} 
                onClick={() => setActiveTab("active")}
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10"
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === "completed"} 
                onClick={() => setActiveTab("completed")}
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-10"
        >
          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Current Objectives</h3>
                <Button 
                  onClick={() => setIsAddOpen(true)}
                  className="h-10 px-6 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" /> Establish Goal
                </Button>
              </div>

              <div className="space-y-6">
                {filteredGoals.map((goal) => (
                  <div 
                    key={goal.id}
                    className="group bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] hover:bg-white/5 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <goal.icon className={cn("h-8 w-8", goal.color)} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic serif">{goal.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{goal.category}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-700" />
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              goal.status === "At Risk" ? "text-red-500" : "text-emerald-500"
                            )}>
                              {goal.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="text-3xl font-black text-white font-mono">{goal.progress}%</p>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target: {goal.target}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setSelectedGoal(goal); setIsEditOpen(true); }}
                            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveGoal(goal.id)}
                            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <Progress value={goal.progress} className="h-3 bg-white/5 border border-white/5 p-0.5" />
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-500">
                            <span>Initiated</span>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>Deadline: {goal.deadline}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-6 items-start relative overflow-hidden group/insight">
                          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/insight:opacity-100 transition-opacity" />
                          <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 flex-shrink-0 relative z-10">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div className="relative z-10 flex-1">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Biological Insight</p>
                            <p className="text-xs text-zinc-300 leading-relaxed font-medium">{goal.aiInsight}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Smartphone className={cn("h-4 w-4", goal.aiReminders ? "text-emerald-400" : "text-zinc-500")} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">AI Reminders</span>
                              </div>
                              <button 
                                onClick={() => toggleAIReminders(goal.id)}
                                className={cn(
                                  "h-6 w-12 rounded-full p-1 transition-all",
                                  goal.aiReminders ? "bg-emerald-600" : "bg-zinc-700"
                                )}
                              >
                                <div className={cn(
                                  "h-4 w-4 rounded-full bg-white transition-all",
                                  goal.aiReminders ? "translate-x-6" : "translate-x-0"
                                )} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-48 bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Schedule Adherence</h5>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Adherence %</span>
                          </div>
                        </div>
                        <div className="h-32 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={goal.adherenceData}>
                              <defs>
                                <linearGradient id={`gradient-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 8, fill: '#71717a' }}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                itemStyle={{ color: '#fff' }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill={`url(#gradient-${goal.id})`} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          setAiInitialMessage(`I'm looking at my progress for "${goal.title}". Can you give me some specific recommendations to improve my adherence?`);
                          setAiContext(`The user is tracking their health goal: "${goal.title}". Current progress is ${goal.progress}%. Adherence trends are available. Provide actionable, science-based advice.`);
                          setIsAIOpen(true);
                        }}
                        className="bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-2xl px-8 h-12 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                      >
                        <Sparkles className="h-4 w-4 text-blue-400" />
                        Optimize Strategy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar / Stats */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/5">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Optimization Velocity
                  </h3>
                </div>
                <div className="p-8 space-y-8">
                  {[
                    { label: "Longevity Score", value: "+4.2%", trend: "up" },
                    { label: "Metabolic Health", value: "+12.8%", trend: "up" },
                    { label: "Cognitive Clarity", value: "+2.5%", trend: "up" }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                      <div className="flex items-center gap-2 text-emerald-500">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-sm font-black font-mono">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="p-8 bg-gradient-to-br from-purple-600 to-blue-700 rounded-[2.5rem] text-white shadow-2xl shadow-purple-600/20">
                <h3 className="text-xl font-black italic serif uppercase tracking-tighter mb-4">Digital Twin Sync</h3>
                <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">Your goals are being simulated across 10,000 potential future timelines to ensure optimal outcomes.</p>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Simulation Verified</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add Goal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-10 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic serif">Establish New Goal</DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Define your biological optimization path</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Goal Title</label>
              <Input placeholder="E.G., OPTIMIZE DEEP SLEEP..." className="h-14 bg-white/5 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</label>
              <div className="grid grid-cols-2 gap-4">
                {["Biological", "Lifestyle", "Cognitive", "Longevity"].map(c => (
                  <Button key={c} variant="outline" className="h-12 border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10">
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Target Value</label>
                <Input placeholder="E.G., +15 MS..." className="h-14 bg-white/5 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Deadline</label>
                <Input type="date" className="h-14 bg-white/5 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAddGoal} className="w-full h-14 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
              Sync with Digital Twin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AIAgentPopup 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        initialMessage={aiInitialMessage}
        context={aiContext}
      />
    </div>
  );
}
