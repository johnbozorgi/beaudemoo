import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Upload, File, Search, Filter, Dna, Activity, Database, ChevronRight, 
  MoreVertical, ShieldCheck, ArrowUpRight, Droplets, Utensils, Smartphone, 
  Stethoscope, Users, PawPrint, Trash2, Edit2, Share2, Plus, CreditCard,
  HardDrive, Info, CheckCircle2, X, User, Globe, Shield, Lock, ScanFace, Save,
  Scale, Ruler, Heart, Zap, FileUp, Camera, FlaskConical, Eye, EyeOff,
  Pill, Brain, Droplets as Water, Coffee, Apple, ShoppingCart, Ticket,
  Wind, Sun, Thermometer, Volume2, ShieldAlert, Plane, Target, Bell, BellOff,
  Calendar, Camera as CameraIcon, Image as ImageIcon, ArrowRight, Bot
} from "lucide-react";
import { ExplainabilityPanel } from "@/components/ExplainabilityPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "@/context/DashboardContext";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FaceIdModal } from "@/components/FaceIdModal";
import { toast } from "sonner";
import AIAgentPopup from "@/components/AIAgentPopup";
import { BioDigitalIdentity, UnitSystem, Symptom } from "../types";

interface DataRecord {
  id: string;
  title: string;
  date: string;
  type: string;
  category: string;
  size: string;
  status: "verified" | "pending" | "shared";
}

