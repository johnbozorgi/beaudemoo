import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Activity, 
  Search, 
  Plus, 
  FileText, 
  MessageSquare, 
  Settings,
  Bell,
  User,
  ArrowUpRight,
  Shield,
  Zap,
  ActivitySquare,
  Sparkles,
  Filter,
  MoreHorizontal,
  FlaskConical,
  Download,
  AlertCircle,
  LogOut,
  Lock,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bot
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useDoctor } from "@/context/DoctorContext";
import { useNavigate } from "react-router-dom";

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { doctor, patients, appointments } = useDoctor();

  const stats = [
    { label: "Total Patients", value: patients.length, sub: "+2 this week", icon: Users, color: "blue" },
    { label: "Today's Schedule", value: appointments.filter(a => a.status === "Upcoming").length, sub: "Next at 09:00 AM", icon: Calendar, color: "emerald" },
    { label: "Pending Requests", value: patients.reduce((acc, p) => acc + p.requests.filter(r => r.status === "Pending").length, 0), sub: "Action required", icon: FileText, color: "amber" },
    { label: "Critical Alerts", value: patients.filter(p => p.status === "Critical").length, sub: "Immediate review", icon: AlertCircle, color: "red" }
  ];

  const recentActivity = [
    { patient: "John Doe", action: "Uploaded Lab Results", time: "2 hours ago", type: "data" },
    { patient: "Robert Smith", action: "Missed Medication Dose", time: "4 hours ago", type: "alert" },
    { patient: "Jane Wilson", action: "Completed Daily Biomarkers", time: "5 hours ago", type: "data" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Clinical Command Center</h2>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">
            Welcome, {doctor?.name.split(',')[0]}
          </h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">
            System status: <span className="text-emerald-500">Optimal</span> • Last sync: Just now
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate("/doctor/patients")}
            className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/20"
          >
            <Plus className="h-4 w-4 mr-3" /> New Patient
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl group hover:border-white/20 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl bg-opacity-10 border border-opacity-20", 
                stat.color === "blue" ? "bg-blue-500 border-blue-500 text-blue-400" :
                stat.color === "emerald" ? "bg-emerald-500 border-emerald-500 text-emerald-400" :
                stat.color === "amber" ? "bg-amber-500 border-amber-500 text-amber-400" :
                "bg-red-500 border-red-500 text-red-400"
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">0{i+1}</div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{stat.label}</p>
            <div className="text-4xl font-black text-white tracking-tighter font-mono">{stat.value}</div>
            <p className={cn("text-[9px] font-bold uppercase tracking-widest mt-3", 
              stat.color === "red" ? "text-red-500" : "text-zinc-600"
            )}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Feed: Today's Schedule & Alerts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule */}
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic serif tracking-tighter">Today's Schedule</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Manage your clinical queue</p>
                </div>
              </div>
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white" onClick={() => navigate("/doctor/appointments")}>
                View Full Calendar <ArrowUpRight className="h-3 w-3 ml-2" />
              </Button>
            </div>

            <div className="space-y-4">
              {appointments.filter(a => a.status === "Upcoming").map((apt) => (
                <div key={apt.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:border-blue-500/30 transition-all cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center border-r border-white/10 pr-6">
                      <p className="text-lg font-black text-white font-mono">{apt.time.split(' ')[0]}</p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{apt.time.split(' ')[1]}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{apt.patientName}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">{apt.type} • {apt.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
                      Ready
                    </div>
                    <Button className="h-10 px-6 bg-white text-black hover:bg-zinc-200 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                      Start Session
                    </Button>
                  </div>
                </div>
              ))}
              {appointments.filter(a => a.status === "Upcoming").length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No upcoming appointments for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="p-10 bg-red-600/5 border border-red-500/20 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic serif tracking-tighter">Critical Telemetry</h3>
                <p className="text-[10px] text-red-500/70 uppercase tracking-widest font-bold">Immediate clinical review required</p>
              </div>
            </div>

            <div className="space-y-4">
              {patients.filter(p => p.status === "Critical").map((patient) => (
                <div key={patient.id} className="p-6 bg-red-600/5 border border-red-500/10 rounded-[2rem] flex items-center justify-between group hover:bg-red-600/10 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{patient.name}</h4>
                      <p className="text-[10px] text-red-400/70 uppercase tracking-widest font-bold mt-1">
                        {patient.biomarkers.find(b => b.status === "Critical")?.name || "Multiple Anomalies"} Detected
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                    className="h-10 px-6 bg-red-600 text-white hover:bg-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Review Data
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: AI Assistant & Recent Activity */}
        <div className="space-y-8">
          {/* AI Health Assistant Quick Tool */}
          <div className="p-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6">
              <Sparkles className="h-6 w-6 text-blue-400 opacity-50 group-hover:scale-125 transition-transform duration-700" />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase italic serif tracking-tighter">AI Assistant</h3>
                <p className="text-[9px] text-blue-300 uppercase tracking-widest font-bold">Clinical Support Engine</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-8 italic">
              "I've analyzed the metabolic trends for your active cases. 3 patients show early signs of medication non-adherence."
            </p>
            <Button 
              onClick={() => navigate("/doctor/ai-assistant")}
              className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
            >
              Open AI Sandbox
            </Button>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Clock className="h-4 w-4 text-zinc-500" />
              Recent Activity
            </h3>
            <div className="space-y-8">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute left-2.5 top-8 bottom-[-20px] w-[1px] bg-white/5" />
                  )}
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 border-[#050505] flex items-center justify-center z-10",
                    activity.type === "alert" ? "bg-red-500" : "bg-blue-500"
                  )}>
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-white uppercase tracking-widest">{activity.patient}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{activity.action}</p>
                    <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <MessageSquare className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Messages</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <FlaskConical className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Panels</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <FileText className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Reports</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <Settings className="h-6 w-6 text-zinc-400 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
