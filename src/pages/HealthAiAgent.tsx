import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Dna, 
  FileText, 
  Search, 
  Loader2, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Activity,
  Brain,
  Heart,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  Siren,
  Phone,
  Mail,
  Smartphone,
  Bell,
  Users,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDashboard } from "@/context/DashboardContext";
import { useNotifications } from "@/context/NotificationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  audioUrl?: string;
  timestamp: Date;
}

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  notifyVia: ("text" | "email" | "app")[];
}

export default function HealthAiAgent() {
  const { agentName, setAgentName, agentVoice, setAgentVoice, agentAvatar } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Greetings. I am your **${agentName}**, your specialized intelligence for individual biological optimization. I am monitoring your digital twin, real-time biomarkers, and genomic predispositions. How can I assist your health journey today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(localStorage.getItem("individual_agent_voice_enabled") === "true");
  const [attachedFile, setAttachedFile] = useState<{ name: string, data: string, mimeType: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "emergency" | "settings">("chat");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { addNotification } = useNotifications();

  // Emergency Agent State
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Sarah Houshang", relation: "Spouse", phone: "+1 555-999-8888", email: "sarah@example.com", notifyVia: ["text", "app"] },
    { id: "2", name: "Dr. Sarah Jenkins", relation: "Primary Physician", phone: "+1 555-123-4567", email: "jenkins@ucsf.edu", notifyVia: ["email"] }
  ]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(",")[1];
      setAttachedFile({
        name: file.name,
        data: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const speakResponse = async (text: string) => {
    if (!isVoiceEnabled) return null;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in a professional, clear, and empathetic voice: ${text.replace(/\*\*/g, "")}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: agentVoice === "Male" ? 'Zephyr' : 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBlob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { type: 'audio/pcm;rate=24000' });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = audioContext.createBuffer(1, arrayBuffer.byteLength / 2, 24000);
        const nowBuffering = audioBuffer.getChannelData(0);
        const dataview = new DataView(arrayBuffer);
        for (let i = 0; i < arrayBuffer.byteLength / 2; i++) {
          nowBuffering[i] = dataview.getInt16(i * 2, true) / 32768;
        }
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        
        return URL.createObjectURL(audioBlob);
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
    return null;
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || isLoading) return;

    const userMessage = input.trim();
    const currentFile = attachedFile;
    
    setInput("");
    setAttachedFile(null);
    
    setMessages(prev => [...prev, { 
      role: "user", 
      content: userMessage || (currentFile ? `Sent file: ${currentFile.name}` : ""),
      timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      const parts: any[] = [];
      if (userMessage) parts.push({ text: userMessage });
      if (currentFile) {
        parts.push({
          inlineData: {
            data: currentFile.data,
            mimeType: currentFile.mimeType
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: parts }
        ],
        config: {
          systemInstruction: `You are the ${agentName} for the BeauGene platform. 
          Your goal is to provide deep biological insights for the individual user.
          
          CONTEXT:
          - Focus on individual biological optimization, digital twin simulations, and real-time biomarkers.
          - Analyze the user's health data bank records, genomic files, and medical documents.
          
          GUIDELINES:
          1. Be professional, precise, and empathetic.
          2. Use Markdown for formatting.
          3. Cite that you are using real-time grounding for research.
          4. Always remind the user that you are an AI assistant and they should consult with their healthcare provider for medical decisions.
          5. Reference the user's digital twin data when providing predictions or recommendations.`,
          tools: [{ googleSearch: {} }]
        }
      });

      const assistantContent = response.text || "I apologize, I encountered a neural sync error. Please try again.";
      
      const sources: string[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri) sources.push(chunk.web.uri);
        });
      }

      let audioUrl = undefined;
      if (isVoiceEnabled) {
        audioUrl = await speakResponse(assistantContent);
      }

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: assistantContent,
        sources: sources.length > 0 ? sources : undefined,
        audioUrl,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Health AI Agent Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "System Error: Failed to establish a secure link with your biological intelligence core.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.info("Contact removed");
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      toast.success("Biomarker monitoring active");
      addNotification({
        title: "Emergency Monitoring Active",
        message: "The Emergency Agent is now monitoring your real-time biomarkers for anomalies.",
        type: "info"
      });
    } else {
      toast.warning("Emergency monitoring paused");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Neural Health Interface</h2>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic serif flex items-center gap-3">
              Health AI Agent <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
              <button 
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === "chat" ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Consultation
              </button>
              <button 
                onClick={() => setActiveTab("emergency")}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === "emergency" ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Emergency
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === "settings" ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Settings
              </button>
            </div>
            <button 
              onClick={() => {
                const newVal = !isVoiceEnabled;
                setIsVoiceEnabled(newVal);
                localStorage.setItem("individual_agent_voice_enabled", newVal.toString());
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                isVoiceEnabled ? "bg-blue-600/10 border-blue-500/30 text-blue-400" : "bg-white/5 border-white/10 text-zinc-500"
              )}
            >
              {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="text-[9px] font-bold uppercase tracking-widest">{isVoiceEnabled ? "Voice: On" : "Voice: Muted"}</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Status: Protected</span>
            </div>
          </div>
        </div>
        
        {/* Medical Disclaimer */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200/70 leading-relaxed">
            <span className="text-amber-500">IMPORTANT:</span> This AI agent is not a medical doctor and can make mistakes. The information provided is for educational purposes only. You <span className="text-white underline">MUST</span> consult with your professional healthcare provider for any medical decisions or diagnosis.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "chat" ? (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar mb-8">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-6",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border overflow-hidden",
                      msg.role === "assistant" 
                        ? "bg-blue-600/10 border-blue-500/30 text-blue-400" 
                        : "bg-white/5 border-white/10 text-zinc-400"
                    )}>
                      {msg.role === "assistant" ? (
                        agentAvatar ? (
                          <img src={agentAvatar} alt={agentName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )
                      ) : <User className="h-5 w-5" />}
                    </div>
                    
                    <div className={cn(
                      "max-w-[80%] space-y-4",
                      msg.role === "user" ? "text-right" : "text-left"
                    )}>
                      <div className={cn(
                        "p-6 rounded-3xl border text-sm leading-relaxed",
                        msg.role === "assistant" 
                          ? "bg-white/5 border-white/10 text-zinc-300" 
                          : "bg-blue-600 text-white border-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.2)]"
                      )}>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>

                      {msg.sources && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.sources.map((url, i) => (
                            <a 
                              key={i} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-zinc-500 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                            >
                              <Search className="h-2.5 w-2.5" />
                              Source {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-6"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 overflow-hidden">
                    {agentAvatar ? (
                      <img src={agentAvatar} alt={agentName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )}
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Zap className="h-4 w-4 text-blue-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Analyzing your biological profile...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative">
              <div className="p-2 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-2 focus-within:border-blue-500/50 transition-all shadow-2xl">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <FileText className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleListening}
                  className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your biological data, risks, or optimizations..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white px-6 py-4 placeholder:text-zinc-600"
                />
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !attachedFile) || isLoading}
                  className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Digital Twin Sync", icon: Brain, color: "text-blue-400" },
                  { label: "Genomic Risk", icon: Dna, color: "text-indigo-400" },
                  { label: "Biomarker Trends", icon: Activity, color: "text-emerald-400" }
                ].map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(action.label)}
                    className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                  >
                    <action.icon className={cn("h-4 w-4", action.color)} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white">{action.label}</span>
                    <ArrowRight className="h-3 w-3 text-zinc-700 group-hover:text-white ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : activeTab === "emergency" ? (
          <motion.div
            key="emergency"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-y-auto pr-4 custom-scrollbar"
          >
            {/* Monitoring Status */}
            <div className="lg:col-span-4 space-y-8">
              <div className={cn(
                "p-10 rounded-[3rem] border transition-all duration-500 relative overflow-hidden group",
                isMonitoring 
                  ? "bg-emerald-500/10 border-emerald-500/20" 
                  : "bg-zinc-900 border-white/10"
              )}>
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                  <Siren className={cn("h-32 w-32", isMonitoring ? "text-emerald-500" : "text-zinc-500")} />
                </div>
                
                <div className="relative z-10">
                  <div className={cn(
                    "h-16 w-16 rounded-2xl flex items-center justify-center mb-8",
                    isMonitoring ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-zinc-800 text-zinc-500"
                  )}>
                    <Activity className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic serif mb-2">
                    {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-10">
                    {isMonitoring 
                      ? "Real-time biomarker streams are being analyzed for critical anomalies." 
                      : "Biomarker monitoring is currently inactive. Alerts will not be triggered."}
                  </p>
                  
                  <Button 
                    onClick={toggleMonitoring}
                    className={cn(
                      "w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                      isMonitoring 
                        ? "bg-white text-black hover:bg-zinc-200" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {isMonitoring ? "Pause Monitoring" : "Activate Guardian"}
                  </Button>
                </div>
              </div>

              <Card className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/5">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Alert Protocols
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  {[
                    { label: "Cardiac Anomaly", action: "Immediate Alert", color: "text-red-500" },
                    { label: "Glucose Spikes", action: "Relative Notify", color: "text-amber-500" },
                    { label: "Fall Detection", action: "Emergency Services", color: "text-red-500" },
                    { label: "Sleep Apnea Event", action: "Morning Report", color: "text-blue-500" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest", item.color)}>{item.action}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Emergency Contacts */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-4">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Emergency Guardians</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Designated contacts to be notified during critical events</p>
                </div>
                <Button className="bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl h-10 px-6 text-[9px] font-black uppercase tracking-widest">
                  <Plus className="h-3 w-3 mr-2" /> Add Guardian
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] group hover:bg-white/5 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400">
                        <Users className="h-6 w-6" />
                      </div>
                      <Button 
                        onClick={() => removeContact(contact.id)}
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">{contact.name}</h4>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">{contact.relation}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-zinc-400">
                        <Phone className="h-3 w-3" />
                        <span className="text-[10px] font-mono">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400">
                        <Mail className="h-3 w-3" />
                        <span className="text-[10px] font-mono">{contact.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {contact.notifyVia.map(method => (
                        <span key={method} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-zinc-400">
                          {method === "text" && <Smartphone className="h-3 w-3 inline mr-1" />}
                          {method === "email" && <Mail className="h-3 w-3 inline mr-1" />}
                          {method === "app" && <Bell className="h-3 w-3 inline mr-1" />}
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Card className="bg-blue-600/10 border-blue-600/20 rounded-[2.5rem] p-10">
                <div className="flex items-start gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif mb-2">Automated Alert System</h3>
                    <p className="text-[10px] font-bold text-blue-100/70 uppercase tracking-widest leading-relaxed">
                      In the event of a critical biomarker anomaly, the Emergency Agent will automatically trigger notifications to all guardians. 
                      If no response is received within 120 seconds, local emergency services will be contacted with your GPS coordinates and biological summary.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto w-full space-y-8"
          >
            <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-2xl font-black tracking-tighter uppercase italic serif">Agent Configuration</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customize your biological intelligence interface</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Agent Identity</Label>
                  <Input 
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter agent name..."
                    className="bg-white/5 border-white/10 rounded-2xl h-14 text-sm font-bold tracking-tight"
                  />
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">This name will be used across all AI interactions.</p>
                </div>

                <div className="space-y-6">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Vocal Synthesis Profile</Label>
                  <RadioGroup 
                    value={agentVoice} 
                    onValueChange={(val: any) => setAgentVoice(val)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className={cn(
                      "flex items-center space-x-4 p-6 rounded-2xl border transition-all cursor-pointer",
                      agentVoice === "Female" ? "bg-blue-600/10 border-blue-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"
                    )} onClick={() => setAgentVoice("Female")}>
                      <RadioGroupItem value="Female" id="female" className="border-white/20 text-blue-500" />
                      <div className="flex flex-col">
                        <Label htmlFor="female" className="text-sm font-black uppercase tracking-widest cursor-pointer">Female (Kore)</Label>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Empathetic & Clear</span>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center space-x-4 p-6 rounded-2xl border transition-all cursor-pointer",
                      agentVoice === "Male" ? "bg-blue-600/10 border-blue-500/50" : "bg-white/5 border-white/10 hover:bg-white/10"
                    )} onClick={() => setAgentVoice("Male")}>
                      <RadioGroupItem value="Male" id="male" className="border-white/20 text-blue-500" />
                      <div className="flex flex-col">
                        <Label htmlFor="male" className="text-sm font-black uppercase tracking-widest cursor-pointer">Male (Zephyr)</Label>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Professional & Authoritative</span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">Privacy Protocol</p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">End-to-end encrypted sync</p>
                    </div>
                  </div>
                  <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest" onClick={() => toast.success("Settings saved successfully")}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
