import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Stethoscope, 
  Building2, 
  CreditCard,
  CheckCircle2,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useDoctor } from "@/context/DoctorContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function DoctorAuth() {
  const navigate = useNavigate();
  const { login, signup, isLoggedIn } = useDoctor();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic, setClinic] = useState("");
  const [license, setLicense] = useState("");

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/provider-dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Welcome back, Doctor");
      } else {
        await signup({
          name,
          specialty,
          clinic,
          license,
          email,
          phone: "",
          isVerified: true
        });
        toast.success("Provider account created successfully");
      }
      navigate("/provider-dashboard");
    } catch (error) {
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:block space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600/10 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20 border border-blue-500/20">
              <Logo className="h-7 w-7" color="#60A5FA" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic serif">BeauGene</h1>
          </div>

          <div className="space-y-8">
            <h2 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase italic serif">
              The Future of <br />
              <span className="text-blue-500">Clinical Intelligence</span>
            </h2>
            <p className="text-zinc-500 text-lg font-medium uppercase tracking-widest max-w-md leading-relaxed">
              Secure, AI-powered biological telemetry for advanced healthcare providers.
            </p>
          </div>

          <div className="space-y-6">
            {[
              "Real-time Patient Telemetry",
              "AI-Powered Diagnostic Support",
              "Secure Data Access Requests",
              "Personalized Biomarker Panels"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all">
                  <CheckCircle2 className="h-3 w-3 text-blue-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <Card className="bg-black/40 backdrop-blur-3xl border-white/5 p-10 rounded-[3rem] shadow-2xl">
            <div className="mb-10">
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 w-fit mb-8">
                <button
                  onClick={() => setMode("login")}
                  className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    mode === "login" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    mode === "signup" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Create Account
                </button>
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic serif tracking-tighter">
                {mode === "login" ? "Welcome Back, Doctor" : "Join the Network"}
              </h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                {mode === "login" ? "Enter your credentials to access the terminal" : "Register your clinical practice today"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                          <Input 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Dr. John Doe" 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 text-xs focus:ring-blue-500/50" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Specialty</Label>
                        <div className="relative">
                          <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                          <Input 
                            required
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            placeholder="Cardiology" 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 text-xs focus:ring-blue-500/50" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Clinic/Hospital</Label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                          <Input 
                            required
                            value={clinic}
                            onChange={(e) => setClinic(e.target.value)}
                            placeholder="Mayo Clinic" 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 text-xs focus:ring-blue-500/50" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">License Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                          <Input 
                            required
                            value={license}
                            onChange={(e) => setLicense(e.target.value)}
                            placeholder="MD-12345-X" 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 text-xs focus:ring-blue-500/50" 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@beaugene.com" 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 text-xs focus:ring-blue-500/50" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 text-xs focus:ring-blue-500/50" 
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-blue-600/20 mt-4"
              >
                {isLoading ? (
                  <Activity className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Access Terminal" : "Create Provider Account"}
                    <ArrowRight className="h-4 w-4 ml-3" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                Protected by BeauGene Bio-Encryption & HIPAA Compliance Protocols
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
