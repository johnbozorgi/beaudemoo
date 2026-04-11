import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  GitBranch,
  Stethoscope,
  Database,
  Target,
  PieChart,
  Bot,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Heart,
  Activity,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FamilyDashboard() {
  const { hasFamily, setHasFamily } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 pb-24">
      {/* Family Intelligence Banner */}
      <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050505] p-1 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
          {/* Left: Family Index */}
          <div className="lg:w-1/3 p-10 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center justify-center text-center">
            <div className="relative h-48 w-48 mb-8">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="44" cx="50" cy="50" />
                <motion.circle
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * 92) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="text-emerald-500"
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
                <span className="text-6xl font-black italic serif text-white tracking-tighter">92</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Resilient</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white serif mb-2">Family Wellness</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aggregate Score: 4 Members</p>
            
            <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Network Synced</span>
            </div>
          </div>

          {/* Right: Family Insights */}
          <div className="flex-1 p-10 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Lineage Coordination</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white serif leading-none mb-6">
                The <span className="text-emerald-500">Houshangidi</span> Unit
              </h2>
              <p className="max-w-xl text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                Your family's collective health index is trending upward. Shared activity goals are 85% complete for the week.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="h-5 w-5 text-emerald-400" />
                  <ArrowUpRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Shared Vitality</h4>
                <p className="text-xl font-black italic serif text-white">Optimal <span className="text-[10px] uppercase tracking-widest text-zinc-500 not-italic">Status</span></p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-5 w-5 text-emerald-400" />
                  <ArrowUpRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Group Goals</h4>
                <p className="text-xl font-black italic serif text-white">12 / 15 <span className="text-[10px] uppercase tracking-widest text-zinc-500 not-italic">Active</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hasFamily && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-600/15 via-black to-emerald-600/5 p-8 shadow-2xl"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white serif">
                  Initialize Family Network
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Connect your family members to synchronize wellness goals and shared care.
                </p>
              </div>
            </div>
            <Link
              to="/family"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] hover:bg-zinc-200"
            >
              Create Profile
            </Link>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Family Wellness Status */}
        <Card className="bg-[#0a0a0a] border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
            <Users className="h-32 w-32" />
          </div>
          <CardHeader className="p-0 mb-8">
            <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              <Activity className="h-4 w-4" />
              Unit Wellness
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {[
              { name: "Sarah (Partner)", status: "Optimal", color: "text-emerald-400" },
              { name: "Leo (Son)", status: "Active", color: "text-blue-400" },
              { name: "Mia (Daughter)", status: "Resting", color: "text-purple-400" }
            ].map((member, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5 group/item hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{member.name}</p>
                    <p className={cn("text-lg font-black italic serif", member.color)}>{member.status}</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shared Goals Card */}
        <Card className="bg-[#0a0a0a] border-zinc-800 rounded-[2.5rem] p-8 group">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
              <Target className="h-4 w-4" />
              Shared Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Family Steps</p>
                  <p className="text-xl font-black italic serif text-white">24,500 <span className="text-[10px] not-italic text-zinc-600">/ 30,000</span></p>
                </div>
                <span className="text-[10px] font-black text-emerald-400">81%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "81%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Screen Time Limit</p>
                  <p className="text-xl font-black italic serif text-white">12.5 <span className="text-[10px] not-italic text-zinc-600">/ 15 HRS</span></p>
                </div>
                <span className="text-[10px] font-black text-blue-400">83%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "83%" }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400" 
                />
              </div>
            </div>

            <Button 
              onClick={() => navigate("/family-goals")}
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest"
            >
              Manage Shared Goals
            </Button>
          </CardContent>
        </Card>

        {/* Family Tree Quick Access */}
        <Card className="bg-emerald-600 border-none rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
            <GitBranch className="h-64 w-64" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 mb-6">Lineage Mapping</h3>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic serif mb-4 leading-none">
              Family <br /> Health Tree
            </h2>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 max-w-[200px]">
              Visualize genetic risks and health history across your entire family network.
            </p>
          </div>

          <Button 
            onClick={() => navigate("/family")}
            className="relative z-10 w-full bg-white hover:bg-zinc-100 text-black rounded-2xl h-14 text-[11px] font-black uppercase tracking-widest shadow-xl"
          >
            View Lineage
          </Button>
        </Card>
      </div>

      {/* Family Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Database, title: "Family Data", path: "/family-health-data", color: "text-blue-400" },
          { icon: Stethoscope, title: "Family Doctor", path: "/family-doctor", color: "text-emerald-400" },
          { icon: PieChart, title: "Reports", path: "/family-reports", color: "text-purple-400" },
          { icon: BookOpen, title: "Articles", path: "/family-articles", color: "text-orange-400" }
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all text-left group"
          >
            <item.icon className={cn("h-6 w-6 mb-6 group-hover:scale-110 transition-transform", item.color)} />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white">{item.title}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}
