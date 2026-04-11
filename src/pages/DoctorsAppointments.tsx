import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  Plus,
  CheckCircle2,
  CalendarDays,
  MessageSquare,
  Video,
  Phone,
  ShieldCheck,
  Share2,
  Globe,
  Lock,
  ExternalLink,
  Info,
  Bot,
  Activity,
  Heart,
  Star,
  Zap,
  FileText,
  Mail,
  Building2,
  ClipboardList,
  Car,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AIAgentPopup from "@/components/AIAgentPopup";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: "In-Person" | "Video" | "Chat";
  status: "Upcoming" | "Completed" | "Cancelled";
  location?: string;
  image: string;
  requirements?: string[];
  requestedData?: {
    type: "video" | "photo" | "file";
    label: string;
    description: string;
    isUploaded?: boolean;
  }[];
  accommodation?: {
    type: "Uber" | "Taxi Reimbursement";
    details: string;
  };
  parkingInfo?: string;
  checkInInstructions?: string;
  insuranceAccepted: boolean;
  rating?: number;
  comment?: string;
  bio?: string;
  education?: string[];
  languages?: string[];
  reviews?: {
    user: string;
    rating: number;
    text: string;
    date: string;
  }[];
  contact?: {
    phone: string;
    email: string;
    website: string;
  };
}

interface ProviderAccess {
  id: string;
  name: string;
  specialty: string;
  accessLevel: "Full" | "Read-Only" | "Emergency Only";
  expiryDate: string;
  status: "Active" | "Expired" | "Pending";
  image: string;
}

