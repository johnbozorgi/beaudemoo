import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExplainabilityPanelProps {
  title?: string;
  sources: string[];
  method: string;
  recency: string;
  confidence: 'Low' | 'Medium' | 'High' | 'Very High';
  interpretation: string;
  action?: string;
}

export function ExplainabilityPanel({
  title = "How this works",
  sources,
  method,
  recency,
  confidence,
  interpretation,
  action
}: ExplainabilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 text-sm border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 text-slate-300 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 text-slate-400 space-y-4 border-t border-slate-800/50 pt-3"
          >
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-slate-300 block mb-1">Data Sources:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                  {sources.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <strong className="text-slate-300 block mb-1">Method:</strong>
                <p className="text-slate-400">{method}</p>
              </div>
              <div>
                <strong className="text-slate-300 block mb-1">Recency:</strong>
                <p className="text-slate-400">{recency}</p>
              </div>
              <div>
                <strong className="text-slate-300 block mb-1">Confidence:</strong>
                <p className={
                  confidence === 'High' || confidence === 'Very High' ? 'text-emerald-400 font-medium' :
                  confidence === 'Medium' ? 'text-amber-400 font-medium' : 'text-red-400 font-medium'
                }>{confidence}</p>
              </div>
            </div>
            
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
              <strong className="text-slate-300 block mb-1 text-xs">Interpretation:</strong>
              <p className="text-xs leading-relaxed">{interpretation}</p>
            </div>
            
            {action && (
              <div className="bg-blue-950/20 p-3 rounded-lg border border-blue-900/30">
                <strong className="text-blue-400 block mb-1 text-xs">Recommended Action:</strong>
                <p className="text-xs text-blue-200 leading-relaxed">{action}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