export default function DataBank() {
  const navigate = useNavigate();
  const { activeContext, setGender } = useDashboard();
  const { addNotification } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBuySpaceOpen, setIsBuySpaceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("records");

  const [isLogSymptomOpen, setIsLogSymptomOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [aiInitialMessage, setAiInitialMessage] = useState("");
  const [newSymptom, setNewSymptom] = useState<Partial<Symptom>>({
    name: "",
    severity: "Low",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  // Symptoms State
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: "1", name: "Headache", severity: "Medium", date: "2025-11-20", notes: "Occurs in the afternoon" },
    { id: "2", name: "Fatigue", severity: "Low", date: "2025-11-18", notes: "After workout" }
  ]);

  // Bio-Digital Identity State
  const [isVerified, setIsVerified] = useState(false);
  const [showFaceId, setShowFaceId] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("Imperial");
  const [activeBioCategory, setActiveBioCategory] = useState<string>("core");

  const convertHeight = (cm: number) => {
    if (unitSystem === "Metric") return `${cm} cm`;
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  const convertWeight = (kg: number) => {
    if (unitSystem === "Metric") return `${kg} kg`;
    return `${Math.round(kg * 2.20462)} lbs`;
  };

  const [bioData, setBioData] = useState<BioDigitalIdentity>({
    identity: {
      firstName: "David",
      lastName: "Houshang",
      age: 32,
      gender: "Male",
      genderIdentity: "Male",
      ethnicity: "Middle Eastern",
      eyeColor: "Brown",
      occupation: "Bio-Engineer",
      dateOfBirth: "1994-03-28",
      bloodType: "O+",
    },
    contact: {
      address: "123 Bio Lane",
      city: "San Francisco",
      country: "USA",
      phone: "+1 (555) 000-1234",
      email: "houshangidavid@gmail.com",
    },
    medicalHistory: {
      diagnosedConditions: ["Mild Asthma"],
      surgeries: ["Appendectomy (2010)"],
      hospitalizations: ["None recent"],
      allergies: ["Pollen", "Dust Mites"],
      chronicDiseases: ["None"],
    },
    biological: {
      height: 182,
      weight: 78.5,
      eyeMovement: "Normal tracking, no saccadic intrusions",
      familyHistory: ["Type 2 Diabetes (Grandparent)", "Longevity (Maternal side)"],
      bloodType: "O+",
      geneticRiskMarkers: ["APOE4 Negative", "MTHFR Normal"],
    },
    lifestyle: {
      dietType: "Mediterranean / Intermittent Fasting",
      activityLevel: "Active",
      activity: {
        steps: 8500,
        exerciseType: "Weightlifting, HIIT",
        frequency: "4x per week",
      },
      sleep: {
        duration: 7.5,
        quality: "Good",
        circadianRhythm: "Early Bird",
      },
      nutrition: {
        dietType: "Mediterranean",
        foodLogs: ["Logged today"],
        hydration: 2.8,
      },
      habits: {
        smoking: "Never",
        alcohol: "Occasional",
        caffeine: "2 cups/day",
        drugUse: "None",
      },
      sleepHabits: "7.5 hours avg, consistent schedule",
      smokingStatus: "Never",
      alcoholUse: "Occasional (Social)",
      stressLevel: 4,
      hobbies: ["Biohacking", "Hiking", "AI Research"],
      socialLife: "Highly active, community focused",
    },
    behavioral: {
      wearableDevice: "Apple Watch Ultra 2",
      screenTime: "6.5 hours daily",
      dailyRoutines: ["Morning Sunlight", "Cold Plunge", "Evening Meditation"],
      engagementPatterns: "High morning focus, evening relaxation",
      digitalFootprint: "Health-focused, privacy-conscious",
    },
    cognitive: {
      personalityTraits: ["Openness", "Conscientiousness"],
      motivationType: "Intrinsic / Health-focused",
      healthMindset: "Preventive",
      riskTolerance: "Moderate",
      mentalWellbeing: "High resilience, regular mindfulness",
    },
    psychology: {
      stressLevels: 4,
      moodTracking: "Stable",
      anxietyDepressionHistory: "None",
      cognitivePerformance: "High",
      focusProductivity: "Optimal",
      emotionalRegulation: "Strong",
    },
    location: {
      currentLocation: "San Francisco, CA",
      airQualityExposure: "Moderate",
      uvExposure: "Low",
      temperature: "65°F",
      noise: "45dB",
      occupationalHazards: "None",
      travelPatterns: "Frequent domestic",
    },
    medicalDevices: {
      appleHealthGoogleFit: true,
      wearables: ["Apple Watch", "Oura Ring"],
      smartScales: "Withings Body Scan",
      labProviders: ["Quest Diagnostics", "Labcorp"],
      ehrIntegrations: ["MyChart", "Epic"],
    },
    healthGoals: {
      fitnessGoals: ["Increase VO2 Max", "Bench 225lb"],
      weightGoals: "Maintain 78kg",
      longevityGoals: ["Reduce biological age by 2 years"],
      diseasePreventionFocus: ["Cardiovascular health", "Metabolic health"],
      sleepOptimization: "Increase deep sleep by 15%",
      mentalHealthImprovement: "Daily meditation streak",
    },
    network: {
      linkedAccounts: ["Family Group A", "Research Study B"],
      relationships: ["Spouse", "Child (2)"],
      sharedRiskFactors: ["Environmental Exposure (Urban)"],
      householdEnvironment: "Smart Home / Air Purified",
      emergencyContact: "Sarah Houshang (+1 555-999-8888)",
    },
    privacy: {
      isPrivate: true,
      sharedWithFamily: true,
      sharedWithDoctors: true,
      usedForResearch: false,
    },
    research: {
      willingnessToJoinStudies: true,
      conditionsOfInterest: ["Longevity", "Metabolic Health"],
      locationForInPerson: "San Francisco Bay Area",
      compensationPreference: "Data Insights / Altruistic",
      dataDonation: true,
    },
  });
  
  const [records, setRecords] = useState<DataRecord[]>([
    { id: "1", title: "Comprehensive Metabolic Panel", date: "2025-10-12", type: "PDF Report", category: "Biomarkers", size: "2.4 MB", status: "verified" },
    { id: "2", title: "23andMe Raw DNA Data", date: "2025-09-05", type: "TXT File", category: "Genomics", size: "15.8 MB", status: "verified" },
    { id: "3", title: "Apple Watch Health Export Q3", date: "2025-10-01", type: "XML Data", category: "Lifestyle", size: "45.2 MB", status: "shared" },
    { id: "4", title: "Full Genome Sequence (WGS)", date: "2025-08-22", type: "FASTQ", category: "Genomics", size: "850 MB", status: "verified" },
    { id: "5", title: "Sleep Architecture Analysis", date: "2025-11-15", type: "JSON", category: "Lifestyle", size: "1.2 MB", status: "pending" },
  ]);

  const categories = [
    { label: "Demographics", icon: User, color: "blue", count: 0 },
    { label: "Genomics", icon: Dna, color: "purple", count: 2 },
    { label: "Proteomics", icon: Activity, color: "blue", count: 0 },
    { label: "Microbiome", icon: PawPrint, color: "emerald", count: 0 },
    { label: "Biomarkers", icon: Water, color: "red", count: 12, hasCamera: true },
    { label: "Device", icon: Smartphone, color: "amber", count: 8, hasCamera: true },
    { label: "Daily Data", icon: Apple, color: "emerald", count: 0, hasCamera: true },
    { label: "Medications", icon: Pill, color: "orange", count: 0, hasCamera: true },
    { label: "Psychological", icon: Brain, color: "pink", count: 0 },
    { label: "Clinical", icon: Stethoscope, color: "blue", count: 15, hasCamera: true },
    { label: "Symptoms", icon: Activity, color: "orange", count: 0, hasCamera: true }
  ];

  const bioCategories = [
    { id: "core", name: "Demographics", icon: User, color: "text-blue-500" },
    { id: "medicalHistory", name: "Medical History", icon: Stethoscope, color: "text-red-500" },
    { id: "biological", name: "Biological", icon: Activity, color: "text-emerald-500" },
    { id: "device", name: "Device", icon: Smartphone, color: "text-amber-500" },
    { id: "psychology", name: "Psychology", icon: Brain, color: "text-pink-500" },
    { id: "location", name: "Location", icon: Globe, color: "text-blue-400" },
    { id: "medicalDevices", name: "Medical Devices", icon: Smartphone, color: "text-purple-500" },
    { id: "healthGoals", name: "Health Goals", icon: Target, color: "text-orange-500" },
    { id: "privacy", name: "Privacy", icon: ShieldCheck, color: "text-zinc-500" },
  ];

  const filteredRecords = selectedCategory === "All" 
    ? records 
    : records.filter(r => r.category === selectedCategory);

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };
  
  const getContextTitle = () => {
    switch (activeContext) {
      case "family": return "Family Health Data Hub";
      default: return "Health Data Hub";
    }
  };

  const handleBioSave = () => {
    toast.success("Bio-Digital Identity updated successfully!");
    addNotification({
      title: "Identity Updated",
      message: "Your biographic profile has been synchronized with your Digital Twin.",
      type: "success"
    });
  };

  return (
    <div className="space-y-10 pb-12">
      <FaceIdModal 
        isOpen={showFaceId} 
        onClose={() => setShowFaceId(false)} 
        onSuccess={() => {
          setIsVerified(true);
          setShowFaceId(false);
          toast.success("Identity Verified");
        }} 
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Unified Health Management</h2>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic serif">{getContextTitle()}</h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-[10px]">Manage all your biological telemetry and identity in one place</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="records"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-10"
        >
            {/* Category Navigation - Grid instead of scroll */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <button 
                onClick={() => setSelectedCategory("All")}
                className={cn(
                  "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                  selectedCategory === "All" ? "bg-white text-black border-white" : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10"
                )}
              >
                All Records
              </button>
              {categories.map((cat) => (
                <div key={cat.label} className="relative">
                  <button 
                    onClick={() => {
                      setSelectedCategory(cat.label);
                      setAiInitialMessage(`Tell me about ${cat.label} and how it can help me optimize my health.`);
                      setAiContext(`The user is exploring the ${cat.label} section of their Health Data Bank. Explain the importance of ${cat.label} data in personalized medicine and longevity.`);
                    }}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap flex items-center gap-3",
                      selectedCategory === cat.label 
                        ? `bg-${cat.color}-600 text-white border-${cat.color}-600 shadow-lg shadow-${cat.color}-600/20` 
                        : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label}
                    <span className="ml-auto px-2 py-0.5 bg-black/20 rounded-md font-mono">{cat.count}</span>
                  </button>

                  {selectedCategory === cat.label && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 z-50"
                    >
                      <Button
                        onClick={() => setIsAIOpen(true)}
                        className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/20 whitespace-nowrap flex items-center gap-2"
                      >
                        <Bot className="h-3 w-3" />
                        Ask AI agent about {cat.label}
                      </Button>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                {selectedCategory === "Demographics" && (
                  <Card className="bg-blue-600/10 border-blue-500/20 rounded-3xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Biological Demographics</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Manage your core physical and personal parameters</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                          <button 
                            onClick={() => setUnitSystem("Metric")}
                            className={cn(
                              "px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                              unitSystem === "Metric" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"
                            )}
                          >
                            Metric
                          </button>
                          <button 
                            onClick={() => setUnitSystem("Imperial")}
                            className={cn(
                              "px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                              unitSystem === "Imperial" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"
                            )}
                          >
                            Imperial
                          </button>
                        </div>
                        <Button onClick={handleBioSave} className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <Save className="h-4 w-4 mr-2" /> Save Changes
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">First Name</label>
                        <Input 
                          value={bioData.identity.firstName} 
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, firstName: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Last Name</label>
                        <Input 
                          value={bioData.identity.lastName} 
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, lastName: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Date of Birth</label>
                        <Input 
                          type="date"
                          value={bioData.identity.dateOfBirth} 
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, dateOfBirth: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Height ({unitSystem === "Metric" ? "cm" : "inches"})</label>
                        <Input 
                          type="number"
                          value={bioData.biological.height} 
                          onChange={(e) => setBioData({...bioData, biological: {...bioData.biological, height: Number(e.target.value)}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Current: {convertHeight(bioData.biological.height)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Weight ({unitSystem === "Metric" ? "kg" : "lbs"})</label>
                        <Input 
                          type="number"
                          value={unitSystem === "Metric" ? bioData.biological.weight : Math.round(bioData.biological.weight * 2.20462)} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const kg = unitSystem === "Metric" ? val : val / 2.20462;
                            setBioData({...bioData, biological: {...bioData.biological, weight: kg}});
                          }}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Current: {convertWeight(bioData.biological.weight)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Blood Type</label>
                        <select 
                          value={bioData.identity.bloodType}
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, bloodType: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 h-12 rounded-xl text-white px-4 text-[10px] font-bold uppercase tracking-widest outline-none"
                        >
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Eye Color</label>
                        <Input 
                          value={bioData.identity.eyeColor} 
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, eyeColor: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Biological Sex</label>
                        <select 
                          value={bioData.identity.gender}
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, gender: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 h-12 rounded-xl text-white px-4 text-[10px] font-bold uppercase tracking-widest outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Ethnicity</label>
                        <Input 
                          value={bioData.identity.ethnicity} 
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, ethnicity: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Occupation</label>
                        <Input 
                          value={bioData.identity.occupation} 
                          onChange={(e) => setBioData({...bioData, identity: {...bioData.identity, occupation: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                        <Input 
                          value={bioData.contact.phone} 
                          onChange={(e) => setBioData({...bioData, contact: {...bioData.contact, phone: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                        <Input 
                          value={bioData.contact.email} 
                          onChange={(e) => setBioData({...bioData, contact: {...bioData.contact, email: e.target.value}})}
                          className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {selectedCategory === "Genomics" && (
                  <Card className="bg-purple-600/10 border-purple-500/20 rounded-3xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                          <ShoppingCart className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">DNA Kit Purchase</h3>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Unlock your full genomic potential</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white font-mono">$199</p>
                        <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">Special Offer</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input placeholder="PROMO CODE" className="pl-10 bg-black/40 border-white/10 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest" />
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Order Kit
                      </Button>
                    </div>
                  </Card>
                )}

                {selectedCategory === "Proteomics" && (
                  <Card className="bg-blue-600/10 border-blue-500/20 rounded-3xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                          <FlaskConical className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">Proteomic Test Request</h3>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Analyze your protein expression</p>
                        </div>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Request Kit
                      </Button>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Latest Results</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase">Inflammation Markers</span>
                        <span className="text-xs font-mono text-emerald-400">Normal</span>
                      </div>
                    </div>
                  </Card>
                )}

                {selectedCategory === "Microbiome" && (
                  <Card className="bg-emerald-600/10 border-emerald-500/20 rounded-3xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                          <PawPrint className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">Microbiome Sequencing</h3>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Map your gut and skin microbiome</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest h-12 px-6">
                          <Upload className="h-4 w-4 mr-2" /> Upload Results
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          Order Kit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input placeholder="PROMO CODE" className="pl-10 bg-black/40 border-white/10 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest" />
                        </div>
                        <Button variant="ghost" className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300">
                          Apply
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                          Microbiome data provides insights into your metabolic health, immune function, and mental wellbeing through the gut-brain axis.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {selectedCategory === "Device" && (
                  <Card className="bg-amber-600/10 border-amber-500/20 rounded-3xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Medical Device Integration</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Pair and sync your medical hardware via Bluetooth</p>
                      </div>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <Zap className="h-4 w-4 mr-2" /> Scan for Devices
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                            <Smartphone className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Apple Watch Ultra 2</h4>
                            <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Connected • Last sync 2m ago</p>
                          </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                            <Activity className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Oura Ring Gen 3</h4>
                            <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Connected • Last sync 1h ago</p>
                          </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all cursor-pointer group">
                        <Plus className="h-6 w-6 text-zinc-500 group-hover:text-white transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Pair New Device</span>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-amber-600/5 border border-amber-500/10 rounded-[2.5rem]">
                      <div className="flex items-center gap-4 mb-4">
                        <Info className="h-5 w-5 text-amber-500" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Bluetooth Pairing Instructions</h4>
                      </div>
                      <ol className="space-y-3 text-[9px] font-bold text-zinc-500 uppercase tracking-widest list-decimal pl-4">
                        <li>Ensure your medical device is in pairing mode.</li>
                        <li>Enable Bluetooth on your smartphone or computer.</li>
                        <li>Select "Scan for Devices" above to find your hardware.</li>
                        <li>Follow the on-screen prompts to complete the secure handshake.</li>
                      </ol>
                    </div>
                  </Card>
                )}

                {selectedCategory === "Daily Data" && (
                  <Card className="bg-emerald-600/10 border-emerald-500/20 rounded-3xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Daily Health Logging</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Capture your daily biological states and intake</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest h-12 px-6">
                          <CameraIcon className="h-4 w-4 mr-2" /> AI Vision Log
                        </Button>
                        <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest h-12 px-6">
                          <Plus className="h-4 w-4 mr-2" /> Custom Entry
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Food Intake */}
                      <div className="space-y-4 p-6 bg-black/40 rounded-[2rem] border border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                          <Utensils className="h-3 w-3" /> Food Intake
                        </label>
                        <div className="flex gap-2">
                          <Input type="number" placeholder="Calories (kcal)" className="bg-white/5 border-white/10 h-12 rounded-xl flex-1 text-xs" />
                          <Button variant="outline" className="h-12 w-12 border-white/10 bg-white/5 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                            <CameraIcon className="h-5 w-5 text-emerald-400" />
                          </Button>
                        </div>
                        <p className="text-[8px] text-zinc-600 uppercase font-bold leading-relaxed">
                          Take a photo for <span className="text-emerald-500">AI Calorie Measurement</span> or enter manually.
                        </p>
                      </div>

                      {/* Hydration */}
                      <div className="space-y-4 p-6 bg-black/40 rounded-[2rem] border border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                          <Water className="h-3 w-3" /> Hydration
                        </label>
                        <div className="flex gap-2">
                          <Input type="number" step="0.1" placeholder="Liters (L)" className="bg-white/5 border-white/10 h-12 rounded-xl flex-1 text-xs" />
                          <Button variant="outline" className="h-12 w-12 border-white/10 bg-white/5 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 transition-all">
                            <Plus className="h-5 w-5 text-blue-400" />
                          </Button>
                        </div>
                        <p className="text-[8px] text-zinc-600 uppercase font-bold leading-relaxed">
                          Track your daily water intake for metabolic optimization.
                        </p>
                      </div>

                      {/* Custom Metric */}
                      <div className="space-y-4 p-6 bg-black/40 rounded-[2rem] border border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                          <Zap className="h-3 w-3" /> Custom Metric
                        </label>
                        <div className="flex gap-2">
                          <Input placeholder="Metric Name" className="bg-white/5 border-white/10 h-12 rounded-xl flex-1 text-[10px] uppercase font-bold" />
                          <Input type="number" placeholder="Val" className="bg-white/5 border-white/10 h-12 w-20 rounded-xl text-xs" />
                        </div>
                        <p className="text-[8px] text-zinc-600 uppercase font-bold leading-relaxed">
                          Add any specific biological or lifestyle parameter you track.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-black/40 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity className="h-3 w-3 text-emerald-500" />
                        Biological States
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { label: "Fasted", icon: "🌙" },
                          { label: "Post-Workout", icon: "💪" },
                          { label: "Stressed", icon: "⚡" },
                          { label: "Energetic", icon: "🔥" },
                          { label: "Fatigued", icon: "💤" },
                          { label: "Deep Focus", icon: "🧠" },
                          { label: "Relaxed", icon: "🌊" }
                        ].map(state => (
                          <button 
                            key={state.label} 
                            className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex items-center gap-2"
                          >
                            <span>{state.icon}</span>
                            {state.label}
                          </button>
                        ))}
                        <button className="px-5 py-3 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white hover:border-white/30 transition-all">
                          + Add State
                        </button>
                      </div>
                    </div>

                    <Button className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                      Synchronize Daily Telemetry
                    </Button>
                  </Card>
                )}

                {selectedCategory === "Medications" && (
                  <Card className="bg-orange-600/10 border-orange-500/20 rounded-3xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Medication Management</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Track prescriptions, supplements, and adherence</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest h-12 px-6">
                          <CameraIcon className="h-4 w-4 mr-2" /> Scan Medication
                        </Button>
                        <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest h-12 px-6">
                          <Plus className="h-4 w-4 mr-2" /> Add Manually
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 group hover:bg-white/5 transition-all">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
                              <Pill className="h-8 w-8 text-orange-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-white uppercase tracking-tighter">Vitamin D3 + K2</h4>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">5000 IU - Daily at 08:00 AM</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-12 w-12 text-zinc-600 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                              <CameraIcon className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-12 w-12 text-zinc-600 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                              <Edit2 className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-12 w-12 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-8">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Bell className="h-3 w-3" /> Reminders
                              </span>
                              <div className="h-6 w-12 bg-orange-600 rounded-full relative cursor-pointer">
                                <div className="h-4 w-4 bg-white rounded-full absolute right-1 top-1" />
                              </div>
                            </div>
                            <p className="text-[8px] text-zinc-600 font-bold uppercase">Push notifications active for this dosage.</p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Users className="h-3 w-3" /> Notify Family
                              </span>
                              <div className="h-6 w-12 bg-white/10 rounded-full relative cursor-pointer">
                                <div className="h-4 w-4 bg-white/40 rounded-full absolute left-1 top-1" />
                              </div>
                            </div>
                            <p className="text-[8px] text-zinc-600 font-bold uppercase">Alert family if dosage is missed.</p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Stethoscope className="h-3 w-3" /> Notify Doctor
                              </span>
                              <div className="h-6 w-12 bg-white/10 rounded-full relative cursor-pointer">
                                <div className="h-4 w-4 bg-white/40 rounded-full absolute left-1 top-1" />
                              </div>
                            </div>
                            <Button variant="ghost" className="w-full h-4 text-[8px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 p-0 justify-end">
                              Select Recipients <ChevronRight className="h-2 w-2 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {selectedCategory === "Psychological" && (
                  <Card className="bg-pink-600/10 border-pink-500/20 rounded-3xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Psychological Assessments</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Monitor your mental wellbeing and cognitive performance</p>
                      </div>
                      <Button 
                        onClick={() => navigate("/doctors-appointments")}
                        variant="outline" 
                        className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest h-12 px-6"
                      >
                        <Calendar className="h-4 w-4 mr-2" /> Book Professional
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: "Anxiety Test", icon: Brain, color: "text-blue-400" },
                        { label: "Stress Test", icon: Activity, color: "text-emerald-400" },
                        { label: "Depression Test", icon: Zap, color: "text-amber-400" }
                      ].map(test => (
                        <Button key={test.label} variant="outline" className="h-32 border-white/10 bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/30 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all group">
                          <test.icon className={cn("h-8 w-8 transition-transform group-hover:scale-110", test.color)} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">{test.label}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="mt-10 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 text-center">
                      <h4 className="text-sm font-black text-white uppercase tracking-tighter mb-2">Need Professional Support?</h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed mb-6">
                        If you're feeling overwhelmed, our network of licensed psychologists and psychotherapists is available 24/7.
                      </p>
                      <Button 
                        onClick={() => window.open("https://www.betterhelp.com", "_blank")}
                        className="bg-pink-600 hover:bg-pink-700 text-white h-12 px-10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-600/20"
                      >
                        Connect with Professional Help
                      </Button>
                    </div>
                  </Card>
                )}

                {selectedCategory === "Symptoms" && (
                  <Card className="bg-orange-600/10 border-orange-500/20 rounded-3xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic serif">Symptom Tracking</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Log and monitor biological anomalies and sensations</p>
                      </div>
                      <Button 
                        onClick={() => setIsLogSymptomOpen(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Log Symptom
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {symptoms.map((symptom) => (
                        <div key={symptom.id} className="p-6 bg-black/40 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-6">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center border",
                              symptom.severity === "High" ? "bg-red-500/20 border-red-500/30 text-red-400" :
                              symptom.severity === "Medium" ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                              "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                            )}>
                              <Activity className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-widest">{symptom.name}</h4>
                              <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{symptom.date} • {symptom.severity} Severity</p>
                              <p className="text-[10px] text-zinc-400 mt-1">{symptom.notes}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                    {selectedCategory} Archive
                  </h3>
                  <Button 
                    onClick={() => setIsUploadOpen(true)}
                    className="h-10 px-6 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2"
                  >
                    <Upload className="h-3 w-3" /> Ingest Data
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div 
                      key={record.id}
                      className="group bg-black/40 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                          <File className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">{record.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{record.date}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-700" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{record.type}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-700" />
                            <span className="text-[10px] font-mono text-blue-400">{record.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-white hover:bg-white/5 rounded-xl">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-white hover:bg-white/5 rounded-xl">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(record.id)} variant="ghost" size="icon" className="h-10 w-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-white/5 bg-white/5">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <HardDrive className="h-4 w-4 text-blue-500" />
                      Storage Ecosystem
                    </h3>
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Usage Intensity</span>
                        <span className="text-xl font-black text-white font-mono">1.2 GB <span className="text-zinc-600 text-xs">/ 10 GB</span></span>
                      </div>
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full w-[12%]" />
                      </div>
                    </div>
                    <Button onClick={() => setIsBuySpaceOpen(true)} className="w-full h-12 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all">
                      Buy More Space
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </AnimatePresence>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic serif">Ingest Biological Data</DialogTitle>
          </DialogHeader>
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 group hover:bg-white/10 transition-all cursor-pointer">
            <div className="h-16 w-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-widest">Drop files here</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-mono">PDF, CSV, FASTQ, XML</p>
          </div>
          <DialogFooter className="mt-6">
            <Button 
              onClick={() => {
                setIsUploadOpen(false);
                addNotification({
                  title: "Biological Data Ingested",
                  message: "Your new data record has been successfully uploaded and is currently being processed by the AI engine.",
                  type: "success"
                });
              }}
              className="w-full bg-blue-600 text-white h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest"
            >
              Process Ingestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Space Dialog */}
      <Dialog open={isBuySpaceOpen} onOpenChange={setIsBuySpaceOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic serif">Expand Archive</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-6">
            {[
              { label: "100 GB", price: "$4.99/mo", desc: "Standard Bio-Archive" },
              { label: "1 TB", price: "$19.99/mo", desc: "Pro Genomic Storage" },
              { label: "Unlimited", price: "$49.99/mo", desc: "Full Biological Mirror" }
            ].map((plan, i) => (
              <button key={i} className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group">
                <div className="text-left">
                  <p className="text-lg font-black text-white uppercase tracking-tighter">{plan.label}</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{plan.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-blue-400 font-mono">{plan.price}</p>
                  <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">Select Plan</span>
                </div>
              </button>
            ))}
          </div>
          <Button 
            onClick={() => {
              setIsBuySpaceOpen(false);
              addNotification({
                title: "Storage Ecosystem Expanded",
                message: "Your biological archive capacity has been increased.",
                type: "success"
              });
            }}
            className="w-full h-14 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <CreditCard className="h-4 w-4" />
            Proceed to Payment
          </Button>
        </DialogContent>
      </Dialog>

      {/* Log Symptom Dialog */}
      <Dialog open={isLogSymptomOpen} onOpenChange={setIsLogSymptomOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic serif mb-2">Log New Symptom</DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Record a new biological anomaly for tracking and analysis.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Symptom Name</Label>
              <Input 
                value={newSymptom.name}
                onChange={(e) => setNewSymptom({...newSymptom, name: e.target.value})}
                placeholder="e.g. Migraine, Joint Pain..." 
                className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Severity</Label>
                <select 
                  value={newSymptom.severity}
                  onChange={(e) => setNewSymptom({...newSymptom, severity: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 h-12 rounded-xl text-white px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-orange-500/50"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Date</Label>
                <Input 
                  type="date"
                  value={newSymptom.date}
                  onChange={(e) => setNewSymptom({...newSymptom, date: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Notes</Label>
              <textarea 
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({...newSymptom, notes: e.target.value})}
                placeholder="Describe the sensation, duration, or triggers..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs min-h-[100px] outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button 
              onClick={() => {
                if (!newSymptom.name) {
                  toast.error("Please enter a symptom name");
                  return;
                }
                const symptomToAdd: Symptom = {
                  id: Math.random().toString(36).substr(2, 9),
                  name: newSymptom.name,
                  severity: newSymptom.severity as any,
                  date: newSymptom.date as string,
                  notes: newSymptom.notes
                };
                setSymptoms([symptomToAdd, ...symptoms]);
                setIsLogSymptomOpen(false);
                setNewSymptom({
                  name: "",
                  severity: "Low",
                  date: new Date().toISOString().split('T')[0],
                  notes: ""
                });
                toast.success("Symptom logged successfully");
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Log Symptom
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Add Data Button */}
      <div className="fixed bottom-10 right-44 z-[60]">
        <Dialog>
          <DialogTrigger
            render={
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-14 w-14 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center justify-center group relative"
              >
                <Plus className="h-6 w-6" />
                <div className="absolute right-full mr-4 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Health Data</span>
                </div>
              </motion.button>
            }
          />
          <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2.5rem] p-8 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic serif mb-2">Ingest Biological Data</DialogTitle>
              <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Select the type of data stream you wish to add to your bio-mirror.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <FileUp className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Upload File</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <CameraIcon className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Take Photo</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <Edit2 className="h-6 w-6 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Manual Entry</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all group">
                <Smartphone className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Sync Device</span>
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Quick Note</Label>
              <Input placeholder="Describe this data point..." className="bg-white/5 border-white/10 h-12 rounded-xl text-xs" />
            </div>

            <DialogFooter className="mt-8">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Save to Data Bank
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <AIAgentPopup 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        initialMessage={aiInitialMessage}
        context={aiContext}
      />
    </div>
  );
}
