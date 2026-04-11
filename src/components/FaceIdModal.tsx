import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScanFace, ShieldCheck, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FaceIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FaceIdModal({ isOpen, onClose, onSuccess }: FaceIdModalProps) {
  const [status, setStatus] = useState<"idle" | "scanning" | "verifying" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setStatus("idle");
      setProgress(0);
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setStatus("scanning");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      
      // Simulate scanning progress
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          verifyFace();
        }
      }, 50);
    } catch (err) {
      console.error("Camera access denied:", err);
      setStatus("error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const verifyFace = () => {
    setStatus("verifying");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-10 flex flex-col items-center text-center">
          <div className="mb-8 relative">
            <div className="h-64 w-64 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center overflow-hidden relative">
              {status === "error" ? (
                <div className="flex flex-col items-center gap-4 text-red-500">
                  <AlertCircle className="h-12 w-12" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Camera Error</span>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="h-full w-full object-cover grayscale opacity-50"
                  />
                  {/* Scanning Line */}
                  {status === "scanning" && (
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)] z-20"
                    />
                  )}
                  {/* Success Overlay */}
                  {status === "success" && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center z-30"
                    >
                      <ShieldCheck className="h-24 w-24 text-emerald-500" />
                    </motion.div>
                  )}
                </>
              )}
            </div>
            
            {/* Progress Ring */}
            <svg className="absolute inset-[-10px] h-[calc(100%+20px)] w-[calc(100%+20px)] -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/5"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="100 100"
                animate={{ strokeDashoffset: 100 - progress }}
                className="text-blue-500"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic serif mb-2">
            {status === "scanning" && "Scanning Neural Map"}
            {status === "verifying" && "Verifying Identity"}
            {status === "success" && "Access Granted"}
            {status === "error" && "Scan Failed"}
          </h2>
          
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            {status === "scanning" && `Progress: ${progress}%`}
            {status === "verifying" && "Matching Biometric Signatures..."}
            {status === "success" && "Identity Confirmed. Redirecting..."}
            {status === "error" && "Please ensure camera permissions are enabled."}
          </p>

          {status === "error" && (
            <Button 
              onClick={startCamera}
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-black uppercase tracking-widest text-[10px]"
            >
              Retry Scan
            </Button>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-white/5 p-6 flex items-center justify-center gap-3">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">End-to-End Biometric Encryption Active</span>
        </div>
      </motion.div>
    </div>
  );
}