export default function DoctorsAppointments() {
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState("schedule");
  const [activeDetailsTab, setActiveDetailsTab] = useState("overview");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{ label: string; type: string } | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [aiInitialMessage, setAiInitialMessage] = useState("");

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "Dr. Sarah Chen",
      specialty: "Longevity Specialist",
      date: "2025-12-15",
      time: "09:00 AM",
      type: "Video",
      status: "Upcoming",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=200&h=200",
      requirements: [
        "Fast for 12 hours before the visit",
        "Complete the pre-visit metabolic survey",
        "Prepare a 7-day symptom and recovery summary",
      ],
      requestedData: [
        {
          type: "file",
          label: "Recent Blood Panel",
          description: "Upload your most recent comprehensive metabolic panel.",
        },
        {
          type: "file",
          label: "Sleep / Recovery Summary",
          description: "Upload your latest sleep trends, HRV, and resting heart rate report.",
        },
      ],
      insuranceAccepted: true,
      checkInInstructions: "Please log in to the portal 5 minutes before the call starts.",
      bio: "Dr. Sarah Chen is a world-renowned expert in cellular longevity and metabolic optimization. With over 15 years of experience in precision medicine, she focuses on extending healthspan through personalized biological interventions.",
      education: [
        "MD, Stanford University School of Medicine",
        "PhD in Molecular Biology, MIT",
        "Residency in Internal Medicine, Johns Hopkins",
      ],
      languages: ["English", "Mandarin", "French"],
      rating: 4.9,
      comment:
        "Your metabolic markers are trending in the right direction. I'd like to review your recent blood panel to confirm the cellular recovery rates we're seeing in the digital twin simulation.",
      reviews: [
        {
          user: "Alex M.",
          rating: 5,
          text: "Dr. Chen's approach to longevity is truly transformative. I've never felt better.",
          date: "2025-10-12",
        },
        {
          user: "Sarah L.",
          rating: 5,
          text: "Extremely thorough and insightful. She explains complex biological data in a way that's easy to understand.",
          date: "2025-11-05",
        },
      ],
      contact: {
        phone: "+1 (555) 123-4567",
        email: "dr.chen@precisionhealth.com",
        website: "www.drsarahchen.com",
      },
    },
    {
      id: "2",
      doctorName: "Dr. Marcus Thorne",
      specialty: "Precision Medicine",
      date: "2025-12-20",
      time: "02:00 PM",
      type: "In-Person",
      status: "Upcoming",
      location: "Precision Health Clinic, SF",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
      requirements: [
        "Bring all current supplements",
        "Wear comfortable clothing for a physical assessment",
        "Avoid caffeine 4 hours before the visit",
      ],
      requestedData: [
        {
          type: "photo",
          label: "Supplement Labels",
          description: "Take photos of the labels of all supplements you are currently taking.",
        },
        {
          type: "file",
          label: "Recent Lab Report",
          description: "Upload your last lipid panel, cortisol panel, or physician summary if available.",
        },
      ],
      accommodation: {
        type: "Uber",
        details: "Complimentary Uber ride provided to and from the clinic.",
      },
      parkingInfo: "Free valet parking available at the main entrance.",
      checkInInstructions: "Check in at the 3rd floor reception. Have your digital ID ready.",
      insuranceAccepted: true,
      bio: "Dr. Marcus Thorne specializes in multi-omic data integration for personalized health optimization. He is a pioneer in using real-time telemetry to guide clinical decisions.",
      education: ["MD, Harvard Medical School", "Fellowship in Genomic Medicine, UCSF"],
      languages: ["English", "Spanish"],
      rating: 4.8,
      comment:
        "Marcus, your recent telemetry shows a slight elevation in cortisol. Let's discuss your stress management protocols during our next visit. Please ensure you've uploaded the supplement labels as requested.",
      reviews: [
        {
          user: "James K.",
          rating: 5,
          text: "The clinic is state-of-the-art and Dr. Thorne is incredibly knowledgeable.",
          date: "2025-09-20",
        },
      ],
      contact: {
        phone: "+1 (555) 987-6543",
        email: "m.thorne@precisionhealth.com",
        website: "www.precisionhealthclinic.com",
      },
    },
  ]);

  const [providers, setProviders] = useState<ProviderAccess[]>([
    {
      id: "1",
      name: "Dr. Sarah Chen",
      specialty: "Longevity Specialist",
      accessLevel: "Full",
      expiryDate: "2026-12-31",
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      id: "2",
      name: "Dr. Elena Rodriguez",
      specialty: "Biological Dentist",
      accessLevel: "Read-Only",
      expiryDate: "2025-06-30",
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
    },
  ]);

  const handleBook = () => {
    setIsBookOpen(false);
    toast.success("Appointment booked successfully!");
    addNotification({
      title: "New Appointment",
      message: "Your consultation with Dr. Sarah Chen has been scheduled for Dec 15th.",
      type: "success",
    });
  };

  const handleRevoke = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
    toast.info("Provider access revoked");
  };

  const openAIForAppointment = (appointment: Appointment, isAutoPopup = false) => {
    setAiContext(
      `Doctor: ${appointment.doctorName}, Specialty: ${appointment.specialty}, Date: ${appointment.date}, Time: ${appointment.time}. Patient is reviewing appointment details.`
    );
    if (isAutoPopup) {
      setAiInitialMessage(
        `I see you're reviewing your appointment with ${appointment.doctorName}. I've analyzed your recent biological data and the doctor's notes. Would you like me to interpret the clinical notes or help you prepare for the visit?`
      );
    } else {
      setAiInitialMessage(
        `Help me prepare for my appointment with ${appointment.doctorName}. What should I ask and what should I upload before the visit?`
      );
    }
    setIsAIOpen(true);
  };

  const handleDetailsOpen = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDetailsOpen(true);
    setIsMinimized(false);

    // Auto-popup AI every time details are opened for a fresh interpretation
    setTimeout(() => {
      openAIForAppointment(apt, true);
    }, 1000);
  };

  const buildVisitChecklist = (appointment: Appointment) => {
    const checklist = [
      appointment.type === "Video"
        ? "Test camera, microphone, and internet connection"
        : "Plan arrival 10 minutes early",
      "Review your symptoms, goals, and recent changes",
      appointment.insuranceAccepted
        ? "Bring insurance card or keep digital insurance ready"
        : "Confirm payment method before the appointment",
      appointment.requestedData?.length
        ? "Upload or prepare all requested documents before the visit"
        : "Prepare any useful documents or questions before the visit",
    ];

    if (appointment.type === "In-Person") {
      checklist.push("Bring any current supplements, medications, or reports");
    }

    return checklist;
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col gap-6 border-b border-white/5 pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
            Clinical Management
          </h2>
          <h1 className="serif text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
            Doctor&apos;s Appointments
          </h1>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Schedule consultations and manage healthcare provider access
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          <TabsTrigger
            active={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            active={activeTab === "access"}
            onClick={() => setActiveTab("access")}
            className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Doctor Access
          </TabsTrigger>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "schedule" ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-12"
          >
            <div className="space-y-6 lg:col-span-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                  Upcoming Consultations
                </h3>
                <Button
                  onClick={() => setIsBookOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white/10"
                >
                  <Plus className="h-3 w-3" />
                  New Booking
                </Button>
              </div>

              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => handleDetailsOpen(apt)}
                    className="group flex cursor-pointer flex-col justify-between gap-6 rounded-[2.5rem] border border-white/10 bg-black/40 p-6 backdrop-blur-3xl transition-all hover:bg-white/5 md:flex-row md:items-center md:p-8"
                  >
                    <div className="flex items-center gap-5 md:gap-6">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 transition-all group-hover:border-blue-500/50 md:h-20 md:w-20">
                        <img
                          src={apt.image}
                          alt={apt.doctorName}
                          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div>
                        <h4 className="serif text-lg font-black uppercase italic tracking-tighter text-white md:text-xl">
                          {apt.doctorName}
                        </h4>
                        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-blue-400">
                          {apt.specialty}
                        </p>

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Calendar className="h-3.5 w-3.5" />
                            {apt.date}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Clock className="h-3.5 w-3.5" />
                            {apt.time}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                            {apt.type === "Video" ? (
                              <Video className="h-3.5 w-3.5" />
                            ) : apt.type === "Chat" ? (
                              <MessageSquare className="h-3.5 w-3.5" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5" />
                            )}
                            {apt.type}
                          </div>
                          {apt.insuranceAccepted && (
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Insurance Accepted
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAIForAppointment(apt);
                        }}
                        className="h-11 rounded-xl border border-blue-500/20 bg-blue-600/10 px-5 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600/20 md:h-12 md:px-6"
                      >
                        AI Health Assistant
                      </Button>

                      {apt.type === "Video" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Launching consultation room...");
                          }}
                          className="h-11 rounded-xl bg-white px-6 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200 md:h-12 md:px-8"
                        >
                          Join Call
                        </Button>
                      )}

                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl border border-white/5 text-zinc-600 hover:bg-white/5 hover:text-white md:h-12 md:w-12"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 lg:col-span-4">
              <Card className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 shadow-2xl backdrop-blur-3xl">
                <div className="border-b border-white/5 bg-white/5 p-8">
                  <h3 className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    <CalendarDays className="h-4 w-4 text-blue-500" />
                    Availability Stream
                  </h3>
                </div>

                <CardContent className="space-y-6 p-8">
                  <div className="mb-4 grid grid-cols-7 gap-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div
                        key={`${d}-${i}`}
                        className="text-center text-[8px] font-black uppercase tracking-widest text-zinc-700"
                      >
                        {d}
                      </div>
                    ))}

                    {Array.from({ length: 31 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex h-8 cursor-pointer items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                          i + 1 === 15
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "text-zinc-500 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-6">
                    <div className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">
                          AI Suggested Time
                        </p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                          Dec 18, 10:00 AM (Optimal Bio-Window)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-600/20">
                <h3 className="serif mb-4 text-xl font-black uppercase italic tracking-tighter">
                  Telehealth Ready
                </h3>
                <p className="mb-6 text-[10px] font-bold uppercase tracking-widest leading-relaxed text-blue-100">
                  Your browser is configured for high-fidelity video consultations. All calls are end-to-end encrypted.
                </p>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Secure Clinical Link
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="access"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between px-4">
              <div>
                <h3 className="serif text-xl font-black uppercase italic tracking-tighter text-white">
                  Authorized Providers
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Manage who can access your biological data streams
                </p>
              </div>

              <Button
                onClick={() => setIsShareOpen(true)}
                className="h-12 rounded-xl bg-blue-600 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              >
                <Share2 className="mr-2 h-4 w-4" />
                New Share Link
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="group rounded-[2.5rem] border border-white/10 bg-black/40 p-8 backdrop-blur-3xl transition-all hover:bg-white/5"
                >
                  <div className="mb-8 flex items-start justify-between">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/10 transition-all group-hover:border-blue-500/50">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      />
                    </div>

                    <div
                      className={cn(
                        "rounded-lg border px-3 py-1 text-[8px] font-black uppercase tracking-widest",
                        provider.status === "Active"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          : "border-amber-500/20 bg-amber-500/10 text-amber-500"
                      )}
                    >
                      {provider.status}
                    </div>
                  </div>

                  <h4 className="serif text-xl font-black uppercase italic tracking-tighter text-white">
                    {provider.name}
                  </h4>
                  <p className="mb-6 text-[10px] font-black uppercase tracking-widest text-blue-400">
                    {provider.specialty}
                  </p>

                  <div className="mb-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Access Level
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {provider.accessLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Expires On
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {provider.expiryDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        const mockApt =
                          appointments.find((a) => a.doctorName === provider.name) ||
                          ({
                            id: provider.id,
                            doctorName: provider.name,
                            specialty: provider.specialty,
                            image: provider.image,
                            date: "N/A",
                            time: "N/A",
                            type: "Video",
                            status: "Upcoming",
                            insuranceAccepted: true,
                            bio: `Dr. ${provider.name.split(" ").pop()} is a dedicated specialist in ${provider.specialty}.`,
                            education: ["MD, Top Medical School"],
                            languages: ["English"],
                            rating: 4.8,
                          } as Appointment);

                        setSelectedAppointment(mockApt);
                        setIsDetailsOpen(true);
                      }}
                      variant="outline"
                      className="h-12 flex-1 rounded-xl border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                    >
                      Profile
                    </Button>

                    <Button
                      variant="outline"
                      className="h-12 flex-1 rounded-xl border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                      onClick={() => toast.success("Modify access dialog coming next")}
                    >
                      Modify
                    </Button>

                    <Button
                      onClick={() => handleRevoke(provider.id)}
                      variant="ghost"
                      className="h-12 flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-500"
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Card className="rounded-[3rem] border border-white/10 bg-black/40 p-12 backdrop-blur-3xl">
              <CardContent className="grid grid-cols-1 gap-12 p-0 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">
                    Zero-Knowledge Sharing
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-500">
                    Providers only see the data you explicitly authorize. All sharing is time-bound and revocable at any moment.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">
                    HIPAA & GDPR Compliant
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-500">
                    Our infrastructure meets the highest global standards for medical data privacy and security.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/10 text-purple-400">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">
                    Audit Logs
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-500">
                    Every access event is logged on an immutable ledger for your review and security monitoring.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
        <DialogContent className="rounded-[2rem] border-white/10 bg-[#0a0a0a] p-8 text-white">
          <DialogHeader>
            <DialogTitle className="serif text-xl font-black uppercase italic tracking-tighter">
              New Booking
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Book your next consultation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input placeholder="Doctor or specialty" className="border-white/10 bg-white/5 text-white" />
            <Input placeholder="Preferred date" className="border-white/10 bg-white/5 text-white" />
            <Input placeholder="Preferred time" className="border-white/10 bg-white/5 text-white" />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookOpen(false)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button onClick={handleBook} className="bg-blue-600 text-white hover:bg-blue-700">
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="rounded-[2rem] border-white/10 bg-[#0a0a0a] p-8 text-white">
          <DialogHeader>
            <DialogTitle className="serif text-xl font-black uppercase italic tracking-tighter">
              Create Share Link
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Grant controlled provider access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input placeholder="Provider email" className="border-white/10 bg-white/5 text-white" />
            <Input placeholder="Access expiry date" className="border-white/10 bg-white/5 text-white" />
            <Input placeholder="Access level" className="border-white/10 bg-white/5 text-white" />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsShareOpen(false)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                toast.success("Secure share link created");
                setIsShareOpen(false);
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Generate Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDetailsOpen && !isMinimized}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setIsMinimized(false);
        }}
      >
        <DialogContent className="h-[92vh] w-[96vw] max-w-[1400px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] p-0 text-white sm:max-w-[96vw]">
          {selectedAppointment ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-white/5 bg-[#050505]/95 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex items-start gap-4 sm:gap-5">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[1.25rem] border border-blue-500/30 bg-white/5 sm:h-20 sm:w-20 sm:rounded-[1.5rem]">
                      <img
                        src={selectedAppointment.image}
                        alt={selectedAppointment.doctorName}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h2 className="serif line-clamp-2 text-xl font-black uppercase italic tracking-tighter sm:text-2xl lg:text-3xl">
                          {selectedAppointment.doctorName}
                        </h2>
                        <div className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-500">
                          <Heart className="h-3 w-3 fill-current" />
                          <span className="text-[10px] font-black">{selectedAppointment.rating}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 sm:text-[11px] sm:tracking-[0.25em]">
                        {selectedAppointment.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-3 lg:justify-end">
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <div
                        className={cn(
                          "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest sm:px-5",
                          selectedAppointment.status === "Upcoming"
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        )}
                      >
                        {selectedAppointment.status}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toast.success(`Calling ${selectedAppointment.doctorName}...`)}
                          className="h-9 w-9 rounded-xl border-white/10 bg-white/5 text-zinc-400 hover:text-white sm:h-10 sm:w-10"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toast.success(`Opening secure chat with ${selectedAppointment.doctorName}...`)}
                          className="h-9 w-9 rounded-xl border-white/10 bg-white/5 text-zinc-400 hover:text-white sm:h-10 sm:w-10"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toast.success("Launching high-fidelity video consultation room...")}
                          className="h-9 w-9 rounded-xl border-white/10 bg-white/5 text-zinc-400 hover:text-white sm:h-10 sm:w-10"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMinimized(true)}
                        className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
                      >
                        <div className="h-0.5 w-4 bg-current" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDetailsOpen(false)}
                        className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
                      >
                        <Plus className="h-5 w-5 rotate-45" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="grid h-full grid-cols-1 lg:grid-cols-12">
                  <div className="overflow-hidden border-b border-white/5 bg-white/[0.01] lg:col-span-4 lg:border-b-0 lg:border-r">
                    <div className="flex h-full flex-col">
                      <div className="border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4">
                        <div className="grid w-full grid-cols-4 rounded-2xl border border-white/10 bg-white/5 p-1">
                          <TabsTrigger active={activeDetailsTab === "overview"} onClick={() => setActiveDetailsTab("overview")} className="rounded-xl text-[9px] font-black uppercase tracking-widest sm:text-[10px]">
                            Overview
                          </TabsTrigger>
                          <TabsTrigger active={activeDetailsTab === "notes"} onClick={() => setActiveDetailsTab("notes")} className="rounded-xl text-[9px] font-black uppercase tracking-widest sm:text-[10px]">
                            Notes
                          </TabsTrigger>
                          <TabsTrigger active={activeDetailsTab === "reviews"} onClick={() => setActiveDetailsTab("reviews")} className="rounded-xl text-[9px] font-black uppercase tracking-widest sm:text-[10px]">
                            Reviews
                          </TabsTrigger>
                          <TabsTrigger active={activeDetailsTab === "contact"} onClick={() => setActiveDetailsTab("contact")} className="rounded-xl text-[9px] font-black uppercase tracking-widest sm:text-[10px]">
                            Contact
                          </TabsTrigger>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                        <TabsContent active={activeDetailsTab === "overview"} className="mt-0 space-y-6">
                          <div className="space-y-3">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                              <User className="h-4 w-4 text-blue-400" />
                              Professional Bio
                            </h3>
                            <p className="text-sm leading-relaxed text-zinc-400">
                              {selectedAppointment.bio || "No biography available."}
                            </p>
                          </div>

                          {selectedAppointment.education && (
                            <div className="space-y-3">
                              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                Education
                              </h3>
                              <div className="space-y-3">
                                {selectedAppointment.education.map((edu, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                    <p className="text-[11px] font-bold uppercase tracking-widest leading-tight text-zinc-300">
                                      {edu}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedAppointment.languages && (
                            <div className="space-y-3">
                              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                                <Globe className="h-4 w-4 text-purple-400" />
                                Languages
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedAppointment.languages.map((lang, i) => (
                                  <Badge
                                    key={i}
                                    className="border-white/10 bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-400"
                                  >
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-3">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                              <Sparkles className="h-4 w-4 text-amber-400" />
                              Visit Preparation
                            </h3>
                            <div className="space-y-3">
                              {buildVisitChecklist(selectedAppointment).map((item, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                                    <CheckCircle2 className="h-3 w-3" />
                                  </div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-300">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                          <TabsContent active={activeDetailsTab === "notes"} className="mt-0 space-y-4">
                          <div className="space-y-3 rounded-[1.5rem] border border-blue-500/20 bg-blue-600/5 p-5">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-400 sm:text-[11px] sm:tracking-[0.25em]">
                              <MessageSquare className="h-4 w-4" />
                              Doctor&apos;s Clinical Notes
                            </h3>
                            <p className="text-sm italic leading-relaxed text-blue-100/80">
                              {selectedAppointment.comment
                                ? `"${selectedAppointment.comment}"`
                                : "No clinical notes available."}
                            </p>
                          </div>

                          <div className="space-y-3 rounded-[1.5rem] border border-white/5 bg-white/5 p-5">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 sm:text-[11px] sm:tracking-[0.25em]">
                              <ClipboardList className="h-4 w-4 text-emerald-400" />
                              What This Visit Covers
                            </h3>
                            <ul className="space-y-3">
                              <li className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-400">
                                Review current symptoms, lab trends, and wearable data
                              </li>
                              <li className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-400">
                                Discuss physician recommendations and next-step testing
                              </li>
                              <li className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-400">
                                Align your care plan with goals, stress, recovery, and lifestyle metrics
                              </li>
                            </ul>
                          </div>
                        </TabsContent>

                          <TabsContent active={activeDetailsTab === "reviews"} className="mt-0 space-y-4">
                          {selectedAppointment.reviews?.length ? (
                            selectedAppointment.reviews.map((rev, i) => (
                              <div key={i} className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                    {rev.user}
                                  </span>
                                  <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                      <Star
                                        key={j}
                                        className={cn(
                                          "h-2.5 w-2.5",
                                          j < rev.rating ? "fill-current text-amber-500" : "text-zinc-700"
                                        )}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[10px] italic leading-relaxed text-zinc-500">
                                  &quot;{rev.text}&quot;
                                </p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700">
                                  {rev.date}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm text-zinc-500">
                              No reviews available.
                            </div>
                          )}
                        </TabsContent>

                          <TabsContent active={activeDetailsTab === "contact"} className="mt-0 space-y-4">
                          {selectedAppointment.contact ? (
                            <>
                              <div 
                                className="cursor-pointer space-y-3 rounded-[1.5rem] border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10"
                                onClick={() => toast.success(`Calling ${selectedAppointment.contact?.phone}...`)}
                              >
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 sm:text-[11px] sm:tracking-[0.25em]">
                                  <Phone className="h-4 w-4 text-blue-400" />
                                  Phone
                                </h3>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                                  {selectedAppointment.contact.phone}
                                </p>
                              </div>

                              <div 
                                className="cursor-pointer space-y-3 rounded-[1.5rem] border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10"
                                onClick={() => toast.success(`Opening email client for ${selectedAppointment.contact?.email}...`)}
                              >
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 sm:text-[11px] sm:tracking-[0.25em]">
                                  <Mail className="h-4 w-4 text-purple-400" />
                                  Email
                                </h3>
                                <p className="break-all text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                                  {selectedAppointment.contact.email}
                                </p>
                              </div>

                              <div 
                                className="cursor-pointer space-y-3 rounded-[1.5rem] border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10"
                                onClick={() => toast.success(`Opening ${selectedAppointment.contact?.website}...`)}
                              >
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 sm:text-[11px] sm:tracking-[0.25em]">
                                  <Globe className="h-4 w-4 text-emerald-400" />
                                  Website
                                </h3>
                                <p className="break-all text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                                  {selectedAppointment.contact.website}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm text-zinc-500">
                              No contact details available.
                            </div>
                          )}
                        </TabsContent>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:col-span-8 lg:space-y-7">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="flex min-h-[110px] flex-col items-center justify-center rounded-[1.5rem] border border-white/5 bg-white/5 p-5 text-center sm:min-h-[120px]">
                        <Calendar className="mb-3 h-5 w-5 text-blue-400" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">
                          {selectedAppointment.date}
                        </span>
                        <span className="mt-1 text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                          Scheduled Date
                        </span>
                      </div>

                      <div className="flex min-h-[110px] flex-col items-center justify-center rounded-[1.5rem] border border-white/5 bg-white/5 p-5 text-center sm:min-h-[120px]">
                        <Clock className="mb-3 h-5 w-5 text-emerald-400" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">
                          {selectedAppointment.time}
                        </span>
                        <div className="mt-1 flex flex-col items-center">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                            Local Time
                          </span>
                          <Dialog>
                            <DialogTrigger>
                              <Button variant="link" className="h-auto p-0 text-[8px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300">
                                Set Reminder
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2rem] border-white/10 bg-[#0a0a0a] p-8 text-white">
                              <DialogHeader>
                                <DialogTitle className="serif text-xl font-black uppercase italic tracking-tighter">
                                  Set Appointment Reminder
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                  Choose when you'd like to be notified
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-3 py-6">
                                {[
                                  "15 Minutes Before",
                                  "1 Hour Before",
                                  "2 Hours Before",
                                  "1 Day Before",
                                ].map((time) => (
                                  <Button
                                    key={time}
                                    variant="outline"
                                    onClick={() => {
                                      toast.success(`Reminder set for ${time}`);
                                    }}
                                    className="h-14 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div className="flex min-h-[110px] flex-col items-center justify-center rounded-[1.5rem] border border-white/5 bg-white/5 p-5 text-center sm:min-h-[120px] sm:col-span-2 xl:col-span-1">
                        {selectedAppointment.type === "Video" ? (
                          <Video className="mb-3 h-5 w-5 text-purple-400" />
                        ) : selectedAppointment.type === "In-Person" ? (
                          <MapPin className="mb-3 h-5 w-5 text-red-400" />
                        ) : (
                          <MessageSquare className="mb-3 h-5 w-5 text-zinc-400" />
                        )}
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">
                          {selectedAppointment.type}
                        </span>
                        <span className="mt-1 text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                          Consultation
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      <div className="rounded-[1.5rem] border border-white/5 bg-white/5 p-5 xl:col-span-1">
                        <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                          <ShieldCheck className="h-4 w-4 text-blue-400" />
                          Insurance
                        </h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                          {selectedAppointment.insuranceAccepted ? "Accepted / On File" : "Out of Network"}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-white/5 bg-white/5 p-5 xl:col-span-1">
                        <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                          <Building2 className="h-4 w-4 text-purple-400" />
                          Care Setting
                        </h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                          {selectedAppointment.type === "In-Person" ? "Clinic Visit" : "Remote Consultation"}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-white/5 bg-white/5 p-5 xl:col-span-1">
                        <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                          <ClipboardList className="h-4 w-4 text-emerald-400" />
                          Status
                        </h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                          Ready for Pre-Visit Review
                        </p>
                      </div>
                    </div>

                    {selectedAppointment.requirements && (
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                          <Info className="h-4 w-4 text-blue-400" />
                          Pre-Visit Requirements
                        </h3>
                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                          {selectedAppointment.requirements.map((req, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                                <CheckCircle2 className="h-3 w-3" />
                              </div>
                              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-300">
                                {req}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedAppointment.requestedData && (
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                          <FileText className="h-4 w-4 text-purple-400" />
                          Requested Biomarkers & Data
                        </h3>

                        {selectedAppointment.requestedData.map((data, i) => (
                          <div key={i} className="space-y-5 rounded-[2rem] border border-white/5 bg-white/5 p-5 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400">
                                  {data.type === "file" ? (
                                    <FileText className="h-6 w-6" />
                                  ) : data.type === "photo" ? (
                                    <Activity className="h-6 w-6" />
                                  ) : (
                                    <Video className="h-6 w-6" />
                                  )}
                                </div>

                                <div>
                                  <h4 className="mb-1 text-[13px] font-black uppercase tracking-widest text-white">
                                    {data.label}
                                  </h4>
                                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-500">
                                    {data.description}
                                  </p>
                                </div>
                              </div>

                              <Badge className="self-start border-white/10 bg-white/5 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                                {data.type}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                              <Button
                                onClick={() => {
                                  setUploadTarget({ label: data.label, type: data.type });
                                  setIsUploadOpen(true);
                                }}
                                className="h-12 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                              >
                                Upload {data.type}
                              </Button>

                              <Button
                                onClick={() => toast.success(`Access granted to ${data.label} from Health Data Bank`)}
                                className="h-12 rounded-xl border border-blue-600/20 bg-blue-600/10 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600/20"
                              >
                                Grant Data Bank Access
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      {selectedAppointment.checkInInstructions && (
                        <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 sm:text-[11px] sm:tracking-[0.25em]">
                            <Zap className="h-4 w-4 text-amber-400" />
                            Check-in
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-400">
                            {selectedAppointment.checkInInstructions}
                          </p>
                        </div>
                      )}

                      {selectedAppointment.location && (
                        <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 sm:text-[11px] sm:tracking-[0.25em]">
                            <MapPin className="h-4 w-4 text-red-400" />
                            Location
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-400">
                            {selectedAppointment.location}
                          </p>
                        </div>
                      )}
                    </div>

                    {(selectedAppointment.accommodation || selectedAppointment.parkingInfo) && (
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {selectedAppointment.accommodation && (
                          <div className="flex flex-col gap-4 rounded-[2rem] border border-emerald-500/10 bg-emerald-600/5 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                              <Globe className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                              <h3 className="mb-1 text-base font-black uppercase tracking-widest text-white">
                                Accommodation: {selectedAppointment.accommodation.type}
                              </h3>
                              <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-emerald-400/70">
                                {selectedAppointment.accommodation.details}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedAppointment.parkingInfo && (
                          <div className="flex flex-col gap-4 rounded-[2rem] border border-amber-500/10 bg-amber-500/5 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                              <Car className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                              <h3 className="mb-1 text-base font-black uppercase tracking-widest text-white">
                                Parking & Arrival
                              </h3>
                              <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-amber-400/80">
                                {selectedAppointment.parkingInfo}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px] sm:tracking-[0.25em]">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                        Suggested Questions for This Visit
                      </h3>
                      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {[
                          "Which trends in my labs or wearable data matter most right now?",
                          "What should I change before the next visit to improve outcomes?",
                          "Are there additional tests or biomarkers you recommend tracking?",
                          "How do my supplements, sleep, or stress levels affect this plan?",
                        ].map((q, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              setAiContext(`Patient is asking: "${q}" regarding appointment with ${selectedAppointment.doctorName}`);
                              setAiInitialMessage(`I'd like to discuss this question: "${q}". Can you help me understand how to approach this with Dr. ${selectedAppointment.doctorName.split(' ').pop()}?`);
                              setIsAIOpen(true);
                            }}
                            className="cursor-pointer rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-zinc-300">
                              {q}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 bg-[#050505]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button
                      onClick={() => setIsRescheduleOpen(true)}
                      className="h-12 rounded-2xl border border-white/10 bg-white/5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10"
                    >
                      Reschedule
                    </Button>

                    <Button
                      onClick={() => openAIForAppointment(selectedAppointment)}
                      className="h-12 rounded-2xl border border-blue-600/20 bg-blue-600/10 text-[11px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600/20"
                    >
                      AI Health Assistant
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      className="h-12 rounded-2xl border-red-500/20 bg-red-500/5 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10"
                      onClick={() => {
                        toast.error("Appointment cancellation requested. A coordinator will contact you shortly.");
                        setIsDetailsOpen(false);
                      }}
                    >
                      Cancel Appointment
                    </Button>

                    {selectedAppointment.type === "Video" && (
                      <Button 
                        onClick={() => toast.success("Connecting to secure consultation room...")}
                        className="h-12 rounded-2xl bg-blue-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                      >
                        Join Consultation
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="rounded-[2rem] border-white/10 bg-[#0a0a0a] p-8 text-white">
          <DialogHeader>
            <DialogTitle className="serif text-xl font-black uppercase italic tracking-tighter">
              Reschedule Appointment
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Choose a new date and time
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input placeholder="New date" className="border-white/10 bg-white/5 text-white" />
            <Input placeholder="New time" className="border-white/10 bg-white/5 text-white" />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              onClick={() => {
                toast.success("Reschedule request sent to Dr. " + selectedAppointment?.doctorName.split(' ').pop());
                setIsRescheduleOpen(false);
              }}
              className="h-12 w-full rounded-2xl bg-white text-[11px] font-black uppercase tracking-widest text-black hover:bg-zinc-200"
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="rounded-[2rem] border-white/10 bg-[#0a0a0a] p-8 text-white">
          <DialogHeader>
            <DialogTitle className="serif text-xl font-black uppercase italic tracking-tighter">
              Upload {uploadTarget?.label ?? "Requested Data"}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Add your file, image, or video before the visit
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              type="file"
              className="border-white/10 bg-white/5 text-white file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              onClick={() => {
                toast.success(`${uploadTarget?.label ?? "File"} uploaded successfully`);
                setIsUploadOpen(false);
              }}
              className="h-12 w-full rounded-2xl bg-white text-[11px] font-black uppercase tracking-widest text-black hover:bg-zinc-200"
            >
              Complete Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isMinimized && selectedAppointment && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 px-4"
          >
            <button
              onClick={() => setIsMinimized(false)}
              className="group flex w-full min-w-[280px] max-w-[92vw] items-center gap-4 rounded-full border border-white/10 bg-black/80 px-5 py-4 shadow-2xl backdrop-blur-2xl transition-all hover:bg-white/5 sm:min-w-[420px] sm:gap-6 sm:px-8"
            >
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10">
                <img src={selectedAppointment.image} alt="" className="h-full w-full object-cover" />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[10px] font-black uppercase tracking-widest text-white">
                  {selectedAppointment.doctorName}
                </p>
                <p className="truncate text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                  Appointment Details (Minimized)
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 transition-transform group-hover:scale-110">
                <ExternalLink className="h-4 w-4" />
              </div>

              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-zinc-500 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailsOpen(false);
                  setIsMinimized(false);
                }}
              >
                <Plus className="h-4 w-4 rotate-45" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAgentPopup
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        initialMessage={aiInitialMessage}
        context={aiContext}
      />
    </div>
  );
}