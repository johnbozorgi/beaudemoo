import React, { useState } from "react";
import { 
  FlaskConical, 
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
  ActivitySquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Biomarker {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  range: string;
}

export default function BiomarkerCollector() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<Biomarker[]>([]);
  const [panelName, setPanelName] = useState("");

  const availableBiomarkers: Biomarker[] = [
    { id: "1", name: "hs-CRP", category: "Inflammation", description: "High-sensitivity C-reactive protein measures systemic inflammation.", unit: "mg/L", range: "< 1.0" },
    { id: "2", name: "HbA1c", category: "Metabolic", description: "Glycated hemoglobin measures average blood sugar levels over 3 months.", unit: "%", range: "4.0 - 5.6" },
    { id: "3", name: "Cortisol", category: "Hormonal", description: "Measures the body's primary stress hormone levels.", unit: "mcg/dL", range: "6.0 - 23.0" },
    { id: "4", name: "Vitamin D", category: "Nutritional", description: "Measures 25-hydroxyvitamin D levels for bone and immune health.", unit: "ng/mL", range: "30.0 - 100.0" },
    { id: "5", name: "LDL Cholesterol", category: "Lipids", description: "Low-density lipoprotein, often called 'bad' cholesterol.", unit: "mg/dL", range: "< 100" },
    { id: "6", name: "Testosterone", category: "Hormonal", description: "Measures total testosterone levels in the blood.", unit: "ng/dL", range: "300 - 1000" },
    { id: "7", name: "Ferritin", category: "Iron", description: "Measures the amount of iron stored in the body.", unit: "ng/mL", range: "30 - 400" },
    { id: "8", name: "TSH", category: "Thyroid", description: "Thyroid-stimulating hormone measures thyroid function.", unit: "mIU/L", range: "0.4 - 4.0" },
  ];

  const filteredBiomarkers = availableBiomarkers.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBiomarker = (biomarker: Biomarker) => {
    if (selectedBiomarkers.find(b => b.id === biomarker.id)) {
      setSelectedBiomarkers(prev => prev.filter(b => b.id !== biomarker.id));
    } else {
      setSelectedBiomarkers(prev => [...prev, biomarker]);
    }
  };

  const handleSavePanel = () => {
    if (!panelName) {
      toast.error("Please provide a name for this panel");
      return;
    }
    if (selectedBiomarkers.length === 0) {
      toast.error("Please select at least one biomarker");
      return;
    }
    toast.success(`Panel "${panelName}" saved successfully`);
    setPanelName("");
    setSelectedBiomarkers([]);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="h-4 w-4 text-purple-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Biological Telemetry Builder</h2>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">
            Biomarker Collector
          </h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">
            Build personalized biomarker panels for targeted clinical monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
            <Download className="h-4 w-4 mr-3" /> Export Catalog
          </Button>
          <Button 
            onClick={handleSavePanel}
            className="h-14 px-8 bg-purple-600 text-white hover:bg-purple-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-2xl shadow-purple-600/20"
          >
            <Save className="h-4 w-4 mr-3" /> Save Custom Panel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Biomarker Catalog */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search biomarker catalog..." 
                  className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] pl-16 text-xs font-bold uppercase tracking-widest focus:ring-purple-500/50"
                />
              </div>
              <Button variant="outline" className="h-16 px-8 border-white/10 bg-white/5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest">
                <Filter className="h-4 w-4 mr-3" /> Categories
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBiomarkers.map((biomarker) => {
                const isSelected = selectedBiomarkers.find(b => b.id === biomarker.id);
                return (
                  <div 
                    key={biomarker.id} 
                    onClick={() => toggleBiomarker(biomarker)}
                    className={cn(
                      "p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden",
                      isSelected 
                        ? "bg-purple-600/10 border-purple-500/50" 
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "p-4 rounded-2xl bg-opacity-10 border border-opacity-20",
                        isSelected ? "bg-purple-500 border-purple-500 text-purple-400" : "bg-white border-white text-zinc-400"
                      )}>
                        <Microscope className="h-6 w-6" />
                      </div>
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2">{biomarker.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">{biomarker.category} • {biomarker.unit}</p>
                    <p className="text-[10px] text-zinc-600 leading-relaxed font-medium line-clamp-2">
                      {biomarker.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Panel Configuration */}
        <div className="space-y-8">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl sticky top-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-2xl shadow-purple-600/40">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic serif tracking-tighter">Panel Config</h3>
                <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Build your protocol</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Panel Name</label>
                <Input 
                  value={panelName}
                  onChange={(e) => setPanelName(e.target.value)}
                  placeholder="e.g., Metabolic Health V1" 
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-purple-500/50"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Selected Components</h4>
                  <span className="text-[10px] font-black text-purple-500 font-mono">{selectedBiomarkers.length}</span>
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                  <AnimatePresence mode="popLayout">
                    {selectedBiomarkers.map((b) => (
                      <motion.div 
                        key={b.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{b.name}</p>
                          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{b.category}</p>
                        </div>
                        <button 
                          onClick={() => toggleBiomarker(b)}
                          className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {selectedBiomarkers.length === 0 && (
                    <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">No biomarkers selected</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Cost</span>
                  <span className="text-xl font-black text-white font-mono">${selectedBiomarkers.length * 45}</span>
                </div>
                <Button 
                  onClick={handleSavePanel}
                  className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
                >
                  Finalize Panel Protocol
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
