import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Infinity as InfinityIcon,
  Shield, 
  Zap, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  User, 
  Lock, 
  CheckCircle2, 
  Globe, 
  Database, 
  Fingerprint,
  Smartphone,
  Apple,
  Chrome,
  Menu,
  X,
  Play,
  Star,
  Quote,
  ArrowUpRight,
  Plus,
  Network,
  Stethoscope,
  Target,
  ActivitySquare,
  Eye,
  EyeOff,
  Linkedin,
  MessageCircle,
  ArrowUp,
  Bell,
  Activity
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useNavigate, Link } from "react-router-dom";
import { useDashboard } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const NavItem = ({ label, targetId }: { label: string; targetId: string }) => {
    return (
      <button 
        onClick={() => scrollToSection(targetId)}
        className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all duration-300 relative group"
      >
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
      </button>
    );
  };

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="group p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.03] hover:border-blue-500/20 transition-all duration-700 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative z-10">
      <div className="h-16 w-16 rounded-2xl bg-blue-600/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-blue-600/10 transition-all duration-700 border border-white/5">
        <Icon className="h-8 w-8 text-blue-500/80" />
      </div>
      <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic serif mb-6">{title}</h3>
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed group-hover:text-zinc-400 transition-colors">{description}</p>
    </div>
  </motion.div>
);

const PricingCard = ({ title, features, recommended = false, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className={cn(
      "relative p-12 rounded-[4rem] border transition-all duration-700 flex flex-col group overflow-hidden",
      recommended 
      ? "bg-blue-600 border-blue-400 shadow-[0_40px_80px_rgba(37,99,235,0.25)] scale-105 z-10" 
      : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
    )}
  >
    {recommended && (
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
    )}
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-white text-blue-600 text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
        Most Popular
      </div>
    )}
    <h3 className={cn("text-3xl font-black tracking-tighter uppercase italic serif mb-10 relative z-10", recommended ? "text-white" : "text-white")}>{title}</h3>
    <div className="space-y-6 mb-14 flex-1 relative z-10">
      {features.map((feature: string, i: number) => (
        <div key={i} className="flex items-center gap-4">
          <CheckCircle2 className={cn("h-5 w-5", recommended ? "text-white" : "text-blue-500")} />
          <span className={cn("text-[11px] font-bold uppercase tracking-[0.15em]", recommended ? "text-white/80" : "text-zinc-500")}>{feature}</span>
        </div>
      ))}
    </div>
    <Button 
      className={cn(
        "w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:scale-[1.02] relative z-10 shadow-2xl",
        recommended ? "bg-white text-blue-600 hover:bg-zinc-100" : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
      )}
      onClick={() => document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' })}
    >
      Get Started
    </Button>
  </motion.div>
);

