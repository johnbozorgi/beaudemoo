import React, { useState } from "react";
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Activity, 
  Shield, 
  Zap, 
  Sparkles, 
  Trash2, 
  Save, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Microscope,
  Dna,
  Droplets,
  Heart,
  Brain,
  Thermometer,
  ActivitySquare,
  Lock,
  Unlock,
  Clock,
  User,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useDoctor } from "@/context/DoctorContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function DataRequests() {
  const { patients } = useDoctor();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "denied">("pending");

  const allRequests = patients.flatMap(p => 
    p.requests.map(r => ({ ...r, patientName: p.name, patientId: p.id }))
  );

  const filteredRequests = allRequests.filter(r => 
    activeTab === "pending" ? r.status === "Pending" :
    activeTab === "approved" ? r.status === "Approved" :
    r.status === "Denied"
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-4 w-4 text-blue-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Data Governance Terminal</h2>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">
            Access Requests
          </h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">
            Manage clinical data access permissions and biological telemetry requests
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
            <Download className="h-4 w-4 mr-3" /> Audit Log
          </Button>
          <Button className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-2xl shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-3" /> New Data Request
          </Button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          {["pending", "approved", "denied"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
            <Input 
              placeholder="Search requests..." 
              className="h-12 w-64 bg-white/5 border-white/10 rounded-xl pl-10 text-[9px] font-black uppercase tracking-widest"
            />
          </div>
          <Button variant="outline" className="h-12 border-white/10 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
            <Filter className="h-3.5 w-3.5 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredRequests.map((request, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl group hover:border-blue-500/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-8">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center border transition-all",
                  request.status === "Approved" ? "bg-emerald-600/10 border-emerald-600/20 text-emerald-400" :
                  request.status === "Pending" ? "bg-amber-600/10 border-amber-600/20 text-amber-400" :
                  "bg-red-600/10 border-red-600/20 text-red-400"
                )}>
                  {request.status === "Approved" ? <Unlock className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">{request.type}</h3>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      request.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      request.status === "Pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                      {request.status}
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {request.patientName}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-800" />
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Requested on {request.date}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
                  View Details <ArrowUpRight className="h-3 w-3 ml-2" />
                </Button>
                {request.status === "Pending" && (
                  <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Resend Request
                  </Button>
                )}
                {request.status === "Approved" && (
                  <Button className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Access Data
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-zinc-500 hover:text-red-400">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredRequests.length === 0 && (
          <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-zinc-600">
              <ClipboardList className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic serif tracking-tighter mb-4">No Requests Found</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              There are currently no clinical data access requests in the {activeTab} queue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
