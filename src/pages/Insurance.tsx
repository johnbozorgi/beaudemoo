import React, { useState } from "react";
import { 
  ShieldCheck, Plus, Upload, Trash2, Edit2, 
  CreditCard, Calendar, User, Phone, Hash,
  ChevronRight, Camera, FileText, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { Insurance as InsuranceType } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Insurance() {
  const [insurances, setInsurances] = useState<InsuranceType[]>([
    {
      id: "1",
      type: "Health",
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-9928374",
      groupNumber: "GRP-1029",
      holderName: "David Houshang",
      memberId: "ID-88273",
      expirationDate: "2026-12-31",
      phoneNumber: "1-800-444-5555"
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newInsurance, setNewInsurance] = useState<Partial<InsuranceType>>({
    type: "Health",
    provider: "",
    policyNumber: "",
    groupNumber: "",
    holderName: "David Houshang",
    memberId: "",
    expirationDate: "",
    phoneNumber: ""
  });

  const [cardFront, setCardFront] = useState<string | null>(null);
  const [cardBack, setCardBack] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') setCardFront(reader.result as string);
        else setCardBack(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddInsurance = () => {
    if (!newInsurance.provider || !newInsurance.policyNumber) {
      toast.error("Please fill in provider and policy number");
      return;
    }

    const insurance: InsuranceType = {
      id: Math.random().toString(36).substr(2, 9),
      type: newInsurance.type as any,
      provider: newInsurance.provider as string,
      policyNumber: newInsurance.policyNumber as string,
      groupNumber: newInsurance.groupNumber,
      holderName: newInsurance.holderName as string,
      memberId: newInsurance.memberId as string,
      expirationDate: newInsurance.expirationDate,
      phoneNumber: newInsurance.phoneNumber,
      cardFront: cardFront || undefined,
      cardBack: cardBack || undefined
    };

    setInsurances([...insurances, insurance]);
    setIsAddOpen(false);
    setNewInsurance({
      type: "Health",
      provider: "",
      policyNumber: "",
      groupNumber: "",
      holderName: "David Houshang",
      memberId: "",
      expirationDate: "",
      phoneNumber: ""
    });
    setCardFront(null);
    setCardBack(null);
    toast.success("Insurance added successfully");
  };

  const handleDelete = (id: string) => {
    setInsurances(insurances.filter(i => i.id !== id));
    toast.success("Insurance removed");
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic serif mb-2">Insurance Vault</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Secure storage for your medical coverage documentation</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/20"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Insurance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {insurances.map((insurance) => (
          <Card key={insurance.id} className="bg-black/40 border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck className="h-7 w-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">{insurance.provider}</h3>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-400">
                      {insurance.type} Insurance
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-white hover:bg-white/10 rounded-xl">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(insurance.id)} variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Policy Number</p>
                  <p className="text-sm font-bold text-white font-mono">{insurance.policyNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Group Number</p>
                  <p className="text-sm font-bold text-white font-mono">{insurance.groupNumber || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Member ID</p>
                  <p className="text-sm font-bold text-white font-mono">{insurance.memberId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Expiration</p>
                  <p className="text-sm font-bold text-white">{insurance.expirationDate || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[1.6/1] rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group/card">
                  {insurance.cardFront ? (
                    <img src={insurance.cardFront} alt="Front" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-600">
                      <CreditCard className="h-8 w-8" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Front of Card</span>
                    </div>
                  )}
                </div>
                <div className="aspect-[1.6/1] rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group/card">
                  {insurance.cardBack ? (
                    <img src={insurance.cardBack} alt="Back" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-600">
                      <CreditCard className="h-8 w-8" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Back of Card</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-8 max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic serif mb-2">Add Insurance Coverage</DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Securely digitize your insurance credentials for instant access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 mt-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Insurance Type</Label>
                <select 
                  value={newInsurance.type}
                  onChange={(e) => setNewInsurance({...newInsurance, type: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 h-12 rounded-xl text-white px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-emerald-500/50"
                >
                  <option value="Health">Health</option>
                  <option value="Vision">Vision</option>
                  <option value="Dental">Dental</option>
                  <option value="Life">Life</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Provider Name</Label>
                <Input 
                  value={newInsurance.provider}
                  onChange={(e) => setNewInsurance({...newInsurance, provider: e.target.value})}
                  placeholder="e.g. Aetna, UnitedHealthcare..." 
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Policy Number</Label>
                <Input 
                  value={newInsurance.policyNumber}
                  onChange={(e) => setNewInsurance({...newInsurance, policyNumber: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-mono" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Group Number</Label>
                <Input 
                  value={newInsurance.groupNumber}
                  onChange={(e) => setNewInsurance({...newInsurance, groupNumber: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-mono" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Member ID</Label>
                <Input 
                  value={newInsurance.memberId}
                  onChange={(e) => setNewInsurance({...newInsurance, memberId: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-mono" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Expiration Date</Label>
                <Input 
                  type="date"
                  value={newInsurance.expirationDate}
                  onChange={(e) => setNewInsurance({...newInsurance, expirationDate: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Card Documentation</Label>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-center">Front of Card</p>
                  <div className="aspect-[1.6/1] rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                    {cardFront ? (
                      <>
                        <img src={cardFront} alt="Front" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button onClick={() => setCardFront(null)} className="absolute top-2 right-2 p-2 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-zinc-700" />
                        <Label htmlFor="front-upload" className="cursor-pointer">
                          <span className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Upload Photo</span>
                          <Input id="front-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'front')} accept="image/*" />
                        </Label>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-center">Back of Card</p>
                  <div className="aspect-[1.6/1] rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                    {cardBack ? (
                      <>
                        <img src={cardBack} alt="Back" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button onClick={() => setCardBack(null)} className="absolute top-2 right-2 p-2 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-zinc-700" />
                        <Label htmlFor="back-upload" className="cursor-pointer">
                          <span className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Upload Photo</span>
                          <Input id="back-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'back')} accept="image/*" />
                        </Label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-10">
            <Button 
              onClick={handleAddInsurance}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Save Insurance Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
