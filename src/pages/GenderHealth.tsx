import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, Heart, Dna, FileText, AlertCircle, CheckCircle2, FlaskConical, Stethoscope, Plus, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDashboard } from "@/context/DashboardContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GenderHealth() {
  const { gender, setGender } = useDashboard();
  const [activeTab, setActiveTab] = useState<"Male" | "Female">(gender === "Female" ? "Female" : "Male");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<{ name: string; unit: string } | null>(null);
  const [logValue, setLogValue] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const handleTabChange = (value: "Male" | "Female") => {
    // Trigger State_Change by updating activeTab
    if (value !== gender) {
      toast.error(`This section is optimized for ${value} profiles. Would you like to update your profile settings?`, {
        duration: 5000,
        action: {
          label: "Update Profile",
          onClick: () => {
            setGender(value);
            setActiveTab(value);
            toast.success(`Profile updated to ${value}. Navigation successful.`);
          }
        }
      });
      return;
    }
    setActiveTab(value);
    toast.info(`Navigating to ${value}-Specific Tests dashboard.`);
  };

  const handleOpenLogModal = (testName: string, unit: string = "") => {
    setSelectedTest({ name: testName, unit });
    setIsLogModalOpen(true);
  };

  const handleSaveLog = () => {
    if (!logValue || !logDate) {
      toast.error("Please enter both a value and a date.");
      return;
    }
    toast.success(`Logged ${logValue}${selectedTest?.unit} for ${selectedTest?.name} on ${logDate}`);
    setIsLogModalOpen(false);
    setLogValue("");
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-[30vh] flex items-center justify-center overflow-hidden rounded-[3rem] mb-12">
        <div className="absolute inset-0 bg-zinc-900/50">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-blue-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">Specialized Care</span>
            <div className="h-px w-8 bg-blue-500/50" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-light tracking-tighter text-white italic serif mb-6"
          >
            Gender-Specific Health
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed"
          >
            Targeted tracking and insights for your unique biological profile.
          </motion.p>
        </div>
      </div>

      <Tabs className="w-full max-w-5xl mx-auto">
        <div className="flex justify-center mb-12">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl">
            <TabsTrigger 
              active={activeTab === "Male"}
              onClick={() => handleTabChange("Male")}
              className={cn(
                "rounded-xl px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === "Male" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              Men's Health
            </TabsTrigger>
            <TabsTrigger 
              active={activeTab === "Female"}
              onClick={() => handleTabChange("Female")}
              className={cn(
                "rounded-xl px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === "Female" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              Women's Health
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent active={activeTab === "Male"} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthCard 
              title="Prostate Screening" 
              icon={<Shield className="h-5 w-5 text-blue-400" />}
              items={[
                { name: "PSA Blood Test", status: "Normal", date: "Oct 2025", unit: "ng/mL" },
                { name: "Digital Rectal Exam (DRE)", status: "Pending", date: "Due Soon", unit: "" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Testicular Health" 
              icon={<Activity className="h-5 w-5 text-emerald-400" />}
              items={[
                { name: "Self-Exam Log", status: "Completed", date: "Mar 2026", unit: "" },
                { name: "Clinical Findings", status: "Clear", date: "Jan 2026", unit: "" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Hormonal Profile" 
              icon={<FlaskConical className="h-5 w-5 text-amber-400" />}
              items={[
                { name: "Total Testosterone", status: "650 ng/dL", date: "Feb 2026", unit: " ng/dL" },
                { name: "Free Testosterone", status: "12 pg/mL", date: "Feb 2026", unit: " pg/mL" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Fertility & Sexual Health" 
              icon={<Heart className="h-5 w-5 text-red-400" />}
              items={[
                { name: "Semen Analysis", status: "Optimal", date: "Dec 2025", unit: "" },
                { name: "ED Evaluation", status: "N/A", date: "-", unit: "" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Urology" 
              icon={<Stethoscope className="h-5 w-5 text-purple-400" />}
              items={[
                { name: "BPH Symptom Score", status: "Mild (4)", date: "Nov 2025", unit: " points" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Genetics" 
              icon={<Dna className="h-5 w-5 text-indigo-400" />}
              items={[
                { name: "Prostate Cancer Risk Genes", status: "Low Risk", date: "2024", unit: "" },
                { name: "Y-Chromosome Analysis", status: "Completed", date: "2024", unit: "" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "Female"} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthCard 
              title="PMS & Cycle Tracking" 
              icon={<Calendar className="h-5 w-5 text-purple-400" />}
              items={[
                { name: "Cycle Day", status: "Day 14", date: "Today", unit: "" },
                { name: "Period Start Date", status: "Mar 18", date: "Last Log", unit: "" },
                { name: "Symptom Severity", status: "Low (2/10)", date: "Today", unit: "/10" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Cervical Health" 
              icon={<Shield className="h-5 w-5 text-pink-400" />}
              items={[
                { name: "Pap Smear", status: "Normal", date: "Sep 2025", unit: "" },
                { name: "HPV Test", status: "Negative", date: "Sep 2025", unit: "" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Breast Health" 
              icon={<Activity className="h-5 w-5 text-emerald-400" />}
              items={[
                { name: "Mammogram", status: "Clear", date: "Aug 2025", unit: "" },
                { name: "Breast Exam Log", status: "Completed", date: "Mar 2026", unit: "" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Gynecology" 
              icon={<Stethoscope className="h-5 w-5 text-purple-400" />}
              items={[
                { name: "Pelvic Exam", status: "Normal", date: "Sep 2025", unit: "" },
                { name: "Ovarian Screening (CA-125)", status: "Pending", date: "Due Soon", unit: " U/mL" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Hormonal Panel" 
              icon={<FlaskConical className="h-5 w-5 text-amber-400" />}
              items={[
                { name: "Estrogen / Progesterone", status: "Balanced", date: "Feb 2026", unit: "" },
                { name: "FSH / LH Levels", status: "Normal", date: "Feb 2026", unit: " mIU/mL" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Reproductive Health" 
              icon={<Heart className="h-5 w-5 text-red-400" />}
              items={[
                { name: "Fertility (AMH)", status: "Optimal", date: "Jan 2026", unit: " ng/mL" },
                { name: "Pregnancy (hCG)", status: "N/A", date: "-", unit: " mIU/mL" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
            <HealthCard 
              title="Bone Health & Genetics" 
              icon={<Dna className="h-5 w-5 text-indigo-400" />}
              items={[
                { name: "Bone Density (DEXA)", status: "T-Score: -0.5", date: "Oct 2025", unit: "" },
                { name: "BRCA1/BRCA2 Screening", status: "Negative", date: "2024", unit: "" }
              ]}
              onLog={(name, unit) => handleOpenLogModal(name, unit)}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[2rem] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight italic serif">Log {selectedTest?.name}</DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs uppercase tracking-widest">
              Enter your latest test results to update your biological twin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Result Value {selectedTest?.unit && `(${selectedTest.unit.trim()})`}
              </Label>
              <div className="relative">
                <Input
                  id="value"
                  type="number"
                  placeholder="0.00"
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12 text-white placeholder:text-zinc-700 focus:border-blue-500/50 transition-colors"
                />
                {selectedTest?.unit && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    {selectedTest.unit.trim()}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Test Date
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12 text-white focus:border-blue-500/50 transition-colors pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsLogModalOpen(false)}
              className="rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveLog}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest px-8"
            >
              Save Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HealthCard({ title, icon, items, onLog }: { title: string, icon: React.ReactNode, items: any[], onLog: (name: string, unit: string) => void }) {
  return (
    <Card className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] overflow-hidden hover:border-zinc-700 transition-colors">
      <CardHeader className="p-6 border-b border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-[11px] font-bold text-white uppercase tracking-widest">
            {icon}
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onLog(item.name, item.unit)}
                className="text-left group cursor-pointer"
                title={`Click to log ${item.name}`}
              >
                <p className="text-xs font-bold text-white uppercase tracking-widest group-hover:text-blue-400 transition-colors">{item.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.date}</p>
              </button>
              <div className="flex items-center gap-2">
                {item.status === "Pending" || item.status.includes("Due") ? (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  item.status === "Pending" || item.status.includes("Due") ? "text-amber-400" : "text-emerald-400"
                )}>
                  {item.status}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => onLog(item.name, item.unit)}
              variant="outline"
              className="w-full h-8 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              Add Data
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
