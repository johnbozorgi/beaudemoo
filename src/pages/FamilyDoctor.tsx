import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  Sparkles, 
  Star, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Info, 
  ChevronRight, 
  Search,
  Plus,
  Stethoscope,
  Users,
  Lock,
  Unlock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashboardContext";
import { useNotifications } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "motion/react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  requestedData: string[];
  availability: string[];
  isFamilyDoctor?: boolean;
  dataAccess?: boolean;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'telehealth' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed';
  sharedData: string[];
  familyMember?: string;
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Sarah Jenkins",
    specialty: "Family Physician",
    rating: 4.9,
    reviews: 124,
    image: "https://picsum.photos/seed/doc1/200/200",
    requestedData: ["Heart Rate", "Blood Pressure", "ECG History", "Genetic Markers"],
    availability: ["09:00 AM", "10:00 AM", "02:00 PM", "04:00 PM"],
    isFamilyDoctor: true,
    dataAccess: true
  },
  {
    id: "doc2",
    name: "Dr. Michael Chen",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 89,
    image: "https://picsum.photos/seed/doc2/200/200",
    requestedData: ["Growth Charts", "Vaccination Records", "Allergies"],
    availability: ["11:00 AM", "01:00 PM", "03:00 PM"],
    isFamilyDoctor: true,
    dataAccess: false
  }
];

const HEALTH_DATA_OPTIONS = [
  "Heart Rate", "Blood Pressure", "ECG History", "Genetic Markers", 
  "Skin Photos", "Family History", "Allergies", "Recent Lab Results", 
  "Current Medications", "Sleep Data", "Activity Levels", "DNA Profile"
];

