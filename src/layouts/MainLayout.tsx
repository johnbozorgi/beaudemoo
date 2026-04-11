import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, Activity, UserCircle, Bot, Siren, 
  Dna, FileText, Target, Database, Calendar, 
  LifeBuoy, Users, MapPin, Stethoscope, BookOpen, 
  Bell, Menu, X, ChevronRight, LogOut, Search,
  Settings, HelpCircle, Sparkles, ShieldCheck, Info,
  ChevronDown, MessageSquare, LogOut as LogOutIcon,
  GitBranch, PieChart, ArrowRight, ArrowUp, Sun, Moon as MoonIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useDashboard } from "@/context/DashboardContext";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface NavItem {
  label: string;
  icon: any;
  path: string;
  badge?: string;
  color?: string;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeContext, setActiveContext, gender, hasFamily, setIsLoggedIn, agentName, theme, setTheme } = useDashboard();
  const { notifications } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDashboardsOpen, setIsDashboardsOpen] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: `Hello! I'm your ${agentName} assistant. How can I help you with your biological data today?` }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const individualNavItems: NavItem[] = [
    { label: "Health Data Bank", icon: Database, path: "/data-bank" },
    { label: "Health AI Agent", icon: Bot, path: "/health-ai", color: "text-blue-400" },
    { label: "Digital Twin", icon: Dna, path: "/digital-twin", color: "text-purple-400" },
    { label: "Reports", icon: FileText, path: "/reports" },
    { label: "Health Goals", icon: Target, path: "/health-goals" },
    { label: "Doctor's Appointments", icon: Calendar, path: "/appointments" },
    { label: "Personalized Life", icon: Sparkles, path: "/personalized-life", color: "text-amber-400" },
    { label: "Research Participation", icon: Users, path: "/research" },
    { label: "Location", icon: MapPin, path: "/location" },
    { label: "Health Insurance", icon: ShieldCheck, path: "/insurance", color: "text-emerald-400" },
    { label: "Individual Research Articles", icon: BookOpen, path: "/articles" },
    { label: "Notifications", icon: Bell, path: "/notifications", badge: notifications.length > 0 ? notifications.length.toString() : undefined },
  ];

  const familyNavItems: NavItem[] = [
    { label: "Family Health Tree", icon: GitBranch, path: "/family", color: "text-emerald-400" },
    { label: "Family Data Bank", icon: Database, path: "/family-health-data" },
    { label: "Family Health Goals", icon: Target, path: "/family-goals" },
    { label: "Family Reports", icon: PieChart, path: "/family-reports" },
    { label: "Family Doctor", icon: Stethoscope, path: "/family-doctor" },
    { label: "Health Insurance", icon: ShieldCheck, path: "/insurance", color: "text-emerald-400" },
    { label: "Family AI Agent", icon: Bot, path: "/family-ai", color: "text-blue-400" },
    { label: "Family Research Articles", icon: BookOpen, path: "/family-articles" },
    { label: "Notifications", icon: Bell, path: "/notifications", badge: notifications.length > 0 ? notifications.length.toString() : undefined },
  ];

  const currentNavItems = activeContext === "individual" ? individualNavItems : (hasFamily ? familyNavItems : []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: "user", content: chatInput }]);
    setChatInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: "ai", 
        content: "I'm analyzing your request based on your current biological telemetry. This feature is currently in simulation mode." 
      }]);
    }, 1000);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-black/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isSidebarOpen ? "w-80" : "w-24"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-10 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-4 group">
              <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-blue-500/20 border border-white/10">
                <Logo className="h-6 w-6" color="#60A5FA" />
              </div>
              {isSidebarOpen && (
                <span className="text-2xl font-black tracking-tighter uppercase italic serif group-hover:tracking-normal transition-all duration-500">BeauGene</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar py-4">
            {/* My Dashboards Parent */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsDashboardsOpen(!isDashboardsOpen);
                  navigate("/dashboard");
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                  isActive("/dashboard") ? "bg-white/10 text-white" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <LayoutDashboard className={cn(
                    "h-5 w-5 transition-transform duration-500",
                    isActive("/dashboard") ? "text-white" : "text-zinc-500",
                    "group-hover:scale-110"
                  )} />
                  {isSidebarOpen && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">My Dashboards</span>
                  )}
                </div>
                {isSidebarOpen && (
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-300",
                    isDashboardsOpen ? "rotate-180" : ""
                  )} />
                )}
              </button>

              <AnimatePresence>
                {isDashboardsOpen && isSidebarOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-12 space-y-1"
                  >
                    <button
                      onClick={() => {
                        setActiveContext("individual");
                        navigate("/individual-dashboard");
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest",
                        activeContext === "individual" && location.pathname === "/individual-dashboard" ? "text-blue-400" : "text-zinc-600 hover:text-white"
                      )}
                    >
                      <UserCircle className="h-4 w-4" />
                      Individual
                    </button>
                    <button
                      onClick={() => {
                        setActiveContext("family");
                        navigate("/family-dashboard");
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest",
                        activeContext === "family" && location.pathname === "/family-dashboard" ? "text-emerald-400" : "text-zinc-600 hover:text-white"
                      )}
                    >
                      <Users className="h-4 w-4" />
                      Family
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Items */}
            {currentNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative",
                  isActive(item.path) 
                    ? "bg-white text-black shadow-2xl shadow-white/10 scale-[1.02]" 
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-500",
                  isActive(item.path) ? "text-black" : item.color || "text-zinc-500",
                  "group-hover:scale-110"
                )} />
                {isSidebarOpen && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                )}
                {item.badge && isSidebarOpen && (
                  <span className="absolute right-4 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive(item.path) && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-black rounded-full"
                  />
                )}
              </Link>
            ))}

            {/* Logout Feature */}
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group text-zinc-500 hover:bg-red-500/10 hover:text-red-400 mt-4"
              )}
            >
              <LogOutIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Log Out</span>
              )}
            </button>
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <div className={cn(
              "flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 transition-all duration-500",
              !isSidebarOpen && "justify-center p-2"
            )}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/20">
                DH
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest truncate">David Houshang</p>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest truncate">Premium Bio-Mirror</p>
                </div>
              )}
              {isSidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/profile-settings")}
                  className="text-zinc-500 hover:text-white rounded-xl"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isSidebarOpen ? "pl-80" : "pl-24"
      )}>
        {/* Top Header */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-zinc-500 hover:text-white rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-6 h-12 rounded-2xl w-96 group focus-within:border-white/20 transition-all">
              <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Search biological data streams..." 
                className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-full placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-zinc-500 hover:text-white rounded-xl"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
              <Button 
                onClick={() => {
                  setActiveContext("individual");
                  navigate("/individual-dashboard");
                }}
                className={cn(
                  "h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  activeContext === "individual" ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                )}
              >
                Personal
              </Button>
              <Button 
                onClick={() => {
                  setActiveContext("family");
                  navigate("/family-dashboard");
                }}
                className={cn(
                  "h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  activeContext === "family" ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                )}
              >
                Family
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-12 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Assistant Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-10 right-28 z-[60] h-14 w-14 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
      >
        <Bot className="h-6 w-6" />
        <div className="absolute right-full mr-4 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <span className="text-[10px] font-black uppercase tracking-widest">{agentName} Assistant</span>
        </div>
      </motion.button>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-[60] h-14 w-14 rounded-2xl bg-white text-black shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic serif mb-4">BeauGene AI Assistant</DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Your personal biological co-pilot, ready to help you navigate your health data and optimize your life.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] group hover:bg-white/10 transition-all cursor-pointer" onClick={() => { setIsHelpOpen(false); navigate("/health-ai"); }}>
              <Bot className="h-8 w-8 text-blue-400 mb-4" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Consultation</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Ask complex questions about your biological profile and digital twin simulations.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] group hover:bg-white/10 transition-all cursor-pointer" onClick={() => { setIsHelpOpen(false); navigate("/health-ai"); }}>
              <Siren className="h-8 w-8 text-red-400 mb-4" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Emergency Agent</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Configure your emergency guardians and real-time biomarker monitoring protocols.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] group hover:bg-white/10 transition-all cursor-pointer" onClick={() => { setIsHelpOpen(false); navigate("/data-bank"); }}>
              <Database className="h-8 w-8 text-emerald-400 mb-4" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Data Management</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Learn how to ingest new data streams or manage your bio-digital identity.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] group hover:bg-white/10 transition-all cursor-pointer" onClick={() => { setIsHelpOpen(false); navigate("/digital-twin"); }}>
              <Dna className="h-8 w-8 text-purple-400 mb-4" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Digital Twin</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Understand how simulations predict your long-term health outcomes.</p>
            </div>
          </div>

          <div className="mt-10 p-8 bg-blue-600 rounded-[2rem] flex items-center justify-between group cursor-pointer" onClick={() => { setIsHelpOpen(false); navigate("/health-ai"); }}>
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-blue-600">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tighter italic serif">Start Full Consultation</h4>
                <p className="text-blue-100 text-[9px] font-bold uppercase tracking-widest">Enter the advanced AI sandbox</p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-2 transition-transform" />
          </div>
        </DialogContent>
      </Dialog>
      {/* AI Chat Modal */}
      <Dialog open={isAIChatOpen} onOpenChange={setIsAIChatOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-0 max-w-xl overflow-hidden flex flex-col h-[600px]">
          <DialogHeader className="p-8 border-b border-white/5 bg-zinc-900/50">
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic serif flex items-center gap-3">
              <Bot className="h-6 w-6 text-blue-400" />
              {agentName} Agent
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Real-time biological intelligence sandbox
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-8">
            <div className="space-y-6">
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex flex-col max-w-[80%]",
                  msg.role === "user" ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl text-xs leading-relaxed",
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-2">
                    {msg.role === "user" ? "You" : "BeauGene AI"}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-8 border-t border-white/5 bg-zinc-900/30">
            <div className="flex gap-4">
              <Input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about your biological telemetry..."
                className="bg-white/5 border-white/10 rounded-xl h-12 text-xs"
              />
              <Button 
                onClick={handleSendMessage}
                className="h-12 w-12 rounded-xl bg-white text-black hover:bg-zinc-200"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
