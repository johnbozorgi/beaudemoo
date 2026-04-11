import React, { createContext, useContext, useState, ReactNode } from "react";

export type DashboardContextType = "individual" | "family";

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  isInvited?: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  type: "health";
}

interface DashboardContextValue {
  activeContext: DashboardContextType;
  setActiveContext: (context: DashboardContextType) => void;
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  inviteCode: string;
  gender: "Male" | "Female" | "Other" | null;
  setGender: (gender: "Male" | "Female" | "Other" | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  hasFamily: boolean;
  setHasFamily: (hasFamily: boolean) => void;
  agentName: string;
  setAgentName: (name: string) => void;
  agentVoice: "Male" | "Female";
  setAgentVoice: (voice: "Male" | "Female") => void;
  agentAvatar: string | null;
  setAgentAvatar: (avatar: string | null) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeContext, setActiveContext] = useState<DashboardContextType>("individual");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem("is_logged_in") === "true");
  const [hasFamily, setHasFamily] = useState<boolean>(localStorage.getItem("has_family") === "true");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | null>(
    (localStorage.getItem("user_gender") as any) || null
  );

  const handleSetGender = (newGender: "Male" | "Female" | "Other" | null) => {
    setGender(newGender);
    if (newGender) {
      localStorage.setItem("user_gender", newGender);
    } else {
      localStorage.removeItem("user_gender");
    }
  };

  const handleSetIsLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      localStorage.setItem("is_logged_in", "true");
    } else {
      localStorage.removeItem("is_logged_in");
    }
  };

  const handleSetHasFamily = (hasFam: boolean) => {
    setHasFamily(hasFam);
    if (hasFam) {
      localStorage.setItem("has_family", "true");
    } else {
      localStorage.removeItem("has_family");
    }
  };

  const [agentName, setAgentName] = useState<string>(localStorage.getItem("health_agent_name") || "BeauGene AI");
  const [agentVoice, setAgentVoice] = useState<"Male" | "Female">((localStorage.getItem("agent_voice") as any) || "Female");
  const [agentAvatar, setAgentAvatar] = useState<string | null>(localStorage.getItem("agent_avatar") || null);
  const [theme, setTheme] = useState<"light" | "dark">((localStorage.getItem("app_theme") as any) || "dark");

  const handleSetTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("app_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize theme on mount
  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleSetAgentName = (name: string) => {
    setAgentName(name);
    localStorage.setItem("health_agent_name", name);
    window.dispatchEvent(new Event("agent_name_changed"));
  };

  const handleSetAgentVoice = (voice: "Male" | "Female") => {
    setAgentVoice(voice);
    localStorage.setItem("agent_voice", voice);
    window.dispatchEvent(new Event("voice_setting_changed"));
  };

  const handleSetAgentAvatar = (avatar: string | null) => {
    setAgentAvatar(avatar);
    if (avatar) {
      localStorage.setItem("agent_avatar", avatar);
    } else {
      localStorage.removeItem("agent_avatar");
    }
    window.dispatchEvent(new Event("agent_avatar_changed"));
  };

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "Me", role: "Self" },
    { id: "2", name: "Sarah", role: "Spouse", isInvited: true },
    { id: "3", name: "Leo", role: "Son", isInvited: true },
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", title: "Add Health Data", time: "09:00 AM", type: "health" },
  ]);

  const inviteCode = "HEALTH-2026-XYZ";

  return (
    <DashboardContext.Provider value={{ 
      activeContext, 
      setActiveContext, 
      familyMembers, 
      setFamilyMembers, 
      reminders, 
      setReminders,
      inviteCode,
      gender,
      setGender: handleSetGender,
      isLoggedIn,
      setIsLoggedIn: handleSetIsLoggedIn,
      hasFamily,
      setHasFamily: handleSetHasFamily,
      agentName,
      setAgentName: handleSetAgentName,
      agentVoice,
      setAgentVoice: handleSetAgentVoice,
      agentAvatar,
      setAgentAvatar: handleSetAgentAvatar,
      theme,
      setTheme: handleSetTheme
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
