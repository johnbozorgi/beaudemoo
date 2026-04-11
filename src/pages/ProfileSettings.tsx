import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, MapPin, Lock, Save, Camera } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "David Houshang",
    email: "houshangidavid@gmail.com",
    address: "123 Bio Lane, San Francisco, CA",
    password: "••••••••",
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-10 pb-12 max-w-4xl mx-auto">
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Account Management</h2>
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">Profile Settings</h1>
        <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">Manage your personal information and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
          <Card className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-blue-600/20">
                  DH
                </div>
                <button className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </button>
              </div>
              <h3 className="mt-6 text-xl font-black text-white uppercase tracking-tighter italic serif">{profile.name}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Premium Bio-Mirror</p>
              
              <div className="w-full mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Member Since</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">Oct 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black uppercase tracking-tighter text-white italic serif">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="bg-white/5 border-white/10 h-12 rounded-xl pl-12 text-xs" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input 
                      value={profile.email} 
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="bg-white/5 border-white/10 h-12 rounded-xl pl-12 text-xs" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Physical Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input 
                      value={profile.address} 
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      className="bg-white/5 border-white/10 h-12 rounded-xl pl-12 text-xs" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black uppercase tracking-tighter text-white italic serif">Security</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input 
                    type="password"
                    value={profile.password} 
                    onChange={(e) => setProfile({...profile, password: e.target.value})}
                    className="bg-white/5 border-white/10 h-12 rounded-xl pl-12 text-xs" 
                  />
                </div>
              </div>
              <Button variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 rounded-xl h-10">
                Change Password
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
              <Save className="h-4 w-4 mr-2" /> Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
