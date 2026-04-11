import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Maximize2, Minimize2, MessageSquare, 
  Sparkles, Send, Mic, Volume2, VolumeX,
  Move, GripHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AIAgentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  context?: string;
}

export default function AIAgentPopup({ isOpen, onClose, initialMessage, context }: AIAgentPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      setMessages([{ role: "model", text: initialMessage }]);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `${context ? `Context: ${context}\n\n` : ""}User: ${userMessage}` }] }
        ],
        config: {
          systemInstruction: "You are a helpful Health AI Agent. Provide concise, accurate health information. Always include a medical disclaimer."
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "model", text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "model", text: "Error connecting to AI service." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "fixed bottom-24 right-8 z-[100] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col transition-all duration-300",
            isExpanded ? "w-[600px] h-[700px]" : "w-[380px] h-[500px]"
          )}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between cursor-move">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Health AI Agent</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-zinc-500 hover:text-white rounded-lg"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-zinc-500 hover:text-white rounded-lg"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-zinc-500 hover:text-red-500 rounded-lg"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6" ref={scrollRef}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.role === "user" ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-[11px] font-bold leading-relaxed uppercase tracking-widest",
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white/5 text-zinc-300 border border-white/5 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-2">
                      {msg.role === "user" ? "You" : "AI Agent"} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-1 p-4 bg-white/5 rounded-2xl w-16">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your health agent..."
                className="h-14 bg-white/5 border-white/10 rounded-2xl pl-6 pr-24 text-[10px] font-black uppercase tracking-widest focus:ring-blue-500/50"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white rounded-xl">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
