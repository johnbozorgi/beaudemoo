import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaceIdModal } from "@/components/FaceIdModal";
import { ScanFace, ShieldCheck, CheckCircle2, LogOut, User, Camera, Upload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashboardContext";
import { toast } from "sonner";

export default function Settings() {
  const { agentName, setAgentName, agentVoice, setAgentVoice, agentAvatar, setAgentAvatar } = useDashboard();
  const [activeTab, setActiveTab] = useState("profile");
  const [showFaceIdModal, setShowFaceIdModal] = useState(false);
  const [faceIdRegistered, setFaceIdRegistered] = useState(localStorage.getItem("face_id_registered") === "true");

  const handleFaceIdSuccess = () => {
    setFaceIdRegistered(true);
    localStorage.setItem("face_id_registered", "true");
    setShowFaceIdModal(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAgentAvatar(base64);
      toast.success("AI Agent avatar updated");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleVoiceSettingChange = () => {
      // Re-render to reflect localStorage change
      setActiveTab(prev => prev); 
    };
    window.addEventListener("voice_setting_changed", handleVoiceSettingChange);
    return () => window.removeEventListener("voice_setting_changed", handleVoiceSettingChange);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <FaceIdModal 
        isOpen={showFaceIdModal} 
        onClose={() => setShowFaceIdModal(false)} 
        onSuccess={handleFaceIdSuccess} 
      />
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <Tabs className="w-full">
        <TabsList className="mb-6 bg-slate-900 border border-slate-800">
          <TabsTrigger 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")}
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            active={activeTab === "privacy"} 
            onClick={() => setActiveTab("privacy")}
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
          >
            Privacy
          </TabsTrigger>
          <TabsTrigger 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")}
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            active={activeTab === "ai-agent"} 
            onClick={() => setActiveTab("ai-agent")}
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
          >
            AI Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent active={activeTab === "profile"}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Human Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl font-medium">
                  JD
                </div>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">Change Picture</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="bg-slate-800 border-slate-700 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="bg-slate-800 border-slate-700 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input id="email" defaultValue="john.doe@example.com" className="bg-slate-800 border-slate-700 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-slate-800 border-slate-700 text-slate-200" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-slate-300">Address</Label>
                  <Input id="address" defaultValue="123 Health Way, San Francisco, CA, USA" className="bg-slate-800 border-slate-700 text-slate-200" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="font-medium mb-4 text-slate-200">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emName" className="text-slate-300">Name</Label>
                    <Input id="emName" defaultValue="Jane Doe" className="bg-slate-800 border-slate-700 text-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emPhone" className="text-slate-300">Phone</Label>
                    <Input id="emPhone" defaultValue="+1 (555) 987-6543" className="bg-slate-800 border-slate-700 text-slate-200" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent active={activeTab === "privacy"}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Biometric Security</CardTitle>
              <CardDescription>Secure your biological data with neural face mapping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <ScanFace className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200 uppercase tracking-widest">Neural Face ID</p>
                    <p className="text-xs text-slate-500">
                      {faceIdRegistered 
                        ? "Biometric signature registered and active" 
                        : "Register your face for secure biometric access"}
                    </p>
                  </div>
                </div>
                {faceIdRegistered ? (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowFaceIdModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest h-10 px-6 rounded-xl"
                  >
                    Register Face
                  </Button>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h4 className="font-medium mb-4 text-slate-200">Data Privacy Protocols</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">End-to-End Encryption</p>
                      <p className="text-xs text-slate-500">All biological data is encrypted locally</p>
                    </div>
                    <div className="h-6 w-10 bg-blue-600 rounded-full relative">
                      <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Anonymized Research Sharing</p>
                      <p className="text-xs text-slate-500">Share data with research institutions without PII</p>
                    </div>
                    <div className="h-6 w-10 bg-slate-700 rounded-full relative">
                      <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent active={activeTab === "notifications"}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Alert Protocols</CardTitle>
              <CardDescription>Manage how you receive biological telemetry alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Critical Biomarker Alerts</p>
                    <p className="text-xs text-slate-500">Immediate alerts for dangerous biomarker shifts</p>
                  </div>
                  <div className="h-6 w-10 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Research Participation</p>
                    <p className="text-xs text-slate-500">Notifications for new research studies matching your DNA</p>
                  </div>
                  <div className="h-6 w-10 bg-slate-700 rounded-full relative">
                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Daily Health Summary</p>
                    <p className="text-xs text-slate-500">A morning briefing from your AI agent</p>
                  </div>
                  <div className="h-6 w-10 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent active={activeTab === "ai-agent"}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Health AI Agent Settings</CardTitle>
              <CardDescription>Customize your biological intelligence companion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Agent Avatar Section */}
              <div className="space-y-4">
                <Label className="text-slate-300">Agent Avatar</Label>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center overflow-hidden shadow-2xl shadow-blue-600/10">
                      {agentAvatar ? (
                        <img src={agentAvatar} alt="Agent Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Sparkles className="h-10 w-10 text-blue-400" />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                      <Camera className="h-6 w-6 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Visual Identity</h4>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      Upload a custom image or avatar to represent your biological intelligence companion.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-[9px] font-black uppercase tracking-widest border-slate-700 text-slate-300 hover:bg-slate-800"
                        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                      >
                        <Upload className="h-3 w-3 mr-2" /> Upload
                      </Button>
                      {agentAvatar && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400"
                          onClick={() => setAgentAvatar(null)}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-slate-800">
                <Label htmlFor="agentName" className="text-slate-300">Agent Name</Label>
                <Input 
                  id="agentName" 
                  placeholder="Health AI Agent" 
                  value={agentName} 
                  onChange={(e) => setAgentName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-200 h-12 rounded-xl" 
                />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">This name will be used throughout the neural interface.</p>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h4 className="font-medium mb-4 text-slate-200">Voice Interaction</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setAgentVoice("Female")}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1",
                      agentVoice === "Female" ? "bg-blue-600/10 border-blue-500/50" : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                    )}
                  >
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Female (Kore)</span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">Empathetic & Clear</span>
                  </div>
                  <div 
                    onClick={() => setAgentVoice("Male")}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1",
                      agentVoice === "Male" ? "bg-blue-600/10 border-blue-500/50" : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                    )}
                  >
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Male (Zephyr)</span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">Professional & Authoritative</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
