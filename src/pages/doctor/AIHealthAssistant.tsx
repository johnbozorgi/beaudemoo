import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Zap, 
  Shield, 
  Activity, 
  Search, 
  Plus, 
  FileText, 
  MessageSquare, 
  Settings,
  Bell,
  User,
  ArrowUpRight,
  ActivitySquare,
  Filter,
  MoreHorizontal,
  FlaskConical,
  Download,
  AlertCircle,
  LogOut,
  Lock,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Mic,
  Paperclip,
  BrainCircuit,
  Database,
  Code2,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useDoctor } from "@/context/DoctorContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "analysis" | "recommendation" | "data";
}

export default function AIHealthAssistant() {
  const { patients, doctor } = useDoctor();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: `Welcome to the Clinical Intelligence Sandbox, Dr. ${doctor?.name.split(',')[0]}. I have indexed all ${patients.length} active patient profiles and their biological telemetry. How can I assist your clinical decision-making today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "I've analyzed the requested telemetry. Based on the longitudinal data, there is a statistically significant correlation between the patient's elevated cortisol levels and their reported sleep disturbances. I recommend a targeted metabolic panel to rule out secondary adrenal insufficiency.",
        timestamp: new Date(),
        type: "analysis"
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Neural Clinical Support</h2>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">
            AI Assistant Sandbox
          </h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">
            Advanced diagnostic support powered by BeauGene Neural Engine V4.2
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
            <Database className="h-4 w-4 mr-3" /> Index Patient Data
          </Button>
          <Button className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-2xl shadow-blue-600/20">
            <Settings className="h-4 w-4 mr-3" /> Model Config
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-10 min-h-0">
        {/* Chat Interface */}
        <div className="lg:col-span-3 flex flex-col bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050505]/40 to-transparent pointer-events-none z-10" />
          
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar"
          >
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-6 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl",
                  msg.role === "assistant" ? "bg-blue-600 text-white" : "bg-white/10 text-zinc-400"
                )}>
                  {msg.role === "assistant" ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>
                
                <div className="space-y-4">
                  <div className={cn(
                    "p-8 rounded-[2rem] text-sm leading-relaxed",
                    msg.role === "assistant" 
                      ? "bg-white/5 border border-white/10 text-zinc-300" 
                      : "bg-blue-600 text-white font-medium"
                  )}>
                    {msg.content}
                    
                    {msg.type === "analysis" && (
                      <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                        <div className="flex items-center gap-3">
                          <BrainCircuit className="h-4 w-4 text-blue-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Neural Correlation Analysis</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Confidence Score</p>
                            <p className="text-xl font-black text-emerald-500 font-mono">94.2%</p>
                          </div>
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Data Points</p>
                            <p className="text-xl font-black text-white font-mono">1.2M</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={cn(
                    "text-[8px] font-black uppercase tracking-widest text-zinc-600",
                    msg.role === "user" ? "text-right" : ""
                  )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-6 max-w-[85%]">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex gap-2 items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-10 border-t border-white/10 bg-black/20">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 relative">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about patient trends, diagnostic correlations, or treatment protocols..." 
                  className="h-20 bg-white/5 border-white/10 rounded-[2rem] pl-10 pr-32 text-xs font-bold uppercase tracking-widest focus:ring-blue-500/50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-zinc-500 hover:text-white">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-zinc-500 hover:text-white">
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleSend}
                className="h-20 w-20 bg-blue-600 text-white hover:bg-blue-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar: Context & Tools */}
        <div className="space-y-8">
          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Terminal className="h-4 w-4 text-zinc-500" />
              Active Context
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Selected Patient</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
                    <User className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Registry</p>
                </div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Model Version</p>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural V4.2 Stable</p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Suggested Queries</h3>
            <div className="space-y-4">
              {[
                "Analyze metabolic trends for John Doe",
                "Cross-reference sleep data with cortisol",
                "Predict risk for cardiovascular events",
                "Optimize medication protocol for patient #12"
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left hover:bg-white/5 transition-all group"
                >
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors leading-relaxed">
                    "{q}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
