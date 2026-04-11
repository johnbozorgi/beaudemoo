import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, Dumbbell, Moon, ShieldAlert, Sparkles, MessageSquare, Bot, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function PersonalizedLife() {
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [aiInitialMessage, setAiInitialMessage] = useState("");
  const [showLowFidelityModal, setShowLowFidelityModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState("");
  const twinFidelity = 65;

  const handleAskAI = (category: string) => {
    setAiContext(`User is interested in generating a personalized ${category} plan. Current Digital Twin fidelity is ${twinFidelity}%.`);
    setAiInitialMessage(`I see you're looking into a personalized ${category} plan. Currently, your Digital Twin fidelity is at ${twinFidelity}%.`);
    setIsAIPopupOpen(true);
  };

  const handleGeneratePlan = (category: string) => {
    if (twinFidelity < 75) {
      setPendingCategory(category);
      setShowLowFidelityModal(true);
    } else {
      toast.success(`Generating your personalized ${category} plan...`);
    }
  };

  const confirmGeneratePlan = () => {
    toast.success(`Generating your personalized ${pendingCategory} plan (low precision mode)...`);
    setShowLowFidelityModal(false);
  };

  const GeneratePlanBox = ({ category }: { category: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-white/[0.03] border border-white/10 rounded-2xl relative group overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.15em]">
              {category} Optimization
            </h4>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
              AI Precision Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => handleGeneratePlan(category)}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-5 h-9 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 flex-1 sm:flex-none"
          >
            Generate Plan
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAskAI(category)}
            className="h-9 w-9 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {twinFidelity < 75 && (
        <div className="mt-3 flex items-center gap-2 text-[8px] font-black text-orange-400 uppercase tracking-[0.2em] opacity-80">
          <div className="h-1 w-1 rounded-full bg-orange-500 animate-pulse" />
          FIDELITY: {twinFidelity}% — LOW PRECISION MODE
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-20 bg-black">
      {/* Hero Section */}
      <div className="relative h-[45vh] flex items-center justify-center overflow-hidden rounded-[3rem] mb-12">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,#3a2a2a_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/lifestyle/1920/1080')] bg-cover bg-center mix-blend-overlay opacity-20" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-orange-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-400">Biological Optimization</span>
            <div className="h-px w-8 bg-orange-500/50" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-light tracking-tighter text-white italic serif mb-6"
          >
            Personalized Life Experience
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed"
          >
            Lifestyle guidance tailored to your unique biological blueprint, DNA, and real-time metabolic telemetry.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Nutrition */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden"
          >
            <div className="p-8 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center text-orange-400">
                  <Utensils className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-light italic serif text-white">Nutrition</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Metabolic & Genomic Alignment</p>
                </div>
              </div>
              <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest">Meal Plans</Button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-6">
                {[
                  { label: "High Protein Need", desc: "Your genetics suggest a higher protein requirement for muscle maintenance. Aim for 1.6g/kg." },
                  { label: "Carb Sensitivity", desc: "Moderate. Focus on complex carbs early in the day to optimize insulin response." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <ExplainabilityPanel 
                  title="Why this macro split?"
                  sources={["FTO Gene Variant", "Continuous Glucose Monitor (CGM) Data"]}
                  method="Correlation of genetic predisposition to weight gain with real-time glycemic response."
                  recency="Updated 2 days ago"
                  confidence="High"
                  interpretation="Your FTO variant is associated with a higher risk of obesity if protein intake is low. Your CGM data confirms moderate insulin spikes after simple carbohydrate consumption."
                  action="Prioritize protein at every meal and shift carbohydrate intake to pre- and post-workout windows."
                />
              </div>
            </div>
            <GeneratePlanBox category="Nutrition" />
          </motion.div>

          {/* Fitness */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden"
          >
            <div className="p-8 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400">
                  <Dumbbell className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-light italic serif text-white">Fitness & Recovery</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Muscle Fiber Composition</p>
                </div>
              </div>
              <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white rounded-full px-6 text-xs font-bold uppercase tracking-widest">Training Plan</Button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-6">
                {[
                  { label: "Endurance Bias", desc: "Your ACTN3 genotype favors endurance over explosive power. Focus on volume over intensity." },
                  { label: "Recovery Need", desc: "Slower recovery profile. Ensure 48h between heavy sessions to prevent systemic inflammation." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <ExplainabilityPanel 
                  title="Why this training style?"
                  sources={["ACTN3 Genotype (R/X)", "Oura Ring HRV Data"]}
                  method="Analysis of muscle fiber composition markers and autonomic nervous system recovery rates."
                  recency="Continuous monitoring"
                  confidence="Very High"
                  interpretation="You possess a mix of fast and slow-twitch muscle fibers, but your HRV data indicates a slower parasympathetic rebound after high-intensity interval training (HIIT)."
                  action="Focus on Zone 2 cardio and moderate-intensity strength training. Limit HIIT to once per week."
                />
              </div>
            </div>
            <GeneratePlanBox category="Fitness" />
          </motion.div>

          {/* Sleep + Preventive Care */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Sleep Optimization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-11 w-11 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                  <Moon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-light italic serif text-white">Sleep Optimization</h3>
              </div>

              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                Your chronotype is a <span className="text-white font-semibold">"Bear"</span>. 
                Your optimal sleep window is <span className="text-white font-semibold">10:30 PM to 6:30 AM</span>.
              </p>

              <div className="bg-zinc-900 rounded-2xl p-5 mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">CURRENT SCORE</span>
                  <span className="text-2xl font-black text-white font-mono">85%</span>
                </div>
                <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-full" />
                </div>
              </div>

              <GeneratePlanBox category="Sleep" />
            </motion.div>

            {/* Preventive Care */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-11 w-11 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-light italic serif text-white">Preventive Care</h3>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                {[
                  { label: "VITAMIN D SUPPLEMENTATION", status: "ACTIVE", color: "text-emerald-400" },
                  { label: "ANNUAL LIPID PANEL", status: "DUE IN 2 MOS", color: "text-amber-400" },
                  { label: "DEXA SCAN", status: "SCHEDULED", color: "text-blue-400" },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="flex justify-between items-center bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl"
                  >
                    <span className="text-sm font-medium text-zinc-200 tracking-wide">{item.label}</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>

              <GeneratePlanBox category="Preventive Care" />
            </motion.div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/5 p-16 text-center"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#3b82f620_0%,transparent_70%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Future Roadmap</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white italic serif mb-8">
              Personalized Products <br />
              <span className="text-zinc-500">Coming Soon</span>
            </h2>
            
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed mb-12">
              Once your digital twin reaches a sufficient level of fidelity, you will be able to order 
              custom-formulated health and beauty products, precisely calibrated for your unique biological data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { title: "Custom Supplements", desc: "DNA-based nutrient optimization" },
                { title: "Precision Skincare", desc: "Microbiome-aligned formulations" },
                { title: "Metabolic Optimization", desc: "Real-time glucose-aligned nutrition" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-md">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Improved Low Fidelity Modal - Dark Theme for better contrast */}
      {showLowFidelityModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-[2rem] max-w-md w-full overflow-hidden shadow-2xl"
          >
            <div className="p-10 text-center">
              <div className="mx-auto mb-6 w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">
                Low Fidelity Warning
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm font-medium">
                Your Digital Twin fidelity is currently at <span className="text-orange-500 font-bold">{twinFidelity}%</span>. 
                The generated plan will be based on generalized models rather than your specific biological nuances.
              </p>
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowLowFidelityModal(false)}
                className="flex-1 h-12 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmGeneratePlan}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-orange-600/20"
              >
                Generate Anyway
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Temporary AI Popup */}
      {isAIPopupOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full p-8 text-center">
            <Bot className="mx-auto h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
            <p className="text-zinc-400 mb-6">{aiInitialMessage}</p>
            <Button onClick={() => setIsAIPopupOpen(false)} className="rounded-2xl">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}