import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  Activity, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ArrowLeft, 
  Plus, 
  Download, 
  Shield, 
  Zap, 
  ActivitySquare, 
  Sparkles, 
  Filter, 
  MoreHorizontal, 
  FlaskConical, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Heart,
  Thermometer,
  Droplets,
  Microscope,
  Stethoscope,
  ClipboardList,
  History,
  ChevronRight,
  Edit3,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDoctor } from "@/context/DoctorContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients } = useDoctor();
  const [activeTab, setActiveTab] = useState("overview");

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase italic serif tracking-tighter">Patient Not Found</h2>
        <Button onClick={() => navigate("/doctor/patients")} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-8">
          <Button 
            onClick={() => navigate("/doctor/patients")} 
            variant="ghost" 
            size="icon" 
            className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-600/20">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic serif">{patient.name}</h1>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  patient.status === "Critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                  patient.status === "Waiting for Data" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                )}>
                  {patient.status}
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-4">
                <span>ID: {patient.id.slice(0, 12)}</span>
                <span className="h-1 w-1 rounded-full bg-zinc-800" />
                <span>{patient.age} Yrs • {patient.gender}</span>
                <span className="h-1 w-1 rounded-full bg-zinc-800" />
                <span>Last Sync: 2 mins ago</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
            <Download className="h-4 w-4 mr-3" /> Export Medical Record
          </Button>
          <Button className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-2xl shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-3" /> Add Clinical Note
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs className="space-y-10">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white/5 border border-white/10 p-1.5 h-16 rounded-[1.5rem]">
            <TabsTrigger active={activeTab === "overview"} onClick={() => setActiveTab("overview")} className="px-8 h-full text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Overview</TabsTrigger>
            <TabsTrigger active={activeTab === "biomarkers"} onClick={() => setActiveTab("biomarkers")} className="px-8 h-full text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Biomarkers</TabsTrigger>
            <TabsTrigger active={activeTab === "medications"} onClick={() => setActiveTab("medications")} className="px-8 h-full text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Medications</TabsTrigger>
            <TabsTrigger active={activeTab === "history"} onClick={() => setActiveTab("history")} className="px-8 h-full text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">History</TabsTrigger>
            <TabsTrigger active={activeTab === "requests"} onClick={() => setActiveTab("requests")} className="px-8 h-full text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Data Requests</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
              <Filter className="h-4 w-4 mr-2" /> Filter View
            </Button>
          </div>
        </div>

        <TabsContent active={activeTab === "overview"} className="space-y-10 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Vital Signs & AI Insights */}
            <div className="lg:col-span-2 space-y-10">
              {/* Vital Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Heart Rate", value: "72", unit: "BPM", status: "Normal", icon: Heart, color: "red" },
                  { label: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Optimal", icon: Activity, color: "blue" },
                  { label: "Body Temp", value: "98.6", unit: "°F", status: "Stable", icon: Thermometer, color: "amber" },
                ].map((vital, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl group hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("p-4 rounded-2xl bg-opacity-10 border border-opacity-20", 
                        vital.color === "red" ? "bg-red-500 border-red-500 text-red-400" :
                        vital.color === "blue" ? "bg-blue-500 border-blue-500 text-blue-400" :
                        "bg-amber-500 border-amber-500 text-amber-400"
                      )}>
                        <vital.icon className="h-6 w-6" />
                      </div>
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{vital.status}</div>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{vital.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white tracking-tighter font-mono">{vital.value}</span>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{vital.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Clinical Insight */}
              <div className="p-10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                  <Sparkles className="h-8 w-8 text-blue-400 opacity-30 group-hover:scale-125 transition-transform duration-700" />
                </div>
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40">
                    <Zap className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic serif tracking-tighter">AI Diagnostic Insight</h3>
                    <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">Neural Analysis Engine • V4.2</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    "Based on the last 30 days of biological telemetry, {patient.name} shows a 14% increase in systemic inflammation markers. This correlates with a slight decrease in deep sleep duration and elevated resting heart rate. Recommend ordering a high-sensitivity C-reactive protein (hs-CRP) panel."
                  </p>
                  <div className="flex items-center gap-4">
                    <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Accept Recommendation
                    </Button>
                    <Button variant="ghost" className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
                      View Full Analysis
                    </Button>
                  </div>
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                      <Edit3 className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic serif tracking-tighter">Clinical Notes</h3>
                  </div>
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
                    View All Notes <ArrowUpRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
                <div className="space-y-6">
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 font-black text-xs">DR</div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Dr. Richards</p>
                          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">March 28, 2024 • 10:45 AM</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-widest">Routine Follow-up</div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Patient reports improved energy levels after starting Vitamin D3 supplementation. Blood pressure remains stable at 120/80. Advised to continue current exercise regimen and return in 3 months for full metabolic panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Demographics & Quick Actions */}
            <div className="space-y-10">
              {/* Demographics Card */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                  <User className="h-4 w-4 text-zinc-500" />
                  Demographics
                </h3>
                <div className="space-y-6">
                  {[
                    { label: "Biological Sex", value: patient.gender },
                    { label: "Ethnicity", value: "Caucasian" },
                    { label: "Height", value: "182 cm" },
                    { label: "Weight", value: "78 kg" },
                    { label: "Blood Type", value: "O Positive" },
                    { label: "Occupation", value: "Software Architect" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Timeline */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                  <History className="h-4 w-4 text-zinc-500" />
                  Recent Timeline
                </h3>
                <div className="space-y-8">
                  {[
                    { event: "Lab Results Uploaded", date: "Mar 25", type: "lab" },
                    { event: "Telehealth Visit", date: "Mar 20", type: "visit" },
                    { event: "Medication Renewal", date: "Mar 15", type: "med" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== 2 && <div className="absolute left-2.5 top-8 bottom-[-20px] w-[1px] bg-white/5" />}
                      <div className="h-5 w-5 rounded-full bg-blue-600 border-2 border-[#050505] z-10" />
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.event}</p>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "biomarkers"} className="space-y-10 outline-none">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic serif tracking-tighter">Biomarker Telemetry</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">Real-time biological performance tracking</p>
              </div>
              <Button className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Plus className="h-4 w-4 mr-2" /> Request New Panel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {patient.biomarkers.map((biomarker, i) => (
                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group hover:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                        <Microscope className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">{biomarker.name}</h4>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Last Tested: {biomarker.lastTested}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                      biomarker.status === "Critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                      biomarker.status === "Warning" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    )}>
                      {biomarker.status}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Current Value</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-white font-mono">{biomarker.value}</span>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{biomarker.unit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Reference Range</p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{biomarker.range}</p>
                      </div>
                    </div>

                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000",
                          biomarker.status === "Normal" ? "bg-emerald-500" : 
                          biomarker.status === "Warning" ? "bg-amber-500" : "bg-red-500"
                        )} 
                        style={{ width: "75%" }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "medications"} className="space-y-10 outline-none">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic serif tracking-tighter">Medication Protocol</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">Active prescriptions and adherence tracking</p>
              </div>
              <Button className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Plus className="h-4 w-4 mr-2" /> New Prescription
              </Button>
            </div>

            <div className="space-y-6">
              {patient.medications.map((med, i) => (
                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400">
                      <Pill className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest">{med.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{med.dosage} • {med.frequency}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Adherence</p>
                      <p className="text-lg font-black text-emerald-500 font-mono">{med.adherence}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Last Taken</p>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Today, 08:00 AM</p>
                    </div>
                    <Button variant="ghost" className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">
                      Modify Protocol <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "history"} className="space-y-10 outline-none">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic serif tracking-tighter">Clinical History</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">Historical visit summaries and diagnostic records</p>
              </div>
              <Button className="h-12 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Download className="h-4 w-4 mr-2" /> Download Full History
              </Button>
            </div>

            <div className="relative space-y-12 before:absolute before:left-[31px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {patient.notes.map((note, i) => (
                <div key={i} className="relative pl-20">
                  <div className="absolute left-0 top-2 h-16 w-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 z-10">
                    <History className="h-8 w-8" />
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-widest">{note.type}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{note.date} • {note.author}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-zinc-500 hover:text-white">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "requests"} className="space-y-10 outline-none">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic serif tracking-tighter">Data Access Requests</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">Manage permissions for patient biological data</p>
              </div>
              <Button className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Plus className="h-4 w-4 mr-2" /> New Request
              </Button>
            </div>

            <div className="space-y-6">
              {patient.requests.map((request, i) => (
                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                      <Shield className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-widest">{request.type}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Requested on {request.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                      request.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      request.status === "Pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                      {request.status}
                    </div>
                    {request.status === "Pending" && (
                      <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Resend Request
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
