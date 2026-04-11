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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function IndividualDashboard() {
  const { gender, setGender, agentName } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 pb-24">
      {/* Top Intelligence Banner */}
      <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050505] p-1 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
          {/* Left: Score & Identity */}
          <div className="lg:w-1/3 p-10 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center justify-center text-center">
            <div className="relative h-48 w-48 mb-8">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="44" cx="50" cy="50" />
                <motion.circle
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * 88) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="text-blue-500"
                  strokeWidth="6"
                  strokeDasharray="276.46"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="44"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black italic serif text-white tracking-tighter">88</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Optimal</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white serif mb-2">Biological Twin</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last Synced: 2 Minutes Ago</p>
            
            <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Telemetry Active</span>
            </div>
          </div>

          {/* Right: Insights & Actions */}
          <div className="flex-1 p-10 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">AI Intelligence Core</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white serif leading-none mb-6">
                Good Morning, <br /> <span className="text-blue-500">David</span>
              </h2>
              <p className="max-w-xl text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                Your biological systems are performing at 94% efficiency. Sleep recovery was exceptional, though hydration levels are slightly below baseline.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <ArrowUpRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Metabolic Rate</h4>
                <p className="text-xl font-black italic serif text-white">2,450 <span className="text-[10px] uppercase tracking-widest text-zinc-500 not-italic">kcal/day</span></p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="h-5 w-5 text-red-400" />
                  <ArrowUpRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">HRV Baseline</h4>
                <p className="text-xl font-black italic serif text-white">78 <span className="text-[10px] uppercase tracking-widest text-zinc-500 not-italic">ms</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!gender && (
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
                  Set your biological sex marker to unlock focus-specific health panels.
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

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Real-time Vitals Card */}
        <Card className="bg-[#0a0a0a] border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
            <Activity className="h-32 w-32" />
          </div>
          <CardHeader className="p-0 mb-8">
            <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
              <Activity className="h-4 w-4" />
              Live Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5 group/item hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Heart Rate</p>
                  <p className="text-2xl font-black italic serif text-white">72 <span className="text-[10px] not-italic text-zinc-600">BPM</span></p>
                </div>
              </div>
              <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ scaleX: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="h-full w-full bg-red-500 origin-left" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5 group/item hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Blood Oxygen</p>
                  <p className="text-2xl font-black italic serif text-emerald-400">98 <span className="text-[10px] not-italic text-zinc-600">%</span></p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5 group/item hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sleep Quality</p>
                  <p className="text-2xl font-black italic serif text-purple-400">84 <span className="text-[10px] not-italic text-zinc-600">/100</span></p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-zinc-700" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Goals Card */}
        <Card className="bg-[#0a0a0a] border-zinc-800 rounded-[2.5rem] p-8 group">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
              <Target className="h-4 w-4" />
              Biological Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Steps</p>
                  <p className="text-xl font-black italic serif text-white">8,432 <span className="text-[10px] not-italic text-zinc-600">/ 10,000</span></p>
                </div>
                <span className="text-[10px] font-black text-purple-400">84%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Hydration</p>
                  <p className="text-xl font-black italic serif text-white">1.8 <span className="text-[10px] not-italic text-zinc-600">/ 2.5 L</span></p>
                </div>
                <span className="text-[10px] font-black text-blue-400">72%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Active Minutes</p>
                  <p className="text-xl font-black italic serif text-white">45 <span className="text-[10px] not-italic text-zinc-600">/ 60 MIN</span></p>
                </div>
                <span className="text-[10px] font-black text-emerald-400">75%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-blue-600 border-none rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
            <Database className="h-64 w-64" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-6">Data Repository</h3>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic serif mb-4 leading-none">
              Health <br /> Data Bank
            </h2>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 max-w-[200px]">
              Access your genomics, proteomics, and daily health logs in one secure place.
            </p>
          </div>

          <Button 
            onClick={() => navigate("/data-bank")}
            className="relative z-10 w-full bg-white hover:bg-zinc-100 text-black rounded-2xl h-14 text-[11px] font-black uppercase tracking-widest shadow-xl"
          >
            Open Repository
          </Button>
        </Card>
      </div>

      {/* Personalized Insights Section */}
      <div className="grid grid-cols-1 gap-8">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#0a0a0a] p-12 group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">Personalized Insights</span>
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white serif mb-6">
                {gender === "Male" ? "Men's Health" : gender === "Female" ? "Women's Health" : "Biological"} Optimization
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed mb-8">
                Our AI has detected patterns in your hormonal baseline and metabolic markers. We've generated a specific optimization protocol for your current biological state.
              </p>
              <Button 
                onClick={() => navigate("/gender-health")}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-10 h-14 text-[11px] font-black uppercase tracking-widest"
              >
                View Protocol <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Hormonal Balance</p>
                <p className="text-3xl font-black italic serif text-white">92%</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Cellular Recovery</p>
                <p className="text-3xl font-black italic serif text-white">88%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
