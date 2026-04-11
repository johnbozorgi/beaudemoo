import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, ShieldAlert, Activity, Info, UserPlus, Share2, 
  Trash2, History, Navigation, Globe, ArrowRight,
  CheckCircle2, AlertTriangle, Clock, Map, Plus
} from "lucide-react";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { WorldSphere } from "@/components/WorldSphere";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrustedPerson {
  id: string;
  name: string;
  role: string;
  initials: string;
  isLive: boolean;
}

interface HistoryItem {
  id: string;
  location: string;
  time: string;
  duration: string;
  impact: "Positive" | "Neutral" | "Negative";
  details: string;
}

export default function Location() {
  const [isLiveSharing, setIsLiveSharing] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", role: "Family" });
  const [trustedPeople, setTrustedPeople] = useState<TrustedPerson[]>([
    { id: "1", name: "Sarah Houshang", role: "Spouse • Emergency Contact", initials: "SH", isLive: true },
    { id: "2", name: "Dr. Michael Chen", role: "Primary Care Physician", initials: "MC", isLive: false },
  ]);

  const [history] = useState<HistoryItem[]>([
    { 
      id: "h1", 
      location: "Golden Gate Park", 
      time: "Today, 10:30 AM", 
      duration: "45 mins", 
      impact: "Positive",
      details: "High oxygen density, low noise pollution. HRV improved by 12%."
    },
    { 
      id: "h2", 
      location: "SOMA District", 
      time: "Yesterday, 2:15 PM", 
      duration: "2 hours", 
      impact: "Negative",
      details: "High PM2.5 levels detected. Respiratory rate increased by 4 bpm."
    },
    { 
      id: "h3", 
      location: "Presidio Heights", 
      time: "Apr 2, 6:00 PM", 
      duration: "1.5 hours", 
      impact: "Neutral",
      details: "Standard urban baseline. No significant biological deviation."
    },
    { 
      id: "h4", 
      location: "Muir Woods", 
      time: "Mar 31, 11:00 AM", 
      duration: "3 hours", 
      impact: "Positive",
      details: "High phytoncide exposure. Cortisol levels dropped by 22% post-visit."
    }
  ]);

  const removePerson = (id: string) => {
    setTrustedPeople(prev => prev.filter(p => p.id !== id));
    toast.success("Sharing access revoked");
  };

  const addPerson = () => {
    if (!newContact.name) {
      toast.error("Please enter a name");
      return;
    }
    const initials = newContact.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const person: TrustedPerson = {
      id: Math.random().toString(36).substr(2, 9),
      name: newContact.name,
      role: newContact.role,
      initials,
      isLive: false
    };
    setTrustedPeople(prev => [...prev, person]);
    setIsAddDialogOpen(false);
    setNewContact({ name: "", role: "Family" });
    toast.success(`${newContact.name} added to trusted contacts`);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Geo-Biological Sync</h2>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">Location & Environment</h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">Real-time environmental impact on your cellular biology</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Export History
          </Button>
          <Button className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">
            Emergency Broadcast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Globe & History */}
        <div className="lg:col-span-8 space-y-10">
          {/* 3D Globe Visualization */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Live Planetary Positioning</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                <Navigation className="h-3 w-3" /> San Francisco, CA
              </div>
            </div>
            <WorldSphere />
          </section>

          {/* Environmental Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Air Quality", value: "68", status: "Moderate", color: "text-amber-400", bg: "bg-amber-400/10" },
              { label: "UV Index", value: "3", status: "Low", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { label: "Pollen", value: "High", status: "Tree", color: "text-red-400", bg: "bg-red-400/10" },
              { label: "Humidity", value: "65%", status: "Optimal", color: "text-blue-400", bg: "bg-blue-400/10" },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-all"
              >
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">{stat.label}</span>
                <span className={cn("text-3xl font-black tracking-tighter mb-1", stat.color)}>{stat.value}</span>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", stat.color)}>{stat.status}</span>
              </motion.div>
            ))}
          </div>

          {/* Location History */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Bio-Location History</h3>
              <Button variant="ghost" className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-transparent">
                View Full Map <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {history.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="group bg-black/40 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all",
                      item.impact === "Positive" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      item.impact === "Negative" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                      "bg-zinc-500/10 border-zinc-500/20 text-zinc-500"
                    )}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic serif">{item.location}</h4>
                        <span className={cn(
                          "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                          item.impact === "Positive" ? "bg-emerald-500/20 text-emerald-500" :
                          item.impact === "Negative" ? "bg-red-500/20 text-red-500" :
                          "bg-zinc-500/20 text-zinc-500"
                        )}>
                          {item.impact} Impact
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {item.time}</span>
                        <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" /> {item.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:max-w-[250px] text-right">
                    <p className="text-[10px] font-medium text-zinc-400 leading-relaxed italic">"{item.details}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Settings & Sharing */}
        <div className="lg:col-span-4 space-y-10">
          {/* Sharing Management */}
          <Card className="bg-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter italic serif">Live Sharing</CardTitle>
                <div 
                  onClick={() => setIsLiveSharing(!isLiveSharing)}
                  className={cn(
                    "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-500 p-1",
                    isLiveSharing ? "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-zinc-800"
                  )}
                >
                  <motion.div 
                    animate={{ x: isLiveSharing ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </div>
              </div>
              <CardDescription className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manage trusted bio-access</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              {/* Trusted People List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Authorized Contacts</h4>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger render={
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-xl bg-white/5 text-blue-400 hover:bg-white/10"
                      />
                    }>
                      <UserPlus className="h-4 w-4" />
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-[2rem]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter serif">Add Trusted Contact</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                          Grant bio-location access to a new person
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</Label>
                          <Input 
                            id="name" 
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            placeholder="e.g. John Doe" 
                            className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Relationship Role</Label>
                          <Select 
                            value={newContact.role} 
                            onValueChange={(value) => setNewContact({ ...newContact, role: value })}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-sm">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-white/10 text-white">
                              <SelectItem value="Family">Family</SelectItem>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Emergency Contact">Emergency Contact</SelectItem>
                              <SelectItem value="Physician">Physician</SelectItem>
                              <SelectItem value="Friend">Friend</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={addPerson}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20"
                        >
                          Authorize Access
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {trustedPeople.map((person) => (
                      <motion.div 
                        key={person.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all"
                      >
                        <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-black text-xs">
                          {person.initials}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-white uppercase tracking-tight">{person.name}</p>
                          <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">{person.role}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {isLiveSharing && person.isLive && (
                            <div className="flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">Live</span>
                            </div>
                          )}
                          <Button 
                            onClick={() => removePerson(person.id)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                {[
                  { label: "Background Sync", desc: "Real-time bio-alerts", active: true },
                  { label: "Research Node", desc: "Anonymized data contribution", active: true },
                  { label: "Proximity Alerts", desc: "Notify if within 500m", active: false },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tight">{setting.label}</p>
                      <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">{setting.desc}</p>
                    </div>
                    <div className={cn(
                      "w-10 h-5 rounded-full relative p-1",
                      setting.active ? "bg-blue-600/50" : "bg-zinc-800"
                    )}>
                      <div className={cn(
                        "w-3 h-3 rounded-full shadow-sm",
                        setting.active ? "bg-blue-400 ml-auto" : "bg-zinc-600"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact Assessment */}
          <Card className="bg-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem] overflow-hidden">
            <CardContent className="p-8">
              <ExplainabilityPanel 
                title="Biological Impact Matrix"
                sources={["Planetary EPA Sensors", "Genetic Respiratory Markers", "HRV Baseline"]}
                method="Cross-referencing real-time geo-data with your specific biological vulnerabilities."
                recency="Updated 2 mins ago"
                confidence="High"
                interpretation="Atmospheric tree pollen levels are currently at peak saturation. Your genetic predisposition to allergic rhinitis suggests a 78% probability of mucosal inflammation within 4 hours of exposure."
                action="Deploy nasal filtration. Consider high-intensity cardio indoors. Antihistamine levels in bloodstream are currently optimal."
              />
            </CardContent>
          </Card>

          {/* Local Health Alerts */}
          <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-[3rem] space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="h-5 w-5" />
              <h4 className="text-xs font-black uppercase tracking-widest">Regional Bio-Hazard</h4>
            </div>
            <p className="text-[10px] font-medium text-amber-400/80 leading-relaxed italic">
              "Local health departments report a 15% increase in influenza-like illness in your area. Your digital twin indicates a gap in seasonal vaccination coverage."
            </p>
            <Button className="w-full h-10 bg-amber-500 text-black hover:bg-amber-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
              Locate Vaccine Clinic
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

