import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield, CreditCard, Upload, Camera, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InsuranceCard {
  id: string;
  provider: string;
  policyNumber: string;
  groupNumber: string;
  type: string;
  frontImage?: string;
  backImage?: string;
  status: "active" | "expired" | "pending";
}

export default function HealthInsurance() {
  const [insurances, setInsurances] = useState<InsuranceCard[]>([
    {
      id: "1",
      provider: "Blue Cross Blue Shield",
      policyNumber: "XYZ123456789",
      groupNumber: "98765",
      type: "PPO",
      status: "active"
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newInsurance, setNewInsurance] = useState<Partial<InsuranceCard>>({
    provider: "",
    policyNumber: "",
    groupNumber: "",
    type: "PPO",
    status: "active"
  });

  const handleAddInsurance = () => {
    if (!newInsurance.provider || !newInsurance.policyNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const insurance: InsuranceCard = {
      id: Math.random().toString(36).substr(2, 9),
      provider: newInsurance.provider!,
      policyNumber: newInsurance.policyNumber!,
      groupNumber: newInsurance.groupNumber || "N/A",
      type: newInsurance.type || "PPO",
      status: "active"
    };

    setInsurances([...insurances, insurance]);
    setIsAddOpen(false);
    setNewInsurance({ provider: "", policyNumber: "", groupNumber: "", type: "PPO", status: "active" });
    toast.success("Insurance card added successfully");
  };

  const handleDelete = (id: string) => {
    setInsurances(insurances.filter(i => i.id !== id));
    toast.success("Insurance card removed");
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white serif">Health Insurance</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Manage your coverage and digital insurance cards</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Insurance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {insurances.map((insurance) => (
            <motion.div
              key={insurance.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <Card className="bg-[#0a0a0a] border-zinc-800 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all">
                <div className="p-8 border-b border-zinc-800 bg-gradient-to-br from-blue-600/10 to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      insurance.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                      {insurance.status}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white serif">{insurance.provider}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{insurance.type} Plan</p>
                </div>
                
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Policy Number</p>
                      <p className="text-sm font-mono text-white">{insurance.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Group Number</p>
                      <p className="text-sm font-mono text-white">{insurance.groupNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/btn">
                      <Camera className="h-5 w-5 text-zinc-500 group-hover/btn:text-white transition-colors" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 group-hover/btn:text-white">Front View</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/btn">
                      <Camera className="h-5 w-5 text-zinc-500 group-hover/btn:text-white transition-colors" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 group-hover/btn:text-white">Back View</span>
                    </button>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(insurance.id)}
                      className="h-10 w-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {insurances.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-[3rem]">
            <Shield className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No insurance cards found</p>
            <Button 
              variant="link" 
              onClick={() => setIsAddOpen(true)}
              className="text-blue-400 font-black uppercase tracking-widest text-[10px] mt-2"
            >
              Add your first card
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic serif mb-2">Add Insurance Card</DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Enter your provider details and upload your card images.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Provider Name</Label>
              <Input 
                value={newInsurance.provider}
                onChange={(e) => setNewInsurance({...newInsurance, provider: e.target.value})}
                placeholder="e.g. Aetna, UnitedHealthcare..." 
                className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Policy Number</Label>
                <Input 
                  value={newInsurance.policyNumber}
                  onChange={(e) => setNewInsurance({...newInsurance, policyNumber: e.target.value})}
                  placeholder="ID Number" 
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Group Number</Label>
                <Input 
                  value={newInsurance.groupNumber}
                  onChange={(e) => setNewInsurance({...newInsurance, groupNumber: e.target.value})}
                  placeholder="Group ID" 
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Plan Type</Label>
              <select 
                value={newInsurance.type}
                onChange={(e) => setNewInsurance({...newInsurance, type: e.target.value})}
                className="w-full bg-white/5 border border-white/10 h-12 rounded-xl text-white px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-blue-500/50"
              >
                <option value="PPO">PPO</option>
                <option value="HMO">HMO</option>
                <option value="EPO">EPO</option>
                <option value="POS">POS</option>
                <option value="HDHP">HDHP</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Front of Card</Label>
                <div className="h-32 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer">
                  <Upload className="h-5 w-5 text-zinc-600" />
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Upload Image</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Back of Card</Label>
                <div className="h-32 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer">
                  <Upload className="h-5 w-5 text-zinc-600" />
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Upload Image</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button 
              onClick={handleAddInsurance}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Save Insurance Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
