import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ArrowUpRight, 
  Activity,
  User,
  ChevronRight,
  Download,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDoctor } from "@/context/DoctorContext";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function PatientList() {
  const navigate = useNavigate();
  const { patients } = useDoctor();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-4 w-4 text-blue-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Patient Registry</h2>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">
            Managed Patients
          </h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">
            {patients.length} active clinical profiles under your care
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
            <Download className="h-4 w-4 mr-3" /> Export Registry
          </Button>
          <Button className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-2xl shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-3" /> Add New Patient
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or condition..." 
            className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] pl-16 text-xs font-bold uppercase tracking-widest focus:ring-blue-500/50"
          />
        </div>
        <Button variant="outline" className="h-16 px-8 border-white/10 bg-white/5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest">
          <Filter className="h-4 w-4 mr-3" /> Advanced Filters
        </Button>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient, i) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/doctor/patients/${patient.id}`)}
            className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <User className="h-8 w-8 text-zinc-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                patient.status === "Critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                patient.status === "Waiting for Data" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              )}>
                {patient.status}
              </div>
            </div>

            <div className="space-y-1 mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-widest">{patient.name}</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ID: {patient.id.slice(0, 8)} • {patient.age} Yrs • {patient.gender}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Last Visit</p>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{patient.lastVisit}</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Bio-Score</p>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">94/100</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
              </div>
              <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-blue-400 group-hover:text-blue-300">
                Full Profile <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