export default function Onboarding() {
  const { agentName, agentAvatar } = useDashboard();
  const [isLogin, setIsLogin] = useState(false);
  const [accountType, setAccountType] = useState<"individual" | "provider">("individual");
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroWord, setHeroWord] = useState<"Self" | "Health">("Health");
  const [showPassword, setShowPassword] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [showProfileNotification, setShowProfileNotification] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const { setIsLoggedIn } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWord(prev => prev === "Self" ? "Health" : "Self");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    toast.success(isLogin ? "Welcome back to the future" : "Biological profile initialized");
    navigate("/dashboard");
  };

  const handleBiometric = () => {
    setIsBiometricOpen(true);
    setTimeout(() => {
      setIsBiometricOpen(false);
      setIsLoggedIn(true);
      toast.success("Biometric identity verified");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-8 md:px-16",
        isScrolled ? "h-20 bg-black/60 backdrop-blur-3xl border-b border-white/5" : "h-28 bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="h-11 w-11 rounded-xl bg-blue-600/10 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)] group-hover:scale-110 transition-all duration-700 border border-blue-500/20">
                <Logo className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase italic serif bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">BeauGene</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-12">
              <NavItem label="Platform" targetId="platform" />
              <NavItem label="How it Works" targetId="how-it-works" />
              <NavItem label="Solutions" targetId="solutions" />
              <NavItem label="Research" targetId="research" />
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => {
                setIsLogin(true);
                scrollToSection('auth-card');
              }}
              className="hidden sm:block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all duration-300"
            >
              Sign In
            </button>
            <Button 
              className="h-12 px-10 bg-white text-black hover:bg-zinc-100 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
              onClick={() => {
                setIsLogin(false);
                scrollToSection('auth-card');
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">Get Started</span>
            </Button>
            <button 
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-black p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black tracking-tighter uppercase italic serif">BeauGene</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-8 w-8 text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-8">
              {["Platform", "Solutions", "Research Participation", "About"].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection(item.toLowerCase().split(' ')[0]);
                  }}
                  className="text-4xl font-black uppercase tracking-tighter italic serif hover:text-blue-500 transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <Button 
                className="h-16 bg-white text-black text-lg font-black uppercase tracking-widest rounded-2xl"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-36 md:pt-40 pb-24 md:pb-28 px-6 md:px-16 overflow-hidden">

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0
                }}
                animate={{
                  y: [null, Math.random() * 100 + "%"],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute text-[10px] font-mono text-blue-500 whitespace-nowrap tracking-widest"
              >
                {Math.random().toString(16).substring(2, 15).toUpperCase()}
                {Math.random().toString(16).substring(2, 15).toUpperCase()}
              </motion.div>
            ))}
          </div>
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: "3s" }} />
          <div className="absolute inset-0 noise opacity-[0.03] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_58%_at_50%_8%,#000_72%,transparent_100%)]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            style={{ opacity, scale }}
            className="flex flex-col items-center text-center pt-4"
          >
            <div className="inline-flex items-center gap-4 mb-7 md:mb-8 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-xl">
              <div className="h-px w-8 bg-blue-500/60" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.45em] text-blue-400">
                Global Biological Intelligence
              </span>
              <div className="h-px w-8 bg-blue-500/60" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.25rem] font-black tracking-[-0.05em] text-white uppercase italic serif leading-[0.86] drop-shadow-2xl max-w-5xl">
              <span className="block">Invest in your</span>
              <span className="block">Future</span>
            </h1>

            <div className="mt-3 h-[56px] md:h-[72px] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={heroWord}
                  initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "inline-block text-center normal-case font-cursive text-4xl sm:text-5xl md:text-6xl tracking-normal drop-shadow-[0_0_28px_rgba(59,130,246,0.22)]",
                    heroWord === "Self" ? "text-blue-400" : "text-emerald-400"
                  )}
                >
                  {heroWord}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="mt-5 text-sm md:text-base text-zinc-400 font-bold uppercase tracking-[0.22em] leading-relaxed max-w-3xl">
              A premium biological intelligence platform that transforms genetics, telemetry, and behavior into one living digital twin.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              <Button
                className="h-14 px-8 md:px-10 bg-white text-black hover:bg-zinc-100 rounded-2xl font-black uppercase tracking-[0.28em] text-[10px] shadow-[0_18px_40px_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  setIsLogin(false);
                  scrollToSection('auth-card');
                }}
              >
                Get Started
              </Button>
              <button
                onClick={() => toast.info("Opening BeauGene Protocol Video...")}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 h-14 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400 hover:text-white hover:border-blue-500/40 transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 text-white fill-white" />
                </div>
                Watch Protocol
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 text-center sm:text-left">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-11 w-11 rounded-full border-2 border-black bg-zinc-900 overflow-hidden shadow-lg">
                    <img
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      alt="User"
                      className="h-full w-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase tracking-widest">50,000+ Profiles</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Active Biological Twins</span>
              </div>
              <div className="hidden md:block h-10 w-px bg-white/[0.06]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                <div className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">Predictive Intelligence</div>
                <div className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">Private by Design</div>
              </div>
            </div>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            id="auth-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-4xl mx-auto mt-12 md:mt-14"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 blur-3xl rounded-[2.5rem] opacity-60" />
            <Card className="relative glass-dark rounded-[2.5rem] px-5 py-6 md:px-8 md:py-8 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border-white/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white/25 to-purple-600" />

              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400">Identity Protocol V2.6</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic serif">
                      {isLogin ? "Secure Access" : "Initialize Identity"}
                    </h2>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">
                      {isLogin ? "Enter your biological credentials" : "Create your digital twin in minutes"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1.5 w-full lg:w-[300px]">
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className={cn(
                        "h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                        !isLogin ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
                      )}
                    >
                      Create Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className={cn(
                        "h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                        isLogin ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
                      )}
                    >
                      Sign In
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
                  <form onSubmit={handleAuth} className="space-y-5">
                    <div className="flex p-1.5 bg-white/[0.03] rounded-2xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => setAccountType("individual")}
                        className={cn(
                          "flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500",
                          accountType === "individual" ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                        )}
                      >
                        Individual
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType("provider")}
                        className={cn(
                          "flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500",
                          accountType === "provider" ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                        )}
                      >
                        Health Provider
                      </button>
                    </div>

                    {!isLogin && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-3 md:col-span-2">
                          <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">
                            {accountType === "provider" ? "Professional Name & Title" : "Full Legal Name"}
                          </Label>
                          <Input
                            placeholder={accountType === "provider" ? "DR. FIRST NAME LAST NAME, MD" : "FIRST NAME LAST NAME"}
                            className="h-14 md:h-16 bg-white/[0.02] border-white/10 rounded-2xl text-white placeholder:text-zinc-800 font-bold uppercase tracking-widest focus:border-blue-500/50 focus:bg-white/[0.05] transition-all duration-500"
                          />
                        </div>

                        {accountType === "provider" && (
                          <div className="space-y-3 md:col-span-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Specialization</Label>
                            <select className="w-full h-14 md:h-16 bg-white/[0.02] border border-white/10 rounded-2xl px-6 text-[10px] font-bold uppercase tracking-widest text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all duration-500 appearance-none">
                              <option value="physician" className="bg-zinc-950">Physician</option>
                              <option value="dentist" className="bg-zinc-950">Dentist</option>
                              <option value="specialist" className="bg-zinc-950">Specialist</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Email Address</Label>
                        <Input
                          type="email"
                          placeholder="NAME@DOMAIN.COM"
                          className="h-14 md:h-16 bg-white/[0.02] border-white/10 rounded-2xl text-white placeholder:text-zinc-800 font-bold uppercase tracking-widest focus:border-blue-500/50 focus:bg-white/[0.05] transition-all duration-500"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••••"
                            className="h-14 md:h-16 bg-white/[0.02] border-white/10 rounded-2xl text-white placeholder:text-zinc-800 font-bold uppercase tracking-widest focus:border-blue-500/50 focus:bg-white/[0.05] transition-all duration-500 pr-14"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors duration-300"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-1">
                      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => toast.info("Remember me enabled")}>
                        <div className="h-4 w-4 rounded border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                          <div className="h-2 w-2 rounded-sm bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">Remember Me</span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <button type="button" className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-blue-500 transition-colors">Forgot Username?</button>
                        <button type="button" className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-blue-500 transition-colors">Forgot Password?</button>
                      </div>
                    </div>

                    <div className="space-y-5 pt-1">
                      <Button type="submit" className="w-full h-14 md:h-16 bg-white text-black hover:bg-zinc-100 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.01] active:scale-[0.98]">
                        {isLogin ? "Sign In" : accountType === "individual" ? "Initialize Twin" : "Create Account"}
                      </Button>

                      <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                        <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 bg-transparent px-6">OR CONTINUE WITH</div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: Globe, label: "Google" },
                          { icon: Apple, label: "Apple" },
                          { icon: Linkedin, label: "LinkedIn" }
                        ].map((provider) => (
                          <Button
                            key={provider.label}
                            variant="outline"
                            className="h-14 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-white rounded-2xl font-black uppercase tracking-widest text-[8px] flex flex-col gap-1 group transition-all duration-500"
                            onClick={() => toast.info(`Connecting to ${provider.label}...`)}
                          >
                            <provider.icon className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                            <span className="opacity-40 group-hover:opacity-100 transition-opacity">{provider.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </form>

                  <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-5 md:p-6 space-y-5">
                    <div className="rounded-2xl border border-blue-500/[0.15] bg-blue-500/[0.05] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Why BeauGene</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] leading-relaxed text-zinc-400">
                        One secure system for genomics, wearable telemetry, and AI-driven health guidance.
                      </p>
                    </div>

                    {[
                      "Digital twin activated in minutes",
                      "Provider and individual workflows",
                      "Privacy-first biological intelligence"
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 leading-relaxed">{item}</span>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center justify-center gap-3 w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] h-14 text-blue-400 hover:text-blue-300 hover:border-blue-500/30 transition-colors"
                      onClick={handleBiometric}
                    >
                      <Fingerprint className="h-5 w-5" />
                      <span className="text-[9px] font-black uppercase tracking-[0.28em]">Biometric Verification</span>
                    </button>

                    <div className="pt-1 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.28em] text-zinc-500">AES-256 Encryption Active</span>
                      </div>
                      <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.18em] leading-relaxed">
                        By continuing, you agree to the <Link to="/terms" className="text-zinc-500 hover:text-white underline decoration-zinc-800 underline-offset-4">Biological Data Protocols</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <div className="flex flex-col items-center mb-16">
            <div className="h-px w-24 bg-blue-500/30 mb-8" />
            <p className="text-center text-[10px] font-black uppercase tracking-[0.8em] text-zinc-500">Strategic Partners in Longevity Science</p>
          </div>
          
          <div className="overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap gap-24 py-4 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
              {[
                { name: "GENOMICS", icon: Fingerprint },
                { name: "BIO-SYNC", icon: Activity },
                { name: "NEURAL-LINK", icon: Zap },
                { name: "QUANTUM-HEALTH", icon: Shield },
                { name: "LIFE-EXTENSION", icon: InfinityIcon },
                { name: "CELL-CORE", icon: Database },
                { name: "VITAL-AI", icon: ActivitySquare },
                { name: "BIO-NODE", icon: Network }
              ].map((brand, i) => (
                <div key={i} className="flex items-center gap-4 group/brand cursor-default">
                  <brand.icon className="h-8 w-8 text-white group-hover/brand:text-blue-500 transition-colors" />
                  <span className="text-3xl font-black tracking-tighter uppercase italic serif text-white group-hover/brand:text-blue-500 transition-colors">{brand.name}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                { name: "GENOMICS", icon: Fingerprint },
                { name: "BIO-SYNC", icon: Activity },
                { name: "NEURAL-LINK", icon: Zap },
                { name: "QUANTUM-HEALTH", icon: Shield },
                { name: "LIFE-EXTENSION", icon: InfinityIcon },
                { name: "CELL-CORE", icon: Database },
                { name: "VITAL-AI", icon: ActivitySquare },
                { name: "BIO-NODE", icon: Network }
              ].map((brand, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-4 group/brand cursor-default" aria-hidden="true">
                  <brand.icon className="h-8 w-8 text-white group-hover/brand:text-blue-500 transition-colors" />
                  <span className="text-3xl font-black tracking-tighter uppercase italic serif text-white group-hover/brand:text-blue-500 transition-colors">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-40 px-8 md:px-16 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-blue-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Ecosystem Solutions</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight">
                Scaled for the <br /> Entire Ecosystem
              </h2>
            </div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.3em] max-w-sm leading-relaxed">
              Biological intelligence scaled for individuals, families, and healthcare providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                title: "Individual", 
                desc: "Personalized longevity protocols based on your unique genetic and real-time telemetry.",
                icon: User,
                color: "from-blue-600/20 to-blue-400/5"
              },
              { 
                title: "Family", 
                desc: "Secure health network for your loved ones. Synchronize care and monitor wellness across generations.",
                icon: Network,
                color: "from-indigo-600/20 to-indigo-400/5"
              },
              { 
                title: "Providers", 
                desc: "Advanced clinical terminal for healthcare professionals. Real-time patient telemetry and predictive diagnostics.",
                icon: Stethoscope,
                color: "from-emerald-600/20 to-emerald-400/5"
              }
            ].map((solution) => (
              <motion.div 
                key={solution.title}
                whileHover={{ y: -15 }}
                className="group relative p-12 bg-white/[0.01] border border-white/5 rounded-[4rem] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-700"
              >
                <div className={cn("h-20 w-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mb-10 shadow-2xl border border-white/5", solution.color)}>
                  <solution.icon className="h-10 w-10 text-white/80" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic serif mb-6">{solution.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed font-bold uppercase tracking-[0.2em] mb-12 group-hover:text-zinc-400 transition-colors">{solution.desc}</p>
                <Button 
                  variant="link" 
                  className="p-0 text-blue-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] gap-3 group/btn"
                  onClick={() => {
                    toast.info(`Please create an account or log in to explore the ${solution.title} solution`);
                    document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Solution <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-40 px-8 md:px-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">The Protocol</span>
              <div className="h-px w-12 bg-blue-500/50" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight mb-10">
              Three Steps to <br /> <span className="text-blue-500">Biological Optimization</span>
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] leading-relaxed">
              We've simplified the most complex biological synthesis into a seamless three-stage experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0" />
            
            {[
              { 
                step: "01", 
                title: "Initialize", 
                desc: "Securely upload your genetic data and synchronize your existing wearables to our encrypted node.",
                icon: Database
              },
              { 
                step: "02", 
                title: "Synthesize", 
                desc: "Our AI engine maps billions of data points to create your unique, living digital twin.",
                icon: Sparkles
              },
              { 
                step: "03", 
                title: "Optimize", 
                desc: "Receive real-time, actionable protocols to enhance your longevity and daily biological performance.",
                icon: Zap
              }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="h-24 w-24 rounded-[2rem] bg-zinc-900 border border-white/10 flex items-center justify-center mb-10 group-hover:border-blue-500/50 group-hover:bg-blue-600/5 transition-all duration-700 relative">
                  <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                    {item.step}
                  </div>
                  <item.icon className="h-10 w-10 text-zinc-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic serif mb-6 group-hover:text-blue-500 transition-colors">{item.title}</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[250px] group-hover:text-zinc-400 transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Core Section (Bento Grid) */}
      <section id="platform" className="py-40 px-8 md:px-16 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Intelligence Core</span>
              <div className="h-px w-12 bg-blue-500/50" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight mb-10">
              The Future of Health is <span className="text-blue-500">Intelligent</span>
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
              BeauGene integrates multi-omics data with real-time telemetry to create a living digital twin. 
              Our platform predicts health risks before they manifest, optimizing longevity for humans and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main Feature Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 relative glass-dark rounded-[4rem] p-12 shadow-2xl border-white/10 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                      <Activity className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Live Telemetry</h3>
                      <p className="text-[9px] text-emerald-500 uppercase tracking-[0.3em] font-black">System Status: Optimal</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-emerald-500/40" />
                    <div className="h-2 w-2 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                  {[
                    { label: "Health Index", value: "98.4", unit: "BI", color: "from-emerald-500 to-emerald-400" },
                    { label: "Longevity Score", value: "84.2", unit: "LS", color: "from-blue-500 to-blue-400" },
                    { label: "Biochemical Risk", value: "Low", unit: "LVL", color: "from-indigo-500 to-indigo-400" }
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{stat.label}</span>
                        <span className="text-xs font-black text-white uppercase tracking-widest">{stat.value} {stat.unit}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "80%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={cn("h-full rounded-full bg-gradient-to-r shadow-[0_0_15px_rgba(0,0,0,0.5)]", stat.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/10">
                      <img src="https://picsum.photos/seed/human/100/100" alt="Twin" className="h-full w-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Digital Twin Active</h4>
                      <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold italic serif">Synchronized 2ms ago</p>
                    </div>
                  </div>
                  <div className="flex-1 max-w-md p-6 bg-blue-600/5 border border-blue-500/10 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                    <p className="text-[10px] text-blue-400/80 font-bold uppercase tracking-[0.2em] leading-relaxed">
                      AI Insight: Metabolic efficiency has increased by 4.2% following the optimized nutrition protocol.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Feature Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 glass-dark rounded-[4rem] p-10 border-white/10 flex flex-col justify-between group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center mb-10 border border-emerald-500/20">
                  <Shield className="h-7 w-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif mb-6">Quantum Privacy</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                  Your biological data is encrypted with post-quantum protocols. Absolute sovereignty over your digital twin.
                </p>
              </div>
              <div className="mt-12 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-1 rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">AES-256 ACTIVE</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/2 bg-emerald-500/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* Side Feature Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 glass-dark rounded-[4rem] p-10 border-white/10 flex flex-col justify-between group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-purple-600/10 flex items-center justify-center mb-10 border border-purple-500/20">
                  <Zap className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif mb-6">AI Synthesis</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                  Advanced neural networks synthesize multi-omics data into actionable daily protocols.
                </p>
              </div>
              <div className="mt-12 flex justify-center relative z-10">
                <div className="relative h-20 w-20">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full"
                  />
                  <div className="absolute inset-4 border border-purple-500/50 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-ping" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Wide Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-8 glass-dark rounded-[4rem] p-12 border-white/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex flex-col sm:flex-row items-center gap-12 relative z-10">
                <div className="h-24 w-24 rounded-3xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                  <Globe className="h-12 w-12 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic serif mb-4">Global Biological Network</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xl">
                    Connect with a global network of longevity researchers and healthcare providers. Securely share your digital twin data for collaborative optimization.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-8">
                    {["GENOMIC MAPPING", "REAL-TIME SYNC", "QUANTUM PRIVACY", "AI PROTOCOLS"].map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[8px] font-black text-zinc-500 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 px-8 md:px-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Voices of Longevity</span>
              <div className="h-px w-12 bg-blue-500/50" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight">
              Synchronized <span className="text-blue-500">Experiences</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                quote: "BeauGene transformed my approach to health. My digital twin predicted a metabolic shift three months before my clinical labs showed anything.",
                author: "Dr. Elena Vance",
                role: "Longevity Researcher",
                image: "https://picsum.photos/seed/elena/100/100"
              },
              {
                quote: "The precision is unmatched. Having my real-time telemetry synchronized with my genetic profile gives me a level of control I never thought possible.",
                author: "Marcus Thorne",
                role: "Performance Athlete",
                image: "https://picsum.photos/seed/marcus/100/100"
              },
              {
                quote: "As a provider, BeauGene is the terminal I've been waiting for. It bridges the gap between reactive medicine and proactive biological optimization.",
                author: "Dr. Julian Chen",
                role: "Chief Medical Officer",
                image: "https://picsum.photos/seed/julian/100/100"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-white/[0.01] border border-white/5 rounded-[3rem] hover:bg-white/[0.03] transition-all duration-700 relative group"
              >
                <Quote className="h-10 w-10 text-blue-500/20 mb-8 group-hover:text-blue-500/40 transition-colors" />
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.1em] leading-relaxed italic serif mb-12">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={testimonial.image} alt={testimonial.author} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{testimonial.author}</h4>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-40 px-8 md:px-16 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-blue-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Clinical Insights</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight">
                Biological Research <br /> & Clinical Studies
              </h2>
            </div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.3em] max-w-sm leading-relaxed">
              The latest breakthroughs in longevity, genomics, and personalized medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "The Science of Aging",
                desc: "Understanding the hallmarks of aging and how DNA personalization can reverse biological age markers.",
                tags: ["Longevity", "Genomics"],
                image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800&h=600"
              },
              {
                title: "DNA & Family Health",
                desc: "How mapping your family's genetic code creates a protective network for future generations.",
                tags: ["Family", "Prevention"],
                image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=800&h=600"
              },
              {
                title: "Metabolic Optimization",
                desc: "Real-time telemetry insights into insulin sensitivity and mitochondrial health.",
                tags: ["Metabolism", "Telemetry"],
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&h=600"
              },
              {
                title: "Neural Plasticity",
                desc: "Enhancing cognitive health through personalized neuro-protective protocols.",
                tags: ["Brain Health", "AI"],
                image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800&h=600"
              }
            ].map((article, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group bg-white/[0.01] border border-white/5 rounded-[4rem] overflow-hidden flex flex-col lg:flex-row hover:border-white/10 transition-all duration-700"
              >
                <div className="w-full lg:w-1/2 h-72 lg:h-auto overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" referrerPolicy="no-referrer" />
                </div>
                <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
                  <div className="flex gap-3 mb-6">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic serif mb-6 leading-tight group-hover:text-blue-500 transition-colors">{article.title}</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed mb-10">{article.desc}</p>
                  <Button variant="link" className="p-0 text-white hover:text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] w-fit gap-3 group/btn">
                    Read Study <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-8 md:px-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic serif mb-8">
                Architecting the <br /> Future of Life
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed font-bold uppercase tracking-widest mb-8">
                BeauGene was founded on a simple premise: that biological data is the most valuable code in existence. Our mission is to give every human the tools to read, understand, and optimize that code.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed font-bold uppercase tracking-widest mb-12">
                We are a multidisciplinary team of geneticists, data scientists, and longevity researchers dedicated to extending the healthy human lifespan through the synthesis of multi-omics and real-time telemetry.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-3xl font-black text-white uppercase italic serif mb-2">2026</h4>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">San Francisco</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white uppercase italic serif mb-2">120+</h4>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Research Partners</p>
                </div>
              </div>
            </div>
        </div>
      </section>
      <section className="py-32 px-8 md:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic serif mb-8">
              The Architecture of <br />
              <span className="text-blue-500">Human Optimization</span>
            </h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
              We've built a multi-layered biological intelligence system that monitors every vital sign, genetic marker, and environmental factor to create a perfect digital reflection of your health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ActivitySquare}
              title="Digital Twin"
              description="A living, breathing digital reflection of your biology, updated in real-time via multi-omics and telemetry."
              delay={0.05}
            />
            <FeatureCard 
              icon={Database}
              title="Genomic Core"
              description="Full sequence DNA analysis mapped to your digital twin for lifelong health trajectory prediction."
              delay={0.1}
            />
            <FeatureCard 
              icon={Zap}
              title="Real-time Sync"
              description="Continuous telemetry from wearables and medical-grade sensors updating your twin every second."
              delay={0.2}
            />
            <FeatureCard 
              icon={Shield}
              title="Predictive Defense"
              description="AI-driven early warning system detecting biological anomalies months before symptoms appear."
              delay={0.3}
            />
            <FeatureCard 
              icon={Sparkles}
              title="Health AI Agent"
              description="Your personal biological consultant, synthesizing complex data into actionable daily directives."
              delay={0.4}
            />
            <FeatureCard 
              icon={Globe}
              title="Global Research"
              description="Instant integration with the latest longevity research and clinical trials worldwide."
              delay={0.5}
            />
            <FeatureCard 
              icon={Lock}
              title="Quantum Privacy"
              description="Your biological data is encrypted with quantum-resistant protocols. You own your code."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-8 md:px-16 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic serif mb-8 leading-tight">
                Three Steps to <br />
                <span className="text-blue-500">Biological Mastery</span>
              </h2>
              <div className="space-y-12">
                {[
                  { step: "01", title: "Initialize Identity", desc: "Upload your genomic data and connect your biometric devices to create your initial twin." },
                  { step: "02", title: "Continuous Sync", desc: "Our neural engine monitors your biological telemetry 24/7, refining your digital model." },
                  { step: "03", title: "Optimize Life", desc: "Receive real-time directives and predictive insights to maximize your healthspan." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <span className="text-4xl font-black text-blue-500/20 group-hover:text-blue-500 transition-colors duration-500 font-mono">{item.step}</span>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase italic serif mb-2">{item.title}</h3>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full animate-pulse" />
              <div className="relative h-full w-full rounded-[4rem] border border-white/10 overflow-hidden bg-black/40 backdrop-blur-3xl p-12 flex flex-col justify-center items-center text-center">
                <div className="h-32 w-32 rounded-3xl bg-blue-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                  <Activity className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic serif mb-4">System Telemetry</h3>
                <div className="w-full space-y-4">
                  {[84, 92, 76].map((val, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                        <span>System {i + 1}</span>
                        <span>{val}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${val}%` }}
                          className="h-full bg-blue-600" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-40 px-8 md:px-16 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-24">
            <div className="lg:w-1/3">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-blue-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Support Core</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic serif mb-10 leading-tight">
                Common <br /> <span className="text-blue-500">Inquiries</span>
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed mb-12">
                Addressing the most frequent questions from our biological community.
              </p>
              <Button 
                variant="outline" 
                className="h-14 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[9px]"
                onClick={() => setIsAIAgentOpen(true)}
              >
                Ask AI Agent
              </Button>
            </div>
            
            <div className="lg:w-2/3 space-y-6">
              <div className="relative mb-12">
                <input 
                  type="text"
                  placeholder="Search FAQs..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-6 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600">
                  <Target className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { 
                    q: "How secure is my biological data?", 
                    a: "We utilize AES-256 post-quantum encryption and decentralized storage protocols. Your data is your property; we act only as the processing node." 
                  },
                  { 
                    q: "What wearables are compatible?", 
                    a: "BeauGene synchronizes with all major platforms including Apple Health, Oura, Whoop, and continuous glucose monitors (CGM)." 
                  },
                  { 
                    q: "Is this medical advice?", 
                    a: "BeauGene provides biological optimization protocols and predictive insights. We recommend consulting with your primary care physician for clinical decisions." 
                  },
                  { 
                    q: "Can I delete my digital twin?", 
                    a: "Yes. You maintain absolute sovereignty over your digital twin. You can purge all data from our nodes at any time with a single command." 
                  }
                ].filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase())).map((item, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "group p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer",
                      activeFaq === i ? "bg-white/[0.05] border-blue-500/30" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.02]"
                    )}
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center justify-between">
                      {item.q}
                      <Plus className={cn("h-4 w-4 text-blue-500 transition-transform duration-500", activeFaq === i && "rotate-45")} />
                    </h4>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-2xl">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-40 px-8 md:px-16 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">The Advantage</span>
              <div className="h-px w-12 bg-blue-500/50" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight">
              Traditional vs <span className="text-blue-500">BeauGene</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Traditional */}
            <div className="p-12 bg-white border border-white/5 rounded-[4rem] opacity-40 hover:opacity-60 transition-opacity duration-700">
              <h3 className="text-2xl text-zinc-500 uppercase tracking-wider font-typewriter mb-12">Traditional Healthcare</h3>
              <div className="space-y-10">
                {[
                  { label: "Approach", val: "Reactive (Treats symptoms)" },
                  { label: "Data", val: "Fragmented & Static" },
                  { label: "Personalization", val: "Generic Protocols" },
                  { label: "Monitoring", val: "Annual Checkups" }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-6">
                    <span className="text-[10px] text-zinc-700 uppercase tracking-wider font-typewriter">{item.label}</span>
                    <span className="text-[10px] text-zinc-800 uppercase tracking-wider font-typewriter">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BeauGene */}
            <div className="p-12 bg-blue-600/5 border border-blue-500/20 rounded-[4rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8">
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] border border-blue-500/20">
                  <Logo className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif mb-12">BeauGene Protocol</h3>
              <div className="space-y-10">
                {[
                  { label: "Approach", val: "Proactive (Predicts risks)", color: "text-blue-400" },
                  { label: "Data", val: "Synchronized & Living", color: "text-blue-400" },
                  { label: "Personalization", val: "Genetic Synthesis", color: "text-blue-400" },
                  { label: "Monitoring", val: "Real-time Telemetry", color: "text-blue-400" }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center border-b border-blue-500/10 pb-6">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</span>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                <p className="text-[9px] text-blue-300 font-bold uppercase tracking-[0.2em] leading-relaxed">
                  "BeauGene represents a 10x shift in biological sovereignty and longevity optimization."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biological Timeline Section */}
      <section className="py-40 px-8 md:px-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Longevity Roadmap</span>
              <div className="h-px w-12 bg-blue-500/50" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight">
              Biological <span className="text-blue-500">Timeline</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 hidden lg:block" />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {[
                { year: "Year 01", title: "Baseline Synthesis", desc: "Complete genomic mapping and digital twin initialization." },
                { year: "Year 05", title: "Cellular Optimization", desc: "Mitochondrial health and metabolic efficiency peak performance." },
                { year: "Year 15", title: "Biological Reversal", desc: "Epigenetic clock synchronization and age marker reduction." },
                { year: "Year 50+", title: "Infinite Horizon", desc: "Continuous biological sovereignty and longevity maintenance." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className="h-20 w-20 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center mb-10 group-hover:border-blue-500 transition-all duration-700 relative">
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(37,99,235,1)]" />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 rounded-full text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                      {item.year}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic serif mb-4 group-hover:text-blue-500 transition-colors">{item.title}</h3>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 px-8 md:px-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Investment Plans</span>
              <div className="h-px w-12 bg-blue-500/50" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif leading-tight">
              Biological <br /> <span className="text-blue-500">Subscription</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PricingCard 
              title="Individual"
              features={[
                "Full Digital Twin Access",
                "Genomic Mapping",
                "Real-time Device Sync",
                "AI Health Agent Basic",
                "Weekly Health Reports"
              ]}
              delay={0.1}
            />
            <PricingCard 
              title="Family"
              features={[
                "Up to 5 Family Members",
                "Shared Health Network",
                "Advanced Bio-Sync",
                "AI Health Agent Pro",
                "Emergency Response Link"
              ]}
              recommended={true}
              delay={0.2}
            />
            <PricingCard 
              title="Enterprise"
              features={[
                "Unlimited Members",
                "Custom Health Protocols",
                "Dedicated Medical Team",
                "API Data Access",
                "Priority AI Processing"
              ]}
              delay={0.3}
            />
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-48 px-8 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[180px] rounded-full" />
          <div className="absolute inset-0 noise opacity-[0.03] mix-blend-overlay" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative rounded-[5rem] bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden p-24 md:p-40 text-center shadow-[0_60px_120px_rgba(37,99,235,0.3)] border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-6 mb-16">
                <div className="h-px w-16 bg-white/30" />
                <span className="text-[11px] font-black uppercase tracking-[0.8em] text-white/70">Final Protocol Initiation</span>
                <div className="h-px w-16 bg-white/30" />
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif mb-16 leading-[0.8]">
                Ready to invest in your <br /> 
                Future <div className="inline-flex items-center justify-center h-[1.1em] overflow-hidden align-bottom w-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={heroWord}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="inline-block font-cursive normal-case px-2 text-center w-full text-white"
                    >
                      {heroWord}
                    </motion.span>
                  </AnimatePresence>
                </div>?
              </h2>
              
              <p className="text-white/70 text-base font-bold uppercase tracking-[0.4em] mb-24 max-w-2xl mx-auto leading-relaxed">
                Join the biological revolution today and start optimizing your longevity through the synthesis of multi-omics and real-time telemetry.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-10">
                <Button 
                  className="h-24 px-20 bg-white text-blue-600 hover:bg-zinc-100 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[14px] shadow-2xl transition-all hover:scale-105 active:scale-95 group"
                  onClick={() => {
                    setIsLogin(false);
                    scrollToSection('auth-card');
                  }}
                >
                  Initialize Your Twin <ArrowRight className="ml-6 h-6 w-6 group-hover:translate-x-3 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] border border-blue-500/20">
                  <Logo className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic serif">BeauGene</span>
              </Link>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                Synchronizing biological code with digital intelligence to optimize the human experience.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Platform</h4>
              <ul className="space-y-4">
                {["Digital Twin", "Genomics", "Bio-Sync", "Neural Link"].map(item => (
                  <li key={item}><Link to="/research" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Company</h4>
              <ul className="space-y-4">
                {["About", "Careers", "Research", "Partners"].map(item => (
                  <li key={item}><Link to="/research" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Legal</h4>
              <ul className="space-y-4">
                {["Privacy", "Terms", "Security", "Ethics"].map(item => (
                  <li key={item}><Link to="/settings" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Social</h4>
              <ul className="space-y-4">
                {["Twitter", "LinkedIn", "Instagram", "GitHub"].map(item => (
                  <li key={item}><a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">© 2026 BeauGene Biological Systems. All Rights Reserved.</p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">All Systems Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-zinc-600" />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Global Node: US-EAST-1</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Arrow */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Health AI Agent Pop-up */}
      <div className="fixed bottom-8 left-8 z-50">
        <AnimatePresence>
          {isAIAgentOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 left-0 w-80 h-[450px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 bg-blue-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                    {agentAvatar ? (
                      <img src={agentAvatar} alt={agentName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{agentName}</h4>
                </div>
                <button onClick={() => setIsAIAgentOpen(false)} className="text-white/60 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                    Hello! I'm your {agentName}. How can I assist with your biological optimization today?
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-white/5">
                <div className="relative">
                  <input 
                    placeholder="Ask anything..."
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsAIAgentOpen(!isAIAgentOpen)}
          className="h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      </div>
      <Dialog open={isBiometricOpen} onOpenChange={setIsBiometricOpen}>
        <DialogContent className="bg-black/90 backdrop-blur-2xl border-white/10 text-white rounded-[3rem] p-12 max-w-md text-center">
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-8 bg-blue-600/20 blur-2xl rounded-full"
              />
              <div className="h-24 w-24 rounded-3xl bg-blue-600 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(37,99,235,0.5)]">
                <Fingerprint className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase italic serif mb-2">Verifying Identity</DialogTitle>
              <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Scanning biological signature...
              </DialogDescription>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="h-full bg-blue-600" 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
