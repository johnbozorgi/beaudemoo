import React, { createContext, useContext, useState, useEffect } from "react";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  specialty?: string;
  status: "Active" | "Follow-up" | "Critical" | "Waiting for Data";
  healthScore: number;
  lastVisit: string;
  nextAppointment?: string;
  biomarkers: BiomarkerData[];
  medications: Medication[];
  notes: ClinicalNote[];
  requests: DataRequest[];
  goals: HealthGoal[];
}

export interface BiomarkerData {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  status: "Normal" | "Warning" | "Critical";
  trend: "up" | "down" | "stable";
  category: string;
  lastTested?: string;
  range?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  adherence: number; // 0-100
  sideEffects?: string[];
  lastTaken?: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  author: string;
  content: string;
  type: "Visit Summary" | "Internal Note" | "Action Plan";
  isVisibleToPatient: boolean;
}

export interface DataRequest {
  id: string;
  type: "Lab Results" | "Wearable Data" | "Historical Records";
  status: "Pending" | "Approved" | "Denied";
  date: string;
  description: string;
}

export interface HealthGoal {
  id: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  deadline: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: "In-person" | "Virtual";
  status: "Upcoming" | "Completed" | "Cancelled" | "Rescheduled" | "Pending Approval";
  reason: string;
}

interface DoctorProfile {
  name: string;
  specialty: string;
  clinic: string;
  license: string;
  email: string;
  phone: string;
  isVerified: boolean;
}

interface DoctorContextType {
  doctor: DoctorProfile | null;
  setDoctor: (doctor: DoctorProfile | null) => void;
  patients: Patient[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  addPatientNote: (patientId: string, note: ClinicalNote) => void;
  requestData: (patientId: string, request: Omit<DataRequest, "id" | "status" | "date">) => void;
  requestBiomarker: (patientId: string, biomarker: string, reason: string) => void;
  updateMedication: (patientId: string, medicationId: string, updates: Partial<Medication>) => void;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (profile: DoctorProfile) => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Initialize with mock data
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: "p1",
        name: "John Doe",
        age: 45,
        gender: "Male",
        status: "Active",
        healthScore: 82,
        lastVisit: "2024-03-15",
        nextAppointment: "2024-04-10",
        biomarkers: [
          { id: "b1", name: "Glucose", value: 110, unit: "mg/dL", status: "Warning", trend: "up", category: "Metabolic" },
          { id: "b2", name: "HbA1c", value: 5.8, unit: "%", status: "Normal", trend: "stable", category: "Metabolic" },
          { id: "b3", name: "Blood Pressure", value: 135, unit: "mmHg", status: "Warning", trend: "up", category: "Cardiovascular" }
        ],
        medications: [
          { id: "m1", name: "Metformin", dosage: "500mg", frequency: "Twice daily", adherence: 95 },
          { id: "m2", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", adherence: 88 }
        ],
        notes: [
          { id: "n1", date: "2024-03-15", author: "Dr. Richards", content: "Patient reporting mild fatigue. Blood pressure slightly elevated.", type: "Visit Summary", isVisibleToPatient: true }
        ],
        requests: [
          { id: "r1", type: "Lab Results", status: "Approved", date: "2024-03-10", description: "Recent lipid panel" }
        ],
        goals: [
          { id: "g1", title: "Reduce HbA1c", target: "< 5.7%", current: "5.8%", progress: 80, deadline: "2024-06-01" }
        ]
      },
      {
        id: "p2",
        name: "Jane Wilson",
        age: 38,
        gender: "Female",
        status: "Follow-up",
        healthScore: 94,
        lastVisit: "2024-03-20",
        biomarkers: [
          { id: "b4", name: "Vitamin D", value: 42, unit: "ng/mL", status: "Normal", trend: "up", category: "Nutritional" }
        ],
        medications: [],
        notes: [],
        requests: [],
        goals: []
      },
      {
        id: "p3",
        name: "Robert Smith",
        age: 62,
        gender: "Male",
        status: "Critical",
        healthScore: 65,
        lastVisit: "2024-03-28",
        biomarkers: [
          { id: "b5", name: "LDL Cholesterol", value: 160, unit: "mg/dL", status: "Critical", trend: "up", category: "Lipids" }
        ],
        medications: [
          { id: "m3", name: "Atorvastatin", dosage: "40mg", frequency: "Once daily", adherence: 60, sideEffects: ["Muscle pain"] }
        ],
        notes: [],
        requests: [],
        goals: []
      }
    ];

    const mockAppointments: Appointment[] = [
      { id: "a1", patientId: "p1", patientName: "John Doe", date: "2024-04-10", time: "09:00 AM", type: "In-person", status: "Upcoming", reason: "Follow-up on BP" },
      { id: "a2", patientId: "p2", patientName: "Jane Wilson", date: "2024-04-10", time: "11:30 AM", type: "Virtual", status: "Upcoming", reason: "Nutrition consult" },
      { id: "a3", patientId: "p3", patientName: "Robert Smith", date: "2024-04-11", time: "02:00 PM", type: "In-person", status: "Pending Approval", reason: "Urgent lipid review" }
    ];

    setPatients(mockPatients);
    setAppointments(mockAppointments);
  }, []);

  const login = async (email: string, pass: string) => {
    // Mock login
    setIsLoggedIn(true);
    setDoctor({
      name: "Dr. Alexander Richards",
      specialty: "Internal Medicine & Genomics",
      clinic: "BeauGene Advanced Health Center",
      license: "MD-99283-X",
      email: email,
      phone: "+1 (555) 900-1000",
      isVerified: true
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setDoctor(null);
  };

  const signup = async (profile: DoctorProfile) => {
    setDoctor(profile);
    setIsLoggedIn(true);
  };

  const addPatientNote = (patientId: string, note: ClinicalNote) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, notes: [note, ...p.notes] } : p
    ));
  };

  const requestData = (patientId: string, request: Omit<DataRequest, "id" | "status" | "date">) => {
    const newRequest: DataRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, requests: [newRequest, ...p.requests] } : p
    ));
  };

  const requestBiomarker = (patientId: string, biomarker: string, reason: string) => {
    // In a real app, this would create a specific biomarker request entity
    console.log(`Requesting biomarker ${biomarker} for patient ${patientId} because: ${reason}`);
  };

  const updateMedication = (patientId: string, medicationId: string, updates: Partial<Medication>) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { 
        ...p, 
        medications: p.medications.map(m => m.id === medicationId ? { ...m, ...updates } : m) 
      } : p
    ));
  };

  return (
    <DoctorContext.Provider value={{ 
      doctor, setDoctor, patients, appointments, setAppointments,
      addPatientNote, requestData, requestBiomarker, updateMedication,
      isLoggedIn, login, logout, signup
    }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
};
