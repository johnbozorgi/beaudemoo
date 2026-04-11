import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  Activity, 
  Users, 
  Calendar, 
  Bot, 
  Database, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useDoctor } from "@/context/DoctorContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function DoctorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, logout, isLoggedIn } = useDoctor();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/doctor-auth") {
      navigate("/doctor-auth");
    }
  }, [isLoggedIn, navigate, location.pathname]);

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/provider-dashboard" },
    { label: "Patients", icon: Users, path: "/doctor/patients" },
    { label: "Appointments", icon: Calendar, path: "/doctor/appointments" },
    { label: "AI Assistant", icon: Bot, path: "/doctor/ai-assistant", color: "text-blue-400" },
    { label: "Biomarker Panels", icon: FlaskConical, path: "/doctor/biomarker-collector" },
    { label: "Data Requests", icon: ClipboardList, path: "/doctor/requests" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/doctor-auth");
    toast.success("Logged out from provider portal");
  };

  const isActive = (path: string) => location.pathname === path;

  if (!isLoggedIn) return null;

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
            <Link to="/provider-dashboard" className="flex items-center gap-4 group">
              <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-blue-600/20 border border-blue-500/20">
                <Logo className="h-6 w-6" color="#60A5FA" />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter uppercase italic serif leading-none">BeauGene</span>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400 mt-1">Provider Portal</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar py-4">
            {navItems.map((item) => (
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
                {isActive(item.path) && (
                  <motion.div 
                    layoutId="active-pill-doctor"
                    className="absolute left-0 w-1 h-6 bg-black rounded-full"
                  />
                )}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group text-zinc-500 hover:bg-red-500/10 hover:text-red-400 mt-4"
              )}
            >
              <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
                {doctor?.name.split(' ').map(n => n[0]).join('')}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest truncate">{doctor?.name}</p>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest truncate">{doctor?.specialty}</p>
                </div>
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
                placeholder="Search patients, records, or AI insights..." 
                className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-full placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-blue-600 rounded-full border-2 border-[#050505]" />
              </Button>
              <div className="h-10 w-[1px] bg-white/5 mx-2" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest">{doctor?.clinic}</span>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
              </div>
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
    </div>
  );
}