export default function FamilyDoctor() {
  const { activeContext } = useDashboard();
  const { addNotification } = useNotifications();
  const [familyDoctors, setFamilyDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "app1",
      doctorId: "doc1",
      doctorName: "Dr. Sarah Jenkins",
      specialty: "Annual Family Checkup",
      date: "Nov 12",
      time: "10:00 AM",
      type: 'in-person',
      status: 'confirmed',
      sharedData: ["Heart Rate", "Blood Pressure"],
      familyMember: "All Family"
    }
  ]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sharedData, setSharedData] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState("All Family");

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedTime || !selectedDate) return;

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTime,
      type: 'telehealth',
      status: 'pending',
      sharedData: sharedData,
      familyMember: selectedMember
    };

    setAppointments([newAppointment, ...appointments]);
    addNotification({
      title: "Appointment Scheduled",
      message: `Visit with ${newAppointment.doctorName} for ${selectedMember} has been requested.`,
      type: "success"
    });
    setIsBookingOpen(false);
  };

  const toggleDataAccess = (doctorId: string) => {
    setFamilyDoctors(prev => prev.map(doc => 
      doc.id === doctorId ? { ...doc, dataAccess: !doc.dataAccess } : doc
    ));
    const doc = familyDoctors.find(d => d.id === doctorId);
    addNotification({
      title: doc?.dataAccess ? "Access Revoked" : "Access Granted",
      message: `${doc?.name} ${doc?.dataAccess ? 'no longer has' : 'now has'} access to family health data.`,
      type: doc?.dataAccess ? "info" : "success"
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Family Care</h2>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic serif">Family Doctor</h1>
          <p className="text-zinc-500 mt-2 text-sm">Manage your family's primary care providers and health data access.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={() => setIsAddDoctorOpen(true)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl px-6"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Family Doctor
          </Button>
          <Button 
            onClick={() => setIsBookingOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
          >
            <CalendarIcon className="h-4 w-4 mr-2" /> Schedule Visit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Family Doctors List */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-blue-500" /> Your Family Doctors
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {familyDoctors.map((doc) => (
                <Card key={doc.id} className="bg-black/40 border-white/5 hover:border-white/10 transition-all overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img src={doc.image} alt={doc.name} className="h-16 w-16 rounded-2xl object-cover border border-white/10" />
                          <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center border-2 border-black">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white tracking-tight">{doc.name}</h4>
                          <p className="text-sm text-zinc-500">{doc.specialty}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                              <Star className="h-3 w-3 fill-current mr-1" /> {doc.rating}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                              {doc.reviews} Reviews
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => toggleDataAccess(doc.id)}
                          className={cn(
                            "rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-widest px-4",
                            doc.dataAccess ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-zinc-400"
                          )}
                        >
                          {doc.dataAccess ? <Unlock className="h-3.5 w-3.5 mr-2" /> : <Lock className="h-3.5 w-3.5 mr-2" />}
                          {doc.dataAccess ? "Data Access: On" : "Grant Access"}
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-widest px-4 bg-white/5 text-white"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Appointments List */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-purple-500" /> Upcoming Appointments
            </h3>
            <div className="space-y-4">
              {appointments.map((app) => (
                <Card key={app.id} className="bg-black/40 border-white/5 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/10">
                          <span className="text-[9px] font-black text-zinc-500 uppercase">{app.date.split(' ')[0]}</span>
                          <span className="text-xl font-black text-white">{app.date.split(' ')[1]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-base font-bold text-white">{app.doctorName}</h4>
                            <Badge className="bg-blue-600/10 text-blue-400 border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
                              {app.familyMember}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-500 mt-0.5">{app.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {app.time}</span>
                            <span className="flex items-center gap-1.5">
                              {app.type === 'telehealth' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                              {app.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-widest bg-white/5 text-zinc-400">
                          Reschedule
                        </Button>
                        <Button className="rounded-xl bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-6">
                          {app.type === 'telehealth' ? 'Join Call' : 'Directions'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Data Access Summary */}
          <Card className="bg-blue-600/5 border-blue-500/10 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6">
              <Shield className="h-12 w-12 text-blue-500/20" />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-400">Data Governance</CardTitle>
              <CardDescription className="text-zinc-500">Family health data sharing status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Active Shares</span>
                </div>
                <span className="text-sm font-black text-blue-500">2 Doctors</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Encrypted Vault</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
              </div>
              <p className="text-[9px] text-zinc-600 leading-relaxed uppercase font-bold tracking-widest">
                Your family's health data is protected by end-to-end encryption. Only authorized providers can view specific telemetry.
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-black/40 border-white/5 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                <Plus className="h-3.5 w-3.5 mr-3" /> Request Records
              </Button>
              <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                <Users className="h-3.5 w-3.5 mr-3" /> Add Family Member
              </Button>
              <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                <Info className="h-3.5 w-3.5 mr-3" /> Insurance Info
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic serif">Schedule Family Visit</DialogTitle>
            <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">Book a session with your family doctor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Select Family Member</Label>
              <div className="grid grid-cols-2 gap-2">
                {["All Family", "David H.", "Sarah H.", "Bella (Pet)"].map(member => (
                  <Button
                    key={member}
                    variant={selectedMember === member ? "default" : "outline"}
                    onClick={() => setSelectedMember(member)}
                    className={cn(
                      "rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-widest",
                      selectedMember === member ? "bg-blue-600" : "bg-white/5"
                    )}
                  >
                    {member}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Select Doctor</Label>
              <div className="space-y-2">
                {familyDoctors.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-2xl border transition-all",
                      selectedDoctor?.id === doc.id ? "bg-blue-600/10 border-blue-500/50" : "bg-white/5 border-white/5 hover:border-white/10"
                    )}
                  >
                    <img src={doc.image} alt={doc.name} className="h-10 w-10 rounded-xl object-cover" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">{doc.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{doc.specialty}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</Label>
                <Input type="date" className="bg-white/5 border-white/10 rounded-xl text-xs" onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Time</Label>
                <Input type="time" className="bg-white/5 border-white/10 rounded-xl text-xs" onChange={(e) => setSelectedTime(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleBookAppointment} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 font-black uppercase tracking-widest italic serif">
              Confirm Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Doctor Dialog */}
      <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic serif">Add Family Doctor</DialogTitle>
            <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">Connect a new provider to your family network.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Doctor's Full Name</Label>
              <Input placeholder="e.g. Dr. John Smith" className="bg-white/5 border-white/10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Specialty</Label>
              <Input placeholder="e.g. Cardiologist" className="bg-white/5 border-white/10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Clinic / Hospital</Label>
              <Input placeholder="e.g. Mayo Clinic" className="bg-white/5 border-white/10 rounded-xl" />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="grant-access" className="border-white/20 data-[state=checked]:bg-blue-600" />
              <label htmlFor="grant-access" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 cursor-pointer">
                Grant immediate access to family health data
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setIsAddDoctorOpen(false);
              addNotification({ title: "Doctor Added", message: "New family doctor has been successfully integrated.", type: "success" });
            }} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 font-black uppercase tracking-widest italic serif">
              Add Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
