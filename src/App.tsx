/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardProvider } from "./context/DashboardContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "@/components/ui/sonner";
import MainLayout from "./layouts/MainLayout";
import Onboarding from "./pages/Onboarding";
import DashboardHub from "./pages/DashboardHub";
import IndividualDashboard from "./pages/IndividualDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import DigitalTwin from "./pages/DigitalTwin";
import Reports from "./pages/Reports";
import HealthGoals from "./pages/HealthGoals";
import DataBank from "./pages/DataBank";
import Family from "./pages/Family";
import DoctorsAppointments from "./pages/DoctorsAppointments";
import PersonalizedLife from "./pages/PersonalizedLife";
import Marketplace from "./pages/Marketplace";
import Research from "./pages/Research";
import Location from "./pages/Location";
import Settings from "./pages/Settings";
import ProviderDashboard from "./pages/ProviderDashboard";
import HealthAiAgent from "./pages/HealthAiAgent";
import GenderHealth from "./pages/GenderHealth";
import Notifications from "./pages/Notifications";
import Providers from "./pages/Providers";
import ProfileSettings from "./pages/ProfileSettings";
import HealthInsurance from "./pages/HealthInsurance";

import ResearchArticles from "./pages/ResearchArticles";
import FamilyDoctor from "./pages/FamilyDoctor";
import FamilyHealthAiAgent from "./pages/FamilyHealthAiAgent";
import FamilyHealthData from "./pages/FamilyHealthData";
import FamilyGoals from "./pages/FamilyGoals";
import FamilyReports from "./pages/FamilyReports";
import FamilyArticles from "./pages/FamilyArticles";

export default function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <NotificationProvider>
          <Toaster theme="dark" />
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
            
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardHub />} />
              <Route path="/individual-dashboard" element={<IndividualDashboard />} />
              <Route path="/family-dashboard" element={<FamilyDashboard />} />
              <Route path="/digital-twin" element={<DigitalTwin />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/health-goals" element={<HealthGoals />} />
              <Route path="/data-bank" element={<DataBank />} />
              <Route path="/family" element={<Family />} />
              <Route path="/appointments" element={<DoctorsAppointments />} />
              <Route path="/family-doctor" element={<FamilyDoctor />} />
              <Route path="/family-health-data" element={<FamilyHealthData />} />
              <Route path="/family-goals" element={<FamilyGoals />} />
              <Route path="/family-reports" element={<FamilyReports />} />
              <Route path="/family-articles" element={<FamilyArticles />} />
              <Route path="/personalized-life" element={<PersonalizedLife />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/research" element={<Research />} />
              <Route path="/articles" element={<ResearchArticles />} />
              <Route path="/location" element={<Location />} />
              <Route path="/health-ai" element={<HealthAiAgent />} />
              <Route path="/family-ai" element={<FamilyHealthAiAgent />} />
              <Route path="/gender-health" element={<GenderHealth />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/insurance" element={<HealthInsurance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
            </Route>
    
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </DashboardProvider>
    </BrowserRouter>
  );
}
