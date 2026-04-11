import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, FileText, CheckCircle2, ArrowRight, Shield, Info, AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNotifications } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "motion/react";

interface Study {
  id: string;
  title: string;
  institution: string;
  requirements: string[];
  reward: string;
  description: string;
  dataUsage: string;
  image: string;
  isEnrolled?: boolean;
}

const MOCK_STUDIES: Study[] = [
  {
    id: "study1",
    title: "Longevity & Metabolic Health Study",
    institution: "Stanford University Medical Center",
    requirements: ["DNA Data", "CGM Data", "Activity Levels"],
    reward: "$50 / month",
    description: "This study aims to understand the relationship between genetic markers and long-term metabolic health outcomes using real-time glucose monitoring.",
    dataUsage: "Your data will be anonymized and used solely for academic research. No PII will be shared with third parties.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800&h=400"
  },
  {
    id: "study2",
    title: "Sleep Architecture & Genetics",
    institution: "National Sleep Foundation",
    requirements: ["Wearable Sleep Data", "DNA Profile"],
    reward: "Free Premium Insights",
    description: "Investigating how specific genetic variants influence sleep cycles and overall cognitive recovery during rest.",
    dataUsage: "Aggregated sleep patterns will be analyzed to develop personalized sleep hygiene recommendations.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800&h=400"
  }
];

export default function Research() {
  const { addNotification } = useNotifications();
  const [studies, setStudies] = useState<Study[]>(MOCK_STUDIES);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleOptIn = () => {
    if (!selectedStudy || !agreedToTerms) return;
    
    setStudies(studies.map(s => 
      s.id === selectedStudy.id ? { ...s, isEnrolled: true } : s
    ));
    addNotification({
      title: "Research Enrollment Confirmed",
      message: `You have successfully opted into the "${selectedStudy.title}" study. Your data sharing is now active.`,
      type: "success"
    });
    setIsReviewOpen(false);
    setSelectedStudy(null);
    setAgreedToTerms(false);
  };

  const handleOptOut = (id: string) => {
    const study = studies.find(s => s.id === id);
    setStudies(studies.map(s => 
      s.id === id ? { ...s, isEnrolled: false } : s
    ));
    if (study) {
      addNotification({
        title: "Research Participation Revoked",
        message: `You have opted out of the "${study.title}" study. Data sharing for this study has been terminated.`,
        type: "info"
      });
    }
  };

  const enrolledStudies = studies.filter(s => s.isEnrolled);
  const availableStudies = studies.filter(s => !s.isEnrolled);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Research Participation</h1>
          <p className="text-slate-400">Contribute to science and earn rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-semibold text-slate-200">Available Studies</h3>
          
          <AnimatePresence mode="popLayout">
            {availableStudies.map((study) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className="bg-slate-900 border-slate-800 overflow-hidden group">
                  <div className="h-48 w-full overflow-hidden relative">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-800/50">
                          <Microscope className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-200">{study.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">{study.institution}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
                              Requires: {study.requirements.join(" + ")}
                            </Badge>
                            <Badge variant="outline" className="border-emerald-800/50 text-emerald-400 bg-emerald-900/10">
                              Reward: {study.reward}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedStudy(study);
                          setIsReviewOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                      >
                        Review & Opt-in
                      </Button>
                    </div>
                    
                    {study.id === "study1" && (
                      <div className="mt-6">
                        <ExplainabilityPanel 
                          title="Why were you matched?"
                          sources={["Age Demographic", "FTO Gene Variant", "Active CGM Connection"]}
                          method="Algorithmic matching of your anonymized profile against active clinical trial inclusion criteria."
                          recency="Matched today"
                          confidence="High"
                          interpretation="Researchers are specifically looking for individuals with your genetic metabolic profile who are actively tracking glucose to study long-term dietary interventions."
                          action="Review the informed consent document to understand data usage before participating."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {availableStudies.length === 0 && (
            <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
              <CheckCircle className="h-12 w-12 text-emerald-500/50 mx-auto mb-4" />
              <h3 className="text-slate-300 font-medium">You've reviewed all available studies</h3>
              <p className="text-slate-500 text-sm mt-1">Check back later for new research opportunities.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-slate-200">Active Participation</CardTitle>
              <CardDescription>Studies you are currently enrolled in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledStudies.length > 0 ? (
                enrolledStudies.map(study => (
                  <div key={study.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">{study.title}</h4>
                        <p className="text-xs text-slate-500">{study.institution}</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Enrolled</Badge>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-emerald-500 font-medium">{study.reward}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOptOut(study.id)}
                        className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <XCircle className="h-3 w-3 mr-1" /> Opt-out
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-400">You are not currently enrolled in any studies.</p>
                  <Button variant="link" className="mt-2 text-blue-400">Learn about data privacy <ArrowRight className="h-3 w-3 ml-1" /></Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Data Sovereignty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Your participation is 100% voluntary. You retain full ownership of your data and can revoke access at any time.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Anonymized Data Sharing
                </li>
                <li className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> End-to-End Encryption
                </li>
                <li className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Instant Opt-out Capability
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review & Opt-in Modal */}
      <Dialog open={isReviewOpen} onOpenChange={(open) => {
        setIsReviewOpen(open);
        if (!open) {
          setSelectedStudy(null);
          setAgreedToTerms(false);
        }
      }}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Microscope className="h-5 w-5 text-purple-500" />
              Study Review: {selectedStudy?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Please review the study details and data usage policy before opting in.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-300">Description</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {selectedStudy?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Data</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedStudy?.requirements.map(req => (
                    <Badge key={req} variant="secondary" className="bg-slate-800 text-slate-400 text-[10px]">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reward</h4>
                <p className="text-sm font-bold text-emerald-400">{selectedStudy?.reward}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Data Usage & Privacy
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedStudy?.dataUsage}
              </p>
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1 border-slate-700 data-[state=checked]:bg-blue-600"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  I have read and understood the informed consent document. I agree to share my anonymized data for the purposes of this study.
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)} className="border-slate-800 text-slate-400">
              Cancel
            </Button>
            <Button 
              disabled={!agreedToTerms}
              onClick={handleOptIn}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm & Opt-in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
