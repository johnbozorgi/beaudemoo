import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Share2, TrendingUp, ActivitySquare, Clock, Filter, ChevronRight, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const data = [
  { name: 'Mon', score: 80 },
  { name: 'Tue', score: 82 },
  { name: 'Wed', score: 81 },
  { name: 'Thu', score: 84 },
  { name: 'Fri', score: 83 },
  { name: 'Sat', score: 86 },
  { name: 'Sun', score: 85 },
];

export default function Reports() {
  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Analytics Engine</h2>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">Biological Reports</h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">Deep-dive analysis of your biological telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
            {["Daily", "Bi-weekly", "Annual"].map((period) => (
              <button
                key={period}
                className={cn(
                  "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                  period === "Daily" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <Button variant="outline" className="h-10 w-10 p-0 bg-white/5 border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-10 w-10 p-0 bg-white/5 border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
              <ActivitySquare className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Health Score Trend</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Composite biological stability index</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Current Peak</p>
              <p className="text-xl font-black text-white font-mono">86.4</p>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="text-right">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Variance</p>
              <p className="text-xl font-black text-emerald-500 font-mono">+2.4%</p>
            </div>
          </div>
        </div>
        
        <div className="p-10">
          <div className="h-[400px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#52525b', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#52525b', fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderRadius: '16px', border: '1px solid #27272a', color: '#ffffff' }}
                  itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  cursor={{ stroke: '#27272a', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
            <ExplainabilityPanel 
              title="Metric Computation & Trend Analysis"
              sources={["Daily Health Score Aggregations", "Biometric Sensor Fusion"]}
              method="7-day moving average of your composite health score using weighted system inputs."
              recency="Updated 12 mins ago"
              confidence="High"
              interpretation="Your score shows a positive upward trend, peaking on Saturday. This correlates strongly with your reported increased sleep duration and reduced stress levels during the weekend."
              action="Maintain current recovery protocols. The data suggests your 'Active Recovery' phase is highly effective."
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Sleep Quality", value: "85%", trend: "+5%", status: "Optimal", color: "blue" },
          { label: "Stress Levels", value: "Low", trend: "Improved", status: "Stable", color: "emerald" },
          { label: "Activity Volume", value: "9.4k", trend: "+12%", status: "Active", color: "purple" },
          { label: "Recovery Rate", value: "Optimal", trend: "Ready", status: "Peak", color: "blue" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-[2rem] group hover:bg-zinc-900 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-4 w-4 text-zinc-600" />
            </div>
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6 italic serif">{stat.label}</h4>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-white tracking-tighter uppercase italic serif">{stat.value}</span>
            </div>
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-800/50">
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{stat.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
