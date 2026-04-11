import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { User, Users, ArrowRight, Activity, Shield, Heart, GitBranch, Database, Target } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";

export default function DashboardHub() {
  const navigate = useNavigate();
  const { setActiveContext, hasFamily } = useDashboard();

  const handleSelect = (mode: "individual" | "family") => {
    setActiveContext(mode);
    if (mode === "individual") {
      navigate("/individual-dashboard");
    } else {
      navigate("/family-dashboard");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="text-center mb-16 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-blue-500/50" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">
            Biological Intelligence Interface
          </span>
          <div className="h-px w-12 bg-blue-500/50" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white serif"
        >
          Select Your <span className="text-blue-500">Perspective</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed"
        >
          Choose between your personal health telemetry or the collective wellness of your family unit.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-6">
        {/* Individual Dashboard Option */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          whileHover={{ y: -10 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[3rem] opacity-20 group-hover:opacity-40 transition duration-500 blur-xl" />
          <div 
            onClick={() => handleSelect("individual")}
            className="relative h-full rounded-[3rem] border border-white/10 bg-[#0a0a0a] p-10 flex flex-col cursor-pointer overflow-hidden transition-all duration-500 group-hover:border-blue-500/50"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
              <User className="h-64 w-64" />
            </div>
            
            <div className="mb-12 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-blue-600/10 text-white shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
              <Logo className="h-10 w-10" color="#60A5FA" />
            </div>

            <div className="flex-1">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white serif mb-4">
                Individual <br /> <span className="text-blue-500">Intelligence</span>
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 max-w-xs">
                Deep-dive into your personal biomarkers, digital twin simulations, and molecular health tracking.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Shield className="h-3 w-3 text-blue-500" />
                  Bio-Security
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Heart className="h-3 w-3 text-blue-500" />
                  Vitals
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Database className="h-3 w-3 text-blue-500" />
                  Data Bank
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Target className="h-3 w-3 text-blue-500" />
                  Optimization
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Enter Personal Core</span>
              <div className="h-12 w-12 rounded-full border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
                <ArrowRight className="h-5 w-5 text-blue-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Family Dashboard Option */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          whileHover={{ y: -10 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-[3rem] opacity-20 group-hover:opacity-40 transition duration-500 blur-xl" />
          <div 
            onClick={() => handleSelect("family")}
            className="relative h-full rounded-[3rem] border border-white/10 bg-[#0a0a0a] p-10 flex flex-col cursor-pointer overflow-hidden transition-all duration-500 group-hover:border-emerald-500/50"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
              <Users className="h-64 w-64" />
            </div>

            <div className="mb-12 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20 group-hover:scale-110 transition-transform duration-500">
              <Users className="h-10 w-10" />
            </div>

            <div className="flex-1">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white serif mb-4">
                Family <br /> <span className="text-emerald-500">Coordination</span>
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 max-w-xs">
                Synchronize health goals, monitor shared genetic risks, and manage the wellness of your entire lineage.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <GitBranch className="h-3 w-3 text-emerald-500" />
                  Health Tree
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Users className="h-3 w-3 text-emerald-500" />
                  Shared Care
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Database className="h-3 w-3 text-emerald-500" />
                  Lineage Data
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <Target className="h-3 w-3 text-emerald-500" />
                  Group Goals
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Enter Family Network</span>
              <div className="h-12 w-12 rounded-full border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all duration-500">
                <ArrowRight className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-20 flex items-center gap-4 text-zinc-600"
      >
        <div className="h-1 w-1 rounded-full bg-zinc-800" />
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Secure Biological Data Transmission Active</span>
        <div className="h-1 w-1 rounded-full bg-zinc-800" />
      </motion.div>
    </div>
  );
}
